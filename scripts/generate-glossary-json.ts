import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Term = {
  slug: string;
  title?: string;
  status?: string;
  targetSlug?: string | null;
  [key: string]: unknown;
};

const cmp = new Intl.Collator('en', { sensitivity: 'case', numeric: true }).compare;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const SRC = path.join(repoRoot, 'glossary.v2025.json');

const OUT_FULL = path.join(repoRoot, 'apps/web/public/glossary.json');
const OUT_IDX = path.join(repoRoot, 'apps/web/public/glossary.index.json');
const OUT_DATA = path.join(repoRoot, 'apps/web/public/data/glossary.v2025.json');

const parseTerms = (value: unknown): Term[] => {
  if (Array.isArray(value)) return value as Term[];
  if (value && typeof value === 'object' && Array.isArray((value as { terms?: Term[] }).terms)) {
    return (value as { terms: Term[] }).terms;
  }
  throw new Error('glossary.v2025.json must be an array or { "terms": [] }');
};

const raw = fs.readFileSync(SRC, 'utf8');
const terms = parseTerms(JSON.parse(raw));

const seen = new Set<string>();
for (const term of terms) {
  if (!term?.slug || typeof term.slug !== 'string') {
    throw new Error('Invalid glossary term: missing slug');
  }
  if (seen.has(term.slug)) {
    throw new Error(`Duplicate slug detected: ${term.slug}`);
  }
  seen.add(term.slug);
}

terms.sort((a, b) => cmp(a.slug, b.slug));

const writeIfDiff = (filePath: string, content: string) => {
  try {
    const existing = fs.readFileSync(filePath, 'utf8');
    if (existing === content) return;
  } catch {
    // ignore
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
};

const fullArray = JSON.stringify(terms, null, 2) + '\n';
const idxArray =
  JSON.stringify(
    terms.map((term) => ({
      slug: term.slug,
      title: typeof term.title === 'string' && term.title.length ? term.title : term.slug,
    })),
    null,
    2,
  ) + '\n';

writeIfDiff(OUT_FULL, fullArray);
writeIfDiff(OUT_IDX, idxArray);

const canonicalCount = terms.filter((term) => term.status === 'canonical').length;
const aliasCount = terms.filter((term) => term.status === 'alias').length;
const deprecatedCount = terms.filter((term) => term.status === 'deprecated').length;
const payload = {
  terms,
  canonicalCount,
  aliasCount,
  deprecatedCount,
  version: 2025,
};
writeIfDiff(OUT_DATA, JSON.stringify(payload, null, 2) + '\n');

console.log(
  [
    'Wrote arrays to:',
    `- ${OUT_FULL}  (len=${terms.length})`,
    `- ${OUT_IDX}   (len=${terms.length})`,
    `- ${OUT_DATA}  (object with metadata)`,
  ].join('\n'),
);

