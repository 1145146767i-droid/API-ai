# API-AI

## 🚀 多模型 API 聚合平台

API-AI 是一个面向开发者的**统一 AI API 聚合平台**：把不同厂商的模型接入同一个接口，同时提供一个可以直接聊天、上传文件、联网搜索和查看代码输出的 Web UI。

你只需要在服务器端配置各厂商 API Key，客户端就可以通过统一的 API-AI 接口访问多个 AI 模型。

### 🤖 已接入 AI 家族

- OpenAI / GPT
- DeepSeek
- Claude / Anthropic
- Qwen / 通义千问
- Gemini / Google
- GLM / Z.ai
- 豆包 / 火山方舟
- Grok / xAI
- Meta AI / Muse Spark
- Microsoft AI / Foundry / Azure OpenAI
- Kimi / Moonshot AI
- MiniMax
- 腾讯混元
- 百度文心 / 千帆
- 小米 MiMo
- 阶跃星辰 / StepFun

### ✨ 核心功能

#### 💬 统一多模型聊天

同一个界面选择：

`AI 家族 → 模型 → 对话`

也可以使用自定义模型 ID。

#### 📎 文件上传

支持在聊天中上传多个文本类文件，例如：

- TXT
- Markdown
- JSON
- CSV
- 源代码文件
- 其他可以直接读取为文本的文件

文件内容会自动加入当前请求上下文，模型可以根据文件内容进行分析、总结、修改和问答。

> 当前版本主要处理文本文件；PDF、Office、图片、音频、视频等原生文件解析属于后续扩展方向。

#### 🌐 智能联网搜索

提供三种模式：

- **自动**：根据问题判断是否需要搜索
- **始终开**：每次请求都尝试联网搜索
- **关闭**：完全不进行联网搜索

不同厂商会使用不同的搜索实现：Gemini 可使用 Google Search grounding，其他已接入模型通过统一搜索层提供搜索上下文。

#### 💻 Markdown 与代码块

模型输出支持 Markdown 基础渲染。

代码会自动识别 fenced code block，例如：

```python
print("Hello World")
```

并以代码区域显示，同时提供**一键复制代码**按钮。

#### 🔌 OpenAI-compatible 聚合 API

API-AI 不只是聊天网页，还提供统一网关：

```
GET  /v1/models
POST /v1/chat/completions
```

模型使用：

```
provider/model
```

例如：

```
deepseek/deepseek-v4-pro
grok/grok-4.7
mimo/mimo-v2.6-pro
stepfun/step-5-preview
```

因此支持 OpenAI-compatible API 的客户端可以逐步接入 API-AI，而不需要分别对接十几家厂商。

#### 🔐 API Key 与安全

各厂商 API Key 只配置在服务器环境变量中，不写入前端代码。

可使用：

`GATEWAY_API_KEY`

保护 API-AI 自己的统一网关。

### 🧩 API 架构

```
客户端 / Web UI / 第三方 AI 客户端
                │
                ▼
        ┌─────────────────┐
        │     API-AI      │
        │  Unified Gateway│
        └────────┬────────┘
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
   OpenAI     DeepSeek    Claude
      │          │          │
      ├──── Qwen / Gemini ──┤
      ├──── GLM / Doubao ───┤
      ├──── Grok / Meta ────┤
      ├──── Microsoft / Kimi┤
      ├──── MiniMax / 混元 ─┤
      └──── 文心 / MiMo / StepFun
```

### 📡 API 示例

```bash
curl https://你的域名/v1/chat/completions \
  -H "Authorization: Bearer $GATEWAY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok/grok-4.7",
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'
```

### ⚙️ 环境变量

每个厂商独立配置 API Key 和 Base URL，详见 `.env.example`。

目前还没有把任何真实 API Key 提交到仓库。

### 🚧 当前限制 / 后续方向

API-AI 目前已经具备多厂商聚合的基础架构，但仍在持续开发：

- SSE 流式输出
- PDF / DOCX / XLSX / PPTX 文件解析
- 图片、音频、视频输入
- 原生文件 API 适配
- 自动模型发现
- Token / 用量统计
- API Key 管理
- 限流与配额
- 自动故障转移
- 负载均衡
- 统一计费
- 更完整的 Responses API / Anthropic Messages API 兼容

## 📦 本地运行

```bash
npm install
node server.js
```

默认端口：

```
http://localhost:3000
```

## 🔒 安全提醒

不要把真实 API Key 提交到 GitHub。

推荐通过环境变量、部署平台 Secret 或服务器 Secret Manager 配置密钥。

## 📄 License

请以仓库中的 LICENSE 文件为准。
