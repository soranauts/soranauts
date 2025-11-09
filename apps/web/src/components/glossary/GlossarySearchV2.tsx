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
}

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

export default function GlossarySearchV2({ initialQuery = '' }: GlossarySearchV2Props) {
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
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const ensureEngine = useCallback(async () => {
    if (engineRef.current || isLoading) return;
    try {
      setIsLoading(true);
      const payload = await fetchGlossaryData();
      const engine = createGlossarySearchEngine({
        terms: payload.terms,
        aliasIndex: payload.aliasIndex,
      });
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
    return (
      <a
        key={result.term.slug}
        href={`/glossary/${result.term.slug}`}
        className={`block rounded-lg border p-5 transition-all ${
          isFocused
            ? 'border-red-500 shadow-md dark:border-red-400'
            : 'border-gray-200 hover:border-red-300 dark:border-gray-700 dark:hover:border-red-600'
        }`}
        data-testid={`glossary-result-${result.term.slug}`}
        onMouseEnter={() => setFocusedIndex(index)}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{result.term.term}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{renderMatchHighlight(result)}</p>
          </div>
          {result.term.category && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:bg-red-900/20 dark:text-red-300">
              {result.term.category}
            </span>
          )}
        </div>

        {result.term.aliases?.length > 1 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Also: </span>
            {result.term.aliases.slice(1, 4).map((alias) => (
              <span key={alias} className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">
                {alias}
              </span>
            ))}
          </div>
        )}

        {result.term.relatedTerms?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400 dark:text-gray-500">
            {result.term.relatedTerms.slice(0, 6).map((related) => (
              <span key={related} className="rounded bg-gray-50 px-2 py-1 dark:bg-gray-800">
                #{related.toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </a>
    );
  };

  const renderFeatured = (featured: FeaturedEntityResult) => (
    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900/40 dark:bg-red-900/10" data-testid="glossary-featured">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-300">Featured Entity</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{featured.entity.term.term}</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
            {featured.entity.term.summary ?? featured.entity.term.definition}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <a
            href={`/glossary/${featured.entity.term.slug}`}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            View entity
          </a>
        </div>
      </div>

      {featured.children.length > 0 && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {featured.children.map((child) => (
            <a
              key={child.term.slug}
              href={`/glossary/${child.term.slug}`}
              className="rounded-lg border border-red-200 bg-white p-4 shadow-sm transition hover:border-red-400 dark:border-red-900/40 dark:bg-red-950/30"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{child.term.term}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {child.term.summary ?? child.term.definition}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const element = containerRef.current;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement !== searchInputRef.current) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    element.addEventListener('keydown', handleKey);
    return () => element.removeEventListener('keydown', handleKey);
  }, []);

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

  return (
    <div ref={containerRef} className="glossary-search-v2" data-testid="glossary-search-v2">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="glossary-search-v2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search Glossary
            </label>
            <div className="relative mt-1">
              <input
                id="glossary-search-v2"
                ref={searchInputRef}
                type="search"
                value={searchInput}
                onFocus={handleFocus}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search entities, versions, aliases, or tags"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400 dark:text-gray-500">
                /
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Use ↑ ↓ to navigate, Enter to open, Esc to reset.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter('')}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                !categoryFilter
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-900/30'
              }`}
            >
              All
            </button>
            {categoryCounts.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => handleCategoryClick(category.key)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  categoryFilter === category.key
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-900/30'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {isLoading && !response && (
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600"></span>
          Loading glossary…
        </div>
      )}

      {response && (
        <div className="mt-6 space-y-6">
          {response.didYouMean && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-200">
              Did you mean{' '}
              <button
                className="font-semibold text-yellow-900 underline hover:text-yellow-700 dark:text-yellow-100"
                onClick={() => setSearchInput(response.didYouMean ?? '')}
              >
                {response.didYouMean}
              </button>
              ?
            </div>
          )}

          {featuredEntity && renderFeatured(featuredEntity)}

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{response.results.length} result{response.results.length === 1 ? '' : 's'}</span>
          </div>

          {response.results.length > 0 ? (
            <div className="grid gap-4">
              {response.results.map((result, index) => renderResult(result, index))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              <p>No results yet. Try searching for “hyperled”, “iroha v3”, or “polkaswap”.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

