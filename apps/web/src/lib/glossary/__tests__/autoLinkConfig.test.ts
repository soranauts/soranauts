import { describe, expect, it } from 'vitest';

import { AUTO_LINK_DEFAULTS, resolveAutoLinkConfig } from '../../glossary/autoLinkConfig';

describe('resolveAutoLinkConfig', () => {
  it('returns defaults when frontmatter missing', () => {
    expect(resolveAutoLinkConfig()).toEqual(AUTO_LINK_DEFAULTS);
  });

  it('normalizes glossaryNoLink entries', () => {
    const result = resolveAutoLinkConfig({
      glossaryNoLink: ['XOR', '  XOR  ', 'pswap'],
    });

    expect(result.noLink).toEqual(['xor', 'pswap']);
  });

  it('converts numeric limits from strings', () => {
    const result = resolveAutoLinkConfig({
      glossaryMaxLinksPerPost: '5',
      glossaryMaxLinksPerTerm: '3',
    });

    expect(result.maxLinksPerPost).toBe(5);
    expect(result.maxLinksPerTerm).toBe(3);
  });

  it('falls back to defaults for invalid numbers', () => {
    const result = resolveAutoLinkConfig({
      glossaryMaxLinksPerPost: 0,
      glossaryMaxLinksPerTerm: -2,
    });

    expect(result.maxLinksPerPost).toBe(AUTO_LINK_DEFAULTS.maxLinksPerPost);
    expect(result.maxLinksPerTerm).toBe(AUTO_LINK_DEFAULTS.maxLinksPerTerm);
  });

  it('marks config disabled when flag present', () => {
    const result = resolveAutoLinkConfig({
      disableGlossaryAutoLink: true,
    });

    expect(result.disabled).toBe(true);
  });
});

