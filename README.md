<div align="center">

# L-Hub

**MCP AI Bridge — 智能多模型路由**

*让 Antigravity 自动把子任务委派给最合适的专家模型，省 token、降成本*

[![Version](https://img.shields.io/badge/version-0.1.10-blue?style=flat-square&logo=visualstudiocode)](https://github.com/readysteadyscience/l-hub)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/readysteadyscience/l-hub/blob/main/LICENSE)
[![Brand](https://img.shields.io/badge/%E8%B5%B0%E8%B5%B7%E6%99%BA%E9%80%A0-Ready%20Steady%20Science-orange?style=flat-square)](https://github.com/ReadySteadyScience)
[![Universe](https://img.shields.io/badge/产品线-Linglan%20Realm-blueviolet?style=flat-square)](https://github.com/ReadySteadyScience)

[![GitHub Stars](https://img.shields.io/badge/Stars-GitHub-yellow?style=flat-square&logo=github)](https://github.com/readysteadyscience/l-hub/stargazers)
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

- **自动路由寻优**：13 大类型任务无缝桥接，根据代码、推理、检索等属性自动分发给性价比高且能力对应的本地/云端模型，告别手动切换。
- **20+ 顶级大模型全覆盖**：无缝对接 DeepSeek、GLM、Qwen、MiniMax 等国产明星模型，并默认支持 OpenAI、Claude、Gemini 全系产品和主流中转接入。
- **免密白嫖与原生 CLI**：内置 ChatGPT OAuth 与 Google OAuth 获取凭证机制。通过本地生成的独立 Agent 子线程，自主接管复杂的文件库代码审查与执行操作。
- **完全免配的生态整合**：一次安装即与 Antigravity 强绑定，全程热插拔，所有 API Keys 及配置项全在插件 Dashboard 内部可视化闭环闭环。

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

[![Star on GitHub](https://img.shields.io/badge/Star-GitHub-yellow?style=flat-square&logo=github)](https://github.com/readysteadyscience/l-hub/stargazers)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/gurEPMnn52)
[![Feedback](https://img.shields.io/badge/Feedback-Issues-blue?style=flat-square&logo=github)](https://github.com/readysteadyscience/l-hub/issues/new)
