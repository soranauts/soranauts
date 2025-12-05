#!/usr/bin/env npx ts-node
/**
 * Script to add source links to MDX files that are missing them.
 * Assigns links based on category and tags.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GLOSSARY_DIR = path.join(__dirname, '../apps/web/src/content/glossary');

// Source link mappings by category
const CATEGORY_LINKS: Record<string, { label: string; url: string }[]> = {
  'Cryptography': [
    { label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' },
  ],
  'Execution': [
    { label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' },
  ],
  'Consensus & Scheduling': [
    { label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' },
  ],
  'Data Availability': [
    { label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' },
  ],
  'Serialization & Encoding': [
    { label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' },
  ],
  'Networking': [
    { label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' },
  ],
  'Observability & Operations': [
    { label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' },
  ],
  'Developer Experience': [
    { label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' },
  ],
  'Governance': [
    { label: 'SORA Wiki', url: 'https://wiki.sora.org/sora-governance.html' },
  ],
  'Economics': [
    { label: 'SORA Wiki', url: 'https://wiki.sora.org/tokenomics.html' },
  ],
  'Token': [
    { label: 'SORA Wiki', url: 'https://wiki.sora.org/xor.html' },
  ],
  'DeFi': [
    { label: 'Polkaswap Wiki', url: 'https://wiki.sora.org/polkaswap.html' },
  ],
  'Accounts': [
    { label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' },
  ],
};

// Default link for any category
const DEFAULT_LINK = { label: 'SORA Wiki', url: 'https://wiki.sora.org/' };

// Parse frontmatter from MDX file
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string; raw: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const frontmatterStr = match[1];
  const body = match[2];

  // Simple YAML parser for our use case
  const frontmatter: Record<string, any> = {};
  let currentKey = '';
  let currentArray: string[] = [];
  let inArray = false;

  for (const line of frontmatterStr.split('\n')) {
    if (line.match(/^[a-zA-Z]/)) {
      // New top-level key
      if (inArray && currentKey) {
        frontmatter[currentKey] = currentArray;
        currentArray = [];
        inArray = false;
      }
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        if (value) {
          frontmatter[key] = value.replace(/^["']|["']$/g, '');
        } else {
          currentKey = key;
          inArray = true;
        }
      }
    } else if (inArray && line.trim().startsWith('-')) {
      currentArray.push(line.trim().slice(1).trim().replace(/^["']|["']$/g, ''));
    }
  }

  if (inArray && currentKey) {
    frontmatter[currentKey] = currentArray;
  }

  return { frontmatter, body, raw: frontmatterStr };
}

// Add links to MDX file
function addLinksToFile(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already has links
  if (content.includes('links:')) {
    return false;
  }

  const parsed = parseFrontmatter(content);
  if (!parsed) {
    console.error(`Failed to parse: ${filePath}`);
    return false;
  }

  const { frontmatter } = parsed;
  const category = frontmatter.category || '';
  const tags = frontmatter.tags || [];

  // Determine appropriate links
  let links = CATEGORY_LINKS[category] || [DEFAULT_LINK];

  // Check if it's a Nexus term
  if (tags.includes('Nexus Architecture')) {
    links = [{ label: 'Nexus Whitepaper', url: '/documents/sora_nexus_whitepaper.pdf' }];
  }

  // Build links YAML
  const linksYaml = `links:\n${links.map(l => `  - label: "${l.label}"\n    url: "${l.url}"`).join('\n')}`;

  // Insert links before the closing ---
  // Find the end of the frontmatter (the second ---)
  const frontmatterEnd = content.indexOf('---', 4);
  if (frontmatterEnd === -1) {
    return false;
  }

  const newContent = content.slice(0, frontmatterEnd) + linksYaml + '\n' + content.slice(frontmatterEnd);
  fs.writeFileSync(filePath, newContent);
  return true;
}

// Main
function main() {
  const files = fs.readdirSync(GLOSSARY_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => path.join(GLOSSARY_DIR, f));

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    try {
      if (addLinksToFile(file)) {
        added++;
        console.log(`✅ Added links: ${path.basename(file)}`);
      } else {
        skipped++;
      }
    } catch (e) {
      failed++;
      console.error(`❌ Failed: ${path.basename(file)}`, e);
    }
  }

  console.log(`\n📊 Results: ${added} added, ${skipped} skipped, ${failed} failed`);
}

main();
