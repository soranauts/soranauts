#!/usr/bin/env tsx
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { glob as globAsync } from 'glob';
import matter from 'gray-matter';
import { Command } from 'commander';
import { env } from './env';
import { kbFrontmatterSchema, kbSourceSchema } from './types';

const KB_DIR = env.KB_DIR;
const CURATED_DIR = join(KB_DIR, 'curated');

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate directory structure
 */
function validateDirectoryStructure(): ValidationResult {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] };
  
  // Check required directories exist
  const requiredDirs = ['curated', 'sources', 'scripts', 'docs'];
  for (const dir of requiredDirs) {
    const dirPath = join(KB_DIR, dir);
    if (!existsSync(dirPath)) {
      result.passed = false;
      result.errors.push(`Required directory missing: ${dir}`);
    }
  }
  
  // Check that curated/ contains expected subdirectories
  if (existsSync(CURATED_DIR)) {
    const curatedDirs = readdirSync(CURATED_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    
    const expectedDirs = ['wiki', 'iroha_docs', 'ecosystem_updates', 'soramitsu_site'];
    for (const expected of expectedDirs) {
      if (!curatedDirs.includes(expected)) {
        result.warnings.push(`Expected curated subdirectory missing: ${expected}`);
      }
    }
  }
  
  // Check that .kb_index exists (or will be created)
  const indexDir = join(KB_DIR, '.kb_index');
  if (!existsSync(indexDir)) {
    result.warnings.push('.kb_index directory does not exist (will be created on first ingestion)');
  }
  
  return result;
}

/**
 * Validate frontmatter schema
 */
function validateFrontmatter(filepath: string): ValidationResult {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] };
  
  try {
    const content = readFileSync(filepath, 'utf-8');
    const parsed = matter(content);
    
    if (!parsed.data || Object.keys(parsed.data).length === 0) {
      result.warnings.push('No frontmatter found');
      return result;
    }
    
    // Validate against schema
    const validation = kbFrontmatterSchema.safeParse(parsed.data);
    
    if (!validation.success) {
      result.passed = false;
      const errors = validation.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      );
      result.errors.push(...errors);
    }
    
    // Additional checks
    const fm = parsed.data as any;
    
    // Check slug format
    if (fm.slug && !/^[a-z0-9-]+$/.test(fm.slug)) {
      result.passed = false;
      result.errors.push(`Invalid slug format: ${fm.slug} (must be kebab-case)`);
    }
    
    // Check source is valid
    if (fm.source && !kbSourceSchema.safeParse(fm.source).success) {
      result.passed = false;
      result.errors.push(`Invalid source: ${fm.source}`);
    }
    
    // Check snapshot_id format
    if (fm.snapshot_id && !/^\d{4}-\d{2}-\d{2}$/.test(fm.snapshot_id)) {
      result.passed = false;
      result.errors.push(`Invalid snapshot_id format: ${fm.snapshot_id} (must be YYYY-MM-DD)`);
    }
    
    // Check content_sha256 length
    if (fm.content_sha256 && fm.content_sha256.length !== 64) {
      result.passed = false;
      result.errors.push(`Invalid content_sha256 length: ${fm.content_sha256.length} (must be 64)`);
    }
    
  } catch (error: any) {
    result.passed = false;
    result.errors.push(`Failed to parse file: ${error.message}`);
  }
  
  return result;
}

/**
 * Check for orphaned files
 */
async function checkOrphanedFiles(): Promise<ValidationResult> {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] };
  
  // Find all markdown files outside curated/
  const allFiles = await globAsync('**/*.{md,mdx}', {
    cwd: KB_DIR,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.git/**', '**/.kb_index/**', '**/snapshots/**', '**/sources/**'],
  });
  
  const orphanedFiles = allFiles.filter(file => {
    const relPath = relative(KB_DIR, file);
    return !relPath.startsWith('curated/') && 
           !relPath.startsWith('scripts/') && 
           !relPath.startsWith('docs/') &&
           !relPath.startsWith('meta/');
  });
  
  if (orphanedFiles.length > 0) {
    result.warnings.push(`Found ${orphanedFiles.length} files outside curated/ directory:`);
    orphanedFiles.forEach(file => {
      result.warnings.push(`  - ${relative(KB_DIR, file)}`);
    });
  }
  
  return result;
}

/**
 * Main validation function
 */
async function main() {
  const program = new Command();
  program
    .name('validate-kb')
    .description('Validate KB structure and frontmatter against KB_STANDARDS.md')
    .option('--strict', 'Treat warnings as errors', false)
    .parse();
  
  const options = program.opts();
  const strict = options.strict;
  
  console.log('Validating Knowledge Base structure and content...\n');
  
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  
  // Validate directory structure
  console.log('1. Validating directory structure...');
  const dirResult = validateDirectoryStructure();
  allErrors.push(...dirResult.errors);
  allWarnings.push(...dirResult.warnings);
  console.log(dirResult.passed ? '   ✓ Passed' : '   ✗ Failed');
  if (dirResult.errors.length > 0) {
    dirResult.errors.forEach(e => console.log(`     ERROR: ${e}`));
  }
  if (dirResult.warnings.length > 0) {
    dirResult.warnings.forEach(w => console.log(`     WARNING: ${w}`));
  }
  console.log('');
  
  // Validate frontmatter
  console.log('2. Validating frontmatter...');
  const curatedFiles = await globAsync('**/*.{md,mdx}', {
    cwd: CURATED_DIR,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.git/**'],
  });
  
  let frontmatterErrors = 0;
  let frontmatterWarnings = 0;
  
  for (const file of curatedFiles.slice(0, 100)) { // Limit to first 100 for performance
    const result = validateFrontmatter(file);
    if (!result.passed) {
      frontmatterErrors++;
      const relPath = relative(KB_DIR, file);
      allErrors.push(`${relPath}: ${result.errors.join('; ')}`);
    }
    if (result.warnings.length > 0) {
      frontmatterWarnings++;
      const relPath = relative(KB_DIR, file);
      result.warnings.forEach(w => allWarnings.push(`${relPath}: ${w}`));
    }
  }
  
  console.log(`   Processed ${curatedFiles.length} files`);
  console.log(`   Errors: ${frontmatterErrors}, Warnings: ${frontmatterWarnings}`);
  console.log('');
  
  // Check for orphaned files
  console.log('3. Checking for orphaned files...');
  const orphanResult = await checkOrphanedFiles();
  allWarnings.push(...orphanResult.warnings);
  if (orphanResult.warnings.length > 0) {
    orphanResult.warnings.forEach(w => console.log(`   WARNING: ${w}`));
  } else {
    console.log('   ✓ No orphaned files found');
  }
  console.log('');
  
  // Summary
  console.log('=== Validation Summary ===');
  console.log(`Errors: ${allErrors.length}`);
  console.log(`Warnings: ${allWarnings.length}`);
  
  if (allErrors.length > 0) {
    console.log('\nErrors:');
    allErrors.slice(0, 10).forEach(e => console.log(`  - ${e}`));
    if (allErrors.length > 10) {
      console.log(`  ... and ${allErrors.length - 10} more`);
    }
  }
  
  if (allWarnings.length > 0 && !strict) {
    console.log('\nWarnings (first 10):');
    allWarnings.slice(0, 10).forEach(w => console.log(`  - ${w}`));
    if (allWarnings.length > 10) {
      console.log(`  ... and ${allWarnings.length - 10} more`);
    }
  }
  
  const failed = allErrors.length > 0 || (strict && allWarnings.length > 0);
  
  if (failed) {
    console.log('\n✗ Validation failed');
    process.exit(1);
  } else {
    console.log('\n✓ Validation passed');
    process.exit(0);
  }
}

main().catch(console.error);

