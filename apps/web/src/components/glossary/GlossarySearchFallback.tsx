import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { scoreTerm } from './utils';
import { createPortal } from 'react-dom';
import { loadGlossaryFull, type Term as GlossaryTermPayload } from '../../lib/glossary-data';
import { formatCategoryLabel, formatGlossaryTitle, formatHashtag, isRenderableGlossaryEntry } from '../../lib/glossary/format';

// Dev-only logging utility
const __DEV__ = import.meta.env?.MODE !== 'production';
const log = (...args: any[]) => { if (__DEV__) console.log(...args); };

interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category: string;
  aliases: string[];
  tags: string[];
  relatedTerms: string[];
  examples?: string[];
  links?: Array<{ label: string; url: string }>;
  priority: number;
}

interface GlossaryData {
  terms: GlossaryTerm[];
  categories: Record<string, { name: string; count: number; description: string }>;
  totalCount: number;
  lastUpdated: string;
}

interface GlossarySearchFallbackProps {
  controlsContainerId?: string;
  resultsContainerId?: string;
}

const formatLabel = (value: string): string =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());

const toGlossaryTerm = (entry: GlossaryTermPayload | GlossaryTerm): GlossaryTerm | null => {
  const typed = entry as GlossaryTerm;
  const payload = entry as GlossaryTermPayload;
  const baseTitle = typed.term ?? payload.title ?? entry.slug;
  const definition = (typed.definition ?? payload.definition ?? payload.summary ?? '').trim();
  const category = (typed.category ?? (payload as any)?.category ?? '').trim().toLowerCase();
  const status = ((typed as any)?.status ?? (payload as any)?.status ?? 'canonical') as string;

  const testData = { slug: entry.slug, status, definition: definition.substring(0, 30), category };
  const isRenderable = isRenderableGlossaryEntry({
    slug: entry.slug,
    status,
    definition,
    category,
  });
  
  if (!isRenderable && __DEV__) {
    console.log('❌ Filtered out:', testData);
  }

  if (!isRenderable) {
    return null;
  }

  // Extract tags and relatedTerms from either typed or payload format
  const tags = Array.isArray(typed.tags) ? typed.tags 
    : Array.isArray((payload as any).tags) ? (payload as any).tags 
    : [];
  const relatedTerms = Array.isArray(typed.relatedTerms) ? typed.relatedTerms 
    : Array.isArray((payload as any).relatedTerms) ? (payload as any).relatedTerms 
    : [];

  return {
    term: formatGlossaryTitle(baseTitle),
    slug: entry.slug,
    definition,
    category,
    aliases: Array.isArray(typed.aliases) ? typed.aliases : Array.isArray((payload as any).aliases) ? (payload as any).aliases : [],
    tags,
    relatedTerms,
    examples: typed.examples ?? (payload as any).examples ?? [],
    links: typed.links ?? (payload as any).links ?? [],
    priority: typeof typed.priority === 'number' ? typed.priority : 0,
  };
};

const buildCategories = (terms: GlossaryTerm[]): GlossaryData['categories'] =>
  terms.reduce<GlossaryData['categories']>((acc, term) => {
    const key = term.category ?? 'token';
    if (!acc[key]) {
      acc[key] = {
        name: key,
        count: 0,
        description: '',
      };
    }
    acc[key].count += 1;
    return acc;
  }, {});

// Fetch glossary data
async function fetchGlossaryData(): Promise<GlossaryData> {
  log('🔍 [fetchGlossaryData] Starting glossary fetch...');
  try {
    const rawTerms = await loadGlossaryFull();
    const terms = rawTerms
      .map((term) => toGlossaryTerm(term as GlossaryTerm))
      .filter((term): term is GlossaryTerm => Boolean(term));
    log('🔍 [fetchGlossaryData] Data received:', terms.length, 'terms');
    return {
      terms,
      categories: buildCategories(terms),
      totalCount: terms.length,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    if (__DEV__) console.error('❌ [fetchGlossaryData] Error during fetch:', err);
    throw err;
  }
}

// Search and filter terms
function filterTerms(terms: GlossaryTerm[], searchQuery: string, category: string): GlossaryTerm[] {
  let filtered = terms;

  // Category filter (case-insensitive)
  if (category) {
    const categoryLower = category.toLowerCase();
    filtered = filtered.filter(term => term.category.toLowerCase() === categoryLower);
  }

  // Search filter
  if (searchQuery) {
    const searchLower = searchQuery.toLowerCase();
    filtered = filtered.filter((term) => {
      const matchesTerm = term.term?.toLowerCase().includes(searchLower);
      const matchesDefinition = term.definition?.toLowerCase().includes(searchLower);
      const matchesAlias = (term.aliases ?? []).some((alias) => alias.toLowerCase().includes(searchLower));
      const matchesTags = (term.tags ?? []).some((tag) => tag.toLowerCase().includes(searchLower));
      const matchesRelated = (term.relatedTerms ?? []).some((related) =>
        related.toLowerCase().includes(searchLower),
      );
      return Boolean(matchesTerm || matchesDefinition || matchesAlias || matchesTags || matchesRelated);
    });
  }

  return filtered;
}

// Hit component for displaying search results
function Hit({ hit, onAliasClick, onTagClick, existingSlugs }: { 
  hit: GlossaryTerm; 
  onAliasClick: (alias: string) => void;
  onTagClick: (tag: string) => void;
  existingSlugs: Set<string>;
}) {
  const categoryLabel = hit.category ? formatCategoryLabel(hit.category) : undefined;
  
  // Merge tags and relatedTerms, deduplicate by normalized (lowercase) form
  // This prevents showing both "#Polkaswap" and "#polkaswap" as separate chips
  const allChips = [...(hit.tags ?? []), ...(hit.relatedTerms ?? [])];
  const seenNormalized = new Set<string>();
  const uniqueChips: string[] = [];
  
  for (const chip of allChips) {
    const normalized = chip.toLowerCase().replace(/[\s_-]+/g, '');
    if (!seenNormalized.has(normalized)) {
      seenNormalized.add(normalized);
      uniqueChips.push(chip);
    }
  }
  
  // Take first 6 unique chips for display
  const displayChips = uniqueChips.slice(0, 6);
  return (
    <div
      id={`glossary-${hit.slug}`}
      className="glossary-card glossary-search__result"
      role="article"
      onClick={(e) => {
        // Only navigate if click wasn't on an interactive element
        const target = e.target as HTMLElement;
        if (!target.closest('a, button')) {
          window.location.href = `/glossary/${hit.slug}`;
        }
      }}
      onKeyDown={(e) => {
        const target = e.target as HTMLElement;
        if (e.key === 'Enter' && !target.closest?.('a, button')) {
          window.location.href = `/glossary/${hit.slug}`;
        }
      }}
      tabIndex={0}
      aria-label={`Open ${hit.term} term page`}
      style={{ cursor: 'pointer' }}
    >
      <div className="glossary-card__header">
        <span className="glossary-search__result-title">{hit.term}</span>
        {categoryLabel && (
          <button
            type="button"
            className="chip chip--sm chip--neutral glossary-search__chip"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onTagClick(hit.category);
            }}
            title={`Filter by ${categoryLabel}`}
          >
            {categoryLabel}
          </button>
        )}
      </div>
      
      <p className="glossary-search__result-summary">{hit.definition}</p>
      
      {hit.aliases && hit.aliases.length > 1 && (
        <div className="glossary-search__aliases">
          <span className="glossary-search__aliases-label">Also known as:</span>
          <div className="glossary-search__chips">
            {hit.aliases.slice(1).map((alias: string) => (
              <button
                key={alias}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onAliasClick(alias);
                }}
                className="chip chip--sm chip--muted glossary-search__chip"
                title={`Search for ${alias}`}
              >
                {alias}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {displayChips.length > 0 && (
        <div className="glossary-search__chips">
          {displayChips.map((chip: string) => {
            // Normalize chip to create a slug for linking
            const chipSlug = chip.toLowerCase().replace(/[\s_-]+/g, '');
            const pageExists = existingSlugs.has(chipSlug);
            
            if (pageExists) {
              // Term has a page - link directly
              return (
                <a
                  key={chip}
                  href={`/glossary/${chipSlug}`}
                  className="chip chip--sm chip--muted glossary-search__chip"
                  title={`View ${formatHashtag(chip)} term`}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  #{formatHashtag(chip)}
                </a>
              );
            } else {
              // No page exists - search for the term instead
              return (
                <button
                  key={chip}
                  type="button"
                  className="chip chip--sm chip--muted glossary-search__chip"
                  title={`Search for ${formatHashtag(chip)}`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onTagClick(chip);
                  }}
                >
                  #{formatHashtag(chip)}
                </button>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}


// Priority categories to show by default (most user-relevant)
// These are ordered by importance/popularity for typical users
const PRIORITY_CATEGORIES = new Set([
  'defi',
  'token',
  'economics',
  'governance',
  'technology',
  'network',
  'general',
]);

// Number of categories to show before collapsing
const VISIBLE_CATEGORY_COUNT = 7;

// Main search component
export default function GlossarySearchFallback({
  controlsContainerId,
  resultsContainerId,
}: GlossarySearchFallbackProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [glossaryData, setGlossaryData] = useState<GlossaryData | null>(null);
  const [preIdx, setPreIdx] = useState<{slug:string;priority:number;blob:string}[]|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusedTermSlug, setFocusedTermSlug] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en', {
        maximumFractionDigits: 0,
      }),
    [],
  );

  // Build a Set of existing slugs for link validation
  // This prevents 404s when clicking tags that don't have glossary pages
  // Must be defined here (before any conditional returns) to satisfy React hooks rules
  const existingSlugs = useMemo(() => {
    if (!glossaryData?.terms) return new Set<string>();
    return new Set(glossaryData.terms.map(t => t.slug));
  }, [glossaryData]);

  const [controlsContainer, setControlsContainer] = useState<HTMLElement | null>(null);
  const [resultsContainer, setResultsContainer] = useState<HTMLElement | null>(null);
  const isBrowser = typeof window !== 'undefined';
  const shouldUsePortals = Boolean(controlsContainerId && resultsContainerId);

  useEffect(() => {
    if (!shouldUsePortals || !isBrowser) return;
    const controlsEl = document.getElementById(controlsContainerId!);
    const resultsEl = document.getElementById(resultsContainerId!);
    setControlsContainer(controlsEl ?? null);
    setResultsContainer(resultsEl ?? null);
  }, [shouldUsePortals, controlsContainerId, resultsContainerId, isBrowser]);
  
  // Debounce ref for search input
  const debounceRef = useRef<number | null>(null);

  // Load precomputed index on mount
  useEffect(() => {
    fetch("/glossary.index.json")
      .then(r => r.json())
      .then(d => setPreIdx(d.index))
      .catch(err => {
        if (__DEV__) console.warn('Failed to load search index:', err);
      });
  }, []);

  // Debounce effect for search input
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const newQuery = searchInput.trim();
      setSearchQuery(newQuery);
      
      // Analytics: Track search performance
      if (newQuery && glossaryData) {
        const t0 = performance.now();
        // Simulate the filtering that will happen
        const filteredCount = (() => {
          if (!glossaryData?.terms) return 0;
          return glossaryData.terms.filter(term => {
            if (selectedCategory && term.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
            if (newQuery) {
              const searchLower = newQuery.toLowerCase();
              return term.term.toLowerCase().includes(searchLower) ||
                     term.definition.toLowerCase().includes(searchLower) ||
                     term.aliases.some(alias => alias.toLowerCase().includes(searchLower)) ||
                     term.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                     term.relatedTerms.some(related => related.toLowerCase().includes(searchLower));
            }
            return true;
          }).length;
        })();
        
        const dt = Math.round(performance.now() - t0);
        if (__DEV__) log("search_ms", dt, "results", filteredCount, "query_length", newQuery.length);
        
        // Emit custom event for analytics
        window.dispatchEvent(new CustomEvent("glossary:search", {
          detail: { 
            qlen: newQuery.length, 
            results: filteredCount, 
            ms: dt,
            category: selectedCategory || 'all'
          }
        }));
      }
    }, 150);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchInput, glossaryData, selectedCategory]);

  // Handle alias click - find and scroll to the term
  const handleAliasClick = (alias: string) => {
    if (!glossaryData) return;
    
    // Find the term by alias (case-insensitive)
    const term = glossaryData.terms.find(t => 
      t.term.toLowerCase() === alias.toLowerCase() || 
      t.aliases.some(a => a.toLowerCase() === alias.toLowerCase())
    );
    
    if (term) {
      // Clear search and category filters to show all terms
      setSearchQuery('');
      setSelectedCategory('');
      setFocusedTermSlug(term.slug);
      
      // Scroll to the term after a short delay to allow re-render
      setTimeout(() => {
        const element = document.getElementById(`glossary-${term.slug}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Add a temporary highlight effect
          element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          setTimeout(() => {
            element.style.backgroundColor = '';
          }, 2000);
        }
      }, 100);
    }
  };

  // Handle tag click - filter by tag
  const handleTagClick = (tag: string) => {
    if (__DEV__) {
      console.log('🔍 [handleTagClick] clicked tag:', tag);
    }
    
    // Check if this tag matches any known category (case-insensitive)
    const isCategory = glossaryData?.categories 
      ? Object.values(glossaryData.categories).some(cat => cat.name.toLowerCase() === tag.toLowerCase())
      : ['token', 'technology', 'governance', 'defi', 'network', 'economics', 'general', 'ecosystem'].includes(tag.toLowerCase());
    
    if (isCategory) {
      // Toggle category; always clear search on category interactions
      if (__DEV__) {
        console.log('🔍 [handleTagClick] toggling category filter:', tag, 'current:', selectedCategory);
      }
      setSelectedCategory(prev => (prev === tag ? '' : tag));
      setSearchInput('');
      setSearchQuery('');
    } else {
      // Tag as a search term; clear category
      setSelectedCategory('');
      setSearchInput(tag);
      setSearchQuery(tag);
    }
  };

  // Use a ref to track if we've already loaded data
  const hasLoaded = useRef(false);
  const mountedRef = useRef(false);

  // Manual data loading function that can be triggered by user interaction
  const loadDataManually = useCallback(async () => {
    log('🔄 [loadDataManually] Attempting manual load...');
    if (hasLoaded.current) {
      log('🔄 [loadDataManually] Data already loaded, skipping manual load.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchGlossaryData();
      setGlossaryData(data);
      hasLoaded.current = true;
      setIsLoading(false);
      log('✅ [loadDataManually] Glossary data loaded successfully.');

      // Handle initial hash after data is loaded
      const hash = window.location.hash.slice(1);
      // Exclude page anchor IDs from being treated as search terms
      const pageAnchorIds = ['glossary-search-controls', 'glossary-search-results', 'glossary-featured-terms', 'main-content'];
      if (hash && !pageAnchorIds.includes(hash)) {
        const slug = hash.replace(/^glossary-/, '');
        let term = data.terms.find(t => t.slug === slug);
        
        // If no direct slug match, try to find by alias (case-insensitive)
        if (!term) {
          term = data.terms.find(t => 
            t.aliases.some(alias => alias.toLowerCase() === slug.toLowerCase()) ||
            t.term.toLowerCase() === slug.toLowerCase()
          );
        }
        
        if (term) {
          setSearchQuery('');
          setSelectedCategory('');
          setFocusedTermSlug(term.slug);
          setTimeout(() => {
            const element = document.getElementById(`glossary-${term.slug}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
              setTimeout(() => {
                element.style.backgroundColor = '';
              }, 2000);
            }
          }, 100);
        }
      }
        } catch (err) {
          if (__DEV__) console.error('❌ [loadDataManually] Error during manual load:', err);
          setError(err instanceof Error ? err : new Error('Failed to load glossary data manually'));
          setIsLoading(false);
        }
  }, []);

      useEffect(() => {
        let cancelled = false;
        log('🔄 [useEffect] Component mounted, initiating data load...');

        const loadGlossaryData = async () => {
          if (hasLoaded.current) {
            log('🔄 [useEffect] Data already loaded, skipping useEffect load.');
            return;
          }

          try {
            setIsLoading(true);
            setError(null);
            const data = await fetchGlossaryData();

            if (cancelled) {
              log('🔄 [useEffect] Operation cancelled, component unmounted.');
              return;
            }

            setGlossaryData(data);
            hasLoaded.current = true;
            setIsLoading(false);
            log('✅ [useEffect] Glossary data loaded successfully.');

            // Handle URL query parameters (e.g., ?category=token)
            const handleUrlParams = () => {
              const urlParams = new URLSearchParams(window.location.search);
              const categoryParam = urlParams.get('category');
              
              if (categoryParam) {
                // Find matching category (case-insensitive)
                const matchingCategory = Object.values(data.categories).find(cat =>
                  cat.name.toLowerCase() === categoryParam.toLowerCase() ||
                  cat.name.toLowerCase().replace(/\s+/g, '-') === categoryParam.toLowerCase()
                );
                
                if (matchingCategory) {
                  log('🔍 [handleUrlParams] Setting category from URL:', matchingCategory.name);
                  setSelectedCategory(matchingCategory.name);
                  setSearchInput('');
                  setSearchQuery('');
                  setFocusedTermSlug(null);
                  return true; // Handled
                }
              }
              return false; // Not handled
            };

            // Try URL params first, then fall back to hash handling
            const handledByParams = handleUrlParams();

            // Handle hash-based deep linking after data is loaded
            const handleHashChange = () => {
              const hash = window.location.hash.slice(1);
              if (!hash) return;

              // Exclude page anchor IDs from being treated as search terms
              const pageAnchorIds = ['glossary-search-controls', 'glossary-search-results', 'glossary-featured-terms', 'main-content'];
              if (pageAnchorIds.includes(hash)) return;

              // Check if it's a glossary slug
              const slug = hash.replace(/^glossary-/, '');
              let term = data.terms.find(t => t.slug === slug);

              // If no direct slug match, try to find by alias (case-insensitive)
              if (!term) {
                term = data.terms.find(t => 
                  t.aliases.some(alias => alias.toLowerCase() === slug.toLowerCase()) ||
                  t.term.toLowerCase() === slug.toLowerCase()
                );
              }

              if (term) {
                // Navigate to specific term
                setSearchQuery('');
                setSelectedCategory('');
                setFocusedTermSlug(term.slug);

                setTimeout(() => {
                  const element = document.getElementById(`glossary-${term.slug}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                    setTimeout(() => {
                      element.style.backgroundColor = '';
                    }, 2000);
                  }
                }, 100);
              } else {
                // Check if it's a tag or category filter
                const decodedHash = decodeURIComponent(hash);

                // Check if it matches a category
                const matchingCategory = Object.values(data.categories).find(cat =>
                  cat.name.toLowerCase() === decodedHash.toLowerCase()
                );

                if (matchingCategory) {
                  setSelectedCategory(matchingCategory.name);
                  setSearchInput(matchingCategory.name);
                  setSearchQuery(matchingCategory.name);
                  setFocusedTermSlug(null);
                } else {
                  // Treat as tag search
                  setSelectedCategory('');
                  setSearchInput(decodedHash);
                  setSearchQuery(decodedHash);
                  setFocusedTermSlug(null);
                }
              }
            };

            // Only handle hash if URL params weren't handled
            if (!handledByParams) {
              handleHashChange();
            }
            window.addEventListener('hashchange', handleHashChange);
            
            // Also listen for popstate to handle browser back/forward with query params
            const handlePopState = () => {
              handleUrlParams();
            };
            window.addEventListener('popstate', handlePopState);

            return () => {
              window.removeEventListener('hashchange', handleHashChange);
              window.removeEventListener('popstate', handlePopState);
            };
          } catch (err) {
            if (!cancelled) {
              if (__DEV__) console.error('❌ [useEffect] Error during initial load:', err);
              setError(err instanceof Error ? err : new Error('Failed to load glossary data initially'));
              setIsLoading(false);
            }
          }
        };

        loadGlossaryData();

        return () => {
          cancelled = true;
          log('🔄 [useEffect] Component unmounted, cancelling pending operations.');
        };
      }, []);

      // Cleanup on unmount
      useEffect(() => {
        return () => {
          hasLoaded.current = false;
          if (loadFallbackTimeoutRef.current) {
            window.clearTimeout(loadFallbackTimeoutRef.current);
          }
        };
      }, []);

  // Fallback: Use a callback ref to trigger loading when component is mounted
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadFallbackTimeoutRef = useRef<number | null>(null);

  const attachContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || mountedRef.current) return;
      mountedRef.current = true;
      containerRef.current = node;

      if (loadFallbackTimeoutRef.current) {
        window.clearTimeout(loadFallbackTimeoutRef.current);
      }

      loadFallbackTimeoutRef.current = window.setTimeout(() => {
        if (isLoading && !hasLoaded.current) {
          log('⚠️ [GlossarySearchFallback] useEffect did not complete, triggering manual load fallback.');
          loadDataManually();
        }
      }, 2000);
    },
    [isLoading, loadDataManually],
  );

  useEffect(() => {
    if (!shouldUsePortals || !controlsContainer) return;
    attachContainerRef(controlsContainer as HTMLDivElement);
  }, [shouldUsePortals, controlsContainer, attachContainerRef]);

  // Preserve focus when filtering - if focused term is no longer visible, clear focus
  useEffect(() => {
    if (focusedTermSlug && glossaryData) {
      const filteredTerms = filterTerms(glossaryData.terms, searchQuery, selectedCategory);
      const focusedTerm = filteredTerms.find(t => t.slug === focusedTermSlug);
      if (!focusedTerm) {
        setFocusedTermSlug(null);
      }
    }
  }, [searchQuery, selectedCategory, focusedTermSlug, glossaryData]);

  // Dispatch search state events for UX improvements
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasActiveSearch = Boolean(searchQuery.trim() || selectedCategory);
    const featuredSection = document.getElementById('glossary-featured-terms');
    
    if (__DEV__) {
      console.log('🔍 [hide-featured] hasActiveSearch:', hasActiveSearch, 'selectedCategory:', selectedCategory, 'featuredSection:', !!featuredSection);
    }
    
    if (featuredSection) {
      if (hasActiveSearch) {
        featuredSection.style.display = 'none';
        if (__DEV__) console.log('🔍 [hide-featured] Hiding featured section');
      } else {
        featuredSection.style.display = '';
        if (__DEV__) console.log('🔍 [hide-featured] Showing featured section');
      }
    }

    // Dispatch custom event for other potential listeners
    window.dispatchEvent(
      new CustomEvent('glossary:search-state-change', {
        detail: { isActive: hasActiveSearch, query: searchQuery, category: selectedCategory },
      })
    );
  }, [searchQuery, selectedCategory]);

  // Early returns after all hooks
  if (isLoading) {
    const loadingView = (
      <div ref={attachContainerRef} className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex flex-col items-center justify-center py-12" aria-busy="true">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <span className="text-lg text-gray-700 dark:text-gray-200 mb-6 font-medium">Loading glossary...</span>
            <button
              onClick={loadDataManually}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
            >
              Load Glossary Manually
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              If the glossary doesn't load automatically, click the button above.
            </p>
          </div>
        </div>
      </div>
    );

    if (shouldUsePortals) {
      if (resultsContainer) {
        return createPortal(loadingView, resultsContainer);
      }
      return null;
    }

    return loadingView;
  }

  if (error) {
    const errorView = (
      <div ref={attachContainerRef} className="max-w-4xl mx-auto p-6" role="alert">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading glossary
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Failed to load glossary: {String(error.message || error)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (shouldUsePortals) {
      if (resultsContainer) {
        return createPortal(errorView, resultsContainer);
      }
      return null;
    }

    return errorView;
  }

  // TEMPORARY: Modify this to return a visible message if glossaryData is null
  if (!glossaryData && !isLoading && !error) {
    console.log('⚠️ [render] Glossary data is null, not loading, and no error. Returning "No Data" message.');
    const noDataView = (
      <div ref={attachContainerRef} className="max-w-4xl mx-auto p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center py-12">
        <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
          Glossary component rendered, but no data was loaded.
        </p>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
          This might indicate an issue with data fetching or an empty glossary.json.
        </p>
        <button
          onClick={loadDataManually}
          className="mt-4 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-lg font-medium"
        >
          Try Loading Manually
        </button>
      </div>
    );

    if (shouldUsePortals) {
      if (resultsContainer) {
        return createPortal(noDataView, resultsContainer);
      }
      return null;
    }

    return noDataView;
  }

  // Single, explicit filtering pipeline with category > search precedence
  const shouldUseSearch = searchQuery && !selectedCategory;
  const useIndex = Boolean(preIdx) && shouldUseSearch;
  
  // Calculate filtered terms (no useMemo to avoid hooks order issues)
  const filteredTerms = (() => {
    if (!glossaryData?.terms) return [];
    
    // Debug logging
    if (__DEV__) {
      console.log('🔍 [filteredTerms] selectedCategory:', selectedCategory, 'searchQuery:', searchQuery);
      console.log('🔍 [filteredTerms] shouldUseSearch:', shouldUseSearch, 'useIndex:', useIndex);
      console.log('🔍 [filteredTerms] total terms:', glossaryData.terms.length);
    }
    
    const base = glossaryData.terms;

    // 1) Category filter first (takes precedence over search, case-insensitive)
    const selectedCategoryLower = selectedCategory.toLowerCase();
    const byCategory = selectedCategory
      ? base.filter(t => t.category.toLowerCase() === selectedCategoryLower)
      : base;

    // 2) If no search query, return category results
    if (!shouldUseSearch) {
      if (__DEV__) {
        console.log('🔍 [category-only] filtered terms count:', byCategory.length);
        console.log('🔍 [category-only] token terms:', byCategory.filter(t => t.category === 'token').map(t => t.term));
      }
      return byCategory
        .map(t => ({ t, s: scoreTerm(t, '') }))
        .sort((a, b) => b.s - a.s)
        .map(({ t }) => t);
    }

    // 3) Search filtering (only when no category selected)
    let searchResults: GlossaryTerm[];
    
    if (useIndex && preIdx) {
      // Use precomputed index for faster search
      const q = searchQuery.toLowerCase();
      const ranked = preIdx.map(i => {
        let s = 0;
        if (!q) return { slug: i.slug, s };
        if (i.blob === q) s += 50;
        else if (i.blob.startsWith(q)) s += 30;
        else if (i.blob.includes(q)) s += 15;
        s += i.priority * 0.05;
        return { slug: i.slug, s };
      }).sort((a,b) => b.s - a.s);
      
      searchResults = ranked
        .map(({ slug }) => base.find(t => t.slug === slug))
        .filter(Boolean) as GlossaryTerm[];
        
      // Fallback for short queries that might not match in index
      if (searchResults.length === 0 && q.length <= 2) {
        if (__DEV__) {
          console.log('🔍 [index-fallback] Short query, falling back to substring search');
        }
        searchResults = base.filter(t =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          t.aliases?.some(a => a.toLowerCase().includes(q)) ||
          t.tags?.some(tag => tag.toLowerCase().includes(q)) ||
          t.relatedTerms?.some(r => r.toLowerCase().includes(q))
        );
      }
    } else {
      // Simple substring search
      const q = searchQuery.toLowerCase();
      searchResults = base.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.aliases?.some(a => a.toLowerCase().includes(q)) ||
        t.tags?.some(tag => tag.toLowerCase().includes(q)) ||
        t.relatedTerms?.some(r => r.toLowerCase().includes(q))
      );
    }
    
    if (__DEV__) {
      console.log('🔍 [search] filtered terms count:', searchResults.length);
    }
    
    return searchResults
      .map(t => ({ t, s: scoreTerm(t, searchQuery) }))
      .sort((a, b) => b.s - a.s)
      .map(({ t }) => t);
  })();
    
  const categories = Object.values(glossaryData.categories).sort((a, b) => a.name.localeCompare(b.name));

  const filteredCount = filteredTerms.length;
  const hasActiveFilter = Boolean(searchQuery || selectedCategory);
  const filteredMetaLabel =
    filteredCount === 0
      ? hasActiveFilter
        ? 'No glossary entries match your filters yet.'
        : 'No glossary entries available yet.'
      : `${numberFormatter.format(filteredCount)} glossary entr${filteredCount === 1 ? 'y' : 'ies'} available`;

  const controlsContent = (
    <div className="glossary-search__controls">
      <div className="glossary-search__panel">
        <label htmlFor="glossary-fallback-input" className="glossary-search__label">
          Search glossary
        </label>
        <div className="glossary-search__control">
          <input
            id="glossary-fallback-input"
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search glossary terms, definitions, or tags…"
            className="glossary-search__input"
          />
        </div>
        <p className="glossary-search__hint">Results update instantly as you type. Use filters to refine.</p>
      </div>

      <div className="glossary-search__filters">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('');
            setSearchInput('');
            setSearchQuery('');
          }}
          className={`glossary-search__filter ${!selectedCategory ? 'is-active' : ''}`}
        >
          All ({glossaryData?.terms.length || 0})
        </button>
        {(() => {
          // Sort categories: priority ones first (by count desc), then others (by count desc)
          const sortedCategories = [...categories].sort((a, b) => {
            const aIsPriority = PRIORITY_CATEGORIES.has(a.name.toLowerCase());
            const bIsPriority = PRIORITY_CATEGORIES.has(b.name.toLowerCase());
            if (aIsPriority && !bIsPriority) return -1;
            if (!aIsPriority && bIsPriority) return 1;
            return b.count - a.count; // Higher count first within each group
          });
          
          const visibleCategories = showAllCategories 
            ? sortedCategories 
            : sortedCategories.slice(0, VISIBLE_CATEGORY_COUNT);
          const hiddenCount = sortedCategories.length - VISIBLE_CATEGORY_COUNT;
          
          return (
            <>
              {visibleCategories.map((category) => {
                const isActive = selectedCategory.toLowerCase() === category.name.toLowerCase();
                const categoryCount = isActive ? filteredTerms.length : category.count;
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => handleTagClick(category.name)}
                    className={`glossary-search__filter ${isActive ? 'is-active' : ''}`}
                  >
                    {formatCategoryLabel(category.name)} ({categoryCount})
                  </button>
                );
              })}
              {hiddenCount > 0 && !showAllCategories && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories(true)}
                  className="glossary-search__filter glossary-search__filter--more"
                >
                  +{hiddenCount} more
                </button>
              )}
              {showAllCategories && hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories(false)}
                  className="glossary-search__filter glossary-search__filter--less"
                >
                  Show less
                </button>
              )}
            </>
          );
        })()}
      </div>

      <div className="glossary-search__meta" role="status" aria-live="polite">
        {filteredMetaLabel}
      </div>
    </div>
  );

  const resultsContent = (
    <div className="glossary-search__results">
      {filteredTerms.length > 0 ? (
        filteredTerms.map((term) => (
          <Hit
            key={term.slug}
            hit={term}
            onAliasClick={handleAliasClick}
            onTagClick={handleTagClick}
            existingSlugs={existingSlugs}
          />
        ))
      ) : (
        <div className="glossary-search__status glossary-search__status--empty">
          No terms found. Try adjusting your search or filters.
        </div>
      )}
    </div>
  );

  if (shouldUsePortals) {
    if (!controlsContainer || !resultsContainer) {
      return null;
    }

    return (
      <>
        {createPortal(controlsContent, controlsContainer)}
        {createPortal(resultsContent, resultsContainer)}
      </>
    );
  }

  return (
    <div ref={attachContainerRef} className="glossary-search" data-testid="glossary-container">
      {controlsContent}
      {resultsContent}
    </div>
  );
}