#!/usr/bin/env tsx
/**
 * Features → Glossary Link Auditor
 * 
 * Crawls feature pages and detects broken /glossary/* links.
 * Maps broken links to canonical slugs using the minimal index.
 * 
 * Usage: 
 *   pnpm audit:features-links              # Read-only audit
 *   pnpm audit:features-links --write      # Apply fixes
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const GLOSSARY_DATA_PATH = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');
const ALIASES_PATH = path.join(ROOT, 'apps/web/public/data/glossary.aliases.v2025.json');
const PAGES_DIR = path.join(ROOT, 'apps/web/src/pages');
const CONTENT_DIR = path.join(ROOT, 'apps/web/src/content');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  slug: string;
  title: string;
}

interface LinkIssue {
  file: string;
  line: number;
  brokenLink: string;
  suggestedFix: string | null;
  confidence: 'high' | 'medium' | 'low';
}

interface AuditResult {
  totalFiles: number;
  totalLinks: number;
  brokenLinks: number;
  issues: LinkIssue[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Loading
// ─────────────────────────────────────────────────────────────────────────────

function loadGlossaryData(): { slugs: Set<string>; terms: GlossaryTerm[]; aliases: Map<string, string> } {
  const slugs = new Set<string>();
  const terms: GlossaryTerm[] = [];
  const aliases = new Map<string, string>();

  try {
    const data = JSON.parse(fs.readFileSync(GLOSSARY_DATA_PATH, 'utf-8'));
    for (const term of data.terms || []) {
      slugs.add(term.slug);
      terms.push({ slug: term.slug, title: term.title });
    }
  } catch {
    console.warn('⚠️ Could not load glossary data');
  }

  try {
    const aliasData = JSON.parse(fs.readFileSync(ALIASES_PATH, 'utf-8'));
    for (const alias of aliasData.aliases || []) {
      aliases.set(alias.alias, alias.target);
    }
  } catch {
    console.warn('⚠️ Could not load alias data');
  }

  return { slugs, terms, aliases };
}

// ─────────────────────────────────────────────────────────────────────────────
// Link Detection
// ─────────────────────────────────────────────────────────────────────────────

function findGlossaryLinks(content: string): Array<{ link: string; line: number }> {
  const links: Array<{ link: string; line: number }> = [];
  const lines = content.split('\n');
  
  // Match various link patterns
  const patterns = [
    /href=["']\/glossary\/([^"'#?]+)/g,
    /\[.*?\]\(\/glossary\/([^)#?]+)\)/g,
    /to=["']\/glossary\/([^"'#?]+)/g,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(line)) !== null) {
        links.push({ link: match[1], line: i + 1 });
      }
    }
  }

  return links;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slug Matching
// ─────────────────────────────────────────────────────────────────────────────

function findBestMatch(brokenSlug: string, terms: GlossaryTerm[], aliases: Map<string, string>): { slug: string; confidence: 'high' | 'medium' | 'low' } | null {
  const normalized = brokenSlug.toLowerCase().replace(/[-_\s]/g, '');
  
  // Check aliases first
  if (aliases.has(brokenSlug)) {
    return { slug: aliases.get(brokenSlug)!, confidence: 'high' };
  }
  
  // Exact match
  const exactMatch = terms.find(t => t.slug === normalized);
  if (exactMatch) {
    return { slug: exactMatch.slug, confidence: 'high' };
  }
  
  // Title match
  const titleMatch = terms.find(t => 
    t.title.toLowerCase().replace(/[-_\s]/g, '') === normalized
  );
  if (titleMatch) {
    return { slug: titleMatch.slug, confidence: 'high' };
  }
  
  // Partial match
  const partialMatches = terms.filter(t => 
    t.slug.includes(normalized) || normalized.includes(t.slug) ||
    t.title.toLowerCase().includes(brokenSlug.toLowerCase())
  );
  
  if (partialMatches.length === 1) {
    return { slug: partialMatches[0].slug, confidence: 'medium' };
  }
  
  if (partialMatches.length > 1) {
    // Return the closest length match
    partialMatches.sort((a, b) => 
      Math.abs(a.slug.length - normalized.length) - Math.abs(b.slug.length - normalized.length)
    );
    return { slug: partialMatches[0].slug, confidence: 'low' };
  }
  
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit
// ─────────────────────────────────────────────────────────────────────────────

async function auditFiles(): Promise<AuditResult> {
  const { slugs, terms, aliases } = loadGlossaryData();
  
  // Find all files to audit
  const files = await glob([
    `${PAGES_DIR}/**/*.astro`,
    `${PAGES_DIR}/**/*.tsx`,
    `${CONTENT_DIR}/**/*.mdx`,
    `${CONTENT_DIR}/**/*.md`,
  ]);

  const result: AuditResult = {
    totalFiles: files.length,
    totalLinks: 0,
    brokenLinks: 0,
    issues: [],
  };

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const links = findGlossaryLinks(content);
    
    result.totalLinks += links.length;
    
    for (const { link, line } of links) {
      if (!slugs.has(link) && !aliases.has(link)) {
        result.brokenLinks++;
        
        const match = findBestMatch(link, terms, aliases);
        
        result.issues.push({
          file: path.relative(ROOT, file),
          line,
          brokenLink: link,
          suggestedFix: match?.slug || null,
          confidence: match?.confidence || 'low',
        });
      }
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Patch Generation
// ─────────────────────────────────────────────────────────────────────────────

function generatePatch(issues: LinkIssue[]): string {
  let patch = `# Glossary Link Fixes

Generated: ${new Date().toISOString()}

## Summary

- Total broken links: ${issues.length}
- Auto-fixable (high confidence): ${issues.filter(i => i.confidence === 'high').length}
- Manual review needed: ${issues.filter(i => i.confidence !== 'high').length}

## Fixes

`;

  // Group by file
  const byFile = new Map<string, LinkIssue[]>();
  for (const issue of issues) {
    const existing = byFile.get(issue.file) || [];
    existing.push(issue);
    byFile.set(issue.file, existing);
  }

  for (const [file, fileIssues] of byFile) {
    patch += `### ${file}\n\n`;
    
    for (const issue of fileIssues) {
      const confidenceEmoji = issue.confidence === 'high' ? '✅' : issue.confidence === 'medium' ? '⚠️' : '❓';
      patch += `- Line ${issue.line}: \`/glossary/${issue.brokenLink}\`\n`;
      if (issue.suggestedFix) {
        patch += `  ${confidenceEmoji} Suggested: \`/glossary/${issue.suggestedFix}\`\n`;
      } else {
        patch += `  ❌ No match found - manual fix required\n`;
      }
    }
    patch += '\n';
  }

  return patch;
}

function applyFixes(issues: LinkIssue[]): number {
  let fixedCount = 0;
  
  // Group high-confidence fixes by file
  const highConfidenceFixes = issues.filter(i => i.confidence === 'high' && i.suggestedFix);
  const byFile = new Map<string, LinkIssue[]>();
  
  for (const issue of highConfidenceFixes) {
    const existing = byFile.get(issue.file) || [];
    existing.push(issue);
    byFile.set(issue.file, existing);
  }

  for (const [file, fileIssues] of byFile) {
    const filePath = path.join(ROOT, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    for (const issue of fileIssues) {
      const oldPattern = `/glossary/${issue.brokenLink}`;
      const newPattern = `/glossary/${issue.suggestedFix}`;
      
      if (content.includes(oldPattern)) {
        content = content.replace(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern);
        fixedCount++;
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  return fixedCount;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const writeMode = process.argv.includes('--write');
  
  console.log('\n🔍 Glossary Link Auditor\n');
  console.log(`   Mode: ${writeMode ? 'Write (apply fixes)' : 'Read-only (audit)'}\n`);

  const result = await auditFiles();

  console.log('📊 Audit Results:');
  console.log(`   Files scanned: ${result.totalFiles}`);
  console.log(`   Links found: ${result.totalLinks}`);
  console.log(`   Broken links: ${result.brokenLinks}`);
  console.log('');

  if (result.issues.length === 0) {
    console.log('✅ No broken glossary links found!\n');
    return;
  }

  // Generate patch
  const patch = generatePatch(result.issues);
  const patchPath = path.join(ROOT, 'glossary-link-fixes.md');
  fs.writeFileSync(patchPath, patch, 'utf-8');
  console.log(`📝 Patch proposal saved to: ${patchPath}\n`);

  // Print summary by confidence
  const highConf = result.issues.filter(i => i.confidence === 'high');
  const medConf = result.issues.filter(i => i.confidence === 'medium');
  const lowConf = result.issues.filter(i => i.confidence === 'low');

  console.log('📋 Issues by confidence:');
  console.log(`   ✅ High (auto-fixable): ${highConf.length}`);
  console.log(`   ⚠️  Medium (review): ${medConf.length}`);
  console.log(`   ❓ Low (manual): ${lowConf.length}`);
  console.log('');

  if (writeMode) {
    console.log('🔧 Applying high-confidence fixes...\n');
    const fixedCount = applyFixes(result.issues);
    console.log(`✅ Applied ${fixedCount} fixes\n`);
    
    if (medConf.length + lowConf.length > 0) {
      console.log(`⚠️  ${medConf.length + lowConf.length} issues require manual review.\n`);
      console.log(`   See: ${patchPath}\n`);
    }
  } else {
    console.log('💡 Run with --write to apply high-confidence fixes.\n');
  }
}

main().catch((err) => {
  console.error('❌ Audit failed:', err);
  process.exit(1);
});


