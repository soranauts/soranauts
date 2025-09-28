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
  
  content = content.replace(
    /import GlossarySearchFallback from '~/components\/glossary\/GlossarySearchFallback';/,
    "import GlossarySearch from '~/components/glossary/GlossarySearch';"
  );
  
  content = content.replace(
    /<!-- React Glossary Search \(Fallback\) -->\s*<GlossarySearchFallback client:load \/>/,
    '<!-- React InstantSearch Glossary -->\n          <GlossarySearch client:load />'
  );
  
  writeFileSync(glossaryAstroPath, content);
  console.log('✅ Switched to Typesense InstantSearch');
}

function switchToFallback() {
  let content = readFileSync(glossaryAstroPath, 'utf8');
  
  content = content.replace(
    /import GlossarySearch from '~/components\/glossary\/GlossarySearch';/,
    "import GlossarySearchFallback from '~/components/glossary/GlossarySearchFallback';"
  );
  
  content = content.replace(
    /<!-- React InstantSearch Glossary -->\s*<GlossarySearch client:load \/>/,
    '<!-- React Glossary Search (Fallback) -->\n          <GlossarySearchFallback client:load />'
  );
  
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


