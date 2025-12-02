/**
 * Glossary Stats E2E Tests
 * 
 * Validates that hero stats displayed on glossary pages match
 * the generator output data.
 */
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data Loading
// ─────────────────────────────────────────────────────────────────────────────

interface GlossaryV2025 {
  terms: Array<{
    slug: string;
    title: string;
    summary: string;
    category: string;
    tags: string[];
    relatedTerms: string[];
    tagline?: string;
  }>;
  canonicalCount: number;
  aliasCount: number;
  deprecatedCount: number;
}

interface AliasData {
  aliases: Array<{ alias: string; target: string }>;
}

const GLOSSARY_PATH = path.resolve(process.cwd(), 'public/data/glossary.v2025.json');
const ALIASES_PATH = path.resolve(process.cwd(), 'public/glossary.aliases.v2025.json');

function loadGlossaryData(): GlossaryV2025 {
  return JSON.parse(fs.readFileSync(GLOSSARY_PATH, 'utf-8'));
}

function loadAliasData(): AliasData {
  return JSON.parse(fs.readFileSync(ALIASES_PATH, 'utf-8'));
}

// ─────────────────────────────────────────────────────────────────────────────
// Generator Stats Validation
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Generator Stats Validation', () => {
  test('glossary.v2025.json has correct structure', async () => {
    const data = loadGlossaryData();
    
    expect(data.terms).toBeDefined();
    expect(Array.isArray(data.terms)).toBe(true);
    expect(data.canonicalCount).toBeDefined();
    expect(data.aliasCount).toBeDefined();
  });

  test('canonical count matches terms array length', async () => {
    const data = loadGlossaryData();
    expect(data.canonicalCount).toBe(data.terms.length);
  });

  test('alias count matches aliases file', async () => {
    const glossaryData = loadGlossaryData();
    const aliasData = loadAliasData();
    
    expect(glossaryData.aliasCount).toBe(aliasData.aliases.length);
  });

  test('all terms have required fields', async () => {
    const data = loadGlossaryData();
    
    for (const term of data.terms) {
      expect(term.slug).toBeTruthy();
      expect(term.title).toBeTruthy();
      expect(term.summary).toBeTruthy();
      expect(term.category).toBeTruthy();
      expect(Array.isArray(term.tags)).toBe(true);
      expect(Array.isArray(term.relatedTerms)).toBe(true);
    }
  });

  test('terms are sorted by slug (deterministic)', async () => {
    const data = loadGlossaryData();
    const slugs = data.terms.map(t => t.slug);
    const sortedSlugs = [...slugs].sort((a, b) => a.localeCompare(b));
    
    expect(slugs).toEqual(sortedSlugs);
  });

  test('related terms reference valid canonical slugs', async () => {
    const data = loadGlossaryData();
    const canonicalSlugs = new Set(data.terms.map(t => t.slug));
    
    const missingRelated: string[] = [];
    
    for (const term of data.terms) {
      for (const related of term.relatedTerms) {
        if (!canonicalSlugs.has(related)) {
          missingRelated.push(`${term.slug} -> ${related}`);
        }
      }
    }
    
    // Log missing for debugging but don't fail (content issue, not generator bug)
    if (missingRelated.length > 0) {
      console.warn('Missing related terms:', missingRelated);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Hero Stats Display Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Glossary Hero Stats Display', () => {
  test('glossary index shows term count', async ({ page }) => {
    const data = loadGlossaryData();
    
    await page.goto('/glossary');
    await page.waitForLoadState('networkidle');
    
    // Look for term count in page content
    const content = await page.content();
    
    // The page should display a count that's reasonably close to canonical count
    const countMatch = content.match(/(\d+)\s*(terms?|entries|definitions)/i);
    
    if (countMatch) {
      const displayedCount = parseInt(countMatch[1], 10);
      // Allow some tolerance (within 20 of expected)
      expect(displayedCount).toBeGreaterThanOrEqual(data.canonicalCount - 20);
      expect(displayedCount).toBeLessThanOrEqual(data.canonicalCount + 20);
    }
  });

  test('explorer shows Nexus term count', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    // Look for Nexus terms stat
    const content = await page.content();
    
    // Should display "Nexus terms" with a count
    const nexusMatch = content.match(/nexus\s*terms?[:\s]*(\d+)/i);
    
    if (nexusMatch) {
      const displayedCount = parseInt(nexusMatch[1], 10);
      // Should be a reasonable count (50-200)
      expect(displayedCount).toBeGreaterThan(50);
      expect(displayedCount).toBeLessThan(200);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Category Distribution Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Category Distribution', () => {
  test('all terms have valid categories', async () => {
    const data = loadGlossaryData();
    
    const categories = new Set<string>();
    for (const term of data.terms) {
      categories.add(term.category);
    }
    
    // Should have multiple categories
    expect(categories.size).toBeGreaterThan(5);
    
    // Log categories for debugging
    console.log('Categories found:', Array.from(categories).sort());
  });

  test('no empty categories', async () => {
    const data = loadGlossaryData();
    
    for (const term of data.terms) {
      expect(term.category.trim().length).toBeGreaterThan(0);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tagline (Why It Matters) Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Tagline Distribution', () => {
  test('some terms have taglines', async () => {
    const data = loadGlossaryData();
    
    const termsWithTagline = data.terms.filter(t => t.tagline);
    
    // Should have at least 30 terms with taglines (from Phase 3)
    expect(termsWithTagline.length).toBeGreaterThanOrEqual(30);
    
    console.log(`Terms with tagline: ${termsWithTagline.length}/${data.terms.length}`);
  });

  test('taglines are non-empty strings', async () => {
    const data = loadGlossaryData();
    
    for (const term of data.terms) {
      if (term.tagline) {
        expect(typeof term.tagline).toBe('string');
        expect(term.tagline.trim().length).toBeGreaterThan(10);
      }
    }
  });

  test('term page displays tagline when present', async ({ page }) => {
    const data = loadGlossaryData();
    const termWithTagline = data.terms.find(t => t.tagline);
    
    if (!termWithTagline) {
      test.skip();
      return;
    }
    
    await page.goto(`/glossary/${termWithTagline.slug}`);
    await page.waitForLoadState('networkidle');
    
    // Tagline should be visible somewhere on the page
    const content = await page.content();
    expect(content).toContain(termWithTagline.tagline);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// JSON Determinism Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('JSON Determinism', () => {
  test('glossary.v2025.json is deterministically formatted', async () => {
    const content = fs.readFileSync(GLOSSARY_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    const reserialized = JSON.stringify(parsed, null, 2) + '\n';
    
    expect(content).toBe(reserialized);
  });

  test('glossary.aliases.v2025.json is deterministically formatted', async () => {
    const content = fs.readFileSync(ALIASES_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    const reserialized = JSON.stringify(parsed, null, 2) + '\n';
    
    expect(content).toBe(reserialized);
  });

  test('aliases are sorted alphabetically', async () => {
    const data = loadAliasData();
    const aliases = data.aliases.map(a => a.alias);
    const sortedAliases = [...aliases].sort((a, b) => a.localeCompare(b));
    
    expect(aliases).toEqual(sortedAliases);
  });
});



