import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

export interface RequestRecord {
    id: string;
    timestamp: number;
    clientName: string;
    clientVersion: string;
    method: string;
    toolName?: string;
    model?: string;
    duration: number;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    requestPreview: string;
    responsePreview: string;
    status: 'success' | 'error';
    errorMessage?: string;
}

export class HistoryStorage {
    private db: Database.Database;
    private dbPathStr: string;

    constructor(storagePath: string) {
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true });
        }
        const dbPath = path.join(storagePath, 'history.db');
        this.dbPathStr = dbPath;
        this.db = new Database(dbPath);
        this.initSchema();
    }

    public getDbPath(): string {
        return this.dbPathStr;
    }

    private initSchema() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS request_history (
                id TEXT PRIMARY KEY,
                timestamp INTEGER NOT NULL,
                client_name TEXT,
                client_version TEXT,
                method TEXT NOT NULL,
                tool_name TEXT,
                model TEXT,
                duration INTEGER,
                input_tokens INTEGER,
                output_tokens INTEGER,
                total_tokens INTEGER,
                request_preview TEXT,
                response_preview TEXT,
                status TEXT NOT NULL,
                error_message TEXT
            );
            
            CREATE INDEX IF NOT EXISTS idx_timestamp ON request_history(timestamp DESC);
            CREATE INDEX IF NOT EXISTS idx_client ON request_history(client_name);
            CREATE INDEX IF NOT EXISTS idx_model ON request_history(model);
        `);
    }

    public saveRecord(record: RequestRecord) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO request_history (
                    id, timestamp, client_name, client_version, method, tool_name, model,
                    duration, input_tokens, output_tokens, total_tokens, request_preview,
                    response_preview, status, error_message
                ) VALUES (
                    @id, @timestamp, @clientName, @clientVersion, @method, @toolName, @model,
                    @duration, @inputTokens, @outputTokens, @totalTokens, @requestPreview,
                    @responsePreview, @status, @errorMessage
                )
            `);
            stmt.run(record);
        } catch (error) {
            console.error('Failed to save history record:', error);
        }
    }

    public queryHistory(page: number, pageSize: number): { records: RequestRecord[], total: number } {
        const offset = (page - 1) * pageSize;
        const records = this.db.prepare('SELECT * FROM request_history ORDER BY timestamp DESC LIMIT ? OFFSET ?').all(pageSize, offset);
        const total = this.db.prepare('SELECT COUNT(*) as count FROM request_history').get() as { count: number };

        return {
            records: records.map(this.mapDbRowToRecord),
            total: total.count
        };
    }

    public cleanupOldRecords(daysToKeep: number = 30) {
        const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
        this.db.prepare('DELETE FROM request_history WHERE timestamp < ?').run(cutoff);
    }

    public clearAll() {
        this.db.exec('DELETE FROM request_history');
    }

    public close() {
        this.db.close();
    }

    private mapDbRowToRecord(row: any): RequestRecord {
        return {
            id: row.id,
            timestamp: row.timestamp,
            clientName: row.client_name,
            clientVersion: row.client_version,
            method: row.method,
            toolName: row.tool_name,
            model: row.model,
            duration: row.duration,
            inputTokens: row.input_tokens,
            outputTokens: row.output_tokens,
            totalTokens: row.total_tokens,
            requestPreview: row.request_preview,
            responsePreview: row.response_preview,
            status: row.status,
            errorMessage: row.error_message
        };
    }
}
