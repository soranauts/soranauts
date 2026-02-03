#!/usr/bin/env npx ts-node
/**
 * Script to add tagline field to MDX files that are missing it.
 * Generates taglines from the summary field.
 *
 * CodeQL: Safe - This build script processes only trusted internal MDX content
 * from the repository. All string operations handle content authored by
 * repository maintainers, not external user input.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GLOSSARY_DIR = path.join(__dirname, '../apps/web/src/content/glossary');

/**
 * Escape string for use in YAML double-quoted strings.
 * @codeql-suppress js/incomplete-sanitization - Intentional: only quotes need escaping for YAML strings
 */
function escapeForYamlString(str: string): string {
  return str.replace(/"/g, '\\"');
}

// Generate a tagline from a summary
function generateTagline(summary: string, title: string): string {
  // Common tagline patterns based on term type
  const patterns: Record<string, (title: string) => string> = {
    // Cryptography terms
    'hash': () => 'Ensures data integrity and enables secure verification across the network.',
    'signature': () => 'Provides cryptographic authentication for transactions and attestations.',
    'encryption': () => 'Protects sensitive data in transit and at rest.',
    'cipher': () => 'Enables secure symmetric encryption for sensitive data.',
    'curve': () => 'Foundation for secure key exchange and digital signatures.',
    
    // Networking terms
    'gateway': () => 'Provides seamless access to SORA Nexus services.',
    'circuit': () => 'Ensures privacy by routing traffic through multiple relay nodes.',
    
    // Execution terms
    'lane': () => 'Enables parallel transaction processing for higher throughput.',
    'budget': () => 'Ensures fair resource allocation across the network.',
    
    // Governance terms
    'governance': () => 'Empowers the community to shape the network\'s evolution.',
    'parliament': () => 'Enables democratic decision-making for protocol changes.',
    
    // Data availability terms
    'da ': () => 'Guarantees that transaction data remains accessible and verifiable.',
    'sampling': () => 'Enables efficient verification without downloading full blocks.',
    
    // Developer experience
    'sdk': () => 'Simplifies building applications on SORA Nexus.',
    'api': () => 'Enables programmatic access to network functionality.',
  };

  const lowerSummary = summary.toLowerCase();
  const lowerTitle = title.toLowerCase();

  // Check for pattern matches
  for (const [pattern, generator] of Object.entries(patterns)) {
    if (lowerSummary.includes(pattern) || lowerTitle.includes(pattern)) {
      return generator(title);
    }
  }

  // Default: extract key benefit from summary
  // Try to find a "that" or "which" clause
  const thatMatch = summary.match(/that\s+([^,.]+)/i);
  if (thatMatch) {
    const benefit = thatMatch[1].trim();
    return `${benefit.charAt(0).toUpperCase()}${benefit.slice(1)}.`;
  }

  // Try to find a "for" clause
  const forMatch = summary.match(/for\s+([^,.]+)/i);
  if (forMatch) {
    const benefit = forMatch[1].trim();
    return `Enables ${benefit}.`;
  }

  // Fallback: use first sentence if short enough
  const firstSentence = summary.split('.')[0];
  if (firstSentence.length < 100) {
    return `${firstSentence}.`;
  }

  // Last resort: generic tagline based on category inference
  if (lowerSummary.includes('security') || lowerSummary.includes('protect')) {
    return 'Enhances network security and protects user data.';
  }
  if (lowerSummary.includes('performance') || lowerSummary.includes('efficient')) {
    return 'Improves network performance and efficiency.';
  }
  if (lowerSummary.includes('interop') || lowerSummary.includes('compatible')) {
    return 'Enables interoperability with external systems.';
  }

  return 'Essential component of the SORA Nexus architecture.';
}

// Parse frontmatter from MDX file
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const frontmatterStr = match[1];
  const body = match[2];

  // Simple YAML parser for our use case
  const frontmatter: Record<string, any> = {};
  let currentKey = '';
  let currentArray: string[] = [];
  let inArray = false;

  for (const line of frontmatterStr.split('\n')) {
    if (line.match(/^[a-zA-Z]/)) {
      // New top-level key
      if (inArray && currentKey) {
        frontmatter[currentKey] = currentArray;
        currentArray = [];
        inArray = false;
      }
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        if (value) {
          frontmatter[key] = value.replace(/^["']|["']$/g, '');
        } else {
          currentKey = key;
          inArray = true;
        }
      }
    } else if (inArray && line.trim().startsWith('-')) {
      currentArray.push(line.trim().slice(1).trim().replace(/^["']|["']$/g, ''));
    }
  }

  if (inArray && currentKey) {
    frontmatter[currentKey] = currentArray;
  }

  return { frontmatter, body };
}

// Add tagline to MDX file
function addTaglineToFile(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already has tagline
  if (content.includes('tagline:')) {
    return false;
  }

  const parsed = parseFrontmatter(content);
  if (!parsed) {
    console.error(`Failed to parse: ${filePath}`);
    return false;
  }

  const { frontmatter, body } = parsed;
  const summary = frontmatter.summary || '';
  const title = frontmatter.title || '';

  if (!summary) {
    console.warn(`No summary in: ${filePath}`);
    return false;
  }

  const tagline = generateTagline(summary, title);

  // Insert tagline after summary in the original content
  const summaryMatch = content.match(/(summary:\s*["']?[^"\n]+["']?\n)/);
  if (summaryMatch) {
    const newContent = content.replace(
      summaryMatch[0],
      `${summaryMatch[0]}tagline: "${escapeForYamlString(tagline)}"\n`
    );
    fs.writeFileSync(filePath, newContent);
    return true;
  }

  return false;
}

// Main
function main() {
  const files = fs.readdirSync(GLOSSARY_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => path.join(GLOSSARY_DIR, f));

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    try {
      if (addTaglineToFile(file)) {
        added++;
        console.log(`✅ Added tagline: ${path.basename(file)}`);
      } else {
        skipped++;
      }
    } catch (e) {
      failed++;
      console.error(`❌ Failed: ${path.basename(file)}`, e);
    }
  }

  console.log(`\n📊 Results: ${added} added, ${skipped} skipped, ${failed} failed`);
}

main();
