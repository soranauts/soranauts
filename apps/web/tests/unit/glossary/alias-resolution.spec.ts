import { describe, expect, test } from 'vitest';

import glossaryData from '../../../public/glossary.json' assert { type: 'json' };
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

