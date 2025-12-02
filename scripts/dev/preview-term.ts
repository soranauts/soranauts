#!/usr/bin/env tsx
/**
 * Preview Term Script
 * 
 * Opens a local preview for a given glossary term with Quick-View deep-link.
 * Ensures dev server is running (starts if needed).
 * 
 * Usage: pnpm author:preview <slug>
 * Example: pnpm author:preview xor
 */

import { exec, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const CONTENT_DIR = path.join(ROOT, 'apps/web/src/content/glossary');
const DEV_PORT = 4321;
const DEV_URL = `http://localhost:${DEV_PORT}`;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

async function isPortInUse(port: number): Promise<boolean> {
  try {
    await execAsync(`lsof -i :${port} | grep LISTEN`);
    return true;
  } catch {
    return false;
  }
}

async function waitForServer(url: string, maxWait = 30000): Promise<boolean> {
  const start = Date.now();
  
  while (Date.now() - start < maxWait) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok || response.status === 404) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  
  return false;
}

async function openBrowser(url: string): Promise<void> {
  const platform = process.platform;
  
  try {
    if (platform === 'darwin') {
      await execAsync(`open "${url}"`);
    } else if (platform === 'win32') {
      await execAsync(`start "${url}"`);
    } else {
      await execAsync(`xdg-open "${url}"`);
    }
  } catch (error) {
    console.log(`\n🔗 Open manually: ${url}`);
  }
}

function findTermSlug(input: string): string | null {
  // Check if it's a valid slug in the content directory
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const slugMatch = content.match(/^slug:\s*(\S+)/m);
    
    if (slugMatch) {
      const slug = slugMatch[1].replace(/^["']|["']$/g, '');
      if (slug === input.toLowerCase()) {
        return slug;
      }
    }
  }
  
  // Try matching filename
  const normalized = input.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const file of files) {
    const baseName = file.replace('.mdx', '').toLowerCase();
    if (baseName === normalized) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
      const slugMatch = content.match(/^slug:\s*(\S+)/m);
      if (slugMatch) {
        return slugMatch[1].replace(/^["']|["']$/g, '');
      }
    }
  }
  
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const input = process.argv[2];
  
  if (!input) {
    console.log('Usage: pnpm author:preview <slug>');
    console.log('Example: pnpm author:preview xor');
    process.exit(1);
  }
  
  // Find the term
  const slug = findTermSlug(input);
  
  if (!slug) {
    console.error(`❌ Term not found: "${input}"`);
    console.log('\n💡 Available terms (first 10):');
    
    const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx')).slice(0, 10);
    for (const file of files) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
      const slugMatch = content.match(/^slug:\s*(\S+)/m);
      if (slugMatch) {
        console.log(`   - ${slugMatch[1].replace(/^["']|["']$/g, '')}`);
      }
    }
    
    process.exit(1);
  }
  
  console.log(`\n📖 Previewing term: ${slug}\n`);
  
  // Check if dev server is running
  const serverRunning = await isPortInUse(DEV_PORT);
  
  if (!serverRunning) {
    console.log('🚀 Starting dev server...');
    
    // Start dev server in background
    const devProcess = spawn('pnpm', ['dev'], {
      cwd: ROOT,
      detached: true,
      stdio: 'ignore',
    });
    devProcess.unref();
    
    console.log('⏳ Waiting for server to be ready...');
    
    const ready = await waitForServer(DEV_URL);
    if (!ready) {
      console.error('❌ Dev server failed to start');
      process.exit(1);
    }
    
    console.log('✅ Dev server ready\n');
  } else {
    console.log('✅ Dev server already running\n');
  }
  
  // Build preview URL with Quick-View deep-link
  const previewUrl = `${DEV_URL}/glossary/${slug}?term=${slug}&preview=author`;
  
  console.log(`🔗 Opening: ${previewUrl}\n`);
  
  await openBrowser(previewUrl);
  
  console.log('💡 Tips:');
  console.log('   - The Quick-View panel should open automatically');
  console.log('   - Edit the MDX file and save to see changes');
  console.log('   - Press Ctrl+C to stop the dev server when done');
  console.log('');
}

main().catch((err) => {
  console.error('❌ Preview failed:', err);
  process.exit(1);
});


