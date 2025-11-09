import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import glossary from '../../public/glossary.json';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('post');
  
  // Ensure site URL doesn't have trailing slash for proper URL construction
  const baseUrl = site?.toString().replace(/\/$/, '') || 'https://soranauts.com';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/glossary</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/donate</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/features</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/changelog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  ${glossary.terms.map(term => `
  <url>
    <loc>${baseUrl}/glossary/${term.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${post.data.updateDate?.toISOString() || post.data.publishDate.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${post.data.image ? `<image:image><image:loc>${baseUrl}${typeof post.data.image === 'string' ? post.data.image.replace('~', '') : post.data.image.src.replace('~', '')}</image:loc><image:title>${post.data.title.replace(/&/g, '&amp;')}</image:title></image:image>` : ''}
    <news:news>
      <news:publication>
        <news:name>Soranauts</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${post.data.publishDate.toISOString()}</news:publication_date>
      <news:title>${post.data.title.replace(/&/g, '&amp;')}</news:title>
    </news:news>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
