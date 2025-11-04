import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'post');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OG_DIR = path.join(PUBLIC_DIR, 'og');
const OG_GLOSSARY_DIR = path.join(OG_DIR, 'glossary');
const MANIFEST = path.join(OG_DIR, 'manifest.json');
const routeForSlug = (slug: string) => `/${slug}`; // adjust if needed

function main() {
  if (!fs.existsSync(OG_DIR)) fs.mkdirSync(OG_DIR, { recursive: true });
  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const posts = entries
    .filter((e) => e.isFile() && /\.mdx?$/i.test(e.name))
    .map((e) => e.name.replace(/\.mdx?$/i, ''));

  const manifest: Record<string, string> = {
    default: '/og/default.jpg',
    '/': '/og/default.jpg',
  };

  // Add blog post OG images
  for (const slug of posts) {
    const ogPath = path.join(OG_DIR, `${slug}.jpg`);
    if (fs.existsSync(ogPath)) {
      const routePath = routeForSlug(slug).replace(/\/+$/, '') || '/';
      manifest[routePath] = `/og/${slug}.jpg`;
    }
  }

  // Add main glossary page OG image
  const glossaryOgPath = path.join(OG_DIR, 'glossary.jpg');
  if (fs.existsSync(glossaryOgPath)) {
    manifest['/glossary'] = '/og/glossary.jpg';
  }

  // Add individual glossary term OG images
  if (fs.existsSync(OG_GLOSSARY_DIR)) {
    const glossaryEntries = fs.readdirSync(OG_GLOSSARY_DIR, { withFileTypes: true });
    const glossaryTerms = glossaryEntries
      .filter((e) => e.isFile() && /\.jpg$/i.test(e.name))
      .map((e) => e.name.replace(/\.jpg$/i, ''));
    
    for (const termSlug of glossaryTerms) {
      const termOgPath = path.join(OG_GLOSSARY_DIR, `${termSlug}.jpg`);
      if (fs.existsSync(termOgPath)) {
        manifest[`/glossary/${termSlug}`] = `/og/glossary/${termSlug}.jpg`;
      }
    }
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log('OG manifest written:', MANIFEST, `(${Object.keys(manifest).length} entries)`);
}

main();
