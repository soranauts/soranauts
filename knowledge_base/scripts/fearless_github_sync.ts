#!/usr/bin/env tsx
import { execa } from 'execa';
import { existsSync, rmSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join, relative, basename, dirname } from 'path';
import matter from 'gray-matter';
import { env } from './env';
import { createProvenance, currentSnapshotId } from './utils/provenance';

const FEARLESS_ANDROID_REPO = 'https://github.com/soramitsu/fearless-Android';
const FEARLESS_IOS_REPO = 'https://github.com/soramitsu/fearless-iOS';
const FEARLESS_ANDROID_DIR = join(env.KB_DIR, 'fearless_github', 'android');
const FEARLESS_IOS_DIR = join(env.KB_DIR, 'fearless_github', 'ios');
const OUTPUT_DIR = join(env.KB_DIR, 'fearless_github');

// Directories to include (release notes, docs, features)
const INCLUDE_PATTERNS = [
  /^README\.md$/i,
  /^CHANGELOG\.md$/i,
  /^RELEASES\.md$/i,
  /^RELEASE_NOTES\.md$/i,
  /changelog/i,
  /release/i,
  /^docs?\//i,
  /\.github\/releases/i,
  /\.github\/RELEASE/i,
  /features/i,
  /feature/i,
];

// Directories to exclude (code)
const EXCLUDE_PATTERNS = [
  /^\.git\//,
  /^\.idea\//,
  /^\.gradle\//,
  /^\.build\//,
  /^build\//,
  /^\.build\//,
  /^app\/src\//,
  /^ios\/Fearless\//,
  /^Fearless\/Sources\//,
  /^\.swiftpm\//,
  /^Pods\//,
  /^Carthage\//,
  /^node_modules\//,
  /\.gradle$/,
  /\.xcodeproj$/,
  /\.xcworkspace$/,
  /\.swift$/,
  /\.kt$/,
  /\.java$/,
  /\.xml$/,
  /\.properties$/,
  /\.json$/,
  /\.lock$/,
  /\.pbxproj$/,
  /\.plist$/,
];

function shouldInclude(path: string, repoRoot: string): boolean {
  const relPath = relative(repoRoot, path);
  
  // Check exclusions first
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(relPath)) {
      return false;
    }
  }
  
  // Check if it's a markdown file
  if (!/\.md$/i.test(path)) {
    return false;
  }
  
  // Check inclusions
  for (const pattern of INCLUDE_PATTERNS) {
    if (pattern.test(relPath)) {
      return true;
    }
  }
  
  // Include any markdown in root or docs directory
  const parts = relPath.split(/[/\\]/);
  if (parts.length <= 2 && /\.md$/i.test(relPath)) {
    return true;
  }
  
  return false;
}

async function syncRepo(repoUrl: string, repoDir: string, repoName: string): Promise<{ commit: string; path: string } | null> {
  console.log(`\nSyncing ${repoName}...`);
  
  mkdirSync(dirname(repoDir), { recursive: true });
  
  const repoExists = existsSync(join(repoDir, '.git'));
  
  if (repoExists) {
    try {
      console.log(`  Repository exists, pulling latest changes...`);
      
      await execa('git', ['fetch', 'origin'], {
        cwd: repoDir,
      });
      
      const { stdout: oldSha } = await execa('git', ['rev-parse', 'HEAD'], {
        cwd: repoDir,
      });
      
      // Try main branch first, fall back to master
      try {
        await execa('git', ['reset', '--hard', 'origin/main'], {
          cwd: repoDir,
        });
      } catch {
        await execa('git', ['reset', '--hard', 'origin/master'], {
          cwd: repoDir,
        });
      }
      
      const { stdout: headSha } = await execa('git', ['rev-parse', 'HEAD'], {
        cwd: repoDir,
      });
      
      if (oldSha.trim() === headSha.trim()) {
        console.log(`  ✓ ${repoName} up to date (HEAD: ${headSha.trim().substring(0, 12)})`);
      } else {
        console.log(`  ✓ Updated ${repoName} (${oldSha.trim().substring(0, 12)} → ${headSha.trim().substring(0, 12)})`);
      }
      
      return {
        commit: headSha.trim(),
        path: repoDir,
      };
    } catch (error: any) {
      console.error(`  Failed to pull updates: ${error.message}`);
      console.log(`  Attempting fresh clone...`);
    }
  }
  
  if (existsSync(repoDir)) {
    console.log(`  Removing existing ${repoName} directory...`);
    rmSync(repoDir, { recursive: true, force: true });
  }
  
  try {
    console.log(`  Cloning ${repoUrl}...`);
    await execa('git', [
      'clone',
      '--depth', '1',
      '--filter=blob:none',
      repoUrl,
      repoDir,
    ]);
    
    const { stdout: headSha } = await execa('git', ['rev-parse', 'HEAD'], {
      cwd: repoDir,
    });
    
    console.log(`  ✓ Cloned ${repoName} (HEAD: ${headSha.trim().substring(0, 12)})`);
    
    return {
      commit: headSha.trim(),
      path: repoDir,
    };
  } catch (error: any) {
    console.error(`  Failed to sync ${repoName}:`, error.message);
    return null;
  }
}

function findMarkdownFiles(rootDir: string, currentPath: string = rootDir): string[] {
  const files: string[] = [];
  
  try {
    const entries = readdirSync(currentPath);
    
    for (const entry of entries) {
      const fullPath = join(currentPath, entry);
      
      try {
        const stats = statSync(fullPath);
        
        if (stats.isDirectory()) {
          // Recursively search directories
          files.push(...findMarkdownFiles(rootDir, fullPath));
        } else if (stats.isFile() && shouldInclude(fullPath, rootDir)) {
          files.push(fullPath);
        }
      } catch {
        // Skip entries we can't read
        continue;
      }
    }
  } catch {
    // Skip directories we can't read
  }
  
  return files;
}

function processFile(
  filePath: string,
  repoRoot: string,
  repoName: string,
  repoCommit: string,
  repoUrl: string
): { frontmatter: any; content: string; slug: string } | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    
    const relPath = relative(repoRoot, filePath);
    const fileName = basename(filePath, '.md');
    
    // Generate slug
    const slug = `${repoName}-${relPath.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase()}`;
    
    // Normalize content
    const normalized = parsed.content
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    // Create provenance
    const sourceUrl = `${repoUrl}/blob/${repoCommit}/${relPath}`;
    const provenance = createProvenance({
      source_url: sourceUrl,
      content: normalized,
      lang: 'en',
      license: 'Fearless Wallet',
      snapshot_id: currentSnapshotId(),
    });
    
    // Build frontmatter
    const frontmatter = {
      title: parsed.data.title || `${repoName}: ${fileName}`,
      source: 'fearless_github',
      source_url: provenance.source_url,
      source_commit: repoCommit,
      doc_id: provenance.doc_id,
      snapshot_id: provenance.snapshot_id,
      fetched_at: provenance.fetched_at,
      lang: provenance.lang,
      license: provenance.license,
      checksum_sha256: provenance.checksum_sha256,
      content_hash: provenance.content_hash,
      publishDate: new Date().toISOString(),
      repo: repoName,
      file_path: relPath,
      ...parsed.data,
    };
    
    return {
      frontmatter,
      content: normalized,
      slug,
    };
  } catch (error: any) {
    console.warn(`    ⚠ Failed to process ${filePath}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('Syncing Fearless Wallet GitHub repos (release notes & features)...');
  
  const snapshotId = currentSnapshotId();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  
  // Sync both repos
  const androidResult = await syncRepo(FEARLESS_ANDROID_REPO, FEARLESS_ANDROID_DIR, 'fearless-Android');
  const iosResult = await syncRepo(FEARLESS_IOS_REPO, FEARLESS_IOS_DIR, 'fearless-iOS');
  
  if (!androidResult && !iosResult) {
    console.error('Failed to sync both repositories');
    process.exit(1);
  }
  
  let processedCount = 0;
  
  // Process Android repo
  if (androidResult) {
    console.log(`\nProcessing fearless-Android...`);
    const files = findMarkdownFiles(androidResult.path);
    console.log(`  Found ${files.length} relevant markdown files`);
    
    for (const filePath of files) {
      const processed = processFile(
        filePath,
        androidResult.path,
        'android',
        androidResult.commit,
        FEARLESS_ANDROID_REPO
      );
      
      if (processed) {
        const outputPath = join(OUTPUT_DIR, `${processed.slug}.md`);
        writeFileSync(
          outputPath,
          matter.stringify(processed.content, processed.frontmatter),
          'utf8'
        );
        processedCount++;
        console.log(`    ✓ ${relative(androidResult.path, filePath)}`);
      }
    }
  }
  
  // Process iOS repo
  if (iosResult) {
    console.log(`\nProcessing fearless-iOS...`);
    const files = findMarkdownFiles(iosResult.path);
    console.log(`  Found ${files.length} relevant markdown files`);
    
    for (const filePath of files) {
      const processed = processFile(
        filePath,
        iosResult.path,
        'ios',
        iosResult.commit,
        FEARLESS_IOS_REPO
      );
      
      if (processed) {
        const outputPath = join(OUTPUT_DIR, `${processed.slug}.md`);
        writeFileSync(
          outputPath,
          matter.stringify(processed.content, processed.frontmatter),
          'utf8'
        );
        processedCount++;
        console.log(`    ✓ ${relative(iosResult.path, filePath)}`);
      }
    }
  }
  
  console.log(`\n✓ Sync complete: ${processedCount} files processed`);
  
  // Save snapshot metadata
  const snapshotDir = join(env.KB_DIR, 'snapshots', snapshotId);
  mkdirSync(snapshotDir, { recursive: true });
  
  const snapshotManifest = {
    snapshot_id: snapshotId,
    timestamp: new Date().toISOString(),
    android: androidResult ? {
      commit: androidResult.commit,
      path: androidResult.path,
    } : null,
    ios: iosResult ? {
      commit: iosResult.commit,
      path: iosResult.path,
    } : null,
    files_processed: processedCount,
  };
  
  writeFileSync(
    join(snapshotDir, 'fearless_github_sync.json'),
    JSON.stringify(snapshotManifest, null, 2),
    'utf8'
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main };

