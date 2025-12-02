import type { APIRoute, ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';

import glossary from '../../public/glossary.json';
import { env } from '../server/env';
import { getAllTagHubViewModels } from '../lib/tag-hub';
import { shouldIndexTagPage } from '../lib/tag-pages';

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  image?: { loc: string; title?: string };
  news?: { publicationDate: string; title: string };
};

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const formatUrl = (baseUrl: string, path: string): string => {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const cleanedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${cleanedPath}`;
};

const formatDate = (value?: Date | string | null): string | undefined => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;
  return date.toISOString();
};

const serializeEntry = (entry: SitemapEntry): string => {
  const parts = [
    '<url>',
    `<loc>${escapeXml(entry.loc)}</loc>`,
    entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '',
    entry.changefreq ? `<changefreq>${escapeXml(entry.changefreq)}</changefreq>` : '',
    entry.priority ? `<priority>${escapeXml(entry.priority)}</priority>` : '',
    entry.image
      ? `<image:image><image:loc>${escapeXml(entry.image.loc)}</image:loc>${
          entry.image.title ? `<image:title>${escapeXml(entry.image.title)}</image:title>` : ''
        }</image:image>`
      : '',
    entry.news
      ? `<news:news>
      <news:publication>
        <news:name>Soranauts</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(entry.news.publicationDate)}</news:publication_date>
      <news:title>${escapeXml(entry.news.title)}</news:title>
    </news:news>`
      : '',
    '</url>',
  ];
  return parts.filter(Boolean).join('');
};

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('post');
  const isExplorerEnabled = env.TAG_HUB_V1;
  const baseUrl = site?.toString() || 'https://soranauts.com';

  const entries: SitemapEntry[] = [
    { loc: formatUrl(baseUrl, '/'), lastmod: formatDate(new Date()), changefreq: 'daily', priority: '1.0' },
    { loc: formatUrl(baseUrl, '/blog'), lastmod: formatDate(new Date()), changefreq: 'daily', priority: '0.9' },
    { loc: formatUrl(baseUrl, '/about'), lastmod: formatDate(new Date()), changefreq: 'monthly', priority: '0.8' },
    { loc: formatUrl(baseUrl, '/glossary'), lastmod: formatDate(new Date()), changefreq: 'weekly', priority: '0.9' },
    { loc: formatUrl(baseUrl, '/donate'), lastmod: formatDate(new Date()), changefreq: 'monthly', priority: '0.6' },
    { loc: formatUrl(baseUrl, '/features'), lastmod: formatDate(new Date()), changefreq: 'monthly', priority: '0.6' },
    { loc: formatUrl(baseUrl, '/privacy'), lastmod: formatDate(new Date()), changefreq: 'yearly', priority: '0.4' },
    { loc: formatUrl(baseUrl, '/terms'), lastmod: formatDate(new Date()), changefreq: 'yearly', priority: '0.4' },
  ];

const glossaryTerms: Array<{ slug: string }> = Array.isArray(glossary)
  ? glossary
  : Array.isArray((glossary as { terms?: Array<{ slug: string }> }).terms)
    ? (glossary as { terms: Array<{ slug: string }> }).terms
    : [];

if (isExplorerEnabled) {
    entries.push({
      loc: formatUrl(baseUrl, '/explore'),
      lastmod: formatDate(new Date()),
      changefreq: 'daily',
      priority: '0.9',
    });
  }

  for (const term of glossaryTerms) {
    entries.push({
      loc: formatUrl(baseUrl, `/glossary/${term.slug}`),
      lastmod: formatDate(new Date()),
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  for (const post of posts) {
    const publishDate = formatDate(post.data.publishDate);
    const updateDate = formatDate(post.data.updateDate);
    const lastmod = updateDate ?? publishDate ?? formatDate(new Date());

    const image = post.data.image as string | ImageMetadata | undefined;
    let imageLoc: string | undefined;
    if (typeof image === 'string') {
      imageLoc = formatUrl(baseUrl, image.replace(/^~/, ''));
    } else if (image && typeof image === 'object' && 'src' in image) {
      const metadata = image as ImageMetadata;
      imageLoc = formatUrl(baseUrl, metadata.src.replace(/^~/, ''));
    }

    entries.push({
      loc: formatUrl(baseUrl, `/${post.slug}`),
      lastmod,
      changefreq: 'weekly',
      priority: '0.8',
      image: imageLoc ? { loc: imageLoc, title: post.data.title } : undefined,
      news: publishDate
        ? {
            publicationDate: publishDate,
            title: post.data.title,
          }
        : undefined,
    });
  }

  if (isExplorerEnabled) {
    const tagViewModels = getAllTagHubViewModels();
    for (const tag of tagViewModels) {
      const shouldIndex = shouldIndexTagPage(tag.usageCount ?? 0, Boolean(tag.summary), Boolean(tag.glossaryRef));
      if (!shouldIndex) continue;

      const slug = tag.slug.replace(/^tag-/, '');
      entries.push({
        loc: formatUrl(baseUrl, `/tag/${slug}`),
        lastmod: formatDate(tag.lastSeen ?? tag.firstSeen),
        changefreq: 'weekly',
        priority: '0.7',
      });
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(serializeEntry).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
