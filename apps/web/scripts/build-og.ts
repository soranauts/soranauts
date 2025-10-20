import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd());
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'post');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OG_DIR = path.join(PUBLIC_DIR, 'og');
const SRC_DIR = path.join(ROOT, 'src');
const WIDTH = 1200, HEIGHT = 630;

function getFrontmatterImage(filePath: string): string | null {
  const raw = fs.readFileSync(filePath, 'utf8');
  const m = raw.match(/^\s*image:\s*["']?(.+?)["']?\s*$/m);
  return m ? m[1] : null;
}

async function ensureDir(d: string) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

async function makeOG(srcAbs: string, outAbs: string) {
  let quality = 82;
  for (let i = 0; i < 4; i++) {
    const buf = await sharp(srcAbs)
      .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'attention' })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (buf.length <= 1_000_000 || quality <= 60) {
      await sharp(buf).toFile(outAbs);
      return;
    }
    quality -= 6; // step down to hit <1MB
  }
}

async function main() {
  await ensureDir(OG_DIR);
  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const posts = entries.filter(e => e.isFile() && /\.mdx?$/i.test(e.name)).map(e => e.name);
  const defaultOG = path.join(OG_DIR, 'default.jpg');
  if (!fs.existsSync(defaultOG)) { console.error('Missing /public/og/default.jpg — create this first.'); process.exit(1); }

  for (const file of posts) {
    const slug = file.replace(/\.mdx?$/i, '');
    const out = path.join(OG_DIR, `${slug}.jpg`);
    if (fs.existsSync(out)) continue;

    const postPath = path.join(POSTS_DIR, file);
    const fmImage = getFrontmatterImage(postPath);
    if (fmImage) {
      const cleaned = fmImage.replace(/^~\//, '/'); // normalize "~/" → "/"
      // Try public/ first
      let candidate = path.join(PUBLIC_DIR, cleaned.replace(/^\//, ''));
      // Fallback: try src/assets when frontmatter uses ~/assets/…
      if (!fs.existsSync(candidate)) {
        const SRC_ASSETS = path.join(SRC_DIR, cleaned.replace(/^\//, ''));
        if (fs.existsSync(SRC_ASSETS)) candidate = SRC_ASSETS;
      }
      if (fs.existsSync(candidate)) {
        console.log(`Using cover for OG: ${cleaned}`);
        try { await makeOG(candidate, out); console.log('OG created:', out); continue; }
        catch (e) { console.warn('OG create failed, copying default:', out, (e as Error)?.message); }
      }
    }

    fs.copyFileSync(defaultOG, out);
    console.log('OG fallback copied:', out);
  }

  console.log('Done building OG images.');
}

main().catch(err => { console.error(err); process.exit(1); });
