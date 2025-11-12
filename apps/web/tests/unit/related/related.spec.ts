import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Post } from '~/types';
import { getRelatedArticles } from '~/utils/related';
import { relatedConfig } from '~/config/related.config';

// Mock fetchPosts
const mockPosts: Post[] = [];
const fetchPostsMock = vi.fn(async () => mockPosts);

vi.mock('~/utils/blog', () => ({
  fetchPosts: fetchPostsMock,
}));

// Mock glossary.json
vi.mock('node:fs', async () => {
  const actual = await vi.importActual('node:fs');
  return {
    ...actual,
    existsSync: vi.fn(() => true),
    readFileSync: vi.fn(() =>
      JSON.stringify({
        terms: [
          {
            term: 'XOR',
            slug: 'xor',
            aliases: ['XOR'],
            tags: ['token', 'xor'],
          },
          {
            term: 'Polkaswap',
            slug: 'polkaswap',
            aliases: ['Polkaswap', 'PSWAP'],
            tags: ['defi', 'dex'],
          },
        ],
      })
    ),
  };
});

describe('getRelatedArticles', () => {
  beforeEach(() => {
    mockPosts.length = 0;
    fetchPostsMock.mockClear();
  });

  const createMockPost = (
    slug: string,
    overrides: Partial<Post> = {}
  ): Post => ({
    id: slug,
    slug,
    permalink: `/blog/${slug}`,
    title: `Post ${slug}`,
    excerpt: `Excerpt for ${slug}`,
    publishDate: new Date('2024-01-01'),
    updateDate: new Date('2024-01-01'),
    tags: [],
    category: 'blog',
    draft: false,
    ...overrides,
  });

  it('excludes current post from results', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['sora'],
    });

    mockPosts.push(
      currentPost,
      createMockPost('other-post-1', { tags: ['sora'] }),
      createMockPost('other-post-2', { tags: ['sora'] })
    );

    const results = await getRelatedArticles(currentPost, 5);

    expect(results.every((r) => r.slug !== 'current-post')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('excludes draft posts', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['sora'],
    });

    mockPosts.push(
      createMockPost('draft-post', { tags: ['sora'], draft: true }),
      createMockPost('published-post', { tags: ['sora'], draft: false })
    );

    const results = await getRelatedArticles(currentPost, 5);

    expect(results.every((r) => r.slug !== 'draft-post')).toBe(true);
    expect(results.some((r) => r.slug === 'published-post')).toBe(true);
  });

  it('excludes canonicalized-out posts', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['sora'],
    });

    mockPosts.push(
      createMockPost('canonical-post', {
        tags: ['sora'],
        metadata: {
          canonical: 'https://other-site.com/post',
        },
      }),
      createMockPost('normal-post', { tags: ['sora'] })
    );

    const results = await getRelatedArticles(currentPost, 5);

    expect(results.every((r) => r.slug !== 'canonical-post')).toBe(true);
    expect(results.some((r) => r.slug === 'normal-post')).toBe(true);
  });

  it('sorts by score descending, then updateDate descending, then slug ascending', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['sora', 'xor'],
    });

    const baseDate = new Date('2024-01-01');
    mockPosts.push(
      createMockPost('low-score', {
        tags: [],
        publishDate: baseDate,
        updateDate: new Date('2024-06-01'),
      }),
      createMockPost('high-score', {
        tags: ['sora', 'xor'],
        publishDate: baseDate,
        updateDate: new Date('2024-06-01'),
      }),
      createMockPost('medium-score-a', {
        tags: ['sora'],
        publishDate: baseDate,
        updateDate: new Date('2024-05-01'),
      }),
      createMockPost('medium-score-b', {
        tags: ['sora'],
        publishDate: baseDate,
        updateDate: new Date('2024-05-01'),
      })
    );

    const results = await getRelatedArticles(currentPost, 10);

    // High score should come first
    expect(results[0].slug).toBe('high-score');

    // Medium scores should be sorted by slug (a before b)
    const mediumScores = results.filter((r) => r.slug.startsWith('medium-score'));
    if (mediumScores.length >= 2) {
      expect(mediumScores[0].slug).toBe('medium-score-a');
      expect(mediumScores[1].slug).toBe('medium-score-b');
    }
  });

  it('deduplicates series (at most one per series)', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['sora'],
    });

    mockPosts.push(
      createMockPost('sora-v3-part-1', { tags: ['sora'] }),
      createMockPost('sora-v3-part-2', { tags: ['sora'] }),
      createMockPost('sora-v3-part-3', { tags: ['sora'] }),
      createMockPost('other-post', { tags: ['sora'] })
    );

    const results = await getRelatedArticles(currentPost, 10);

    const seriesPosts = results.filter((r) => r.slug.startsWith('sora-v3-part-'));
    expect(seriesPosts.length).toBeLessThanOrEqual(1);
  });

  it('applies threshold filtering', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['sora'],
    });

    mockPosts.push(
      createMockPost('high-score', { tags: ['sora', 'xor'] }),
      createMockPost('low-score', { tags: [] })
    );

    const results = await getRelatedArticles(currentPost, 10);

    // Low score posts should be filtered out if below threshold
    const lowScorePost = results.find((r) => r.slug === 'low-score');
    if (lowScorePost) {
      expect(lowScorePost.score).toBeGreaterThanOrEqual(relatedConfig.minScoreThreshold);
    }
  });

  it('backfills with recency-based posts from same section if below minResultsCount', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['rare-tag'],
      category: 'blog',
    });

    // Add posts with no tag overlap (will score low)
    mockPosts.push(
      createMockPost('recent-post-1', {
        tags: [],
        category: 'blog',
        publishDate: new Date('2024-12-01'),
      }),
      createMockPost('recent-post-2', {
        tags: [],
        category: 'blog',
        publishDate: new Date('2024-11-01'),
      }),
      createMockPost('old-post', {
        tags: [],
        category: 'blog',
        publishDate: new Date('2020-01-01'),
      })
    );

    const results = await getRelatedArticles(currentPost, 5);

    // Should have backfilled results
    expect(results.length).toBeGreaterThanOrEqual(relatedConfig.minResultsCount);

    // Backfilled results should be labeled
    const backfilled = results.filter((r) => r.label === 'fallback:recency');
    if (backfilled.length > 0) {
      expect(backfilled.every((r) => r.score === 0)).toBe(true);
    }
  });

  it('respects maxResults limit', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['sora'],
    });

    // Add many matching posts
    for (let i = 0; i < 20; i++) {
      mockPosts.push(
        createMockPost(`post-${i}`, {
          tags: ['sora'],
          publishDate: new Date(`2024-${String(i + 1).padStart(2, '0')}-01`),
        })
      );
    }

    const results = await getRelatedArticles(currentPost, 5);

    expect(results.length).toBeLessThanOrEqual(5);
  });

  it('includes signal data in results', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['sora', 'xor'],
      title: 'SORA Ecosystem Guide',
    });

    mockPosts.push(
      createMockPost('matching-post', {
        tags: ['sora', 'xor'],
        title: 'SORA Token Guide',
        category: 'blog',
        publishDate: new Date('2024-06-01'),
      })
    );

    const results = await getRelatedArticles(currentPost, 5);

    expect(results.length).toBeGreaterThan(0);
    const first = results[0];

    expect(first.signals).toBeDefined();
    expect(first.signals.tagMatch).toBeGreaterThanOrEqual(0);
    expect(first.signals.glossaryOverlap).toBeGreaterThanOrEqual(0);
    expect(first.signals.titleKeyword).toBeGreaterThanOrEqual(0);
    expect(first.signals.sameSection).toBeGreaterThanOrEqual(0);
    expect(first.signals.recency).toBeGreaterThanOrEqual(0);
    expect(first.score).toBeGreaterThanOrEqual(0);
  });

  it('handles posts with no tags gracefully', async () => {
    const currentPost = createMockPost('current-post', {
      tags: [],
      title: 'Untagged Post',
    });

    mockPosts.push(
      createMockPost('other-untagged', {
        tags: [],
        title: 'Another Untagged Post',
        category: 'blog',
        publishDate: new Date('2024-06-01'),
      })
    );

    const results = await getRelatedArticles(currentPost, 5);

    // Should still return results (via title keywords, section, recency)
    expect(Array.isArray(results)).toBe(true);
  });

  it('handles empty candidate set', async () => {
    const currentPost = createMockPost('current-post', {
      tags: ['sora'],
    });

    // No other posts
    mockPosts.length = 0;

    const results = await getRelatedArticles(currentPost, 5);

    expect(results).toEqual([]);
  });
});

