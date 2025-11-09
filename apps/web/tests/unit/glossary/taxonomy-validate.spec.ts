import { describe, expect, test } from 'vitest';

import tagsData from '../../../src/data/taxonomy-tags.json' assert { type: 'json' };
import { taxonomy } from '../../../src/data/taxonomy';

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

describe('Taxonomy integrity', () => {
  test('all collected tags exist in taxonomy', () => {
    const tags: string[] = Array.isArray(tagsData.tags) ? tagsData.tags : [];
    for (const tag of tags) {
      const slug = `tag-${normalize(tag)}`;
      expect(taxonomy[slug]).toBeDefined();
    }
  });

  test('Hyperledger Iroha tag maps to glossary entry', () => {
    const node = taxonomy['tag-hyperledger-iroha'];
    expect(node?.glossaryRef).toBe('/glossary/hyperledger-iroha');
  });
});

