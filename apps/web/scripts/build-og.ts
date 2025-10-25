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

    const postPath = path.join(POSTS_DIR, file);
    const fmImage = getFrontmatterImage(postPath);

    let candidate: string | null = null;
    if (fmImage) {
      const cleaned = fmImage.replace(/^~\//, '/'); // normalize "~/" → "/"
      // Try public/ first
      let tryPath = path.join(PUBLIC_DIR, cleaned.replace(/^\//, ''));
      if (!fs.existsSync(tryPath)) {
        const SRC_ASSETS = path.join(SRC_DIR, cleaned.replace(/^\//, ''));
        if (fs.existsSync(SRC_ASSETS)) tryPath = SRC_ASSETS;
      }
      if (fs.existsSync(tryPath)) candidate = tryPath;
    }

    const force = process.env.FORCE_OG === '1';
    if (fs.existsSync(out) && !force) {
      try {
        if (candidate) {
          const srcStat = fs.statSync(candidate);
          const ogStat = fs.statSync(out);
          const isSrcNewer = srcStat.mtimeMs > ogStat.mtimeMs;
          const maybeDifferentSize = srcStat.size !== ogStat.size; // safeguard if mtimes equal
          if (!isSrcNewer && !maybeDifferentSize) {
            console.log(`OG up-to-date: ${slug}`);
            continue;
          }
          console.log(`Rebuilding OG for ${slug} (${isSrcNewer ? 'src newer' : 'size differs'})`);
        } else {
          console.log(`OG exists and no cover found, keeping: ${slug}`);
          continue;
        }
      } catch (e) {
        console.warn(`OG mtime check failed for ${slug}, rebuilding`, (e as Error)?.message);
      }
    } else if (force && fs.existsSync(out)) {
      console.log(`FORCE_OG=1, rebuilding OG for ${slug}`);
    }

    if (candidate) {
      console.log(`Using cover for OG: ${path.relative(ROOT, candidate)}`);
      try { await makeOG(candidate, out); console.log('OG created:', out); continue; }
      catch (e) { console.warn('OG create failed, copying default:', out, (e as Error)?.message); }
    }

    fs.copyFileSync(defaultOG, out);
    console.log('OG fallback copied:', out);
  }

  console.log('Done building OG images.');
}

main().catch(err => { console.error(err); process.exit(1); });
