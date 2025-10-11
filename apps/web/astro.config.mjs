import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
// import icon from 'astro-icon';
import tasks from './src/utils/tasks';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter.mjs';
import { loadGlossaryAutoLinkPlugin } from './src/utils/glossary-auto-link.mjs';

// Load the glossary auto-link plugin
console.log('🔗 Loading glossary auto-link plugin in config...');
const glossaryAutoLinkPlugin = await loadGlossaryAutoLinkPlugin();
console.log('🔗 Plugin loaded successfully in config');

import { ANALYTICS, SITE } from './src/utils/config.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  ANALYTICS.vendors.googleAnalytics.id && ANALYTICS.vendors.googleAnalytics.partytown
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  site: SITE.site,
  base: SITE.base,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  output: 'static',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    react(),
    // icon({
    //   include: {
    //     tabler: ['*'],
    //     'flat-color-icons': [
    //       'template',
    //       'gallery',
    //       'approval',
    //       'document',
    //       'advertising',
    //       'currency-exchange',
    //       'voice-presentation',
    //       'business-contact',
    //       'database',
    //     ],
    //   },
    // }),

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
