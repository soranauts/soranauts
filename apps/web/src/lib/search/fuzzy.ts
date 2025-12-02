/**
 * Fuzzy Search Utilities
 * 
 * Provides Levenshtein distance and fuzzy matching for 404/empty state suggestions.
 */

/**
 * Calculate Levenshtein distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  
  if (aLower === bLower) return 0;
  if (aLower.length === 0) return bLower.length;
  if (bLower.length === 0) return aLower.length;

  const matrix: number[][] = [];

  // Initialize first column
  for (let i = 0; i <= bLower.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row
  for (let j = 0; j <= aLower.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= bLower.length; i++) {
    for (let j = 1; j <= aLower.length; j++) {
      if (bLower.charAt(i - 1) === aLower.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bLower.length][aLower.length];
}

/**
 * Calculate similarity score (0-1) between two strings.
 */
export function similarityScore(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(a, b);
  return 1 - distance / maxLen;
}

/**
 * Find closest matches from a list of candidates.
 */
export function findClosestMatches(
  query: string,
  candidates: string[],
  limit = 3,
  minSimilarity = 0.3
): Array<{ value: string; score: number }> {
  const queryLower = query.toLowerCase();
  
  const scored = candidates
    .map((candidate) => ({
      value: candidate,
      score: similarityScore(queryLower, candidate.toLowerCase()),
    }))
    .filter((item) => item.score >= minSimilarity)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

/**
 * Find closest term matches from glossary data.
 */
export function findClosestTerms(
  query: string,
  terms: Array<{ slug: string; title: string }>,
  limit = 3
): Array<{ slug: string; title: string; score: number }> {
  const queryLower = query.toLowerCase();
  
  const scored = terms
    .map((term) => {
      // Score based on both slug and title
      const slugScore = similarityScore(queryLower, term.slug);
      const titleScore = similarityScore(queryLower, term.title.toLowerCase());
      const score = Math.max(slugScore, titleScore);
      
      return { ...term, score };
    })
    .filter((item) => item.score >= 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

/**
 * Check if a query is a likely typo of a candidate.
 */
export function isLikelyTypo(query: string, candidate: string): boolean {
  const distance = levenshteinDistance(query, candidate);
  const maxLen = Math.max(query.length, candidate.length);
  
  // Consider it a typo if distance is <= 2 for short strings
  // or <= 20% of max length for longer strings
  if (maxLen <= 5) {
    return distance <= 2;
  }
  
  return distance <= Math.ceil(maxLen * 0.2);
}

/**
 * Get search suggestions for an empty search.
 */
export function getSearchSuggestions(
  recentTerms: string[] = [],
  popularTerms: string[] = []
): string[] {
  const suggestions: string[] = [];
  
  // Add recent terms first
  for (const term of recentTerms.slice(0, 2)) {
    if (!suggestions.includes(term)) {
      suggestions.push(term);
    }
  }
  
  // Fill with popular terms
  for (const term of popularTerms) {
    if (suggestions.length >= 5) break;
    if (!suggestions.includes(term)) {
      suggestions.push(term);
    }
  }
  
  return suggestions;
}


