# Nano Banana API Studio for RunningHub

<p align="center"><img src="assets/studio.svg" width="240" alt="Banana Cam"></p>
<h3 align="center">Generate images and edit reference photos</h3>
<p align="center">Use the Nano Banana API through RunningHub. Choose an aspect ratio and resolution, preview the result, and save the original image.</p>
<p align="center"><a href="README.md">简体中文</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a></p>

---

## Run locally

Use Node.js 22 or later. From the project directory, copy the configuration template on first setup.

    cp .env.example .env

Set `RUNNINGHUB_API_KEY` in `.env` to your key from the RunningHub dashboard. Start the server with the command below.

    node --env-file=.env server.mjs

Open http://127.0.0.1:8787. The interface is in Chinese. Keep .env private and restart after changing the key. Requests use your RunningHub credits.

## Connect the Nano Banana API through RunningHub

The browser calls the local server. `server.mjs` sends POST requests to `https://www.runninghub.cn/openapi/v2/` with the header `Authorization: Bearer <API_KEY>`.

| Action | Endpoint | Body |
|---|---|---|
| Generate | `rhart-image-n-pro-official/text-to-image` | JSON: `prompt`, `resolution` (1k), `aspectRatio` (1:1) |
| Upload reference | `media/upload/binary` | multipart/form-data: `file` |
| Edit | `rhart-image-n-pro-official/edit` | `prompt`, `resolution`, `aspectRatio`, `imageUrls: [URL]` |
| Poll | `query` | JSON: `taskId` |

For edits, upload the reference first and pass its URL in `imageUrls`. After submission, the studio polls every 3.5 seconds using the returned task ID. On `SUCCESS`, open `results[0].url` to save the image. On `FAILED`, check the error message. A local timeout does not cancel a remote task. Submitting again may incur another charge.

API reference · [Generation](https://www.runninghub.cn/runninghub-api-doc-en/api-448184534) · [Editing](https://www.runninghub.ai/call-api/api-detail/2004544343584849921?activeTab=api)

Inspired by [NanoBanana Studio](https://github.com/amrrs/fal-nanobanana-studio).
