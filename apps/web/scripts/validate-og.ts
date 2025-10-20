import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd());
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'post');
const OG_DIR = path.join(ROOT, 'public', 'og');
const MAX_BYTES = 1_000_000; // 1 MB
const REQ_W = 1200;
const REQ_H = 630;

function toSlug(file: string): string {
  return file.replace(/\.mdx?$/i, '');
}

async function validateImage(fp: string, name: string, errors: string[]) {
  const stat = fs.statSync(fp);
  if (stat.size > MAX_BYTES) errors.push(`OG too large (>1MB): /public/og/${name} (${stat.size} bytes)`);
  const meta = await sharp(fp).metadata();
  if (meta.width !== REQ_W || meta.height !== REQ_H) {
    errors.push(`OG must be ${REQ_W}x${REQ_H}: /public/og/${name} (${meta.width}x${meta.height})`);
  }
}

async function main() {
  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const posts = entries.filter((e) => e.isFile() && /\.mdx?$/i.test(e.name)).map((e) => e.name);
  const errors: string[] = [];

  for (const file of posts) {
    const slug = toSlug(file);
    const expected = path.join(OG_DIR, `${slug}.jpg`);
    if (!fs.existsSync(expected)) { errors.push(`Missing OG image: /public/og/${slug}.jpg`); continue; }
    await validateImage(expected, `${slug}.jpg`, errors);
  }

  const def = path.join(OG_DIR, 'default.jpg');
  if (!fs.existsSync(def)) errors.push('Missing OG default: /public/og/default.jpg');
  else await validateImage(def, 'default.jpg', errors);

  if (errors.length) {
    console.error('\nOG validation failed:');
    for (const err of errors) console.error(' -', err);
    process.exit(1);
  }

  console.log('OG validation passed for', posts.length, 'posts.');
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection in OG validator:', err);
  process.exit(1);
});

main();



