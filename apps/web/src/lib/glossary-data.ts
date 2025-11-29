import { normalizeGlossaryFull, normalizeGlossaryIndex } from './glossary-normalize';

export type Term = { slug: string; title?: string; [k: string]: any };
export type IndexEntry = { slug: string; title: string };

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'force-cache' });
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

