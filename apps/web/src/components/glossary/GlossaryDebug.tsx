import React, { useState, useEffect } from 'react';

export default function GlossaryDebug() {
  const [status, setStatus] = useState('Initializing...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus('Fetching /glossary.json...');
        console.log('Starting fetch...');
        
        const response = await fetch('/glossary.json');
        console.log('Response received:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        console.log('Data parsed successfully:', jsonData);
        
        setData(jsonData);
        setStatus('Success! Data loaded.');
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('Error occurred');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Glossary Debug Component
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Status:</h3>
          <p className="text-gray-600 dark:text-gray-400">{status}</p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error:</h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
        
        {data && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Data Loaded Successfully:</h3>
            <div className="text-green-700 dark:text-green-300 space-y-2">
              <p>Total terms: {data.totalCount || 'Unknown'}</p>
              <p>Categories: {data.categories ? Object.keys(data.categories).length : 'Unknown'}</p>
              <p>Last updated: {data.lastUpdated || 'Unknown'}</p>
              {data.terms && data.terms.length > 0 && (
                <div>
                  <p>First term: {data.terms[0].term}</p>
                  <p>Sample definition: {data.terms[0].definition.substring(0, 100)}...</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Debug Info:</h3>
          <div className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
            <p>Fetch URL: /glossary.json</p>
            <p>Component mounted: ✅</p>
            <p>useEffect triggered: ✅</p>
          </div>
        </div>
      </div>
    </div>
  );
}


