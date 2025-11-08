#!/usr/bin/env tsx
import { glob as globAsync } from 'glob';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import sharp from 'sharp';
import { Command } from 'commander';

const program = new Command();
program
  .option('--in <glob>', 'Input glob pattern', 'knowledge_base/**/images/**/*.{jpg,jpeg,png}')
  .option('--out <dir>', 'Output directory', 'knowledge_base/assets/hero')
  .option('--padIfNeeded', 'Pad if crop would lose too much content')
  .option('--target-width <width>', 'Target width', '1600')
  .option('--target-height <height>', 'Target height', '800')
  .option('--json', 'Output JSON summary')
  .parse();

const options = program.opts();
const targetWidth = parseInt(options.targetWidth);
const targetHeight = parseInt(options.targetHeight);
const aspectRatio = targetWidth / targetHeight; // 2:1

interface ImageManifest {
  original: string;
  normalized: string;
  variant: 'crop' | 'letterbox' | 'native';
  original_size: { width: number; height: number };
  normalized_size: { width: number; height: number };
}

async function normalizeImage(inputPath: string, outputDir: string): Promise<ImageManifest | null> {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      console.warn(`  ⚠ Could not read dimensions: ${inputPath}`);
      return null;
    }
    
    const originalAspect = metadata.width / metadata.height;
    const aspectDiff = Math.abs(originalAspect - aspectRatio) / aspectRatio;
    
    let variant: 'crop' | 'letterbox' | 'native';
    let outputBuffer: Buffer;
    
    if (aspectDiff < 0.1) {
      // Within 10% of target - just resize
      variant = 'native';
      outputBuffer = await image
        .resize(targetWidth, targetHeight, { fit: 'fill' })
        .toBuffer();
    } else {
      // Need crop or letterbox
      // Calculate if we'd lose more than 35% height with center crop
      const scaledHeight = metadata.width / aspectRatio;
      const heightLoss = (metadata.height - scaledHeight) / metadata.height;
      
      if (heightLoss > 0.35 && options.padIfNeeded) {
        // Too much content loss - use letterbox
        variant = 'letterbox';
        const resized = await image
          .resize(targetWidth, null, { fit: 'inside' })
          .toBuffer();
        const resizedMeta = await sharp(resized).metadata();
        const topPad = Math.floor((targetHeight - (resizedMeta.height || 0)) / 2);
        const bottomPad = targetHeight - (resizedMeta.height || 0) - topPad;
        
        outputBuffer = await sharp(resized)
          .extend({
            top: topPad,
            bottom: bottomPad,
            left: 0,
            right: 0,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .resize(targetWidth, targetHeight)
          .toBuffer();
      } else {
        // Center crop to target aspect
        variant = 'crop';
        const scaledHeight = Math.floor(metadata.width / aspectRatio);
        const cropY = Math.floor((metadata.height - scaledHeight) / 2);
        
        outputBuffer = await image
          .extract({
            left: 0,
            top: cropY,
            width: metadata.width,
            height: scaledHeight,
          })
          .resize(targetWidth, targetHeight)
          .toBuffer();
      }
    }
    
    const outputPath = join(outputDir, basename(inputPath, extname(inputPath)) + '-hero' + extname(inputPath));
    mkdirSync(dirname(outputPath), { recursive: true });
    await sharp(outputBuffer).toFile(outputPath);
    
    return {
      original: inputPath,
      normalized: outputPath,
      variant,
      original_size: { width: metadata.width, height: metadata.height },
      normalized_size: { width: targetWidth, height: targetHeight },
    };
  } catch (error: any) {
    console.warn(`  ⚠ Error processing ${inputPath}: ${error.message}`);
    return null;
  }
}

async function main() {
  const images = await globAsync(options.in);
  console.log(`Found ${images.length} images to process`);
  
  mkdirSync(options.out, { recursive: true });
  
  const manifest: ImageManifest[] = [];
  let processed = 0;
  let skipped = 0;
  
  for (const imagePath of images) {
    console.log(`  Processing: ${imagePath}`);
    const result = await normalizeImage(imagePath, options.out);
    
    if (result) {
      manifest.push(result);
      processed++;
    } else {
      skipped++;
    }
  }
  
  const manifestPath = join(options.out, 'images_hero.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  if (options.json) {
    console.log(JSON.stringify({
      processed,
      skipped,
      manifest_path: manifestPath,
    }));
  } else {
    console.log(`\n✓ Processed ${processed} images, skipped ${skipped}`);
    console.log(`Manifest: ${manifestPath}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { main };










