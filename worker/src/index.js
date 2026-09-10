const allowedMethods = "GET, OPTIONS";

function getAllowedOrigin(request, env) {
  const origin = request.headers.get("Origin");
  const configuredOrigins = (env.ALLOWED_ORIGINS || "*").split(",").map((value) => value.trim());
  if (configuredOrigins.includes("*")) return "*";
  return configuredOrigins.includes(origin) ? origin : "null";
}

function corsHeaders(request, env) {
  return {
    "Access-Control-Allow-Origin": getAllowedOrigin(request, env),
    "Access-Control-Allow-Methods": allowedMethods,
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function jsonResponse(request, env, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(request, env) });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }
    if (request.method !== "GET") {
      return jsonResponse(request, env, { error: "Method Not Allowed" }, 405);
    }

    if (url.pathname === "/api") {
      return jsonResponse(request, env, { ok: true, message: "Cloudflare Workers API is running", version: "1.0.0" });
    }
    if (url.pathname === "/api/course") {
      return jsonResponse(request, env, {
        title: "Cloudflare Workers入門",
        description: "PagesとWorkersで作るJSON APIの基礎",
        topics: ["HTTPルーティング", "JSONレスポンス", "Pagesとの接続", "CORS"]
      });
    }
    if (url.pathname === "/api/hello") {
      const name = (url.searchParams.get("name") || "").trim();
      if (!name || name.length > 50) return jsonResponse(request, env, { error: "nameは1文字以上50文字以内で入力してください" }, 400);
      return jsonResponse(request, env, { message: `こんにちは、${name}さん！`, name });
    }
    if (url.pathname === "/api/fortune") {
      const fortunes = [
        { rank: "大吉", message: "新しいことを始めるのに良い日です。" },
        { rank: "中吉", message: "小さな進展を大切にすると流れが整います。" },
        { rank: "吉", message: "周りの人との会話にヒントがあります。" },
        { rank: "末吉", message: "焦らず準備を進めると成果につながります。" }
      ];
      return jsonResponse(request, env, { ...fortunes[new Date().getDate() % fortunes.length], date: new Date().toISOString().slice(0, 10) });
    }
    if (url.pathname === "/api/events") {
      return jsonResponse(request, env, {
        events: [
          { id: 1, title: "Workersハンズオン", date: "2026-10-03", place: "オンライン" },
          { id: 2, title: "Pages公開相談会", date: "2026-10-17", place: "オンライン" },
          { id: 3, title: "Cloudflare入門", date: "2026-11-07", place: "東京" }
        ]
      });
    }
    return jsonResponse(request, env, { error: "Not Found" }, 404);
  }
};