import { test, expect } from '@playwright/test';

test.describe('Glossary Filtering', () => {
  test('token category shows 5 items including TS', async ({ page }) => {
    await page.goto('/glossary');
    
    // Wait for the glossary to load
    await page.waitForSelector('[data-testid="glossary-container"]', { timeout: 10000 });
    
    // Click the token category button
    await page.getByRole('button', { name: /token \(\d+\)/ }).click();
    
    // Wait for filtering to complete
    await page.waitForTimeout(500);
    
    // Check that we have exactly 5 token terms
    const termCards = page.locator('[id^="glossary-"]');
    await expect(termCards).toHaveCount(5);
    
    // Verify specific terms are present
    await expect(page.getByText('XOR')).toBeVisible();
    await expect(page.getByText('VAL')).toBeVisible();
    await expect(page.getByText('PSWAP')).toBeVisible();
    await expect(page.getByText('KUSD')).toBeVisible();
    await expect(page.getByText('TS')).toBeVisible();
    
    // Verify the count in the button matches the displayed items
    const tokenButton = page.getByRole('button', { name: /token \(\d+\)/ });
    const buttonText = await tokenButton.textContent();
    expect(buttonText).toMatch(/token \(5\)/);
  });

  test('category toggle works correctly', async ({ page }) => {
    await page.goto('/glossary');
    
    // Wait for the glossary to load
    await page.waitForSelector('[data-testid="glossary-container"]', { timeout: 10000 });
    
    const tokenButton = page.getByRole('button', { name: /token \(\d+\)/ });
    
    // Click to select token category
    await tokenButton.click();
    await expect(tokenButton).toHaveClass(/bg-red-100/);
    
    // Click again to deselect
    await tokenButton.click();
    await expect(tokenButton).not.toHaveClass(/bg-red-100/);
    
    // Should show all terms again
    const allTerms = page.locator('[id^="glossary-"]');
    await expect(allTerms).toHaveCount(61); // Total glossary terms
  });

  test('search query clears category filter', async ({ page }) => {
    await page.goto('/glossary');
    
    // Wait for the glossary to load
    await page.waitForSelector('[data-testid="glossary-container"]', { timeout: 10000 });
    
    // Select token category first
    await page.getByRole('button', { name: /token \(\d+\)/ }).click();
    await expect(page.locator('[id^="glossary-"]')).toHaveCount(5);
    
    // Type in search box
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('SORA');
    
    // Wait for search to complete
    await page.waitForTimeout(500);
    
    // Should show search results, not just token category
    const searchResults = page.locator('[id^="glossary-"]');
    await expect(searchResults).toHaveCount(1); // Should find SORA term
    
    // Token button should no longer be active
    const tokenButton = page.getByRole('button', { name: /token \(\d+\)/ });
    await expect(tokenButton).not.toHaveClass(/bg-red-100/);
  });
});
