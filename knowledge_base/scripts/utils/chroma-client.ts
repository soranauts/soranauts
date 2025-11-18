import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { setTimeout as sleep } from 'timers/promises';
import { ChromaClient, type Collection } from 'chromadb';
import duckdb from 'duckdb';
import type { KBEnv } from '../env';

type LogLevel = 'info' | 'warn' | 'error';

const LOG_PREFIX = '[kb:ingest]';

const HEARTBEAT_RETRIES = 6;
const HEARTBEAT_BASE_DELAY_MS = 750;
const HEARTBEAT_MAX_DELAY_MS = 30_000;

export type StoreMode = 'chroma-http' | 'duckdb';

export interface HeartbeatResult {
  ok: boolean;
  endpoint?: string;
  elapsedMs: number;
  message?: string;
}

export interface VectorStoreCollection {
  upsert(args: {
    ids: string[];
    embeddings: number[][];
    documents: string[];
    metadatas: Record<string, unknown>[];
  }): Promise<void>;
  delete(args: { ids: string[] }): Promise<void>;
}

export interface VectorStoreClient {
  getCollection(args: { name: string }): Promise<VectorStoreCollection>;
  createCollection(args: {
    name: string;
    metadata?: Record<string, unknown>;
  }): Promise<VectorStoreCollection>;
  close?: () => Promise<void>;
}

export interface VectorStoreHandle {
  client: VectorStoreClient;
  mode: StoreMode;
  endpoint?: string;
  heartbeat?: HeartbeatResult;
}

const log = (level: LogLevel, message: string, extra?: Record<string, unknown>) => {
  if (extra) {
    console[level](`${LOG_PREFIX} ${message}`, extra);
  } else {
    console[level](`${LOG_PREFIX} ${message}`);
  }
};

export async function createVectorStoreClient(env: KBEnv, opts?: { strict?: boolean }): Promise<VectorStoreHandle> {
  const strict = opts?.strict ?? false;
  const wantDuckDB = env.LOCAL_EMBED_STORE === 'duckdb' || env.KB_DRY_RUN;

  if (wantDuckDB) {
    log('info', 'Initializing local DuckDB vector store', {
      persist_dir: env.INDEX_DIR,
    });
    const duckClient = await createDuckDBClient(env);
    log('info', 'Using store=duckdb');
    return {
      client: duckClient,
      mode: 'duckdb',
      endpoint: join(env.INDEX_DIR, 'duckdb', 'chroma.duckdb'),
    };
  }

  const normalizedUrl = env.CHROMA_URL.replace(/\/$/, '');
  const heartbeat = await waitForHeartbeat(normalizedUrl);

  if (!heartbeat.ok) {
    log('error', 'Chroma heartbeat failed', { endpoint: normalizedUrl, message: heartbeat.message });
    if (strict) {
      throw new Error(`Chroma heartbeat failed after ${HEARTBEAT_RETRIES} attempts (${normalizedUrl})`);
    }
    throw new Error(`Chroma endpoint ${normalizedUrl} is unreachable. Set LOCAL_EMBED_STORE=duckdb or start Chroma.`);
  }

  log('info', `Chroma heartbeat OK at ${normalizedUrl}`, { elapsed_ms: heartbeat.elapsedMs });
  log('info', 'Using store=chroma-http', { endpoint: normalizedUrl });

  const client = new ChromaClient({ path: normalizedUrl });

  return {
    client: wrapHttpClient(client),
    mode: 'chroma-http',
    endpoint: normalizedUrl,
    heartbeat,
  };
}

async function waitForHeartbeat(url: string): Promise<HeartbeatResult> {
  let lastMessage: string | undefined;

  for (let attempt = 1; attempt <= HEARTBEAT_RETRIES; attempt++) {
    const start = Date.now();
    try {
      const response = await fetch(`${url}/api/v1/heartbeat`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      });
      const text = await response.text();
      if (!response.ok) {
        lastMessage = text;
        throw new Error(`HTTP ${response.status}`);
      }
      return {
        ok: true,
        endpoint: url,
        elapsedMs: Date.now() - start,
        message: text,
      };
    } catch (error) {
      lastMessage = error instanceof Error ? error.message : String(error);
      const delay = Math.min(HEARTBEAT_MAX_DELAY_MS, HEARTBEAT_BASE_DELAY_MS * Math.pow(2, attempt)) + Math.random() * 500;
      log('warn', `Heartbeat attempt ${attempt}/${HEARTBEAT_RETRIES} failed`, {
        endpoint: url,
        error: lastMessage,
        retry_in_ms: Math.round(delay),
      });
      if (attempt === HEARTBEAT_RETRIES) {
        break;
      }
      await sleep(delay);
    }
  }

  return {
    ok: false,
    endpoint: url,
    elapsedMs: 0,
    message: lastMessage,
  };
}

function wrapHttpClient(client: ChromaClient): VectorStoreClient {
  return {
    async getCollection(args) {
      const collection = await client.getCollection(args);
      return wrapHttpCollection(collection);
    },
    async createCollection(args) {
      const collection = await client.createCollection(args);
      return wrapHttpCollection(collection);
    },
  };
}

function wrapHttpCollection(collection: Collection): VectorStoreCollection {
  return {
    async upsert(args) {
      await collection.upsert(args as any);
    },
    async delete(args) {
      await collection.delete(args as any);
    },
  };
}

async function createDuckDBClient(env: KBEnv): Promise<VectorStoreClient> {
  const duckDir = join(env.INDEX_DIR, 'duckdb');
  mkdirSync(duckDir, { recursive: true });
  const dbPath = join(duckDir, 'chroma.duckdb');
  mkdirSync(dirname(dbPath), { recursive: true });

  const db = new duckdb.Database(dbPath);
  await bootstrapDuckDB(db);

  return {
    async getCollection({ name }) {
      await ensureCollectionRow(db, name);
      return new DuckDBCollection(db, name);
    },
    async createCollection({ name, metadata }) {
      await upsertCollectionRow(db, name, metadata);
      return new DuckDBCollection(db, name);
    },
    async close() {
      await closeDuckDB(db);
    },
  };
}

async function bootstrapDuckDB(db: duckdb.Database) {
  await run(db, `CREATE TABLE IF NOT EXISTS collections (
    name TEXT PRIMARY KEY,
    metadata TEXT
  );`);
  await run(db, `CREATE TABLE IF NOT EXISTS embeddings (
    collection TEXT,
    chunk_id TEXT,
    embedding TEXT,
    document TEXT,
    metadata TEXT,
    PRIMARY KEY(collection, chunk_id)
  );`);
}

async function ensureCollectionRow(db: duckdb.Database, name: string) {
  const rows = await all(db, `SELECT name FROM collections WHERE name = ?`, [name]);
  if (!rows.length) {
    await upsertCollectionRow(db, name);
  }
}

async function upsertCollectionRow(db: duckdb.Database, name: string, metadata?: Record<string, unknown>) {
  await run(
    db,
    `INSERT OR REPLACE INTO collections (name, metadata) VALUES (?, ?)`,
    [name, metadata ? JSON.stringify(metadata) : null],
  );
}

async function closeDuckDB(db: duckdb.Database) {
  await new Promise<void>((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

class DuckDBCollection implements VectorStoreCollection {
  constructor(private db: duckdb.Database, private name: string) {}

  async upsert(args: {
    ids: string[];
    embeddings: number[][];
    documents: string[];
    metadatas: Record<string, unknown>[];
  }): Promise<void> {
    const { ids, embeddings, documents, metadatas } = args;
    for (let i = 0; i < ids.length; i++) {
      await run(
        this.db,
        `INSERT OR REPLACE INTO embeddings (collection, chunk_id, embedding, document, metadata)
         VALUES (?, ?, ?, ?, ?)`,
        [
          this.name,
          ids[i],
          JSON.stringify(embeddings[i]),
          documents[i],
          JSON.stringify(metadatas[i]),
        ],
      );
    }
  }

  async delete(args: { ids: string[] }): Promise<void> {
    for (const id of args.ids) {
      await run(this.db, `DELETE FROM embeddings WHERE collection = ? AND chunk_id = ?`, [this.name, id]);
    }
  }
}

function run(db: duckdb.Database, sql: string, params: any[] = []) {
  return new Promise<void>((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function all<T = any>(db: duckdb.Database, sql: string, params: any[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as T[]);
      }
    });
  });
}

