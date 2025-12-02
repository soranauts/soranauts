/**
 * Shared Glossary Index
 * 
 * Provides a single, canonical glossary search index that can be used
 * by both the Glossary page and the Explorer page.
 */

import { getCachedGlossaryTerms, getCachedAliasEntries } from '~/lib/glossary/glossary-data';
import { getCanonicalSlug } from '~/lib/glossary/glossary-loader';
import { createGlossarySearchEngine, type GlossarySearchOptions } from '~/lib/glossary/search';
import type { AliasIndexEntry, TaxonomyNodeType } from '~/lib/taxonomy';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SharedSearchResult {
  slug: string;
  canonicalSlug: string;
  term: string;
  definition: string;
  summary?: string | null;
  category?: string;
  tags: string[];
  score: number;
  matches: string[];
}

export interface SharedSearchResponse {
  results: SharedSearchResult[];
  didYouMean?: string;
  totalCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Index Singleton
// ─────────────────────────────────────────────────────────────────────────────

let searchEngineInstance: ReturnType<typeof createGlossarySearchEngine> | null = null;

/**
 * Get or create the shared glossary search engine.
 * Uses the canonical glossary index with proper slug resolution.
 */
export function getSharedSearchEngine() {
  if (searchEngineInstance) {
    return searchEngineInstance;
  }

  const terms = getCachedGlossaryTerms();
  const aliasEntries = getCachedAliasEntries();

  // Convert alias entries to the expected format
  const aliasIndex: AliasIndexEntry[] = aliasEntries.map((entry) => ({
    alias: entry.alias,
    slug: entry.canonicalSlug,
    type: 'term' as TaxonomyNodeType,
  }));

  // Create search engine with canonical slug resolver
  searchEngineInstance = createGlossarySearchEngine(
    {
      terms: terms.map((t) => ({
        term: t.term,
        slug: t.slug,
        definition: t.definition,
        category: t.category,
        aliases: t.aliases,
        tags: t.tags,
        relatedTerms: t.relatedTerms,
        priority: t.priority,
        type: (t.type as TaxonomyNodeType) ?? 'term',
        entity: t.entity,
        versions: t.versions,
        summary: t.summary ?? undefined,
        seeAlso: t.seeAlso,
        relatedTags: t.relatedTags,
        canonicalSlug: t.targetSlug,
      })),
      aliasIndex,
    },
    {
      resolveCanonicalSlug: getCanonicalSlug,
    }
  );

  return searchEngineInstance;
}

/**
 * Search the shared glossary index.
 * Returns results with canonical slugs.
 */
export function searchGlossary(
  query: string,
  options: GlossarySearchOptions = {}
): SharedSearchResponse {
  const engine = getSharedSearchEngine();
  const response = engine.search(query, options);

  // Map results to shared format with canonical slugs
  const results: SharedSearchResult[] = response.results.map((result) => ({
    slug: result.term.slug,
    canonicalSlug: result.term.canonicalSlug ?? getCanonicalSlug(result.term.slug),
    term: result.term.term,
    definition: result.term.definition,
    summary: result.term.summary,
    category: result.term.category,
    tags: result.term.tags,
    score: result.score,
    matches: result.matches,
  }));

  return {
    results,
    didYouMean: response.didYouMean,
    totalCount: results.length,
  };
}

/**
 * Resolve an alias to its canonical term.
 */
export function resolveAliasToCanonical(alias: string): SharedSearchResult | null {
  const engine = getSharedSearchEngine();
  const resolved = engine.resolveAlias(alias);

  if (!resolved) {
    return null;
  }

  return {
    slug: resolved.term.slug,
    canonicalSlug: resolved.term.canonicalSlug ?? getCanonicalSlug(resolved.term.slug),
    term: resolved.term.term,
    definition: resolved.term.definition,
    summary: resolved.term.summary,
    category: resolved.term.category,
    tags: resolved.term.tags,
    score: 1000, // High score for exact alias match
    matches: [`alias:${resolved.matchedAlias}`],
  };
}

/**
 * Get canonical slug for a given slug (handles aliases).
 */
export { getCanonicalSlug };

