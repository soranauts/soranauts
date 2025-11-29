import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type Term = {
  slug: string;
  title?: string;
  status?: string;
  targetSlug?: string | null;
  summary?: string | null;
  definition?: string | null;
  category?: string | null;
  aliases?: string[];
  tags?: string[];
  relatedTerms?: string[];
  links?: Array<{ label: string; url: string }>;
  examples?: string[];
  [key: string]: unknown;
};

type TaxonomyNode = {
  slug: string;
  title: string;
  summary?: string;
  definition?: string;
  category?: string;
  aliases?: string[];
  relatedTags?: string[];
  seeAlso?: string[];
  examples?: string[];
  links?: Array<{ label: string; url: string }>;
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

const normalizeKey = (value: string | null | undefined): string =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const taxonomyModulePath = path.join(repoRoot, 'apps/web/src/data/taxonomy.ts');
const taxonomyModule = (await import(pathToFileURL(taxonomyModulePath).href)) as {
  taxonomy: Record<string, TaxonomyNode & { aliases: string[] }>;
};
const taxonomyNodes = taxonomyModule.taxonomy ?? {};

const taxonomyBySlug = new Map<string, TaxonomyNode>();
const taxonomyByAlias = new Map<string, TaxonomyNode>();

for (const node of Object.values(taxonomyNodes)) {
  const normalizedSlug = normalizeKey(node.slug);
  if (normalizedSlug) {
    taxonomyBySlug.set(normalizedSlug, node);
  }
  for (const alias of node.aliases ?? []) {
    const normalizedAlias = normalizeKey(alias);
    if (normalizedAlias && !taxonomyByAlias.has(normalizedAlias)) {
      taxonomyByAlias.set(normalizedAlias, node);
    }
  }
}

const findTaxonomyNode = (slug: string): TaxonomyNode | undefined => {
  const normalized = normalizeKey(slug);
  if (!normalized) return undefined;
  return taxonomyBySlug.get(normalized) ?? taxonomyByAlias.get(normalized);
};

const coalesceString = (...values: Array<string | null | undefined>): string | null => {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length) return trimmed;
    }
  }
  return null;
};

const mergeArrays = <T>(...segments: Array<T[] | undefined>): T[] => {
  const merged = segments
    .flatMap((segment) => (Array.isArray(segment) ? segment : []))
    .map((entry) => (typeof entry === 'string' ? (entry as unknown as string).trim() : entry))
    .filter(Boolean) as T[];
  return Array.from(new Set(merged));
};

const enrichTerm = (term: Term): Term => {
  if (!term?.slug) return term;
  const taxonomyNode = findTaxonomyNode(term.slug);
  if (!taxonomyNode) {
    const fallbackDefinition =
      coalesceString(term.definition, term.summary) ?? 'Definition coming soon.';
    return {
      ...term,
      definition: fallbackDefinition,
      summary: term.summary ?? fallbackDefinition,
    };
  }

  const summary =
    coalesceString(term.summary, taxonomyNode.summary, taxonomyNode.definition) ?? null;
  const definition =
    coalesceString(term.definition, taxonomyNode.definition, summary) ?? 'Definition coming soon.';

  return {
    ...term,
    title: term.title ?? taxonomyNode.title ?? term.slug,
    summary,
    definition,
    category: term.category ?? taxonomyNode.category ?? null,
    aliases: mergeArrays(term.aliases as string[] | undefined, taxonomyNode.aliases),
    tags: mergeArrays(term.tags as string[] | undefined, taxonomyNode.relatedTags),
    relatedTerms: mergeArrays(term.relatedTerms as string[] | undefined, taxonomyNode.seeAlso),
    examples: mergeArrays(term.examples as string[] | undefined, taxonomyNode.examples),
    links: Array.isArray(term.links) && term.links.length ? term.links : taxonomyNode.links ?? [],
  };
};

const raw = fs.readFileSync(SRC, 'utf8');
const terms = parseTerms(JSON.parse(raw)).map(enrichTerm);

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

