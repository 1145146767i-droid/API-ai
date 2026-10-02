# API-AI 🤖

统一的 GPT + DeepSeek API 网关。

## 支持

- GPT：OpenAI API
- DeepSeek：DeepSeek API
- 一个统一的 `POST /api/chat` 接口
- `GET /api/models` 查看两个提供商是否已配置
- 网页端可以切换 GPT / DeepSeek
- API Key 只放服务器环境变量，不提交到 GitHub

## 部署

设置环境变量：

```text
OPENAI_API_KEY=你的 OpenAI Key
OPENAI_MODEL=gpt-6-luna

DEEPSEEK_API_KEY=你的 DeepSeek Key
DEEPSEEK_MODEL=deepseek-chat
```

然后：

```bash
npm start
```

## API

请求：

```json
POST /api/chat
{
  "provider":"openai",
  "messages":[
    {"role":"user","content":"你好"}
  ]
}
```

把 `provider` 改成 `deepseek` 就会调用 DeepSeek。

**注意：仓库中不要提交真实 API Key。**