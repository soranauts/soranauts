import { describe, expect, it } from 'vitest';

import {
  getAllTagHubViewModels,
  getTagHubDomains,
  getTagHubQuickPathById,
  getTagHubViewModel,
  hasTagHubMetadata,
  resolveTagHubAlias,
} from '../../../src/lib/tag-hub';
import { TAG_HUB_DOMAINS } from '../../../src/data/tag-hub.config';

describe('SORA Explorer data layer', () => {
  it('returns enriched view models for canonical tags', () => {
    const sora = getTagHubViewModel('tag-sora');
    expect(sora).toBeDefined();
    expect(sora?.slug).toBe('tag-sora');
    expect(sora?.traits).toContain('glossary-linked');
    expect(sora?.usageCount).toBeGreaterThan(0);
    expect(hasTagHubMetadata('tag-sora')).toBe(true);
  });

  it('resolves tag aliases back to canonical view models', () => {
    const withAlias = getAllTagHubViewModels().find((tag) => tag.aliases.some((alias) => alias !== tag.slug));
    expect(withAlias).toBeDefined();
    const aliasValue = withAlias?.aliases.find((alias) => alias !== withAlias.title && alias !== withAlias.slug);
    expect(aliasValue).toBeDefined();

    const resolved = resolveTagHubAlias(aliasValue as string);
    expect(resolved).toBeDefined();
    expect(resolved?.slug).toBe(withAlias?.slug);
  });

  it('exposes stable domain ordering', () => {
    expect(getTagHubDomains()).toEqual(TAG_HUB_DOMAINS);
  });

  it('provides fully populated quick paths', () => {
    const quickPath = getTagHubQuickPathById('new-to-sora');
    expect(quickPath).toBeDefined();
    expect(quickPath?.tags).not.toHaveLength(0);
    expect(quickPath?.tags.map((tag) => tag.slug)).toEqual(quickPath?.slugs);
  });

  it('sorts view models by metadata weight then title', () => {
    const viewModels = getAllTagHubViewModels();
    expect(viewModels.length).toBeGreaterThan(0);
    const sorted = [...viewModels].sort((a, b) => {
      const weightDelta = (b.metadata?.weight ?? 0) - (a.metadata?.weight ?? 0);
      if (weightDelta !== 0) return weightDelta;
      return a.title.localeCompare(b.title, 'en');
    });
    expect(viewModels).toEqual(sorted);
  });
});


