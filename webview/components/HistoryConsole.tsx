import React, { useState, useEffect } from 'react';
import { vscode } from '../vscode-api';
import { VSCodeTag, VSCodeDivider } from '@vscode/webview-ui-toolkit/react';
import { Lang } from './Dashboard';

interface RequestRecord {
    id: string;
    timestamp: number;
    clientName: string;
    method: string;
    duration: number;
    requestPreview: string;
    responsePreview: string;
    status: 'success' | 'error';
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    model?: string;
}

const HistoryConsole: React.FC<{ lang: Lang }> = ({ lang }) => {
    const [records, setRecords] = useState<RequestRecord[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const T = {
        en: { title: '📡 Request History', clear: 'Clear', empty: 'No requests yet. Make an ai_ask call to see history.', search: 'Search by method, model, prompt…', model: 'Model', tokens: 'Tokens', duration: 'Duration', status: 'Status', request: 'Request', response: 'Response' },
        zh: { title: '📡 调用历史', clear: '清空', empty: '暂无记录，调用 ai_ask 后将显示在这里。', search: '搜索 method/模型/prompt…', model: '模型', tokens: 'Token', duration: '耗时', status: '状态', request: '请求内容', response: '响应内容' },
    }[lang];

    // Filter records by search query
    const filtered = search.trim()
        ? records.filter(r =>
            r.method.toLowerCase().includes(search.toLowerCase()) ||
            (r.model || '').toLowerCase().includes(search.toLowerCase()) ||
            r.requestPreview.toLowerCase().includes(search.toLowerCase())
        )
        : records;

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.command === 'loadHistory') {
                setRecords(message.data.records || []);
            }
        };
        window.addEventListener('message', handleMessage);

        const loadPage = () => vscode.postMessage({ command: 'getHistory', page: 1, pageSize: 50 });
        loadPage();

        // Auto refresh
        const timer = setInterval(loadPage, 3000);
        return () => {
            window.removeEventListener('message', handleMessage);
            clearInterval(timer);
        };
    }, []);

    const selectedRecord = records.find(r => r.id === selectedId);

    return (
        <div style={{ display: 'flex', height: '100%', margin: '-20px', marginTop: 0 }}>
            <div style={{ width: '300px', borderRight: '1px solid var(--vscode-panel-border)', overflowY: 'auto', backgroundColor: 'var(--vscode-sideBar-background)', display: 'flex', flexDirection: 'column' }}>
                {/* Search box */}
                <div style={{ padding: '8px', borderBottom: '1px solid var(--vscode-panel-border)' }}>
                    <input
                        type="text"
                        placeholder={T.search}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', boxSizing: 'border-box',
                            background: 'var(--vscode-input-background)',
                            color: 'var(--vscode-input-foreground)',
                            border: '1px solid var(--vscode-input-border)',
                            borderRadius: '4px', padding: '5px 8px',
                            fontSize: '12px', outline: 'none',
                        }}
                    />
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filtered.map(record => (
                        <div
                            key={record.id}
                            onClick={() => setSelectedId(record.id)}
                            style={{
                                padding: '12px 15px',
                                cursor: 'pointer',
                                borderBottom: '1px solid var(--vscode-panel-border)',
                                backgroundColor: selectedId === record.id ? 'var(--vscode-list-activeSelectionBackground)' : 'transparent',
                                color: selectedId === record.id ? 'var(--vscode-list-activeSelectionForeground)' : 'inherit'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--vscode-descriptionForeground)', marginBottom: '4px' }}>
                                <span>{new Date(record.timestamp).toLocaleTimeString()}</span>
                                <span style={{ color: record.status === 'success' ? 'var(--vscode-testing-iconPassed)' : 'var(--vscode-testing-iconFailed)' }}>
                                    {record.duration}ms
                                </span>
                            </div>
                            <div style={{ fontWeight: '500', fontSize: '13px', fontFamily: 'monospace', marginBottom: '4px' }}>{record.method}</div>
                            {record.model && <div style={{ fontSize: '11px', color: 'var(--vscode-descriptionForeground)', marginBottom: '2px' }}>{record.model}</div>}
                            {(record.inputTokens || record.outputTokens) ? (
                                <div style={{ fontSize: '11px', color: 'var(--vscode-textPreformat-foreground)', opacity: 0.8 }}>
                                    Tokens: {record.totalTokens || ((record.inputTokens || 0) + (record.outputTokens || 0))}
                                </div>
                            ) : null}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5, fontSize: '12px' }}>
                            {search ? `No results for "${search}"` : T.empty}
                        </div>
                    )}
                </div>
            </div>


            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {selectedRecord ? (
                    <div style={{ maxWidth: '800px' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '15px', fontFamily: 'monospace' }}>{selectedRecord.method}</h2>
                        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <VSCodeTag style={{ backgroundColor: selectedRecord.status === 'success' ? 'var(--vscode-testing-iconPassed)' : 'var(--vscode-testing-iconFailed)' }}>
                                {selectedRecord.status.toUpperCase()}
                            </VSCodeTag>

                            {selectedRecord.model && selectedRecord.model !== 'unknown' && (
                                <VSCodeTag>{selectedRecord.model}</VSCodeTag>
                            )}

                            <VSCodeTag style={{ background: 'transparent', border: '1px solid var(--vscode-dropdown-border)', color: 'var(--vscode-foreground)' }}>
                                {selectedRecord.duration}ms
                            </VSCodeTag>

                            {(selectedRecord.inputTokens || selectedRecord.outputTokens) ? (
                                <VSCodeTag style={{ background: 'transparent', border: '1px solid var(--vscode-dropdown-border)', color: 'var(--vscode-foreground)' }}>
                                    Tokens: {selectedRecord.inputTokens || 0} ⬆ / {selectedRecord.outputTokens || 0} ⬇
                                </VSCodeTag>
                            ) : null}
                        </div>

                        <VSCodeDivider />

                        <h3 style={{ marginTop: '20px', color: 'var(--vscode-editor-foreground)', fontSize: '14px', fontWeight: 'bold' }}>Request JSON-RPC</h3>
                        <pre style={{ background: 'var(--vscode-textCodeBlock-background)', padding: '15px', borderRadius: '4px', overflowX: 'auto', fontSize: '12px', whiteSpace: 'pre-wrap', fontFamily: 'var(--vscode-editor-font-family)', border: '1px solid var(--vscode-panel-border)' }}>
                            {selectedRecord.requestPreview}
                        </pre>

                        <h3 style={{ marginTop: '30px', color: 'var(--vscode-editor-foreground)', fontSize: '14px', fontWeight: 'bold' }}>Response</h3>
                        <pre style={{ background: 'var(--vscode-textCodeBlock-background)', padding: '15px', borderRadius: '4px', overflowX: 'auto', fontSize: '12px', whiteSpace: 'pre-wrap', fontFamily: 'var(--vscode-editor-font-family)', border: '1px solid var(--vscode-panel-border)' }}>
                            {selectedRecord.responsePreview}
                        </pre>
                    </div>
                ) : (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--vscode-descriptionForeground)' }}>
                        Select a request from the sidebar to view its details
                    </div>
                )}
            </div>
        </div >
    );
};

export default HistoryConsole;

