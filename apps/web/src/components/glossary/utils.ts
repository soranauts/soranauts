/**
 * Utility functions for glossary search scoring
 */

const norm = (s: string) => s.toLowerCase();

/**
 * Scores a glossary term based on search query relevance
 * Higher scores indicate better matches (exact > prefix > substring)
 */
export function scoreTerm(t: any, q: string): number {
  if (!q) return 0;
  const Q = norm(q);
  const fields = [
    ['term', 5],
    ['slug', 4],
    ['aliases', 4],
    ['tags', 3],
    ['relatedTerms', 2],
    ['definition', 1],
  ] as const;
  let score = 0;
  for (const [field, weight] of fields) {
    const values = Array.isArray((t as any)[field]) ? (t as any)[field] : [(t as any)[field]];
    for (const v of values.filter(Boolean)) {
      const V = norm(String(v));
      if (V === Q) score += 10 * weight; // exact
      else if (V.startsWith(Q)) score += 6 * weight; // prefix
      else if (V.includes(Q)) score += 3 * weight; // substring
    }
  }
  if (norm(t.category) === Q) score += 5;
  score += (t.priority ?? 0) * 0.05;
  return score;
}

export { norm };
