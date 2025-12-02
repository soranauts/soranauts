/**
 * Quick-View State Utilities
 * 
 * URL state management and focus trap for the Glossary Quick-View panel.
 * Keeps the island self-contained without mutating global store.
 */

// ─────────────────────────────────────────────────────────────────────────────
// URL State
// ─────────────────────────────────────────────────────────────────────────────

const TERM_PARAM = 'term';

/**
 * Get the current term slug from URL search params.
 */
export function getTermFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(TERM_PARAM);
}

/**
 * Set the term slug in URL without page reload.
 * Uses replaceState to avoid polluting history on rapid opens.
 */
export function setTermInUrl(slug: string): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set(TERM_PARAM, slug);
  window.history.pushState({ term: slug }, '', url.toString());
}

/**
 * Remove the term param from URL.
 */
export function removeTermFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete(TERM_PARAM);
  window.history.pushState({ term: null }, '', url.toString());
}

/**
 * Subscribe to popstate events for back/forward navigation.
 */
export function onPopState(callback: (slug: string | null) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = () => {
    callback(getTermFromUrl());
  };
  
  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}

// ─────────────────────────────────────────────────────────────────────────────
// Focus Trap
// ─────────────────────────────────────────────────────────────────────────────

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Get all focusable elements within a container.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
}

/**
 * Create a focus trap within a container element.
 * Returns a cleanup function to remove the trap.
 */
export function createFocusTrap(
  container: HTMLElement,
  options: {
    onEscape?: () => void;
    initialFocus?: HTMLElement | null;
  } = {}
): () => void {
  const { onEscape, initialFocus } = options;
  
  // Store the element that had focus before opening
  const previouslyFocused = document.activeElement as HTMLElement | null;
  
  // Focus initial element or first focusable
  const focusFirst = () => {
    if (initialFocus) {
      initialFocus.focus();
    } else {
      const focusable = getFocusableElements(container);
      focusable[0]?.focus();
    }
  };
  
  // Delay initial focus to allow animation
  requestAnimationFrame(focusFirst);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onEscape?.();
      return;
    }
    
    if (event.key !== 'Tab') return;
    
    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;
    
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
    // Restore focus to previous element
    previouslyFocused?.focus();
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Inert Background
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Make all siblings of the panel inert (non-interactive).
 * Returns cleanup function to restore interactivity.
 */
export function setBackgroundInert(panelElement: HTMLElement): () => void {
  if (typeof document === 'undefined') return () => {};
  
  const inertElements: HTMLElement[] = [];
  
  // Find main content areas to make inert
  const mainContent = document.querySelector('main');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  
  [mainContent, header, footer].forEach((el) => {
    if (el && el !== panelElement && !panelElement.contains(el)) {
      (el as HTMLElement).setAttribute('inert', '');
      inertElements.push(el as HTMLElement);
    }
  });
  
  return () => {
    inertElements.forEach((el) => el.removeAttribute('inert'));
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ARIA Live Announcements
// ─────────────────────────────────────────────────────────────────────────────

let liveRegion: HTMLElement | null = null;

/**
 * Announce a message to screen readers.
 */
export function announce(message: string): void {
  if (typeof document === 'undefined') return;
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  
  // Clear and set new message (triggers announcement)
  liveRegion.textContent = '';
  requestAnimationFrame(() => {
    if (liveRegion) liveRegion.textContent = message;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Reduced Motion
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}



