import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd());
const PUBLIC_DIR = path.join(ROOT, 'public');
const OG_DIR = path.join(PUBLIC_DIR, 'og');
const WIDTH = 1200, HEIGHT = 630;

async function ensureDir(d: string) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

async function makeOG(srcAbs: string, outAbs: string) {
  let quality = 82;
  for (let i = 0; i < 4; i++) {
    const buf = await sharp(srcAbs)
      .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'attention' })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (buf.length <= 1_000_000 || quality <= 60) {
      await sharp(buf).toFile(outAbs);
      console.log(`✅ Generated ${outAbs} (${(buf.length / 1024).toFixed(1)} KB, quality: ${quality})`);
      return;
    }
    quality -= 6; // step down to hit <1MB
  }
}

async function main() {
  await ensureDir(OG_DIR);
  
  // Check if source image exists (could be in multiple locations)
  const possibleSources = [
    path.join(OG_DIR, 'glossary.jpg'), // Current location
    path.join(PUBLIC_DIR, 'sora-glossary-social-share.jpg'), // Old location
    path.join(PUBLIC_DIR, 'glossary.jpg'), // Alternative location
  ];
  
  let sourceImage: string | null = null;
  for (const src of possibleSources) {
    if (fs.existsSync(src)) {
      sourceImage = src;
      break;
    }
  }
  
  if (!sourceImage) {
    console.error('❌ Source glossary image not found. Please create a source image first.');
    console.error('   Expected locations:');
    possibleSources.forEach(p => console.error(`   - ${p}`));
    process.exit(1);
  }
  
  const outputPath = path.join(OG_DIR, 'glossary.jpg');
  console.log(`🔄 Regenerating glossary OG image from: ${path.relative(ROOT, sourceImage)}`);
  
  try {
    await makeOG(sourceImage, outputPath);
    console.log('✅ Glossary OG image regenerated successfully!');
  } catch (err) {
    console.error('❌ Error regenerating glossary OG image:', err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});










