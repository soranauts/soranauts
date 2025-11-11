#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const glossaryAstroPath = join(__dirname, '../src/pages/glossary.astro');

function switchToTypesense() {
  let content = readFileSync(glossaryAstroPath, 'utf8');

  const fallbackImport = "import GlossarySearchFallback from '~/components/glossary/GlossarySearchFallback';";
  const typesenseImport = "import GlossarySearch from '~/components/glossary/GlossarySearch';";
  const fallbackMarkup = '<!-- React Glossary Search (Fallback) -->\n          <GlossarySearchFallback client:load />';
  const typesenseMarkup = '<!-- React InstantSearch Glossary -->\n          <GlossarySearch client:load />';

  if (content.includes(fallbackImport)) {
    content = content.replace(fallbackImport, typesenseImport);
  }

  if (content.includes(fallbackMarkup)) {
    content = content.replace(fallbackMarkup, typesenseMarkup);
  }

  writeFileSync(glossaryAstroPath, content);
  console.log('✅ Switched to Typesense InstantSearch');
}

function switchToFallback() {
  let content = readFileSync(glossaryAstroPath, 'utf8');

  const fallbackImport = "import GlossarySearchFallback from '~/components/glossary/GlossarySearchFallback';";
  const typesenseImport = "import GlossarySearch from '~/components/glossary/GlossarySearch';";
  const fallbackMarkup = '<!-- React Glossary Search (Fallback) -->\n          <GlossarySearchFallback client:load />';
  const typesenseMarkup = '<!-- React InstantSearch Glossary -->\n          <GlossarySearch client:load />';

  if (content.includes(typesenseImport)) {
    content = content.replace(typesenseImport, fallbackImport);
  }

  if (content.includes(typesenseMarkup)) {
    content = content.replace(typesenseMarkup, fallbackMarkup);
  }

  writeFileSync(glossaryAstroPath, content);
  console.log('✅ Switched to Fallback Search');
}

const mode = process.argv[2];

if (mode === 'typesense') {
  switchToTypesense();
} else if (mode === 'fallback') {
  switchToFallback();
} else {
  console.log('Usage: node scripts/switch-glossary.js [typesense|fallback]');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/switch-glossary.js typesense  # Use Typesense InstantSearch');
  console.log('  node scripts/switch-glossary.js fallback   # Use fallback search');
}


