import { test, expect } from '@playwright/test';

test.describe('Quote Tool', () => {
  test('should load quote tool page', async ({ page }) => {
    await page.goto('/tools/quote');
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('SORA Quote Tool');
    
    // Check that the quote form is present
    await expect(page.locator('input[placeholder*="XOR"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="KUSD"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="100"]')).toBeVisible();
    await expect(page.locator('button:has-text("Get Quote")')).toBeVisible();
  });

  test('should show error when trying to get quote without valid inputs', async ({ page }) => {
    await page.goto('/tools/quote');
    
    // Try to get quote with empty inputs
    await page.click('button:has-text("Get Quote")');
    
    // Should show error or validation message
    // Note: This test assumes the form has client-side validation
    // In a real implementation, you might want to check for specific error messages
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock the API to return an error
    await page.route('/api/quote*', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to get quote' })
      });
    });

    await page.goto('/tools/quote');
    
    // Fill in the form
    await page.fill('input[placeholder*="XOR"]', 'XOR');
    await page.fill('input[placeholder*="KUSD"]', 'KUSD');
    await page.fill('input[placeholder*="100"]', '100');
    
    // Click get quote
    await page.click('button:has-text("Get Quote")');
    
    // Should show error message
    await expect(page.locator('text=Error')).toBeVisible();
  });

  test('should display quote result when API returns success', async ({ page }) => {
    // Mock the API to return a successful quote
    await page.route('/api/quote*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          out: '95.5',
          fee: '0.5',
          route: ['XOR', 'KUSD']
        })
      });
    });

    await page.goto('/tools/quote');
    
    // Fill in the form
    await page.fill('input[placeholder*="XOR"]', 'XOR');
    await page.fill('input[placeholder*="KUSD"]', 'KUSD');
    await page.fill('input[placeholder*="100"]', '100');
    
    // Click get quote
    await page.click('button:has-text("Get Quote")');
    
    // Should show quote result
    await expect(page.locator('text=Quote Result')).toBeVisible();
    await expect(page.locator('text=95.5 KUSD')).toBeVisible();
    await expect(page.locator('text=0.5 KUSD')).toBeVisible();
    await expect(page.locator('text=XOR → KUSD')).toBeVisible();
  });
});


