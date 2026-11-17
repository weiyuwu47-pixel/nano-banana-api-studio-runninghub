# Nano Banana API Studio for RunningHub

<p align="center"><img src="assets/studio.svg" width="240" alt="Banana Cam"></p>
<h3 align="center">用文字生成图片，也能编辑参考图</h3>
<p align="center">通过 RunningHub 调用 Nano Banana API。选择画幅和分辨率，预览 Nano Banana Pro 的结果，再保存原图。</p>
<p align="center"><a href="README.md">简体中文</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a></p>

---

## 本地启动
需要 Node.js 22 或更高版本，无需安装第三方包。在项目目录复制配置模板（已有 .env 可跳过）：
  
    cp .env.example .env

将 RunningHub 控制台创建的 API Key 填到 .env 中的 RUNNINGHUB_API_KEY= 后，保存后运行以下命令，再打开 http://127.0.0.1:8787 。

    node --env-file=.env server.mjs

更换密钥后重启服务。不要提交 .env。模型调用使用该账户的额度。

## 如何通过 RunningHub 接入 Nano Banana API
浏览器只请求本地服务。server.mjs 将操作映射到 https://www.runninghub.cn/openapi/v2/ 下的固定接口，并添加 Authorization: Bearer <API_KEY> 请求头。全部接口使用 POST。
  
| 操作 | 接口路径 | 请求内容 |
|---|---|---|
| 文生图 | rhart-image-n-pro-official/text-to-image | JSON：prompt、resolution（如 1k）、aspectRatio（如 1:1） |
| 上传参考图 | media/upload/binary | multipart/form-data，文件字段 file |
| 图像编辑 | rhart-image-n-pro-official/edit | 同文生图，增加 imageUrls 数组，传入上传得到的图片地址 |
| 查询任务 | query | JSON：taskId，取自生成或编辑接口的响应 |

提交成功不代表图片生成完毕。页面每 3.5 秒查询一次；SUCCESS 时读取 results[0].url，FAILED 时显示错误。超时不会取消远端任务，不要反复提交以免重复扣费。鉴权失败请检查密钥，余额不足请检查 RunningHub 账户。此服务仅监听本机，不提供多人账户管理。

官方参考：[文生图请求示例](https://www.runninghub.cn/runninghub-api-doc-en/api-448184534) · [图像编辑参数](https://www.runninghub.ai/call-api/api-detail/2004544343584849921?activeTab=api)

灵感来自 [NanoBanana Studio](https://github.com/amrrs/fal-nanobanana-studio)。
