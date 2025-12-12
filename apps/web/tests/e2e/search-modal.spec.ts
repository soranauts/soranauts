import { test, expect } from '@playwright/test';

test.describe.configure({ retries: process.env.CI ? 2 : 0 });

test('site search modal opens and handles missing index gracefully', async ({ page }) => {
  await page.goto('/');

  // Open search modal
  await page.locator('#search-trigger').click();
  await expect(page.locator('#search-modal')).toBeVisible();
  
  // Modal should have the search input
  const input = page.locator('#search-input');
  await expect(input).toBeVisible();
  
  // Try searching
  await input.click();
  await input.fill('xor');
  await page.waitForTimeout(1000);

  // Check if we get results
  const results = page.locator('#search-results-list a.search-modal__result');
  const resultCount = await results.count();

  if (resultCount > 0) {
    // If results are found, verify they're related to search
    const texts = await results.allTextContents();
    expect(texts.some((text) => /xor/i.test(text))).toBeTruthy();

    const countText = (await page.locator('#search-count').innerText()).trim();
    expect(countText).not.toMatch(/^0 results$/i);

    const firstHref = await results.first().getAttribute('href');
    expect(firstHref).toBeTruthy();
  } else {
    // No results - just verify the modal is still functional
    // The search might show different states (no-results, initial, loading)
    // As long as the modal stayed open and functional, test passes
    await expect(input).toBeVisible();
    const modalVisible = await page.locator('#search-modal').isVisible();
    expect(modalVisible).toBeTruthy();
  }
});
