import legacyGlossary from '../../../public/glossary.json';
import glossaryV2025 from '../../../public/data/glossary.v2025.json';
import glossaryAliasesV2025 from '../../../public/glossary.aliases.v2025.json';
import { FEATURE_GLOSSARY_V2025 } from '../../config/feature-flags';
import { formatGlossaryTitle, isRenderableGlossaryEntry } from './format';

type LegacyGlossaryImport = typeof legacyGlossary;
type LegacyGlossaryTerm =
  LegacyGlossaryImport extends readonly (infer U)[]
    ? U
    : LegacyGlossaryImport extends { terms: readonly (infer U)[] }
    ? U
    : never;
type LegacyGlossaryData =
  | {
      terms: LegacyGlossaryTerm[];
      totalCount?: number;
      lastUpdated?: string;
    }
  | LegacyGlossaryTerm[];

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
  subtitle?: string | null;
  tagline?: string | null;
  seeAlso?: string[];
  relatedTags?: string[];
  examples?: string[];
  links?: { label: string; url: string }[];
  status: GlossaryStatus;
  targetSlug: string | null;
  publishDate?: string | null;
  updateDate?: string | null;
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
const PLACEHOLDER_SLUGS = new Set(['alias-redirect']);

const uniqueStrings = (...sources: Array<string[] | undefined | null>): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const source of sources) {
    if (!Array.isArray(source)) continue;
    for (const raw of source) {
      if (typeof raw !== 'string') continue;
      const value = raw.trim();
      if (!value) continue;
      if (seen.has(value)) continue;
      seen.add(value);
      result.push(value);
    }
  }
  return result;
};

const dedupeAliasDisplayList = (aliases?: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const alias of aliases ?? []) {
    if (typeof alias !== 'string') continue;
    const trimmed = alias.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result;
};

const aliasValueToSlug = (value: string): string => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized;
};

const shouldRenderEntry = (entry: GlossaryEntry): boolean => isRenderableGlossaryEntry(entry);
const assertCanonicalEntry = (entry: GlossaryEntry): void => {
  if (entry.status !== 'canonical') return;
  if (!entry.definition?.trim()) {
    throw new Error(`[glossary-loader] canonical term "${entry.slug}" requires a definition`);
  }
  if (!entry.category?.trim()) {
    throw new Error(`[glossary-loader] canonical term "${entry.slug}" requires a category`);
  }
};

const toLegacyEnvelope = (
  data: LegacyGlossaryData,
): { terms: LegacyGlossaryTerm[]; totalCount?: number; lastUpdated?: string } => {
  if (Array.isArray(data)) {
    return { terms: data };
  }
  return {
    terms: Array.isArray(data.terms) ? data.terms : [],
    totalCount: data.totalCount,
    lastUpdated: data.lastUpdated,
  };
};

const legacyEnvelope = toLegacyEnvelope(legacyGlossary as LegacyGlossaryData);
const legacyTerms = legacyEnvelope.terms;
const legacyMetadata: GlossaryMetadata = {
  totalCount: legacyEnvelope.totalCount ?? legacyTerms.length,
  lastUpdated: legacyEnvelope.lastUpdated,
};

const legacyLookup = new Map<string, LegacyGlossaryTerm>(
  legacyTerms.map((term) => [normalizeSlug(term.slug), term]),
);

const assertGlossaryDataset = (data: Glossary2025Data): void => {
  const counts = data.terms.reduce(
    (acc, term) => {
      const status = (term.status as GlossaryStatus) ?? 'canonical';
      if (status === 'canonical') acc.canonical += 1;
      else if (status === 'alias') acc.alias += 1;
      else if (status === 'deprecated') acc.deprecated += 1;
      else acc.unknown.add(status as string);
      return acc;
    },
    { canonical: 0, alias: 0, deprecated: 0, unknown: new Set<string>() },
  );

  const aliasDatasetCount =
    ((glossaryAliasesV2025 as GlossaryAliasesV2025).aliases?.length ?? 0) || counts.alias;
  const aliasCountComparison = counts.alias > 0 ? counts.alias : aliasDatasetCount;

  const mismatches: string[] = [];
  if (counts.canonical !== data.canonicalCount) {
    mismatches.push(`canonical=${counts.canonical} (expected ${data.canonicalCount})`);
  }
  if (aliasCountComparison !== data.aliasCount) {
    mismatches.push(`alias=${aliasCountComparison} (expected ${data.aliasCount})`);
  }
  if (counts.deprecated !== data.deprecatedCount) {
    mismatches.push(`deprecated=${counts.deprecated} (expected ${data.deprecatedCount})`);
  }
  if (counts.unknown.size) {
    mismatches.push(`unknown status values: ${Array.from(counts.unknown).join(', ')}`);
  }

  if (mismatches.length) {
    const details = mismatches.join('; ');
    throw new Error(
      `[glossary-loader] glossary.v2025.json structure mismatch: ${details}. Aborting build.`,
    );
  }
};

assertGlossaryDataset(glossaryV2025);

const readOptionalString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length ? value : null;

const buildLegacyEntry = (term: LegacyGlossaryTerm): GlossaryEntry => {
  const definition = (term.definition ?? '').trim();
  const category = (term.category ?? '').trim().toLowerCase() || undefined;
  return {
    slug: normalizeSlug(term.slug),
    term: formatGlossaryTitle(term.term ?? term.slug),
    definition,
    category,
    aliases: uniqueStrings(term.aliases ?? []),
    tags: uniqueStrings(term.tags ?? []),
    relatedTerms: uniqueStrings(term.relatedTerms ?? []),
    priority: typeof term.priority === 'number' ? term.priority : 0,
    type: term.type,
    entity: term.entity,
    versions: term.versions,
    summary: term.summary ?? (definition || null),
    subtitle: readOptionalString((term as Record<string, unknown>).subtitle),
    tagline: readOptionalString((term as Record<string, unknown>).tagline),
    seeAlso: term.seeAlso,
    relatedTags: term.relatedTags,
    examples: term.examples,
    links: term.links,
    status: 'canonical',
    targetSlug: null,
    publishDate: readOptionalString((term as Record<string, unknown>).publishDate),
    updateDate: readOptionalString((term as Record<string, unknown>).updateDate),
  };
};

const buildLegacyCache = (): GlossaryCache => {
  const canonical = new Map<string, GlossaryEntry>();
  const alias = new Map<string, AliasInfo>();
  const deprecated = new Map<string, GlossaryEntry>();
  const ordered: GlossaryEntry[] = [];

  for (const term of legacyTerms) {
    const entry = buildLegacyEntry(term);
    canonical.set(entry.slug, entry);
    if (shouldRenderEntry(entry)) {
      ordered.push(entry);
    }

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
  const baseTitle =
    canonicalTerm.term ??
    canonicalTerm.title ??
    legacyEntry?.term ??
    canonicalTerm.slug ??
    slug;
  const definition = (canonicalTerm.definition ?? legacyEntry?.definition ?? '').trim();
  const category = (canonicalTerm.category ?? legacyEntry?.category ?? '').trim().toLowerCase();
  const summary = canonicalTerm.summary ?? legacyEntry?.summary ?? null;
  const aliases = uniqueStrings(
    Array.isArray(canonicalTerm.aliases) ? canonicalTerm.aliases : undefined,
    legacyEntry?.aliases,
  );
  const tags = uniqueStrings(
    Array.isArray(canonicalTerm.tags) ? canonicalTerm.tags : undefined,
    legacyEntry?.tags,
  );
  const relatedTerms = uniqueStrings(
    Array.isArray(canonicalTerm.relatedTerms) ? canonicalTerm.relatedTerms : undefined,
    legacyEntry?.relatedTerms,
  );

  return {
    slug,
    term: formatGlossaryTitle(baseTitle),
    definition,
    category: category || undefined,
    aliases,
    tags,
    relatedTerms,
    priority:
      typeof canonicalTerm.priority === 'number'
        ? canonicalTerm.priority
        : legacyEntry?.priority ?? 0,
    type: canonicalTerm.type ?? legacyEntry?.type,
    entity: canonicalTerm.entity ?? legacyEntry?.entity,
    versions: canonicalTerm.versions ?? legacyEntry?.versions,
    summary,
    subtitle: legacyEntry?.subtitle ?? null,
    tagline: legacyEntry?.tagline ?? null,
    seeAlso:
      Array.isArray(canonicalTerm.seeAlso) && canonicalTerm.seeAlso.length
        ? canonicalTerm.seeAlso
        : legacyEntry?.seeAlso,
    relatedTags: Array.isArray(canonicalTerm.relatedTags)
      ? canonicalTerm.relatedTags
      : legacyEntry?.relatedTags,
    examples: canonicalTerm.examples ?? legacyEntry?.examples,
    links: canonicalTerm.links ?? legacyEntry?.links,
    status: canonicalTerm.status,
    targetSlug: canonicalTerm.targetSlug ? normalizeSlug(canonicalTerm.targetSlug) : null,
    publishDate: readOptionalString((canonicalTerm as Record<string, unknown>).publishDate) ?? legacyEntry?.publishDate ?? null,
    updateDate: readOptionalString((canonicalTerm as Record<string, unknown>).updateDate) ?? legacyEntry?.updateDate ?? null,
  };
};

const buildV2025Cache = (): GlossaryCache => {
  const canonical = new Map<string, GlossaryEntry>();
  const alias = new Map<string, AliasInfo>();
  const deprecated = new Map<string, GlossaryEntry>();
  const ordered: GlossaryEntry[] = [];
  const aliasStubs: Array<{ alias: string; target: string }> = [];

  const appendAlias = (aliasSlug: string, canonicalSlug: string, options?: { force?: boolean }) => {
    if (!aliasSlug || !canonicalSlug || aliasSlug === canonicalSlug) return;
    if (!options?.force && alias.has(aliasSlug)) return;
    alias.set(aliasSlug, {
      alias: aliasSlug,
      canonicalSlug,
      status: 'alias',
      targetSlug: canonicalSlug,
    });
  };

  for (const term of glossaryV2025.terms) {
    const normalizedSlug = normalizeSlug(term.slug);
    if (!normalizedSlug || PLACEHOLDER_SLUGS.has(normalizedSlug)) {
      continue;
    }
    if (term.status === 'alias') {
      const target = normalizeSlug(term.targetSlug ?? '');
      if (target) {
        aliasStubs.push({ alias: normalizedSlug, target });
      }
      continue;
    }

    const legacy = legacyLookup.get(normalizedSlug);
    const entry = mergeEntry(term, legacy);
    entry.aliases = dedupeAliasDisplayList(entry.aliases);

    if (term.status === 'deprecated') {
      deprecated.set(normalizedSlug, entry);
    } else {
      assertCanonicalEntry(entry);
      canonical.set(normalizedSlug, entry);
      if (shouldRenderEntry(entry)) {
        ordered.push(entry);
      }
      for (const aliasValue of entry.aliases ?? []) {
        const normalizedAlias = aliasValueToSlug(aliasValue);
        if (!normalizedAlias || normalizedAlias === entry.slug) continue;
        appendAlias(normalizedAlias, entry.slug);
      }
    }
  }

  for (const pending of aliasStubs) {
    if (!canonical.has(pending.target)) continue;
    appendAlias(pending.alias, pending.target, { force: true });
    const targetEntry = canonical.get(pending.target);
    if (targetEntry && !targetEntry.aliases.includes(pending.alias)) {
      targetEntry.aliases.push(pending.alias);
    }
  }

  for (const aliasEntry of (glossaryAliasesV2025 as GlossaryAliasesV2025).aliases ?? []) {
    const normalizedAlias = aliasValueToSlug(aliasEntry.alias);
    const targetSlug = normalizeSlug(aliasEntry.target);
    if (!normalizedAlias || !targetSlug) continue;
    appendAlias(normalizedAlias, targetSlug, { force: true });
    const targetEntry = canonical.get(targetSlug);
    if (targetEntry && !targetEntry.aliases.includes(normalizedAlias)) {
      targetEntry.aliases.push(normalizedAlias);
    }
  }

  // Include legacy-only aliases for completeness
  for (const [slug, legacyTerm] of legacyLookup.entries()) {
    const entry = canonical.get(slug);
    if (!entry) continue;
    for (const aliasSlug of legacyTerm.aliases ?? []) {
      const normalizedAlias = aliasValueToSlug(aliasSlug);
      if (!normalizedAlias || alias.has(normalizedAlias)) continue;
      appendAlias(normalizedAlias, entry.slug);
      if (!entry.aliases.includes(normalizedAlias)) {
        entry.aliases.push(normalizedAlias);
      }
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

const v2025Metadata: GlossaryMetadata = {
  totalCount: glossaryV2025.terms.length,
  lastUpdated: (glossaryV2025 as any).lastUpdated ?? null,
};

export const getGlossaryMetadata = (): GlossaryMetadata =>
  FEATURE_GLOSSARY_V2025 ? v2025Metadata : legacyMetadata;

const resolveCanonicalSlug = (slug: string): string => {
  const normalized = normalizeSlug(slug);
  if (!normalized) return '';
  const cache = getCache();
  const aliasInfo = cache.alias.get(normalized);
  if (aliasInfo) return aliasInfo.canonicalSlug;
  if (cache.canonical.has(normalized)) return normalized;
  const deprecatedEntry = cache.deprecated.get(normalized);
  if (deprecatedEntry) return deprecatedEntry.targetSlug ?? deprecatedEntry.slug;
  return normalized;
};

export const getGlossaryTerm = (slug: string): GlossaryEntry | null => {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  const cache = getCache();
  const aliasInfo = cache.alias.get(normalized);
  if (aliasInfo) {
    return cache.canonical.get(aliasInfo.canonicalSlug) ?? null;
  }

  const canonicalEntry = cache.canonical.get(normalized);
  if (canonicalEntry) return canonicalEntry;

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

const sanitizeOneLiner = (value?: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === 'todo') return null;
  return trimmed;
};

const truncateLine = (value: string, maxLength: number): string =>
  value.length <= maxLength ? value : `${value.slice(0, maxLength - 1).trimEnd()}…`;

export const getOneLiner = (entry: GlossaryEntry, maxLength = 140): string | null => {
  const primary =
    sanitizeOneLiner(entry.summary) ??
    sanitizeOneLiner(entry.subtitle) ??
    sanitizeOneLiner(entry.tagline);

  if (primary) {
    return truncateLine(primary, maxLength);
  }

  const fallback = sanitizeOneLiner(entry.definition);
  if (fallback) {
    return truncateLine(fallback, maxLength);
  }

  return null;
};


