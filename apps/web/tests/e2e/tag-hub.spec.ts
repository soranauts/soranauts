import { expect, test } from '@playwright/test';

test.describe('SORA Explorer experience', () => {
  test('renders the enabled SORA Explorer layout', async ({ page }) => {
    await page.goto('/explore');

    await expect(page.getByRole('heading', { name: 'SORA Explorer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SORA Explorer Preview' })).toHaveCount(0);

    await expect(page.getByTestId('tag-hub-count')).toContainText(/tag/i);
    await expect(page.getByRole('heading', { name: 'Foundational Topics' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quick Paths' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Trending & Recently Updated' })).toBeVisible();
  });

  test('supports interactive filtering', async ({ page }) => {
    await page.goto('/explore');

    const searchInput = page.locator('#tag-hub-search');
    const tagCards = page.getByTestId('tag-hub-results').locator('.tag-card');

    await expect(tagCards).not.toHaveCount(0);

    await searchInput.fill('polkaswap');
    await expect(tagCards).not.toHaveCount(0);
    await expect(tagCards.first()).toContainText(/polkaswap/i);

    const glossaryFilter = page.getByRole('button', { name: 'Glossary linked' });
    await glossaryFilter.click();
    await expect(glossaryFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.getByTestId('tag-hub-results').locator('.tag-card__badge', { hasText: 'Glossary' }),
    ).not.toHaveCount(0);

    await searchInput.fill('');
    await glossaryFilter.click();
    await expect(glossaryFilter).toHaveAttribute('aria-pressed', 'false');
  });

  test('loads tag detail pages with related content', async ({ page }) => {
    await page.goto('/tag/sora');

    await expect(page.getByRole('heading', { level: 1, name: /sora/i })).toBeVisible();
    await expect(page.locator('.tag-detail-section__title', { hasText: /latest articles/i })).toBeVisible();

    const postLinks = page.locator('[data-pagefind-body] article a');
    await expect(postLinks).not.toHaveCount(0);

    const exploreLink = page.getByRole('link', { name: 'SORA Explorer' }).first();
    await expect(exploreLink).toHaveAttribute('href', '/explore');
  });
});


