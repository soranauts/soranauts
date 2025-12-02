#!/usr/bin/env tsx
/**
 * Glossary Snapshot Script
 * 
 * Creates a timestamped backup of glossary data files.
 * Designed to run weekly via GitHub Actions.
 * 
 * Usage: pnpm ops:snapshot
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const DATA_DIR = path.join(ROOT, 'apps/web/public/data');
const TERMS_DIR = path.join(DATA_DIR, 'glossary/terms');
const BACKUPS_DIR = path.join(ROOT, 'backups/glossary');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SnapshotManifest {
  timestamp: string;
  version: string;
  files: {
    name: string;
    size: number;
    hash: string;
  }[];
  stats: {
    totalFiles: number;
    totalSize: number;
    canonicalTerms: number;
    aliases: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function getDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

function simpleHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function copyFile(src: string, dest: string): { size: number; hash: string } {
  const content = fs.readFileSync(src, 'utf-8');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, 'utf-8');
  
  return {
    size: Buffer.byteLength(content, 'utf-8'),
    hash: simpleHash(content),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Snapshot
// ─────────────────────────────────────────────────────────────────────────────

function createSnapshot(): SnapshotManifest {
  const dateStr = getDateString();
  const snapshotDir = path.join(BACKUPS_DIR, dateStr);
  
  console.log(`📦 Creating snapshot: ${dateStr}\n`);
  
  // Ensure backup directory exists
  fs.mkdirSync(snapshotDir, { recursive: true });
  
  const manifest: SnapshotManifest = {
    timestamp: new Date().toISOString(),
    version: 'V2025.1.0',
    files: [],
    stats: {
      totalFiles: 0,
      totalSize: 0,
      canonicalTerms: 0,
      aliases: 0,
    },
  };

  // Copy main index files
  const indexFiles = [
    'glossary.v2025.json',
    'glossary.minimal.json',
    'glossary.aliases.v2025.json',
    'glossary.stats.v2025.json',
  ];

  for (const file of indexFiles) {
    const src = path.join(DATA_DIR, file);
    if (fs.existsSync(src)) {
      const dest = path.join(snapshotDir, file);
      const { size, hash } = copyFile(src, dest);
      
      manifest.files.push({ name: file, size, hash });
      manifest.stats.totalFiles++;
      manifest.stats.totalSize += size;
      
      console.log(`   ✓ ${file} (${(size / 1024).toFixed(1)} KB)`);
      
      // Extract stats from main index
      if (file === 'glossary.v2025.json') {
        try {
          const data = JSON.parse(fs.readFileSync(src, 'utf-8'));
          manifest.stats.canonicalTerms = data.terms?.length || 0;
          manifest.stats.aliases = data.aliasCount || 0;
        } catch {
          // Ignore parse errors
        }
      }
    }
  }

  // Copy per-term JSON files
  const termsSnapshotDir = path.join(snapshotDir, 'terms');
  fs.mkdirSync(termsSnapshotDir, { recursive: true });

  if (fs.existsSync(TERMS_DIR)) {
    const termFiles = fs.readdirSync(TERMS_DIR).filter(f => f.endsWith('.json'));
    
    console.log(`\n   Copying ${termFiles.length} term files...`);
    
    for (const file of termFiles) {
      const src = path.join(TERMS_DIR, file);
      const dest = path.join(termsSnapshotDir, file);
      const { size, hash } = copyFile(src, dest);
      
      manifest.files.push({ name: `terms/${file}`, size, hash });
      manifest.stats.totalFiles++;
      manifest.stats.totalSize += size;
    }
    
    console.log(`   ✓ ${termFiles.length} term files copied`);
  }

  // Write manifest
  const manifestPath = path.join(snapshotDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n   ✓ manifest.json`);

  return manifest;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cleanup
// ─────────────────────────────────────────────────────────────────────────────

function cleanupOldSnapshots(keepCount = 4): number {
  if (!fs.existsSync(BACKUPS_DIR)) return 0;
  
  const snapshots = fs.readdirSync(BACKUPS_DIR)
    .filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f))
    .sort()
    .reverse();
  
  let deleted = 0;
  
  for (let i = keepCount; i < snapshots.length; i++) {
    const snapshotPath = path.join(BACKUPS_DIR, snapshots[i]);
    fs.rmSync(snapshotPath, { recursive: true, force: true });
    deleted++;
  }
  
  return deleted;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n📸 Glossary Snapshot Tool\n');

  // Create snapshot
  const manifest = createSnapshot();

  // Cleanup old snapshots (keep last 4 weeks)
  const deleted = cleanupOldSnapshots(4);

  // Summary
  console.log('\n' + '─'.repeat(50));
  console.log('\n📊 Snapshot Summary:');
  console.log(`   Timestamp: ${manifest.timestamp}`);
  console.log(`   Version: ${manifest.version}`);
  console.log(`   Files: ${manifest.stats.totalFiles}`);
  console.log(`   Total Size: ${(manifest.stats.totalSize / 1024).toFixed(1)} KB`);
  console.log(`   Canonical Terms: ${manifest.stats.canonicalTerms}`);
  console.log(`   Aliases: ${manifest.stats.aliases}`);
  
  if (deleted > 0) {
    console.log(`\n🗑️  Cleaned up ${deleted} old snapshot(s)`);
  }

  console.log(`\n✅ Snapshot saved to: backups/glossary/${getDateString()}/\n`);
}

main().catch((err) => {
  console.error('❌ Snapshot failed:', err);
  process.exit(1);
});


