# 🍳 AI 私厨管家

> 拍一张冰箱照片，AI 帮你识别食材、推荐食谱、想想今天吃什么。

基于 **LangChain + 多模态大模型** 的食谱推荐应用。用户拍摄自家冰箱或厨房的食物照片，管家会自动识别图片中的食材，根据食材联网搜索相关食谱推荐给用户，并按营养价值、制作难度智能排序；找不到合适食谱时，还会提供创意搭配建议。

## ✨ 核心功能

| # | 功能 | 说明 |
|---|------|------|
| 1 | 📷 图片识别 | 上传食材图片，自动识别其中的食材 |
| 2 | 🔍 智能搜索 | 根据识别出的食材联网搜索相关食谱（Tavily） |
| 3 | 📊 智能排序 | 按营养价值、制作难度对食谱进行排序 |
| 4 | 💡 创意建议 | 找不到合适食谱时，提供创意搭配建议 |
| 5 | 💬 对话交互 | 聊天式界面，支持图片上传 + 文本对话 |

## 🧱 技术栈

- **客户端**：Expo (React Native) + TypeScript，跨 iOS / Android
- **服务端**：Python + FastAPI + LangChain
- **多模态模型**：OpenAI 兼容协议，可对接 OpenAI / 通义千问 / 豆包 / DeepSeek / GLM 等
- **联网搜索**：Tavily（食谱检索）
- **包管理**：uv（服务端）/ pnpm（客户端）

## 📁 项目结构

```
smart-kitchen/
├── client/                      # 客户端: Expo (React Native) + TypeScript
│   ├── App.tsx                  # 入口
│   ├── app.json                 # Expo 配置 (含相机/相册权限)
│   ├── assets/                  # 应用图标
│   └── src/
│       ├── types.ts             # 类型定义 (与服务端 schemas.py 对齐)
│       ├── config.ts            # 服务端地址管理 (AsyncStorage 持久化)
│       ├── api/index.ts         # API 客户端 (超时/错误处理)
│       ├── theme/index.ts       # 暖橙厨房风主题
│       ├── hooks/               # useChat (消息/发送状态) / useSettings
│       └── components/           # 聊天 UI 全套组件
│           ├── ChatScreen           # 主界面: 顶栏 + 消息列表 + 输入栏
│           ├── MessageBubble        # 消息气泡 (用户/AI/错误/打字)
│           ├── RecipeCard           # 食谱卡片 (营养分/难度/用料/可展开步骤)
│           ├── IngredientChips      # 食材标签
│           ├── SuggestionList       # 创意建议列表
│           ├── InputBar             # 输入栏 (相机/相册/文本/发送)
│           ├── PendingImagePreview  # 待发送图片预览
│           ├── SettingsModal        # 设置页 (服务端地址 + 连接测试)
│           ├── WelcomeSection       # 空会话欢迎引导
│           └── TypingIndicator      # AI 打字动画
└── server/                      # 服务端: FastAPI + LangChain
    ├── main.py                  # 路由入口
    ├── config.py                # LLM / Tavily / 服务配置 (.env)
    ├── schemas.py               # Pydantic 数据模型
    ├── llm/client.py            # 基础工具: 视觉/对话模型客户端、多模态消息构建、JSON 解析
    ├── tools/
    │   ├── image_utils.py       # 基础工具: base64 解码、图片压缩、大小校验
    │   └── search.py            # 基础工具: Tavily 联网搜索
    ├── services/                # 业务编排
    │   ├── chat_service.py      # 对话编排 (已实现): 识别→搜索→排序/创意→回复
    │   ├── vision_service.py    # 食材识别 (TODO 占位)
    │   ├── recipe_service.py    # 食谱搜索 + 智能排序 (TODO 占位)
    │   └── creative_service.py  # 创意建议 (TODO 占位)
    └── pyproject.toml           # uv 项目配置
```

## 🚀 快速开始

### 1. 服务端

```bash
cd server

# 复制环境变量模板并填写
cp .env.example .env
# 编辑 .env, 填入 LLM_API_KEY、TAVILY_API_KEY 等

# 安装依赖 (使用 uv)
uv sync

# 启动开发服务器
uv run uvicorn main:app --reload --port 8000
```

启动后访问 `http://localhost:8000/docs` 查看交互式 API 文档。

> 📌 核心服务逻辑（食材识别 / 食谱搜索 / 创意建议）当前为 `TODO` 占位，
> 未实现时对应接口返回 `501`。对话编排（`chat_service`）已完成，填好 TODO 即可跑通全流程。
> 详见 [占位实现指引](#-核心逻辑占位实现指引)。

### 2. 客户端

```bash
cd client

# 安装依赖
pnpm install

# 启动 Expo 开发服务器
pnpm start
```

按终端提示：
- 按 `i` 在 iOS 模拟器打开
- 按 `a` 在 Android 模拟器打开
- 或用 **Expo Go** App 扫描二维码，真机即扫即调试

> 真机调试时，在 App 右上角 ⚙️ 设置页把服务端地址改为电脑局域网 IP
> （如 `http://192.168.x.x:8000`），支持一键「测试连接」。

## ⚙️ 环境变量

服务端配置见 [server/.env.example](server/.env.example)：

| 变量 | 说明 | 示例 |
|------|------|------|
| `LLM_API_KEY` | 大模型 API Key | `sk-xxxx` |
| `LLM_BASE_URL` | OpenAI 兼容接口地址 | `https://api.openai.com/v1` |
| `VISION_MODEL` | 多模态视觉模型（食材识别） | `gpt-4o-mini` / `qwen-vl-max` |
| `CHAT_MODEL` | 对话模型（交互/创意） | `gpt-4o-mini` / `qwen-plus` |
| `TAVILY_API_KEY` | Tavily 联网搜索 Key（[获取](https://tavily.com)） | `tvly-xxxx` |
| `MAX_IMAGE_SIZE_MB` | 上传图片大小上限 | `8` |

## 📡 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/health` | 健康检查 |
| `POST` | `/api/v1/chat` | 对话交互：图片识别 + 食谱搜索 + 智能排序/创意建议，一次性返回结构化结果 |
| `POST` | `/api/v1/vision/recognize` | 独立的食材识别（multipart 上传图片） |
| `POST` | `/api/v1/recipes/search` | 根据食材搜索食谱 |
| `POST` | `/api/v1/recipes/rank` | 对食谱列表智能排序 |
| `POST` | `/api/v1/creative/suggest` | 创意搭配建议 |

请求 / 响应结构详见 `server/schemas.py` 或 Swagger 文档（`/docs`）。

## 🧩 核心逻辑占位实现指引

服务端三个核心服务以 `TODO(人工实现)` 标注，每个文件内都写明了可用的基础工具：

| 服务 | 文件 | 可用基础工具 |
|------|------|--------------|
| 食材识别 | [vision_service.py](server/services/vision_service.py) | `compress_image()` / `build_image_message()` / `get_vision_llm()` / `parse_json_output()` |
| 食谱搜索 + 排序 | [recipe_service.py](server/services/recipe_service.py) | `web_search()` / `get_chat_llm()` / `parse_json_output()` |
| 创意建议 | [creative_service.py](server/services/creative_service.py) | `get_chat_llm()` / 提示词模板 `CREATIVE_PROMPT` |

基础工具位于：
- [llm/client.py](server/llm/client.py) — LangChain 模型客户端、多模态消息构建、JSON 输出解析
- [tools/image_utils.py](server/tools/image_utils.py) — 图片解码 / 压缩 / 大小校验
- [tools/search.py](server/tools/search.py) — Tavily 联网搜索

对话编排（[chat_service.py](server/services/chat_service.py)）已完成，无需改动。

## 📄 文档

- [架构设计](docs/ARCHITECTURE.md) — 系统分层、数据流、核心流程
- [贡献指南](CONTRIBUTING.md) — 开发约定与提交规范

## 📜 许可证

[MIT License](LICENSE) © 2026 zhanghuaiwei
