import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const repoRoot = path.resolve(__dirname, '..');
const GLOSSARY_DATA_PATH = path.resolve(repoRoot, 'apps/web/public/data/glossary.v2025.json');

export interface GlossaryTerm {
  slug: string;
  title: string;
  status: 'canonical' | 'alias' | 'deprecated';
  summary?: string | null;
  targetSlug?: string | null;
  aliases?: string[];
}

export interface GlossaryDataset {
  terms: GlossaryTerm[];
  canonicalCount?: number;
  aliasCount?: number;
  deprecatedCount?: number;
}

export interface CacheEntry {
  mtime: number;
  slugs: string[];
}

export interface CacheMeta {
  glossKey?: string;
}

export interface SlugCache {
  meta?: CacheMeta;
  files: Record<string, CacheEntry>;
}

export async function readJSON<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

export async function writeJSON(filePath: string, value: unknown): Promise<void> {
  const payload = `${JSON.stringify(value, null, 2)}\n`;
  await fs.writeFile(filePath, payload, 'utf8');
}

export function extractGlossarySlugs(content: string): string[] {
  const regex = /(?<![A-Za-z~])\/glossary\/([a-z0-9-]+)/gi;
  const slugs: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    slugs.push(normalizeSlug(match[1]));
  }
  return slugs;
}

export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/^\/?glossary\//, '')
    .replace(/\/$/, '');
}

export async function collectReferencedSlugs(
  files: string[],
  options: {
    cache?: SlugCache;
    onFileProcessed?: (info: { file: string; reused: boolean }) => void;
    glossKey?: string;
  } = {},
): Promise<{ slugs: Set<string>; cache: SlugCache; stats: { parsed: number; reused: number } }> {
  const slugs = new Set<string>();
  const glossKey = options.glossKey ?? (await getGlossaryKey());
  const cacheKey = options.cache?.meta?.glossKey;
  const cacheValid = Boolean(cacheKey && cacheKey === glossKey);
  const cachedFiles = cacheValid ? options.cache?.files ?? {} : {};
  const nextCache: SlugCache = {
    meta: { glossKey },
    files: cacheValid ? { ...cachedFiles } : {},
  };
  const stats = { parsed: 0, reused: 0 };

  for (const input of files) {
    const absPath = path.isAbsolute(input) ? input : path.resolve(repoRoot, input);
    let stat;
    try {
      stat = await fs.stat(absPath);
    } catch {
      continue;
    }
    if (!stat.isFile()) continue;

    const relative = path.relative(repoRoot, absPath);
    const cached = cacheValid ? cachedFiles[relative] : undefined;
    let fileSlugs: string[];
    let reused = false;

    if (cached && cached.mtime === stat.mtimeMs) {
      fileSlugs = cached.slugs;
      stats.reused += 1;
      reused = true;
    } else {
      const content = await fs.readFile(absPath, 'utf8');
      fileSlugs = extractGlossarySlugs(content);
      stats.parsed += 1;
    }

    nextCache.files[relative] = { mtime: stat.mtimeMs, slugs: fileSlugs };
    for (const slug of fileSlugs) {
      slugs.add(slug);
    }

    options.onFileProcessed?.({ file: relative, reused });
  }

  return { slugs, cache: nextCache, stats };
}

export function slugToSources(slug: string): [string, string] {
  const base = `/glossary/${slug}`;
  return [base, `${base}/`];
}

export async function getGlossaryKey(): Promise<string> {
  try {
    const stat = await fs.stat(GLOSSARY_DATA_PATH);
    const content = await fs.readFile(GLOSSARY_DATA_PATH);
    const hash = createHash('sha1').update(content).digest('hex');
    return `${stat.mtimeMs}:${stat.size}:${hash}`;
  } catch {
    return 'missing-glossary';
  }
}
