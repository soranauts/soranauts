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
  test('redirects alias slug to canonical term page', async ({ page }) => {
    await page.goto('/glossary/hyperledger-iroha-3');
    await expect(page).toHaveURL(/\/glossary\/iroha3\/?$/i);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/iroha 3/i);
  });

  test('alias returns 200/301/308 to canonical', async ({ request }) => {
    const res = await request.get('/glossary/hyperledger-iroha-3', { maxRedirects: 0 });
    const status = res.status();
    expect([200, 301, 308]).toContain(status);

    const location = res.headers()['location'] ?? '';
    if (status === 301 || status === 308) {
      expect(new RegExp('/glossary/iroha3/?$', 'i').test(location)).toBe(true);
    }
  });

  test('alias slugs are not rendered in glossary list', async ({ page }) => {
    await page.goto('/glossary');
    await expect(page.locator('#glossary-hyperledger-iroha-3')).toHaveCount(0);
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