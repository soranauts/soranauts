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
import tasks from './src/utils/tasks';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter.mjs';
import { loadGlossaryAutoLinkPlugin } from './src/utils/glossary-auto-link.mjs';

// Load the glossary auto-link plugin
console.log('🔗 Loading glossary auto-link plugin in config...');
const glossaryAutoLinkPlugin = await loadGlossaryAutoLinkPlugin();
console.log('🔗 Plugin loaded successfully in config');

import { ANALYTICS, SITE } from './src/utils/config.ts';
const redirectsJsonPath = path.join(path.dirname(fileURLToPath(import.meta.url)), './src/data/redirects.glossary.json');
const redirectsData = JSON.parse(fs.readFileSync(redirectsJsonPath, 'utf-8'));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  ANALYTICS.vendors.googleAnalytics.id && ANALYTICS.vendors.googleAnalytics.partytown
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

const generatedRedirects = Object.fromEntries(
  (redirectsData?.redirects ?? []).map((entry) => [entry.from, entry.to])
);

const siteRedirects = {
  '/improvements': '/changelog',
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
  legacy: {
    collections: true
  },

  integrations: [
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
