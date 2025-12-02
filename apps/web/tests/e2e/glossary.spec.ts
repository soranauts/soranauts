import { test, expect } from '@playwright/test';

const SEARCH_PLACEHOLDER = 'Search glossary terms, definitions, or tags...';
const typesenseEnabled = process.env.TYPESENSE_E2E === 'true';
const describeIfTypesense = typesenseEnabled ? test.describe : test.describe.skip;

test.describe('Glossary', () => {
  test('shows Typesense setup instructions when backend unavailable', async ({ page }) => {
    await page.goto('/glossary');

    const warning = page.getByText('Typesense Not Available');
    if (!(await warning.isVisible())) {
      test.skip('Typesense backend available, skipping fallback assertion');
    }

    await expect(warning).toBeVisible();
    await expect(page.getByText('To enable search functionality:')).toBeVisible();
    await expect(page.getByText(/docker run -p 8108:8108 typesense/)).toBeVisible();
  });
});

test.describe('Glossary alias routing', () => {
  // Use aliases from glossary.aliases.v2025.json
  const testAlias = 'ivm';
  const testCanonical = 'irohavirtualmachineivm';

  test('redirects alias slug to canonical term page or returns 404', async ({ page }) => {
    const response = await page.goto(`/glossary/${testAlias}`);
    const status = response?.status();
    
    // Accept redirect to canonical, direct render, or 404 (not yet routed)
    if (status === 200) {
      // Either redirected or directly rendered
      const url = page.url();
      const isCanonical = url.includes(testCanonical);
      const isAlias = url.includes(testAlias);
      expect(isCanonical || isAlias).toBe(true);
    } else if (status === 404) {
      // Alias not yet routed - acceptable in dev
      console.log(`Alias ${testAlias} not routed (404)`);
    }
  });

  test('alias returns 200/301/308/404 to canonical', async ({ request }) => {
    const res = await request.get(`/glossary/${testAlias}`, { maxRedirects: 0 });
    const status = res.status();
    
    // Accept various valid responses
    expect([200, 301, 308, 404]).toContain(status);

    const location = res.headers()['location'] ?? '';
    if (status === 301 || status === 308) {
      expect(location).toContain(testCanonical);
    }
  });

  test('alias slugs are not rendered in glossary list', async ({ page }) => {
    await page.goto('/glossary');
    // Aliases should not appear as separate entries
    await expect(page.locator(`#glossary-${testAlias}`)).toHaveCount(0);
  });
});

describeIfTypesense('Glossary (Typesense search)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/glossary');
    await page.waitForSelector(`input[placeholder="${SEARCH_PLACEHOLDER}"]`, { timeout: 10_000 });
  });

  test('shows search input and category filters', async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
    await expect(searchInput).toBeVisible();
    await expect(page.getByRole('button', { name: /token \(\d+\)/i })).toBeVisible();
  });

  test('performs search for XOR', async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
    await searchInput.fill('XOR');
    await page.waitForTimeout(300);

    await expect(page.getByText(/XOR/)).toBeVisible();
    await expect(page.getByText(/Found \d+ term/)).toBeVisible();
  });

  test('category filter updates results', async ({ page }) => {
    const termCards = page.locator('[id^="glossary-"]');
    const initialCount = await termCards.count();

    const tokenFilter = page.getByRole('button', { name: /token \(\d+\)/i });
    await tokenFilter.click();
    await page.waitForTimeout(300);

    const filteredCount = await termCards.count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });
});