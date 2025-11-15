import React, { useState, useEffect } from 'react';

interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category: string;
  tags: string[];
}

export default function GlossaryWorking() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sample data - this will work immediately
  const sampleTerms: GlossaryTerm[] = [
    {
      term: "XOR",
      slug: "xor",
      definition: "The network utility token used for transaction fees (gas) where 50% of fees are burned and 50% go to validators.",
      category: "token",
      tags: ["token", "utility", "gas"]
    },
    {
      term: "Polkaswap",
      slug: "polkaswap",
      definition: "A decentralized exchange (DEX) built on the SORA network that enables token swaps and liquidity provision.",
      category: "defi",
      tags: ["dex", "trading", "liquidity"]
    },
    {
      term: "SORA Parliament",
      slug: "sora-parliament",
      definition: "The governance body of the SORA network that makes decisions about network upgrades and parameters.",
      category: "governance",
      tags: ["governance", "voting", "democracy"]
    },
    {
      term: "Validator",
      slug: "validator",
      definition: "A network participant that validates transactions and maintains the blockchain's security and consensus.",
      category: "network",
      tags: ["consensus", "security", "staking"]
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setTerms(sampleTerms);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter terms based on search and category
  const filteredTerms = terms.filter(term => {
    const matchesSearch = !searchQuery || 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || term.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['token', 'defi', 'governance', 'network'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading glossary...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Glossary
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms or definitions..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredTerms.length} of {terms.length} terms
        </div>
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        {filteredTerms.map((term) => (
          <div
            key={term.slug}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {term.term}
              </h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {term.category}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {term.definition}
            </p>
            <div className="flex flex-wrap gap-1">
              {term.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No terms found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}


