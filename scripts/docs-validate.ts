#!/usr/bin/env npx tsx
/**
 * Docs Validation Script
 * 
 * Validates all Starlight documentation pages for:
 * - Required frontmatter (title, source)
 * - Archive docs have :::caution callouts
 * - Official docs (source: wiki) have success badges
 * - Technical docs (source: iroha_docs) have note badges
 * 
 * Exit codes:
 * - 0: All validations passed
 * - 1: Validation errors found
 * 
 * Usage: npx tsx scripts/docs-validate.ts
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const DOCS_DIR = 'apps/web/src/content/docs/docs';

interface ValidationError {
  file: string;
  errors: string[];
}

interface FrontmatterData {
  title?: string;
  source?: string;
  sidebar?: {
    badge?: {
      text?: string;
      variant?: string;
    };
  };
}

const results: ValidationError[] = [];
let totalFiles = 0;
let passedFiles = 0;

/**
 * Extract frontmatter from MDX file content
 */
function extractFrontmatter(content: string): FrontmatterData | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const yaml = match[1];
  const data: FrontmatterData = {};
  
  // Extract title
  const titleMatch = yaml.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  if (titleMatch) data.title = titleMatch[1];
  
  // Extract source
  const sourceMatch = yaml.match(/^source:\s*["']?(.+?)["']?\s*$/m);
  if (sourceMatch) data.source = sourceMatch[1];
  
  // Extract sidebar badge
  const badgeTextMatch = yaml.match(/text:\s*["']?(.+?)["']?\s*$/m);
  const badgeVariantMatch = yaml.match(/variant:\s*["']?(.+?)["']?\s*$/m);
  
  if (badgeTextMatch || badgeVariantMatch) {
    data.sidebar = {
      badge: {
        text: badgeTextMatch?.[1],
        variant: badgeVariantMatch?.[1],
      }
    };
  }
  
  return data;
}

/**
 * Get category from file path
 */
function getCategoryFromPath(filePath: string): string {
  const parts = filePath.replace(DOCS_DIR + '/', '').split('/');
  return parts[0] || 'unknown';
}

/**
 * Validate a single MDX file
 */
function validateFile(filePath: string): string[] {
  const errors: string[] = [];
  const content = readFileSync(filePath, 'utf-8');
  const frontmatter = extractFrontmatter(content);
  const category = getCategoryFromPath(filePath);
  
  // Required frontmatter checks
  if (!frontmatter) {
    errors.push('Missing frontmatter block');
    return errors;
  }
  
  if (!frontmatter.title) {
    errors.push('Missing required frontmatter: title');
  }
  
  // Skip source check for index pages (they may not need it)
  const isIndex = filePath.endsWith('index.mdx');
  if (!frontmatter.source && !isIndex) {
    errors.push('Missing required frontmatter: source');
  }
  
  // Category-specific validations
  if (category === 'archive') {
    // Archive docs should have :::caution callout
    if (!content.includes(':::caution')) {
      errors.push('Archive docs must have :::caution Historical Content callout');
    }
    
    // Archive docs should have caution variant badge
    if (frontmatter.sidebar?.badge) {
      if (frontmatter.sidebar.badge.variant !== 'caution') {
        errors.push('Archive docs should have badge variant: caution');
      }
    }
  }
  
  if (category === 'fundamentals' || category === 'products') {
    // Official docs (source: wiki) should have success badge
    if (frontmatter.source === 'wiki') {
      if (!content.includes(':::tip')) {
        errors.push('Official docs (source: wiki) must have :::tip Official Documentation callout');
      }
      
      if (frontmatter.sidebar?.badge) {
        if (frontmatter.sidebar.badge.variant !== 'success') {
          errors.push('Official docs should have badge variant: success');
        }
      }
    }
  }
  
  if (category === 'technical') {
    // Technical docs (source: iroha_docs) should have note badge
    if (frontmatter.source === 'iroha_docs') {
      if (!content.includes(':::note')) {
        errors.push('Technical docs (source: iroha_docs) must have :::note Technical Documentation callout');
      }
      
      if (frontmatter.sidebar?.badge) {
        if (frontmatter.sidebar.badge.variant !== 'note') {
          errors.push('Technical docs should have badge variant: note');
        }
      }
    }
  }
  
  return errors;
}

/**
 * Recursively find all MDX files in a directory
 */
function findMdxFiles(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findMdxFiles(fullPath));
      } else if (entry.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

/**
 * Main validation function
 */
function main(): void {
  console.log('📋 Validating Starlight documentation...\n');
  
  const files = findMdxFiles(DOCS_DIR);
  
  if (files.length === 0) {
    console.log('⚠️  No MDX files found in', DOCS_DIR);
    process.exit(0);
  }
  
  console.log(`Found ${files.length} documentation files\n`);
  
  for (const file of files) {
    totalFiles++;
    const relativePath = relative(process.cwd(), file);
    const errors = validateFile(file);
    
    if (errors.length > 0) {
      results.push({ file: relativePath, errors });
      console.log(`❌ ${relativePath}`);
      errors.forEach(err => console.log(`   └─ ${err}`));
    } else {
      passedFiles++;
      console.log(`✅ ${relativePath}`);
    }
  }
  
  console.log('\n' + '─'.repeat(60));
  console.log(`\n📊 Results: ${passedFiles}/${totalFiles} files passed\n`);
  
  if (results.length > 0) {
    console.log('❌ Validation failed with errors:\n');
    
    // Group by category for summary
    const byCategory: Record<string, number> = {};
    for (const result of results) {
      const category = getCategoryFromPath(result.file);
      byCategory[category] = (byCategory[category] || 0) + 1;
    }
    
    console.log('Errors by category:');
    for (const [category, count] of Object.entries(byCategory)) {
      console.log(`  ${category}: ${count} file(s) with errors`);
    }
    
    process.exit(1);
  }
  
  console.log('✅ All documentation files passed validation!\n');
  process.exit(0);
}

main();
