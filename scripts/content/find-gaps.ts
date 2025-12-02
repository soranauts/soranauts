#!/usr/bin/env tsx
/**
 * Content Gaps Finder
 * 
 * Analyzes search logs, 404 patterns, and insights data to identify
 * missing glossary terms. Outputs a prioritized list.
 * 
 * Usage: pnpm content:gaps [--output csv|md]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const GLOSSARY_DATA_PATH = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');
const OUTPUT_PATH = path.join(ROOT, 'content-gaps-report');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GapEntry {
  term: string;
  source: 'search' | '404' | 'related' | 'manual';
  count: number;
  priority: 'P1' | 'P2' | 'P3';
  suggestedCategory: string;
  notes: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Known Gaps (curated list)
// ─────────────────────────────────────────────────────────────────────────────

const KNOWN_GAPS: GapEntry[] = [
  // DeFi Fundamentals
  { term: 'Liquidity Mining', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'DeFi', notes: 'Core DeFi concept' },
  { term: 'Yield Farming', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'DeFi', notes: 'Core DeFi concept' },
  { term: 'Impermanent Loss', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'DeFi', notes: 'LP risk education' },
  { term: 'Slippage', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'DeFi', notes: 'Trading concept' },
  { term: 'Gas Fees', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'Technology', notes: 'Blockchain basics' },
  
  // Security
  { term: 'Wallet', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'Infrastructure', notes: 'User onboarding' },
  { term: 'Private Key', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'Security', notes: 'Security education' },
  { term: 'Public Key', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'Security', notes: 'Security education' },
  { term: 'Seed Phrase', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'Security', notes: 'Security education' },
  { term: 'Hardware Wallet', source: 'manual', count: 0, priority: 'P1', suggestedCategory: 'Security', notes: 'Security best practice' },
  
  // Advanced DeFi
  { term: 'Order Book', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'DeFi', notes: 'Trading mechanics' },
  { term: 'Market Maker', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'DeFi', notes: 'Trading mechanics' },
  { term: 'Arbitrage', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'DeFi', notes: 'Trading strategy' },
  { term: 'Flash Loan', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'DeFi', notes: 'Advanced DeFi' },
  { term: 'Oracle', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'Technology', notes: 'Data feeds' },
  
  // Tokens
  { term: 'Stablecoin', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'Tokens', notes: 'Token type' },
  { term: 'Wrapped Token', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'Tokens', notes: 'Cross-chain' },
  
  // Interoperability
  { term: 'Bridge', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'Interoperability', notes: 'Cross-chain' },
  { term: 'Cross-Chain', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'Interoperability', notes: 'Multi-chain' },
  { term: 'Relay Chain', source: 'manual', count: 0, priority: 'P2', suggestedCategory: 'Technology', notes: 'Polkadot' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Analysis
// ─────────────────────────────────────────────────────────────────────────────

function loadExistingSlugs(): Set<string> {
  const slugs = new Set<string>();
  
  try {
    const data = JSON.parse(fs.readFileSync(GLOSSARY_DATA_PATH, 'utf-8'));
    for (const term of data.terms || []) {
      slugs.add(term.slug.toLowerCase());
      slugs.add(term.title.toLowerCase());
    }
  } catch {
    console.warn('⚠️ Could not load glossary data');
  }
  
  return slugs;
}

function findMissingRelatedTerms(): GapEntry[] {
  const gaps: GapEntry[] = [];
  const existingSlugs = loadExistingSlugs();
  
  try {
    const data = JSON.parse(fs.readFileSync(GLOSSARY_DATA_PATH, 'utf-8'));
    const relatedCounts = new Map<string, number>();
    
    for (const term of data.terms || []) {
      if (term.related) {
        for (const related of term.related) {
          const normalized = related.toLowerCase().replace(/\s+/g, '');
          if (!existingSlugs.has(normalized)) {
            relatedCounts.set(related, (relatedCounts.get(related) || 0) + 1);
          }
        }
      }
    }
    
    for (const [term, count] of relatedCounts) {
      if (count >= 2) { // Referenced by 2+ terms
        gaps.push({
          term,
          source: 'related',
          count,
          priority: count >= 5 ? 'P1' : count >= 3 ? 'P2' : 'P3',
          suggestedCategory: 'Technology',
          notes: `Referenced by ${count} existing terms`,
        });
      }
    }
  } catch {
    console.warn('⚠️ Could not analyze related terms');
  }
  
  return gaps;
}

// ─────────────────────────────────────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────────────────────────────────────

function generateMarkdown(gaps: GapEntry[]): string {
  const sorted = [...gaps].sort((a, b) => {
    const priorityOrder = { P1: 0, P2: 1, P3: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority] || b.count - a.count;
  });

  let md = `# Content Gaps Report

Generated: ${new Date().toISOString()}

## Summary

| Priority | Count |
|----------|-------|
| P1 (High) | ${sorted.filter(g => g.priority === 'P1').length} |
| P2 (Medium) | ${sorted.filter(g => g.priority === 'P2').length} |
| P3 (Low) | ${sorted.filter(g => g.priority === 'P3').length} |
| **Total** | **${sorted.length}** |

## Gaps by Priority

### P1 — High Priority

| Term | Source | Count | Category | Notes |
|------|--------|-------|----------|-------|
`;

  for (const gap of sorted.filter(g => g.priority === 'P1')) {
    md += `| ${gap.term} | ${gap.source} | ${gap.count} | ${gap.suggestedCategory} | ${gap.notes} |\n`;
  }

  md += `
### P2 — Medium Priority

| Term | Source | Count | Category | Notes |
|------|--------|-------|----------|-------|
`;

  for (const gap of sorted.filter(g => g.priority === 'P2')) {
    md += `| ${gap.term} | ${gap.source} | ${gap.count} | ${gap.suggestedCategory} | ${gap.notes} |\n`;
  }

  md += `
### P3 — Low Priority

| Term | Source | Count | Category | Notes |
|------|--------|-------|----------|-------|
`;

  for (const gap of sorted.filter(g => g.priority === 'P3')) {
    md += `| ${gap.term} | ${gap.source} | ${gap.count} | ${gap.suggestedCategory} | ${gap.notes} |\n`;
  }

  md += `
---

## Sources

- **manual**: Curated list of known gaps
- **related**: Terms referenced in existing content but not defined
- **search**: Terms users searched for but didn't find
- **404**: Broken links detected in logs

---

*Run \`pnpm content:gaps\` to regenerate this report.*
`;

  return md;
}

function generateCSV(gaps: GapEntry[]): string {
  const headers = ['Term', 'Source', 'Count', 'Priority', 'Category', 'Notes'];
  const rows = gaps.map(g => [
    g.term,
    g.source,
    String(g.count),
    g.priority,
    g.suggestedCategory,
    g.notes,
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const outputFormat = process.argv.includes('--output')
    ? process.argv[process.argv.indexOf('--output') + 1]
    : 'md';

  console.log('\n🔍 Finding Content Gaps\n');

  // Collect gaps from all sources
  const gaps: GapEntry[] = [
    ...KNOWN_GAPS,
    ...findMissingRelatedTerms(),
  ];

  // Deduplicate
  const seen = new Set<string>();
  const uniqueGaps = gaps.filter(g => {
    const key = g.term.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`📊 Found ${uniqueGaps.length} content gaps\n`);

  // Generate output
  if (outputFormat === 'csv') {
    const csv = generateCSV(uniqueGaps);
    const csvPath = `${OUTPUT_PATH}.csv`;
    fs.writeFileSync(csvPath, csv, 'utf-8');
    console.log(`📝 CSV saved to: ${csvPath}\n`);
  } else {
    const md = generateMarkdown(uniqueGaps);
    const mdPath = `${OUTPUT_PATH}.md`;
    fs.writeFileSync(mdPath, md, 'utf-8');
    console.log(`📝 Report saved to: ${mdPath}\n`);
  }

  // Print summary
  const p1 = uniqueGaps.filter(g => g.priority === 'P1').length;
  const p2 = uniqueGaps.filter(g => g.priority === 'P2').length;
  const p3 = uniqueGaps.filter(g => g.priority === 'P3').length;

  console.log('📋 Summary:');
  console.log(`   P1 (High):   ${p1}`);
  console.log(`   P2 (Medium): ${p2}`);
  console.log(`   P3 (Low):    ${p3}`);
  console.log('');
}

main().catch((err) => {
  console.error('❌ Gap analysis failed:', err);
  process.exit(1);
});


