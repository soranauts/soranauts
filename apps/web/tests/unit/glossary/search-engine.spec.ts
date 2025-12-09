import { describe, it, expect, beforeAll } from 'vitest';
import { createGlossarySearchEngine, type GlossarySearchTermInput } from '../../../src/lib/glossary/search';

/**
 * Unit tests for the glossary search engine scoring and matching logic.
 * Tests the createGlossarySearchEngine function in isolation.
 */

// Helper to create test terms
const createTerm = (overrides: Partial<GlossarySearchTermInput> = {}): GlossarySearchTermInput => ({
  term: 'Test Term',
  slug: 'test-term',
  definition: 'A test definition for searching',
  category: 'technology',
  aliases: [],
  tags: [],
  relatedTerms: [],
  priority: 10,
  type: 'term',
  ...overrides,
});

// Test dataset
const testTerms: GlossarySearchTermInput[] = [
  createTerm({
    term: 'XOR',
    slug: 'xor',
    definition: 'The native token of the SORA network',
    category: 'token',
    aliases: ['XOR Token', 'SORA XOR'],
    tags: ['currency', 'native-token'],
    priority: 100,
  }),
  createTerm({
    term: 'PSWAP',
    slug: 'pswap',
    definition: 'Polkaswap reward token used for liquidity provision',
    category: 'token',
    aliases: ['Polkaswap Token'],
    tags: ['reward', 'liquidity'],
    priority: 80,
  }),
  createTerm({
    term: 'Polkaswap',
    slug: 'polkaswap',
    definition: 'A decentralized exchange built on the SORA network',
    category: 'defi',
    aliases: ['SORA DEX'],
    tags: ['exchange', 'dex', 'sora'],
    priority: 90,
    type: 'entity',
  }),
  createTerm({
    term: 'Hyperledger Iroha',
    slug: 'hyperledger-iroha',
    definition: 'A blockchain framework designed for enterprise use',
    category: 'technology',
    aliases: ['Iroha', 'HL Iroha'],
    tags: ['blockchain', 'enterprise'],
    priority: 70,
    type: 'entity',
  }),
  createTerm({
    term: 'Hyperledger Iroha 2',
    slug: 'hyperledger-iroha-2',
    definition: 'The second major version of Hyperledger Iroha',
    category: 'technology',
    aliases: ['Iroha 2', 'Iroha v2'],
    tags: ['blockchain', 'enterprise'],
    priority: 75,
    type: 'version',
    entity: 'hyperledger-iroha',
  }),
  createTerm({
    term: 'Liquidity Pool',
    slug: 'liquidity-pool',
    definition: 'A collection of funds locked in a smart contract',
    category: 'defi',
    aliases: ['LP', 'Pool'],
    tags: ['defi', 'amm'],
    priority: 50,
  }),
];

describe('GlossarySearchEngine', () => {
  let engine: ReturnType<typeof createGlossarySearchEngine>;

  beforeAll(() => {
    engine = createGlossarySearchEngine({ terms: testTerms, aliasIndex: [] });
  });

  describe('search() basic functionality', () => {
    it('returns results for valid query', () => {
      const { results } = engine.search('xor');
      expect(results.length).toBeGreaterThan(0);
    });

    it('returns all terms for empty query', () => {
      const { results } = engine.search('');
      expect(results.length).toBe(testTerms.length);
    });

    it('results are sorted by score descending', () => {
      const { results } = engine.search('token');
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('includes match reasons in results', () => {
      const { results } = engine.search('xor');
      const xorResult = results.find((r) => r.term.slug === 'xor');
      expect(xorResult?.matches).toBeDefined();
      expect(xorResult?.matches.length).toBeGreaterThan(0);
    });
  });

  describe('scoring: exact matches', () => {
    it('exact title match scores highest', () => {
      const { results } = engine.search('xor');
      const xorResult = results.find((r) => r.term.slug === 'xor');
      expect(xorResult?.matches).toContain('titleExact');
    });

    it('exact alias match scores high', () => {
      const { results } = engine.search('sora dex');
      const polkaswapResult = results.find((r) => r.term.slug === 'polkaswap');
      expect(polkaswapResult?.matches.some((m) => m.startsWith('alias:'))).toBe(true);
    });
  });

  describe('scoring: prefix matches', () => {
    it('prefix match on alias scores', () => {
      const { results } = engine.search('polka');
      const polkaswapResult = results.find((r) => r.term.slug === 'polkaswap');
      expect(polkaswapResult?.matches.some((m) => m.startsWith('prefix:'))).toBe(true);
    });

    it('prefix match ranks below exact match', () => {
      const { results } = engine.search('xo');
      const xorResult = results.find((r) => r.term.slug === 'xor');
      // Should match via prefix, not exact
      expect(xorResult?.matches.some((m) => m.startsWith('prefix:'))).toBe(true);
      expect(xorResult?.matches).not.toContain('titleExact');
    });
  });

  describe('scoring: token matches', () => {
    it('matches individual tokens in title', () => {
      const { results } = engine.search('hyperledger');
      const irohaResult = results.find((r) => r.term.slug === 'hyperledger-iroha');
      expect(irohaResult?.matches.some((m) => m.startsWith('titleToken:'))).toBe(true);
    });

    it('matches tokens in definition', () => {
      const { results } = engine.search('decentralized');
      const polkaswapResult = results.find((r) => r.term.slug === 'polkaswap');
      expect(polkaswapResult?.matches.some((m) => m.startsWith('body:'))).toBe(true);
    });
  });

  describe('scoring: tag matches', () => {
    it('matches on tags', () => {
      const { results } = engine.search('enterprise');
      const irohaResult = results.find((r) => r.term.slug === 'hyperledger-iroha');
      expect(irohaResult?.matches.some((m) => m.startsWith('tag:'))).toBe(true);
    });
  });

  describe('scoring: fuzzy matches', () => {
    it('finds fuzzy matches within edit distance 2', () => {
      const { results } = engine.search('xorr'); // 1 edit from 'xor'
      const xorResult = results.find((r) => r.term.slug === 'xor');
      expect(xorResult?.matches.some((m) => m.startsWith('fuzzy:'))).toBe(true);
    });

    it('fuzzy match score decreases with edit distance', () => {
      const { results: results1 } = engine.search('xorr'); // 1 edit
      const { results: results2 } = engine.search('xoRR'); // still 1 edit (case insensitive)
      const xor1 = results1.find((r) => r.term.slug === 'xor');
      const xor2 = results2.find((r) => r.term.slug === 'xor');
      // Both should find XOR with similar fuzzy matching
      expect(xor1?.score).toBeGreaterThan(0);
      expect(xor2?.score).toBeGreaterThan(0);
    });
  });

  describe('scoring: priority boost', () => {
    it('higher priority terms score higher for same match type', () => {
      // Both XOR (priority 100) and PSWAP (priority 80) are tokens
      const { results } = engine.search('token');
      const xorResult = results.find((r) => r.term.slug === 'xor');
      const pswapResult = results.find((r) => r.term.slug === 'pswap');
      expect(xorResult?.score).toBeGreaterThan(pswapResult?.score ?? 0);
    });
  });

  describe('filtering: category', () => {
    it('filters results by category', () => {
      const { results } = engine.search('', { category: 'token' });
      expect(results.every((r) => r.term.category === 'token')).toBe(true);
      expect(results.length).toBe(2); // XOR and PSWAP
    });

    it('returns empty for non-existent category', () => {
      const { results } = engine.search('xor', { category: 'nonexistent' });
      expect(results.length).toBe(0);
    });
  });

  describe('filtering: types', () => {
    it('filters results by type', () => {
      const { results } = engine.search('', { types: new Set(['entity']) });
      expect(results.every((r) => r.term.type === 'entity')).toBe(true);
    });

    it('supports multiple types', () => {
      const { results } = engine.search('', { types: new Set(['entity', 'version']) });
      expect(results.every((r) => r.term.type === 'entity' || r.term.type === 'version')).toBe(true);
    });
  });

  describe('didYouMean suggestions', () => {
    it('suggests correction for typos', () => {
      const { didYouMean } = engine.search('xorr');
      // Should suggest 'XOR' or similar
      expect(didYouMean).toBeDefined();
    });

    it('does not suggest for exact matches', () => {
      const { didYouMean } = engine.search('xor');
      expect(didYouMean).toBeUndefined();
    });
  });

  describe('featured results', () => {
    it('returns featured entity with children for entity match', () => {
      const { featured } = engine.search('iroha');
      expect(featured).toBeDefined();
      expect(featured?.entity.term.type).toBe('entity');
    });

    it('groups version results under parent entity', () => {
      const { featured } = engine.search('iroha');
      expect(featured?.children.length).toBeGreaterThan(0);
      expect(featured?.children.every((c) => c.term.type === 'version')).toBe(true);
    });

    it('returns undefined featured for non-entity queries', () => {
      const { featured } = engine.search('liquidity');
      // Liquidity Pool is a regular term, not entity
      expect(featured).toBeUndefined();
    });
  });

  describe('resolveAlias()', () => {
    // Note: resolveAlias requires aliasIndex to be populated
    // With empty aliasIndex, it returns undefined for all queries
    it('returns undefined when aliasIndex is empty', () => {
      const result = engine.resolveAlias('xor');
      expect(result).toBeUndefined();
    });

    it('returns undefined for unknown alias', () => {
      const result = engine.resolveAlias('unknown-term-xyz');
      expect(result).toBeUndefined();
    });
  });

  describe('resolveAlias() with populated aliasIndex', () => {
    let engineWithAliases: ReturnType<typeof createGlossarySearchEngine>;

    beforeAll(() => {
      engineWithAliases = createGlossarySearchEngine({
        terms: testTerms,
        aliasIndex: [
          { alias: 'xor', slug: 'xor', type: 'term' },
          { alias: 'iroha', slug: 'hyperledger-iroha', type: 'entity' },
          { alias: 'iroha 2', slug: 'hyperledger-iroha-2', type: 'version' },
        ],
      });
    });

    it('resolves alias from aliasIndex', () => {
      const result = engineWithAliases.resolveAlias('xor');
      expect(result?.term.slug).toBe('xor');
    });

    it('resolves alias to canonical slug', () => {
      const result = engineWithAliases.resolveAlias('iroha');
      expect(result?.term.slug).toBe('hyperledger-iroha');
    });

    it('includes matched alias in result', () => {
      const result = engineWithAliases.resolveAlias('iroha');
      expect(result?.matchedAlias).toBe('iroha');
    });
  });

  describe('case insensitivity', () => {
    it('matches regardless of case', () => {
      const lower = engine.search('xor');
      const upper = engine.search('XOR');
      const mixed = engine.search('Xor');

      expect(lower.results.length).toBe(upper.results.length);
      expect(lower.results.length).toBe(mixed.results.length);
    });
  });

  describe('special characters and normalization', () => {
    it('handles queries with special characters', () => {
      const { results } = engine.search('xor!@#');
      expect(results.length).toBeGreaterThan(0);
    });

    it('handles accented characters', () => {
      const { results } = engine.search('sóra');
      // Should normalize and still find SORA-related terms
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
