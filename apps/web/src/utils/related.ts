import type { Post } from '~/types';
import { fetchPosts } from './blog';
import { relatedConfig, stopWords, minResults } from '~/config/related.config';
import { getTagNode } from '~/lib/taxonomy';
import fs from 'node:fs';
import path from 'node:path';

interface GlossaryTerm {
  term: string;
  slug: string;
  aliases: string[];
  tags: string[];
}

interface GlossaryData {
  terms: GlossaryTerm[];
}

interface RelatedSignals {
  tagMatch: number;
  foundationalBonus: number;
  glossaryOverlap: number;
  titleKeyword: number;
  sameSection: number;
  recency: number;
}

export interface RelatedArticle {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
  publishDate: Date;
  updateDate?: Date;
  score: number;
  signals: RelatedSignals;
  label?: string; // e.g., "fallback:recency"
}

// Cache glossary data
let glossaryCache: Set<string> | null = null;

/**
 * Load and normalize glossary terms (slugs + aliases) into a lowercase set
 */
function getGlossaryTerms(): Set<string> {
  if (glossaryCache) return glossaryCache;

  try {
    // Glossary source: public/glossary.json (generated at build time)
    const glossaryPath = path.join(process.cwd(), 'public', 'glossary.json');
    if (!fs.existsSync(glossaryPath)) {
      // Fail gracefully: skip glossary overlap signal if file missing
      console.warn('[related] glossary.json not found at public/glossary.json, skipping glossary overlap signal');
      glossaryCache = new Set();
      return glossaryCache;
    }

    const raw = fs.readFileSync(glossaryPath, 'utf-8');
    const data = JSON.parse(raw) as GlossaryData;
    const terms = new Set<string>();

    // Pre-lowercase all glossary slugs and aliases for case-insensitive matching
    for (const term of data.terms) {
      // Add slug (lowercase)
      terms.add(term.slug.toLowerCase());
      // Add aliases (lowercase)
      for (const alias of term.aliases || []) {
        terms.add(alias.toLowerCase());
      }
    }

    glossaryCache = terms;
    return terms;
  } catch (error) {
    // Fail gracefully: skip glossary signal on any error
    console.warn('[related] Failed to load glossary:', error);
    glossaryCache = new Set();
    return glossaryCache;
  }
}

/**
 * Tokenize and normalize text, filtering stop words
 * Returns max 12 tokens
 */
function tokenizeTitle(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 0 && !stopWords.has(token as any))
    .slice(0, 12);

  return new Set(tokens);
}

/**
 * Extract glossary terms from post tags
 */
function extractGlossaryTermsFromPost(post: Post): Set<string> {
  const glossaryTerms = getGlossaryTerms();
  const postGlossaryTerms = new Set<string>();

  for (const tag of post.tags || []) {
    const normalizedTag = tag.toLowerCase();
    if (glossaryTerms.has(normalizedTag)) {
      postGlossaryTerms.add(normalizedTag);
    }
  }

  return postGlossaryTerms;
}

/**
 * Check if a tag is foundational (priority > 50 OR glossaryRef present)
 */
function isFoundationalTag(tag: string): boolean {
  const tagNode = getTagNode(tag);
  if (!tagNode || tagNode.type !== 'tag') return false;
  return (tagNode.priority ?? 0) > 50 || Boolean(tagNode.glossaryRef);
}

/**
 * Calculate recency score (0..1 curve based on days since updateDate)
 * 0 at >365d, 0.5 at 180d, 1.0 at ≤90d
 */
function calculateRecencyScore(updateDate: Date | undefined, publishDate: Date): number {
  const referenceDate = updateDate || publishDate;
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 90) return 1.0;
  if (daysDiff <= 180) return 0.5 + (0.5 * (180 - daysDiff) / 90); // Linear interpolation
  if (daysDiff <= 365) return 0.5 * (365 - daysDiff) / 185; // Linear interpolation
  return 0;
}

/**
 * Detect series key from slug (e.g., "sora-v3-part-1" -> "sora-v3")
 */
function getSeriesKey(slug: string): string | null {
  // Match patterns like "-part-1", "-part-2", etc.
  const partMatch = slug.match(/^(.+?)-part-\d+$/);
  if (partMatch) return partMatch[1];

  // Could extend with other patterns or frontmatter field
  return null;
}

/**
 * Compute all signals for a candidate post
 */
function computeSignals(
  currentPost: Post,
  candidatePost: Post,
  currentGlossaryTerms: Set<string>
): RelatedSignals {
  const signals: RelatedSignals = {
    tagMatch: 0,
    foundationalBonus: 0,
    glossaryOverlap: 0,
    titleKeyword: 0,
    sameSection: 0,
    recency: 0,
  };

  // Tag matching: exact slug equality, case-insensitive
  const currentTags = new Set((currentPost.tags || []).map((t) => t.toLowerCase()));
  const candidateTags = new Set((candidatePost.tags || []).map((t) => t.toLowerCase()));
  let tagMatches = 0;
  let hasFoundational = false;

  for (const tag of candidateTags) {
    if (currentTags.has(tag)) {
      tagMatches++;
      if (isFoundationalTag(tag)) {
        hasFoundational = true;
      }
    }
  }

  signals.tagMatch = tagMatches;
  signals.foundationalBonus = hasFoundational ? 1 : 0;

  // Glossary overlap: count intersections
  const candidateGlossaryTerms = extractGlossaryTermsFromPost(candidatePost);
  const glossaryIntersection = new Set(
    [...currentGlossaryTerms].filter((t) => candidateGlossaryTerms.has(t))
  );
  signals.glossaryOverlap = glossaryIntersection.size;

  // Title keyword: tokenize and count intersection
  const currentTitleTokens = tokenizeTitle(currentPost.title);
  const candidateTitleTokens = tokenizeTitle(candidatePost.title);
  const keywordIntersection = new Set(
    [...currentTitleTokens].filter((t) => candidateTitleTokens.has(t))
  );
  signals.titleKeyword = keywordIntersection.size;

  // Same section: exact match on category (treat missing as "blog")
  const currentCategory = (currentPost.category || 'blog').toLowerCase();
  const candidateCategory = (candidatePost.category || 'blog').toLowerCase();
  signals.sameSection = currentCategory === candidateCategory ? 1 : 0;

  // Recency: 0..1 curve
  signals.recency = calculateRecencyScore(candidatePost.updateDate, candidatePost.publishDate);

  return signals;
}

/**
 * Calculate final score from signals using weights
 */
function calculateScore(signals: RelatedSignals): number {
  const w = relatedConfig;
  return (
    w.tagMatch * signals.tagMatch +
    w.foundationalBonus * signals.foundationalBonus +
    w.glossaryOverlap * signals.glossaryOverlap +
    w.titleKeyword * signals.titleKeyword +
    w.sameSection * signals.sameSection +
    w.recencyMax * signals.recency
  );
}

/**
 * Get related articles for a given post
 * 
 * Deterministic ordering: score DESC → updateDate DESC → slug ASC
 */
export async function getRelatedArticles(
  currentPost: Post,
  maxResults: number = minResults
): Promise<RelatedArticle[]> {
  const allPosts = await fetchPosts();
  const currentGlossaryTerms = extractGlossaryTermsFromPost(currentPost);

  // Filter candidates: exclude current post, drafts, canonicalized-out posts
  const candidates = allPosts.filter((post) => {
    if (post.slug === currentPost.slug) return false;
    if (post.draft) return false;
    if (post.metadata?.canonical && post.metadata.canonical !== post.permalink) return false;
    return true;
  });

  // Compute signals and scores for all candidates
  // Short-circuit: collect top 10 candidates early, then slice to final results
  const scored: Array<{
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    category: string;
    publishDate: Date;
    updateDate?: Date;
    score: number;
    signals: RelatedSignals;
  }> = [];

  for (const post of candidates) {
    const signals = computeSignals(currentPost, post, currentGlossaryTerms);
    const score = calculateScore(signals);
    
    scored.push({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || '',
      tags: post.tags || [],
      category: post.category || '',
      publishDate: post.publishDate,
      updateDate: post.updateDate,
      score,
      signals,
    });

    // Short-circuit: if we have enough high-scoring candidates, we can stop early
    // But we still process all to ensure we don't miss better matches
    // This is a trade-off: full scan ensures accuracy, early exit would improve speed
  }

  // Sort: score DESC → updateDate DESC → slug ASC (deterministic ordering)
  scored.sort((a, b) => {
    // Primary: score descending
    const scoreDiff = b.score - a.score;
    if (Math.abs(scoreDiff) > 0.001) {
      return scoreDiff > 0 ? 1 : -1;
    }
    
    // Secondary: updateDate descending (fallback to publishDate)
    const aDate = a.updateDate || a.publishDate;
    const bDate = b.updateDate || b.publishDate;
    const dateDiff = bDate.getTime() - aDate.getTime();
    if (dateDiff !== 0) {
      return dateDiff > 0 ? 1 : -1;
    }
    
    // Tertiary: slug ascending (deterministic tie-breaker)
    return a.slug.localeCompare(b.slug);
  });

  // Apply series deduplication: keep at most one per series
  const seriesSeen = new Map<string, RelatedArticle>();
  const deduped: RelatedArticle[] = [];

  for (const item of scored) {
    const seriesKey = getSeriesKey(item.slug);
    if (seriesKey) {
      if (seriesSeen.has(seriesKey)) {
        continue; // Skip duplicate series
      }
      seriesSeen.set(seriesKey, item);
    }
    deduped.push(item);
  }

  // Filter by threshold and take top results
  const thresholdMet = deduped.filter((item) => item.score >= relatedConfig.minScoreThreshold);
  const topResults = thresholdMet.slice(0, maxResults);

  // If we don't have enough results, backfill with recency-based from same section
  if (topResults.length < relatedConfig.minResultsCount) {
    const currentCategory = (currentPost.category || 'blog').toLowerCase();
    const backfillCandidates = deduped
      .filter((item) => {
        const itemCategory = (item.category || 'blog').toLowerCase();
        return itemCategory === currentCategory && !topResults.some((r) => r.slug === item.slug);
      })
      .sort((a, b) => {
        const aDate = a.updateDate || a.publishDate;
        const bDate = b.updateDate || b.publishDate;
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, relatedConfig.minResultsCount - topResults.length)
      .map((item) => ({
        ...item,
        score: 0,
        label: 'fallback:recency',
        signals: {
          ...item.signals,
          recency: calculateRecencyScore(item.updateDate, item.publishDate),
        },
      }));

    topResults.push(...backfillCandidates);
  }

  return topResults.slice(0, maxResults);
}

/**
 * Debug helper: print top candidates with signals (development only)
 * Exposed only in DEV mode via import.meta.env.DEV
 */
export function debugRelatedArticles(
  currentPost: Post,
  results: RelatedArticle[],
  topN: number = 10
): void {
  // Only expose in development (check import.meta.env.DEV and process.env.NODE_ENV)
  let isDev = false;
  try {
    // Check Astro's import.meta.env.DEV (available at build time)
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV === true) {
      isDev = true;
    }
  } catch {
    // import.meta not available, check process.env
  }
  
  // Fallback to process.env.NODE_ENV check
  if (!isDev && process.env.NODE_ENV === 'development') {
    isDev = true;
  }
  
  if (!isDev) return;

  console.log(`\n[related] Top ${Math.min(topN, results.length)} candidates for: ${currentPost.title}`);
  console.log(`[related] Current post tags: ${(currentPost.tags || []).join(', ')}`);
  console.log(`[related] Current post category: ${currentPost.category || 'blog'}`);
  console.log('─'.repeat(100));

  for (const item of results.slice(0, topN)) {
    const signalsStr = Object.entries(item.signals)
      .map(([key, val]) => `${key}:${val.toFixed(2)}`)
      .join(' ');
    const labelStr = item.label ? ` [${item.label}]` : '';
    console.log(
      `[related] ${item.score.toFixed(3)} | ${item.slug.padEnd(45)} | ${signalsStr}${labelStr}`
    );
  }
  console.log('─'.repeat(100));
}

