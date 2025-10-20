import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'post');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OG_DIR = path.join(PUBLIC_DIR, 'og');
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

  for (const slug of posts) {
    const ogPath = path.join(OG_DIR, `${slug}.jpg`);
    if (fs.existsSync(ogPath)) {
      const routePath = routeForSlug(slug).replace(/\/+$/, '') || '/';
      manifest[routePath] = `/og/${slug}.jpg`;
    }
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log('OG manifest written:', MANIFEST, `(${Object.keys(manifest).length} entries)`);
}

main();
