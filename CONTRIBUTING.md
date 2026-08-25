# 贡献指南

欢迎贡献！无论是修复 Bug、完善核心逻辑，还是改进文档，都请先阅读本指南。

## 开发环境

```bash
# 克隆仓库
git clone https://github.com/zhanghuaiwei/smart-kitchen.git
cd smart-kitchen

# 服务端
cd server
cp .env.example .env   # 填入配置
uv sync
uv run uvicorn main:app --reload --port 8000

# 客户端
cd ../client
npm install
npx expo start
```

## 开发约定

### 代码风格

- **服务端**：遵循 PEP 8，类型注解齐全；模块级 docstring 说明职责
- **客户端**：TypeScript strict 模式，零 `any`；组件单一职责
- **命名**：服务端 snake_case，客户端 camelCase；类型与接口命名清晰达意

### 核心逻辑实现

服务端三个核心服务为 `TODO` 占位，实现时：

1. 移除对应函数体末尾的 `raise NotImplementedError(...)`
2. 调用文件顶部注释中列出的基础工具（`llm/client.py`、`tools/*`）
3. 保持函数签名与返回类型不变（客户端无需改动）
4. 如需新增依赖，更新 `server/pyproject.toml` 后 `uv sync`

### 提交规范

使用 Conventional Commits：

```
<type>(<scope>): <subject>

type:   feat | fix | docs | refactor | chore | test
scope:  server | client | docs | 任意模块名(可选)
```

示例：

```
feat(server): 实现食材识别，对接 qwen-vl-max
fix(client): 修复图片预览缩略比例
docs: 补充架构图
```

## 提交 PR

1. Fork 仓库并创建分支：`git checkout -b feat/your-feature`
2. 提交改动，确保：
   - 服务端 `uv run python -c "import main"` 可正常导入
   - 客户端 `npx tsc --noEmit` 零错误
3. 发起 Pull Request，描述改动与动机

## 项目结构

详见 [README.md](README.md) 的「项目结构」章节与 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## 许可证

贡献即表示同意以 [MIT License](LICENSE) 发布你的改动。
