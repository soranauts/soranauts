import React, { useState, useEffect } from 'react';
import { loadGlossaryFull, type Term as GlossaryTermPayload } from '../../lib/glossary-data';

interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category: string;
  relatedTerms: string[];
  aliases: string[];
  tags: string[];
  examples?: string[];
  links?: {
    label: string;
    url: string;
  }[];
  priority: number;
}

interface GlossaryData {
  terms: GlossaryTerm[];
  categories: Record<string, {
    name: string;
    label: string;
    count: number;
    description: string;
  }>;
  totalCount: number;
  lastUpdated: string;
}

interface GlossaryAppProps {
  initialTerm?: string;
}

export default function GlossaryAppSimple({ initialTerm }: GlossaryAppProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [glossaryData, setGlossaryData] = useState<GlossaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch glossary data
  useEffect(() => {
    const loadGlossaryData = async () => {
      try {
        setIsLoading(true);
        const rawTerms = await loadGlossaryFull();
        const terms = rawTerms.map((term) => {
          const typed = term as GlossaryTerm;
          const fallback = (term as GlossaryTermPayload).title ?? term.slug;
          return {
            term: typed.term ?? fallback,
            slug: term.slug,
            definition: typed.definition ?? (term as GlossaryTermPayload).summary ?? '',
            category: typed.category ?? 'token',
            relatedTerms: Array.isArray(typed.relatedTerms) ? typed.relatedTerms : [],
            aliases: Array.isArray(typed.aliases) ? typed.aliases : [],
            tags: Array.isArray(typed.tags) ? typed.tags : [],
            examples: typed.examples ?? [],
            links: typed.links ?? [],
            priority: typeof typed.priority === 'number' ? typed.priority : 0,
          };
        });

        const categories = terms.reduce<GlossaryData['categories']>((acc, term) => {
          const key = term.category ?? 'token';
          if (!acc[key]) {
            acc[key] = {
              name: key,
              label: key,
              count: 0,
              description: '',
            };
          }
          acc[key].count += 1;
          return acc;
        }, {});

        setGlossaryData({
          terms,
          categories,
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

  // Filter terms based on search and category
  const filteredTerms =
    glossaryData?.terms.filter((term) => {
      const haystack = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (term.term ?? '').toLowerCase().includes(haystack) ||
        (term.definition ?? '').toLowerCase().includes(haystack) ||
        (term.aliases ?? []).some((alias) => alias.toLowerCase().includes(haystack));

      const matchesCategory = !selectedCategory || term.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }) || [];

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  // Handle term click
  const handleTermClick = (term: GlossaryTerm) => {
    const element = document.getElementById(`glossary-${term.slug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.history.replaceState(null, '', `#glossary-${term.slug}`);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading glossary...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading glossary
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error}</p>
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
              id="glossary-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms, definitions, or tags..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
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
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || selectedCategory) && (
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
          <div className="space-y-3">
            {filteredTerms.map((term) => (
              <div
                key={term.slug}
                id={`glossary-${term.slug}`}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => handleTermClick(term)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryChange(term.category);
                        }}
                        className="px-2 py-1 rounded-full font-medium transition-colors cursor-pointer bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        {term.category}
                      </button>
                      {term.aliases.length > 1 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          Also: {term.aliases.slice(1, 4).map((alias, index) => (
                            <button
                              key={alias}
                              onClick={(e) => {
                                e.stopPropagation();
                                const targetTerm = glossaryData.terms.find(t => t.term === alias);
                                if (targetTerm) {
                                  handleTermClick(targetTerm);
                                }
                              }}
                              className="hover:text-blue-600 dark:hover:text-blue-400 underline"
                            >
                              {alias}{index < term.aliases.slice(1, 4).length - 1 ? ', ' : ''}
                            </button>
                          ))}
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