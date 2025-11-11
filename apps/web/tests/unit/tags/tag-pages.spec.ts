import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPosts, fetchPostsMock } = vi.hoisted(() => {
  const posts: any[] = [];
  const fetchMock = vi.fn(async () => posts);
  return { mockPosts: posts, fetchPostsMock: fetchMock };
});

vi.mock('~/utils/blog', () => ({
  fetchPosts: fetchPostsMock,
}));

import {
  TAG_POSTS_PER_PAGE,
  getPostsForTagSlug,
  getTagViewModelBySlug,
  shouldIndexTagPage,
  toCanonicalTagSlug,
} from '../../../src/lib/tag-pages';

describe('Tag page helpers', () => {
  beforeEach(() => {
    mockPosts.length = 0;
    fetchPostsMock.mockClear();
  });

  it('normalises tag slugs consistently', () => {
    expect(toCanonicalTagSlug('tag-sora')).toBe('tag-sora');
    expect(toCanonicalTagSlug('Sora Card')).toBe('tag-sora-card');
  });

  it('returns hydrated view models for canonical and alias slugs', () => {
    const direct = getTagViewModelBySlug('tag-polkaswap');
    const alias = getTagViewModelBySlug('Polkaswap');
    expect(direct?.slug).toBe('tag-polkaswap');
    expect(alias?.slug).toBe('tag-polkaswap');
  });

  it('determines indexing eligibility with guard heuristics', () => {
    expect(shouldIndexTagPage(3, false, false)).toBe(true);
    expect(shouldIndexTagPage(1, true, true)).toBe(true);
    expect(shouldIndexTagPage(1, false, false)).toBe(false);
  });

  it('filters posts by canonical tag slug', async () => {
    mockPosts.push(
      { id: 'one', tags: ['Sora', 'DeFi'] },
      { id: 'two', tags: ['DeFi'] },
      { id: 'three', tags: ['sora'] },
    );

    const posts = await getPostsForTagSlug('sora');
    expect(fetchPostsMock).toHaveBeenCalled();
    expect(posts).toHaveLength(2);
    expect(posts.map((post) => post.id)).toEqual(['one', 'three']);
  });

  it('exports paging constant for reuse', () => {
    expect(TAG_POSTS_PER_PAGE).toBeGreaterThan(0);
  });
});


