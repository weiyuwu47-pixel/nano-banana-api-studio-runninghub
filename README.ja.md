# Nano Banana API Studio for RunningHub

<p align="center"><img src="assets/studio.svg" width="240" alt="Banana Cam"></p>
<h3 align="center">テキストからの画像生成と参考画像の編集</h3>
<p align="center">RunningHub 経由で Nano Banana API を利用できます。縦横比と解像度を選び、生成結果をプレビューして元のサイズで保存できます。</p>
<p align="center"><a href="README.md">简体中文</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a></p>

---

## ローカルで起動

Node.js 22 以降が必要です。初回はプロジェクトのディレクトリで設定ファイルを作成します。

    cp .env.example .env

RunningHub の管理画面で取得したキーを .env の `RUNNINGHUB_API_KEY` に設定し、次のコマンドで起動します。

    node --env-file=.env server.mjs

http://127.0.0.1:8787 を開きます。画面の表示言語は中国語です。.env は公開せず、キーを変更したら再起動してください。モデルの利用には RunningHub アカウントの残高を使用します。

## RunningHub 経由で Nano Banana API に接続する

ブラウザはローカルサーバーにリクエストを送信します。 `server.mjs` が `Authorization: Bearer <API_KEY>` ヘッダーを付け、`https://www.runninghub.cn/openapi/v2/` 配下に POST します。

| 操作 | エンドポイント | リクエスト内容 |
|---|---|---|
| 画像生成 | `rhart-image-n-pro-official/text-to-image` | JSON: `prompt`, `resolution` (1k), `aspectRatio` (1:1) |
| 参考画像のアップロード | `media/upload/binary` | multipart/form-data: `file` |
| 画像編集 | `rhart-image-n-pro-official/edit` | `prompt`, `resolution`, `aspectRatio`, `imageUrls: [URL]` |
| 結果の取得 | `query` | JSON: `taskId` |

編集時は参考画像を先にアップロードし、取得した URL を `imageUrls` に指定します。送信後は返されたタスク ID で 3.5 秒ごとに状態を確認します。`SUCCESS` なら `results[0].url` を開いて保存できます。`FAILED` の場合はエラー内容を確認してください。待機がタイムアウトしてもリモートのタスクは続くため、再送信すると追加料金が発生する場合があります。

公式ドキュメント · [画像生成](https://www.runninghub.cn/runninghub-api-doc-en/api-448184534) · [画像編集](https://www.runninghub.ai/call-api/api-detail/2004544343584849921?activeTab=api)

参考にしたプロジェクト [NanoBanana Studio](https://github.com/amrrs/fal-nanobanana-studio).
