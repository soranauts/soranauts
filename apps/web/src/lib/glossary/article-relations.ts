import articleGlossaryMap from '../../../public/data/article-glossary-map.json';

import type { TagHubViewModel } from '../tag-hub';

export interface ArticleGlossaryMapData {
  generatedAt?: string;
  posts: Record<string, string[]>;
  terms: Record<string, string[]>;
}

const relations = articleGlossaryMap as ArticleGlossaryMapData;

const asArray = (value?: string[]): string[] => (Array.isArray(value) ? value.filter(Boolean) : []);

const limitList = (items: string[], limit: number): string[] => items.slice(0, Math.max(limit, 0));

const sortEntries = (counts: Map<string, number>): string[] =>
  Array.from(counts.entries())
    .sort((a, b) => {
      if (a[1] !== b[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0], 'en');
    })
    .map(([slug]) => slug);

export const getRelatedArticleSlugs = (termSlug: string, limit = 5): string[] => {
  if (!termSlug) return [];
  const normalized = termSlug.trim().toLowerCase();
  if (!normalized) return [];
  const matches = asArray(relations.terms?.[normalized]);
  return limitList(matches, limit);
};

export const getCoLocatedTerms = (termSlug: string, limit = 6): string[] => {
  if (!termSlug) return [];
  const normalized = termSlug.trim().toLowerCase();
  if (!normalized) return [];

  const postSlugs = asArray(relations.terms?.[normalized]);
  const counts = new Map<string, number>();

  postSlugs.forEach((postSlug) => {
    const termList = asArray(relations.posts?.[postSlug]);
    termList.forEach((other) => {
      const canonical = other.trim().toLowerCase();
      if (!canonical || canonical === normalized) return;
      counts.set(canonical, (counts.get(canonical) ?? 0) + 1);
    });
  });

  const sorted = sortEntries(counts);
  return limitList(sorted, limit);
};

export const getTopTermsForDomain = (
  domainId: string,
  tags: TagHubViewModel[],
  limit = 6,
): string[] => {
  if (!domainId) return [];
  const relevant = tags.filter(
    (tag) => tag.domain === domainId && typeof tag.canonicalGlossarySlug === 'string',
  );

  const counts = new Map<string, number>();

  relevant.forEach((tag) => {
    const slug = (tag.canonicalGlossarySlug ?? '').trim().toLowerCase();
    if (!slug) return;
    const frequency = asArray(relations.terms?.[slug]).length;
    if (frequency === 0) return;
    counts.set(slug, frequency);
  });

  const sorted = sortEntries(counts);
  return limitList(sorted, limit);
};

export type RelatedArticleSummary = {
  slug: string;
  title: string;
  href: string;
  date?: string | null;
};


