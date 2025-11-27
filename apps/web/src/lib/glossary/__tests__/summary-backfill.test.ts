import { describe, expect, it } from 'vitest';

import { needsSummary, synthesizeSummaryFromDefinition } from '../summary';

describe('glossary summary helpers', () => {
  it('detects placeholder values', () => {
    expect(needsSummary(null)).toBe(true);
    expect(needsSummary('')).toBe(true);
    expect(needsSummary('TODO')).toBe(true);
    expect(needsSummary('Filled summary')).toBe(false);
  });

  it('derives first sentence up to punctuation', () => {
    const definition =
      '<p>Substrate is a modular framework for building blockchains.</p> It powers Polkadot.';
    const summary = synthesizeSummaryFromDefinition(definition);
    expect(summary).toBe('Substrate is a modular framework for building blockchains.');
  });

  it('trims to max length with ellipsis when needed', () => {
    const definition =
      'A '.repeat(90) + 'final sentence without punctuation but with plenty of detail for testing';
    const summary = synthesizeSummaryFromDefinition(definition, 80);
    expect(summary).toMatch(/…$/);
    expect(summary!.length).toBeLessThanOrEqual(81);
  });

  it('returns null when no definition text is available', () => {
    expect(synthesizeSummaryFromDefinition('   ')).toBeNull();
  });
});

