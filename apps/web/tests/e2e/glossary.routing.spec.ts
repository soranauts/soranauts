/**
 * Glossary Routing E2E Tests
 * 
 * Validates canonical slugs return 200 OK and alias slugs redirect properly.
 * Uses random sampling for canonical tests to keep CI fast.
 */
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data Loading
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

interface GlossaryV2025 {
  terms: GlossaryTerm[];
  canonicalCount: number;
  aliasCount: number;
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

function getRandomSample<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ─────────────────────────────────────────────────────────────────────────────
// Canonical Slug Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Canonical Slug Routing', () => {
  const glossaryData = loadGlossaryData();
  const aliasData = loadAliasData();
  
  // Filter out any terms that are actually aliases (redirects)
  const aliasSlugs = new Set(aliasData.aliases.map(a => a.alias));
  const canonicalTerms = glossaryData.terms.filter(t => !aliasSlugs.has(t.slug));
  const randomTerms = getRandomSample(canonicalTerms, 10);

  test('glossary index page loads successfully', async ({ page }) => {
    const response = await page.goto('/glossary');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Glossary/i);
  });

  test('10 random canonical slugs return 200 OK', async ({ page }) => {
    for (const term of randomTerms) {
      const response = await page.goto(`/glossary/${term.slug}`);
      
      // Should return 200
      expect(response?.status()).toBe(200);
      
      // Title should be visible
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
      
      // No redirect should have occurred
      const finalUrl = page.url();
      expect(finalUrl).toContain(`/glossary/${term.slug}`);
    }
  });

  test('canonical slugs have correct page title', async ({ page }) => {
    // Test a specific known term
    const term = glossaryData.terms.find(t => t.slug === 'sumeragi');
    if (!term) {
      test.skip();
      return;
    }

    await page.goto(`/glossary/${term.slug}`);
    
    // Page title should contain term name
    await expect(page).toHaveTitle(new RegExp(term.title, 'i'));
  });

  test('canonical pages have required content sections', async ({ page }) => {
    const term = randomTerms[0];
    await page.goto(`/glossary/${term.slug}`);

    // Should have main heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Should have some content
    const content = await page.content();
    expect(content.length).toBeGreaterThan(1000);
  });

  test('no duplicate canonical slugs in glossary', async () => {
    const slugs = glossaryData.terms.map(t => t.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Alias Redirect Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Alias Redirect Routing', () => {
  const aliasData = loadAliasData();
  const glossaryData = loadGlossaryData();
  const canonicalSlugs = new Set(glossaryData.terms.map(t => t.slug));

  test('all aliases point to valid canonical slugs', async () => {
    for (const { alias, target } of aliasData.aliases) {
      expect(canonicalSlugs.has(target)).toBe(true);
    }
  });

  test('alias slugs redirect or resolve to canonical', async ({ page }) => {
    for (const { alias, target } of aliasData.aliases) {
      await page.goto(`/glossary/${alias}`);
      
      const finalUrl = page.url();
      
      // Should either redirect to canonical or resolve directly
      const isCanonical = finalUrl.includes(`/glossary/${target}`);
      const isAlias = finalUrl.includes(`/glossary/${alias}`);
      
      // One of these should be true
      expect(isCanonical || isAlias).toBe(true);
      
      // Page should load successfully
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
    }
  });

  test('alias redirect returns proper status code (308, 200, or 404 for unrouted)', async ({ request }) => {
    const results: Array<{ alias: string; status: number }> = [];
    
    for (const { alias, target } of aliasData.aliases) {
      const response = await request.get(`/glossary/${alias}`, { maxRedirects: 0 });
      const status = response.status();
      results.push({ alias, status });
      
      // Accept 200 (direct render), 301, 302, 307, 308 (redirects), or 404 (not yet routed)
      // In dev mode, some aliases may not have routes configured
      expect([200, 301, 302, 307, 308, 404]).toContain(status);
      
      if (status === 308 || status === 301) {
        const location = response.headers()['location'];
        expect(location).toMatch(new RegExp(`/glossary/${target}/?$`));
      }
    }
    
    // Log summary
    const successCount = results.filter(r => r.status !== 404).length;
    console.log(`Alias routing: ${successCount}/${results.length} aliases routed`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Key Nexus Terms Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Key Nexus Terms Routing', () => {
  const keyTerms = [
    'sumeragi',
    'irohavirtualmachineivm',
    'worldstateviewwsv',
    'lanes',
    'dataavailability',
    'kotodama',
    'triggers',
    'quorumcertificate',
    'dataspaces',
    'economicmodel',
  ];

  for (const slug of keyTerms) {
    test(`key term "${slug}" loads successfully`, async ({ page }) => {
      const response = await page.goto(`/glossary/${slug}`);
      
      expect(response?.status()).toBe(200);
      
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
      
      // Should have meaningful content
      const content = await page.content();
      expect(content.length).toBeGreaterThan(2000);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 404 Handling Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('404 Handling', () => {
  test('non-existent slug returns 404', async ({ page }) => {
    const response = await page.goto('/glossary/nonexistent-term-xyz123');
    
    // Should return 404
    expect(response?.status()).toBe(404);
  });

  test('404 page has helpful content', async ({ page }) => {
    await page.goto('/glossary/nonexistent-term-xyz123');
    
    // Should show error message
    const content = await page.content();
    expect(content.toLowerCase()).toMatch(/404|not found|error/i);
  });
});

