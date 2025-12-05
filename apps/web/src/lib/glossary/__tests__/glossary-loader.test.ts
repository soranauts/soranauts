import { describe, expect, test, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.FEATURE_GLOSSARY_V2025 = 'true';
});

describe('glossary-loader (v2025 flag)', () => {
  test('getCanonicalSlug normalizes slugs', async () => {
    const { getCanonicalSlug } = await import('../glossary-loader');
    // Canonical terms return their own slug
    expect(getCanonicalSlug('tokenbondingcurve')).toBe('tokenbondingcurve');
    expect(getCanonicalSlug('parliament')).toBe('parliament');
    // Aliases resolve to canonical
    expect(getCanonicalSlug('data-availability')).toBe('dataavailability');
  });

  test('resolveAlias returns canonical entry for alias', async () => {
    const { resolveAlias } = await import('../glossary-loader');
    const entry = resolveAlias('data-availability');
    expect(entry?.slug).toBe('dataavailability');
  });

  test('getStatus reports alias vs canonical', async () => {
    const { getStatus } = await import('../glossary-loader');
    expect(getStatus('xor')).toBe('canonical');
    expect(getStatus('data-availability')).toBe('alias');
  });
});

