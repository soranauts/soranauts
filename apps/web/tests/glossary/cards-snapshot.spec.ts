import { describe, expect, test } from 'vitest';

import glossaryData from '../../public/glossary.json' assert { type: 'json' };
import { createGlossarySearchEngine } from '../../src/lib/glossary/search';

const engine = createGlossarySearchEngine({
  terms: glossaryData.terms,
  aliasIndex: glossaryData.aliasIndex,
});

describe('Glossary ranking snapshots', () => {
  test('hyperled search ordering', () => {
    const response = engine.search('hyperled');
    const slugs = response.results.slice(0, 5).map((result) => result.term.slug);
    expect(slugs).toMatchInlineSnapshot(`
      [
        "hyperledger-iroha",
        "hyperledger-iroha-2",
        "hyperledger-iroha-3",
        "sora-v3",
        "hyperledger-iroha-2",
      ]
    `);
  });

  test('pswap query ordering', () => {
    const response = engine.search('pswap');
    const slugs = response.results.slice(0, 5).map((result) => result.term.slug);
    expect(slugs).toMatchInlineSnapshot(`
      [
        "pswap",
        "polkaswap",
        "dex",
        "liquidity",
        "decentralized-finance",
      ]
    `);
  });
});

