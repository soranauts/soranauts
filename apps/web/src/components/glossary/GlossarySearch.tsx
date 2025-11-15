import React, { useState, useEffect } from 'react';
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, Highlight, Stats, Configure } from 'react-instantsearch';
import { TypesenseInstantsearchAdapter } from 'typesense-instantsearch-adapter';

// Typesense configuration
const TYPESENSE_CONFIG = {
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'xyz', // This is the default API key for local Typesense
  connectionTimeoutSeconds: 2,
};

// Initialize Typesense adapter
const typesenseAdapter = new TypesenseInstantsearchAdapter({
  server: TYPESENSE_CONFIG,
  additionalSearchParameters: {
    query_by: 'term,definition,aliases,tags,relatedTerms',
    sort_by: '_text_match:desc,priority:desc',
    per_page: 12,
    highlight_full_fields: 'term,definition',
    snippet_threshold: 20,
    num_typos: 1,
  },
});

const searchClient = typesenseAdapter.searchClient;

// Custom Hit component for displaying search results
function Hit({ hit }: { hit: any }) {
  return (
    <div 
      id={`glossary-${hit.slug}`}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <Highlight attribute="term" hit={hit} />
        </h3>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {hit.category}
        </span>
      </div>
      
      <div className="text-gray-600 dark:text-gray-300 mb-3">
        <Highlight attribute="definition" hit={hit} />
      </div>
      
      {hit.aliases && hit.aliases.length > 1 && (
        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Also:</p>
          <div className="flex flex-wrap gap-1">
            {hit.aliases.slice(1).map((alias: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
              >
                {alias}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {hit.tags && hit.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {hit.tags.slice(0, 5).map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Custom Stats component
function CustomStats() {
  return (
    <Stats
      translations={{
        stats: (nbHits, processingTimeMS) => 
          `Found ${nbHits} term${nbHits !== 1 ? 's' : ''} in ${processingTimeMS}ms`
      }}
      classNames={{
        root: 'text-sm text-gray-600 dark:text-gray-400 mb-4'
      }}
    />
  );
}

// Main search component
export default function GlossarySearch() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Test Typesense connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try a simple search to test connection
        await searchClient.search([
          {
            indexName: 'glossary',
            params: {
              query: '',
              hitsPerPage: 1,
            },
          },
        ]);
        setIsConnected(true);
        setConnectionError(null);
      } catch (error) {
        console.error('Typesense connection error:', error);
        setIsConnected(false);
        setConnectionError('Unable to connect to Typesense. Please ensure the Docker container is running.');
      }
    };

    testConnection();
  }, []);

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Typesense Not Available
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>{connectionError}</p>
                <div className="mt-3">
                  <p className="font-medium">To enable search functionality:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Start Typesense: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">docker run -p 8108:8108 typesense/typesense:0.25.1 --data-dir /data --api-key=xyz --enable-cors</code></li>
                    <li>Index the glossary: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">pnpm index:glossary</code></li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <InstantSearch searchClient={searchClient} indexName="glossary">
        <Configure hitsPerPage={12} />
        
        {/* Search Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="mb-4">
            <SearchBox
              placeholder="Search glossary terms, definitions, or tags..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
              classNames={{
                root: 'w-full',
                form: 'relative',
                input: 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg',
                submit: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400',
                reset: 'absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600',
              }}
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <RefinementList
                attribute="category"
                limit={10}
                showMore={true}
                showMoreLimit={20}
                classNames={{
                  root: 'space-y-1',
                  list: 'flex flex-wrap gap-2',
                  item: 'block',
                  label: 'flex items-center',
                  checkbox: 'sr-only',
                  labelText: `px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`,
                  count: 'ml-1 text-xs text-gray-500',
                }}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <CustomStats />
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          <Hits
            hitComponent={Hit}
            classNames={{
              root: 'space-y-4',
              list: 'space-y-4',
              item: 'block',
            }}
          />
          
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <Pagination
              classNames={{
                root: 'flex justify-center',
                list: 'flex space-x-2',
                item: 'block',
                link: 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
                selectedItem: 'block',
                selectedLink: 'px-3 py-2 bg-gray-600 text-white rounded-lg',
                disabledItem: 'block',
                disabledLink: 'px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 dark:text-gray-500 cursor-not-allowed',
              }}
            />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}