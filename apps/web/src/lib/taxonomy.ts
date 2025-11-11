import { taxonomy, type TaxonomyNode, type TaxonomyNodeType } from '../data/taxonomy';

export type { TaxonomyNode, TaxonomyNodeType } from '../data/taxonomy';

export type TaxonomySlug = keyof typeof taxonomy;

type AliasEntry = {
  slug: TaxonomySlug;
  alias: string;
  type: TaxonomyNodeType;
};

const entities = Object.values(taxonomy);

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const normalizeTaxonomyValue = normalize;

export const toTagSlug = (value: string): string => `tag-${normalize(value).replace(/\s+/g, '-')}`;

const aliasEntries: AliasEntry[] = entities.flatMap((node) => {
  const aliases = new Set<string>([node.title, ...(node.aliases ?? [])]);
  return Array.from(aliases).map((alias) => ({
    slug: node.slug as TaxonomySlug,
    alias,
    type: node.type,
  }));
});

const aliasIndex = new Map<string, AliasEntry[]>();

for (const entry of aliasEntries) {
  const key = normalize(entry.alias);
  if (!aliasIndex.has(key)) {
    aliasIndex.set(key, []);
  }
  aliasIndex.get(key)!.push(entry);
}

const typePriority: Record<TaxonomyNodeType, number> = {
  entity: 3,
  version: 2,
  term: 1,
  tag: 0,
};

function sortAliasCandidates(entries: AliasEntry[]): AliasEntry[] {
  return entries.slice().sort((a, b) => typePriority[b.type] - typePriority[a.type]);
}

export function getTaxonomyNode(slug: string): TaxonomyNode | undefined {
  return taxonomy[slug as TaxonomySlug];
}

export function getTagNode(tagName: string): TaxonomyNode | undefined {
  return taxonomy[toTagSlug(tagName) as TaxonomySlug];
}

interface ResolveAliasResult {
  node: TaxonomyNode;
  matchedAlias: string;
}

export function resolveAlias(query: string): ResolveAliasResult | undefined {
  const key = normalize(query);
  const candidates = aliasIndex.get(key);
  if (!candidates || candidates.length === 0) {
    return undefined;
  }

  const [best] = sortAliasCandidates(candidates);
  const node = taxonomy[best.slug];
  if (!node) return undefined;
  return {
    node,
    matchedAlias: best.alias,
  };
}

export function getRelatedTags(slug: string): TaxonomyNode[] {
  const node = getTaxonomyNode(slug);
  if (!node?.relatedTags?.length) return [];
  return node.relatedTags
    .map((tag) => taxonomy[toTagSlug(tag) as TaxonomySlug])
    .filter((tag): tag is TaxonomyNode => Boolean(tag) && tag.type === 'tag');
}

export function getGlossaryForTag(tagSlug: string): TaxonomyNode | undefined {
  const tagNode = taxonomy[tagSlug as TaxonomySlug];
  if (!tagNode || tagNode.type !== 'tag') return undefined;
  if (tagNode.glossaryRef) {
    const slug = tagNode.glossaryRef.replace(/^\/glossary\//, '').replace(/\/$/, '');
    return taxonomy[slug as TaxonomySlug];
  }
  return undefined;
}

export interface AliasIndexEntry {
  alias: string;
  slug: string;
  type: TaxonomyNodeType;
}

export const clientAliasIndex: AliasIndexEntry[] = aliasEntries.map((entry) => ({
  alias: entry.alias,
  slug: entry.slug,
  type: entry.type,
}));

export const taxonomyNodes = entities;

