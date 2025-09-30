import Typesense from 'typesense';

const client = new Typesense.Client({
  nodes: [{ 
    host: import.meta.env.PUBLIC_TYPESENSE_HOST || 'localhost', 
    port: 443, 
    protocol: 'https' 
  }],
  apiKey: import.meta.env.PUBLIC_TYPESENSE_SEARCH_KEY || 'xyz',
  connectionTimeoutSeconds: 3
});

export async function searchGlossary(q: string, limit = 5) {
  if (!q?.trim()) return [];
  
  try {
    const res = await client.collections('glossary').documents().search({
      q, 
      query_by: 'term,aliases,definition', 
      per_page: limit,
      snippet_threshold: 30,
      highlight_full_fields: 'definition'
    });
    return (res.hits ?? []).map(hit => ({
      ...hit.document,
      snippet: hit.highlight?.definition?.snippet || hit.document.definition?.substring(0, 100) + '...'
    }));
  } catch (error) {
    console.error('Typesense search error:', error);
    return [];
  }
}

export function shouldPrioritizeGlossary(q: string, glossaryResults: any[]) {
  if (!glossaryResults?.length) return false;
  
  // Exact term match
  const exact = glossaryResults.some(item => 
    item.term?.toLowerCase() === q.toLowerCase()
  );
  
  // Short queries (likely looking for definitions)
  const isShort = q.length <= 5 && /^[a-zA-Z0-9]+$/.test(q);
  
  // Contains common crypto/DeFi terms
  const cryptoTerms = ['xor', 'val', 'pswap', 'kusd', 'defi', 'dex', 'swap', 'token', 'crypto'];
  const isCryptoTerm = cryptoTerms.some(term => 
    q.toLowerCase().includes(term)
  );
  
  return exact || isShort || isCryptoTerm;
}
