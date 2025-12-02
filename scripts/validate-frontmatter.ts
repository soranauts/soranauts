#!/usr/bin/env tsx
/**
 * Front-matter Validator Script
 * 
 * Validates glossary MDX files against the schema.
 * Reports: missing/invalid fields, long summaries, schema violations.
 * 
 * Usage: pnpm content:validate
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'apps/web/src/content/glossary');

// ─────────────────────────────────────────────────────────────────────────────
// Validation Schema (plain TypeScript)
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
  // Extended categories for Nexus Architecture
  'Nexus Architecture',
  'Nexus Core',
  'Nexus Consensus',
  'Nexus Data',
  'Nexus Execution',
  'Nexus Identity',
  'Nexus Security',
  'Nexus Cryptography',
  'Nexus Networking',
  'Nexus Storage',
]);

interface GlossaryFrontmatter {
  title: string;
  slug: string;
  category: string;
  summary: string;
  tagline?: string;
  tags?: string[];
  related?: string[];
  aliases?: string[];
  deprecated?: boolean;
  deprecatedReason?: string;
  seeAlso?: string;
  updatedAt?: string;
}

interface SchemaError {
  field: string;
  message: string;
}

function validateSchema(data: Record<string, unknown>): SchemaError[] {
  const errors: SchemaError[] = [];
  
  // Required fields
  if (!data.title || typeof data.title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required and must be a string' });
  } else if (data.title.length < 2 || data.title.length > 100) {
    errors.push({ field: 'title', message: 'Title must be 2-100 characters' });
  }
  
  if (!data.slug || typeof data.slug !== 'string') {
    errors.push({ field: 'slug', message: 'Slug is required and must be a string' });
  } else if (!/^[a-z0-9]+$/.test(data.slug)) {
    errors.push({ field: 'slug', message: 'Slug must be lowercase alphanumeric only' });
  } else if (data.slug.length < 2 || data.slug.length > 60) {
    errors.push({ field: 'slug', message: 'Slug must be 2-60 characters' });
  }
  
  if (!data.category || typeof data.category !== 'string') {
    errors.push({ field: 'category', message: 'Category is required and must be a string' });
  }
  // Note: Category validation is lenient - allows any category string
  // The generator handles normalization
  
  if (!data.summary || typeof data.summary !== 'string') {
    errors.push({ field: 'summary', message: 'Summary is required and must be a string' });
  } else if (data.summary.length < 20) {
    errors.push({ field: 'summary', message: 'Summary must be at least 20 characters' });
  } else if (data.summary.length > 300) {
    errors.push({ field: 'summary', message: `Summary too long (${data.summary.length} chars, max 300)` });
  }
  
  // Optional fields
  if (data.tagline !== undefined) {
    if (typeof data.tagline !== 'string') {
      errors.push({ field: 'tagline', message: 'Tagline must be a string' });
    } else if (data.tagline.length < 10 || data.tagline.length > 150) {
      errors.push({ field: 'tagline', message: 'Tagline must be 10-150 characters' });
    }
  }
  
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array' });
    } else if (data.tags.length > 10) {
      errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' });
    }
  }
  
  if (data.related !== undefined) {
    if (!Array.isArray(data.related)) {
      errors.push({ field: 'related', message: 'Related must be an array' });
    }
    // Note: Related slugs validation is lenient - allows human-readable names
    // that will be normalized by the generator
  }
  
  // Deprecated requires reason
  if (data.deprecated === true && !data.deprecatedReason) {
    errors.push({ field: 'deprecatedReason', message: 'deprecatedReason is required when deprecated is true' });
  }
  
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ValidationError {
  file: string;
  slug: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

// ─────────────────────────────────────────────────────────────────────────────
// Parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseFrontMatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result: Record<string, unknown> = {};

  // Simple YAML parser for front-matter
  const lines = yaml.split('\n');
  let currentKey: string | null = null;
  let currentArray: string[] | null = null;

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // Check for array item
    if (line.match(/^\s+-\s/)) {
      const value = line.replace(/^\s+-\s/, '').trim().replace(/^["']|["']$/g, '');
      if (currentKey && currentArray) {
        currentArray.push(value);
      }
      continue;
    }

    // Check for key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      // Save previous array if any
      if (currentKey && currentArray) {
        result[currentKey] = currentArray;
      }

      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();

      if (value === '' || value === '[]') {
        // Start of array or empty array
        currentArray = [];
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline array
        const items = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        result[currentKey] = items.filter(Boolean);
        currentKey = null;
        currentArray = null;
      } else if (value === 'true') {
        result[currentKey] = true;
        currentKey = null;
        currentArray = null;
      } else if (value === 'false') {
        result[currentKey] = false;
        currentKey = null;
        currentArray = null;
      } else {
        // String value
        result[currentKey] = value.replace(/^["']|["']$/g, '');
        currentKey = null;
        currentArray = null;
      }
    }
  }

  // Save final array if any
  if (currentKey && currentArray) {
    result[currentKey] = currentArray;
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

function validateFile(filePath: string, content: string, allSlugs: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];
  const filename = path.basename(filePath);
  
  const fm = parseFrontMatter(content);
  if (!fm) {
    errors.push({
      file: filename,
      slug: filename.replace('.mdx', ''),
      field: 'frontmatter',
      message: 'Missing or invalid front-matter block',
      severity: 'error',
    });
    return errors;
  }

  // Validate against schema
  const schemaErrors = validateSchema(fm);
  
  if (schemaErrors.length > 0) {
    for (const issue of schemaErrors) {
      errors.push({
        file: filename,
        slug: (fm.slug as string) || filename.replace('.mdx', ''),
        field: issue.field,
        message: issue.message,
        severity: 'error',
      });
    }
    return errors;
  }

  const data = fm as GlossaryFrontmatter;

  // Additional validations

  // Check title case (first letter of each word uppercase, except small words)
  const smallWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in', 'of']);
  const words = data.title.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Skip acronyms (all uppercase)
    if (word === word.toUpperCase() && word.length > 1) continue;
    // Skip small words (except first word)
    if (i > 0 && smallWords.has(word.toLowerCase())) continue;
    // Check first letter is uppercase
    if (word[0] !== word[0].toUpperCase()) {
      errors.push({
        file: filename,
        slug: data.slug,
        field: 'title',
        message: `Title should be Title Case: "${word}" should start with uppercase`,
        severity: 'warning',
      });
      break;
    }
  }

  // Check related terms exist
  if (data.related) {
    for (const relatedSlug of data.related) {
      if (!allSlugs.has(relatedSlug)) {
        errors.push({
          file: filename,
          slug: data.slug,
          field: 'related',
          message: `Related term "${relatedSlug}" does not exist`,
          severity: 'warning',
        });
      }
    }
  }

  // Check tags are sorted
  if (data.tags && data.tags.length > 1) {
    const sorted = [...data.tags].sort((a, b) => a.localeCompare(b));
    if (JSON.stringify(data.tags) !== JSON.stringify(sorted)) {
      errors.push({
        file: filename,
        slug: data.slug,
        field: 'tags',
        message: 'Tags should be sorted alphabetically',
        severity: 'warning',
      });
    }
  }

  // Check for missing tagline (warning only)
  if (!data.tagline) {
    errors.push({
      file: filename,
      slug: data.slug,
      field: 'tagline',
      message: 'Missing tagline (recommended for Quick-View)',
      severity: 'warning',
    });
  }

  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Validating glossary front-matter...\n');

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  console.log(`📂 Found ${files.length} MDX files\n`);

  // First pass: collect all slugs
  const allSlugs = new Set<string>();
  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontMatter(content);
    if (fm?.slug) {
      allSlugs.add(fm.slug as string);
    }
  }

  // Second pass: validate
  const allErrors: ValidationError[] = [];
  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const errors = validateFile(filePath, content, allSlugs);
    allErrors.push(...errors);
  }

  // Report
  const errorCount = allErrors.filter((e) => e.severity === 'error').length;
  const warningCount = allErrors.filter((e) => e.severity === 'warning').length;

  if (allErrors.length === 0) {
    console.log('✅ All front-matter is valid!\n');
    process.exit(0);
  }

  console.log('📊 Results:');
  console.log(`   🔴 Errors:   ${errorCount}`);
  console.log(`   🟡 Warnings: ${warningCount}\n`);

  // Group by severity
  const errors = allErrors.filter((e) => e.severity === 'error');
  const warnings = allErrors.filter((e) => e.severity === 'warning');

  if (errors.length > 0) {
    console.log('🔴 Errors:\n');
    for (const err of errors) {
      console.log(`   ${err.file} (${err.slug})`);
      console.log(`     └─ ${err.field}: ${err.message}\n`);
    }
  }

  if (warnings.length > 0 && process.argv.includes('--verbose')) {
    console.log('🟡 Warnings:\n');
    for (const warn of warnings) {
      console.log(`   ${warn.file} (${warn.slug})`);
      console.log(`     └─ ${warn.field}: ${warn.message}\n`);
    }
  } else if (warnings.length > 0) {
    console.log(`ℹ️  Run with --verbose to see ${warningCount} warnings\n`);
  }

  if (errorCount > 0) {
    console.log('❌ Validation failed with errors\n');
    console.log('💡 Run `pnpm content:fix` to auto-fix some issues\n');
    process.exit(1);
  }

  console.log('✅ Validation passed (with warnings)\n');
}

main().catch((err) => {
  console.error('❌ Validation failed:', err);
  process.exit(1);
});

