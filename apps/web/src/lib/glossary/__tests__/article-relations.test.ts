import { describe, expect, it } from 'vitest';

import {
  getCoLocatedTerms,
  getRelatedArticleSlugs,
  getTopTermsForDomain,
} from '../article-relations';
import { getAllTagHubViewModels } from '~/lib/tag-hub';

const tagViewModels = getAllTagHubViewModels();

describe('article relations map helpers', () => {
  it('returns related article slugs for xor', () => {
    const related = getRelatedArticleSlugs('xor');
    expect(related.length).toBeGreaterThan(0);
  });

  it('finds co-located terms for xor', () => {
    const terms = getCoLocatedTerms('xor');
    expect(terms).toContain('polkaswap');
  });

  it('lists top terms for the DeFi domain', () => {
    const topTerms = getTopTermsForDomain('defi', tagViewModels);
    expect(topTerms.length).toBeGreaterThan(0);
  });
});

