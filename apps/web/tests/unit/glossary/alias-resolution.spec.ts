import { describe, expect, it, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import glossaryAliases from '../../../public/glossary.aliases.v2025.json';
import { normalizeGlossaryFull } from '../../../src/lib/glossary-normalize';
import { clientAliasIndex } from '../../../src/lib/taxonomy';
import { createGlossarySearchEngine } from '../../../src/lib/glossary/search';
import { getAllTerms, getGlossaryTerm, getCanonicalSlug } from '../../../src/lib/glossary/glossary-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const glossaryRaw = JSON.parse(
  readFileSync(join(__dirname, '../../../public/glossary.json'), 'utf-8'),
);
const glossaryTerms = normalizeGlossaryFull(glossaryRaw);

const engine = createGlossarySearchEngine(
  {
    terms: glossaryTerms,
    aliasIndex: clientAliasIndex,
  },
  { resolveCanonicalSlug: getCanonicalSlug },
);

describe('cross: glossary alias dataset', () => {
  it('maps aliases to canonical slugs', () => {
    const entries = glossaryAliases.aliases ?? [];
    expect(entries.length).toBeGreaterThan(0);
    entries.forEach(({ alias, target }) => {
      const canonicalSlug = getCanonicalSlug(alias);
      expect(canonicalSlug, `Canonical slug missing for alias ${alias}`).toBe(target);
      const canonical = getGlossaryTerm(target);
      expect(canonical, `Canonical slug ${target} missing for alias ${alias}`).toBeDefined();
      const resolved = getGlossaryTerm(alias);
      expect(resolved?.slug).toBe(canonical?.slug);
    });
  });
});

describe('glossary data integrity', () => {
  const terms = getAllTerms();

  it('does not expose alias entries', () => {
    expect(terms.every((term) => term.status !== 'alias')).toBe(true);
  });

  it('requires canonical terms to include definition and category', () => {
    terms
      .filter((term) => term.status === 'canonical')
      .forEach((term) => {
        expect(term.definition?.trim(), `Definition missing for ${term.slug}`).toBeTruthy();
        expect(term.category?.trim(), `Category missing for ${term.slug}`).toBeTruthy();
      });
  });

  it('resolves alias slugs to canonical entries', () => {
    const aliasSlug = 'data-availability';
    const canonical = getGlossaryTerm(aliasSlug);
    expect(canonical?.slug).toBe('dataavailability');
  });
});

describe('cross: glossary alias resolution', () => {
  test.each([
    ['xor', 'xor'],
    ['val', 'val'],
    ['pswap', 'pswap'],
    ['polkaswap', 'polkaswap'],
  ])('resolves %s → %s', (query, expectedSlug) => {
    const result = engine.resolveAlias(query);
    expect(result?.term.slug).toBe(expectedSlug);
  });
});

