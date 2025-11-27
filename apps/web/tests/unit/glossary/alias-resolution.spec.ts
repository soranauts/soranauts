import { describe, expect, it } from 'vitest';

import glossaryV2025 from '../../../public/data/glossary.v2025.json';

describe('glossary alias dataset', () => {
  it('maps all aliases to canonical slugs', () => {
    const aliasTerms = glossaryV2025.terms.filter((term) => term.status === 'alias');
    expect(aliasTerms.length).toBe(glossaryV2025.aliasCount);

    aliasTerms.forEach((alias) => {
      expect(alias.targetSlug, `Alias ${alias.slug} is missing targetSlug`).toBeTruthy();
      const canonical = glossaryV2025.terms.find((term) => term.slug === alias.targetSlug);
      expect(canonical, `Canonical slug ${alias.targetSlug} missing for alias ${alias.slug}`).toBeDefined();
      expect(canonical?.status).toBe('canonical');
    });
  });
});
import { describe, expect, test } from 'vitest';

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const glossaryData = JSON.parse(
  readFileSync(join(__dirname, '../../../public/glossary.json'), 'utf-8'),
);
import { createGlossarySearchEngine } from '../../../src/lib/glossary/search';

const engine = createGlossarySearchEngine({
  terms: glossaryData.terms,
  aliasIndex: glossaryData.aliasIndex,
});

describe('Glossary alias resolution', () => {
  test.each([
    ['hyperled', 'hyperledger-iroha'],
    ['Iroha V2', 'hyperledger-iroha-2'],
    ['iroha3', 'hyperledger-iroha-3'],
    ['  iroha v3  ', 'hyperledger-iroha-3'],
    ['nexus', 'hyperledger-iroha-3'],
    ['sora dex', 'polkaswap'],
    ['telegram dex', 'tonswap'],
  ])('resolves %s → %s', (query, expectedSlug) => {
    const result = engine.resolveAlias(query);
    expect(result?.term.slug).toBe(expectedSlug);
  });
});

