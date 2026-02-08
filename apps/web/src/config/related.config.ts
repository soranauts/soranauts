/**
 * Configuration for hybrid related articles recommender
 * 
 * Scoring formula:
 * score = w.tagMatch * tagCount + w.foundationalBonus * isFoundational + 
 *         w.glossaryOverlap * glossaryMatches + w.titleKeyword * keywordMatches +
 *         w.sameSection * isSameSection + recencyScore * w.recencyMax
 */

export interface RelatedConfig {
  /** Weight for each shared tag match (exact slug equality, case-insensitive) */
  tagMatch: number;
  /** Bonus applied once per candidate if any tag is foundational (priority > 50 OR glossaryRef present) */
  foundationalBonus: number;
  /** Weight for glossary term overlap (count intersections of glossary slugs+aliases) */
  glossaryOverlap: number;
  /** Weight for title keyword overlap (tokenized, stop-word filtered, max 12 tokens) */
  titleKeyword: number;
  /** Weight for same category/section match */
  sameSection: number;
  /** Maximum weight for recency signal (0..recencyMax curve: 0 at >365d, 0.5 at 180d, 1.0 at ≤90d) */
  recencyMax: number;
  /** Minimum score threshold to include a result */
  minScoreThreshold: number;
  /** Minimum number of results required to show the section */
  minResultsCount: number;
}

export const relatedConfig: RelatedConfig = {
  tagMatch: 1.5,
  foundationalBonus: 0.4,
  glossaryOverlap: 1.6,
  titleKeyword: 1.2,
  sameSection: 0.6,
  recencyMax: 0.8,
  minScoreThreshold: 0.5,
  minResultsCount: 2,
};

/**
 * Common English stop words for title keyword extraction
 * Single source of truth - exported as array for easy reference
 * Used to filter out common words that don't add semantic value
 */
export const stopWordsArray = [
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have',
  'had', 'what', 'said', 'each', 'which', 'their', 'time', 'if',
  'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her',
  'would', 'make', 'like', 'into', 'him', 'two', 'more',
  'very', 'after', 'words', 'long', 'than', 'first', 'been', 'call',
  'who', 'oil', 'sit', 'now', 'find', 'down', 'day', 'did', 'get',
  'come', 'made', 'may', 'part',
] as const;

/**
 * Stop words as Set for O(1) lookup performance
 */
export const stopWords = new Set(stopWordsArray);

/**
 * Default minimum number of results to display (UI expectation: 3-5)
 * Note: minResultsCount governs visibility threshold
 */
export const minResults = 3;

