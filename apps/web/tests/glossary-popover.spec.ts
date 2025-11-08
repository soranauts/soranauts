import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';
const ARTICLE_PATH = '/blog/sora-v3-blockchain-innovations-at-the-sora-economic-forum-2024/';
const GLOSSARY_V2_ENABLED = process.env.GLOSSARY_V2 === 'true';

test.describe('Glossary popover (v2)', () => {
  test.skip(!GLOSSARY_V2_ENABLED, 'Set GLOSSARY_V2=true to run popover tests');

  test('opens and closes the popover with focus management', async ({ page }) => {
    await page.goto(`${BASE_URL}${ARTICLE_PATH}`);

    const glossaryLink = page.locator('article a.glossary').first();
    await glossaryLink.waitFor({ state: 'visible' });

    await glossaryLink.click();

    const popover = page.locator('#g-pop');
    await expect(popover).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('#g-pop .g-pop__close')).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(popover).toHaveAttribute('aria-hidden', 'true');
    await expect(glossaryLink).toBeFocused();
  });

  test('uses sheet mode on small viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}${ARTICLE_PATH}`);

    const glossaryLink = page.locator('article a.glossary').first();
    await glossaryLink.waitFor({ state: 'visible' });

    await glossaryLink.click();

    const popover = page.locator('#g-pop');
    await expect(popover).toHaveAttribute('aria-hidden', 'false');
    await expect(popover).toHaveClass(/g-pop--sheet/);

    await page.keyboard.press('Escape');
    await expect(popover).toHaveAttribute('aria-hidden', 'true');
  });
});

