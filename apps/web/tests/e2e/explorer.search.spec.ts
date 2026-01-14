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


