import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';

import { tagHubMetadata } from '../src/data/tag-hub.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../src/content/post');
const OUTPUT_PATH = path.join(__dirname, '../src/data/tag-stats.json');

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const toTagSlug = (value: string): string => `tag-${normalize(value).replace(/\s+/g, '-')}`;

type InternalTagStat = {
  count: number;
  firstSeen?: Date;
  lastSeen?: Date;
};

type TagStats = Record<
  string,
  {
    count: number;
    firstSeen?: string;
    lastSeen?: string;
  }
>;

const parseDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.valueOf())) return parsed;
  }
  return undefined;
};

const updateStat = (stats: Map<string, InternalTagStat>, slug: string, publish?: Date, lastSeen?: Date) => {
  const entry = stats.get(slug) ?? { count: 0 };
  entry.count += 1;

  if (publish) {
    entry.firstSeen =
      entry.firstSeen && entry.firstSeen.valueOf() <= publish.valueOf() ? entry.firstSeen : publish;
  }

  if (lastSeen) {
    entry.lastSeen =
      entry.lastSeen && entry.lastSeen.valueOf() >= lastSeen.valueOf() ? entry.lastSeen : lastSeen;
  }

  stats.set(slug, entry);
};

const collectFromPosts = (): Map<string, InternalTagStat> => {
  const stats = new Map<string, InternalTagStat>();

  if (!fs.existsSync(POSTS_DIR)) {
    return stats;
  }

  const entries = fs.readdirSync(POSTS_DIR);
  for (const entry of entries) {
    if (!entry.endsWith('.mdx') && !entry.endsWith('.md')) continue;
    const filePath = path.join(POSTS_DIR, entry);
    const file = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(file);

    const publishDate = parseDate(data?.publishDate);
    const updateDate = parseDate(data?.updateDate);
    const effectiveLastSeen = updateDate ?? publishDate;

    const rawTags: unknown = data?.tags;
    const tags: string[] = Array.isArray(rawTags) ? rawTags : [];
    const uniqueTags = Array.from(
      new Set(
        tags
          .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
          .map((tag) => tag.trim()),
      ),
    );

    for (const tag of uniqueTags) {
      const slug = toTagSlug(tag);
      updateStat(stats, slug, publishDate, effectiveLastSeen);
    }
  }

  return stats;
};

const ensureMetadataTags = (stats: Map<string, InternalTagStat>) => {
  Object.keys(tagHubMetadata).forEach((slug) => {
    if (!stats.has(slug)) {
      stats.set(slug, { count: 0 });
    }
  });
};

const serializeStats = (stats: Map<string, InternalTagStat>): TagStats => {
  const entries = Array.from(stats.entries()).sort(([a], [b]) => a.localeCompare(b, 'en'));
  const record: TagStats = {};

  for (const [slug, stat] of entries) {
    const output: TagStats[string] = { count: stat.count };
    if (stat.firstSeen) {
      output.firstSeen = stat.firstSeen.toISOString();
    }
    if (stat.lastSeen) {
      output.lastSeen = stat.lastSeen.toISOString();
    }
    record[slug] = output;
  }

  return record;
};

const main = () => {
  const stats = collectFromPosts();
  ensureMetadataTags(stats);
  const serialized = serializeStats(stats);
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(serialized, null, 2)}\n`);
  console.log(`✅ Generated tag stats for ${Object.keys(serialized).length} tags.`);
};

main();


