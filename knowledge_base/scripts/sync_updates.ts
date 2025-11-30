#!/usr/bin/env tsx
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import got from 'got';
import { load as loadHtml } from 'cheerio';
import type { Root as CheerioRoot } from 'cheerio';
import Turndown from 'turndown';
import Sitemapper from 'sitemapper';
import { parse as parseUrl } from 'node:url';
import readline from 'node:readline';
import { env } from './env';
import { normalizeForHash, hashContent } from './utils/text-normalize';

type SourceSystem = 'medium' | 'tonswap' | 'soramitsu' | 'iroha' | 'wiki';

type SourceKey =
  | 'sora-medium'
  | 'polkaswap-medium'
  | 'fearless-medium'
  | 'tonswap-medium'
  | 'tonswap-site'
  | 'soramitsu-news'
  | 'iroha-docs'
  | 'sora-wiki';

interface CandidateArticle {
  sourceSystem: SourceSystem;
  sourceKey: SourceKey;
  url: string;
  title: string;
  slug: string;
  snapshotId: string;
  publishDateIso: string;
  markdownBody: string;
  contentSha256: string;
  isUpdated: boolean;
  previousSha256?: string;
  secondaryTag?: string;
}

interface SyncState {
  urls: Record<
    string,
    {
      last_seen: string; // ISO timestamp
      content_sha256: string;
      updated_at?: string;
    }
  >;
}

const KB_DIR = env.KB_DIR;
const OUT_DIR = path.resolve(KB_DIR, 'curated', 'sora_updates');
const STATE_DIR = path.join(KB_DIR, 'scripts', '.state');
const STATE_PATH = path.join(STATE_DIR, 'sync_updates.json');

const td = new Turndown({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

type RunMode = 'interactive' | 'dry-run' | 'report';

interface RunOptions {
  mode: RunMode;
}

interface ReportItem {
  url: string;
  title: string;
  slug: string;
  snapshot_id: string;
  publishDate: string;
  content_sha256: string;
  sourceSystem: SourceSystem;
  sourceKey: SourceKey;
}

interface ReportError {
  url?: string;
  sourceSystem?: SourceSystem;
  sourceKey?: SourceKey;
  error: string;
}

interface SourceStats {
  sourceKey: SourceKey;
  newCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
}

interface Summary {
  stats: Record<SourceKey, SourceStats>;
  newItems: ReportItem[];
  updatedItems: ReportItem[];
  skippedItems: ReportItem[];
  errors: ReportError[];
}

const ALL_SOURCE_KEYS: SourceKey[] = [
  'sora-medium',
  'polkaswap-medium',
  'fearless-medium',
  'tonswap-medium',
  'tonswap-site',
  'soramitsu-news',
  'iroha-docs',
  'sora-wiki',
];

let LOG_SILENT = false;

// Basic console logger
function log(event: string, fields: Record<string, unknown> = {}): void {
  if (LOG_SILENT) return;
  const payload = {
    ts: new Date().toISOString(),
    event,
    ...fields,
  };
  console.log(JSON.stringify(payload));
}

async function loadSyncState(): Promise<SyncState> {
  try {
    const raw = await fs.readFile(STATE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as SyncState;
    if (!parsed.urls) parsed.urls = {};
    return parsed;
  } catch {
    return { urls: {} };
  }
}

async function saveSyncState(state: SyncState): Promise<void> {
  await fs.mkdir(STATE_DIR, { recursive: true });
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function sha256(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

function todaySnapshotId(): string {
  return new Date().toISOString().split('T')[0];
}

function toKebabCaseSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'untitled';
}

function normalizeMarkdownBody(body: string): string {
  let text = body;

  // Normalize line endings
  text = text.replace(/\r\n?/g, '\n');

  // Normalize bullet markers to "-" for unordered lists
  text = text.replace(/^\s*([*+])\s+/gm, '- ');

  // Collapse multiple blank lines
  text = text.replace(/\n{3,}/g, '\n\n');

  // Strip trailing spaces
  text = text.replace(/[ \t]+$/gm, '');

  return text.trim();
}

function getSourceKeyAndSecondaryTag(sourceSystem: SourceSystem, url: string): { sourceKey: SourceKey; secondaryTag: string } {
  const parsed = parseUrl(url);
  const host = parsed.hostname || '';
  const pathname = parsed.pathname || '';

  if (sourceSystem === 'medium') {
    if (host === 'sora-xor.medium.com' || pathname.includes('/sora-xor')) {
      return { sourceKey: 'sora-medium', secondaryTag: 'sora-medium' };
    }
    if (host === 'polkaswap.medium.com' || pathname.includes('/polkaswap')) {
      return { sourceKey: 'polkaswap-medium', secondaryTag: 'polkaswap-medium' };
    }
    if (host === 'fearlesswallet.medium.com' || pathname.includes('/fearlesswallet')) {
      return { sourceKey: 'fearless-medium', secondaryTag: 'fearless-medium' };
    }
    // Default Medium mapping: tonswap-org or other ecosystem-related content
    return { sourceKey: 'tonswap-medium', secondaryTag: 'tonswap-medium' };
  }

  if (sourceSystem === 'tonswap') {
    return { sourceKey: 'tonswap-site', secondaryTag: 'tonswap-site' };
  }

  if (sourceSystem === 'soramitsu') {
    return { sourceKey: 'soramitsu-news', secondaryTag: 'soramitsu-news' };
  }

  if (sourceSystem === 'iroha') {
    return { sourceKey: 'iroha-docs', secondaryTag: 'iroha-docs' };
  }

  // wiki
  return { sourceKey: 'sora-wiki', secondaryTag: 'sora-wiki' };
}

function initSummary(): Summary {
  const stats: Record<SourceKey, SourceStats> = {} as Record<SourceKey, SourceStats>;
  for (const key of ALL_SOURCE_KEYS) {
    stats[key] = {
      sourceKey: key,
      newCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      errorCount: 0,
    };
  }
  return {
    stats,
    newItems: [],
    updatedItems: [],
    skippedItems: [],
    errors: [],
  };
}

function classifyForReport(
  summary: Summary,
  classification: 'new' | 'updated' | 'skipped',
  article: {
    url: string;
    title: string;
    slug: string;
    snapshotId: string;
    publishDateIso: string;
    contentSha256: string;
    sourceSystem: SourceSystem;
    sourceKey: SourceKey;
  },
): void {
  const { sourceKey } = article;
  const stats = summary.stats[sourceKey];
  const item: ReportItem = {
    url: article.url,
    title: article.title,
    slug: article.slug,
    snapshot_id: article.snapshotId,
    publishDate: article.publishDateIso,
    content_sha256: article.contentSha256,
    sourceSystem: article.sourceSystem,
    sourceKey: article.sourceKey,
  };

  if (classification === 'new') {
    stats.newCount++;
    summary.newItems.push(item);
  } else if (classification === 'updated') {
    stats.updatedCount++;
    summary.updatedItems.push(item);
  } else {
    stats.skippedCount++;
    summary.skippedItems.push(item);
  }
}

function recordError(summary: Summary, sourceSystem: SourceSystem, sourceKey: SourceKey, url: string | undefined, error: any): void {
  const message = error instanceof Error ? error.message : String(error);
  const stats = summary.stats[sourceKey];
  stats.errorCount++;
  summary.errors.push({
    url,
    sourceSystem,
    sourceKey,
    error: message,
  });
}

function renderDashboard(summary: Summary): void {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const red = '\x1b[31m';

  const header = `${bold}Source               New  Updated  Skipped  Errors${reset}`;
  console.log('\nSync Summary');
  console.log(header);
  console.log('------------------------------------------------');

  let totalNew = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  const labels: Record<SourceKey, string> = {
    'sora-medium': 'sora-medium',
    'polkaswap-medium': 'polkaswap-medium',
    'fearless-medium': 'fearless-medium',
    'tonswap-medium': 'tonswap-medium',
    'tonswap-site': 'tonswap-site',
    'soramitsu-news': 'soramitsu-news',
    'iroha-docs': 'iroha-docs',
    'sora-wiki': 'sora-wiki',
  };

  for (const key of ALL_SOURCE_KEYS) {
    const stats = summary.stats[key];
    const label = labels[key].padEnd(18, ' ');
    const n = stats.newCount;
    const u = stats.updatedCount;
    const s = stats.skippedCount;
    const e = stats.errorCount;
    totalNew += n;
    totalUpdated += u;
    totalSkipped += s;
    totalErrors += e;

    const nStr = `${n}`.padStart(3, ' ');
    const uStr = `${u}`.padStart(7, ' ');
    const sStr = `${s}`.padStart(8, ' ');
    const eStr = `${e}`.padStart(7, ' ');

    const coloredN = n > 0 ? `${green}${nStr}${reset}` : nStr;
    const coloredU = u > 0 ? `${yellow}${uStr}${reset}` : uStr;
    const coloredS = sStr;
    const coloredE = e > 0 ? `${red}${eStr}${reset}` : eStr;

    console.log(`${label}${coloredN} ${coloredU} ${coloredS} ${coloredE}`);
  }

  const totalLabel = `${bold}TOTAL${reset}`.padEnd(18, ' ');
  const tN = `${totalNew}`.padStart(3, ' ');
  const tU = `${totalUpdated}`.padStart(7, ' ');
  const tS = `${totalSkipped}`.padStart(8, ' ');
  const tE = `${totalErrors}`.padStart(7, ' ');
  console.log('------------------------------------------------');
  console.log(`${totalLabel}${tN} ${tU} ${tS} ${tE}`);
}

function extractTitle($: CheerioRoot): string {
  const ogTitle = $('meta[property="og:title"]').attr('content');
  if (ogTitle && ogTitle.trim()) return ogTitle.trim();

  const twitterTitle = $('meta[name="twitter:title"]').attr('content');
  if (twitterTitle && twitterTitle.trim()) return twitterTitle.trim();

  const h1 = $('h1').first().text();
  if (h1 && h1.trim()) return h1.trim();

  const docTitle = $('title').first().text();
  if (docTitle && docTitle.trim()) return docTitle.trim();

  return 'Untitled';
}

function extractPublishDateIso($: CheerioRoot): string | null {
  const candidates: string[] = [];

  const ogArticleTime = $('meta[property="article:published_time"]').attr('content');
  if (ogArticleTime) candidates.push(ogArticleTime);

  const metaDate = $('meta[name="date"]').attr('content');
  if (metaDate) candidates.push(metaDate);

  const metaPub = $('meta[name="publication_date"], meta[name="publish-date"]').attr('content');
  if (metaPub) candidates.push(metaPub);

  const timeDateTime = $('time[datetime]').attr('datetime');
  if (timeDateTime) candidates.push(timeDateTime);

  for (const raw of candidates) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString();
    }
  }
  return null;
}

function sanitizeArticleHtml(rawHtml: string, sourceSystem: SourceSystem): string {
  const $ = loadHtml(rawHtml);

  // Generic boilerplate removal
  $('script, style, noscript').remove();
  $('header, footer, nav, aside').remove();
  $('[role="navigation"], [role="banner"], [role="contentinfo"]').remove();

  // Generic cruft: cookie banners, social blocks, newsletters, breadcrumbs, sidebars, related posts, author bios, TOCs
  const genericSelectors = [
    '[id*="cookie"]',
    '[class*="cookie"]',
    '[class*="Cookie"]',
    '[class*="gdpr"]',
    '[class*="consent"]',
    '[class*="share"]',
    '[class*="social"]',
    '[class*="sns"]',
    '[class*="newsletter"]',
    '[class*="subscribe"]',
    '[class*="subscription"]',
    '[class*="breadcrumb"]',
    '[class*="breadcrumbs"]',
    '[class*="crumbs"]',
    '[class*="related-post"]',
    '[class*="related_posts"]',
    '[class*="related-articles"]',
    '[class*="sidebar"]',
    '[class*="aside"]',
    '[class*="toc"]',
    '[class*="table-of-contents"]',
    '[class*="author-bio"]',
    '[class*="author-badge"]',
    '[class*="author-profile"]',
    '[class*="profile-card"]',
  ];
  $(genericSelectors.join(',')).remove();

  // Domain-specific cleanup
  if (sourceSystem === 'medium') {
    const mediumSelectors = [
      '.metabar',
      '.js-stickyFooter',
      '.js-postFooter',
      '[data-test-id="streak-banner"]',
      '[data-testid="streak-banner"]',
      '[data-test-id="social-share"]',
      '[data-testid="social-share"]',
      '[data-test-id="footer"]',
      '[data-test-id="sidebar"]',
      '[data-test-id="post-sidebar"]',
      '[data-test-id="author-card"]',
      '[data-test-id="article-author-card"]',
      '[data-test-id="recommended-stories"]',
      '[data-test-id="related-posts"]',
    ];
    $(mediumSelectors.join(',')).remove();
  } else if (sourceSystem === 'soramitsu') {
    const soramitsuSelectors = [
      '.p-breadcrumb',
      '.c-breadcrumb',
      '.breadcrumbs',
      '.c-news-related',
      '.p-news-related',
      '.p-article-footer',
      '.c-article-footer',
      '.p-news-share',
      '.sns-share',
    ];
    $(soramitsuSelectors.join(',')).remove();
  } else if (sourceSystem === 'tonswap') {
    const tonSelectors = [
      '.blog-sidebar',
      '.blog__sidebar',
      '.blog-related',
      '.blog__related',
      '.post-meta',
      '.article-meta',
      '.author',
      '.author-card',
      '.post-author',
      '.newsletter',
    ];
    $(tonSelectors.join(',')).remove();
  } else if (sourceSystem === 'iroha' || sourceSystem === 'wiki') {
    const docsSelectors = [
      '.sidebar',
      '.vp-sidebar',
      '.vp-doc-outline',
      '.table-of-contents',
      '.page-nav',
      '.breadcrumbs',
      '.nav-links',
    ];
    $(docsSelectors.join(',')).remove();
  }

  return $.html() || rawHtml;
}

function extractMainContentHtml($: CheerioRoot, sourceSystem: SourceSystem): string {
  const selectors: string[] = [];

  if (sourceSystem === 'medium') {
    selectors.push(
      'article [data-test-id="post-content"]',
      'section[data-test-id="post-content"]',
      'div[data-test-id="post-content"]',
      'article',
      'main article',
    );
  } else if (sourceSystem === 'soramitsu') {
    selectors.push(
      'main article',
      'article',
      '.p-article',
      '.c-article',
      '.p-news-detail',
      '.news-detail',
      '.article-detail',
    );
  } else if (sourceSystem === 'tonswap') {
    selectors.push(
      'main article',
      'article',
      '.blog-post',
      '.blog__post',
      '.blog-content',
      '.post-content',
    );
  } else if (sourceSystem === 'iroha') {
    selectors.push(
      'main .vp-doc',
      'main article',
      'article',
      'main .content',
      '.vp-doc',
      '.content',
    );
  } else if (sourceSystem === 'wiki') {
    selectors.push(
      'main .vp-doc',
      'main article',
      'article',
      'main .content',
      '.vp-doc',
      '.content',
    );
  }

  // Generic fallbacks
  selectors.push(
    'article',
    'main',
    '.post-content',
    '.article-body',
    '.blog-post',
  );

  for (const sel of selectors) {
    const node = $(sel).first();
    if (node && node.length) {
      const html = node.html();
      if (html && html.trim()) {
        return html;
      }
    }
  }

  // Fallback: use body
  return $('body').html() || '';
}

async function fetchAndConvertToMarkdown(url: string, sourceSystem: SourceSystem): Promise<{
  title: string;
  publishDateIso: string;
  snapshotId: string;
  markdownBody: string;
  contentSha256: string;
}> {
  const response = await got(url, {
    headers: { 'User-Agent': env.USER_AGENT },
    timeout: { request: env.REQUEST_TIMEOUT },
  });

  const rawHtml = response.body || '';
  const sanitizedHtml = sanitizeArticleHtml(rawHtml, sourceSystem);
  const $ = loadHtml(sanitizedHtml);

  const title = extractTitle($);
  const snapshotId = todaySnapshotId();

  const detectedPublish = extractPublishDateIso($);
  const publishDateIso = detectedPublish ?? new Date(snapshotId + 'T00:00:00Z').toISOString();

  const mainHtml = extractMainContentHtml($, sourceSystem);
  const markdown = td.turndown(mainHtml || sanitizedHtml);
  const normalizedBody = normalizeMarkdownBody(markdown);

  // Use KB's normalization for hashing
  const hashInput = normalizeForHash(normalizedBody);
  const contentSha256 = hashContent(hashInput);

  return {
    title,
    publishDateIso,
    snapshotId,
    markdownBody: normalizedBody,
    contentSha256,
  };
}

async function collectMediumFromHtml(publicationBase: string, state: SyncState): Promise<string[]> {
  const base = publicationBase.replace(/\/$/, '');
  const latestUrl = `${base}/latest`;

  try {
    const response = await got(latestUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: { request: env.REQUEST_TIMEOUT },
    });

    const html = response.body || '';
    const $ = loadHtml(html);

    // Find script tag containing __APOLLO_STATE__
    const script = $('script')
      .toArray()
      .map((el) => $(el).html() || '')
      .find((content) => content.includes('__APOLLO_STATE__'));

    if (!script) {
      log('medium_apollo_missing', { publication: publicationBase });
      return [];
    }

    // Extract JSON from "window.__APOLLO_STATE__ = {...};"
    let jsonText: string | null = null;
    try {
      const startIndex = script.indexOf('{');
      const endIndex = script.lastIndexOf('}');
      if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
        throw new Error('Could not locate JSON object in __APOLLO_STATE__ script');
      }
      jsonText = script.slice(startIndex, endIndex + 1);
      const apolloState = JSON.parse(jsonText) as Record<string, any>;

      const urls = new Set<string>();
      const publicationHost = parseUrl(base).host;

      for (const value of Object.values(apolloState)) {
        if (!value || typeof value !== 'object') continue;
        const typename = (value as any).__typename;
        const mediumUrl = (value as any).mediumUrl as string | undefined;
        if (
          (typename === 'Post' || typename === 'PostPreview') &&
          typeof mediumUrl === 'string' &&
          mediumUrl.length > 0
        ) {
          const cleanUrl = mediumUrl.split('?')[0];
          const parsed = parseUrl(cleanUrl);
          if (!parsed.host || parsed.host !== publicationHost) continue;
          if (parsed.pathname && parsed.pathname.endsWith('/feed')) continue;
          if (state.urls[cleanUrl]) continue;
          urls.add(cleanUrl);
        }
      }

      const result = Array.from(urls);
      if (result.length > 0) {
        log('medium_html_candidates', {
          publication: publicationBase,
          count: result.length,
        });
      }
      return result;
    } catch (error: any) {
      log('medium_html_parse_error', {
        publication: publicationBase,
        error: error?.message ?? String(error),
      });
      return [];
    }
  } catch (error: any) {
    log('medium_html_error', {
      publication: publicationBase,
      url: latestUrl,
      error: error?.message ?? String(error),
    });
    return [];
  }
}

async function collectMediumCandidates(state: SyncState, summary: Summary): Promise<CandidateArticle[]> {
  const seen = new Set<string>();
  const candidates: CandidateArticle[] = [];

  const mediumSources: Array<{ base: string; host: string }> = [
    { base: 'https://sora-xor.medium.com', host: 'sora-xor.medium.com' },
    { base: 'https://polkaswap.medium.com', host: 'polkaswap.medium.com' },
    { base: 'https://fearlesswallet.medium.com', host: 'fearlesswallet.medium.com' },
    { base: 'https://tonswap-org.medium.com', host: 'tonswap-org.medium.com' },
  ];

  for (const pub of mediumSources) {
    const urls = await collectMediumFromHtml(pub.base, state);
    for (const url of urls) {
      if (seen.has(url)) continue;
      seen.add(url);

      const parsed = parseUrl(url);
      if (!parsed.hostname || !parsed.hostname.includes('medium.com')) continue;
      if (parsed.pathname && parsed.pathname.endsWith('/feed')) continue;

      try {
        const {
          title,
          publishDateIso,
          snapshotId,
          markdownBody,
          contentSha256,
        } = await fetchAndConvertToMarkdown(url, 'medium');

        const { sourceKey, secondaryTag } = getSourceKeyAndSecondaryTag('medium', url);
        const prior = state.urls[url];
        const pathSlug =
          (parsed.pathname || '')
            .split('/')
            .filter(Boolean)
            .pop() || 'medium-post';
        const slug = toKebabCaseSlug(title || pathSlug);

        if (!prior) {
          classifyForReport(summary, 'new', {
            url,
            title,
            slug,
            snapshotId,
            publishDateIso,
            contentSha256,
            sourceSystem: 'medium',
            sourceKey,
          });
          candidates.push({
            sourceSystem: 'medium',
            sourceKey,
            url,
            title,
            slug,
            snapshotId,
            publishDateIso,
            markdownBody,
            contentSha256,
            isUpdated: false,
            secondaryTag,
          });
        } else if (prior.content_sha256 !== contentSha256) {
          classifyForReport(summary, 'updated', {
            url,
            title,
            slug,
            snapshotId,
            publishDateIso,
            contentSha256,
            sourceSystem: 'medium',
            sourceKey,
          });
          candidates.push({
            sourceSystem: 'medium',
            sourceKey,
            url,
            title,
            slug,
            snapshotId,
            publishDateIso,
            markdownBody,
            contentSha256,
            isUpdated: true,
            previousSha256: prior.content_sha256,
            secondaryTag,
          });
        } else {
          classifyForReport(summary, 'skipped', {
            url,
            title,
            slug,
            snapshotId,
            publishDateIso,
            contentSha256,
            sourceSystem: 'medium',
            sourceKey,
          });
        }
      } catch (error: any) {
        const { sourceKey } = getSourceKeyAndSecondaryTag('medium', url);
        recordError(summary, 'medium', sourceKey, url, error);
        log('medium_fetch_error', { url, error: error?.message ?? String(error) });
      }
    }
  }

  return candidates;
}

async function fetchSitemapUrls(domain: string): Promise<string[]> {
  const sitemapUrl = `https://${domain}/sitemap.xml`;
  const sitemap = new Sitemapper({
    url: sitemapUrl,
    timeout: env.REQUEST_TIMEOUT,
  });

  try {
    const { sites } = await sitemap.fetch();
    return sites.filter((u) => {
      const parsed = parseUrl(u);
      return parsed.hostname === domain || parsed.hostname === `www.${domain}`;
    });
  } catch (error: any) {
    log('sitemap_error', { domain, error: error?.message ?? String(error) });
    return [];
  }
}

async function collectTonswapCandidates(state: SyncState, summary: Summary): Promise<CandidateArticle[]> {
  const urls = await fetchSitemapUrls('tonswap.org');
  const candidates: CandidateArticle[] = [];

  for (const url of urls) {
    // Skip assets
    if (url.match(/\.(png|jpe?g|svg|webp|gif|ico|css|js)$/i)) continue;

    try {
      const { title, publishDateIso, snapshotId, markdownBody, contentSha256 } =
        await fetchAndConvertToMarkdown(url, 'tonswap');

      const { sourceKey, secondaryTag } = getSourceKeyAndSecondaryTag('tonswap', url);
      const prior = state.urls[url];
      const pathName = (parseUrl(url).pathname || '').split('/').filter(Boolean).pop() || 'tonswap-page';
      const slug = toKebabCaseSlug(title || pathName);

      if (!prior) {
        classifyForReport(summary, 'new', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'tonswap',
          sourceKey,
        });
        candidates.push({
          sourceSystem: 'tonswap',
          sourceKey,
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          markdownBody,
          contentSha256,
          isUpdated: false,
          secondaryTag,
        });
      } else if (prior.content_sha256 !== contentSha256) {
        classifyForReport(summary, 'updated', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'tonswap',
          sourceKey,
        });
        candidates.push({
          sourceSystem: 'tonswap',
          sourceKey,
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          markdownBody,
          contentSha256,
          isUpdated: true,
          previousSha256: prior.content_sha256,
          secondaryTag,
        });
      } else {
        classifyForReport(summary, 'skipped', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'tonswap',
          sourceKey,
        });
      }
    } catch (error: any) {
      const { sourceKey } = getSourceKeyAndSecondaryTag('tonswap', url);
      recordError(summary, 'tonswap', sourceKey, url, error);
      log('tonswap_fetch_error', { url, error: error?.message ?? String(error) });
    }
  }

  return candidates;
}

async function collectSoramitsuCandidates(state: SyncState, summary: Summary): Promise<CandidateArticle[]> {
  const urls = await fetchSitemapUrls('soramitsu.co.jp');
  const candidates: CandidateArticle[] = [];

  for (const url of urls) {
    // Only ingest real news articles under /news/<slug>
    const parsed = parseUrl(url);
    const pathname = parsed.pathname || '';
    if (!pathname.startsWith('/news/')) continue;
    if (url.includes('#')) continue;

    try {
      const { title, publishDateIso, snapshotId, markdownBody, contentSha256 } =
        await fetchAndConvertToMarkdown(url, 'soramitsu');

      const { sourceKey, secondaryTag } = getSourceKeyAndSecondaryTag('soramitsu', url);
      const prior = state.urls[url];
      const pathSlug = pathname.split('/').filter(Boolean).pop() || 'soramitsu-news';
      const slug = toKebabCaseSlug(title || pathSlug);

      if (!prior) {
        classifyForReport(summary, 'new', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'soramitsu',
          sourceKey,
        });
        candidates.push({
          sourceSystem: 'soramitsu',
          sourceKey,
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          markdownBody,
          contentSha256,
          isUpdated: false,
          secondaryTag,
        });
      } else if (prior.content_sha256 !== contentSha256) {
        classifyForReport(summary, 'updated', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'soramitsu',
          sourceKey,
        });
        candidates.push({
          sourceSystem: 'soramitsu',
          sourceKey,
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          markdownBody,
          contentSha256,
          isUpdated: true,
          previousSha256: prior.content_sha256,
          secondaryTag,
        });
      } else {
        classifyForReport(summary, 'skipped', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'soramitsu',
          sourceKey,
        });
      }
    } catch (error: any) {
      const { sourceKey } = getSourceKeyAndSecondaryTag('soramitsu', url);
      recordError(summary, 'soramitsu', sourceKey, url, error);
      log('soramitsu_fetch_error', { url, error: error?.message ?? String(error) });
    }
  }

  return candidates;
}

async function collectIrohaCandidates(state: SyncState, summary: Summary): Promise<CandidateArticle[]> {
  const urls = await fetchSitemapUrls('iroha.tech');
  const candidates: CandidateArticle[] = [];

  for (const url of urls) {
    if (url.match(/\.(png|jpe?g|svg|webp|gif|ico|css|js)$/i)) continue;
    try {
      const { title, publishDateIso, snapshotId, markdownBody, contentSha256 } =
        await fetchAndConvertToMarkdown(url, 'iroha');

      const { sourceKey, secondaryTag } = getSourceKeyAndSecondaryTag('iroha', url);
      const prior = state.urls[url];
      const pathSlug = (parseUrl(url).pathname || '').split('/').filter(Boolean).pop() || 'iroha-page';
      const slug = toKebabCaseSlug(title || pathSlug);

      if (!prior) {
        classifyForReport(summary, 'new', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'iroha',
          sourceKey,
        });
        candidates.push({
          sourceSystem: 'iroha',
          sourceKey,
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          markdownBody,
          contentSha256,
          isUpdated: false,
          secondaryTag,
        });
      } else if (prior.content_sha256 !== contentSha256) {
        classifyForReport(summary, 'updated', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'iroha',
          sourceKey,
        });
        candidates.push({
          sourceSystem: 'iroha',
          sourceKey,
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          markdownBody,
          contentSha256,
          isUpdated: true,
          previousSha256: prior.content_sha256,
          secondaryTag,
        });
      } else {
        classifyForReport(summary, 'skipped', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'iroha',
          sourceKey,
        });
      }
    } catch (error: any) {
      const { sourceKey } = getSourceKeyAndSecondaryTag('iroha', url);
      recordError(summary, 'iroha', sourceKey, url, error);
      log('iroha_fetch_error', { url, error: error?.message ?? String(error) });
    }
  }

  return candidates;
}

async function collectWikiCandidates(state: SyncState, summary: Summary): Promise<CandidateArticle[]> {
  const urls = await fetchSitemapUrls('wiki.sora.org');
  const candidates: CandidateArticle[] = [];

  for (const url of urls) {
    if (url.match(/\.(png|jpe?g|svg|webp|gif|ico|css|js)$/i)) continue;
    try {
      const { title, publishDateIso, snapshotId, markdownBody, contentSha256 } =
        await fetchAndConvertToMarkdown(url, 'wiki');

      const { sourceKey, secondaryTag } = getSourceKeyAndSecondaryTag('wiki', url);
      const prior = state.urls[url];
      const pathSlug = (parseUrl(url).pathname || '').split('/').filter(Boolean).pop() || 'sora-wiki-page';
      const slug = toKebabCaseSlug(title || pathSlug);

      if (!prior) {
        classifyForReport(summary, 'new', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'wiki',
          sourceKey,
        });
        candidates.push({
          sourceSystem: 'wiki',
          sourceKey,
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          markdownBody,
          contentSha256,
          isUpdated: false,
          secondaryTag,
        });
      } else if (prior.content_sha256 !== contentSha256) {
        classifyForReport(summary, 'updated', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'wiki',
          sourceKey,
        });
        candidates.push({
          sourceSystem: 'wiki',
          sourceKey,
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          markdownBody,
          contentSha256,
          isUpdated: true,
          previousSha256: prior.content_sha256,
          secondaryTag,
        });
      } else {
        classifyForReport(summary, 'skipped', {
          url,
          title,
          slug,
          snapshotId,
          publishDateIso,
          contentSha256,
          sourceSystem: 'wiki',
          sourceKey,
        });
      }
    } catch (error: any) {
      const { sourceKey } = getSourceKeyAndSecondaryTag('wiki', url);
      recordError(summary, 'wiki', sourceKey, url, error);
      log('wiki_fetch_error', { url, error: error?.message ?? String(error) });
    }
  }

  return candidates;
}

function buildFrontmatter(article: CandidateArticle): string {
  const baseTags = [
    'sora',
    'nexus',
    'iroha3',
    'ivm',
    'fastpq',
    'dataspaces',
    'updates',
  ];
  const tags = [...baseTags];
  if (article.secondaryTag && !tags.includes(article.secondaryTag)) {
    tags.push(article.secondaryTag);
  }

  const fm = [
    '---',
    `title: "${article.title.replace(/"/g, '\\"')}"`,
    `slug: "${article.slug}"`,
    `source: "update"`,
    `source_url: "${article.url}"`,
    `publishDate: "${article.publishDateIso}"`,
    `snapshot_id: "${article.snapshotId}"`,
    `content_sha256: "${article.contentSha256}"`,
    'tags:',
    ...tags.map((t) => `  - "${t}"`),
    'authority: 1',
    'lang: "en"',
    '---',
    '',
  ];
  return fm.join('\n');
}

function createInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function promptAndWriteArticles(
  candidates: CandidateArticle[],
  state: SyncState,
  options: RunOptions,
): Promise<void> {
  if (candidates.length === 0) {
    console.log('No new or updated articles detected.');
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log('\n=== Articles Requiring Attention (Preview) ===');
  for (const a of candidates) {
    console.log(`\n- Source: ${a.sourceSystem}`);
    console.log(`  URL: ${a.url}`);
    console.log(`  Title: ${a.title}`);
    console.log(`  Slug: ${a.slug}`);
    console.log(`  Snapshot: ${a.snapshotId}`);
    console.log(`  PublishDate: ${a.publishDateIso}`);
    console.log(`  content_sha256: ${a.contentSha256}`);
    if (a.isUpdated && a.previousSha256) {
      console.log(`  previous_sha256: ${a.previousSha256}`);
    }
  }
  console.log('\n=============================================');

  const rl = createInterface();

  try {
    for (const article of candidates) {
      console.log(`\n---\nArticle: ${article.title}\nURL: ${article.url}\nProposed slug: ${article.slug}\n---`);

      let slug = article.slug;
      let outPath = path.join(OUT_DIR, `${slug}.md`);

      if (article.isUpdated) {
        const oldHash = article.previousSha256 || 'unknown';
        const newHash = article.contentSha256;
        let action = await askQuestion(
          rl,
          `Content changed for ${slug}.md (old=${oldHash} new=${newHash}). Update file? (yes/no/version/skip): `,
        );
        action = action.toLowerCase();

        if (action === 'skip' || action === 'no' || action === 'n') {
          console.log('Skipping updated article.');
          continue;
        }

        const writeMain = action === 'yes' || action === 'y' || action === 'version';
        const writeVersion = action === 'version';

        if (!writeMain && !writeVersion) {
          console.log('Unrecognized choice, skipping.');
          continue;
        }

        const frontmatter = buildFrontmatter({ ...article, slug });
        const fileContent = `${frontmatter}${article.markdownBody}\n`;

        if (options.mode === 'dry-run') {
          console.log(`[DRY-RUN] Would update ${outPath}`);
          if (writeVersion) {
            const versionPath = path.join(
              OUT_DIR,
              'versions',
              slug,
              `${article.snapshotId}.md`,
            );
            console.log(`[DRY-RUN] Would write version ${versionPath}`);
          }
        } else {
          await fs.writeFile(outPath, fileContent, 'utf8');
          console.log(`✓ Updated ${outPath}`);

          if (writeVersion) {
            const versionDir = path.join(OUT_DIR, 'versions', slug);
            await fs.mkdir(versionDir, { recursive: true });
            const versionPath = path.join(versionDir, `${article.snapshotId}.md`);
            await fs.writeFile(versionPath, fileContent, 'utf8');
            console.log(`✓ Wrote version ${versionPath}`);
          }

          const now = new Date().toISOString();
          state.urls[article.url] = {
            last_seen: now,
            content_sha256: article.contentSha256,
            updated_at: now,
          };
        }
        continue;
      }

      const exists = await fs
        .access(outPath)
        .then(() => true)
        .catch(() => false);

      if (exists) {
        console.log(`File already exists: ${outPath}`);
        let action = await askQuestion(
          rl,
          'Overwrite existing file, create new slug, or skip? (overwrite/new/skip): ',
        );
        action = action.toLowerCase();

        if (action === 'skip' || action === 'no' || action === 'n') {
          console.log('Skipping article.');
          continue;
        } else if (action === 'overwrite' || action === 'o' || action === 'yes' || action === 'y') {
          // proceed with same slug
        } else if (action === 'new') {
          const newSlug = await askQuestion(rl, 'Enter new slug (kebab-case) or blank to auto-generate: ');
          if (newSlug) {
            slug = toKebabCaseSlug(newSlug);
          } else {
            slug = toKebabCaseSlug(`${article.slug}-${Date.now()}`);
          }
          outPath = path.join(OUT_DIR, `${slug}.md`);
        } else {
          console.log('Unrecognized choice, skipping.');
          continue;
        }
      } else {
        const approve = await askQuestion(rl, 'Approve this update? (yes/no): ');
        const lower = approve.toLowerCase();
        if (!(lower === 'yes' || lower === 'y')) {
          console.log('Skipping article.');
          continue;
        }
      }

      const frontmatter = buildFrontmatter({ ...article, slug });
      const fileContent = `${frontmatter}${article.markdownBody}\n`;

      if (options.mode === 'dry-run') {
        console.log(`[DRY-RUN] Would write ${outPath}`);
      } else {
        await fs.writeFile(outPath, fileContent, 'utf8');
        console.log(`✓ Wrote ${outPath}`);

        const now = new Date().toISOString();
        state.urls[article.url] = {
          last_seen: now,
          content_sha256: article.contentSha256,
          updated_at: now,
        };
      }
    }
  } finally {
    rl.close();
  }
}

function parseRunOptions(argv: string[]): RunOptions {
  const args = new Set(argv);
  const dryRun = args.has('--dry-run');
  const report = args.has('--report');

  if (report) {
    return { mode: 'report' };
  }
  if (dryRun) {
    return { mode: 'dry-run' };
  }
  return { mode: 'interactive' };
}

async function main() {
  const options = parseRunOptions(process.argv.slice(2));
  if (options.mode === 'report') {
    LOG_SILENT = true;
  }

  console.log('Starting semi-automatic KB updates sync (no ingestion will be run).');
  const state = await loadSyncState();
  const summary = initSummary();

  const allCandidates: CandidateArticle[] = [];

  // Collect from each system
  const medium = await collectMediumCandidates(state, summary);
  const tonswap = await collectTonswapCandidates(state, summary);
  const soramitsu = await collectSoramitsuCandidates(state, summary);
  const iroha = await collectIrohaCandidates(state, summary);
  const wiki = await collectWikiCandidates(state, summary);

  allCandidates.push(...medium, ...tonswap, ...soramitsu, ...iroha, ...wiki);

  // De-duplicate by URL
  const byUrl = new Map<string, CandidateArticle>();
  for (const a of allCandidates) {
    if (!byUrl.has(a.url)) {
      byUrl.set(a.url, a);
    }
  }

  const uniqueCandidates = Array.from(byUrl.values());

  if (options.mode === 'report') {
    const report = {
      summary: {
        sources: Object.fromEntries(
          ALL_SOURCE_KEYS.map((k) => {
            const s = summary.stats[k];
            return [
              k,
              {
                new: s.newCount,
                updated: s.updatedCount,
                skipped: s.skippedCount,
                errors: s.errorCount,
              },
            ];
          }),
        ),
        totals: {
          new: summary.newItems.length,
          updated: summary.updatedItems.length,
          skipped: summary.skippedItems.length,
          errors: summary.errors.length,
        },
      },
      new: summary.newItems,
      updated: summary.updatedItems,
      skipped: summary.skippedItems,
      errors: summary.errors,
    };
    // Print JSON report only
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  await promptAndWriteArticles(uniqueCandidates, state, options);

  // Only persist state in interactive mode (no writes in dry-run/report)
  if (options.mode === 'interactive') {
    await saveSyncState(state);
  }

  renderDashboard(summary);

  console.log('\nDone. You can now run:');
  console.log('  pnpm --filter @soranauts/web kb:update');
  console.log('  pnpm --filter @soranauts/web kb:bm25:build');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error in sync_updates.ts:', error);
    process.exit(1);
  });
}


