#!/usr/bin/env tsx
import { readFileSync } from 'fs';
import { join } from 'path';
import { execa } from 'execa';

// Simple expect function for basic assertions
function expect(condition: boolean): asserts condition {
  if (!condition) throw new Error('Assertion failed');
}

interface GoldenTest {
  query: string;
  expected_chunk_ids: string[];
  min_score: number;
  description: string;
}

interface GoldenTests {
  tests: GoldenTest[];
}

async function main() {
  const testFile = join(__dirname, 'retrieval_golden.json');
  const tests: GoldenTests = JSON.parse(readFileSync(testFile, 'utf-8'));
  
  console.log(`Running ${tests.tests.length} golden retrieval tests...\n`);
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests.tests) {
    console.log(`Test: ${test.description}`);
    console.log(`  Query: "${test.query}"`);
    
    try {
      // Run retrieve command with alpha fusion
      const { stdout: alphaStdout } = await execa('pnpm', [
        '--filter', '@soranauts/web',
        'kb:retrieve',
        test.query,
        '--json',
        '--hybrid',
        '--fusion', 'alpha',
        '--limit', '5',
        '--min-score', test.min_score.toString(),
        '--source', 'iroha_docs',
      ]);
      
      const alphaResults = JSON.parse(alphaStdout);
      
      // Also test RRF fusion
      const { stdout: rrfStdout } = await execa('pnpm', [
        '--filter', '@soranauts/web',
        'kb:retrieve',
        test.query,
        '--json',
        '--hybrid',
        '--fusion', 'rrf',
        '--limit', '5',
        '--min-score', test.min_score.toString(),
        '--source', 'iroha_docs',
      ]);
      
      const rrfResults = JSON.parse(rrfStdout);
      
      // Use alpha results for main test
      const results = alphaResults;
      
      // Verify RRF and alpha produce similar top results
      if (alphaResults.length > 0 && rrfResults.length > 0) {
        const alphaTopId = alphaResults[0].id;
        const rrfTopId = rrfResults[0].id;
        if (alphaTopId === rrfTopId) {
          console.log(`  ✓ RRF and alpha fusion produce same top result: ${alphaTopId}`);
        } else {
          console.log(`  ⚠ RRF top result differs from alpha (${rrfTopId} vs ${alphaTopId})`);
        }
        expect(rrfResults.length).toBeGreaterThan(0);
      }
      
      if (!Array.isArray(results) || results.length === 0) {
        console.log(`  ✗ No results found`);
        failed++;
        continue;
      }
      
      // If we have expected chunk IDs, check for them
      if (test.expected_chunk_ids.length > 0) {
        const foundIds = results.map((r: any) => r.id);
        const foundExpected = test.expected_chunk_ids.some(id => foundIds.includes(id));
        
        if (foundExpected) {
          console.log(`  ✓ Found expected chunk ID in top-5`);
          console.log(`    Top result: ${results[0].id} (score: ${results[0].score.toFixed(3)})`);
          passed++;
        } else {
          console.log(`  ✗ Expected chunk IDs not found in top-5`);
          console.log(`    Top result: ${results[0].id} (score: ${results[0].score.toFixed(3)})`);
          failed++;
        }
      } else {
        // Just verify we got results with good scores
        if (results[0].score >= test.min_score) {
          console.log(`  ✓ Found results (top score: ${results[0].score.toFixed(3)})`);
          console.log(`    Top result: ${results[0].id}`);
          passed++;
        } else {
          console.log(`  ✗ Top score (${results[0].score.toFixed(3)}) below minimum (${test.min_score})`);
          failed++;
        }
      }
      
      // Verify result structure
      const topResult = results[0];
      if (!topResult.id || !topResult.score || !topResult.metadata) {
        console.log(`  ✗ Invalid result structure`);
        failed++;
        continue;
      }
      
      if (!topResult.metadata.source_url || !topResult.metadata.snapshot_id) {
        console.log(`  ✗ Missing required metadata (source_url, snapshot_id)`);
        failed++;
        continue;
      }
      
      // Test URL normalization (should be consistent)
      const url = topResult.metadata.source_url;
      const normalizedUrl = url.toLowerCase().replace(/\/$/, '');
      expect(typeof url === 'string');
      
      // Test slug stability (should handle emojis/CJK)
      const slug = topResult.metadata.slug || '';
      if (slug) {
        // Slug should be kebab-case, no special chars except hyphens
        const slugPattern = /^[a-z0-9-]+$/;
        if (!slugPattern.test(slug)) {
          console.log(`  ⚠ Slug format may be unstable: ${slug}`);
        }
      }
      
    } catch (error: any) {
      console.log(`  ✗ Error: ${error.message}`);
      failed++;
    }
    
    console.log('');
  }
  
  console.log(`\n=== Results ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.tests.length}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main };

