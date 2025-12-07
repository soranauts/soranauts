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
      title: 'Soranauts Docs',
      // Disable Starlight's built-in Pagefind - we use our own unified search
      pagefind: false,
      // Custom CSS with Soranauts design tokens
      customCss: ['./src/styles/starlight-custom.css'],
      // Minimal sidebar for initial setup - will expand in Week 2
      sidebar: [
        {
          label: 'Fundamentals',
          items: [
            { label: 'SORA Overview', slug: 'docs/fundamentals' },
            { label: 'Tokenomics', slug: 'docs/fundamentals/tokenomics' },
            { label: 'Governance', slug: 'docs/fundamentals/governance' },
            { label: 'SORA Nexus', slug: 'docs/fundamentals/sora-nexus' },
          ],
        },
        {
          label: 'Products',
          collapsed: true,
          autogenerate: { directory: 'docs/products' },
        },
        {
          label: 'Technical',
          collapsed: true,
          autogenerate: { directory: 'docs/technical' },
        },
        {
          label: 'Guides',
          collapsed: true,
          autogenerate: { directory: 'docs/guides' },
        },
        {
          label: 'Archive',
          collapsed: true,
          badge: { text: 'Historical', variant: 'caution' },
          autogenerate: { directory: 'docs/archive' },
        },
      ],
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
    pagefindIntegration,

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
