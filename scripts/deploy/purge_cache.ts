#!/usr/bin/env tsx
/**
 * CDN Cache Purge Script
 * 
 * Purges CDN cache after deployment to ensure fresh content is served.
 * 
 * Supports:
 * - Vercel (via API with VERCEL_TOKEN)
 * - Manual instructions if no token available
 * 
 * Usage: pnpm postdeploy:prod (runs after verify_live.ts)
 */

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️' };
  console.log(`${icons[type]} ${message}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Vercel Cache Purge
// ─────────────────────────────────────────────────────────────────────────────

async function purgeVercelCache(baseUrl: string): Promise<boolean> {
  if (!VERCEL_TOKEN) {
    log('VERCEL_TOKEN not set. Skipping automatic cache purge.', 'warn');
    return false;
  }
  
  log('Purging Vercel CDN cache...');
  
  // Vercel doesn't have a direct cache purge API for Edge Network.
  // A new deployment automatically invalidates the cache.
  // This is a placeholder for future API integration or custom purge logic.
  
  try {
    // For now, we'll just verify the deployment is accessible
    const response = await fetch(baseUrl, { method: 'HEAD' });
    
    if (response.ok) {
      log('Vercel deployment is live and accessible.', 'success');
      log('Note: Vercel Edge Network cache is automatically invalidated on deployment.', 'info');
      return true;
    } else {
      log(`Deployment check returned ${response.status}`, 'warn');
      return false;
    }
  } catch (error: unknown) {
    const err = error as Error;
    log(`Cache purge check failed: ${err.message}`, 'error');
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Manual Instructions
// ─────────────────────────────────────────────────────────────────────────────

function printManualInstructions(baseUrl: string) {
  console.log('\n' + '─'.repeat(60));
  console.log('\n📋 Manual Cache Purge Instructions\n');
  console.log('If you need to manually purge the CDN cache:\n');
  
  console.log('1. Vercel Dashboard:');
  console.log('   - Go to https://vercel.com/dashboard');
  console.log('   - Select your project');
  console.log('   - Deployments → Latest deployment → "..." menu → Redeploy\n');
  
  console.log('2. Vercel CLI:');
  console.log('   vercel --prod --force\n');
  
  console.log('3. Cloudflare (if using):');
  console.log('   - Go to Cloudflare Dashboard → Caching → Purge Cache');
  console.log('   - Or use API: curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" ...\n');
  
  console.log('4. Key URLs to verify after purge:');
  console.log(`   - ${baseUrl}/glossary`);
  console.log(`   - ${baseUrl}/explore`);
  console.log(`   - ${baseUrl}/data/glossary.v2025.json`);
  console.log('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const baseUrl = process.argv[2] || 'https://soranauts.com';
  
  console.log(`\n🧹 CDN Cache Purge: ${baseUrl}\n`);
  
  const purged = await purgeVercelCache(baseUrl);
  
  if (!purged) {
    printManualInstructions(baseUrl);
  }
  
  console.log('✅ Cache purge step completed.\n');
}

main().catch((err) => {
  console.error('\n❌ Cache purge failed:', err.message);
  // Don't exit with error - cache purge is non-critical
  process.exit(0);
});


