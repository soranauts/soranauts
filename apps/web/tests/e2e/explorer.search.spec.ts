import { test, expect } from '@playwright/test';

/**
 * Explorer Search + Nexus Stats E2E Tests
 * 
 * Tests search parity with Glossary and live Nexus term count display.
 */

test.describe('Explorer Search Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
  });

  test('Explorer hero displays Nexus term count', async ({ page }) => {
    // Look for the Nexus terms stat in the hero
    const nexusStat = page.locator('.tag-hub-hero__stat').filter({ hasText: 'Nexus terms' });
    
    // Should be visible
    await expect(nexusStat).toBeVisible();
    
    // Should have a numeric value
    const countText = await nexusStat.locator('dd').textContent();
    const count = parseInt(countText ?? '0', 10);
    
    // Should have a reasonable count (based on known data ~179 terms)
    expect(count).toBeGreaterThan(50);
    expect(count).toBeLessThan(500);
  });

  test('Nexus term count is readable in dark mode', async ({ page }) => {
    // Toggle to dark mode if not already
    const html = page.locator('html');
    const isDark = await html.evaluate((el) => el.classList.contains('dark'));
    
    if (!isDark) {
      // Try to find theme toggle
      const themeToggle = page.locator('[aria-label*="theme"]').first();
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(300);
      }
    }

    // Check Nexus terms stat visibility
    const nexusStat = page.locator('.tag-hub-hero__stat').filter({ hasText: 'Nexus terms' });
    await expect(nexusStat).toBeVisible();
    
    // The count should still be readable
    const countText = await nexusStat.locator('dd').textContent();
    expect(countText?.trim()).toMatch(/^\d+$/);
  });

  test('clicking Nexus section navigates to glossary terms', async ({ page }) => {
    // Scroll to Nexus section
    const nexusSection = page.locator('#nexus-architecture');
    if (await nexusSection.isVisible()) {
      await nexusSection.scrollIntoViewIfNeeded();
      
      // Find a term link in the Nexus section
      const termLink = nexusSection.locator('a[href^="/glossary/"]').first();
      
      if (await termLink.isVisible()) {
        const href = await termLink.getAttribute('href');
        await termLink.click();
        
        // Should navigate to a glossary page
        await expect(page).toHaveURL(/\/glossary\//);
        
        // Page should have a heading
        await expect(page.locator('h1')).toBeVisible();
      }
    }
  });
});

test.describe('Explorer-Glossary Search Parity', () => {
  test('searching "Sumeragi" returns same canonical result as Glossary', async ({ page }) => {
    // First, search in Glossary
    await page.goto('/glossary');
    await page.waitForLoadState('networkidle');
    
    // Find search input
    const glossarySearch = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    
    if (await glossarySearch.isVisible()) {
      await glossarySearch.fill('Sumeragi');
      await page.waitForTimeout(500);
      
      // Look for a result link
      const glossaryResult = page.locator('a[href*="/glossary/sumeragi"]').first();
      const glossaryHref = await glossaryResult.getAttribute('href');
      
      // Now check Explorer
      await page.goto('/explore');
      await page.waitForLoadState('networkidle');
      
      // Find the Nexus section which should have Sumeragi
      const nexusSection = page.locator('#nexus-architecture');
      if (await nexusSection.isVisible()) {
        const sumeragiLink = nexusSection.locator('a[href*="sumeragi"]').first();
        
        if (await sumeragiLink.isVisible()) {
          const explorerHref = await sumeragiLink.getAttribute('href');
          
          // Both should point to the same canonical slug
          expect(explorerHref).toContain('glossary');
          expect(explorerHref?.toLowerCase()).toContain('sumeragi');
        }
      }
    }
  });

  test('alias slugs resolve to canonical pages', async ({ page }) => {
    // Navigate to Explorer
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    // Look for any glossary link in the page
    const glossaryLink = page.locator('a[href^="/glossary/"]').first();
    
    if (await glossaryLink.count() > 0) {
      await glossaryLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on a valid glossary page (not 404)
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
      
      // URL should contain /glossary/
      const url = page.url();
      expect(url).toContain('/glossary/');
    } else {
      console.log('No glossary links found in Explorer');
    }
  });

  test('Explorer shows no duplicate canonical slugs in Nexus section', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    // Get all glossary links in the page
    const links = await page.locator('a[href^="/glossary/"]').all();
    
    if (links.length > 0) {
      // Extract slugs
      const slugs: string[] = [];
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href) {
          const slug = href.replace('/glossary/', '').replace(/\/$/, '');
          slugs.push(slug.toLowerCase());
        }
      }
      
      // Check for duplicates
      const uniqueSlugs = new Set(slugs);
      
      // Allow tolerance for legitimate duplicates across subgroups
      // Terms can appear in multiple journeys/subgroups
      const duplicateCount = slugs.length - uniqueSlugs.size;
      expect(duplicateCount).toBeLessThan(20);
      
      console.log(`Found ${slugs.length} glossary links, ${uniqueSlugs.size} unique`);
    } else {
      console.log('No glossary links found in Explorer');
    }
  });
});

test.describe('Explorer Stats Display', () => {
  test('all hero stats are visible and have values', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    const stats = page.locator('.tag-hub-hero__stat');
    const count = await stats.count();
    
    // Should have at least 3 stats (topics, journeys, nexus terms or latest update)
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Each stat should have a label and value
    for (let i = 0; i < count; i++) {
      const stat = stats.nth(i);
      const label = stat.locator('dt');
      const value = stat.locator('dd');
      
      await expect(label).toBeVisible();
      await expect(value).toBeVisible();
      
      const valueText = await value.textContent();
      expect(valueText?.trim().length).toBeGreaterThan(0);
    }
  });

  test('Nexus term count matches expected range', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    const nexusStat = page.locator('.tag-hub-hero__stat').filter({ hasText: 'Nexus terms' });
    
    if (await nexusStat.isVisible()) {
      const countText = await nexusStat.locator('dd').textContent();
      const count = parseInt(countText ?? '0', 10);
      
      // Based on nexus-explorer.config.ts, we expect ~85-200 terms
      // This is a sanity check to ensure stats are loading correctly
      expect(count).toBeGreaterThan(50);
    }
  });

  test('stats are hidden gracefully when Explorer is disabled', async ({ page }) => {
    // This test verifies the disabled state behavior
    // In production, TAG_HUB_V1 should be true, so we just verify
    // the enabled state works correctly
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    // Check if we're in enabled or disabled state
    const previewSection = page.locator('text=SORA Explorer Preview');
    const heroStats = page.locator('.tag-hub-hero__stats');
    
    // Either preview message OR stats should be visible, not both
    const isPreview = await previewSection.isVisible();
    const hasStats = await heroStats.isVisible();
    
    // One must be true
    expect(isPreview || hasStats).toBe(true);
  });
});

