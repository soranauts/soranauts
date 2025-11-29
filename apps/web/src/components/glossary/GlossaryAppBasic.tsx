import React, { useState, useEffect } from 'react';
import { loadGlossaryFull, type Term as GlossaryTermPayload } from '../../lib/glossary-data';

// Simple types
interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category: string;
  aliases: string[];
}

interface GlossaryData {
  terms: GlossaryTerm[];
  totalCount: number;
}

interface GlossaryAppProps {
  initialTerm?: string;
}

export default function GlossaryAppBasic({ initialTerm }: GlossaryAppProps) {
  const [glossaryData, setGlossaryData] = useState<GlossaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch glossary data
  useEffect(() => {
    const fetchData = async () => {
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
            aliases: Array.isArray(typed.aliases) ? typed.aliases : [],
          };
        });
        setGlossaryData({
          terms,
          totalCount: terms.length,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load glossary data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <h3 className="text-sm font-medium text-red-800">Error loading glossary</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!glossaryData) {
    return <div>No glossary data available</div>;
  }

  // Filter terms based on search
  const filteredTerms = glossaryData.terms.filter((term) => {
    const haystack = searchQuery.toLowerCase();
    return (
      (term.term ?? '').toLowerCase().includes(haystack) ||
      (term.definition ?? '').toLowerCase().includes(haystack)
    );
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search glossary terms..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {filteredTerms.length} of {glossaryData.totalCount} terms
        </p>

        {filteredTerms.map((term) => (
          <div
            key={term.slug}
            id={`glossary-${term.slug}`}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {term.term}
            </h3>
            <p className="text-gray-600 mb-2">
              {term.definition}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {term.category}
              </span>
              {(term.aliases?.length ?? 0) > 1 && (
                <span className="text-gray-500">
                  Also: {(term.aliases ?? []).slice(1, 4).join(', ')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


