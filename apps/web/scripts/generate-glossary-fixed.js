#!/usr/bin/env node

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the glossary data file directly
const glossaryPath = join(__dirname, '../src/data/sora-glossary.ts');
const glossaryContent = readFileSync(glossaryPath, 'utf8');

// Priority mapping for auto-linking (higher = more important)
const TERM_PRIORITIES = {
  'XOR': 100,
  'VAL': 95,
  'PSWAP': 90,
  'SORA': 85,
  'Polkaswap': 80,
  'SORA Parliament': 75,
  'Hyperledger Iroha': 70,
  'Substrate': 65,
  'Parachain': 60,
  'DeFi': 55,
  'DEX': 50,
  'Liquidity Pool': 45,
  'Staking': 40,
  'Validator': 35,
  'Cross-chain': 30,
  'CBDC': 25,
  'IPFS': 25,
  'Bakong': 20,
  'SORAMITSU': 15,
  'Polkadot': 10,
  'Blockchain': 5,
};

// Category descriptions
const CATEGORY_DESCRIPTIONS = {
  token: 'SORA ecosystem tokens and digital assets',
  technology: 'Blockchain technology, protocols, and technical concepts',
  governance: 'Decision-making systems and governance mechanisms',
  defi: 'Decentralized finance protocols and DeFi concepts',
  network: 'Network infrastructure, consensus, and security',
  economics: 'Economic models, monetary policy, and financial concepts',
};

// Helper to generate a URL-friendly slug
function generateSlug(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with single hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
    .trim();                      // Trim leading/trailing hyphens
}

// Helper to generate aliases for search and linking
function generateAliases(term, relatedTerms) {
  const aliases = new Set();
  
  // Add the term itself
  aliases.add(term);
  
  // Only add meaningful aliases that people actually use
  // For now, we'll be conservative and not add any automatic variations
  // This prevents cluttering the glossary with technical variations like "SmartContract"
  // Real aliases should be manually added to the glossary data if needed
  
  return Array.from(aliases);
}

// Helper to generate tags for filtering
function generateTags(term, category, relatedTerms) {
  const tags = new Set();
  tags.add(category); // Category is always a tag
  
  // Add related terms as tags (lowercase, filtered for relevance)
  relatedTerms.forEach(related => {
    if (related.length <= 15 && !related.includes(' ')) { // Heuristic for relevant tags
      tags.add(related.toLowerCase());
    }
  });
  
  // Add individual words from multi-word terms as tags
  if (term.includes(' ')) {
    const words = term.split(' ');
    words.forEach(word => {
      if (word.length > 2) { // Avoid very short words as tags
        tags.add(word.toLowerCase());
      }
    });
  }
  
  return Array.from(tags);
}

// Process a single glossary term into the new structured format
function processGlossaryTerm(term, data) {
  const slug = generateSlug(term);
  const aliases = generateAliases(term, data.relatedTerms || []);
  const tags = generateTags(term, data.category, data.relatedTerms || []);
  const priority = TERM_PRIORITIES[term] || 1; // Default priority if not specified

  return {
    term,
    slug,
    definition: data.definition,
    category: data.category,
    relatedTerms: data.relatedTerms || [],
    aliases,
    tags,
    examples: data.examples,
    links: data.links,
    priority,
  };
}

// Extract glossary data from TypeScript file content
function extractGlossaryData(content) {
  // Find the soraGlossary object
  const glossaryStart = content.indexOf("export const soraGlossary: Record<string, GlossaryTerm> = {");
  if (glossaryStart === -1) {
    throw new Error('Could not find soraGlossary export');
  }
  
  // Find the matching closing brace
  let braceCount = 0;
  let start = glossaryStart + content.substring(glossaryStart).indexOf('{');
  let end = start;
  
  for (let i = start; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
    } else if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        end = i;
        break;
      }
    }
  }
  
  // Extract the object content
  const objectContent = content.substring(start, end + 1);
  
  // Convert TypeScript object to JavaScript object
  // This is a simplified approach - replace TypeScript-specific syntax
  let jsContent = objectContent
    .replace(/:\s*'([^']+)'\s*\|\s*'([^']+)'/g, ': "$1"') // Union types
    .replace(/:\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'/g, ': "$1"') // Multiple union types
    .replace(/:\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'/g, ': "$1"') // More union types
    .replace(/:\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'/g, ': "$1"') // Even more union types
    .replace(/:\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'\s*\|\s*'([^']+)'/g, ': "$1"') // All union types
    .replace(/term:\s*'([^']+)',/g, 'term: "$1",')
    .replace(/category:\s*'([^']+)',/g, 'category: "$1",')
    .replace(/definition:\s*'([^']+)',/g, 'definition: "$1",');
  
  try {
    // Use Function constructor to safely evaluate the object
    return new Function('return ' + jsContent)();
  } catch (error) {
    console.error('Error parsing glossary data:', error);
    console.error('Problematic content:', jsContent.substring(0, 500));
    throw error;
  }
}

// Main function to process all glossary data and export to JSON
function processGlossaryData() {
  const processedTerms = [];
  const categories = {}; // To store category metadata

  // Extract data from TypeScript file
  const soraGlossary = extractGlossaryData(glossaryContent);

  Object.entries(soraGlossary).forEach(([term, data]) => {
    const processedTerm = processGlossaryTerm(term, data);
    processedTerms.push(processedTerm);

    // Aggregate category data
    const category = processedTerm.category;
    if (!categories[category]) {
      categories[category] = {
        name: category,
        count: 0,
        description: CATEGORY_DESCRIPTIONS[category] || '',
      };
    }
    categories[category].count++;
  });

  // Sort terms by priority (highest first)
  processedTerms.sort((a, b) => b.priority - a.priority);

  return {
    terms: processedTerms,
    categories,
    totalCount: processedTerms.length,
    lastUpdated: new Date().toISOString(),
  };
}

try {
  console.log('🔄 Generating glossary JSON...');
  
  const data = processGlossaryData();
  const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON
  const outputPath = join(__dirname, '../public/glossary.json'); // Output to public folder

  writeFileSync(outputPath, jsonData, 'utf8');
  
  console.log('✅ Glossary JSON generated successfully!');
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Size: ${(jsonData.length / 1024).toFixed(1)} KB`);
  console.log(`📝 Terms: ${data.totalCount}`);
  console.log(`🏷️  Categories: ${Object.keys(data.categories).length}`);
  
} catch (error) {
  console.error('❌ Error generating glossary JSON:', error);
  process.exit(1); // Exit with error code
}


