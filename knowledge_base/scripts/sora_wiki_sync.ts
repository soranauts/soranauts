#!/usr/bin/env tsx
import { execa } from 'execa';
import { existsSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { env } from './env';

const SORA_DOCS_REPO = 'https://github.com/sora-xor/sora-docs';
const SORA_DOCS_DIR = join(env.KB_DIR, 'wiki');

async function main() {
  console.log('Syncing SORA docs (wiki.sora.org) from GitHub...');
  
  // Ensure parent directory exists
  mkdirSync(join(env.KB_DIR), { recursive: true });
  
  const repoExists = existsSync(join(SORA_DOCS_DIR, '.git'));
  
  if (repoExists) {
    // Pull updates if repo already exists
    try {
      console.log('Repository exists, pulling latest changes...');
      
      // Fetch latest from origin
      await execa('git', ['fetch', 'origin', 'develop'], {
        cwd: SORA_DOCS_DIR,
      });
      
      // Get current commit before pull
      const { stdout: oldSha } = await execa('git', ['rev-parse', 'HEAD'], {
        cwd: SORA_DOCS_DIR,
      });
      
      // Reset to origin/develop to get latest
      await execa('git', ['reset', '--hard', 'origin/develop'], {
        cwd: SORA_DOCS_DIR,
      });
      
      // Get new HEAD SHA
      const { stdout: headSha } = await execa('git', ['rev-parse', 'HEAD'], {
        cwd: SORA_DOCS_DIR,
      });
      
      if (oldSha.trim() === headSha.trim()) {
        console.log(`✓ SORA docs up to date (HEAD: ${headSha.trim().substring(0, 12)})`);
      } else {
        console.log(`✓ Updated SORA docs (${oldSha.trim().substring(0, 12)} → ${headSha.trim().substring(0, 12)})`);
      }
      
      return {
        success: true,
        commit: headSha.trim(),
        path: SORA_DOCS_DIR,
      };
    } catch (error: any) {
      console.error('Failed to pull updates:', error.message);
      console.log('Attempting fresh clone...');
      // Fall through to clone
    }
  }
  
  // Fresh clone (or if pull failed)
  if (existsSync(SORA_DOCS_DIR)) {
    console.log('Removing existing wiki directory...');
    rmSync(SORA_DOCS_DIR, { recursive: true, force: true });
  }
  
  try {
    // Shallow clone with depth 1 for faster cloning
    console.log(`Cloning ${SORA_DOCS_REPO}...`);
    await execa('git', [
      'clone',
      '--depth', '1',
      '--filter=blob:none',
      '--branch', 'develop',
      SORA_DOCS_REPO,
      SORA_DOCS_DIR,
    ]);
    
    // Get HEAD SHA for provenance
    const { stdout: headSha } = await execa('git', ['rev-parse', 'HEAD'], {
      cwd: SORA_DOCS_DIR,
    });
    
    console.log(`✓ Cloned SORA docs (HEAD: ${headSha.trim().substring(0, 12)})`);
    
    return {
      success: true,
      commit: headSha.trim(),
      path: SORA_DOCS_DIR,
    };
  } catch (error: any) {
    console.error('Failed to sync SORA docs:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main };
