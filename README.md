<div align="center">

# L-Hub

**MCP AI Bridge — 智能多模型路由**

*让 Antigravity 自动把子任务委派给最合适的专家模型，省 token、降成本*

[![Version](https://img.shields.io/badge/version-0.1.4-blue?style=flat-square&logo=visualstudiocode)](https://github.com/readysteadyscience/l-hub)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/readysteadyscience/l-hub/blob/main/LICENSE)
[![Brand](https://img.shields.io/badge/%E8%B5%B0%E8%B5%B7%E6%99%BA%E9%80%A0-Ready%20Steady%20Science-orange?style=flat-square)](https://github.com/ReadySteadyScience)
[![Universe](https://img.shields.io/badge/产品线-Linglan%20Realm-blueviolet?style=flat-square)](https://github.com/ReadySteadyScience)

[![GitHub Stars](https://img.shields.io/github/stars/readysteadyscience/l-hub?style=flat-square&logo=github&label=Stars&color=yellow)](https://github.com/readysteadyscience/l-hub/stargazers)
[![Discord](https://img.shields.io/badge/Discord-Community-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/gurEPMnn52)
[![Feedback](https://img.shields.io/badge/Feedback-Issues-blue?style=flat-square&logo=github)](https://github.com/readysteadyscience/l-hub/issues/new)

> **走起智造 · Ready Steady Science** 旗下 **Linglan Realm** 产品线 — 免费开源

</div>

---

## 为什么需要 L-Hub？

Antigravity 的主控模型擅长调度与推理，但让它处理每一个子任务（写代码、翻译、UI）成本极高。

**L-Hub 是内置的 MCP AI 桥接器** — 自动把每个子任务路由到最合适的专家模型，只用最低的 token 开销。

---

## 产品亮点

**按任务类型智能路由** — 代码任务走 GPT/Codex 5.3，翻译走 Qwen，前端 UI 走 Gemini（ARC-AGI-2 全球 #1），Agentic 任务走 MiniMax-M2.5 或 GLM-5 Coding，无需手动选。13 种任务类型全自动匹配。

**国内外 20+ 模型一站接入** — DeepSeek、GLM、Qwen、MiniMax、Kimi（国内直连）+ OpenAI、Claude、Gemini、Mistral（国际）+ OpenRouter/一步API/DMXAPI（聚合中转），统一管理。

**ChatGPT / Google 账号零门槛** — 内置 Codex CLI（ChatGPT OAuth）和 Gemini CLI（Google OAuth），无需申请 API Key，可直接对本地文件做代码审查、重写和 Agentic 任务。

**装上就能用** — 激活后自动写入 Antigravity 的 MCP 配置，零手动配置。可视化面板管理 Key 和模型，不用编辑 JSON。

**内置价格参考** — OpenRouter 实时价格数据，在设置页直接对比各模型的输入/输出成本。

---

## 默认路由推荐

以下为 L-Hub 按任务类型推荐的最佳模型。这只是默认参考，您可以自由修改任务分配。

| 任务 | 推荐模型 | 原因 |
|---|---|---|
| 代码生成 | **GPT/Codex 5.3** | Terminal-Bench #1；对 Codex CLI 可直接读写本地文件 |
| Agentic 编码 | **MiniMax-M2.5 Coding** | SWE-bench 80.2% ≈ Claude Opus 4.6；BFCL 工具调用 76.8% 超 Opus |
| 多步调试 / 工具链 | **GLM-5 Coding Plan** | SWE-bench 77.8%，开源 SOTA；长程任务规划强 |
| 代码经济型 | **DeepSeek-V3** | 性价比高，快速输出 |
| 翻译 / 中文文档 | **Qwen-Max** | 中文第一；工具调用 Tau2-bench #1 |
| UI / 前端设计 | **Gemini 3.1 Pro** | ARC-AGI-2 全球 #1（77.1%）；前端页面美观度领先 |
| 数学 / 推理 / 算法 | **Gemini 3.1 Pro** | GPQA 94.3%；竞技编程 Elo 2887 |
| 长文本 / 总结 | **Gemini 3.1 Pro** | 百万 token 上下文 |
| 终端 / DevOps | **GPT-5.3 Codex** | Terminal-Bench #1 |
| 创意 / 大量生成 | **MiniMax-M2.5 HighSpeed** | 100 tok/s，高速输出 |
| 本地文件操作 | **Codex CLI** (`ai_codex_task`) | OAuth 免 Key；自主读写本地代码库 |
| 本地 Agentic | **Gemini CLI** (`ai_gemini_task`) | Google OAuth 免 Key；内置文件 / 浏览器工具 |

---

## 支持的模型

L-Hub 采用 OpenAI 兼容接口，任何支持该格式的模型均可接入。内置支持：

| 厂商 | 内置型号 |
|---|---|
| DeepSeek | V3, R1 |
| GLM 智谱 | GLM-5 |
| Qwen 通义 | Qwen-Max, Qwen-Coder-Plus |
| MiniMax | M2.5, M2.5-HighSpeed |
| Kimi | K2.5 |
| OpenAI | GPT-5.1, GPT-5.3 Codex |
| Anthropic | Opus 4.6, Sonnet 4.6, Opus 4.5, Sonnet 4.5 |
| Google | Gemini 3.1 Flash, 3.1 Pro, Image Gen |
| Mistral | Large 3 |
| Meta | Llama 3.3 70B (需中转) |
| 聚合平台 | OpenRouter, 一步API, DMXAPI |

也可自定义 Base URL 接入任何 OpenAI 兼容模型。

<div align="center">

![L-Hub 架构图](https://raw.githubusercontent.com/readysteadyscience/l-hub/main/images/architecture_zh.png)

</div>

---

## 快速开始

**1. 安装** — 商城搜索 L-Hub，或命令行：

```bash
code --install-extension readysteadyscience.l-hub
```

**2. 重启 Antigravity** — L-Hub 自动注册 MCP 配置，无需手动操作。

**3. 配置 API Key** — `Cmd/Ctrl + Shift + P` → `L-Hub: Open Dashboard` → 添加模型并填入 Key。

**4. （可选）启用 Codex CLI** — 用 ChatGPT 账号 OAuth 登录，无需 API Key，可直接读写本地文件：

```bash
npm install -g @openai/codex && codex login
```

**5. （可选）启用 Gemini CLI** — 用 Google 账号 OAuth 登录，无需 API Key，内置文件 / 浏览器工具：

```bash
npm install -g @google/gemini-cli && gemini
```

**6. 开始使用** — 照常与 Antigravity 对话，L-Hub 自动接管子任务路由。

> 验证：工具面板出现 `l-hub / ai_ask`、`l-hub / ai_codex_task`、`l-hub / ai_gemini_task` 即成功。

---

## 社区

**走起智造 · Ready Steady Science** — Linglan Realm 免费开源工具。

[![Star on GitHub](https://img.shields.io/badge/Star-GitHub-brightgreen?style=flat-square&logo=github)](https://github.com/readysteadyscience/l-hub/stargazers)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/gurEPMnn52)
[![Feedback](https://img.shields.io/badge/Feedback-Issues-blue?style=flat-square&logo=github)](https://github.com/readysteadyscience/l-hub/issues/new)
