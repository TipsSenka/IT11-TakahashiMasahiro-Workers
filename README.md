# IT11-TakahashiMasahiro-Workers

Cloudflare PagesからCloudflare WorkersのJSON APIを呼び出すサンプルです。

## 構成

- `pages/index.html`: APIを呼び出してレスポンスを表示する静的画面
- `worker/src/index.js`: `/api`、`/api/course`、`/api/hello`、`/api/fortune`、`/api/events`を提供するWorker
- `worker/wrangler.toml`: Worker名とCORS許可オリジンの設定

## Workerのデプロイ

```powershell
Set-Location .\worker
npm install
npm.cmd run deploy
```

デプロイ後に表示されたWorkers URLを `pages/index.html` の `WORKER_BASE_URL` に設定してください。
本番では `worker/wrangler.toml` の `ALLOWED_ORIGINS` をPagesの公開URLへ変更してから再デプロイします。`compatibility_date` はCloudflareの現在日より未来にしないでください。

## 動作確認

```text
GET /api/course       200: コース情報
GET /api/hello?name=山田  200: 挨拶
GET /api/hello?name=     400: 入力エラー
GET /api/fortune       200: 運勢
GET /api/events        200: イベント一覧
GET /unknown           404: 未定義パス
```

Pagesはビルド不要の静的サイトとして、出力ディレクトリに `pages` を指定して公開できます。