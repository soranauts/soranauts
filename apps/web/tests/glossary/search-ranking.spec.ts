import { test, expect, Page } from '@playwright/test';

const SEARCH_PLACEHOLDER = 'Search entities, versions, aliases, or tags';

async function performSearch(page: Page, query: string) {
  const input = page.getByPlaceholder(SEARCH_PLACEHOLDER);
  await input.click();
  await input.fill('');
  await input.type(query);
  await page.waitForSelector('[data-testid^="glossary-result-"]');
}

async function getResultSlugs(page: Page) {
  return page.$$eval('[data-testid^="glossary-result-"]', (elements) =>
    elements
      .map((element) => element.getAttribute('data-testid') ?? '')
      .map((value) => value.replace('glossary-result-', ''))
  );
}

test.describe('Glossary Search Ranking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/glossary');
    await page.waitForSelector('[data-testid="glossary-search-v2"]');
  });

  test('hyperled query surfaces entity with versions featured', async ({ page }) => {
    await performSearch(page, 'hyperled');
    const slugs = await getResultSlugs(page);
    expect(slugs[0]).toBe('hyperledger-iroha');
    expect(slugs.slice(1, 3)).toEqual(expect.arrayContaining(['hyperledger-iroha-2', 'hyperledger-iroha-3']));
    await expect(page.locator('[data-testid="glossary-featured"]')).toBeVisible();
  });

  test('iroha v3 prioritises version with parent entity featured', async ({ page }) => {
    await performSearch(page, 'iroha v3');
    const slugs = await getResultSlugs(page);
    expect(slugs[0]).toBe('hyperledger-iroha-3');
    expect(slugs.slice(0, 2)).toEqual(expect.arrayContaining(['hyperledger-iroha']));
    await expect(page.locator('[data-testid="glossary-featured"]')).toBeVisible();
  });

  test('nexus query highlights SORA v3 and Iroha 3', async ({ page }) => {
    await performSearch(page, 'nexus');
    const slugs = await getResultSlugs(page);
    expect(slugs.slice(0, 2)).toEqual(expect.arrayContaining(['sora-v3', 'hyperledger-iroha-3']));
  });

  test('iroha v2 query places version first', async ({ page }) => {
    await performSearch(page, 'iroha v2');
    const slugs = await getResultSlugs(page);
    expect(slugs[0]).toBe('hyperledger-iroha-2');
  });

  test('pswap ranking favours PSWAP and Polkaswap', async ({ page }) => {
    await performSearch(page, 'pswap');
    const slugs = await getResultSlugs(page);
    expect(slugs.slice(0, 3)).toEqual(expect.arrayContaining(['pswap', 'polkaswap']));
  });

  test('sora dex query surfaces Polkaswap', async ({ page }) => {
    await performSearch(page, 'sora dex');
    const slugs = await getResultSlugs(page);
    expect(slugs.slice(0, 2)).toContain('polkaswap');
  });

  test('telegram dex query surfaces TONSWAP', async ({ page }) => {
    await performSearch(page, 'telegram dex');
    const slugs = await getResultSlugs(page);
    expect(slugs.slice(0, 3)).toContain('tonswap');
  });
});

