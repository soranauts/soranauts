import { test, expect } from '@playwright/test';

test.describe('Glossary', () => {
  test('loads and filters', async ({ page }) => {
    await page.goto('http://localhost:4321/glossary');
    
    // Wait for the component to load
    await page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });
    
    // Check that the page loads
    await expect(page.getByRole('heading', { name: /SORA Glossary/i })).toBeVisible();
    
    // Test search functionality
    const searchInput = page.getByPlaceholder('Search glossary terms, definitions, or tags...');
    await searchInput.fill('xor');
    
    // Wait for debounced search to trigger
    await page.waitForTimeout(200);
    
    // Check that results are displayed
    await expect(page.getByText(/Found \d+ terms?/)).toBeVisible();
    
    // Test category filtering
    const tokenCategoryButton = page.getByRole('button', { name: /token \(\d+\)/i });
    await expect(tokenCategoryButton).toBeVisible();
    
    // Click the Token category and ensure results narrow
    await tokenCategoryButton.click();
    
    // Verify the search input is populated
    await expect(searchInput).toHaveValue('token');
    
    // Verify results are filtered
    await expect(page.getByText(/Found \d+ terms?/)).toBeVisible();
    
    // Test that clicking the category again deselects it
    await tokenCategoryButton.click();
    await expect(searchInput).toHaveValue('');
  });

  test('should handle deep linking', async ({ page }) => {
    // Test direct hash navigation
    await page.goto('http://localhost:4321/glossary#glossary-xor');
    
    // Wait for component to load
    await page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });
    
    // Wait a bit for scroll to complete
    await page.waitForTimeout(500);
    
    // Check that XOR term is visible (should be scrolled into view)
    const xorTerm = page.locator('#glossary-xor');
    await expect(xorTerm).toBeVisible();
  });

  test('should display search input and category filters', async ({ page }) => {
    await page.goto('http://localhost:4321/glossary');
    
    // Wait for React component to load
    await page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });
    
    // Check search input
    const searchInput = page.getByPlaceholder('Search glossary terms, definitions, or tags...');
    await expect(searchInput).toBeVisible();
    
    // Check category filters are present
    await expect(page.getByRole('button', { name: /token \(\d+\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /defi \(\d+\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /governance \(\d+\)/i })).toBeVisible();
  });

  test('should perform search functionality', async ({ page }) => {
    await page.goto('http://localhost:4321/glossary');
    
    // Wait for React component to load
    await page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });
    
    const searchInput = page.getByPlaceholder('Search glossary terms, definitions, or tags...');
    
    // Type in search box
    await searchInput.fill('XOR');
    
    // Wait for debounced search to trigger
    await page.waitForTimeout(200);
    
    // Check that results contain XOR
    await expect(page.getByText(/XOR/)).toBeVisible();
    
    // Check that the results count updates
    await expect(page.getByText(/Found \d+ terms?/)).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    await page.goto('http://localhost:4321/glossary');
    
    // Wait for React component to load
    await page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });
    
    // Click on token category filter
    const tokenFilter = page.getByRole('button', { name: /token \(\d+\)/i });
    await tokenFilter.click();
    
    // Verify the search input is populated
    const searchInput = page.getByPlaceholder('Search glossary terms, definitions, or tags...');
    await expect(searchInput).toHaveValue('token');
    
    // Verify results are filtered
    await expect(page.getByText(/Found \d+ terms?/)).toBeVisible();
    
    // Click again to deselect
    await tokenFilter.click();
    await expect(searchInput).toHaveValue('');
  });

  test('should handle alias clicks', async ({ page }) => {
    await page.goto('http://localhost:4321/glossary');
    
    // Wait for component to load
    await page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });
    
    // Find a term with aliases and click on an alias
    const aliasButton = page.locator('button:has-text("VAL")').first();
    if (await aliasButton.isVisible()) {
      await aliasButton.click();
      
      // Wait for navigation
      await page.waitForTimeout(300);
      
      // Check that we're scrolled to the VAL term
      const valTerm = page.locator('#glossary-val');
      await expect(valTerm).toBeVisible();
    }
  });
});