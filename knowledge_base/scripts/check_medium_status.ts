#!/usr/bin/env tsx
/**
 * Check Medium import status and identify missing posts
 */
import { promises as fs } from 'fs';
import path from 'path';
import { env } from './env';

async function checkStatus() {
  const statePath = path.join(env.KB_DIR, 'scripts', '.state', '.medium_state.json');
  const urlFile = path.resolve(env.KB_DIR, 'scripts', 'config', 'medium_urls.txt');
  const outDir = path.resolve(env.KB_DIR, 'ecosystem_updates');

  // Read state
  let state: { lastGuids: string[]; lastFetched?: Record<string, string> } = { lastGuids: [] };
  try {
    const stateData = await fs.readFile(statePath, 'utf8');
    state = JSON.parse(stateData);
  } catch (error: any) {
    console.error(`Error reading state: ${error.message}`);
    return;
  }

  // Read URL list
  const urlContent = await fs.readFile(urlFile, 'utf8');
  const urls = urlContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && line.startsWith('http'));

  // Check imported files
  let importedFiles: string[] = [];
  try {
    importedFiles = await fs.readdir(outDir);
    importedFiles = importedFiles.filter(f => f.endsWith('.md'));
  } catch {
    // Directory might not exist
  }

  // Extract post IDs from state GUIDs
  const importedGuids = new Set(state.lastGuids);
  
  // Normalize URLs and check status
  const status: Array<{ url: string; status: 'imported' | 'missing' | 'duplicate' }> = [];
  const urlMap = new Map<string, string>();
  const seenPostIds = new Set<string>();

  // Process URLs (oldest to newest like the file)
  for (const url of urls) {
    let normalized = url;
    if (url.includes('sora-xor.medium.com')) {
      normalized = url.replace('sora-xor.medium.com', 'medium.com/sora-xor');
    }
    normalized = normalized.split('?')[0].split('#')[0];

    // Extract post ID
    const postIdMatch = normalized.match(/-([a-z0-9]{12})$/);
    const postId = postIdMatch ? postIdMatch[1] : normalized;

    // Check if already seen (duplicate in file)
    if (seenPostIds.has(postId)) {
      status.push({ url, status: 'duplicate' });
      continue;
    }
    seenPostIds.add(postId);

    // Check if imported
    // GUID can be in various formats, so check multiple patterns
    let isImported = false;
    for (const guid of importedGuids) {
      if (guid.includes(postId) || guid.endsWith(postId)) {
        isImported = true;
        break;
      }
    }

    status.push({
      url,
      status: isImported ? 'imported' : 'missing',
    });
  }

  // Summary
  const imported = status.filter(s => s.status === 'imported').length;
  const missing = status.filter(s => s.status === 'missing').length;
  const duplicates = status.filter(s => s.status === 'duplicate').length;

  console.log(`\n📊 Medium Import Status\n`);
  console.log(`  Total URLs in file: ${urls.length}`);
  console.log(`  ✅ Imported: ${imported}`);
  console.log(`  ❌ Missing: ${missing}`);
  console.log(`  🔄 Duplicates in file: ${duplicates}`);
  console.log(`  📁 Markdown files: ${importedFiles.length}`);
  console.log(`  📝 State GUIDs: ${state.lastGuids.length}\n`);

  if (missing > 0) {
    console.log(`\n⚠️  Missing URLs (${missing}):\n`);
    status
      .filter(s => s.status === 'missing')
      .forEach(({ url }) => console.log(`  ${url}`));

    // Write missing URLs to file for retry
    const missingFile = path.join(env.KB_DIR, 'scripts', 'config', 'medium_urls_missing.txt');
    const missingUrls = status
      .filter(s => s.status === 'missing')
      .map(s => s.url)
      .join('\n');
    
    await fs.writeFile(missingFile, missingUrls + '\n', 'utf8');
    console.log(`\n💡 Missing URLs written to: ${missingFile}`);
    console.log(`   Retry with: pnpm --filter @soranauts/web kb:sync:medium --urls ${missingFile}\n`);
  } else {
    console.log(`✅ All URLs have been processed!\n`);
    console.log(`   Note: Some may have failed with errors. Check previous script output.`);
    console.log(`   You can re-run the import to retry any failed posts.\n`);
  }
}

checkStatus().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});





