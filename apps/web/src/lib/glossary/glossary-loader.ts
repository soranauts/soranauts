import legacyGlossary from '../../../public/glossary.json';
import glossaryV2025 from '../../../public/glossary.v2025.json';
import glossaryAliasesV2025 from '../../../public/glossary.aliases.v2025.json';
import { FEATURE_GLOSSARY_V2025 } from '../../config/feature-flags';

type LegacyGlossaryData = typeof legacyGlossary;
type LegacyGlossaryTerm = LegacyGlossaryData['terms'][number];

type Glossary2025Data = typeof glossaryV2025;
type Glossary2025Term = Glossary2025Data['terms'][number];

interface GlossaryAliasesV2025Data {
  aliases: Array<{ alias: string; target: string }>;
}
type GlossaryAliasesV2025 = typeof glossaryAliasesV2025 extends GlossaryAliasesV2025Data
  ? GlossaryAliasesV2025Data
  : GlossaryAliasesV2025Data;

export type GlossaryStatus = 'canonical' | 'alias' | 'deprecated';

export interface GlossaryEntry {
  slug: string;
  term: string;
  definition: string;
  category?: string;
  aliases: string[];
  tags: string[];
  relatedTerms: string[];
  priority: number;
  type?: string;
  entity?: string;
  versions?: string[];
  summary: string | null;
  seeAlso?: string[];
  relatedTags?: string[];
  examples?: string[];
  links?: { label: string; url: string }[];
  status: GlossaryStatus;
  targetSlug: string | null;
}

interface AliasInfo {
  alias: string;
  canonicalSlug: string;
  status: GlossaryStatus;
  targetSlug: string | null;
}

interface GlossaryCache {
  canonical: Map<string, GlossaryEntry>;
  alias: Map<string, AliasInfo>;
  deprecated: Map<string, GlossaryEntry>;
  ordered: GlossaryEntry[];
}

interface GlossaryMetadata {
  totalCount: number;
  lastUpdated?: string;
}

const normalizeSlug = (value: string): string => value?.trim().toLowerCase() ?? '';

const legacyLookup = new Map<string, LegacyGlossaryTerm>(
  legacyGlossary.terms.map((term) => [normalizeSlug(term.slug), term]),
);

const buildLegacyEntry = (term: LegacyGlossaryTerm): GlossaryEntry => ({
  slug: normalizeSlug(term.slug),
  term: term.term ?? term.slug,
  definition: term.definition ?? '',
  category: term.category,
  aliases: [...(term.aliases ?? [])],
  tags: [...(term.tags ?? [])],
  relatedTerms: [...(term.relatedTerms ?? [])],
  priority: typeof term.priority === 'number' ? term.priority : 0,
  type: term.type,
  entity: term.entity,
  versions: term.versions,
  summary: term.summary ?? term.definition ?? null,
  seeAlso: term.seeAlso,
  relatedTags: term.relatedTags,
  examples: term.examples,
  links: term.links,
  status: 'canonical',
  targetSlug: null,
});

const buildLegacyCache = (): GlossaryCache => {
  const canonical = new Map<string, GlossaryEntry>();
  const alias = new Map<string, AliasInfo>();
  const deprecated = new Map<string, GlossaryEntry>();
  const ordered: GlossaryEntry[] = [];

  for (const term of legacyGlossary.terms) {
    const entry = buildLegacyEntry(term);
    canonical.set(entry.slug, entry);
    ordered.push(entry);

    for (const aliasSlug of term.aliases ?? []) {
      const normalizedAlias = normalizeSlug(aliasSlug);
      if (!normalizedAlias) continue;
      alias.set(normalizedAlias, {
        alias: normalizedAlias,
        canonicalSlug: entry.slug,
        status: 'alias',
        targetSlug: entry.slug,
      });
    }
  }

  return { canonical, alias, deprecated, ordered };
};

const mergeEntry = (
  canonicalTerm: Glossary2025Term,
  legacyTerm?: LegacyGlossaryTerm,
): GlossaryEntry => {
  const slug = normalizeSlug(canonicalTerm.slug);
  const legacyEntry = legacyTerm ? buildLegacyEntry(legacyTerm) : null;
  return {
    slug,
    term: legacyEntry?.term ?? canonicalTerm.title ?? slug,
    definition: legacyEntry?.definition ?? '',
    category: legacyEntry?.category,
    aliases: legacyEntry?.aliases ?? [],
    tags: legacyEntry?.tags ?? [],
    relatedTerms: legacyEntry?.relatedTerms ?? [],
    priority: legacyEntry?.priority ?? 0,
    type: legacyEntry?.type,
    entity: legacyEntry?.entity,
    versions: legacyEntry?.versions,
    summary: canonicalTerm.summary ?? legacyEntry?.summary ?? null,
    seeAlso: legacyEntry?.seeAlso,
    relatedTags: legacyEntry?.relatedTags,
    examples: legacyEntry?.examples,
    links: legacyEntry?.links,
    status: canonicalTerm.status,
    targetSlug: canonicalTerm.targetSlug,
  };
};

const buildV2025Cache = (): GlossaryCache => {
  const canonical = new Map<string, GlossaryEntry>();
  const alias = new Map<string, AliasInfo>();
  const deprecated = new Map<string, GlossaryEntry>();
  const ordered: GlossaryEntry[] = [];

  for (const term of glossaryV2025.terms) {
    const normalizedSlug = normalizeSlug(term.slug);
    if (term.status === 'alias') {
      alias.set(normalizedSlug, {
        alias: normalizedSlug,
        canonicalSlug: normalizeSlug(term.targetSlug ?? term.slug),
        status: 'alias',
        targetSlug: term.targetSlug ? normalizeSlug(term.targetSlug) : null,
      });
      continue;
    }

    const legacy = legacyLookup.get(normalizedSlug);
    const entry = mergeEntry(term, legacy);

    if (term.status === 'deprecated') {
      deprecated.set(normalizedSlug, entry);
    } else {
      canonical.set(normalizedSlug, entry);
      ordered.push(entry);
    }
  }

  for (const aliasEntry of (glossaryAliasesV2025 as GlossaryAliasesV2025).aliases) {
    const normalizedAlias = normalizeSlug(aliasEntry.alias);
    const targetSlug = normalizeSlug(aliasEntry.target);
    if (!normalizedAlias || !targetSlug) continue;
    alias.set(normalizedAlias, {
      alias: normalizedAlias,
      canonicalSlug: targetSlug,
      status: 'alias',
      targetSlug,
    });
  }

  // Include legacy-only aliases for completeness
  for (const [slug, legacyTerm] of legacyLookup.entries()) {
    const entry = canonical.get(slug);
    if (!entry) continue;
    for (const aliasSlug of legacyTerm.aliases ?? []) {
      const normalizedAlias = normalizeSlug(aliasSlug);
      if (!normalizedAlias || alias.has(normalizedAlias)) continue;
      alias.set(normalizedAlias, {
        alias: normalizedAlias,
        canonicalSlug: entry.slug,
        status: 'alias',
        targetSlug: entry.slug,
      });
    }
  }

  return { canonical, alias, deprecated, ordered };
};

let cachedMode: 'legacy' | 'v2025' | null = null;
let cachedGlossary: GlossaryCache | null = null;

const getCache = (): GlossaryCache => {
  const mode: 'legacy' | 'v2025' = FEATURE_GLOSSARY_V2025 ? 'v2025' : 'legacy';
  if (!cachedGlossary || cachedMode !== mode) {
    cachedGlossary = mode === 'v2025' ? buildV2025Cache() : buildLegacyCache();
    cachedMode = mode;
  }
  return cachedGlossary;
};

const legacyMetadata: GlossaryMetadata = {
  totalCount: legacyGlossary.totalCount ?? legacyGlossary.terms.length,
  lastUpdated: legacyGlossary.lastUpdated,
};

const v2025Metadata: GlossaryMetadata = {
  totalCount: glossaryV2025.terms.length,
  lastUpdated: legacyMetadata.lastUpdated,
};

export const getGlossaryMetadata = (): GlossaryMetadata =>
  FEATURE_GLOSSARY_V2025 ? v2025Metadata : legacyMetadata;

const resolveCanonicalSlug = (slug: string): string => {
  const normalized = normalizeSlug(slug);
  if (!normalized) return '';
  const cache = getCache();
  if (cache.canonical.has(normalized)) return normalized;
  const aliasInfo = cache.alias.get(normalized);
  if (aliasInfo) return aliasInfo.canonicalSlug;
  const deprecatedEntry = cache.deprecated.get(normalized);
  if (deprecatedEntry) return deprecatedEntry.targetSlug ?? deprecatedEntry.slug;
  return normalized;
};

export const getGlossaryTerm = (slug: string): GlossaryEntry | null => {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  const cache = getCache();
  const canonicalEntry = cache.canonical.get(normalized);
  if (canonicalEntry) return canonicalEntry;

  const aliasInfo = cache.alias.get(normalized);
  if (aliasInfo) {
    return cache.canonical.get(aliasInfo.canonicalSlug) ?? null;
  }

  const deprecatedEntry = cache.deprecated.get(normalized);
  if (deprecatedEntry) return deprecatedEntry;

  return null;
};

export const getCanonicalSlug = (slug: string): string => resolveCanonicalSlug(slug);

export const resolveAlias = (slug: string): GlossaryEntry | null => {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  const cache = getCache();
  const aliasInfo = cache.alias.get(normalized);
  if (!aliasInfo) return null;
  return cache.canonical.get(aliasInfo.canonicalSlug) ?? null;
};

export const getAllTerms = (): GlossaryEntry[] => {
  const cache = getCache();
  return cache.ordered.slice();
};

export const getAliasEntries = (): AliasInfo[] => {
  const cache = getCache();
  return Array.from(cache.alias.values());
};

export const getStatus = (slug: string): GlossaryStatus | null => {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  const cache = getCache();
  if (cache.canonical.has(normalized)) return 'canonical';
  if (cache.alias.has(normalized)) return 'alias';
  if (cache.deprecated.has(normalized)) return 'deprecated';
  return null;
};


