import { describe, expect, test } from 'vitest';

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tagsData = JSON.parse(
  readFileSync(join(__dirname, '../../../src/data/taxonomy-tags.json'), 'utf-8'),
);
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

