import { describe, it, expect } from 'vitest';
import { slugify, generateGlossarySlug, wouldCollide, generateAllSlugs } from '../slugify';

describe('slugify', () => {
  it('should generate basic slugs', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('XOR Token')).toBe('xor-token');
    expect(slugify('DeFi Protocol')).toBe('defi-protocol');
  });

  it('should handle special characters', () => {
    expect(slugify('SORA 2.0')).toBe('sora-20');
    expect(slugify('PolkaSwap (DEX)')).toBe('polkaswap-dex');
    expect(slugify('Test & Development')).toBe('test-development');
  });

  it('should normalize unicode characters', () => {
    expect(slugify('Café')).toBe('cafe');
    expect(slugify('Naïve')).toBe('naive');
    expect(slugify('Resumé')).toBe('resume');
  });

  it('should handle multiple spaces and hyphens', () => {
    expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    expect(slugify('Multiple---Hyphens')).toBe('multiple-hyphens');
    expect(slugify('  Leading Spaces  ')).toBe('leading-spaces');
  });

  it('should handle edge cases', () => {
    expect(slugify('')).toBe('');
    expect(slugify('   ')).toBe('');
    expect(slugify('123')).toBe('123');
    expect(slugify('!!!')).toBe('');
  });
});

describe('generateGlossarySlug', () => {
  it('should generate consistent slugs for glossary terms', () => {
    expect(generateGlossarySlug('XOR')).toBe('xor');
    expect(generateGlossarySlug('PolkaSwap')).toBe('polkaswap');
    expect(generateGlossarySlug('SORA Parliament')).toBe('sora-parliament');
    expect(generateGlossarySlug('Hyperledger Iroha')).toBe('hyperledger-iroha');
  });

  it('should handle complex terms', () => {
    expect(generateGlossarySlug('Cross-chain Bridge')).toBe('cross-chain-bridge');
    expect(generateGlossarySlug('Liquidity Pool (LP)')).toBe('liquidity-pool-lp');
    expect(generateGlossarySlug('DeFi 2.0 Protocol')).toBe('defi-20-protocol');
  });
});

describe('wouldCollide', () => {
  it('should detect slug collisions', () => {
    expect(wouldCollide('XOR', 'xor')).toBe(true);
    expect(wouldCollide('PolkaSwap', 'polkaswap')).toBe(true);
    expect(wouldCollide('DeFi', 'defi')).toBe(true);
    expect(wouldCollide('XOR', 'VAL')).toBe(false);
    expect(wouldCollide('PolkaSwap', 'SORA')).toBe(false);
  });

  it('should handle case variations', () => {
    expect(wouldCollide('XOR', 'Xor')).toBe(true);
    expect(wouldCollide('PolkaSwap', 'polkaswap')).toBe(true);
  });

  it('should handle special characters consistently', () => {
    expect(wouldCollide('DeFi', 'DeFi 2.0')).toBe(false);
    expect(wouldCollide('PolkaSwap', 'PolkaSwap (DEX)')).toBe(false);
  });
});

describe('generateAllSlugs', () => {
  it('should generate slugs for term and aliases', () => {
    const slugs = generateAllSlugs('XOR', ['XOR Token', 'XOR Coin']);
    expect(slugs).toEqual(['xor', 'xor-token', 'xor-coin']);
  });

  it('should handle empty aliases', () => {
    const slugs = generateAllSlugs('XOR', []);
    expect(slugs).toEqual(['xor']);
  });

  it('should deduplicate identical slugs', () => {
    const slugs = generateAllSlugs('XOR', ['XOR', 'xor']);
    expect(slugs).toEqual(['xor']);
  });

  it('should handle complex aliases', () => {
    const slugs = generateAllSlugs('SORA', ['SORA Network', 'SORA 2.0', 'SORA Protocol']);
    expect(slugs).toEqual(['sora', 'sora-network', 'sora-20', 'sora-protocol']);
  });
});


