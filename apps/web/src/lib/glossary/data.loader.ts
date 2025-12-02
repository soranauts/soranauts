/**
 * Glossary Data Loader
 * 
 * Provides isomorphic term fetching with caching for Quick-View and term pages.
 * Fetches individual term JSON files on demand to reduce initial payload.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface GlossaryTermFull {
  slug: string;
  title: string;
  summary: string;
  definition: string;
  category: string;
  tags: string[];
  relatedTerms: string[];
  aliases: string[];
  examples: string[];
  links: Array<{ label: string; url: string }>;
  tagline?: string;
  status: 'canonical';
  targetSlug: null;
}

export interface GlossaryTermMinimal {
  slug: string;
  title: string;
  category: string;
  summary: string;
  tagline?: string;
}

export interface MinimalIndex {
  terms: GlossaryTermMinimal[];
  canonicalCount: number;
  aliasCount: number;
  version: number;
  lastUpdated: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// In-memory cache (session-scoped)
// ─────────────────────────────────────────────────────────────────────────────

const termCache = new Map<string, GlossaryTermFull>();
const pendingFetches = new Map<string, Promise<GlossaryTermFull | null>>();

// ─────────────────────────────────────────────────────────────────────────────
// Fetch Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a single term by slug.
 * Returns cached data if available, otherwise fetches from per-term JSON.
 */
export async function fetchTerm(slug: string): Promise<GlossaryTermFull | null> {
  const normalizedSlug = slug.toLowerCase();
  
  // Check cache first
  if (termCache.has(normalizedSlug)) {
    return termCache.get(normalizedSlug)!;
  }
  
  // Check if fetch is already in progress
  if (pendingFetches.has(normalizedSlug)) {
    return pendingFetches.get(normalizedSlug)!;
  }
  
  // Start new fetch
  const fetchPromise = (async (): Promise<GlossaryTermFull | null> => {
    try {
      const response = await fetch(`/data/glossary/terms/${normalizedSlug}.json`);
      
      if (!response.ok) {
        console.warn(`[data.loader] Term not found: ${normalizedSlug}`);
        return null;
      }
      
      const term: GlossaryTermFull = await response.json();
      termCache.set(normalizedSlug, term);
      return term;
    } catch (error) {
      console.error(`[data.loader] Failed to fetch term: ${normalizedSlug}`, error);
      return null;
    } finally {
      pendingFetches.delete(normalizedSlug);
    }
  })();
  
  pendingFetches.set(normalizedSlug, fetchPromise);
  return fetchPromise;
}

/**
 * Prefetch a term (fire-and-forget for hover/focus hints).
 */
export function prefetchTerm(slug: string): void {
  const normalizedSlug = slug.toLowerCase();
  
  // Skip if already cached or fetching
  if (termCache.has(normalizedSlug) || pendingFetches.has(normalizedSlug)) {
    return;
  }
  
  // Use low-priority fetch
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      fetchTerm(normalizedSlug);
    });
  } else {
    setTimeout(() => {
      fetchTerm(normalizedSlug);
    }, 100);
  }
}

/**
 * Prefetch multiple terms (for related terms).
 */
export function prefetchTerms(slugs: string[]): void {
  for (const slug of slugs.slice(0, 6)) {
    prefetchTerm(slug);
  }
}

/**
 * Check if a term is cached.
 */
export function isTermCached(slug: string): boolean {
  return termCache.has(slug.toLowerCase());
}

/**
 * Get a cached term (synchronous, returns null if not cached).
 */
export function getCachedTerm(slug: string): GlossaryTermFull | null {
  return termCache.get(slug.toLowerCase()) ?? null;
}

/**
 * Prime the cache with initial data (for SSR hydration).
 */
export function primeCache(terms: GlossaryTermFull[]): void {
  for (const term of terms) {
    termCache.set(term.slug.toLowerCase(), term);
  }
}

/**
 * Clear the cache (for testing).
 */
export function clearCache(): void {
  termCache.clear();
  pendingFetches.clear();
}

// ─────────────────────────────────────────────────────────────────────────────
// Minimal Index Loader
// ─────────────────────────────────────────────────────────────────────────────

let minimalIndexCache: MinimalIndex | null = null;
let minimalIndexPromise: Promise<MinimalIndex | null> | null = null;

/**
 * Fetch the minimal index (for list rendering and search).
 */
export async function fetchMinimalIndex(): Promise<MinimalIndex | null> {
  if (minimalIndexCache) {
    return minimalIndexCache;
  }
  
  if (minimalIndexPromise) {
    return minimalIndexPromise;
  }
  
  minimalIndexPromise = (async () => {
    try {
      const response = await fetch('/data/glossary.minimal.json');
      if (!response.ok) {
        console.warn('[data.loader] Minimal index not found');
        return null;
      }
      
      minimalIndexCache = await response.json();
      return minimalIndexCache;
    } catch (error) {
      console.error('[data.loader] Failed to fetch minimal index', error);
      return null;
    } finally {
      minimalIndexPromise = null;
    }
  })();
  
  return minimalIndexPromise;
}

/**
 * Get a minimal term from the index (synchronous if cached).
 */
export function getMinimalTerm(slug: string): GlossaryTermMinimal | null {
  if (!minimalIndexCache) return null;
  return minimalIndexCache.terms.find((t) => t.slug === slug.toLowerCase()) ?? null;
}


