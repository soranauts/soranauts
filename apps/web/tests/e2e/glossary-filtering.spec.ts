import { test, expect } from '@playwright/test';

const typesenseEnabled = process.env.TYPESENSE_E2E === 'true';
const describeIfTypesense = typesenseEnabled ? test.describe : test.describe.skip;
const SEARCH_PLACEHOLDER = 'Search glossary terms, definitions, or tags...';

describeIfTypesense('Glossary Filtering', () => {
  test('token category surfaces expected tokens', async ({ page }) => {
    await page.goto('/glossary');

    await page.waitForSelector(`input[placeholder="${SEARCH_PLACEHOLDER}"]`, { timeout: 10_000 });

    const tokenButton = page.getByRole('button', { name: /token \(\d+\)/ });
    await tokenButton.click();

    await page.waitForTimeout(500);

    const termCards = page.locator('[id^="glossary-"]');
    const count = await termCards.count();
    expect(count).toBeGreaterThan(0);

    await expect(page.getByText(/XOR/i)).toBeVisible();
    await expect(page.getByText(/VAL/i)).toBeVisible();
    await expect(page.getByText(/PSWAP/i)).toBeVisible();
  });

  test('category toggle returns to full results', async ({ page }) => {
    await page.goto('/glossary');
    await page.waitForSelector(`input[placeholder="${SEARCH_PLACEHOLDER}"]`, { timeout: 10_000 });

    const termCards = page.locator('[id^="glossary-"]');
    const initialCount = await termCards.count();

    const tokenButton = page.getByRole('button', { name: /token \(\d+\)/ });
    await tokenButton.click();
    await page.waitForTimeout(300);

    const filteredCount = await termCards.count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    await tokenButton.click();
    await page.waitForTimeout(300);

    const resetCount = await termCards.count();
    expect(resetCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('search query overrides category filter', async ({ page }) => {
    await page.goto('/glossary');
    await page.waitForSelector(`input[placeholder="${SEARCH_PLACEHOLDER}"]`, { timeout: 10_000 });

    const tokenButton = page.getByRole('button', { name: /token \(\d+\)/ });
    await tokenButton.click();
    await page.waitForTimeout(300);

    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
    await searchInput.fill('SORA');
    await page.waitForTimeout(500);

    const results = page.locator('[id^="glossary-"]');
    const resultCount = await results.count();
    expect(resultCount).toBeGreaterThan(0);
    await expect(page.getByText(/SORA/i)).toBeVisible();
  });
});
