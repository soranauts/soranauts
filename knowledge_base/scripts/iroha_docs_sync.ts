#!/usr/bin/env tsx
import { execa } from 'execa';
import { existsSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { env } from './env';

const IROHA_DOCS_REPO = 'https://github.com/hyperledger/iroha-2-docs';
const IROHA_DOCS_DIR = join(env.KB_DIR, 'iroha_docs');

async function main() {
  console.log('Syncing Iroha 2 docs...');
  
  // Ensure parent directory exists
  mkdirSync(join(env.KB_DIR), { recursive: true });
  
  const repoExists = existsSync(join(IROHA_DOCS_DIR, '.git'));
  
  if (repoExists) {
    // Pull updates if repo already exists
    try {
      console.log('Repository exists, pulling latest changes...');
      
      // Fetch latest from origin
      await execa('git', ['fetch', 'origin'], {
        cwd: IROHA_DOCS_DIR,
      });
      
      // Get current commit before pull
      const { stdout: oldSha } = await execa('git', ['rev-parse', 'HEAD'], {
        cwd: IROHA_DOCS_DIR,
      });
      
      // Reset to origin/main to get latest (iroha-2-docs uses main branch)
      await execa('git', ['reset', '--hard', 'origin/main'], {
        cwd: IROHA_DOCS_DIR,
      });
      
      // Get new HEAD SHA
      const { stdout: headSha } = await execa('git', ['rev-parse', 'HEAD'], {
        cwd: IROHA_DOCS_DIR,
      });
      
      if (oldSha.trim() === headSha.trim()) {
        console.log(`✓ Iroha docs up to date (HEAD: ${headSha.trim().substring(0, 12)})`);
      } else {
        console.log(`✓ Updated Iroha docs (${oldSha.trim().substring(0, 12)} → ${headSha.trim().substring(0, 12)})`);
      }
      
      return {
        success: true,
        commit: headSha.trim(),
        path: IROHA_DOCS_DIR,
      };
    } catch (error: any) {
      console.error('Failed to pull updates:', error.message);
      console.log('Attempting fresh clone...');
      // Fall through to clone
    }
  }
  
  // Fresh clone (or if pull failed)
  if (existsSync(IROHA_DOCS_DIR)) {
    console.log('Removing existing iroha_docs directory...');
    rmSync(IROHA_DOCS_DIR, { recursive: true, force: true });
  }
  
  try {
    // Shallow clone with depth 1 for faster cloning
    console.log(`Cloning ${IROHA_DOCS_REPO}...`);
    await execa('git', [
      'clone',
      '--depth', '1',
      '--filter=blob:none',
      IROHA_DOCS_REPO,
      IROHA_DOCS_DIR,
    ]);
    
    // Get HEAD SHA for provenance
    const { stdout: headSha } = await execa('git', ['rev-parse', 'HEAD'], {
      cwd: IROHA_DOCS_DIR,
    });
    
    console.log(`✓ Cloned Iroha 2 docs (HEAD: ${headSha.trim().substring(0, 12)})`);
    
    return {
      success: true,
      commit: headSha.trim(),
      path: IROHA_DOCS_DIR,
    };
  } catch (error: any) {
    console.error('Failed to sync Iroha docs:', error);
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

