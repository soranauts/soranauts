import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import fg from 'fast-glob';
import { createTwoFilesPatch } from 'diff';

import {
  CacheEntry,
  collectReferencedSlugs,
  GlossaryDataset,
  GlossaryTerm,
  SlugCache,
  getGlossaryKey,
  normalizeSlug,
  readJSON,
  repoRoot,
  slugToSources,
  writeJSON,
} from './glossary-utils';

interface RedirectRule {
  source: string;
  destination: string;
  permanent?: boolean;
}

interface VercelConfig {
  redirects?: RedirectRule[];
  [key: string]: unknown;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SCAN_PATHS = ['apps/web/src', 'apps/web/src/content'];
const DEFAULT_EXCLUDES = [
  'node_modules',
  '.git',
  'dist',
  '.vercel',
  '.astro',
  '.next',
  '.cache',
];
const DEFAULT_IGNORE_GLOBS = DEFAULT_EXCLUDES.map((entry) => `**/${entry}/**`);
const SUPPORTED_EXTS = new Set(['.md', '.mdx', '.ts', '.tsx', '.astro']);

const LEGACY_MAP: Record<string, string> = {
  'liquidity-pool': 'liquidity',
  'hyperledger-iroha-2': 'iroha2',
};

const GLOSSARY_PATH = path.resolve(repoRoot, 'glossary.v2025.json');
const VERCEL_PATH = path.resolve(repoRoot, 'apps/web/vercel.json');
const CACHE_FILE = path.resolve(repoRoot, '.cache/glossary-audit-mtime.json');
const COLLATOR = new Intl.Collator('en', { sensitivity: 'case', numeric: true });

const COLORS = {
  green: (value: string) => `\x1b[32m${value}\x1b[0m`,
  yellow: (value: string) => `\x1b[33m${value}\x1b[0m`,
  red: (value: string) => `\x1b[31m${value}\x1b[0m`,
};

interface CliOptions {
  fix: boolean;
  addStubs: boolean;
  paths: string[];
  exclude: string[];
  fileList?: string;
  since?: string;
  changedOnly: boolean;
  debug: boolean;
}

interface ScanResult {
  files: string[];
  source: string;
}

interface GlossaryPartition {
  rules: RedirectRule[];
  range: { start: number; count: number };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const dataset = await readJSON<GlossaryDataset>(GLOSSARY_PATH);
  const vercelConfig: VercelConfig = await readJSON(VERCEL_PATH);

  const cache = await loadCache(CACHE_FILE);
  const glossaryKey = await getGlossaryKey();
  const cacheStale = (cache.meta?.glossKey ?? null) !== glossaryKey;

  const scanStart = Date.now();
  const scanResult = await resolveFiles(options, cacheStale);
  if (options.debug) {
    console.log(
      `[glossary] resolved ${scanResult.files.length} file(s) via ${scanResult.source} in ${
        Date.now() - scanStart
      }ms`,
    );
  }

  if (scanResult.files.length === 0) {
    console.log(COLORS.green('No files to scan; glossary audit clean.'));
    process.exit(0);
  }

  let processed = 0;
  const { slugs: referencedSlugs, cache: nextCache, stats } = await collectReferencedSlugs(
    scanResult.files,
    {
      cache,
      glossKey: glossaryKey,
      onFileProcessed: ({ reused }) => {
        processed += 1;
        if (options.debug && (processed % 100 === 0 || processed === scanResult.files.length)) {
          console.log(
            `scanned ${processed}/${scanResult.files.length} files…${reused ? ' (cache)' : ''}`,
          );
        }
      },
    },
  );
  await saveCache(CACHE_FILE, nextCache);

  if (options.debug) {
    console.log(
      `[glossary] parsed ${stats.parsed} file(s); reused ${stats.reused} from cache (total ${scanResult.files.length})`,
    );
  }

  const { canonicalMap, aliasMap } = buildGlossaryMaps(dataset);
  const missingCanonicals = findMissingCanonicals(referencedSlugs, canonicalMap, aliasMap);

  const originalRedirects = vercelConfig.redirects ?? [];
  const { rules: glossaryRules, range } = partitionRedirects(originalRedirects);

  const redirectSources = new Set(glossaryRules.map((rule) => rule.source));
  const missingRedirects = findMissingRedirects(referencedSlugs, aliasMap, redirectSources);

  const referencedSources = new Set<string>();
  for (const slug of referencedSlugs) {
    const [base, withSlash] = slugToSources(slug);
    referencedSources.add(normalizeSource(base));
    referencedSources.add(normalizeSource(withSlash));
  }
  const unusedRedirects = glossaryRules.filter((rule) => !referencedSources.has(rule.source));

  reportSummary(missingCanonicals, missingRedirects, unusedRedirects);

  let redirectChanges = false;
  if (missingRedirects.length) {
    for (const { alias, canonical } of missingRedirects) {
      const destination = `/glossary/${canonical}`;
      const [base, withSlash] = slugToSources(alias);
      redirectChanges =
        addRedirect(glossaryRules, redirectSources, base, destination) || redirectChanges;
      redirectChanges =
        addRedirect(glossaryRules, redirectSources, withSlash, destination) || redirectChanges;
    }
  }

  let stubsAdded: string[] = [];
  if (options.fix && options.addStubs && missingCanonicals.length) {
    for (const slug of missingCanonicals) {
      const stub = createStub(slug);
      dataset.push(stub);
      canonicalMap.set(slug, stub);
      stubsAdded.push(slug);
    }
  }

  const sortedGlossary = sortGlossaryRules(glossaryRules);
  const nextRedirects = [...originalRedirects];
  if (range.count > 0) {
    nextRedirects.splice(range.start, range.count, ...sortedGlossary);
  } else if (sortedGlossary.length) {
    nextRedirects.splice(range.start, 0, ...sortedGlossary);
  }

  const vercelBefore = JSON.stringify(vercelConfig, null, 2) + '\n';
  const vercelAfter = JSON.stringify({ ...vercelConfig, redirects: nextRedirects }, null, 2) + '\n';

  if (vercelBefore !== vercelAfter) {
    printDiff('apps/web/vercel.json', vercelBefore, vercelAfter);
    if (options.fix) {
      await writeJSON(VERCEL_PATH, {
        ...vercelConfig,
        redirects: nextRedirects,
      });
    }
  }

  if (options.fix && stubsAdded.length) {
    await writeJSON(GLOSSARY_PATH, dataset);
    console.log(`Added ${stubsAdded.length} canonical stub(s): ${stubsAdded.join(', ')}`);
  }

  if (!missingCanonicals.length && !missingRedirects.length) {
    console.log(COLORS.green('Glossary audit: no issues detected.'));
    process.exit(0);
  }

  if (options.fix) {
    console.log(COLORS.yellow('Glossary audit: remaining canonical gaps detected (no redirects pending).'));
    process.exit(0);
  }

  console.error(COLORS.red('\nGlossary audit failed. Run pnpm taxonomy:fix to resolve.'));
  if (missingCanonicals.length) {
    process.exit(11);
  }

  if (missingRedirects.length) {
    process.exit(10);
  }
}

function parseArgs(args: string[]): CliOptions {
  const opts: CliOptions = {
    fix: false,
    addStubs: false,
    paths: [...DEFAULT_SCAN_PATHS],
    exclude: [...DEFAULT_EXCLUDES],
    changedOnly: false,
    debug: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--fix':
        opts.fix = true;
        break;
      case '--add-stubs':
        opts.addStubs = true;
        break;
      case '--paths':
        opts.paths = parseList(args[++i]) ?? opts.paths;
        break;
      case '--exclude':
        opts.exclude = parseList(args[++i]) ?? opts.exclude;
        break;
      case '--filelist':
        opts.fileList = args[++i];
        break;
      case '--since':
        opts.since = args[++i];
        break;
      case '--changed-only':
        opts.changedOnly = true;
        break;
      case '--debug':
        opts.debug = true;
        break;
      default:
        break;
    }
  }

  return opts;
}

function parseList(value?: string): string[] | undefined {
  if (!value) return undefined;
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function resolveFiles(options: CliOptions, forceFullScan = false): Promise<ScanResult> {
  const cacheExists = await fileExists(CACHE_FILE);
  if (options.fileList) {
    try {
      const content = await fs.readFile(path.resolve(repoRoot, options.fileList), 'utf8');
      const files = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const filtered = filterFiles(files, options.paths, options.exclude);
      return { files: filtered, source: '--filelist' };
    } catch {
      // ignored
    }
  }

  const diffFiles = getChangedFiles(options);
  if (diffFiles.length) {
    const filtered = filterFiles(diffFiles, options.paths, options.exclude);
    if (filtered.length) return { files: filtered, source: 'git-diff' };
  }

  if ((options.changedOnly || options.since) && cacheExists && !forceFullScan) {
    return { files: [], source: 'git-diff (empty)' };
  }

  const globPatterns = options.paths.map((p) => {
    const normalized = normalizePath(p);
    return `${normalized}/**/*.{md,mdx,ts,tsx,astro}`;
  });

  const files = await fg(globPatterns, {
    cwd: repoRoot,
    dot: false,
    onlyFiles: true,
    unique: true,
    ignore: [
      ...DEFAULT_IGNORE_GLOBS,
      ...options.exclude.map((entry) => `${normalizePath(entry)}/**`),
    ],
  });

  const filtered = filterFiles(files, options.paths, options.exclude);
  return { files: filtered, source: 'fast-glob' };
}

function getChangedFiles(options: CliOptions): string[] {
  const ref = options.since ?? 'origin/main';
  if (!options.changedOnly && !options.since) {
    return [];
  }
  const range = options.since ? ref : `${ref}...HEAD`;
  if (range.startsWith('-')) {
    // Avoid accidental option parsing if an invalid ref is provided.
    return [];
  }
  try {
    const output = execFileSync('git', ['diff', '--name-only', range], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return output.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

function normalizePath(input: string): string {
  const absolute = path.isAbsolute(input) ? input : path.resolve(repoRoot, input);
  return path.relative(repoRoot, absolute).replace(/\\/g, '/');
}

function filterFiles(files: string[], includeRoots: string[], excludeRoots: string[]): string[] {
  const includes = includeRoots.length
    ? includeRoots.map(normalizePath)
    : DEFAULT_SCAN_PATHS.map(normalizePath);
  const excludes = excludeRoots.map(normalizePath);

  return files
    .map((file) => normalizePath(file))
    .filter((file) => SUPPORTED_EXTS.has(path.extname(file)))
    .filter((file) => includes.some((root) => file === root || file.startsWith(`${root}/`)))
    .filter((file) => !excludes.some((root) => file === root || file.startsWith(`${root}/`)));
}

function buildGlossaryMaps(dataset: GlossaryDataset) {
  const canonicalMap = new Map<string, GlossaryTerm>();
  const aliasMap = new Map<string, string>();

  for (const term of dataset) {
    const slug = normalizeSlug(term.slug);
    if (term.status === 'canonical') {
      canonicalMap.set(slug, term);
      if (Array.isArray(term.aliases)) {
        for (const alias of term.aliases) {
          aliasMap.set(normalizeSlug(alias), slug);
        }
      }
    } else if (term.status === 'alias' && term.targetSlug) {
      aliasMap.set(slug, normalizeSlug(term.targetSlug));
    }
  }

  for (const [legacy, canonical] of Object.entries(LEGACY_MAP)) {
    aliasMap.set(normalizeSlug(legacy), normalizeSlug(canonical));
  }

  return { canonicalMap, aliasMap };
}

function findMissingCanonicals(
  referencedSlugs: Set<string>,
  canonicalMap: Map<string, GlossaryTerm>,
  aliasMap: Map<string, string>,
): string[] {
  const missing: string[] = [];
  for (const slug of referencedSlugs) {
    if (!canonicalMap.has(slug) && !aliasMap.has(slug)) {
      missing.push(slug);
    }
  }
  return missing.sort();
}

function findMissingRedirects(
  referencedSlugs: Set<string>,
  aliasMap: Map<string, string>,
  redirectSources: Set<string>,
): { alias: string; canonical: string }[] {
  const missing: { alias: string; canonical: string }[] = [];
  for (const slug of referencedSlugs) {
    const canonical = aliasMap.get(slug);
    if (!canonical) continue;
    const [base, withSlash] = slugToSources(slug);
    if (
      !redirectSources.has(normalizeSource(base)) ||
      !redirectSources.has(normalizeSource(withSlash))
    ) {
      missing.push({ alias: slug, canonical });
    }
  }
  return missing;
}

function sortGlossaryRules(rules: RedirectRule[]): RedirectRule[] {
  const seen = new Map<string, RedirectRule>();
  for (const rule of rules) {
    seen.set(rule.source, rule);
  }
  return [...seen.values()].sort((a, b) => {
    const sourceCompare = COLLATOR.compare(a.source, b.source);
    if (sourceCompare !== 0) return sourceCompare;
    return COLLATOR.compare(a.destination, b.destination);
  });
}

function reportSummary(
  missingCanonicals: string[],
  missingRedirects: { alias: string; canonical: string }[],
  unusedRedirects: RedirectRule[],
) {
  if (!missingCanonicals.length && !missingRedirects.length) {
    console.log(COLORS.green('Glossary audit: no issues detected.'));
  } else {
    console.log(COLORS.yellow('Glossary audit summary:'));
    console.log(`  Missing canonicals: ${missingCanonicals.length}`);
    console.log(`  Missing redirects: ${missingRedirects.length}`);
  }

  if (missingCanonicals.length) {
    console.log('\nMissing canonical slugs:');
    for (const slug of missingCanonicals) {
      console.log(` - ${slug}`);
    }
  }

  if (missingRedirects.length) {
    console.log('\nMissing redirects:');
    for (const entry of missingRedirects) {
      console.log(` - ${entry.alias} → ${entry.canonical}`);
    }
  }

  if (unusedRedirects.length) {
    console.log('\nUnused glossary redirects:');
    for (const rule of unusedRedirects) {
      console.log(` - ${rule.source} (${rule.destination})`);
    }
  }
}

function normalizeSource(source: string): string {
  if (source === '/') return '/';
  const normalized = source.replace(/\/+$/, '') || '/';
  return normalized.startsWith('/glossary/') ? normalized : source;
}

function partitionRedirects(rules: RedirectRule[]): GlossaryPartition {
  const glossary: RedirectRule[] = [];
  let start = Number.POSITIVE_INFINITY;
  let end = Number.NEGATIVE_INFINITY;
  rules.forEach((rule, index) => {
    if (rule.source.startsWith('/glossary/')) {
      glossary.push({
        source: normalizeSource(rule.source),
        destination: rule.destination,
        permanent: rule.permanent !== false,
      });
      start = Math.min(start, index);
      end = Math.max(end, index);
    }
  });
  if (!Number.isFinite(start)) {
    return { rules: glossary, range: { start: rules.length, count: 0 } };
  }
  return { rules: glossary, range: { start, count: end - start + 1 } };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function addRedirect(
  redirects: RedirectRule[],
  seen: Set<string>,
  source: string,
  destination: string,
): boolean {
  const normalizedSource = normalizeSource(source);
  if (!normalizedSource.startsWith('/glossary/')) return false;
  if (seen.has(normalizedSource)) return false;
  redirects.push({ source: normalizedSource, destination, permanent: true });
  seen.add(normalizedSource);
  return true;
}

function createStub(slug: string): GlossaryTerm {
  const title = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  return {
    slug,
    title,
    status: 'canonical',
    summary: '',
    targetSlug: null,
    aliases: [],
  };
}

function printDiff(filePath: string, before: string, after: string) {
  const diff = createTwoFilesPatch(filePath, filePath, before, after, '', '', { context: 2 });
  console.log(`\n${COLORS.yellow('Proposed changes for')} ${filePath}:\n${diff}`);
}

async function loadCache(filePath: string): Promise<SlugCache> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as SlugCache & Record<string, unknown>;
    if (parsed && typeof parsed === 'object' && 'files' in parsed) {
      return {
        meta: parsed.meta,
        files: (parsed as SlugCache).files ?? {},
      };
    }
    return { files: (parsed as Record<string, CacheEntry>) ?? {} };
  } catch {
    return { files: {} };
  }
}

async function saveCache(filePath: string, cache: SlugCache): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(COLORS.red('[glossary:audit] failed'), error);
  process.exit(1);
});
