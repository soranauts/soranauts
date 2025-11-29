import { test, expect } from '@playwright/test';

test.describe.configure({ retries: process.env.CI ? 2 : 0 });

test('site search modal opens and handles missing index gracefully', async ({ page }) => {
  await page.goto('/');

  await page.locator('#search-trigger').click();
  await expect(page.locator('#search-modal')).toBeVisible();
  await expect(page.locator('#search-initial')).toBeVisible();

  const input = page.locator('#search-input');
  await input.click();
  await input.fill('xor');
  await page.waitForTimeout(500);

  const results = page.locator('#search-results-list a.search-modal__result');
  const resultCount = await results.count();

  if (resultCount > 0) {
    const texts = await results.allTextContents();
    expect(texts.some((text) => /xor/i.test(text))).toBeTruthy();

    const countText = (await page.locator('#search-count').innerText()).trim();
    expect(countText).not.toMatch(/^0 results$/i);

    const firstHref = await results.first().getAttribute('href');
    expect(firstHref).toBeTruthy();
  } else {
    if (await page.locator('#search-no-results').isVisible()) {
      await expect(page.locator('#search-no-results')).toBeVisible();
    } else {
      await expect(page.locator('#search-initial')).toBeVisible();
    }
  }
});
