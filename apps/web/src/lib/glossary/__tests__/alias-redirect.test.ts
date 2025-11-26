import { describe, expect, it } from 'vitest';
import { shouldApplyAliasRedirect } from '../../glossary/alias-redirect';

const baseFlags = {
  featureGlossaryV2025: true,
  featureGlossaryAliasRedirect: true,
};

describe('shouldApplyAliasRedirect', () => {
  it('returns true only when both flags are enabled and slugs differ', () => {
    expect(
      shouldApplyAliasRedirect({
        ...baseFlags,
        requestedSlug: 'token-bonding-curve',
        resolvedSlug: 'bonding-curve',
      }),
    ).toBe(true);
  });

  it('returns false when requested slug matches resolved slug', () => {
    expect(
      shouldApplyAliasRedirect({
        ...baseFlags,
        requestedSlug: 'bonding-curve',
        resolvedSlug: 'bonding-curve',
      }),
    ).toBe(false);
  });

  it('returns false when either flag is disabled', () => {
    expect(
      shouldApplyAliasRedirect({
        featureGlossaryV2025: false,
        featureGlossaryAliasRedirect: true,
        requestedSlug: 'token-bonding-curve',
        resolvedSlug: 'bonding-curve',
      }),
    ).toBe(false);

    expect(
      shouldApplyAliasRedirect({
        featureGlossaryV2025: true,
        featureGlossaryAliasRedirect: false,
        requestedSlug: 'token-bonding-curve',
        resolvedSlug: 'bonding-curve',
      }),
    ).toBe(false);
  });

  it('handles undefined or empty slugs safely', () => {
    expect(
      shouldApplyAliasRedirect({
        ...baseFlags,
        requestedSlug: '',
        resolvedSlug: 'bonding-curve',
      }),
    ).toBe(false);

    expect(
      shouldApplyAliasRedirect({
        ...baseFlags,
        requestedSlug: 'token-bonding-curve',
        resolvedSlug: '',
      }),
    ).toBe(false);
  });
});



