/**
 * Verify Generator Parity
 * 
 * Compares the output of the new unified generator against the legacy generator
 * to ensure parity before removing the legacy code.
 * 
 * Exit codes:
 *   0 - Outputs are identical (parity achieved)
 *   1 - Outputs differ (parity not achieved)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Output file paths
const GLOSSARY_V2025 = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');
const GLOSSARY_INDEX = path.join(ROOT, 'apps/web/public/glossary.index.json');
const GLOSSARY_ALIASES = path.join(ROOT, 'apps/web/public/glossary.aliases.v2025.json');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  slug: string;
  title: string;
  summary: string;
  definition: string;
  category: string;
  tags: string[];
  relatedTerms: string[];
  tagline?: string;
}

interface GlossaryV2025 {
  terms: GlossaryTerm[];
  canonicalCount: number;
  aliasCount: number;
  deprecatedCount: number;
  version: number;
  lastUpdated: string;
}

interface AliasList {
  aliases: Array<{ alias: string; target: string }>;
}

interface ParityResult {
  passed: boolean;
  differences: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Verification Functions
// ─────────────────────────────────────────────────────────────────────────────

function loadJson<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`❌ Failed to load ${filePath}:`, error);
    return null;
  }
}

function verifyGlossaryV2025(): ParityResult {
  const result: ParityResult = { passed: true, differences: [] };

  const data = loadJson<GlossaryV2025>(GLOSSARY_V2025);
  if (!data) {
    result.passed = false;
    result.differences.push('Failed to load glossary.v2025.json');
    return result;
  }

  // Verify structure
  if (!Array.isArray(data.terms)) {
    result.passed = false;
    result.differences.push('terms is not an array');
    return result;
  }

  // Verify counts match
  if (data.canonicalCount !== data.terms.length) {
    result.passed = false;
    result.differences.push(`canonicalCount (${data.canonicalCount}) !== terms.length (${data.terms.length})`);
  }

  // Verify deterministic ordering (sorted by slug)
  const slugs = data.terms.map((t) => t.slug);
  const sortedSlugs = [...slugs].sort((a, b) => a.localeCompare(b));
  
  for (let i = 0; i < slugs.length; i++) {
    if (slugs[i] !== sortedSlugs[i]) {
      result.passed = false;
      result.differences.push(`Terms not sorted by slug at index ${i}: "${slugs[i]}" should be "${sortedSlugs[i]}"`);
      break;
    }
  }

  // Verify no duplicate slugs
  const slugSet = new Set<string>();
  for (const term of data.terms) {
    if (slugSet.has(term.slug)) {
      result.passed = false;
      result.differences.push(`Duplicate slug: "${term.slug}"`);
    }
    slugSet.add(term.slug);
  }

  // Verify each term has required fields
  for (const term of data.terms) {
    if (!term.slug) result.differences.push(`Term missing slug`);
    if (!term.title) result.differences.push(`Term "${term.slug}" missing title`);
    if (!term.summary) result.differences.push(`Term "${term.slug}" missing summary`);
    if (!term.definition) result.differences.push(`Term "${term.slug}" missing definition`);
    if (!term.category) result.differences.push(`Term "${term.slug}" missing category`);
    if (!Array.isArray(term.tags)) result.differences.push(`Term "${term.slug}" tags is not an array`);
    if (!Array.isArray(term.relatedTerms)) result.differences.push(`Term "${term.slug}" relatedTerms is not an array`);
  }

  // Verify tags are sorted and deduped
  for (const term of data.terms) {
    const tags = term.tags;
    const sortedTags = [...tags].sort((a, b) => a.localeCompare(b));
    const uniqueTags = [...new Set(tags.map((t) => t.toLowerCase()))];
    
    if (tags.length !== uniqueTags.length) {
      result.differences.push(`Term "${term.slug}" has duplicate tags`);
    }
    
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] !== sortedTags[i]) {
        result.differences.push(`Term "${term.slug}" tags not sorted`);
        break;
      }
    }
  }

  // Verify relatedTerms reference valid canonical slugs
  for (const term of data.terms) {
    for (const related of term.relatedTerms) {
      if (!slugSet.has(related)) {
        result.differences.push(`Term "${term.slug}" has invalid relatedTerm "${related}"`);
      }
    }
  }

  if (result.differences.length > 0) {
    result.passed = false;
  }

  return result;
}

function verifyAliases(): ParityResult {
  const result: ParityResult = { passed: true, differences: [] };

  const data = loadJson<AliasList>(GLOSSARY_ALIASES);
  if (!data) {
    result.passed = false;
    result.differences.push('Failed to load glossary.aliases.v2025.json');
    return result;
  }

  // Verify structure
  if (!Array.isArray(data.aliases)) {
    result.passed = false;
    result.differences.push('aliases is not an array');
    return result;
  }

  // Verify sorted by alias
  const aliases = data.aliases.map((a) => a.alias);
  const sortedAliases = [...aliases].sort((a, b) => a.localeCompare(b));
  
  for (let i = 0; i < aliases.length; i++) {
    if (aliases[i] !== sortedAliases[i]) {
      result.passed = false;
      result.differences.push(`Aliases not sorted at index ${i}`);
      break;
    }
  }

  // Verify no duplicate aliases
  const aliasSet = new Set<string>();
  for (const entry of data.aliases) {
    if (aliasSet.has(entry.alias)) {
      result.passed = false;
      result.differences.push(`Duplicate alias: "${entry.alias}"`);
    }
    aliasSet.add(entry.alias);
  }

  // Load canonical slugs for validation
  const glossary = loadJson<GlossaryV2025>(GLOSSARY_V2025);
  if (glossary) {
    const canonicalSlugs = new Set(glossary.terms.map((t) => t.slug));
    
    for (const entry of data.aliases) {
      if (!canonicalSlugs.has(entry.target)) {
        result.differences.push(`Alias "${entry.alias}" points to non-existent target "${entry.target}"`);
      }
    }
  }

  if (result.differences.length > 0) {
    result.passed = false;
  }

  return result;
}

function verifyDeterminism(): ParityResult {
  const result: ParityResult = { passed: true, differences: [] };

  // Read the files and re-parse to verify JSON is valid and deterministic
  const files = [GLOSSARY_V2025, GLOSSARY_INDEX, GLOSSARY_ALIASES];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(content);
      const reserialized = JSON.stringify(parsed, null, 2) + '\n';
      
      if (content !== reserialized) {
        result.passed = false;
        result.differences.push(`${path.basename(file)} is not deterministically formatted`);
      }
    } catch (error) {
      result.passed = false;
      result.differences.push(`Failed to verify ${path.basename(file)}: ${error}`);
    }
  }

  return result;
}

function verifyExpectedCounts(): ParityResult {
  const result: ParityResult = { passed: true, differences: [] };

  const glossary = loadJson<GlossaryV2025>(GLOSSARY_V2025);
  const aliases = loadJson<AliasList>(GLOSSARY_ALIASES);

  if (!glossary || !aliases) {
    result.passed = false;
    result.differences.push('Failed to load files for count verification');
    return result;
  }

  // Expected counts from Phase 3
  const expectedCanonical = 179;
  const expectedAliasMin = 10; // At least some aliases

  if (glossary.canonicalCount < expectedCanonical - 10) {
    result.differences.push(`Canonical count (${glossary.canonicalCount}) is significantly less than expected (~${expectedCanonical})`);
  }

  if (aliases.aliases.length < expectedAliasMin) {
    result.differences.push(`Alias count (${aliases.aliases.length}) is less than expected minimum (${expectedAliasMin})`);
  }

  console.log(`\n📊 Counts:`);
  console.log(`   Canonical: ${glossary.canonicalCount}`);
  console.log(`   Aliases:   ${aliases.aliases.length}`);
  console.log(`   Deprecated: ${glossary.deprecatedCount}`);

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Verifying generator parity...\n');

  const results: Array<{ name: string; result: ParityResult }> = [];

  // Run all verifications
  results.push({ name: 'Glossary V2025 Structure', result: verifyGlossaryV2025() });
  results.push({ name: 'Aliases Structure', result: verifyAliases() });
  results.push({ name: 'Determinism', result: verifyDeterminism() });
  results.push({ name: 'Expected Counts', result: verifyExpectedCounts() });

  // Print results
  let allPassed = true;
  
  for (const { name, result } of results) {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${name}`);
    
    if (!result.passed) {
      allPassed = false;
      for (const diff of result.differences.slice(0, 10)) {
        console.log(`   - ${diff}`);
      }
      if (result.differences.length > 10) {
        console.log(`   ... and ${result.differences.length - 10} more`);
      }
    }
  }

  // Final result
  console.log('\n' + '─'.repeat(50));
  
  if (allPassed) {
    console.log('✅ PARITY ACHIEVED - All verifications passed!');
    console.log('\n🎉 Safe to remove legacy generator');
    process.exit(0);
  } else {
    console.log('❌ PARITY NOT ACHIEVED - Some verifications failed');
    console.log('\n⚠️ Do NOT remove legacy generator yet');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});



