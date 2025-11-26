import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
  FeaturedEntityResult,
  GlossarySearchIndexInput,
  GlossarySearchResponse,
  GlossarySearchResult,
} from '../../lib/glossary/search';
import { createGlossarySearchEngine } from '../../lib/glossary/search';

type GlossaryJsonPayload = GlossarySearchIndexInput & {
  categories: Record<string, { name: string; count: number }>;
  totalCount: number;
  lastUpdated: string;
};

interface CategoryStats {
  key: string;
  name: string;
  count: number;
}

interface GlossarySearchV2Props {
  initialQuery?: string;
  controlsContainerId?: string;
  resultsContainerId?: string;
  canonicalSearchEnabled?: boolean;
  aliasMicrocopyEnabled?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  token: 'Token',
  technology: 'Technology',
  governance: 'Governance',
  defi: 'DeFi',
  network: 'Network',
  economics: 'Economics',
  tag: 'Tag',
};

const formatLabel = (value: string): string =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());

const fetchGlossaryData = async (): Promise<GlossaryJsonPayload> => {
  const response = await fetch('/glossary.json', {
    headers: {
      accept: 'application/json',
      'cache-control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load glossary data: ${response.status}`);
  }

  return response.json();
};

let canonicalResolverPromise: Promise<((slug: string) => string) | undefined> | null = null;

const getCanonicalResolver = async (
  canonicalSearchEnabled: boolean,
): Promise<((slug: string) => string) | undefined> => {
  if (!canonicalSearchEnabled) return undefined;
  if (!canonicalResolverPromise) {
    canonicalResolverPromise = (async () => {
      try {
        const [termsResponse, aliasesResponse] = await Promise.all([
          fetch('/data/glossary.v2025.json', {
            headers: { accept: 'application/json', 'cache-control': 'no-cache' },
          }),
          fetch('/glossary.aliases.v2025.json', {
            headers: { accept: 'application/json', 'cache-control': 'no-cache' },
          }).catch(() => null),
        ]);

        if (!termsResponse.ok) {
          throw new Error(`Failed to load data/glossary.v2025.json (${termsResponse.status})`);
        }

        const canonicalData = await termsResponse.json();
        const aliasData = aliasesResponse && aliasesResponse.ok ? await aliasesResponse.json() : { aliases: [] };

        const canonicalMap = new Map<string, string>();
        canonicalData.terms.forEach((entry: any) => {
          if (entry.status === 'alias' && entry.targetSlug) {
            canonicalMap.set(entry.slug, entry.targetSlug);
          } else if (entry.status === 'canonical') {
            canonicalMap.set(entry.slug, entry.slug);
          }
        });
        aliasData.aliases?.forEach((entry: any) => {
          if (entry.alias && entry.target) {
            canonicalMap.set(entry.alias, entry.target);
          }
        });

        if (!canonicalMap.size) {
          return undefined;
        }

        return (slug: string) => canonicalMap.get(slug) ?? slug;
      } catch (error) {
        console.warn('[glossary search] canonical resolver unavailable:', error);
        return undefined;
      }
    })();
  }

  return canonicalResolverPromise;
};

import { createPortal } from 'react-dom';

export default function GlossarySearchV2({
  initialQuery = '',
  controlsContainerId,
  resultsContainerId,
  canonicalSearchEnabled = false,
  aliasMicrocopyEnabled = false,
}: GlossarySearchV2Props) {
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [response, setResponse] = useState<GlossarySearchResponse | null>(null);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const engineRef = useRef<ReturnType<typeof createGlossarySearchEngine> | null>(null);
  const debounceRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [controlsContainer, setControlsContainer] = useState<HTMLElement | null>(null);
  const [resultsContainer, setResultsContainer] = useState<HTMLElement | null>(null);
  const isBrowser = typeof window !== 'undefined';
  const isServer = !isBrowser;
  const shouldUsePortals = Boolean(controlsContainerId && resultsContainerId);

  useEffect(() => {
    if (!shouldUsePortals || !isBrowser) return;
    const controlsEl = document.getElementById(controlsContainerId!);
    const resultsEl = document.getElementById(resultsContainerId!);
    setControlsContainer(controlsEl);
    setResultsContainer(resultsEl);
  }, [controlsContainerId, resultsContainerId, shouldUsePortals, isBrowser]);

  useEffect(() => {
    if (controlsContainer) {
      controlsContainer.setAttribute('data-testid', 'glossary-search-v2');
    }
  }, [controlsContainer]);

  const ensureEngine = useCallback(async () => {
    if (engineRef.current || isLoading) return;
    try {
      setIsLoading(true);
      const [payload, canonicalResolver] = await Promise.all([
        fetchGlossaryData(),
        getCanonicalResolver(canonicalSearchEnabled),
      ]);
      const engine = createGlossarySearchEngine(
        {
          terms: payload.terms,
          aliasIndex: payload.aliasIndex,
        },
        canonicalResolver ? { resolveCanonicalSlug: canonicalResolver } : undefined,
      );
      engineRef.current = engine;

      const categoryList: CategoryStats[] = Object.entries(payload.categories)
        .map(([key, value]) => ({ key, name: value.name, count: value.count }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setCategories(categoryList);
      setIsReady(true);
      const initial = engine.search(initialQuery ? initialQuery : '', categoryFilter ? { category: categoryFilter } : undefined);
      setResponse(initial);
      setFocusedIndex(initial.results.length ? 0 : -1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading glossary');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, initialQuery, categoryFilter]);

  const runSearch = useCallback(
    (query: string, category?: string) => {
      if (!engineRef.current) return;
      const options = category ? { category } : undefined;
      const result = engineRef.current.search(query, options);
      setResponse(result);
      setFocusedIndex(result.results.length ? 0 : -1);
    },
    [],
  );

  const debouncedSearch = useCallback(
    (query: string, category?: string) => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      debounceRef.current = window.setTimeout(() => {
        runSearch(query, category);
      }, 120);
    },
    [runSearch],
  );

  useEffect(() => {
    if (!isReady || !engineRef.current) return;
    debouncedSearch(searchInput, categoryFilter || undefined);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchInput, categoryFilter, isReady, debouncedSearch]);

  // Dispatch search state events for UX improvements
  useEffect(() => {
    if (!isBrowser) return;
    const hasActiveSearch = Boolean(searchInput.trim() || categoryFilter);
    const featuredSection = document.getElementById('glossary-featured-terms');
    
    if (featuredSection) {
      if (hasActiveSearch) {
        featuredSection.classList.add('is-hidden');
      } else {
        featuredSection.classList.remove('is-hidden');
      }
    }

    // Dispatch custom event for other potential listeners
    window.dispatchEvent(
      new CustomEvent('glossary:search-state-change', {
        detail: { isActive: hasActiveSearch, query: searchInput, category: categoryFilter },
      })
    );
  }, [searchInput, categoryFilter, isBrowser]);

  const handleFocus = useCallback(() => {
    if (!engineRef.current) {
      ensureEngine();
    }
  }, [ensureEngine]);

  useEffect(() => {
    ensureEngine();
  }, [ensureEngine]);

  useEffect(() => {
    if (initialQuery) {
      ensureEngine();
    }
  }, [initialQuery, ensureEngine]);

  const handleCategoryClick = useCallback(
    (category: string) => {
      setCategoryFilter((current) => (current === category ? '' : category));
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!response?.results.length) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % response.results.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + response.results.length) % response.results.length);
      } else if (event.key === 'Enter') {
        if (focusedIndex >= 0 && focusedIndex < response.results.length) {
          const target = response.results[focusedIndex];
          window.location.href = `/glossary/${target.term.slug}`;
        }
      } else if (event.key === 'Escape') {
        setSearchInput('');
        setCategoryFilter('');
        setFocusedIndex(-1);
      }
    },
    [response, focusedIndex],
  );

  const categoryCounts = useMemo(() => {
    if (!response) return categories;
    const counts = new Map<string, number>();
    for (const result of response.results) {
      const key = result.term.category ?? 'uncategorized';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return categories.map((category) => ({
      ...category,
      count: counts.get(category.key) ?? 0,
    }));
  }, [response, categories]);

  const featuredEntity = response?.featured;

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en', {
        maximumFractionDigits: 0,
      }),
    [],
  );

  const resultCountLabel = useMemo(() => {
    if (error) {
      return 'There was an issue loading the glossary index.';
    }
    if (isLoading && !response) {
      return 'Loading glossary index…';
    }
    if (!response) {
      return 'Preparing glossary index…';
    }
    const count = response.results.length;
    if (count === 0) {
      if (searchInput || categoryFilter) {
        return 'No glossary entries match your filters yet.';
      }
      return 'No glossary entries available yet.';
    }
    const formattedCount = numberFormatter.format(count);
    return `${formattedCount} glossary entr${count === 1 ? 'y' : 'ies'} available`;
  }, [response, isLoading, searchInput, categoryFilter, numberFormatter, error]);

  const renderMatchHighlight = (result: GlossarySearchResult) => {
    const tokens = new Set(
      result.matches
        .map((match) => match.split(':')[1])
        .filter(Boolean)
        .map((token) => token?.toLowerCase()),
    );

    const definition = result.term.summary ?? result.term.definition;
    if (!tokens.size || !definition) return definition;

    const parts = definition.split(/(\s+)/);
    return parts.map((part, index) => {
      const normalized = part.toLowerCase();
      if (tokens.has(normalized)) {
        return (
          <mark key={`${result.term.slug}-${index}`} className="search-highlight">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const renderResult = (result: GlossarySearchResult, index: number) => {
    const isFocused = index === focusedIndex;
    const categoryLabel = result.term.category
      ? CATEGORY_LABELS[result.term.category] ?? formatLabel(result.term.category)
      : undefined;
    const aliasLabel =
      aliasMicrocopyEnabled && result.matchedAlias ? result.matchedAlias : null;

    return (
      <a
        key={result.term.slug}
        href={`/glossary/${result.term.slug}`}
        className={`glossary-card glossary-search__result ${isFocused ? 'is-focused' : ''}`}
        data-testid={`glossary-result-${result.term.slug}`}
        onMouseEnter={() => setFocusedIndex(index)}
      >
        <div className="glossary-card__header">
          <div className="glossary-search__result-title">{result.term.term}</div>
          {categoryLabel && (
            <button
              type="button"
              className="glossary-chip glossary-search__chip"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setCategoryFilter(result.term.category ?? '');
              }}
              title={`Filter by ${categoryLabel}`}
            >
              {categoryLabel}
            </button>
          )}
        </div>

        {aliasLabel && <div className="search-result-alias">via alias {aliasLabel}</div>}

        <p className="glossary-search__result-summary">{renderMatchHighlight(result)}</p>

        {result.term.aliases?.length > 1 && (
          <div className="glossary-search__chips">
            <span className="glossary-chip glossary-chip--muted glossary-search__chip" style={{ pointerEvents: 'none' }}>
              Also
            </span>
            {result.term.aliases.slice(1, 5).map((alias) => (
              <button
                key={alias}
                type="button"
                className="glossary-chip glossary-chip--muted glossary-search__chip"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSearchInput(alias);
                }}
                title={`Search for ${alias}`}
              >
                {alias}
              </button>
            ))}
          </div>
        )}

        {result.term.relatedTerms?.length > 0 && (
          <div className="glossary-search__chips">
            {result.term.relatedTerms.slice(0, 6).map((related) => (
              <span key={related} className="glossary-chip glossary-chip--muted">
                #{related.toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </a>
    );
  };

  const renderFeatured = (featured: FeaturedEntityResult) => (
    <div className="glossary-search__featured" data-testid="glossary-featured">
      <div className="glossary-search__featured-header">
        <div>
          <p className="glossary-search__label">Featured entity</p>
          <h2 className="glossary-search__featured-title">{featured.entity.term.term}</h2>
          <p className="glossary-search__result-summary">
            {featured.entity.term.summary ?? featured.entity.term.definition}
          </p>
        </div>
        <div className="glossary-search__featured-actions">
          <a href={`/glossary/${featured.entity.term.slug}`} className="glossary-chip">
            View entity
          </a>
        </div>
      </div>

      {featured.children.length > 0 && (
        <div className="glossary-search__featured-grid">
          {featured.children.map((child) => (
            <a key={child.term.slug} href={`/glossary/${child.term.slug}`} className="glossary-related-link">
              <span className="glossary-related-link__title">{child.term.term}</span>
              <span className="glossary-related-link__summary">
                {child.term.summary ?? child.term.definition}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (!isBrowser) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement !== searchInputRef.current) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isBrowser]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (searchInput) {
      url.searchParams.set('q', searchInput);
    } else {
      url.searchParams.delete('q');
    }

    if (categoryFilter) {
      url.searchParams.set('category', categoryFilter);
    } else {
      url.searchParams.delete('category');
    }

    window.history.replaceState({}, '', `${url.pathname}${url.search}`);
  }, [searchInput, categoryFilter]);

  const controlsContent = (
    <div className="glossary-search__controls">
      <div className="glossary-search__panel">
        <label htmlFor="glossary-search-v2" className="glossary-search__label">
          Search glossary
        </label>
        <div className="glossary-search__control">
          <input
            id="glossary-search-v2"
            ref={searchInputRef}
            type="search"
            value={searchInput}
            onFocus={handleFocus}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search entities, versions, aliases, or tags"
            className="glossary-search__input"
          />
        </div>
        <p className="glossary-search__hint">Press / to focus, use ↑ ↓ to navigate, Enter to open, Esc to reset.</p>
      </div>

      <div className="glossary-search__filters">
        <button
          type="button"
          onClick={() => setCategoryFilter('')}
          className={`glossary-search__filter ${!categoryFilter ? 'is-active' : ''}`}
        >
          All
        </button>
        {categoryCounts.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => handleCategoryClick(category.key)}
            className={`glossary-search__filter ${categoryFilter === category.key ? 'is-active' : ''}`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      <div className="glossary-search__meta" role="status" aria-live="polite">
        {resultCountLabel}
      </div>

      {error && <div className="glossary-search__status glossary-search__status--error">{error}</div>}

      {isLoading && !response && (
        <div className="glossary-search__status">
          <span className="glossary-search__status-indicator" />
          Loading glossary…
        </div>
      )}

      {response?.didYouMean && (
        <div className="glossary-search__status glossary-search__status--suggestion">
          Did you mean{' '}
          <button
            type="button"
            onClick={() => setSearchInput(response.didYouMean ?? '')}
            className="glossary-search__suggestion"
          >
            {response.didYouMean}
          </button>
          ?
        </div>
      )}
    </div>
  );

  const resultsContent = response ? (
    <>
      {featuredEntity && renderFeatured(featuredEntity)}

      <div className="glossary-search__results">
        {response.results.length ? (
          response.results.map((result, index) => renderResult(result, index))
        ) : (
          <div className="glossary-search__status glossary-search__status--empty">
            No results yet. Try adjusting your search or category filter.
          </div>
        )}
      </div>
    </>
  ) : null;

  if (shouldUsePortals) {
    if (isServer) {
      return null;
    }
    if (!controlsContainer || !resultsContainer) {
      return null;
    }

    return (
      <>
        {createPortal(controlsContent, controlsContainer)}
        {createPortal(resultsContent ?? null, resultsContainer)}
      </>
    );
  }

  if (isServer) {
    return null;
  }

  return (
    <div className="glossary-search" data-testid="glossary-search-v2">
      {controlsContent}
      {resultsContent}
    </div>
  );
}

