import { test, expect } from '@playwright/test';

test('site search modal opens and handles missing index gracefully', async ({ page }) => {
  await page.goto('/');

  await page.locator('#search-trigger').click();
  await expect(page.locator('#search-modal')).toBeVisible();
  await expect(page.locator('#search-initial')).toBeVisible();

  const input = page.locator('#search-input');
  await input.fill('xor');
  await page.waitForTimeout(500);

  const results = page.locator('#search-results-list a.search-modal__result');
  const resultCount = await results.count();

  if (resultCount > 0) {
    await expect(results.first()).toContainText(/xor/i);
    await expect(page.locator('#search-count')).not.toHaveText(/0 results/i);
  } else {
    if (await page.locator('#search-no-results').isVisible()) {
      await expect(page.locator('#search-no-results')).toBeVisible();
    } else {
      await expect(page.locator('#search-initial')).toBeVisible();
    }
  }
});
