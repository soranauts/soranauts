import { test, expect } from '@playwright/test';

test.describe('Quote Tool', () => {
  test('renders maintenance notice', async ({ page }) => {
    await page.goto('/tools/quote');

    await expect(page.getByRole('heading', { level: 1, name: 'SORA Quote Tool' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'SORA Quote Tool' })).toBeVisible();
    await expect(page.getByText('Quote tool is temporarily disabled during build.')).toBeVisible();
  });
});
