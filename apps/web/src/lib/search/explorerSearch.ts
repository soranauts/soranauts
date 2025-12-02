/**
 * Explorer Search
 * 
 * Wrapper around the shared glossary index for use in the Explorer.
 * Ensures search results match Glossary results for canonical slugs.
 */

import {
  searchGlossary,
  resolveAliasToCanonical,
  getCanonicalSlug,
  type SharedSearchResult,
  type SharedSearchResponse,
} from './sharedGlossaryIndex';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ExplorerSearchResult {
  slug: string;
  canonicalSlug: string;
  term: string;
  summary?: string | null;
  category?: string;
  tags: string[];
  score: number;
  href: string;
}

export interface ExplorerSearchResponse {
  results: ExplorerSearchResult[];
  didYouMean?: string;
  isEmpty: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Search glossary terms for the Explorer.
 * Returns results with canonical slugs and proper hrefs.
 */
export function searchExplorer(query: string, limit = 10): ExplorerSearchResponse {
  if (!query || query.trim().length === 0) {
    return {
      results: [],
      isEmpty: true,
    };
  }

  try {
    const response = searchGlossary(query.trim());

    // Deduplicate by canonical slug (in case aliases are in results)
    const seen = new Set<string>();
    const deduped: ExplorerSearchResult[] = [];

    for (const result of response.results) {
      const canonical = result.canonicalSlug;
      if (seen.has(canonical)) continue;
      seen.add(canonical);

      deduped.push({
        slug: result.slug,
        canonicalSlug: canonical,
        term: result.term,
        summary: result.summary,
        category: result.category,
        tags: result.tags,
        score: result.score,
        href: `/glossary/${canonical}`,
      });

      if (deduped.length >= limit) break;
    }

    return {
      results: deduped,
      didYouMean: response.didYouMean,
      isEmpty: deduped.length === 0,
    };
  } catch (error) {
    console.error('[explorerSearch] Search failed:', error);
    return {
      results: [],
      isEmpty: true,
    };
  }
}

/**
 * Resolve an alias or slug to its canonical form.
 * Returns the canonical slug or the original if not found.
 */
export function resolveToCanonical(slugOrAlias: string): string {
  try {
    // First try direct canonical resolution
    const canonical = getCanonicalSlug(slugOrAlias);
    if (canonical && canonical !== slugOrAlias) {
      return canonical;
    }

    // Try alias resolution
    const resolved = resolveAliasToCanonical(slugOrAlias);
    if (resolved) {
      return resolved.canonicalSlug;
    }

    return slugOrAlias;
  } catch {
    return slugOrAlias;
  }
}

/**
 * Check if a slug is canonical (not an alias).
 */
export function isCanonicalSlug(slug: string): boolean {
  const canonical = getCanonicalSlug(slug);
  return canonical === slug;
}

// Re-export types for convenience
export type { SharedSearchResult, SharedSearchResponse };



