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

describe('Glossary ranking snapshots', () => {
  test('hyperled search ordering', () => {
    const response = engine.search('hyperled');
    const slugs = response.results.slice(0, 5).map((result) => result.term.slug);
    expect(slugs).toMatchInlineSnapshot(`
      [
        "hyperledger-iroha",
        "hyperledger-iroha-3",
        "hyperledger-iroha-2",
        "sora-v3",
        "polkaswap",
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
        "buyback-and-burn",
        "deflationary",
        "rewards",
      ]
    `);
  });
});

