# 架构设计

## 系统分层

```
┌─────────────────────────────────────────────┐
│  客户端 (Expo RN + TypeScript)               │
│  ├─ UI 层: ChatScreen / MessageBubble / ...  │
│  ├─ 状态层: useChat / useSettings (Hooks)    │
│  └─ 通信层: api/index.ts (HTTP)              │
└──────────────────┬──────────────────────────┘
                   │ JSON (text + base64 image)
┌──────────────────▼──────────────────────────┐
│  服务端 (FastAPI)                            │
│  ├─ 路由层: main.py                          │
│  ├─ 编排层: services/chat_service.py (已实现)│
│  ├─ 服务层: vision / recipe / creative (TODO)│
│  └─ 工具层: llm/client / image_utils / search│
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   多模态大模型           Tavily 联网搜索
  (食材识别/对话)          (食谱检索)
```

## 客户端架构

### 数据流

1. **用户输入**：`InputBar` 采集文本 + 图片（base64）
2. **状态管理**：`useChat` Hook 维护消息列表，调用 `api.sendChat()`
3. **服务端编排**：一次 `/chat` 请求返回结构化结果（回复 + 食材 + 食谱 + 创意建议）
4. **渲染**：`MessageBubble` 根据消息类型渲染不同区块（食材标签 / 食谱卡片 / 创意建议）

### 模块职责

| 模块 | 职责 |
|------|------|
| `types.ts` | 类型定义，与服务端 `schemas.py` 对齐 |
| `config.ts` | 服务端地址管理，AsyncStorage 持久化 |
| `api/index.ts` | HTTP 客户端，超时与错误处理 |
| `hooks/useChat` | 聊天状态：消息列表 / 发送 / 加载中 |
| `hooks/useSettings` | 配置状态：服务端地址的加载与持久化 |

### 消息类型

```
ChatMessage
├─ role: 'user' | 'assistant' | 'error'
├─ content: 文本内容
├─ imageUri?: 用户图片预览地址
├─ ingredients?: AI 识别的食材 (渲染 IngredientChips)
├─ recipes?: AI 推荐食谱 (渲染 RecipeCard, 已排序)
└─ creativeSuggestions?: AI 创意建议 (渲染 SuggestionList)
```

## 服务端架构

### 核心流程（chat_service，已实现）

```
对话请求 ChatRequest
   │
   ├─ 有图片? ──► vision_service.recognize_ingredients()
   │              (调用多模态模型识别食材)
   │
   ├─ recipe_service.search_recipes()
   │  (根据食材联网搜索/生成食谱)
   │
   ├─ 有结果? ──► recipe_service.rank_recipes()
   │              (按营养/难度智能排序)
   │      │
   │      └── 无结果 ──► creative_service.suggest_creative()
   │                       (生成创意搭配建议)
   │
   └─► build_reply_text() 生成回复文案
       │
       └─► ChatResponse 结构化返回
```

### 基础工具层

工具层封装可复用的原子能力，供服务层 `TODO` 实现时直接调用：

| 工具 | 文件 | 能力 |
|------|------|------|
| `get_chat_llm()` | `llm/client.py` | 对话模型客户端（文本） |
| `get_vision_llm()` | `llm/client.py` | 视觉模型客户端（多模态） |
| `build_image_message()` | `llm/client.py` | 构建「文本 + 图片」多模态消息 |
| `parse_json_output()` | `llm/client.py` | 解析模型 JSON 输出（兼容代码块包裹） |
| `decode_base64_image()` | `tools/image_utils.py` | base64 图片解码 |
| `compress_image()` | `tools/image_utils.py` | 图片压缩（降 token 消耗） |
| `check_image_size()` | `tools/image_utils.py` | 图片大小校验 |
| `web_search()` | `tools/search.py` | Tavily 联网搜索 |

### 异常策略

服务层抛出 `NotImplementedError`（未实现）/ `ValueError`（参数错误），
`main.py` 统一转换为 HTTP 状态码：

| 异常 | HTTP 状态码 | 客户端表现 |
|------|------------|-----------|
| `NotImplementedError` | 501 | 错误气泡：「该功能核心逻辑待人工实现」 |
| `ValueError` | 400 | 错误气泡：具体错误信息 |
| 其他 | 500 | 错误气泡：「服务内部错误」 |

## 部署约定

- 客户端服务端地址通过设置页动态配置，不硬编码进打包产物
- 服务端 LLM 与 Tavily Key 通过 `.env` 注入，不进代码库
- `.env`、`.venv`、`node_modules`、`__pycache__` 已在 `.gitignore` 排除
