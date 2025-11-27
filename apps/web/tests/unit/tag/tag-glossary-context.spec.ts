import { describe, expect, it, vi } from 'vitest';

import { resolveTagGlossarySelection, type TagHubViewModel } from '~/lib/tag-hub';

vi.mock('~/lib/glossary/glossary-loader', () => {
  const makeEntry = (slug: string) => ({
    slug,
    term: slug.toUpperCase(),
    definition: `${slug} definition`,
    category: undefined,
    aliases: [],
    tags: [],
    relatedTerms: [],
    priority: 0,
    summary: `${slug} summary`,
    subtitle: null,
    tagline: null,
    seeAlso: [],
    relatedTags: [],
    examples: [],
    links: [],
    status: 'canonical' as const,
    targetSlug: null,
  });

  const entries = {
    sora: makeEntry('sora'),
    tonswap: makeEntry('tonswap'),
  };

  return {
    getGlossaryTerm: (slug: string) => entries[slug] ?? null,
    getCanonicalSlug: (slug: string) => slug,
  };
});

const buildTag = (overrides: Partial<TagHubViewModel>): TagHubViewModel => ({
  slug: 'tag-placeholder',
  title: 'Placeholder',
  summary: undefined,
  domain: 'ecosystem',
  traits: [],
  quickPathIds: [],
  usageCount: 0,
  firstSeen: undefined,
  lastSeen: undefined,
  glossaryRef: undefined,
  glossaryCanonicalPath: undefined,
  canonicalGlossarySlug: null,
  category: undefined,
  relatedTags: [],
  aliases: [],
  metadata: undefined,
  ...overrides,
});

describe('resolveTagGlossarySelection', () => {
  it('prefers canonical glossary entries that match the tag slug', () => {
    const tag = buildTag({ slug: 'tag-sora', title: 'SORA' });

    const result = resolveTagGlossarySelection(tag);

    expect(result.entry?.slug).toBe('sora');
    expect(result.canonicalSlug).toBe('sora');
  });

  it('falls back to the highest-frequency related term when no direct match exists', () => {
    const tag = buildTag({ slug: 'tag-unknown', title: 'Unknown' });

    const result = resolveTagGlossarySelection(tag, {
      fallbackSlugs: ['tonswap', 'sora'],
    });

    expect(result.entry?.slug).toBe('tonswap');
    expect(result.canonicalSlug).toBe('tonswap');
  });
});


