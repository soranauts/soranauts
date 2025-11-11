import { fetchPosts } from '~/utils/blog';
import type { Post } from '~/types';
import { toTagSlug } from './taxonomy';
import { getTagHubViewModel } from './tag-hub';

export const TAG_POSTS_PER_PAGE = 24;

export const toCanonicalTagSlug = (value: string): string => {
  if (!value) return value;
  if (value.startsWith('tag-')) return value;
  return toTagSlug(value);
};

export async function getPostsForTagSlug(slug: string): Promise<Post[]> {
  const tagSlug = toCanonicalTagSlug(slug);
  const posts = await fetchPosts();
  return posts.filter((post) =>
    (post.tags ?? []).some((tag) => toTagSlug(tag) === tagSlug),
  );
}

export const getTagViewModelBySlug = (slug: string) => getTagHubViewModel(toCanonicalTagSlug(slug));

export const shouldIndexTagPage = (usageCount: number, hasSummary: boolean, hasGlossary: boolean): boolean =>
  usageCount >= 3 || (hasSummary && hasGlossary);



