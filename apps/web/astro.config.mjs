import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';
import { execa } from 'execa';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import starlight from '@astrojs/starlight';
import tasks from './src/utils/tasks';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter.mjs';
import { loadGlossaryAutoLinkPlugin } from './src/utils/glossary-auto-link.mjs';

// Load the glossary auto-link plugin
console.log('🔗 Loading glossary auto-link plugin in config...');
const glossaryAutoLinkPlugin = await loadGlossaryAutoLinkPlugin();
console.log('🔗 Plugin loaded successfully in config');

import { ANALYTICS, SITE } from './src/utils/config.ts';
const redirectsJsonPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  './src/data/redirects.glossary.json',
);
const redirectsData = JSON.parse(fs.readFileSync(redirectsJsonPath, 'utf-8'));

const glossaryFlagValue = (process.env.FEATURE_GLOSSARY_V2025 ?? 'true').toLowerCase();
// Always include static glossary redirects so alias slugs perform server-side 308 redirects.
// Middleware-based alias routing remains enabled via FEATURE_GLOSSARY_ALIAS_REDIRECT.
const shouldIncludeGlossaryRedirects = true;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  ANALYTICS.vendors.googleAnalytics.id && ANALYTICS.vendors.googleAnalytics.partytown
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

const generatedRedirects = Object.fromEntries(
  (shouldIncludeGlossaryRedirects ? redirectsData?.redirects ?? [] : []).map((entry) => [
    entry.from,
    entry.to,
  ]),
);

const siteRedirects = {
  '/improvements': '/changelog',
  // SORA article redirects
  '/soramitsu-sora-polkaswap-the-complete-guide-to-defi-innovation': '/sora-ecosystem-explained',
  '/soramitsu-sora-polkaswap-the-complete-guide-to-defi-innovation/': '/sora-ecosystem-explained',
  '/soramitsu-sora-polkaswap': '/sora-ecosystem-explained',
  '/soramitsu-sora-polkaswap/': '/sora-ecosystem-explained',
  '/sora-defi-ecosystem': '/sora-ecosystem-explained',
  '/sora-defi-ecosystem/': '/sora-ecosystem-explained',
  '/sora-ecosystem': '/sora-ecosystem-explained',
  '/sora-ecosystem/': '/sora-ecosystem-explained',
  // Outdated V3 article redirect (V3/Nexus is now Iroha-based, not Polkadot)
  '/sora-v3-revolutionizing-tokenomics-and-defi-on-polkadot': '/sora-nexus-complete-guide',
  '/sora-v3-revolutionizing-tokenomics-and-defi-on-polkadot/': '/sora-nexus-complete-guide',
  // vXOR discontinued Nov 2024 (SORA v3 Stage II) - replaced by KUSD
  '/sora-v3-vxor-key-updates-users-need-to-know': '/sora-nexus-complete-guide',
  '/sora-v3-vxor-key-updates-users-need-to-know/': '/sora-nexus-complete-guide',
  // Time-locked Update #88 with outdated claims and SORA v2 framework error
  '/sora-v3-vision-defi-milestones-and-polkaswap-news-update-88': '/sora-v3-guide-fujiwara-testnet-xor-fees-and-ton-bridge',
  '/sora-v3-vision-defi-milestones-and-polkaswap-news-update-88/': '/sora-v3-guide-fujiwara-testnet-xor-fees-and-ton-bridge',
};

const redirects = {
  ...generatedRedirects,
  ...siteRedirects,
};

const pagefindIntegration = {
  name: 'pagefind-cli-runner',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      if (process.env.DISABLE_PAGEFIND === 'true') {
        logger.info('Skipping Pagefind index build (DISABLE_PAGEFIND=true).');
        return;
      }

      const siteDir = fileURLToPath(dir);
      logger.info('Running Pagefind CLI to build search index…');

      try {
        await execa('pnpm', ['exec', 'pagefind', '--site', siteDir], {
          stdio: 'inherit',
        });
        logger.info('Pagefind index generated successfully.');
      } catch (error) {
        logger.error('Pagefind build failed.');
        throw error;
      }
    },
  },
};

export default defineConfig({
  site: SITE.site,
  base: SITE.base,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  redirects,

  output: 'static',

  integrations: [
    starlight({
      title: 'SORA Codex',
      // Pagefind handled by Starlight - main site pages use data-pagefind-ignore
      // Custom CSS with Soranauts design tokens
      customCss: ['./src/styles/starlight-custom.css'],
      // Custom components for Soranauts integration
      components: {
        // Custom header with glossary/blog navigation links
        Header: './src/components/starlight/Header.astro',
        // Custom site title that links to /docs instead of /
        SiteTitle: './src/components/starlight/SiteTitle.astro',
        // Redirect Starlight 404 to main site 404
        NotFound: './src/components/starlight/NotFound.astro',
      },
      // TODO: Restore sidebar when Starlight docs content pages are created.
      // Commented out — these docs/* slugs don't exist yet (unfinished migration).
      // See: docs/starlight-migration/MIGRATION_PLAN.md
      sidebar: [],
      // --- Original sidebar (preserved for future use) ---
      // sidebar: [
      //   {
      //     label: 'Fundamentals',
      //     items: [
      //       { label: 'SORA Overview', slug: 'docs/fundamentals' },
      //       { label: 'Tokenomics', slug: 'docs/fundamentals/tokenomics' },
      //       { label: 'Governance', slug: 'docs/fundamentals/governance' },
      //       { label: 'SORA Nexus', slug: 'docs/fundamentals/sora-nexus' },
      //     ],
      //   },
      //   {
      //     label: 'Products',
      //     items: [
      //       { label: 'Polkaswap', slug: 'docs/products/polkaswap' },
      //       { label: 'Fearless Wallet', slug: 'docs/products/fearless-wallet' },
      //       { label: 'SORA Card', slug: 'docs/products/sora-card' },
      //       {
      //         label: 'TONSWAP',
      //         items: [
      //           { label: 'Overview', slug: 'docs/products/tonswap' },
      //           { label: 'Features', slug: 'docs/products/tonswap/features' },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     label: 'Technical',
      //     collapsed: true,
      //     items: [
      //       {
      //         label: 'Iroha',
      //         items: [
      //           { label: 'Overview', slug: 'docs/technical/iroha' },
      //           { label: 'Sumeragi Consensus', slug: 'docs/technical/iroha/consensus' },
      //           { label: 'Smart Contracts', slug: 'docs/technical/iroha/smart-contracts' },
      //         ],
      //       },
      //       {
      //         label: 'Bridges',
      //         items: [
      //           { label: 'Ethereum (HASHI)', slug: 'docs/technical/bridges/ethereum' },
      //           { label: 'Polkadot (XCM)', slug: 'docs/technical/bridges/polkadot' },
      //           { label: 'TON Bridge', slug: 'docs/technical/bridges/ton' },
      //         ],
      //       },
      //       {
      //         label: 'Integration',
      //         items: [
      //           { label: 'Getting Started', slug: 'docs/technical/integration/getting-started' },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     label: 'Guides',
      //     collapsed: true,
      //     autogenerate: { directory: 'docs/guides' },
      //   },
      //   {
      //     label: 'Archive',
      //     collapsed: true,
      //     badge: { text: 'Historical', variant: 'caution' },
      //     items: [
      //       { label: 'Timeline', slug: 'docs/archive' },
      //       {
      //         label: '2025',
      //         items: [
      //           { label: 'Nexus Announcement', slug: 'docs/archive/2025/sora-nexus-launch' },
      //         ],
      //       },
      //       {
      //         label: '2024',
      //         items: [
      //           { label: 'SORA Card Launch', slug: 'docs/archive/2024/sora-card-launch' },
      //           { label: 'Year in Review', slug: 'docs/archive/2024/year-review' },
      //         ],
      //       },
      //       {
      //         label: '2023',
      //         items: [
      //           { label: 'Polkaswap 2.0', slug: 'docs/archive/2023/polkaswap-v2' },
      //         ],
      //       },
      //       {
      //         label: '2022',
      //         items: [
      //           { label: 'Kusama Parachain', slug: 'docs/archive/2022/kusama-parachain' },
      //         ],
      //       },
      //       {
      //         label: '2021',
      //         items: [
      //           { label: 'SORA v2 Launch', slug: 'docs/archive/2021/sora-v2-launch' },
      //         ],
      //       },
      //     ],
      //   },
      // ],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    react(),
    icon({
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json'),
      },
    }),
    // pagefindIntegration disabled - Starlight handles Pagefind for /docs
    // The main site search uses its own SearchModal with glossary JSON

    // ...whenExternalScripts(() =>
    //   partytown({
    //     config: { forward: ['dataLayer.push'] },
    //   })
    // ),

    // tasks(),
  ],


  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, glossaryAutoLinkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin],
  },

  mdx: {
    remarkPlugins: [readingTimeRemarkPlugin, glossaryAutoLinkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js']
      }
    }
  },
});
