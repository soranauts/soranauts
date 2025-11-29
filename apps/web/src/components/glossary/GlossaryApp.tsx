import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GlossaryData, GlossaryTerm, GlossaryFilter } from '../../types/glossary';
import { loadGlossaryFull, type Term as GlossaryTermPayload } from '../../lib/glossary-data';

// Search and filter terms
function filterTerms(terms: GlossaryTerm[], filter: GlossaryFilter): GlossaryTerm[] {
  let filtered = terms;

  // Category filter
  if (filter.category) {
    filtered = filtered.filter(term => term.category === filter.category);
  }

  // Tag filter
  if (filter.tags && filter.tags.length > 0) {
    filtered = filtered.filter((term) =>
      filter.tags!.some((tag) => (term.tags ?? []).includes(tag)),
    );
  }

  // Search filter
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter((term) => {
      const termMatch = term.term?.toLowerCase().includes(searchLower);
      const definitionMatch = term.definition?.toLowerCase().includes(searchLower);
      const aliasMatch = (term.aliases ?? []).some((alias) => alias.toLowerCase().includes(searchLower));
      const tagMatch = (term.tags ?? []).some((tag) => tag.toLowerCase().includes(searchLower));
      const relatedMatch = (term.relatedTerms ?? []).some((related) =>
        related.toLowerCase().includes(searchLower),
      );
      return Boolean(termMatch || definitionMatch || aliasMatch || tagMatch || relatedMatch);
    });
  }

  return filtered;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface GlossaryAppProps {
  initialTerm?: string; // For deep linking to specific terms
}

// Main component that fetches data and renders the glossary
export default function GlossaryApp({ initialTerm }: GlossaryAppProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [glossaryData, setGlossaryData] = useState<GlossaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 150);

  const toGlossaryTerm = (entry: GlossaryTermPayload | GlossaryTerm): GlossaryTerm => {
    const fallbackTitle = (entry as GlossaryTermPayload).title ?? entry.slug;
    const typed = entry as GlossaryTerm;
    return {
      term: typed.term ?? fallbackTitle,
      slug: entry.slug,
      definition: typed.definition ?? (entry as GlossaryTermPayload).summary ?? '',
      category: typed.category ?? 'token',
      relatedTerms: Array.isArray(typed.relatedTerms) ? typed.relatedTerms : [],
      aliases: Array.isArray((entry as GlossaryTermPayload).aliases)
        ? (entry as GlossaryTermPayload).aliases
        : [],
      tags: Array.isArray(typed.tags) ? typed.tags : [],
      priority: typeof typed.priority === 'number' ? typed.priority : 0,
      examples: typed.examples ?? [],
      links: typed.links ?? [],
    };
  };

  const buildCategories = (terms: GlossaryTerm[]): GlossaryData['categories'] =>
    terms.reduce<GlossaryData['categories']>((acc, term) => {
      const key = term.category ?? 'token';
      if (!acc[key]) {
        acc[key] = { name: key, count: 0 };
      }
      acc[key].count += 1;
      return acc;
    }, {});

  // Fetch glossary data on component mount
  useEffect(() => {
    const loadGlossaryData = async () => {
      try {
        setIsLoading(true);
        const rawTerms = await loadGlossaryFull();
        const terms = rawTerms.map((term) => toGlossaryTerm(term as GlossaryTerm));
        setGlossaryData({
          terms,
          categories: buildCategories(terms),
          totalCount: terms.length,
          lastUpdated: new Date().toISOString(),
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load glossary data');
      } finally {
        setIsLoading(false);
      }
    };

    loadGlossaryData();
  }, []);

  // Create filter object
  const filter: GlossaryFilter = {
    search: debouncedSearch,
    category: selectedCategory || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  };

  // Filter terms
  const filteredTerms = glossaryData ? filterTerms(glossaryData.terms, filter) : [];

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!filteredTerms.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredTerms.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredTerms.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredTerms.length) {
          handleTermClick(filteredTerms[focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedTags([]);
        setFocusedIndex(-1);
        setSelectedTerm(null);
        searchInputRef.current?.focus();
        break;
    }
  }, [filteredTerms, focusedIndex]);

  // Handle term click
  const handleTermClick = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    setFocusedIndex(-1);
    
    // Scroll to term and update URL with consistent ID
    const element = document.getElementById(`glossary-${term.slug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update URL hash
    window.history.replaceState(null, '', `#glossary-${term.slug}`);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setFocusedIndex(-1);
  };

  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setFocusedIndex(-1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
    setFocusedIndex(-1);
    setSelectedTerm(null);
    searchInputRef.current?.focus();
  };

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Handle initial term from URL hash and hash changes
  useEffect(() => {
    if (!glossaryData) return;
    
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (!hash) return;
      
      // Support both "#slug" and "#glossary-slug" formats
      const slug = hash.replace(/^glossary-/, '');
      const term = glossaryData.terms.find(t => t.slug === slug);
      
      if (term) {
        setSelectedTerm(term);
        setTimeout(() => {
          const element = document.getElementById(`glossary-${term.slug}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };
    
    // Handle initial hash or initialTerm prop
    if (initialTerm) {
      const term = glossaryData.terms.find(t => t.slug === initialTerm);
      if (term) {
        setSelectedTerm(term);
        setTimeout(() => {
          const element = document.getElementById(`glossary-${term.slug}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } else {
      // Check current hash
      handleHashChange();
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [glossaryData, initialTerm]);

  // Reset focused index when filters change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [debouncedSearch, selectedCategory, selectedTags]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading glossary...</span>
      </div>
    );
  }

  if (error) {
    return (
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
              <p>Failed to load glossary data. Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!glossaryData) {
    return null;
  }

  const categories = Object.values(glossaryData.categories);
  const allTags = Array.from(new Set(glossaryData.terms.flatMap(term => term.tags))).sort();

  return (
    <div className="max-w-4xl mx-auto glossary-app">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        {/* Search Input */}
        <div className="mb-4">
          <label htmlFor="glossary-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Glossary
          </label>
          <div className="relative">
            <input
              ref={searchInputRef}
              id="glossary-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search terms, definitions, or tags..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              role="searchbox"
              aria-describedby="search-help"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <p id="search-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Use arrow keys to navigate, Enter to select, Esc to clear
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                aria-pressed={selectedCategory === category.name}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {allTags.slice(0, 20).map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                }`}
                aria-pressed={selectedTags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || selectedCategory || selectedTags.length > 0) && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredTerms.length} of {glossaryData.totalCount} terms
          </p>
          {filteredTerms.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No terms found. Try adjusting your search or filters.
            </p>
          )}
        </div>

        {/* Terms List */}
        {filteredTerms.length > 0 && (
          <div
            ref={resultsRef}
            role="listbox"
            aria-label="Glossary terms"
            className="space-y-3"
          >
            {filteredTerms.map((term, index) => (
              <div
                key={term.slug}
                id={`glossary-${term.slug}`}
                role="option"
                aria-selected={focusedIndex === index}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  focusedIndex === index
                    ? 'border-gray-400 bg-gray-50 dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${selectedTerm?.slug === term.slug ? 'ring-2 ring-gray-400 dark:ring-gray-500' : ''}`}
                onClick={() => handleTermClick(term)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {term.term}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {term.definition}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => handleCategoryChange(term.category)}
                        className="px-2 py-1 rounded-full font-medium transition-colors cursor-pointer bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        title={`Filter by ${term.category}`}
                      >
                        {term.category}
                      </button>
                      {term.aliases.length > 1 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          Also: {term.aliases.slice(1, 4).map((alias, index) => {
                            const linkedTerm = glossaryData ? findTermByAlias(glossaryData, alias) : null;
                            return (
                              <React.Fragment key={alias}>
                                {linkedTerm ? (
                                  <button
                                    onClick={() => handleTermClick(linkedTerm)}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline cursor-pointer"
                                  >
                                    {alias}
                                  </button>
                                ) : (
                                  <span>{alias}</span>
                                )}
                                {index < term.aliases.slice(1, 4).length - 1 && ', '}
                              </React.Fragment>
                            );
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to find term by alias
function findTermByAlias(glossaryData: GlossaryData, alias: string): GlossaryTerm | null {
  return glossaryData.terms.find(term => 
    term.aliases.some(a => a.toLowerCase() === alias.toLowerCase()) ||
    term.term.toLowerCase() === alias.toLowerCase()
  ) || null;
}
