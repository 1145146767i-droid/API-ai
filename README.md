# API-AI 🤖

统一的 GPT + DeepSeek + Claude + Qwen API 网关。

## 支持

- GPT：OpenAI API
- DeepSeek：DeepSeek API
- Claude：Anthropic Messages API
- Qwen：Alibaba Cloud Model Studio OpenAI-compatible API
- 一个统一的 `POST /api/chat` 接口
- 网页端支持四个 AI 家族，并可先选家族再选具体模型
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

ANTHROPIC_API_KEY=你的 Anthropic Key

DASHSCOPE_API_KEY=你的 DashScope Key
QWEN_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
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
## Claude / Qwen 说明

Claude 使用 Anthropic 官方 Messages API；Qwen 使用阿里云 Model Studio 的 OpenAI 兼容接口。Qwen 的 API Key 与 Base URL 必须属于同一地域，否则会出现鉴权错误。