/**
 * Scroll Offset Utility
 * 
 * Handles hash-based navigation with sticky header offset.
 * Uses CSS scroll-margin-top as the primary mechanism with JS fallback.
 */

/** Default offset for sticky header (in pixels) */
export const STICKY_HEADER_OFFSET = 80;

/**
 * Scroll to an element by ID with proper offset for sticky headers.
 * Falls back gracefully if element doesn't exist.
 */
export function scrollToHash(hash: string, offset = STICKY_HEADER_OFFSET): void {
  if (!hash || typeof window === 'undefined') return;
  
  const id = hash.replace(/^#/, '');
  const element = document.getElementById(id);
  
  if (!element) return;
  
  // Use scrollIntoView with block: 'start' and let CSS scroll-margin-top handle offset
  // This is more reliable than manual offset calculation
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Initialize hash scroll handling on page load.
 * Waits for DOM to settle before scrolling.
 */
export function initHashScroll(offset = STICKY_HEADER_OFFSET): void {
  if (typeof window === 'undefined') return;
  
  const hash = window.location.hash;
  if (!hash) return;
  
  // Wait for layout to settle
  requestAnimationFrame(() => {
    setTimeout(() => scrollToHash(hash, offset), 100);
  });
}

/**
 * Handle click events on hash links to ensure proper scrolling.
 */
export function handleHashClick(event: MouseEvent, offset = STICKY_HEADER_OFFSET): void {
  const target = event.target as HTMLElement;
  const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
  
  if (!anchor) return;
  
  const hash = anchor.getAttribute('href');
  if (!hash || hash === '#') return;
  
  event.preventDefault();
  
  // Update URL without scrolling
  history.pushState(null, '', hash);
  
  // Scroll with offset
  scrollToHash(hash, offset);
}

