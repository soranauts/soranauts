#!/usr/bin/env tsx
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, basename, extname } from 'path';
import { createHash } from 'crypto';
import matter from 'gray-matter';
import { Command } from 'commander';
import { glob as globAsync } from 'glob';
import limax from 'limax';
import { env } from './env';
import { normalizeForHash, hashContent } from './utils/text-normalize';
import { kbFrontmatterSchema, kbSourceSchema, type KBFrontmatter } from './types';

const KB_DIR = env.KB_DIR;
const CURATED_DIR = join(KB_DIR, 'curated');

interface MigrationStats {
  processed: number;
  migrated: number;
  skipped: number;
  errors: number;
  errorsList: Array<{ file: string; error: string }>;
}

/**
 * Generate slug from title or filename
 */
function generateSlug(title?: string, filename?: string): string {
  // Try title first
  if (title) {
    const slug = limax(title, { lowercase: true, separator: '-' });
    if (slug && /^[a-z0-9-]+$/.test(slug)) {
      return slug;
    }
  }
  
  // Fall back to filename
  if (filename) {
    const nameWithoutExt = basename(filename, extname(filename));
    const slug = limax(nameWithoutExt, { lowercase: true, separator: '-' });
    if (slug && /^[a-z0-9-]+$/.test(slug)) {
      return slug;
    }
  }
  
  // Last resort: sanitize manually
  const source = title || filename || 'untitled';
  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) || 'untitled';
}

/**
 * Normalize ISO datetime string
 */
function normalizeDatetime(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  
  // If already ISO format, return as-is
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateStr)) {
    return dateStr;
  }
  
  // Try to parse and reformat
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch {
    // Ignore
  }
  
  return dateStr; // Return as-is if can't parse
}

/**
 * Extract snapshot_id from date string or use current date
 */
function extractSnapshotId(dateStr?: string): string {
  if (dateStr) {
    const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) {
      return match[1];
    }
  }
  return new Date().toISOString().split('T')[0];
}

/**
 * Map legacy frontmatter to canonical schema
 */
function migrateFrontmatter(
  legacy: Record<string, any>,
  filepath: string,
  content: string
): Partial<KBFrontmatter> {
  const migrated: Record<string, any> = {};
  
  // Required fields mapping
  migrated.title = legacy.title || basename(filepath, extname(filepath));
  migrated.slug = legacy.slug || generateSlug(legacy.title, filepath);
  migrated.source = legacy.source || inferSourceFromPath(filepath);
  migrated.source_url = legacy.source_url || legacy.sourceUrl || '';
  migrated.publishDate = normalizeDatetime(legacy.publishDate || legacy.published_at || legacy.fetched_at) || new Date().toISOString();
  
  // Content hash - compute if missing
  if (legacy.content_sha256 || legacy.checksum_sha256 || legacy.content_hash) {
    migrated.content_sha256 = legacy.content_sha256 || legacy.checksum_sha256 || legacy.content_hash;
  } else {
    const normalized = normalizeForHash(content);
    migrated.content_sha256 = hashContent(normalized);
  }
  
  // Snapshot ID
  migrated.snapshot_id = legacy.snapshot_id || extractSnapshotId(legacy.publishDate || legacy.fetched_at);
  
  // Optional fields mapping
  if (legacy.updateDate || legacy.updated_at) {
    migrated.updateDate = normalizeDatetime(legacy.updateDate || legacy.updated_at);
  }
  
  if (legacy.source_commit || legacy.sourceCommit) {
    migrated.source_commit = legacy.source_commit || legacy.sourceCommit;
  }
  
  if (legacy.canonical_url || legacy.canonicalUrl) {
    migrated.canonical_url = legacy.canonical_url || legacy.canonicalUrl;
  }
  
  if (legacy.lang || legacy.language) {
    migrated.lang = legacy.lang || legacy.language;
  }
  
  if (legacy.detected_lang || legacy.detectedLang) {
    migrated.detected_lang = legacy.detected_lang || legacy.detectedLang;
  }
  
  if (legacy.lang_confidence !== undefined || legacy.langConfidence !== undefined) {
    migrated.lang_confidence = legacy.lang_confidence ?? legacy.langConfidence;
  }
  
  if (legacy.tags) {
    migrated.tags = Array.isArray(legacy.tags) ? legacy.tags : [legacy.tags];
  }
  
  if (legacy.version) {
    migrated.version = legacy.version;
  }
  
  // License/image_rights mapping
  if (legacy.image_rights) {
    migrated.image_rights = legacy.image_rights;
  } else if (legacy.license) {
    // Map license to image_rights if applicable
    const licenseMap: Record<string, string> = {
      'Medium': 'Medium',
      'SORA Official / Medium': 'SORA Official / Medium',
      'Soramitsu': 'Soramitsu',
      'CC-BY-4.0': 'CC-BY-4.0',
      'Proprietary': 'Proprietary',
    };
    if (licenseMap[legacy.license]) {
      migrated.image_rights = licenseMap[legacy.license];
    } else {
      migrated.license_hint = legacy.license;
    }
  }
  
  if (legacy.retrieved_at || legacy.fetched_at) {
    migrated.retrieved_at = normalizeDatetime(legacy.retrieved_at || legacy.fetched_at);
  }
  
  if (legacy.source_title || legacy.sourceTitle) {
    migrated.source_title = legacy.source_title || legacy.sourceTitle;
  }
  
  if (legacy.embed_model || legacy.embedModel) {
    migrated.embed_model = legacy.embed_model || legacy.embedModel;
  }
  
  if (legacy.embed_dim !== undefined || legacy.embedDim !== undefined) {
    migrated.embed_dim = legacy.embed_dim ?? legacy.embedDim;
  }
  
  if (legacy.file_path || legacy.filePath) {
    migrated.file_path = legacy.file_path || legacy.filePath;
  } else {
    migrated.file_path = relative(KB_DIR, filepath);
  }
  
  if (legacy.license_hint || legacy.licenseHint) {
    migrated.license_hint = legacy.license_hint || legacy.licenseHint;
  }
  
  // Preserve any other fields as optional metadata (but don't include in schema validation)
  // We'll keep them in the frontmatter but they won't be validated
  
  return migrated as Partial<KBFrontmatter>;
}

/**
 * Infer source type from file path
 */
function inferSourceFromPath(filepath: string): string {
  const relPath = relative(KB_DIR, filepath);
  
  // Handle curated/ prefix
  if (relPath.startsWith('curated/')) {
    const curatedPath = relPath.replace('curated/', '');
    if (curatedPath.startsWith('wiki/')) return 'wiki';
    if (curatedPath.startsWith('iroha_docs/')) return 'iroha_docs';
    if (curatedPath.startsWith('soramitsu_site/')) return 'soramitsu';
    if (curatedPath.startsWith('ecosystem_updates/')) return 'update';
    if (curatedPath.startsWith('polkaswap_updates/')) return 'polkaswap_update';
    if (curatedPath.startsWith('fearless_updates/')) return 'fearless_update';
    if (curatedPath.startsWith('tonswap_updates/')) return 'tonswap_update';
    if (curatedPath.startsWith('tonswap_site/')) return 'tonswap_site';
    if (curatedPath.startsWith('articles/')) return 'article';
  }
  
  // Legacy paths (for backward compatibility during migration)
  if (relPath.startsWith('wiki/')) return 'wiki';
  if (relPath.startsWith('iroha_docs/')) return 'iroha_docs';
  if (relPath.startsWith('soramitsu_site/')) return 'soramitsu';
  if (relPath.startsWith('ecosystem_updates/')) return 'update';
  if (relPath.startsWith('polkaswap_updates/')) return 'polkaswap_update';
  if (relPath.startsWith('fearless_updates/')) return 'fearless_update';
  if (relPath.startsWith('tonswap_updates/')) return 'tonswap_update';
  if (relPath.startsWith('tonswap_site/')) return 'tonswap_site';
  if (relPath.startsWith('articles/')) return 'article';
  
  return 'imported';
}

/**
 * Migrate a single file
 */
function migrateFile(filepath: string, dryRun: boolean): { migrated: boolean; error?: string } {
  try {
    const content = readFileSync(filepath, 'utf-8');
    const parsed = matter(content);
    
    // Skip if no frontmatter
    if (!parsed.data || Object.keys(parsed.data).length === 0) {
      return { migrated: false };
    }
    
    // Migrate frontmatter
    const migrated = migrateFrontmatter(parsed.data, filepath, parsed.content);
    
    // Validate against schema (partial validation - only check required fields)
    const validation = kbFrontmatterSchema.safeParse(migrated);
    
    if (!validation.success) {
      return { migrated: false, error: `Validation failed: ${validation.error.message}` };
    }
    
    // Write migrated file
    if (!dryRun) {
      const newContent = matter.stringify(parsed.content, migrated as any);
      writeFileSync(filepath, newContent, 'utf-8');
    }
    
    return { migrated: true };
  } catch (error: any) {
    return { migrated: false, error: error.message };
  }
}

/**
 * Main migration function
 */
async function main() {
  const program = new Command();
  program
    .name('migrate-frontmatter')
    .description('Migrate KB frontmatter to canonical schema')
    .option('--dry-run', 'Show what would be migrated without making changes', false)
    .option('--path <path>', 'Specific file or directory to migrate', CURATED_DIR)
    .parse();
  
  const options = program.opts();
  const dryRun = options.dryRun;
  const targetPath = options.path;
  
  console.log(`Migrating frontmatter in: ${targetPath}`);
  console.log(`Dry run: ${dryRun ? 'YES' : 'NO'}`);
  console.log('');
  
  // Find all markdown files
  const files = await globAsync('**/*.{md,mdx}', {
    cwd: targetPath,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.git/**', '**/snapshots/**', '**/sources/**'],
  });
  
  const stats: MigrationStats = {
    processed: 0,
    migrated: 0,
    skipped: 0,
    errors: 0,
    errorsList: [],
  };
  
  for (const file of files) {
    stats.processed++;
    const result = migrateFile(file, dryRun);
    
    if (result.error) {
      stats.errors++;
      stats.errorsList.push({ file, error: result.error });
      console.error(`✗ ${relative(KB_DIR, file)}: ${result.error}`);
    } else if (result.migrated) {
      stats.migrated++;
      console.log(`✓ ${relative(KB_DIR, file)}`);
    } else {
      stats.skipped++;
    }
  }
  
  console.log('');
  console.log('=== Migration Summary ===');
  console.log(`Processed: ${stats.processed}`);
  console.log(`Migrated: ${stats.migrated}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  
  if (stats.errors > 0) {
    console.log('');
    console.log('Errors:');
    stats.errorsList.forEach(({ file, error }) => {
      console.log(`  ${relative(KB_DIR, file)}: ${error}`);
    });
    process.exit(1);
  }
  
  if (dryRun) {
    console.log('');
    console.log('Dry run complete. Use without --dry-run to apply changes.');
  }
}

main().catch(console.error);

