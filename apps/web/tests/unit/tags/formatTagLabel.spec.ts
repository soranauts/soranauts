import { describe, expect, it } from 'vitest';

import { formatTagLabel } from '../../../src/lib/tag-hub';

describe('formatTagLabel', () => {
  it('returns canonical casing for known tickers and acronyms', () => {
    const cases: Array<[string, string]> = [
      ['sora', 'SORA'],
      ['tag-sora', 'SORA'],
      ['xor', 'XOR'],
      ['tag-xor', 'XOR'],
      ['pswap', 'PSWAP'],
      ['tag-pswap', 'PSWAP'],
      ['val', 'VAL'],
      ['tag-val', 'VAL'],
      ['kusd', 'KUSD'],
      ['xcm', 'XCM'],
      ['tag-xcm', 'XCM'],
      ['dex', 'DEX'],
      ['tag-dex', 'DEX'],
      ['iroha', 'Iroha'],
      ['iroha3', 'Iroha 3'],
      ['tag-iroha3', 'Iroha 3'],
      ['defi', 'DeFi'],
      ['tag-defi', 'DeFi'],
      ['sora-card', 'SORA Card'],
      ['polkaswap', 'Polkaswap'],
      ['soramitsu', 'SORAMITSU'],
    ];

    for (const [input, expected] of cases) {
      expect(formatTagLabel(input, 'fallback')).toBe(expected);
    }
  });

  it('returns the fallback unchanged for unknown slugs', () => {
    expect(formatTagLabel('foundation', 'Foundation')).toBe('Foundation');
    expect(formatTagLabel('custom-token', 'Custom Token')).toBe('Custom Token');
  });

  it('handles nullish slugs safely by returning the fallback', () => {
    const helper = formatTagLabel as (slug: any, fallback: string) => string;
    expect(helper(undefined, 'Fallback')).toBe('Fallback');
    expect(helper(null, 'Another Fallback')).toBe('Another Fallback');
  });
});


