#!/usr/bin/env tsx
import Parser from 'rss-parser';
import got from 'got';
import { promises as fs } from 'fs';
import path from 'path';
import Turndown from 'turndown';
import matter from 'gray-matter';
import sanitizeHtml from 'sanitize-html';
import { load as loadHtml } from 'cheerio';
import { Command } from 'commander';
import pQueue from 'p-queue';
import { env } from './env';
import { createProvenance, currentSnapshotId } from './utils/provenance';

const program = new Command();
program
  .option('--archive', 'Scrape publication archive for all historical posts')
  .option('--urls <file>', 'Import from file with one URL per line')
  .option('--publication <name>', 'Publication name (sora, polkaswap, fearless, tonswap)', 'sora')
  .option('--json', 'Output JSON summary')
  .parse();

const options = program.opts();

// Map publication to directory, source, and RSS feed
const publicationConfig: Record<string, { dir: string; source: string; stateFile: string; rssFeed: string }> = {
  sora: {
    dir: 'curated/ecosystem_updates',
    source: 'update',
    stateFile: '.medium_state.json',
    rssFeed: env.MEDIUM_FEED_URL,
  },
  polkaswap: {
    dir: 'curated/polkaswap_updates',
    source: 'polkaswap_update',
    stateFile: '.polkaswap_state.json',
    rssFeed: env.POLKASWAP_FEED_URL,
  },
  fearless: {
    dir: 'curated/fearless_updates',
    source: 'fearless_update',
    stateFile: '.fearless_state.json',
    rssFeed: env.FEARLESS_FEED_URL,
  },
  tonswap: {
    dir: 'curated/tonswap_updates',
    source: 'tonswap_update',
    stateFile: '.tonswap_state.json',
    rssFeed: env.TONSWAP_FEED_URL,
  },
};

const pub = publicationConfig[options.publication] || publicationConfig.sora;

const td = new Turndown();
const outDir = path.resolve(env.KB_DIR, pub.dir);
const imgDir = path.join(outDir, 'images');
const statePath = path.join(env.KB_DIR, 'scripts', '.state', pub.stateFile);
const { createHash } = require('crypto');
const sha = (s: string) => createHash('sha256').update(s).digest('hex');

async function dl(url: string) {
  try {
    const buf = await got(url, {
      headers: { 'User-Agent': env.USER_AGENT },
      timeout: { request: env.REQUEST_TIMEOUT },
    }).buffer();
    const ext = (url.split('?')[0].split('.').pop() || 'jpg').toLowerCase();
    const name = `${sha(url)}.${ext}`;
    await fs.writeFile(path.join(imgDir, name), buf);
    return `./images/${name}`;
  } catch (error: any) {
    console.warn(`  ⚠ Failed to download image ${url}: ${error.message}`);
    return url;
  }
}

async function scrapeArchiveUrls(publicationUrl: string, publicationName: string = 'sora'): Promise<string[]> {
  console.log(`Scraping publication for all posts: ${publicationUrl}`);
  const urls = new Set<string>();
  
  // Map publication names to URL patterns
  const publicationPatterns: Record<string, string[]> = {
    sora: ['/sora-xor.medium.com/', 'medium.com/sora-xor'],
    polkaswap: ['/polkaswap.medium.com/', 'medium.com/polkaswap'],
    fearless: ['/fearlesswallet.medium.com/', 'medium.com/fearlesswallet'],
    tonswap: ['/tonswap-org.medium.com/', 'medium.com/tonswap-org'],
  };
  const patterns = publicationPatterns[publicationName] || publicationPatterns.sora;
  
  try {
    // Try multiple approaches to get all post URLs
    
    // Approach 1: Main publication page
    console.log('  Trying main publication page...');
    try {
      const mainHtml = await got(publicationUrl, {
        headers: { 'User-Agent': env.USER_AGENT },
        timeout: { request: env.REQUEST_TIMEOUT },
      }).text();
      
      const $main = loadHtml(mainHtml);
      
      // Find all article links
      $main('a[href*="medium.com"]').each((_i, el) => {
        const href = $main(el).attr('href');
        if (href && patterns.some(pattern => href.includes(pattern))) {
          const cleanUrl = href.split('?')[0].split('#')[0];
          if (cleanUrl.match(/\/[a-z0-9-]+$/)) {
            urls.add(cleanUrl);
          }
        }
      });
      
      console.log(`    Found ${urls.size} URLs on main page`);
    } catch (error: any) {
      console.warn(`    ⚠ Error scraping main page: ${error.message}`);
    }
    
    // Approach 2: Archive/latest page
    const archivePages = [
      `${publicationUrl}/archive`,
      `${publicationUrl}/latest`,
      `${publicationUrl}?p=1`,
    ];
    
    for (const archiveUrl of archivePages) {
      try {
        console.log(`  Trying: ${archiveUrl}...`);
        const html = await got(archiveUrl, {
          headers: { 'User-Agent': env.USER_AGENT },
          timeout: { request: env.REQUEST_TIMEOUT },
        }).text();
        
        const $ = loadHtml(html);
        
        // Extract post links using various selectors
        $('a[href*="medium.com"]').each((_i, el) => {
          const href = $(el).attr('href');
          if (href && patterns.some(pattern => href.includes(pattern))) {
            const cleanUrl = href.split('?')[0].split('#')[0];
            // Only add if it looks like a post URL (has slug pattern)
            if (cleanUrl.match(/\/[a-z0-9-]+$/)) {
              urls.add(cleanUrl);
            }
          }
        });
        
        // Also try data attributes that Medium sometimes uses
        $('[data-post-id], [data-url]').each((_i, el) => {
          const dataUrl = $(el).attr('data-url') || $(el).attr('href');
          if (dataUrl && dataUrl.includes('medium.com')) {
            const cleanUrl = dataUrl.split('?')[0].split('#')[0];
            if (cleanUrl.match(/\/[a-z0-9-]+$/)) {
              urls.add(cleanUrl);
            }
          }
        });
        
        console.log(`    Found ${urls.size} total URLs so far`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
      } catch (error: any) {
        console.warn(`    ⚠ Error: ${error.message}`);
      }
    }
    
    // Approach 3: Try RSS feed to get initial set, then extract more from those pages
    try {
      console.log('  Checking RSS feed for additional URLs...');
      const parser = new Parser();
      const rssUrl = publicationConfig[publicationName]?.rssFeed || env.MEDIUM_FEED_URL;
      const feed = await parser.parseURL(rssUrl);
      
      feed.items.forEach(item => {
        if (item.link) {
          urls.add(item.link.split('?')[0].split('#')[0]);
        }
      });
      
      console.log(`    RSS feed added ${feed.items.length} URLs`);
    } catch (error: any) {
      console.warn(`    ⚠ RSS feed error: ${error.message}`);
    }
    
    console.log(`\n  Total unique URLs found: ${urls.size}`);
  } catch (error: any) {
    console.warn(`  ⚠ Error during scraping: ${error.message}`);
  }
  
  return Array.from(urls);
}

async function importPost(itemOrUrl: { link: string; title?: string; isoDate?: string } | string, forceUpdate: boolean = false) {
  const isUrlString = typeof itemOrUrl === 'string';
  const item = isUrlString 
    ? { link: itemOrUrl, title: undefined, isoDate: undefined }
    : itemOrUrl;
  
  const guid = item.link;
  
  // Check state
  let state: { lastGuids: string[]; lastFetched?: Record<string, string> } = { lastGuids: [] };
  try {
    const stateData = await fs.readFile(statePath, 'utf8');
    state = JSON.parse(stateData);
  } catch {
    // No existing state
  }
  
  // IMPORTANT: Newer posts should override older ones
  // Check if we've already imported this URL, but allow re-fetching for updates
  if (!forceUpdate && state.lastGuids.includes(guid)) {
    // Check if this is a newer version (based on publish date in item)
    if (item.isoDate && state.lastFetched?.[guid]) {
      const lastFetched = new Date(state.lastFetched[guid]);
      const currentDate = new Date(item.isoDate);
      
      // If current post is newer, force update
      if (currentDate > lastFetched) {
        console.log(`    ℹ Post updated on Medium, re-importing...`);
        forceUpdate = true;
      } else {
        return { skipped: true, guid, reason: 'already_imported' };
      }
    } else {
      return { skipped: true, guid, reason: 'already_imported' };
    }
  }
  
  try {
    // Fetch full HTML
    const rawHtml = await got(item.link, {
      headers: { 'User-Agent': env.USER_AGENT },
      timeout: { request: env.REQUEST_TIMEOUT },
    }).text();
    
    const $ = loadHtml(rawHtml);
    
    // Extract title if not provided
    const title = item.title || $('h1').first().text().trim() || $('title').text().trim().replace(' | Medium', '');
    
    // Extract publish date
    const dateMatch = rawHtml.match(/<time[^>]*datetime="([^"]+)"/i);
    const publishDate = item.isoDate || dateMatch?.[1] || new Date().toISOString();
    
    // Sanitize HTML
    const cleanHtml = sanitizeHtml(rawHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        a: ['href', 'title'],
        img: ['src', 'alt', 'title'],
      },
    }).replace(/\s+/g, ' ').trim();
    
    let md = td.turndown(cleanHtml);
    
    // Extract and download images
    const imgMatches = Array.from(cleanHtml.matchAll(/<img[^>]+src="([^"]+)"/gi));
    const imgs = Array.from(new Set(imgMatches.map(m => m[1])));
    
    for (const u of imgs) {
      if (/^https?:\/\//.test(u)) {
        const local = await dl(u);
        md = md.replaceAll(u, local);
      }
    }
    
    // Normalize markdown
    const normalized = md
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    const snapshotId = currentSnapshotId();
    const licenseMap: Record<string, string> = {
      sora: 'SORA Official / Medium',
      polkaswap: 'Polkaswap Official / Medium',
      fearless: 'Fearless Wallet Official / Medium',
    };
    const license = licenseMap[options.publication] || 'SORA Official / Medium';
    
    const provenance = createProvenance({
      source_url: item.link,
      content: normalized,
      lang: 'en',
      license,
      snapshot_id: snapshotId,
    });
    
    const fm = {
      title,
      source: pub.source,
      source_url: provenance.source_url,
      doc_id: provenance.doc_id,
      snapshot_id: provenance.snapshot_id,
      fetched_at: provenance.fetched_at,
      lang: provenance.lang,
      license: provenance.license,
      checksum_sha256: provenance.checksum_sha256,
      content_hash: provenance.content_hash,
      image_rights: license,
      publishDate,
    };
    
    const slug = item.link
      .replace(/^https?:\/\//, '')
      .replace(/[^\w\-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    
    // Save markdown file
    await fs.writeFile(
      path.join(outDir, `${slug}.md`),
      matter.stringify(normalized, fm),
      'utf8'
    );
    
    // Save snapshot metadata
    const snapshotDir = path.join(env.KB_DIR, 'snapshots', snapshotId);
    await fs.mkdir(snapshotDir, { recursive: true });
    await fs.writeFile(
      path.join(snapshotDir, `${provenance.doc_id}.json`),
      JSON.stringify(provenance, null, 2),
      'utf8'
    );
    
    // Update state
    if (!state.lastGuids.includes(guid)) {
      state.lastGuids.push(guid);
    }
    state.lastGuids = state.lastGuids.slice(-500); // Keep last 500
    
    // Track when we fetched each post (for detecting updates)
    if (!state.lastFetched) {
      state.lastFetched = {};
    }
    state.lastFetched[guid] = publishDate;
    
    await fs.mkdir(path.dirname(statePath), { recursive: true });
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));
    
    return { processed: true, guid, title, updated: forceUpdate };
  } catch (error: any) {
    return { error: true, guid, errorMessage: error.message };
  }
}

(async () => {
  const startTime = Date.now();
  console.log('Importing Medium posts...');
  
  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(imgDir, { recursive: true });
  
  let urlsToProcess: Array<{ link: string; title?: string; isoDate?: string }> = [];
  
  if (options.urls) {
    // Import from URL list file
    console.log(`Reading URLs from: ${options.urls}`);
    const urlFile = await fs.readFile(options.urls, 'utf8');
    const urls = urlFile
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.startsWith('http'));
    
    // Normalize URLs and remove duplicates
    // IMPORTANT: File is ordered oldest→newest, so later duplicates should override earlier ones
    // We'll process in reverse (newest first), so keep the LAST occurrence of each URL
    const urlMap = new Map<string, string>();
    const seenNormalized = new Set<string>();
    
    // Process in reverse to keep newest (last in file) when duplicates exist
    for (let i = urls.length - 1; i >= 0; i--) {
      const url = urls[i];
      // Normalize URL format (handle various Medium publication formats)
      let normalized = url;
      if (url.includes('sora-xor.medium.com')) {
        normalized = url.replace('sora-xor.medium.com', 'medium.com/sora-xor');
      } else if (url.includes('polkaswap.medium.com')) {
        normalized = url.replace('polkaswap.medium.com', 'medium.com/polkaswap');
      } else if (url.includes('fearlesswallet.medium.com')) {
        normalized = url.replace('fearlesswallet.medium.com', 'medium.com/fearlesswallet');
      }
      // Remove query params and fragments
      normalized = normalized.split('?')[0].split('#')[0];
      
      // Extract post ID for duplicate detection (Medium URLs end with -[id])
      const postIdMatch = normalized.match(/-([a-z0-9]+)$/);
      const postId = postIdMatch ? postIdMatch[1] : normalized;
      
      // Keep only the first occurrence we see (which is the newest due to reverse iteration)
      if (!seenNormalized.has(postId)) {
        seenNormalized.add(postId);
        urlMap.set(postId, normalized);
      }
    }
    
    // Convert back to array (will be processed newest first due to reverse)
    urlsToProcess = Array.from(urlMap.values()).map(url => ({ link: url }));
    console.log(`Found ${urls.length} URLs in file (${urls.length - urlsToProcess.length} duplicates removed, ${urlsToProcess.length} unique)`);
  } else if (options.archive) {
    // Scrape archive for all posts
    const publicationUrls: Record<string, string> = {
      sora: 'https://sora-xor.medium.com',
      polkaswap: 'https://polkaswap.medium.com',
      fearless: 'https://fearlesswallet.medium.com',
    };
    const publicationUrl = publicationUrls[options.publication] || publicationUrls.sora;
    const archiveUrls = await scrapeArchiveUrls(publicationUrl, options.publication);
    urlsToProcess = archiveUrls.map(url => ({ link: url }));
    console.log(`\nFound ${urlsToProcess.length} posts in archive`);
  } else if (options.urls) {
    // Import from URL list file (already handled above)
    // This branch won't be hit, but keeping for clarity
  } else {
    // Default: RSS feed (recent posts only)
    console.log(`Feed: ${pub.rssFeed}`);
    const parser = new Parser<{ content: string }>();
    const feed = await parser.parseURL(pub.rssFeed);
    
    console.log(`Feed has ${feed.items.length} items`);
    urlsToProcess = feed.items.map(item => ({
      link: item.link!,
      title: item.title,
      isoDate: item.isoDate,
    }));
  }
  
  // IMPORTANT: User's file is oldest to newest, but we want to process newest first
  // This ensures newer posts override older versions when duplicates exist
  // Reverse the array to process newest first (from the end of the file)
  if (options.urls) {
    // File order is oldest→newest, so reverse to get newest first
    urlsToProcess.reverse();
  } else {
    // For RSS/archive, sort by date (newest first)
    urlsToProcess.sort((a, b) => {
      const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
      const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
      return dateB - dateA; // Newest first
    });
  }
  
  // Process with reduced concurrency and rate limiting for Medium
  const queue = new pQueue({ 
    concurrency: 1, // Reduced to avoid rate limits
    interval: 2000, // 2 second delay between requests
    intervalCap: 1,
  });
  const results = { processed: 0, updated: 0, skipped: 0, errors: 0, rateLimited: 0 };
  
  console.log(`\nProcessing ${urlsToProcess.length} posts (newest first)...`);
  console.log(`  Rate limit: 1 request every 2 seconds to respect Medium's limits`);
  
  const promises = urlsToProcess.map((item, index) =>
    queue.add(async () => {
      if (index > 0 && index % 10 === 0) {
        console.log(`\n  Progress: ${index}/${urlsToProcess.length} posts processed...`);
      }
      
      console.log(`  ${item.title || item.link}`);
      
      // Retry logic for rate limiting
      let result;
      let retries = 3;
      while (retries > 0) {
        result = await importPost(item, false);
        
        if (result.error && result.errorMessage?.includes('429')) {
          results.rateLimited++;
          retries--;
          if (retries > 0) {
            const waitTime = Math.pow(2, 3 - retries) * 5; // Exponential backoff: 10s, 20s, 40s
            console.log(`    ⏳ Rate limited, waiting ${waitTime}s before retry (${3 - retries + 1}/3)...`);
            await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          }
        } else {
          break;
        }
      }
      
      if (result.skipped) {
        results.skipped++;
        console.log(`    ⊘ Already imported`);
      } else if (result.error) {
        results.errors++;
        console.log(`    ✗ Error: ${result.errorMessage}`);
      } else {
        results.processed++;
        if (result.updated) {
          results.updated++;
          console.log(`    ↻ Updated: ${result.title || item.link}`);
        } else {
          console.log(`    ✓ Saved: ${result.title || item.link}`);
        }
      }
    }, { throwOnTimeout: false })
  );
  
  await Promise.all(promises);
  
  const summary = {
    processed: results.processed,
    updated: results.updated,
    skipped: results.skipped,
    errors: results.errors,
    rate_limited: results.rateLimited,
    total: urlsToProcess.length,
    duration_ms: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  };
  
  if (options.json) {
    console.log(JSON.stringify(summary));
  } else {
    console.log(`\n✓ Import complete:`);
    console.log(`  Processed: ${results.processed} (${results.updated} updated)`);
    console.log(`  Skipped: ${results.skipped}`);
    console.log(`  Errors: ${results.errors}`);
    if (results.rateLimited > 0) {
      console.log(`  Rate limited: ${results.rateLimited} (some may need retry)`);
    }
    console.log(`  Duration: ${(summary.duration_ms / 1000).toFixed(2)}s`);
    if (results.updated > 0) {
      console.log(`\n  ℹ Note: Newer posts automatically override older versions`);
    }
    if (results.errors > 0 && results.rateLimited > 0) {
      console.log(`\n  💡 Tip: Re-run the command to retry failed imports`);
    }
  }
})().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
