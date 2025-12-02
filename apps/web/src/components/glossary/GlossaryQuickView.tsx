import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  getTermFromUrl,
  setTermInUrl,
  removeTermFromUrl,
  onPopState,
  createFocusTrap,
  setBackgroundInert,
  announce,
  prefersReducedMotion,
} from '~/lib/glossary/quickview.state';
import { formatGlossaryTitle, formatCategoryLabel } from '~/lib/glossary/format';
import {
  fetchTerm,
  prefetchTerm,
  getCachedTerm,
  type GlossaryTermFull,
} from '~/lib/glossary/data.loader';
import { trackQuickViewOpen, trackQuickViewClose } from '~/lib/insights/insights';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GlossaryTermData {
  slug: string;
  term: string;
  title?: string;
  definition?: string;
  summary?: string | null;
  category?: string;
  tags?: string[];
  relatedTerms?: string[];
  tagline?: string | null;
  subtitle?: string | null;
}

interface GlossaryQuickViewProps {
  /** Minimal terms for initial lookup (slug, title, category, summary) */
  terms: GlossaryTermData[];
  /** Initial term slug from SSR (optional) */
  initialSlug?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function GlossaryQuickView({ terms, initialSlug }: GlossaryQuickViewProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(initialSlug ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullTerm, setFullTerm] = useState<GlossaryTermFull | null>(null);
  
  const panelRef = useRef<HTMLElement>(null);
  const invokerRef = useRef<HTMLElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Find minimal term data by slug (for initial display)
  const findMinimalTerm = useCallback((slug: string): GlossaryTermData | null => {
    const normalized = slug.toLowerCase();
    return terms.find((t) => t.slug.toLowerCase() === normalized) ?? null;
  }, [terms]);

  // Get the active term data (prefer full, fallback to minimal)
  const activeTerm = fullTerm ?? (activeSlug ? findMinimalTerm(activeSlug) : null);

  // ───────────────────────────────────────────────────────────────────────────
  // Open/Close handlers
  // ───────────────────────────────────────────────────────────────────────────

  // Lazy load full term data
  const loadFullTerm = useCallback(async (slug: string) => {
    // Check cache first
    const cached = getCachedTerm(slug);
    if (cached) {
      setFullTerm(cached);
      return;
    }
    
    setIsLoading(true);
    const term = await fetchTerm(slug);
    setFullTerm(term);
    setIsLoading(false);
    
    // Prefetch related terms
    if (term?.relatedTerms) {
      for (const related of term.relatedTerms.slice(0, 4)) {
        prefetchTerm(related);
      }
    }
  }, []);

  const openPanel = useCallback((slug: string, invoker?: HTMLElement | null) => {
    const term = findMinimalTerm(slug);
    if (!term) {
      console.warn(`[QuickView] Term not found: ${slug}`);
      return;
    }

    // Store invoker for focus return
    if (invoker) {
      invokerRef.current = invoker;
    }

    // If same term, no-op
    if (activeSlug === term.slug && isOpen) return;

    // If different term while open, just swap content
    if (isOpen && activeSlug !== term.slug) {
      setActiveSlug(term.slug);
      setFullTerm(null); // Reset full term for new slug
      setTermInUrl(term.slug);
      loadFullTerm(term.slug);
      trackQuickViewOpen(term.slug);
      announce(`Viewing ${formatGlossaryTitle(term.term || term.title || term.slug)}`);
      return;
    }

    // Open panel
    setActiveSlug(term.slug);
    setFullTerm(null); // Reset full term
    setIsAnimating(true);
    setIsOpen(true);
    setTermInUrl(term.slug);
    loadFullTerm(term.slug);
    trackQuickViewOpen(term.slug);
    announce(`Quick view opened: ${formatGlossaryTitle(term.term || term.title || term.slug)}`);
  }, [activeSlug, isOpen, findMinimalTerm, loadFullTerm]);

  // Copy link handler
  const copyLink = useCallback(() => {
    const url = new URL(window.location.href);
    if (activeSlug) {
      url.searchParams.set('term', activeSlug);
    }
    navigator.clipboard.writeText(url.toString()).then(() => {
      announce('Link copied to clipboard');
    }).catch(() => {
      // Fallback: select the URL
      console.warn('Failed to copy link');
    });
  }, [activeSlug]);

  const closePanel = useCallback(() => {
    if (!isOpen) return;

    setIsAnimating(true);
    setIsOpen(false);
    setFullTerm(null);
    removeTermFromUrl();
    trackQuickViewClose(activeSlug ?? '');

    // Cleanup will be called by effect
  }, [isOpen, activeSlug]);

  // ───────────────────────────────────────────────────────────────────────────
  // Effects
  // ───────────────────────────────────────────────────────────────────────────

  // Handle initial URL state
  useEffect(() => {
    const urlSlug = getTermFromUrl();
    if (urlSlug && !isOpen) {
      openPanel(urlSlug);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle popstate (back/forward)
  useEffect(() => {
    return onPopState((slug) => {
      if (slug) {
        openPanel(slug);
      } else if (isOpen) {
        setIsOpen(false);
        setActiveSlug(null);
      }
    });
  }, [isOpen, openPanel]);

  // Focus trap and inert background
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const cleanupFocus = createFocusTrap(panelRef.current, {
        onEscape: closePanel,
        initialFocus: panelRef.current.querySelector<HTMLElement>('[data-qv-title]'),
      });
      
      const cleanupInert = setBackgroundInert(panelRef.current);

      cleanupRef.current = () => {
        cleanupFocus();
        cleanupInert();
      };
    }

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [isOpen, closePanel]);

  // Animation end handler
  useEffect(() => {
    if (!isAnimating) return;

    const duration = prefersReducedMotion() ? 0 : 200;
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (!isOpen) {
        setActiveSlug(null);
        invokerRef.current?.focus();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isAnimating, isOpen]);

  // ───────────────────────────────────────────────────────────────────────────
  // Global event listener for pill clicks
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const trigger = target.closest<HTMLElement>('[data-qv-trigger]');
      if (!trigger) return;

      const slug = trigger.dataset.qvTrigger;
      if (!slug) return;

      event.preventDefault();
      openPanel(slug, trigger);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const trigger = target.closest<HTMLElement>('[data-qv-trigger]');
      if (!trigger) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const slug = trigger.dataset.qvTrigger;
        if (slug) openPanel(slug, trigger);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openPanel]);

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  if (!isOpen && !isAnimating) return null;

  const displayTitle = activeTerm
    ? formatGlossaryTitle(activeTerm.term || activeTerm.title || activeTerm.slug)
    : '';
  const displayCategory = activeTerm?.category
    ? formatCategoryLabel(activeTerm.category)
    : null;
  const displaySummary = activeTerm?.summary || activeTerm?.definition || '';
  const whyItMatters = activeTerm?.tagline || activeTerm?.subtitle || null;
  // Only show related terms from full term data
  const relatedTerms = fullTerm?.relatedTerms?.slice(0, 6) ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`qv-backdrop ${isOpen ? 'qv-backdrop--open' : 'qv-backdrop--closing'}`}
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qv-title"
        className={`qv-panel ${isOpen ? 'qv-panel--open' : 'qv-panel--closing'}`}
      >
        {/* Header */}
        <header className="qv-panel__header">
          <button
            type="button"
            className="qv-panel__header-btn"
            onClick={copyLink}
            aria-label="Copy link"
            title="Copy link with ?term="
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M7.5 10.5L10.5 7.5M7.125 12.375L5.625 13.875C4.59 14.91 2.91 14.91 1.875 13.875C0.84 12.84 0.84 11.16 1.875 10.125L4.125 7.875C5.16 6.84 6.84 6.84 7.875 7.875M10.125 5.625L12.375 3.375C13.41 2.34 15.09 2.34 16.125 3.375C17.16 4.41 17.16 6.09 16.125 7.125L13.875 9.375C12.84 10.41 11.16 10.41 10.125 9.375"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="qv-panel__close"
            onClick={closePanel}
            aria-label="Close quick view"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {/* Content */}
        <div className="qv-panel__content">
          {activeTerm ? (
            <>
              {/* Category badge */}
              {displayCategory && (
                <span className="chip chip--sm chip--neutral qv-panel__category">
                  {displayCategory}
                </span>
              )}

              {/* Title */}
              <h2 id="qv-title" className="qv-panel__title" data-qv-title tabIndex={-1}>
                {displayTitle}
              </h2>

              {/* Summary */}
              {displaySummary && (
                <p className="qv-panel__summary">{displaySummary}</p>
              )}

              {/* Why it matters - highlighted callout */}
              {whyItMatters && (
                <div className="qv-panel__callout">
                  <div className="qv-panel__callout-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 5V8.5M8 11H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="qv-panel__callout-content">
                    <h3 className="qv-panel__callout-title">Why it matters</h3>
                    <p className="qv-panel__callout-text">{whyItMatters}</p>
                  </div>
                </div>
              )}

              {/* Related terms with taglines */}
              {isLoading && relatedTerms.length === 0 ? (
                <div className="qv-panel__section">
                  <h3 className="qv-panel__section-title">Related terms</h3>
                  <div className="qv-panel__loading">Loading...</div>
                </div>
              ) : relatedTerms.length > 0 ? (
                <div className="qv-panel__section">
                  <h3 className="qv-panel__section-title">Related terms</h3>
                  <div className="qv-panel__related-list">
                    {relatedTerms.slice(0, 4).map((related) => {
                      const relatedTerm = findMinimalTerm(related);
                      const relatedSlug = relatedTerm?.slug || related.toLowerCase().replace(/\s+/g, '');
                      const relatedTagline = relatedTerm?.tagline;
                      return (
                        <button
                          key={related}
                          type="button"
                          className="qv-panel__related-item"
                          data-qv-trigger={relatedSlug}
                          onMouseEnter={() => prefetchTerm(relatedSlug)}
                          onFocus={() => prefetchTerm(relatedSlug)}
                        >
                          <span className="qv-panel__related-title">
                            {formatGlossaryTitle(related)}
                          </span>
                          {relatedTagline && (
                            <span className="qv-panel__related-tagline">
                              {relatedTagline}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="qv-panel__error">
              <p>Term not found.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTerm && (
          <footer className="qv-panel__footer">
            <a
              href={`/glossary/${activeTerm.slug}`}
              className="btn--primary qv-panel__cta"
            >
              Go deeper
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </footer>
        )}
      </aside>
    </>
  );
}

export default GlossaryQuickView;

