# API-AI 🤖

统一的 GPT + DeepSeek + Claude + Qwen + Gemini + GLM + 豆包 + Grok API 网关。

## 支持

- GPT：OpenAI API
- DeepSeek：DeepSeek API
- Claude：Anthropic Messages API
- Qwen：Alibaba Cloud Model Studio OpenAI-compatible API
- Gemini：Google Gemini API
- GLM：Z.ai API（OpenAI 兼容）
- 豆包：火山方舟 API
- Grok：xAI API
- 可选联网搜索：Gemini 使用 Google Search grounding；GPT / DeepSeek / Claude / Qwen 使用统一搜索适配器
- 一个统一的 `POST /api/chat` 接口
- 网页端支持四个 AI 家族，并可先选家族再选具体模型
- `GET /api/catalog` 查看四个提供商和模型是否已配置
- 网页端可以切换 GPT / DeepSeek / Claude / Qwen
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

GEMINI_API_KEY=你的 Gemini API Key

ZAI_API_KEY=你的 Z.ai Key
GLM_BASE_URL=https://api.z.ai/api/paas/v4

ARK_API_KEY=你的火山方舟 Key
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3

XAI_API_KEY=你的 xAI Key
XAI_BASE_URL=https://api.x.ai/v1

TAVILY_API_KEY=你的 Tavily API Key
TAVILY_BASE_URL=https://api.tavily.com/search
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

## 联网搜索

网页端勾选“联网搜索”后：

- Gemini 直接使用 Google Search grounding；Google 官方文档说明该工具可让 Gemini 访问实时网页并返回可验证来源。citeturn0search3
- GPT、DeepSeek、Claude、Qwen 通过 `TAVILY_API_KEY` 获取搜索结果，再把结果作为上下文交给对应模型。
- `/api/search` 可单独调用统一搜索接口。

## Gemini

Gemini API 使用 `GEMINI_API_KEY`。当前目录包含 Gemini 3.8 Flash、3.7 Flash、3.6 Flash、3.5 Flash、3.1 Pro 等 API 模型。Google 官方模型列表持续更新，因此建议定期刷新目录。citeturn1search0turn1search1

## DeepSeek

当前官方 API 主力为 `deepseek-flash`（DeepSeek-V4.1-Flash）和 `deepseek-v4-pro`（DeepSeek-V4-Pro）。旧的 `deepseek-v4-flash` 与 `deepseek-v4-flash-vision-exp` 仍可作为兼容名称使用，但官方说明它们已经下线并会路由到 V4.1-Flash。citeturn1search2turn1search3

## 新增 API

### GLM
使用 Z.ai 的 OpenAI 兼容 API。当前目录包含 GLM-5.3、GLM-5.3-Flash、GLM-5.2、GLM-5、GLM-4.7、GLM-4.7-Flash。Z.ai 文档给出的兼容 Base URL 为 `https://api.z.ai/api/paas/v4/`。citeturn1search3

### 豆包
使用火山方舟 API，默认 Base URL 为 `https://ark.cn-beijing.volces.com/api/v3`。官方文档示例展示了 `doubao-seed-2-1-pro-260628`，并提供 Chat Completions 接口。citeturn0search3turn0search4

### Grok
使用 xAI API，默认 Base URL 为 `https://api.x.ai/v1`。当前目录加入 Grok 4.7、4.6、4.20、4.1、4、3。xAI 官方文档显示 Grok 4.7 支持 Responses API 和 Chat Completions，并支持 Web Search、X Search、代码执行等工具。citeturn0search0turn0search1
