# Changelog

All notable changes to **L-Hub** will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.1.4] - 2026-03-02

### Fixed
- **版本徽章同步** — README `version` badge 已与实际发布版本同步，修复之前因打包顺序错误导致 badge 显示旧版本号的问题
- **产品亮点文案** — 更新插件详情页路由描述，去掉已过时的"代码走 DeepSeek、架构走 Claude/GLM"说法，改为当前实际默认路由

### Changed
- **Gemini CLI 补充说明** — 产品亮点"ChatGPT 账号零门槛"扩展为"ChatGPT / Google 账号零门槛"，加入 Gemini CLI（Google OAuth）说明，与 Codex CLI 对称展示
- **快速开始** — 新增第 5 步 Gemini CLI 安装与登录步骤

---

## [0.1.3] - 2026-03-02

### Added
- **`ai_gemini_task` 工具** — 调用本地 Gemini CLI（需已安装 `@google/gemini-cli`），支持 `prompt`、`model`、`working_dir` 参数。Gemini 以非交互模式（`-p --yolo`）执行，自动清理 ANSI 色码后返回纯文本结果
- **文件上下文注入** — `ai_ask` / `ai_multi_ask` 新增可选参数 `file_paths: string[]`，自动读取本地文件内容并拼入 system prompt。支持 `~` 路径扩展，单文件上限 200KB，总量 1MB，超限自动跳过并附加警告说明
- **自动 Fallback 重试链** — `ai_ask` 遇到可重试错误（429 限速、5xx 服务错误、网络超时）时，自动顺序尝试其他已启用模型，最终响应末尾附注 ⚡ 标记说明实际使用的模型
- **`ai_list_providers` 新增 Gemini CLI 状态** — 同 Codex CLI，显示是否安装及版本信息

### Changed
- **路由矩阵全面更新** — 依据 2026 年第一季度主流编程基准（SWE-bench Verified、LiveCodeBench、BFCL）持续校准各模型任务分配：
  - 代码生成首选 **GPT/Codex 5.3**（`priority 0`）；文件级编码建议直接使用 `ai_codex_task`
  - **MiniMax-M2.5 Coding**（SWE-bench 80.2%、BFCL 工具调用 76.8%）升为 `code_gen` 第二优先级并新增 `agentic`、`tool_calling` 任务类型
  - **GLM-5 Coding Plan** 专注 `agentic`、`tool_calling`、`long_context`，同时作为代码生成备选
  - **Gemini 3.1 Pro** 承接 `ui_design`（前端设计效果最佳）及 `math_reasoning`
  - **MiniMax-M2.5 highspeed** 保留 `creative` 大量内容生成场景
- **移除 Claude 路由** — L-Hub 作为 Antigravity（Claude Sonnet 4.6）的补充工具，不再将任务反向路由回 Claude 本身，避免冗余调用
- **`ai_list_providers`** 输出补充显示 Gemini CLI 安装状态

---

## [0.1.2] - 2026-03-02
### Added
- **`ai_multi_ask` 工具** — 一次并行调用多个 AI 模型，汇总对比结果。指定 `providers` 列表或留空（自动选全部已配置模型，最多 5 个）
- **路由长度感知** — 消息 > 3000 字自动路由到 long_context 最优模型（GLM）；< 100 字纯代码短问题快速走 DeepSeek
- **历史面板搜索框** — 可按 method 名、模型名、prompt 内容实时过滤调用历史记录

## [0.1.1] - 2026-03-02

### Fixed
- **调用历史真实写入**：修复 MCP server 调用 AI API 后不写历史记录的 Bug。每次 `ai_ask` / `ai_codex_task` 调用后，耗时、模型名、Token 数均写入历史面板可查

## [0.1.0] — 2026-03-01

### Added
- **ConfigPanel 2.0** — dynamic model management: add/remove/edit models, 3-step modal, 12 task types (multi-select with auto-filled defaults per model)
- **Model Registry** — 21 pre-configured models across DeepSeek, GLM, Qwen, MiniMax, Moonshot, Yi, GPT-4o, Claude, Gemini, Llama, Mistral, and more
- **v2 config format** — model configs stored with tasks, baseUrl, encrypted API key per model

### Changed
- **mcp-server.ts** — completely rewritten: reads v2 model config, routes by task type matching user's configured models; falls back to v1 legacy format
- **activationEvents** — added `*` + `onCommand:l-hub.openPanel` to guarantee activation
- **Package** — now includes full `node_modules` (fixed `ws`/`better-sqlite3` not found on load)
- **README** — removed incorrect "runs on Claude Sonnet/Opus" claim; simplified model section to examples

---

## [0.0.9] — 2026-03-01

### Added
- **Codex CLI integration** (`ai_codex_task` MCP tool) — autonomous local file agent via OpenAI OAuth, no manual API key needed
- **Custom / Third-party relay API** — add any OpenAI-compatible endpoint (OpenRouter, SiliconFlow, etc.) from the Settings panel
- **Discord community** — [discord.gg/gurEPMnn52](https://discord.gg/gurEPMnn52)
- Transparent logo (cyan, 1024×1024)
- `ai_list_providers` now shows Codex CLI installation status

### Changed
- README rewritten: **Chinese first**, English second
- Removed specific Claude version numbers for forward compatibility
- Badge style: `for-the-badge` → `flat-square` (smaller, cleaner)
- Removed `command:` URIs that caused 404 in GitHub/Antigravity rendering

---

## [0.0.8] — 2026-02-28

### Added
- Standalone MCP server (`mcp-server.ts`) — runs independently of VS Code extension host
- API keys stored in `~/.l-hub-keys.json`, synced from VS Code SecretStorage
- Auto-registration in `~/.gemini/antigravity/mcp_config.json` on first activation
- Smart routing: auto-selects best model by task type (DeepSeek / GLM / Qwen / MiniMax)
- History console with token usage and latency tracking

### Changed
- Activation event changed to `onStartupFinished` for zero-config experience
- Brand corrected to **走起智造 · Ready Steady Science**

---

## [0.0.1] — 2026-02-25

### Added
- Initial release
- WebSocket-based MCP bridge (local extension host)
- Dashboard webview: Config, History panels
- Support for: DeepSeek, GLM (Zhipu), Qwen (Alibaba), MiniMax
