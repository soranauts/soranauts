import React, { useState, useEffect } from 'react';
import { loadGlossaryFull } from '../../lib/glossary-data';

export default function GlossaryTest() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching glossary data...');
        const terms = await loadGlossaryFull();
        console.log('JSON data received:', terms);
        setData({
          terms,
          totalCount: terms.length,
          categories: {},
        });
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-100 rounded">
        <p>Loading glossary data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-yellow-100 rounded">
        <p>No data received</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 rounded">
      <h2 className="text-xl font-bold mb-2">Glossary Data Loaded!</h2>
      <p>Total terms: {data.totalCount}</p>
      <p>Categories: {Object.keys(data.categories || {}).length}</p>
      <p>First term: {data.terms?.[0]?.term || 'None'}</p>
    </div>
  );
}


