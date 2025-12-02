import { normalizeGlossaryFull, normalizeGlossaryIndex } from './glossary-normalize';

export type Term = { slug: string; title?: string; [k: string]: any };
export type IndexEntry = { slug: string; title: string };

const isServer = typeof window === 'undefined';

async function readServerJSON<T>(target: string): Promise<T> {
  const [{ readFile }, { fileURLToPath }, { resolve }] = await Promise.all([
    import('node:fs/promises'),
    import('node:url'),
    import('node:path'),
  ]);
  const filePath = fileURLToPath(new URL(`../../public${target}`, import.meta.url));
  const absolute = resolve(filePath);
  const payload = await readFile(absolute, 'utf-8');
  return JSON.parse(payload) as T;
}

async function getJSON<T>(path: string): Promise<T> {
  if (isServer) {
    return readServerJSON<T>(path);
  }
  // Use no-store in development to avoid stale data, force-cache in production
  const isDev = import.meta.env?.DEV ?? false;
  const res = await fetch(path, { cache: isDev ? 'no-store' : 'force-cache' });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Loads /glossary.json and returns an array of Term (compat with both shapes). */
export async function loadGlossaryFull(): Promise<Term[]> {
  const payload = await getJSON<unknown>('/glossary.json');
  return normalizeGlossaryFull(payload as any);
}

/** Loads /glossary.index.json (or derives from full) and returns [{slug,title}] */
export async function loadGlossaryIndex(): Promise<IndexEntry[]> {
  try {
    const idx = await getJSON<unknown>('/glossary.index.json');
    return normalizeGlossaryIndex(idx as any);
  } catch {
    const full = await loadGlossaryFull();
    return normalizeGlossaryIndex([], full);
  }
}

