import React, { useState, useEffect, useRef } from 'react';
import { scoreTerm } from './utils';

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

// Fetch glossary data
async function fetchGlossaryData(): Promise<GlossaryData> {
  log('🔍 [fetchGlossaryData] Starting glossary fetch...');
  try {
    const response = await fetch('/glossary.json', {
      headers: {
        'accept': 'application/json',
        'cache-control': 'no-store'
      }
    });
    log('🔍 [fetchGlossaryData] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch glossary data: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    log('🔍 [fetchGlossaryData] Data received:', data?.terms?.length || 0, 'terms');

    if (!data || !data.terms || !Array.isArray(data.terms)) {
      throw new Error('Invalid glossary data format: missing or malformed "terms" array');
    }
    return data;
  } catch (err) {
    if (__DEV__) console.error('❌ [fetchGlossaryData] Error during fetch:', err);
    throw err; // Re-throw to be caught by calling function
  }
}

// Search and filter terms
function filterTerms(terms: GlossaryTerm[], searchQuery: string, category: string): GlossaryTerm[] {
  let filtered = terms;

  // Category filter
  if (category) {
    filtered = filtered.filter(term => term.category === category);
  }

  // Search filter
  if (searchQuery) {
    const searchLower = searchQuery.toLowerCase();
    filtered = filtered.filter(term => 
      term.term.toLowerCase().includes(searchLower) ||
      term.definition.toLowerCase().includes(searchLower) ||
      term.aliases.some(alias => alias.toLowerCase().includes(searchLower)) ||
      term.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      term.relatedTerms.some(related => related.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
}

// Hit component for displaying search results
function Hit({ hit, onAliasClick, onTagClick }: { 
  hit: GlossaryTerm; 
  onAliasClick: (alias: string) => void;
  onTagClick: (tag: string) => void;
}) {
  return (
    <a
      href={`/glossary/${hit.slug}`}
      id={`glossary-${hit.slug}`}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-red-300 dark:hover:border-red-600 transition-all cursor-pointer scroll-mt-24"
      aria-label={`Open ${hit.term} term page`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
          {hit.term}
        </h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTagClick(hit.category);
          }}
          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 cursor-pointer ${
            hit.category === 'token' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            hit.category === 'technology' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
            hit.category === 'governance' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
            hit.category === 'defi' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            hit.category === 'network' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
            'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
          }`}
          title={`Filter by ${hit.category} category`}
        >
          {hit.category}
        </button>
      </div>
      
      <div className="text-gray-600 dark:text-gray-300 mb-3">
        {hit.definition}
      </div>
      
      {hit.aliases && hit.aliases.length > 1 && (
        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Also:</p>
          <div className="flex flex-wrap gap-1">
            {hit.aliases.slice(1).map((alias: string) => (
              <button
                key={alias}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAliasClick(alias);
                }}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                title={`Jump to ${alias}`}
              >
                {alias}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {hit.tags && hit.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {hit.tags.slice(0, 5).map((tag: string) => (
            <button
              key={tag}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
              title={`Filter by ${tag} tag`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </a>
  );
}


// Main search component
export default function GlossarySearchFallback() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [glossaryData, setGlossaryData] = useState<GlossaryData | null>(null);
  const [preIdx, setPreIdx] = useState<{slug:string;priority:number;blob:string}[]|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusedTermSlug, setFocusedTermSlug] = useState<string | null>(null);
  
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
            if (selectedCategory && term.category !== selectedCategory) return false;
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
    // If it's a category, filter by category AND populate search field
    if (['token', 'technology', 'governance', 'defi', 'network', 'economics'].includes(tag)) {
      setSelectedCategory(tag);
      setSearchInput(tag);
      setSearchQuery(tag); // Also populate search field for consistency
    } else {
      // If it's a regular tag, search for it
      setSearchInput(tag);
      setSearchQuery(tag);
      setSelectedCategory(''); // Clear category when searching
    }
  };

  // Use a ref to track if we've already loaded data
  const hasLoaded = useRef(false);
  const mountedRef = useRef(false);

  // Manual data loading function that can be triggered by user interaction
  const loadDataManually = async () => {
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
      if (hash) {
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
      };

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

        // Handle hash-based deep linking after data is loaded
        const handleHashChange = () => {
          const hash = window.location.hash.slice(1);
          if (!hash) return;

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

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);

        return () => {
          window.removeEventListener('hashchange', handleHashChange);
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

  // Fallback: Use a callback ref to trigger loading when component is mounted
  const containerRef = useRef<HTMLDivElement>(null);
  
  const setContainerRef = (node: HTMLDivElement | null) => {
    if (node && !mountedRef.current) {
      mountedRef.current = true;
      containerRef.current = node;
      
          // If useEffect didn't work (still loading after 2 seconds), try manual approach
          setTimeout(() => {
            if (isLoading && !hasLoaded.current) {
              log('⚠️ [setContainerRef] useEffect did not complete, triggering manual load fallback.');
              loadDataManually();
            }
          }, 2000);
    }
  };

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

  // Early returns after all hooks
  if (isLoading) {
    return (
      <div ref={setContainerRef} className="max-w-4xl mx-auto p-6">
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
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6" role="alert">
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
  }

  // TEMPORARY: Modify this to return a visible message if glossaryData is null
  if (!glossaryData && !isLoading && !error) {
    console.log('⚠️ [render] Glossary data is null, not loading, and no error. Returning "No Data" message.');
    return (
      <div ref={setContainerRef} className="max-w-4xl mx-auto p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center py-12">
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
  }

  // Use precomputed index for faster filtering if available
  const filteredTerms = (() => {
    if (!glossaryData?.terms) return [];
    
    // If we have precomputed index and search query, use it for faster filtering
    if (preIdx && searchQuery) {
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
      
      // Map slugs back to full terms and apply category filter
      return ranked
        .map(({ slug }) => glossaryData.terms.find(t => t.slug === slug))
        .filter(term => term && (!selectedCategory || term.category === selectedCategory))
        .filter(Boolean) as GlossaryTerm[];
    }
    
    // Fallback to original filtering logic
    return glossaryData.terms
      .filter(term => {
        // Category filter
        if (selectedCategory && term.category !== selectedCategory) return false;
        
        // Search filter
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          return term.term.toLowerCase().includes(searchLower) ||
                 term.definition.toLowerCase().includes(searchLower) ||
                 term.aliases.some(alias => alias.toLowerCase().includes(searchLower)) ||
                 term.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                 term.relatedTerms.some(related => related.toLowerCase().includes(searchLower));
        }
        
        return true;
      })
      .map(t => ({ t, s: scoreTerm(t, searchQuery) }))
      .sort((a, b) => b.s - a.s)
      .map(({ t }) => t);
  })();
    
  const categories = Object.values(glossaryData.categories).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div ref={setContainerRef} className="max-w-4xl mx-auto">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search glossary terms, definitions, or tags..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {/* All button */}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchInput('');
                  setSearchQuery('');
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All ({glossaryData?.terms.length || 0})
              </button>
              {categories.map(category => (
                <button
                  key={category.name}
                  onClick={() => {
                    if (selectedCategory === category.name) {
                      // Deselecting - clear both
                      setSelectedCategory('');
                      setSearchInput('');
                      setSearchQuery('');
                    } else {
                      // Selecting - set both category and search
                      setSelectedCategory(category.name);
                      setSearchInput(category.name);
                      setSearchQuery(category.name);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4" aria-live="polite">
            Found {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {filteredTerms.length > 0 ? (
          <div className="space-y-4">
            {filteredTerms.map((term) => (
              <Hit 
                key={term.slug} 
                hit={term} 
                onAliasClick={handleAliasClick}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No terms found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}