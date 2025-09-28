import { describe, it, expect } from 'vitest';
import { scoreTerm } from '../utils';

const norm = (s: string) => s.toLowerCase();

const T = (over: Partial<any> = {}) => ({
  term: "XOR",
  slug: "xor",
  definition: "The native token of SORA.",
  category: "token",
  aliases: ["XOR Token"],
  tags: ["currency", "sora"],
  relatedTerms: ["VAL"],
  priority: 10,
  ...over
});

describe("scoreTerm", () => {
  it("boosts exact match > prefix > substring", () => {
    const t = T();
    const sExact = scoreTerm(t, "xor");
    const sPrefix = scoreTerm(t, "xo");
    const sSub = scoreTerm(t, "or");
    expect(sExact).toBeGreaterThan(sPrefix);
    expect(sPrefix).toBeGreaterThan(sSub);
  });

  it("boosts aliases and tags", () => {
    const base = T({ aliases: ["SORA XOR"], tags: ["dex"] });
    expect(scoreTerm(base, "sora")).toBeGreaterThan(0);
    expect(scoreTerm(base, "dex")).toBeGreaterThan(0);
  });

  it("applies priority boost", () => {
    const low = T({ priority: 0 });
    const high = T({ priority: 100 });
    expect(scoreTerm(high, "xor")).toBeGreaterThan(scoreTerm(low, "xor"));
  });

  it("handles category matching", () => {
    const t = T({ category: "token" });
    expect(scoreTerm(t, "token")).toBeGreaterThan(scoreTerm(t, "defi"));
  });

  it("returns 0 for empty query", () => {
    const t = T();
    expect(scoreTerm(t, "")).toBe(0);
  });

  it("handles case insensitive matching", () => {
    const t = T();
    expect(scoreTerm(t, "XOR")).toBe(scoreTerm(t, "xor"));
    expect(scoreTerm(t, "Xor")).toBe(scoreTerm(t, "xor"));
  });

  it("scores related terms", () => {
    const t = T({ relatedTerms: ["PSWAP", "VAL"] });
    expect(scoreTerm(t, "pswap")).toBeGreaterThan(0);
    expect(scoreTerm(t, "val")).toBeGreaterThan(0);
  });

  it("scores definition content", () => {
    const t = T({ definition: "A decentralized exchange token" });
    expect(scoreTerm(t, "decentralized")).toBeGreaterThan(0);
    expect(scoreTerm(t, "exchange")).toBeGreaterThan(0);
  });

  it("handles multiple aliases correctly", () => {
    const t = T({ aliases: ["XOR", "SORA Token", "SORA Coin"] });
    expect(scoreTerm(t, "sora")).toBeGreaterThan(0);
    expect(scoreTerm(t, "coin")).toBeGreaterThan(0);
  });

  it("handles empty arrays gracefully", () => {
    const t = T({ aliases: [], tags: [], relatedTerms: [] });
    expect(scoreTerm(t, "xor")).toBeGreaterThan(0); // Should still match term
  });
});
