import { mkdirSync, existsSync } from 'fs';
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
    try {
      const duckClient = await createDuckDBClient(env);
      log('info', 'Using store=duckdb');
      return {
        client: duckClient,
        mode: 'duckdb',
        endpoint: join(env.INDEX_DIR, 'duckdb', 'chroma.duckdb'),
      };
    } catch (error) {
      log('error', 'DuckDB initialization failed', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`DuckDB initialization failed: ${error instanceof Error ? error.message : String(error)}. Please start Chroma server with: docker-compose -f docker-compose.chroma.yml up -d`);
    }
  }

  const normalizedUrl = env.CHROMA_URL.replace(/\/$/, '');
  
  // Check if CHROMA_URL is a local file path (not http:// or https://)
  const isLocalPath = !normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://');
  
  if (isLocalPath) {
    // ChromaClient can work with local paths directly
    const localPath = normalizedUrl.startsWith('./') || normalizedUrl.startsWith('/') 
      ? normalizedUrl 
      : join(process.cwd(), normalizedUrl);
    
    log('info', 'Using ChromaClient with local path', { path: localPath });
    mkdirSync(dirname(localPath), { recursive: true });
    
    const client = new ChromaClient({ path: localPath });
    
    return {
      client: wrapHttpClient(client),
      mode: 'chroma-http',
      endpoint: localPath,
    };
  }
  
  // HTTP endpoint - check heartbeat
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
      // Use v2 API (v1 is deprecated and returns 410)
      const response = await fetch(`${url}/api/v2/heartbeat`, {
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
      // ChromaClient.getCollection may require embeddingFunction, but we handle that in our wrapper
      const collection = await client.getCollection({ name: args.name } as any);
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

  log('info', 'Creating DuckDB database', { path: dbPath });
  
  // DuckDB v1.4.2: Database constructor is synchronous, but connect() is async
  const db = new duckdb.Database(dbPath);
  log('info', 'Database object created');
  
  log('info', 'Getting connection for bootstrap...');
  const connection = await getConnection(db);
  log('info', 'Connection obtained, bootstrapping...');
  
  try {
    await bootstrapDuckDB(connection);
    log('info', 'Bootstrap completed successfully');
  } catch (error) {
    log('error', 'Bootstrap failed', { error: error instanceof Error ? error.message : String(error) });
    connection.close();
    throw error;
  }

  return {
    async getCollection({ name }) {
      log('info', 'Getting collection', { name });
      const conn = await getConnection(db);
      try {
        await ensureCollectionRow(conn, name);
        return new DuckDBCollection(db, name);
      } catch (error) {
        conn.close();
        throw error;
      }
    },
    async createCollection({ name, metadata }) {
      log('info', 'Creating collection', { name });
      const conn = await getConnection(db);
      try {
        await upsertCollectionRow(conn, name, metadata);
        return new DuckDBCollection(db, name);
      } catch (error) {
        conn.close();
        throw error;
      }
    },
    async close() {
      await closeDuckDB(db);
    },
  };
}

function getConnection(db: duckdb.Database): Promise<duckdb.Connection> {
  return new Promise((resolve, reject) => {
    // Try immediate synchronous access first (some DuckDB versions support this)
    if ((db as any).connection && typeof (db as any).connection === 'object') {
      log('info', 'Using synchronous connection property');
      resolve((db as any).connection);
      return;
    }
    
    const timeout = setTimeout(() => {
      log('error', 'Connection timeout after 3 seconds');
      reject(new Error('DuckDB connect() callback timeout - the connect() method may not be working in this version'));
    }, 3000);
    
    try {
      // DuckDB v1.4.2: Try standard connect() callback
      // The callback signature is: (err, connection) => void
      (db as any).connect((err: Error | null, connection: duckdb.Connection | null) => {
        clearTimeout(timeout);
        if (err) {
          log('error', 'Failed to get connection', { error: err.message });
          reject(err);
        } else if (!connection) {
          log('error', 'Connection is null');
          reject(new Error('Connection is null'));
        } else {
          log('info', 'Connection obtained successfully via callback');
          resolve(connection);
        }
      });
    } catch (error) {
      clearTimeout(timeout);
      log('error', 'Exception getting connection', { error: error instanceof Error ? error.message : String(error) });
      reject(error);
    }
  });
}

async function bootstrapDuckDB(conn: duckdb.Connection) {
  log('info', 'Bootstrapping DuckDB tables...');
  try {
    await run(conn, `CREATE TABLE IF NOT EXISTS collections (
      name TEXT PRIMARY KEY,
      metadata TEXT
    );`);
    log('info', 'Created collections table');
    await run(conn, `CREATE TABLE IF NOT EXISTS embeddings (
      collection TEXT,
      chunk_id TEXT,
      embedding TEXT,
      document TEXT,
      metadata TEXT,
      PRIMARY KEY(collection, chunk_id)
    );`);
    log('info', 'Created embeddings table');
  } catch (error) {
    log('error', 'Bootstrap failed', { error: error instanceof Error ? error.message : String(error) });
    throw error;
  } finally {
    conn.close();
  }
}

async function ensureCollectionRow(conn: duckdb.Connection, name: string) {
  const rows = await all(conn, `SELECT name FROM collections WHERE name = ?`, [name]);
  if (!rows.length) {
    await upsertCollectionRow(conn, name);
  }
  conn.close();
}

async function upsertCollectionRow(conn: duckdb.Connection, name: string, metadata?: Record<string, unknown>) {
  await run(
    conn,
    `INSERT OR REPLACE INTO collections (name, metadata) VALUES (?, ?)`,
    [name, metadata ? JSON.stringify(metadata) : null],
  );
  conn.close();
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
    const conn = await getConnection(this.db);
    try {
      for (let i = 0; i < ids.length; i++) {
        await run(
          conn,
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
    } finally {
      conn.close();
    }
  }

  async delete(args: { ids: string[] }): Promise<void> {
    const conn = await getConnection(this.db);
    try {
      for (const id of args.ids) {
        await run(conn, `DELETE FROM embeddings WHERE collection = ? AND chunk_id = ?`, [this.name, id]);
      }
    } finally {
      conn.close();
    }
  }
}

function run(conn: duckdb.Connection, sql: string, params: any[] = []) {
  return new Promise<void>((resolve, reject) => {
    // Use prepare for all queries to ensure consistent parameter handling
    conn.prepare(sql, (err, stmt) => {
      if (err) {
        reject(err);
        return;
      }
      const runCallback = (runErr: Error | null) => {
        if (runErr) {
          stmt.finalize(() => {});
          reject(runErr);
        } else {
          stmt.finalize((finalizeErr: Error | null) => {
            if (finalizeErr) {
              reject(finalizeErr);
            } else {
              resolve();
            }
          });
        }
      };
      
      if (params.length === 0) {
        // No parameters - just run the statement
        stmt.run(runCallback);
      } else {
        // Has parameters - use apply to pass them correctly
        (stmt.run as any).apply(stmt, [...params, runCallback]);
      }
    });
  });
}

function all<T = any>(conn: duckdb.Connection, sql: string, params: any[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    // Use prepare for all queries to ensure consistent parameter handling
    conn.prepare(sql, (err, stmt) => {
      if (err) {
        reject(err);
        return;
      }
      const allCallback = (allErr: Error | null, rows: T[]) => {
        if (allErr) {
          stmt.finalize(() => {});
          reject(allErr);
        } else {
          stmt.finalize((finalizeErr: Error | null) => {
            if (finalizeErr) {
              reject(finalizeErr);
            } else {
              resolve(rows || []);
            }
          });
        }
      };
      
      if (params.length === 0) {
        // No parameters - just run the query
        stmt.all(allCallback);
      } else {
        // Has parameters - use apply to pass them correctly
        (stmt.all as any).apply(stmt, [...params, allCallback]);
      }
    });
  });
}

