import { describe, expect, test } from 'vitest';

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { normalizeGlossaryFull } from '../../../src/lib/glossary-normalize';
import { clientAliasIndex } from '../../../src/lib/taxonomy';
import { createGlossarySearchEngine } from '../../../src/lib/glossary/search';
import { getCanonicalSlug } from '../../../src/lib/glossary/glossary-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const glossaryRaw = JSON.parse(readFileSync(join(__dirname, '../../../public/glossary.json'), 'utf-8'));
const glossaryTerms = normalizeGlossaryFull(glossaryRaw);

const engine = createGlossarySearchEngine(
  {
    terms: glossaryTerms,
    aliasIndex: clientAliasIndex,
  },
  { resolveCanonicalSlug: getCanonicalSlug },
);

describe('Glossary ranking snapshots', () => {
  test('hyperled search ordering', () => {
    const response = engine.search('hyperled');
    const slugs = response.results.slice(0, 5).map((result) => result.term.slug);
    expect(slugs).toMatchInlineSnapshot(`
      [
        "hyperledger",
        "hyperledgeriroha",
        "hyperledgeriroha3",
        "sorav3",
        "iroha",
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
        "buybackandburn",
        "deflationary",
        "rewards",
      ]
    `);
  });
});

