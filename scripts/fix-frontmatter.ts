#!/usr/bin/env tsx
/**
 * Front-matter Auto-fixer Script
 * 
 * Automatically fixes common front-matter issues:
 * - Title case correction
 * - Category case correction
 * - Tags sorting and deduplication
 * - Strips stray/unknown fields
 * 
 * Usage: pnpm content:fix
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'apps/web/src/content/glossary');

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = new Set([
  'Technology',
  'Governance',
  'Economics',
  'Tokens',
  'DeFi',
  'Infrastructure',
  'Community',
  'Security',
  'Interoperability',
  'Development',
]);

const ALLOWED_FIELDS = new Set([
  'title',
  'slug',
  'category',
  'summary',
  'tagline',
  'tags',
  'related',
  'aliases',
  'deprecated',
  'deprecatedReason',
  'seeAlso',
  'updatedAt',
]);

const SMALL_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor',
  'on', 'at', 'to', 'by', 'in', 'of', 'up', 'as',
]);

const ACRONYMS = new Set([
  'XOR', 'VAL', 'PSWAP', 'KUSD', 'TBCD', 'NFT', 'DeFi', 'DEX', 'AMM',
  'API', 'SDK', 'DAO', 'TBC', 'TVL', 'APY', 'APR', 'LP', 'ETH', 'BTC',
  'SORA', 'EVM', 'IVM', 'HASHI', 'CERES', 'POLKASWAP', 'DOT', 'KSM',
  'ID', 'DA', 'ZK', 'STARK', 'SNARK', 'FRI', 'DEEP', 'CID', 'DSID',
  'VRF', 'WSV', 'TEU', 'QUIC', 'GRPC', 'gRPC', 'JSON', 'HTTP', 'HTTPS',
  'TCP', 'UDP', 'RPC', 'P2P', 'IPFS', 'CID', 'URI', 'URL', 'UUID',
  'SHA', 'AES', 'RSA', 'ECDSA', 'ED25519', 'BLAKE2B', 'KECCAK',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function toTitleCase(str: string): string {
  return str.split(/\s+/).map((word, index) => {
    // Check if it's an acronym (preserve case)
    if (ACRONYMS.has(word.toUpperCase())) {
      return word.toUpperCase();
    }
    // Preserve special cases like gRPC
    if (word === 'gRPC' || word === 'DeFi') {
      return word;
    }
    // Check if word is already all uppercase and > 1 char (likely acronym)
    if (word === word.toUpperCase() && word.length > 1 && /^[A-Z]+$/.test(word)) {
      return word;
    }
    // Check if it's a small word (keep lowercase except first word)
    if (index > 0 && SMALL_WORDS.has(word.toLowerCase())) {
      return word.toLowerCase();
    }
    // Preserve parenthetical acronyms like (TEU), (WSV)
    if (word.startsWith('(') && word.endsWith(')')) {
      const inner = word.slice(1, -1);
      if (ACRONYMS.has(inner.toUpperCase()) || (inner === inner.toUpperCase() && inner.length > 1)) {
        return `(${inner.toUpperCase()})`;
      }
    }
    // Handle hyphenated words
    if (word.includes('-')) {
      return word.split('-').map((part, i) => {
        if (ACRONYMS.has(part.toUpperCase())) {
          return part.toUpperCase();
        }
        if (part === part.toUpperCase() && part.length > 1) {
          return part;
        }
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      }).join('-');
    }
    // Title case: first letter uppercase, rest lowercase
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function normalizeCategory(category: string): string {
  // Try to match against valid categories (case-insensitive)
  for (const valid of VALID_CATEGORIES) {
    if (valid.toLowerCase() === category.toLowerCase()) {
      return valid;
    }
  }
  // If no match, return title-cased version
  return toTitleCase(category);
}

function sortAndDedupeTags(tags: string[]): string[] {
  const unique = [...new Set(tags)];
  return unique.sort((a, b) => a.localeCompare(b));
}

// ─────────────────────────────────────────────────────────────────────────────
// Front-matter Processing
// ─────────────────────────────────────────────────────────────────────────────

interface FixResult {
  file: string;
  fixes: string[];
  changed: boolean;
}

function fixFrontMatter(filePath: string, content: string): { newContent: string; result: FixResult } {
  const filename = path.basename(filePath);
  const result: FixResult = {
    file: filename,
    fixes: [],
    changed: false,
  };

  const match = content.match(/^(---\n)([\s\S]*?)(\n---)/);
  if (!match) {
    return { newContent: content, result };
  }

  const [fullMatch, start, yaml, end] = match;
  const lines = yaml.split('\n');
  const newLines: string[] = [];
  
  let currentKey: string | null = null;
  let currentArrayLines: string[] = [];
  let inArray = false;

  const processArrayField = (key: string, items: string[]): string[] => {
    if (key === 'tags') {
      const sorted = sortAndDedupeTags(items);
      if (JSON.stringify(items) !== JSON.stringify(sorted)) {
        result.fixes.push(`Sorted and deduplicated tags`);
        result.changed = true;
      }
      return sorted;
    }
    return items;
  };

  const flushArray = () => {
    if (currentKey && currentArrayLines.length > 0) {
      // Parse array items
      const items = currentArrayLines.map(line => 
        line.replace(/^\s+-\s/, '').trim().replace(/^["']|["']$/g, '')
      );
      const processed = processArrayField(currentKey, items);
      
      // Rebuild array lines
      newLines.push(`${currentKey}:`);
      for (const item of processed) {
        newLines.push(`  - "${item}"`);
      }
    }
    currentKey = null;
    currentArrayLines = [];
    inArray = false;
  };

  for (const line of lines) {
    // Skip empty lines in arrays
    if (inArray && !line.trim()) {
      continue;
    }

    // Check for array item
    if (line.match(/^\s+-\s/)) {
      currentArrayLines.push(line);
      continue;
    }

    // Flush previous array if we hit a new key
    if (inArray && line.match(/^\w+:/)) {
      flushArray();
    }

    // Check for key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;

      // Check if field is allowed
      if (!ALLOWED_FIELDS.has(key)) {
        result.fixes.push(`Removed unknown field: ${key}`);
        result.changed = true;
        continue;
      }

      // Handle array start
      if (value === '' || value === '[]') {
        currentKey = key;
        currentArrayLines = [];
        inArray = true;
        continue;
      }

      // Handle inline array
      if (value.startsWith('[') && value.endsWith(']')) {
        const items = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        const processed = processArrayField(key, items);
        newLines.push(`${key}:`);
        for (const item of processed) {
          newLines.push(`  - "${item}"`);
        }
        continue;
      }

      // Handle title
      if (key === 'title') {
        const cleanValue = value.replace(/^["']|["']$/g, '');
        const fixed = toTitleCase(cleanValue);
        if (fixed !== cleanValue) {
          result.fixes.push(`Fixed title case: "${cleanValue}" → "${fixed}"`);
          result.changed = true;
        }
        newLines.push(`${key}: "${fixed}"`);
        continue;
      }

      // Handle category
      if (key === 'category') {
        const cleanValue = value.replace(/^["']|["']$/g, '');
        const fixed = normalizeCategory(cleanValue);
        if (fixed !== cleanValue) {
          result.fixes.push(`Fixed category case: "${cleanValue}" → "${fixed}"`);
          result.changed = true;
        }
        newLines.push(`${key}: "${fixed}"`);
        continue;
      }

      // Pass through other fields
      newLines.push(line);
    } else if (!inArray) {
      // Pass through non-key lines (comments, etc.)
      newLines.push(line);
    }
  }

  // Flush final array
  if (inArray) {
    flushArray();
  }

  if (!result.changed) {
    return { newContent: content, result };
  }

  const newYaml = newLines.join('\n');
  const newContent = content.replace(fullMatch, `${start}${newYaml}${end}`);
  
  return { newContent, result };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  
  console.log(`🔧 ${dryRun ? '[DRY RUN] ' : ''}Fixing glossary front-matter...\n`);

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  console.log(`📂 Found ${files.length} MDX files\n`);

  const results: FixResult[] = [];
  let totalFixed = 0;

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const { newContent, result } = fixFrontMatter(filePath, content);
    
    if (result.changed) {
      results.push(result);
      totalFixed++;
      
      if (!dryRun) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
      }
    }
  }

  if (results.length === 0) {
    console.log('✅ No fixes needed!\n');
    return;
  }

  console.log(`📊 ${dryRun ? 'Would fix' : 'Fixed'} ${totalFixed} files:\n`);

  for (const result of results) {
    console.log(`   ${result.file}:`);
    for (const fix of result.fixes) {
      console.log(`     └─ ${fix}`);
    }
    console.log('');
  }

  if (dryRun) {
    console.log('💡 Run without --dry-run to apply fixes\n');
  } else {
    console.log('✅ All fixes applied!\n');
  }
}

main().catch((err) => {
  console.error('❌ Fix failed:', err);
  process.exit(1);
});

