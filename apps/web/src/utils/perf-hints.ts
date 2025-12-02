/**
 * Performance Hints Utilities
 * 
 * Helpers for preconnect, dns-prefetch, and modulepreload hints.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Link Hint Helpers (for SSR)
// ─────────────────────────────────────────────────────────────────────────────

export interface LinkHint {
  rel: 'preconnect' | 'dns-prefetch' | 'modulepreload' | 'prefetch' | 'preload';
  href: string;
  as?: 'script' | 'style' | 'font' | 'image' | 'fetch';
  crossorigin?: 'anonymous' | 'use-credentials' | '';
  type?: string;
}

/**
 * Generate preconnect hints for external resources.
 */
export function getPreconnectHints(): LinkHint[] {
  return [
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' },
  ];
}

/**
 * Generate dns-prefetch hints for API endpoints.
 */
export function getDnsPrefetchHints(): LinkHint[] {
  return [
    { rel: 'dns-prefetch', href: 'https://api.soranauts.com' },
  ];
}

/**
 * Generate modulepreload hints for critical chunks.
 */
export function getModulePreloadHints(chunks: string[]): LinkHint[] {
  return chunks.map((href) => ({
    rel: 'modulepreload' as const,
    href,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Client-side Prefetch Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prefetch a JSON resource (low priority).
 */
export function prefetchJson(url: string): void {
  if (typeof window === 'undefined') return;
  
  // Check if already prefetched
  const existing = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
  if (existing) return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = 'fetch';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Prefetch a term's JSON data on hover/focus.
 */
export function prefetchTermJson(slug: string): void {
  prefetchJson(`/data/glossary/terms/${slug}.json`);
}

/**
 * Add prefetch-on-hover behavior to an element.
 */
export function addPrefetchOnHover(element: HTMLElement, url: string): () => void {
  let prefetched = false;
  
  const handler = () => {
    if (prefetched) return;
    prefetched = true;
    prefetchJson(url);
  };
  
  element.addEventListener('mouseenter', handler, { once: true });
  element.addEventListener('focus', handler, { once: true });
  
  return () => {
    element.removeEventListener('mouseenter', handler);
    element.removeEventListener('focus', handler);
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Intersection Observer for Lazy Loading
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create an intersection observer for lazy loading.
 */
export function createLazyLoader(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '100px',
    threshold: 0,
    ...options,
  });
}

/**
 * Observe an element and call callback when it enters viewport.
 */
export function onVisible(
  element: HTMLElement,
  callback: () => void,
  options?: IntersectionObserverInit
): () => void {
  const observer = createLazyLoader((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        callback();
        observer?.disconnect();
        break;
      }
    }
  }, options);
  
  if (observer) {
    observer.observe(element);
    return () => observer.disconnect();
  }
  
  // Fallback: call immediately
  callback();
  return () => {};
}

// ─────────────────────────────────────────────────────────────────────────────
// Resource Timing Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a resource is already cached.
 */
export function isResourceCached(url: string): boolean {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return false;
  }
  
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  return entries.some((entry) => entry.name.includes(url) && entry.transferSize === 0);
}

/**
 * Get the size of a fetched resource.
 */
export function getResourceSize(url: string): number | null {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }
  
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const entry = entries.find((e) => e.name.includes(url));
  return entry?.transferSize ?? null;
}


