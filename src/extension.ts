import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { spawnSync } from 'child_process';
import { HistoryStorage } from './storage';
import { SettingsManager, SUPPORTED_PROVIDERS } from './settings';
import { LinglanMcpServer } from './ws-server';
import { DashboardPanel } from './webview-provider';

let mcpServer: LinglanMcpServer;
let statusBarItem: vscode.StatusBarItem;
let statusRefreshTimer: ReturnType<typeof setInterval> | undefined;

const KEYS_FILE = path.join(os.homedir(), '.l-hub-keys.json');

/**
 * Export API keys from VS Code SecretStorage to ~/.l-hub-keys.json
 * so the standalone mcp-server.js can read them without vscode dependency.
 */
async function syncKeysToFile(settings: SettingsManager, dbPath?: string) {
    try {
        // Read existing file to preserve v2 `models` and other fields
        let existing: Record<string, any> = {};
        try {
            if (fs.existsSync(KEYS_FILE)) {
                existing = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
            }
        } catch { }

        // Update only the legacy keys section — leave models/version intact
        const legacyKeys: Record<string, string> = {};
        for (const provider of SUPPORTED_PROVIDERS) {
            const k = await settings.getApiKey(provider);
            if (k) legacyKeys[provider] = k;
        }
        const merged: Record<string, any> = { ...existing, legacy: legacyKeys };
        // ── Write DB path so standalone mcp-server can log to the same SQLite ──
        if (dbPath) { merged.dbPath = dbPath; }
        fs.writeFileSync(KEYS_FILE, JSON.stringify(merged, null, 2), 'utf8');
    } catch (e) {
        console.error('[L-Hub] Failed to sync keys:', e);
    }
}

/**
 * Auto-register the standalone mcp-server.js into Antigravity's mcp_config.json.
 * Idempotent — safe to call on every activation.
 */
function autoRegisterMcpConfig(extensionPath: string) {
    const serverPath = path.join(extensionPath, 'dist', 'mcp-server.js');
    const mcpConfigPath = path.join(os.homedir(), '.gemini', 'antigravity', 'mcp_config.json');

    if (!fs.existsSync(mcpConfigPath)) return; // Antigravity not installed

    try {
        const raw = fs.readFileSync(mcpConfigPath, 'utf8');
        const config = JSON.parse(raw);
        if (!config.mcpServers) config.mcpServers = {};

        const existing = config.mcpServers['lhub'];
        const newEntry = { command: 'node', args: [serverPath], env: {} };

        if (!existing || existing.args?.[0] !== serverPath) {
            // 清理旧的连字符命名，如果在的话
            if (config.mcpServers['l-hub']) {
                delete config.mcpServers['l-hub'];
            }
            config.mcpServers['lhub'] = newEntry;
            fs.writeFileSync(mcpConfigPath, JSON.stringify(config, null, 4), 'utf8');
            console.log('[L-Hub] Auto-registered mcp-server.js in Antigravity mcp_config.json');
        }
    } catch (err) {
        console.error('[L-Hub] Failed to auto-register MCP config:', err);
    }
}

// ─── Status Bar ───────────────────────────────────────────────────────────────

/**
 * Update the status bar item to reflect current model configuration state.
 * Called on activation and periodically via timer.
 */
async function updateStatusBar(settings: SettingsManager) {
    if (!statusBarItem) { return; }

    try {
        const models = await settings.getModels();

        // ── Resolve which models have API keys configured ──
        const modelStatuses: Array<{ label: string; enabled: boolean; hasKey: boolean }> = [];
        for (const m of models) {
            const key = await settings.getModelApiKey(m.id);
            modelStatuses.push({ label: m.label, enabled: m.enabled, hasKey: !!key });
        }

        const ready = modelStatuses.filter(m => m.enabled && m.hasKey);
        const total = modelStatuses.length;
        const readyCount = ready.length;

        // ── Determine icon & color ──
        let icon: string;
        let color: vscode.ThemeColor | undefined;
        if (readyCount === 0) {
            icon = '$(error)';
            color = new vscode.ThemeColor('statusBarItem.errorBackground');
        } else if (readyCount < total) {
            icon = '$(warning)';
            color = new vscode.ThemeColor('statusBarItem.warningBackground');
        } else {
            icon = '$(pulse)';
            color = undefined; // default
        }

        // ── Status bar text ──
        if (readyCount === 0) {
            statusBarItem.text = `${icon} L-Hub: 未配置`;
        } else if (readyCount < total) {
            statusBarItem.text = `${icon} L-Hub: ${readyCount}/${total} 就绪`;
        } else {
            statusBarItem.text = `${icon} L-Hub: ${readyCount} 模型就绪`;
        }
        statusBarItem.backgroundColor = color;

        // ── Tooltip (MarkdownString for rich content) ──
        const tooltip = new vscode.MarkdownString('', true);
        tooltip.isTrusted = true;
        tooltip.supportHtml = true;

        tooltip.appendMarkdown('### 🔌 L-Hub 模型状态\n\n');

        if (modelStatuses.length === 0) {
            tooltip.appendMarkdown('_未配置任何模型。请打开 Dashboard 添加。_\n\n');
        } else {
            for (const m of modelStatuses) {
                const status = (m.enabled && m.hasKey) ? '✅' : '❌';
                const note = !m.hasKey ? ' — 未配置 Key' : (!m.enabled ? ' — 已禁用' : '');
                tooltip.appendMarkdown(`${status} **${m.label}**${note}  \n`);
            }
            tooltip.appendMarkdown('\n---\n\n');
        }

        // ── CLI status ──
        const codexCheck = spawnSync('codex', ['--version'], { encoding: 'utf8', timeout: 3000 });
        const codexOk = !codexCheck.error;
        tooltip.appendMarkdown(`🤖 Codex CLI: ${codexOk ? '✅ 已安装' : '❌ 未安装'}  \n`);

        const geminiCheck = spawnSync('gemini', ['--version'], { encoding: 'utf8', timeout: 3000 });
        const geminiOk = !geminiCheck.error;
        tooltip.appendMarkdown(`🔷 Gemini CLI: ${geminiOk ? '✅ 已安装 (使用 Google 本地凭据)' : '❌ 未安装'}  \n`);

        tooltip.appendMarkdown('\n---\n\n_点击打开 Dashboard_');

        statusBarItem.tooltip = tooltip;
        statusBarItem.show();
    } catch (err) {
        console.error('[L-Hub] Failed to update status bar:', err);
        statusBarItem.text = '$(error) L-Hub';
        statusBarItem.tooltip = 'L-Hub: 状态获取失败';
        statusBarItem.show();
    }
}


// ─── Activation ───────────────────────────────────────────────────────────────

export async function activate(context: vscode.ExtensionContext) {
    console.log('[L-Hub] Activating...');

    const settings = new SettingsManager(context);

    // ── STEP 1: Register commands immediately — BEFORE anything that could throw ──
    let storage: HistoryStorage | null = null;

    const openPanelCommand = vscode.commands.registerCommand('l-hub.openPanel', () => {
        if (!storage) {
            vscode.window.showWarningMessage(
                'L-Hub: History storage is unavailable (SQLite load failed). Settings panel will still work.',
            );
        }
        DashboardPanel.createOrShow(context.extensionUri, storage!, settings, () => updateStatusBar(settings));
    });
    context.subscriptions.push(openPanelCommand);

    console.log('[L-Hub] Command l-hub.openPanel registered ✅');

    // ── STEP 2: Initialize history storage (may fail if better-sqlite3 ABI mismatch) ──
    try {
        const storagePath = context.globalStorageUri.fsPath;
        storage = new HistoryStorage(storagePath);
        console.log('[L-Hub] HistoryStorage initialized ✅');
    } catch (err) {
        console.error('[L-Hub] HistoryStorage failed to init (SQLite ABI issue?), history will be disabled:', err);
    }

    // ── STEP 3: Sync keys + auto-register MCP config ──
    const dbFilePath = path.join(context.globalStorageUri.fsPath, 'history.db');
    await syncKeysToFile(settings, dbFilePath);
    autoRegisterMcpConfig(context.extensionPath);

    // ── STEP 4: Create Status Bar Item ──
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'l-hub.openPanel';
    statusBarItem.name = 'L-Hub Status';
    context.subscriptions.push(statusBarItem);

    // Initial update
    await updateStatusBar(settings);

    // Refresh every 60 seconds
    statusRefreshTimer = setInterval(() => updateStatusBar(settings), 60_000);

    console.log('[L-Hub] StatusBar indicator created ✅');

    // ── STEP 5: Start WebSocket server (non-critical) ──
    try {
        mcpServer = new LinglanMcpServer(storage!, settings);
        await mcpServer.start();
        console.log('[L-Hub] WS MCP server started ✅');
    } catch (err) {
        console.error('[L-Hub] WS server failed to start (non-critical):', err);
    }
}

export function deactivate() {
    if (statusRefreshTimer) {
        clearInterval(statusRefreshTimer);
        statusRefreshTimer = undefined;
    }
    if (mcpServer) {
        mcpServer.stop();
    }
}
