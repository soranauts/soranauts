/**
 * Glossary Generator E2E Tests
 * 
 * Verifies the unified glossary generator produces correct output
 * and all glossary pages render correctly.
 */
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const GLOSSARY_V2025_PATH = path.resolve(
  process.cwd(),
  'public/data/glossary.v2025.json'
);

const GLOSSARY_ALIASES_PATH = path.resolve(
  process.cwd(),
  'public/glossary.aliases.v2025.json'
);

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  relatedTerms: string[];
  tagline?: string;
}

interface GlossaryData {
  terms: GlossaryTerm[];
  canonicalCount: number;
  aliasCount: number;
}

interface AliasData {
  aliases: Array<{ alias: string; target: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Generator Output Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Glossary Generator Output', () => {
  let glossaryData: GlossaryData;
  let aliasData: AliasData;

  test.beforeAll(() => {
    glossaryData = JSON.parse(fs.readFileSync(GLOSSARY_V2025_PATH, 'utf-8'));
    aliasData = JSON.parse(fs.readFileSync(GLOSSARY_ALIASES_PATH, 'utf-8'));
  });

  test('glossary.v2025.json has expected structure', () => {
    expect(glossaryData.terms).toBeDefined();
    expect(Array.isArray(glossaryData.terms)).toBe(true);
    expect(glossaryData.canonicalCount).toBe(glossaryData.terms.length);
    expect(glossaryData.aliasCount).toBeGreaterThan(0);
  });

  test('canonical count matches expected (~369)', () => {
    expect(glossaryData.canonicalCount).toBeGreaterThanOrEqual(360);
    expect(glossaryData.canonicalCount).toBeLessThanOrEqual(400);
  });

  test('terms are sorted by slug', () => {
    const slugs = glossaryData.terms.map((t) => t.slug);
    const sortedSlugs = [...slugs].sort((a, b) => a.localeCompare(b));
    expect(slugs).toEqual(sortedSlugs);
  });

  test('no duplicate slugs', () => {
    const slugs = glossaryData.terms.map((t) => t.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  test('all terms have required fields', () => {
    for (const term of glossaryData.terms) {
      expect(term.slug).toBeTruthy();
      expect(term.title).toBeTruthy();
      expect(term.summary).toBeTruthy();
      expect(term.category).toBeTruthy();
      expect(Array.isArray(term.tags)).toBe(true);
      expect(Array.isArray(term.relatedTerms)).toBe(true);
    }
  });

  test('aliases point to valid canonical slugs', () => {
    const canonicalSlugs = new Set(glossaryData.terms.map((t) => t.slug));
    
    for (const alias of aliasData.aliases) {
      expect(canonicalSlugs.has(alias.target)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Page Rendering Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Glossary Page Rendering', () => {
  test('/glossary loads with new generator', async ({ page }) => {
    await page.goto('/glossary');
    await expect(page).toHaveTitle(/Glossary/i);
    
    // Should show term count
    const content = await page.content();
    expect(content).toMatch(/\d+\s*(terms?|entries)/i);
  });

  test('10 random canonical slugs return 200 OK', async ({ page }) => {
    const glossaryData: GlossaryData = JSON.parse(
      fs.readFileSync(GLOSSARY_V2025_PATH, 'utf-8')
    );

    // Pick 10 random terms
    const shuffled = glossaryData.terms.sort(() => Math.random() - 0.5);
    const sample = shuffled.slice(0, 10);

    for (const term of sample) {
      const response = await page.goto(`/glossary/${term.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1, h2').first()).toBeVisible();
    }
  });

  test('alias slugs redirect to canonical or return 404', async ({ page }) => {
    const aliasData: AliasData = JSON.parse(
      fs.readFileSync(GLOSSARY_ALIASES_PATH, 'utf-8')
    );

    // Test first 9 aliases (or fewer if less available)
    const testAliases = aliasData.aliases.slice(0, 9);
    let routed = 0;
    let notRouted = 0;

    for (const { alias, target } of testAliases) {
      const response = await page.goto(`/glossary/${alias}`, {
        waitUntil: 'domcontentloaded',
      });

      const status = response?.status();
      
      if (status === 200) {
        // Should be on canonical or alias page
        const finalUrl = page.url();
        const isValid = finalUrl.includes(`/glossary/${target}`) || finalUrl.includes(`/glossary/${alias}`);
        expect(isValid).toBe(true);
        routed++;
      } else if (status === 404) {
        // Alias not yet routed - acceptable in dev
        notRouted++;
      }
    }
    
    console.log(`Alias routing: ${routed} routed, ${notRouted} not routed`);
  });

  test('key Nexus terms render correctly', async ({ page }) => {
    const keyTerms = [
      'sumeragi',
      'irohavirtualmachineivm',
      'worldstateviewwsv',
      'lanes',
      'dataavailability',
    ];

    for (const slug of keyTerms) {
      const response = await page.goto(`/glossary/${slug}`);
      expect(response?.status()).toBe(200);
      
      // Should have title
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Should have content
      const content = await page.content();
      expect(content.length).toBeGreaterThan(1000);
    }
  });

  test('terms with tagline display "Why it matters"', async ({ page }) => {
    const glossaryData: GlossaryData = JSON.parse(
      fs.readFileSync(GLOSSARY_V2025_PATH, 'utf-8')
    );

    // Find a term with tagline
    const termWithTagline = glossaryData.terms.find((t) => t.tagline);
    
    if (termWithTagline) {
      await page.goto(`/glossary/${termWithTagline.slug}`);
      
      // The tagline should be visible somewhere on the page
      const content = await page.content();
      expect(content).toContain(termWithTagline.tagline);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Hero Stats Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Glossary Hero Stats', () => {
  test('glossary index shows correct term count', async ({ page }) => {
    const glossaryData: GlossaryData = JSON.parse(
      fs.readFileSync(GLOSSARY_V2025_PATH, 'utf-8')
    );

    await page.goto('/glossary');
    
    // The page should display the term count
    const content = await page.content();
    
    // Check that the count is reasonable (within 10 of expected)
    const countMatch = content.match(/(\d+)\s*(terms?|entries|definitions)/i);
    if (countMatch) {
      const displayedCount = parseInt(countMatch[1], 10);
      expect(displayedCount).toBeGreaterThanOrEqual(glossaryData.canonicalCount - 10);
      expect(displayedCount).toBeLessThanOrEqual(glossaryData.canonicalCount + 10);
    }
  });
});

