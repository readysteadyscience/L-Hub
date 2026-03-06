# L-Hub v0.2.1 产品介绍与使用说明书

## 产品背景

L-Hub 是一款专为 **Antigravity**（Google 官方推出的下一代 AI IDE）设计的 **MCP（Model Context Protocol）扩展插件**。核心使命是打破单一模型依赖，通过创新的 **Skill 强制路由系统**，实现"**主模型智能调度 + 专家模型精准执行**"的协作范式。在 Antigravity 中，主模型（如 Claude、Gemini）扮演"指挥官"角色，分析用户意图后，通过 L-Hub 自动调用最适合的专家模型（或 CLI Agent）来执行具体任务。经测试，此模式可显著降低综合 token 消耗 **50% 以上**，同时提升任务完成质量与稳定性。L-Hub 完全免费开源，采用宽松的 **MIT 协议**，项目地址：[https://github.com/readysteadyscience/L-Hub](https://github.com/readysteadyscience/L-Hub)。

---

### 一、产品概述

#### 一句话定位
L-Hub 是 Antigravity IDE 的"**模型调度中枢**"，让一个主模型能无缝调用多个外部专家模型，实现降本增效的智能协作。

#### 解决什么问题
当前 AI IDE 用户面临两大核心痛点：
1.  **成本高昂**：全程使用 Claude 或 GPT-4 等顶级模型处理所有任务（如简单翻译、代码格式化），Token 消耗巨大。
2.  **质量波动**：单一模型并非全能，在特定领域（如代码生成、逻辑推理、创意写作）可能表现不稳定，用户需手动切换模型，体验割裂。

#### 核心价值
-   **省钱**：将高价值模型用于核心思考，常规任务路由至性价比更高的模型，综合成本直降 50%+。
-   **多模型协作**：构建"主模型+专家模型"工作流，发挥各自优势，获得"1+1>2"的效果。
-   **无感自动化**：用户只需与主模型对话，复杂的模型调度、上下文注入、结果整合均由 L-Hub 在后台自动完成，体验流畅。

---

### 二、功能清单

#### MCP 工具（7+2 核心指令）
L-Hub 通过 MCP 协议向 Antigravity 的主模型暴露以下工具，主模型可像调用函数一样使用它们。

1.  **`ai_ask` - 智能单次提问**
    *   **功能**：向指定或自动选择的模型发起一次查询。
    *   **参数**：
        *   `message` (必填): 问题内容。
        *   `provider` (可选): 指定模型提供商（如 `deepseek`，`glm`）。**若不指定，则触发自动路由**。
        *   `file_paths` (可选): 本地文件路径数组。L-Hub 将自动读取文件内容并附加到上下文中。**限制：单个文件 ≤200KB，总附加内容 ≤1MB**。

2.  **`ai_multi_ask` - 多模型并行对比**
    *   **功能**：同时向多个模型发起相同提问，并行获取答案并对比展示。
    *   **参数**：`message`, `providers`（模型提供商数组）。

3.  **`ai_consensus` - 投票共识引擎**
    *   **功能**：让 N 个模型回答同一问题，再请一个"裁判模型"对所有答案进行评分和评论，最终输出最优答案及综合报告。
    *   **参数**：`message`, `providers`（候选模型数组），`judge`（裁判模型），`criteria`（评判标准）。

4.  **`ai_list_providers` - 模型列表查询**
    *   **功能**：列出所有已配置模型及连通状态（含 Codex CLI / Gemini CLI 是否已安装）。

5.  **`ai_codex_task` - OpenAI Codex CLI Agent** ⭐
    *   **功能**：调用 Codex CLI Agent，具备直接**读写本地文件系统**的能力，是一个代码专属智能体。
    *   **亮点**：通过 ChatGPT 官方 OAuth 认证，**无需配置 API Key**。

6.  **`ai_gemini_task` - Google Gemini CLI Agent** ⭐
    *   **功能**：调用 Google Gemini CLI Agent，推理能力强。
    *   **亮点**：通过 Google 官方 OAuth 认证，**无需配置 API Key**。

7.  **文件上下文注入** — `ai_ask` 支持 `file_paths` 参数，自动注入本地文件内容到查询上下文。

8.  **自动路由** — 不指定 `provider` 时按关键词自动选模型（"翻译"→DeepSeek、"推理"→Gemini）。

9.  **容错回退** — API 失败时自动尝试备选模型，不中断工作流。

#### Dashboard 控制面板（6 大标签页）

| Tab | 功能 |
|-----|------|
| **概览** | 模型状态总览 + 快速操作入口 |
| **模型管理** | 添加/编辑/删除模型、API Key 安全存储、连通测试 |
| **路由指南** | 可视化任务→模型映射规则 |
| **测试面板** | 8 项自动化测试，一键验证全部模型和路由 |
| **Skill 管理** | 查看/复制当前生效的 Skill 调度规则 |
| **历史记录** | 调用时间、模型、耗时、Token 详情 |

#### Skill 强制路由系统

L-Hub 的"大脑"，实现自动调度的核心：
- **自动注入**：启动时自动向 Antigravity 注入规则（`GEMINI.md` + `geminicodeassist.rules`）
- **预设规则**：
  - 翻译/文档 → **DeepSeek**（性价比极高）
  - 代码生成/修改 → **Codex CLI Agent**（免 Key）
  - 复杂推理/逻辑分析 → **Gemini CLI Agent**（免 Key）
- **用户至上**：用户明确指定模型时，系统尊重用户选择

#### 创意写作协作链（7 步流水线）

自动化多模型协作，用于高质量创意内容生产。**每步执行前主模型会在对话窗口播报进度**（`📝 创意协作链 步骤 X/7…`），全程透明可见。

1. **大纲竞标** — Qwen + GLM `ai_multi_ask` 并行出大纲
2. **大纲融合** — **GPT-5.4** 综合择优，融合两份大纲
3. **初稿竞写** — Qwen + GLM + MiniMax `ai_multi_ask` 并行写初稿
4. **主模型综合择优** — 融合各家最好段落
5. **风格润色** — MiniMax 去 AI 味 + 中文文笔打磨
6. **逻辑检查** — GLM 连贯性最终检查（失败自动切 DeepSeek 备选）
7. **主模型交付** — 不再修改内容，直接交付

*全程自动化；Streaming 支持确保长文写作（万字级）不超时。*

---

### 三、支持的模型

| 类型 | 提供商 | 代表模型 | 备注 |
|:---|:---|:---|:---|
| **云 API** | DeepSeek | DeepSeek-V3.2 | 性价比之王，路由首选 |
| | 智谱AI (GLM) | GLM-5 | SWE-bench 77.8%，Agentic 工程引擎 |
| | 通义千问 (Qwen) | Qwen3-Max | 工具调用全球第一 |
| | MiniMax | MiniMax Text 2.5 | 100 tokens/s 高速生成 |
| | OpenAI | **GPT-5.4** / GPT-5.4 Pro | 集成 Codex 编程，1M 上下文（2026-03-05 新） |
| | Anthropic | Claude Sonnet 4.6 | 分析与写作 |
| | Google | Gemini 3.1 Pro | ARC-AGI-2 #1，推理顶级 |
| | 月之暗面 (Kimi) | Kimi-Latest | 超长上下文 |
| **CLI Agent** | OpenAI Codex CLI | **GPT-5.4** (v0.111.0) | **免 API Key**，文件操作 Agent |
| | Google Gemini CLI | Gemini 3.1 | **免 API Key**，推理 Agent |

---

### 四、安装和配置

#### 1. 安装
1. 在 Antigravity IDE 中打开扩展市场
2. 搜索 **"L-Hub"**
3. 点击安装。安装后自动识别并加载 MCP Server

#### 2. 首次配置
1. **打开 Dashboard**：活动栏找到 L-Hub 图标并点击
2. **添加模型**：进入"模型管理"Tab，点击"添加模型"
3. **填写 API Key**：选择厂商预设，填入 API Key（安全加密存储）
4. **连通测试**：点击"测试"按钮，看到 ✅ 即可使用

#### 3. CLI 工具安装（可选但推荐）
- **Codex CLI**：参考 OpenAI 官方说明安装并完成 ChatGPT OAuth 登录
- **Gemini CLI**：`npm i -g @google/gemini-cli`，完成 Google OAuth 登录
- 安装后 L-Hub 自动检测并调用

---

### 五、使用场景举例

| 场景 | 你说 | 幕后发生了什么 | 效果 |
|------|------|---------------|------|
| **日常编码** | "检查 utils.js 有没有内存泄漏" | 自动调用 Codex CLI 读取文件并分析 | 未消耗主模型 Token |
| **多方案对比** | "Python 区块链有哪些实现思路？" | `ai_multi_ask` 并行问 3 个模型 | 获得 3 个不同方案 |
| **代码审查** | "严格审查这段代码" | `ai_consensus` 多模型审查 + 裁判评分 | 质量远超单模型 |
| **创意写作** | "写一篇关于 AI 与艺术的博客" | 自动触发 7 步协作链 | 经过多轮润色的高质量文章 |
| **翻译文档** | "把 README.md 翻译成日语" | 自动路由至 DeepSeek | 成本极低 |

---

### 六、技术架构

```
Antigravity 主模型（Claude / Gemini）
        ↕ MCP 协议
    L-Hub MCP Server v0.2.1
        ↕ SSE Streaming（15s 首字节超时，无总时长限制）
┌───────────────────────────────────────┐
│  云 API 模型        │   CLI Agent     │
│  DeepSeek           │  Codex CLI      │
│  GLM / Qwen         │  (GPT-5.4)      │
│  MiniMax / Kimi     │  Gemini CLI     │
│  OpenAI GPT-5.4     │                 │
└───────────────────────────────────────┘
        ↕
    SQLite 历史记录
    SecretStorage API Key 加密
    Dashboard Webview (React)
```

**Streaming 实现要点**：`callProvider` 采用 SSE 流式接收，连接建立后首字节抵达即取消超时计时，支持万字级长文生成不超时。

---

### 七、社区和支持

- **GitHub**：[https://github.com/readysteadyscience/L-Hub](https://github.com/readysteadyscience/L-Hub)
  - 欢迎 Star、Fork、提交 Issue 和 Pull Request
- **开源协议**：MIT — 允许自由使用、修改和分发

---

**让我们在 Antigravity 中，开启高效、经济的多模型协同智能编程新时代。**
