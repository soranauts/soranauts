#!/usr/bin/env node

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the glossary data directly
import { soraGlossary } from '../src/data/sora-glossary.js';
import { generateGlossarySlug } from '../src/utils/slugify.ts';

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

// Use the unified slugify function

// Generate aliases from term and related terms
function generateAliases(term, relatedTerms) {
  const aliases = new Set();
  
  // Add the term itself
  aliases.add(term);
  
  // Add related terms that might be used as aliases
  relatedTerms.forEach(related => {
    if (related.length <= 20 && !related.includes(' ')) {
      aliases.add(related);
    }
  });
  
  // Add common variations
  if (term.includes(' ')) {
    aliases.add(term.replace(/\s+/g, ''));
  }
  
  return Array.from(aliases);
}

// Generate tags from category and related terms
function generateTags(term, category, relatedTerms) {
  const tags = new Set();
  
  // Add category as tag
  tags.add(category);
  
  // Add related terms as tags (filtered)
  relatedTerms.forEach(related => {
    if (related.length <= 15 && !related.includes(' ')) {
      tags.add(related.toLowerCase());
    }
  });
  
  // Add term variations
  if (term.includes(' ')) {
    const words = term.split(' ');
    words.forEach(word => {
      if (word.length > 2) {
        tags.add(word.toLowerCase());
      }
    });
  }
  
  return Array.from(tags);
}

// Process a single glossary term
function processGlossaryTerm(term, data) {
  const slug = generateGlossarySlug(term);
  const aliases = generateAliases(term, data.relatedTerms || []);
  const tags = generateTags(term, data.category, data.relatedTerms || []);
  const priority = TERM_PRIORITIES[term] || 1;
  
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

// Use the full soraGlossary from the imported data

// Process all glossary terms
function processGlossaryData() {
  const processedTerms = [];
  const categories = {};
  
  // Process each term
  Object.entries(soraGlossary).forEach(([term, data]) => {
    const processedTerm = processGlossaryTerm(term, data);
    processedTerms.push(processedTerm);
    
    // Count categories
    const category = processedTerm.category;
    if (!categories[category]) {
      categories[category] = {
        name: category,
        count: 0,
        description: CATEGORY_DESCRIPTIONS[category],
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
  const jsonData = JSON.stringify(data, null, 2);
  const outputPath = join(__dirname, '../public/glossary.json');
  
  writeFileSync(outputPath, jsonData, 'utf8');
  
  console.log('✅ Glossary JSON generated successfully!');
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Size: ${(jsonData.length / 1024).toFixed(1)} KB`);
  console.log(`📝 Terms: ${data.totalCount}`);
  console.log(`🏷️  Categories: ${Object.keys(data.categories).length}`);
  
} catch (error) {
  console.error('❌ Error generating glossary JSON:', error);
  process.exit(1);
}
