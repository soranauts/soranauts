#!/usr/bin/env tsx
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import got from 'got';
import { load as loadHtml } from 'cheerio';
import matter from 'gray-matter';
import Turndown from 'turndown';
import sanitizeHtml from 'sanitize-html';
import { parse as parseUrl } from 'node:url';
import Sitemapper from 'sitemapper';
import robotsParser from 'robots-parser';
import { Command } from 'commander';
import { env } from './env';
import { createProvenance, currentSnapshotId } from './utils/provenance';
import { isSafePublicHttpUrl } from './utils/url-safety';

const program = new Command();
program
  .option('--dry-run', 'Dry run mode (no writes)')
  .option('--json', 'Output JSON summary')
  .parse();

const options = program.opts();

const td = new Turndown({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
const outDir = path.resolve(env.KB_DIR, 'curated', 'tonswap_site');
const imgDir = path.join(outDir, 'images');
const stateDir = path.join(env.KB_DIR, 'scripts', '.state');
const statePath = path.join(stateDir, 'tonswap.jsonl');
const runlogDir = path.join(stateDir, 'runlogs');

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

function sanitizeAndNormalizeHtml(rawHtml: string): string {
  const clean = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'title'],
      img: ['src', 'alt', 'title'],
      h1: ['id'],
      h2: ['id'],
      h3: ['id'],
      h4: ['id'],
    },
  });
  
  return clean
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface StateEntry {
  url: string;
  status: number;
  etag?: string;
  lastModified?: string;
  content_hash: string;
  timestamp: string;
  error_count?: number;
}

async function loadState(): Promise<Map<string, StateEntry>> {
  const state = new Map<string, StateEntry>();
  try {
    const data = await fs.readFile(statePath, 'utf8');
    for (const line of data.trim().split('\n')) {
      if (!line) continue;
      const entry: StateEntry = JSON.parse(line);
      state.set(entry.url, entry);
    }
  } catch {
    // No existing state
  }
  return state;
}

async function appendState(entry: StateEntry): Promise<void> {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.appendFile(statePath, JSON.stringify(entry) + '\n');
}

async function logRun(event: Record<string, any>): Promise<void> {
  await fs.mkdir(runlogDir, { recursive: true });
  const runlogPath = path.join(runlogDir, `tonswap-${Date.now()}.jsonl`);
  await fs.appendFile(runlogPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    ...event,
  }) + '\n');
}

async function fetchRobots(domain: string): Promise<robotsParser.Robot | null> {
  try {
    const robotsUrl = `https://${domain}/robots.txt`;
    const response = await got(robotsUrl, {
      headers: { 'User-Agent': env.USER_AGENT },
      timeout: { request: env.REQUEST_TIMEOUT },
      throwHttpErrors: false,
    });
    if (response.statusCode === 200) {
      return robotsParser(robotsUrl, response.body);
    }
  } catch (error: any) {
    console.warn(`  ⚠ Failed to fetch robots.txt: ${error.message}`);
  }
  return null;
}

async function fetchSitemapUrls(domain: string): Promise<string[]> {
  const sitemap = new Sitemapper({
    url: `https://${domain}/sitemap.xml`,
    timeout: env.REQUEST_TIMEOUT,
  });
  
  try {
    const { sites } = await sitemap.fetch();
    return sites.filter(url => {
      const parsed = parseUrl(url);
      return parsed.hostname === domain || parsed.hostname === `www.${domain}`;
    });
  } catch (error: any) {
    console.warn(`  ⚠ Failed to fetch sitemap: ${error.message}`);
    return [];
  }
}

async function fetchPage(url: string, state: Map<string, StateEntry>, robots: robotsParser.Robot | null): Promise<{ status: number; etag?: string; lastModified?: string; html?: string; error?: boolean }> {
  const parsed = parseUrl(url);
  const path = parsed.pathname || '/';
  
  if (robots && !robots.isAllowed(url, env.USER_AGENT)) {
    await logRun({ event: 'disallowed_by_robots', url });
    return { status: 403, error: true };
  }
  
  const previous = state.get(url);
  const headers: any = { 'User-Agent': env.USER_AGENT };
  
  if (previous?.etag) headers['If-None-Match'] = previous.etag;
  if (previous?.lastModified) headers['If-Modified-Since'] = previous.lastModified;
  
  try {
    let r: any;
    try {
      r = await got.head(url, {
        headers,
        timeout: { request: env.REQUEST_TIMEOUT },
        http2: true,
        throwHttpErrors: false,
      });
    } catch {
      r = await got(url, {
        headers,
        timeout: { request: env.REQUEST_TIMEOUT },
        http2: true,
        throwHttpErrors: false,
      });
    }
    
    if (r.statusCode === 304) {
      return { status: 304, etag: previous?.etag, lastModified: previous?.lastModified };
    }
    
    if (r.statusCode === 404) {
      const errorCount = (previous?.error_count || 0) + 1;
      if (errorCount >= 2) {
        await logRun({ event: 'permanently_missing', url, error_count: errorCount });
      }
      return { status: 404, error: true };
    }
    
    if (r.statusCode !== 200) {
      return { status: r.statusCode || 500, error: true };
    }
    
    if (!('body' in r) || !r.body) {
      r = await got(url, {
        headers: { 'User-Agent': env.USER_AGENT },
        timeout: { request: env.REQUEST_TIMEOUT },
        http2: true,
        throwHttpErrors: false,
      });
    }
    
    const rawHtml = (r as any).body || '';
    const sanitized = sanitizeAndNormalizeHtml(rawHtml);
    
    return {
      status: r.statusCode || 200,
      etag: (r.headers.etag as string | undefined),
      lastModified: (r.headers['last-modified'] as string | undefined),
      html: sanitized,
    };
  } catch (error: any) {
    return { status: 500, error: true };
  }
}

async function saveImages($: any): Promise<void> {
  if (options.dryRun) return;
  
  await fs.mkdir(imgDir, { recursive: true });
  const jobs: Promise<void>[] = [];
  
  $('img[src]').each((_i: unknown, el: any) => {
    const src = $(el).attr('src');
    if (!src || !/^https?:\/\//.test(src)) return;
    if (!isSafePublicHttpUrl(src)) return;
    
    jobs.push((async () => {
      try {
        const buf = await got(src, {
          headers: { 'User-Agent': env.USER_AGENT },
          timeout: { request: env.REQUEST_TIMEOUT },
        }).buffer();
        const ext = ((parseUrl(src).pathname || '').split('.').pop() || 'jpg').toLowerCase();
        const name = `${sha256(src)}.${ext}`;
        await fs.writeFile(path.join(imgDir, name), buf);
        $(el).attr('src', `./images/${name}`);
      } catch (error: any) {
        console.warn(`    ⚠ Failed to download image ${src}: ${error.message}`);
      }
    })());
  });
  
  await Promise.allSettled(jobs);
}

(async () => {
  const startTime = Date.now();
  console.log('Scraping TONSWAP site...');
  if (options.dryRun) console.log('  [DRY RUN MODE]');
  
  const state = await loadState();
  const domains = env.TONSWAP_CRAWL_DOMAINS.split(',').map(d => d.trim()).filter(Boolean);
  if (domains.length === 0) {
    throw new Error('No crawl domains configured. Set TONSWAP_CRAWL_DOMAINS in env.');
  }

  let primaryDomain = domains[0];
  let robots: robotsParser.Robot | null = null;
  for (const domain of domains) {
    robots = await fetchRobots(domain);
    if (robots) {
      primaryDomain = domain;
      break;
    }
  }
  if (!robots) {
    console.warn('  ⚠ Unable to load robots.txt for any configured domain; proceeding conservatively.');
  } else {
    console.log(`  Using robots.txt from ${primaryDomain}`);
  }
  
  const sitemapUrls = new Set<string>();
  for (const domain of domains) {
    const domainUrls = await fetchSitemapUrls(domain);
    if (domainUrls.length === 0 && domain !== primaryDomain) continue;
    console.log(`  Found ${domainUrls.length} URLs in sitemap for ${domain}`);
    domainUrls.forEach(url => sitemapUrls.add(url));
    if (sitemapUrls.size && domain === primaryDomain) {
      continue;
    }
  }
  console.log(`  Total sitemap URLs discovered: ${sitemapUrls.size}`);
  
  // Load allowlist from config file
  const allowlistPath = path.join(env.KB_DIR, 'scripts', 'config', 'tonswap.allowlist.txt');
  let allowlist: string[] = [];
  try {
    allowlist = (await fs.readFile(allowlistPath, 'utf8'))
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
  } catch {
    // No allowlist
  }
  
  // Also use TONSWAP_START_URLS from env if configured
  const startUrls = env.TONSWAP_START_URLS.split(',').map(u => u.trim()).filter(Boolean);
  allowlist.push(...startUrls);
  
  const urls = new Set<string>([...allowlist]);
  const disallowPatterns: RegExp[] = [];
  for (const url of sitemapUrls) {
    if (disallowPatterns.some(pattern => pattern.test(url))) {
      continue;
    }
    const parsed = parseUrl(url);
    if (parsed.pathname && (parsed.pathname.match(/\//g) || []).length <= 1) {
      urls.add(url);
    }
  }
  
  console.log(`  Total URLs to process: ${urls.size}`);
  
  const snapshotId = new Date().toISOString().slice(0, 10);
  if (!options.dryRun) {
    await fs.mkdir(outDir, { recursive: true });
  }
  
  const stats = { processed: 0, skipped: 0, errors: 0 };
  
  for (const url of urls) {
    console.log(`  ${url}`);
    const res = await fetchPage(url, state, robots);
    
    const contentHash = res.html ? sha256(res.html) : '';
    const previous = state.get(url);
    const entry: StateEntry = {
      url,
      status: res.status,
      etag: res.etag,
      lastModified: res.lastModified,
      content_hash: contentHash,
      timestamp: new Date().toISOString(),
      error_count: res.error ? ((previous?.error_count || 0) + 1) : 0,
    };
    
    if (res.status === 304) {
      console.log(`    ✓ Not modified (304)`);
      stats.skipped++;
      await appendState(entry);
      await logRun({ event: 'skipped', url, reason: 'not_modified' });
      continue;
    }
    
    if (res.error || !res.html) {
      console.log(`    ⚠ Error: ${res.status}`);
      stats.errors++;
      await appendState(entry);
      await logRun({ event: 'error', url, status: res.status });
      continue;
    }
    
    const $ = loadHtml(res.html);
    $('nav, footer, script, style, iframe').remove();
    
    const canonical = $('link[rel=canonical]').attr('href') || url;
    const lang = $('html').attr('lang')?.split('-')[0] || 'en';
    
    if (!options.dryRun) {
      await saveImages($);
    }
    
    const title = $('title').first().text().trim() || 'Untitled';
    const md = td.turndown($.html());
    
    const normalized = md
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    const provenance = createProvenance({
      source_url: canonical,
      content: normalized,
      etag: res.etag,
      last_modified: res.lastModified,
      lang,
      license: 'TONSWAP',
      snapshot_id: snapshotId,
    });
    
    const front = {
      title,
      source: 'tonswap_site',
      source_url: provenance.source_url,
      doc_id: provenance.doc_id,
      snapshot_id: provenance.snapshot_id,
      fetched_at: provenance.fetched_at,
      etag: provenance.etag || undefined,
      last_modified: provenance.last_modified || undefined,
      lang: provenance.lang || undefined,
      license: provenance.license || undefined,
      checksum_sha256: provenance.checksum_sha256,
      content_hash: provenance.content_hash,
      publishDate: new Date().toISOString(),
      image_rights: 'TONSWAP',
    };
    
    // Remove undefined values to avoid YAML serialization errors
    Object.keys(front).forEach(key => {
      if (front[key as keyof typeof front] === undefined) {
        delete front[key as keyof typeof front];
      }
    });
    
    const slug = canonical
      .replace(/^https?:\/\//, '')
      .replace(/[^\w\-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    
    if (!options.dryRun) {
      await fs.writeFile(
        path.join(outDir, `${slug}.md`),
        matter.stringify(normalized, front),
        'utf8'
      );
      
      const snapshotDir = path.join(env.KB_DIR, 'snapshots', snapshotId);
      await fs.mkdir(snapshotDir, { recursive: true });
      await fs.writeFile(
        path.join(snapshotDir, `${provenance.doc_id}.json`),
        JSON.stringify(provenance, null, 2),
        'utf8'
      );
    }
    
    await appendState(entry);
    stats.processed++;
    await logRun({ event: 'processed', url, slug, doc_id: provenance.doc_id, content_hash: provenance.content_hash });
    console.log(`    ✓ Saved: ${slug}.md`);
  }
  
  const summary = {
    processed: stats.processed,
    skipped: stats.skipped,
    errors: stats.errors,
    duration_ms: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  };
  
  if (options.json) {
    console.log(JSON.stringify(summary));
  } else {
    console.log(`\n✓ Scraping complete:`);
    console.log(`  Processed: ${stats.processed}`);
    console.log(`  Skipped: ${stats.skipped}`);
    console.log(`  Errors: ${stats.errors}`);
    console.log(`  Duration: ${(summary.duration_ms / 1000).toFixed(2)}s`);
  }
  
  await logRun({ event: 'complete', ...summary });
})().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
