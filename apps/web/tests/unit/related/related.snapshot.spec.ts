import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Post } from '~/types';
import { getRelatedArticles } from '~/utils/related';

// Mock fetchPosts - must be defined inside vi.mock factory due to hoisting
const mockPosts: Post[] = [];

vi.mock('~/utils/blog', () => ({
  fetchPosts: vi.fn(async () => mockPosts),
}));

// Mock glossary.json
vi.mock('node:fs', async () => {
  const actual = await vi.importActual('node:fs');
  return {
    ...actual,
    existsSync: vi.fn(() => true),
    readFileSync: vi.fn(() =>
      JSON.stringify([
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
        {
          term: 'SORA',
          slug: 'sora',
          aliases: ['SORA'],
          tags: ['blockchain', 'network'],
        },
      ]),
    ),
  };
});

describe('getRelatedArticles snapshot', () => {
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

  beforeEach(async () => {
    mockPosts.length = 0;
    const blogModule = await import('~/utils/blog');
    vi.mocked(blogModule.fetchPosts).mockClear();
  });

  it('produces deterministic results for tagged posts', async () => {
    const currentPost = createMockPost('current-post', {
      title: 'SORA Ecosystem Guide',
      tags: ['sora', 'xor', 'polkaswap'],
      category: 'blockchain',
      publishDate: new Date('2024-06-01'),
    });

    // Mix of tagged and untagged posts
    mockPosts.push(
      createMockPost('tagged-1', {
        title: 'XOR Token Guide',
        tags: ['xor', 'sora'],
        category: 'blockchain',
        publishDate: new Date('2024-05-01'),
      }),
      createMockPost('tagged-2', {
        title: 'Polkaswap DEX Overview',
        tags: ['polkaswap', 'defi'],
        category: 'blockchain',
        publishDate: new Date('2024-04-01'),
      }),
      createMockPost('tagged-3', {
        title: 'SORA Network Architecture',
        tags: ['sora'],
        category: 'blockchain',
        publishDate: new Date('2024-03-01'),
      }),
      createMockPost('untagged-1', {
        title: 'Blockchain Technology Explained',
        tags: [],
        category: 'blockchain',
        publishDate: new Date('2024-02-01'),
      }),
      createMockPost('untagged-2', {
        title: 'DeFi Protocols Guide',
        tags: [],
        category: 'defi',
        publishDate: new Date('2024-01-01'),
      })
    );

    const { articles: results } = await getRelatedArticles(currentPost, 5);

    // Snapshot the results structure (slugs, scores, signals)
    const snapshot = results.map((r) => ({
      slug: r.slug,
      score: Math.round(r.score * 1000) / 1000, // Round to 3 decimals
      signals: {
        tagMatch: r.signals.tagMatch,
        foundationalBonus: r.signals.foundationalBonus,
        glossaryOverlap: r.signals.glossaryOverlap,
        titleKeyword: r.signals.titleKeyword,
        sameSection: r.signals.sameSection,
        recency: Math.round(r.signals.recency * 100) / 100,
      },
      label: r.label,
    }));

    expect(snapshot).toMatchSnapshot();
  });

  it('produces deterministic results for untagged posts', async () => {
    const currentPost = createMockPost('current-post', {
      title: 'Understanding Blockchain Technology',
      tags: [],
      category: 'blockchain',
      publishDate: new Date('2024-06-01'),
    });

    mockPosts.push(
      createMockPost('post-1', {
        title: 'Blockchain Basics',
        tags: ['blockchain'],
        category: 'blockchain',
        publishDate: new Date('2024-05-01'),
      }),
      createMockPost('post-2', {
        title: 'Technology Overview',
        tags: [],
        category: 'blockchain',
        publishDate: new Date('2024-04-01'),
      }),
      createMockPost('post-3', {
        title: 'Crypto Guide',
        tags: [],
        category: 'crypto',
        publishDate: new Date('2024-03-01'),
      })
    );

    const { articles: results } = await getRelatedArticles(currentPost, 5);

    const snapshot = results.map((r) => ({
      slug: r.slug,
      score: Math.round(r.score * 1000) / 1000,
      signals: {
        tagMatch: r.signals.tagMatch,
        glossaryOverlap: r.signals.glossaryOverlap,
        titleKeyword: r.signals.titleKeyword,
        sameSection: r.signals.sameSection,
      },
      label: r.label,
    }));

    expect(snapshot).toMatchSnapshot();
  });
});

