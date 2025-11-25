import { describe, expect, test, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.FEATURE_GLOSSARY_V2025 = 'true';
});

describe('glossary-loader (v2025 flag)', () => {
  test('getCanonicalSlug normalizes alias slugs', async () => {
    const { getCanonicalSlug } = await import('../glossary-loader');
    expect(getCanonicalSlug('token-bonding-curve')).toBe('bonding-curve');
    expect(getCanonicalSlug('SORA-PARLIAMENT')).toBe('parliament');
  });

  test('resolveAlias returns canonical entry', async () => {
    const { resolveAlias } = await import('../glossary-loader');
    const entry = resolveAlias('sora-parliament');
    expect(entry?.slug).toBe('parliament');
  });

  test('getStatus reports alias vs canonical', async () => {
    const { getStatus } = await import('../glossary-loader');
    expect(getStatus('adoption')).toBe('canonical');
    expect(getStatus('hyperledger-iroha')).toBe('alias');
  });
});

