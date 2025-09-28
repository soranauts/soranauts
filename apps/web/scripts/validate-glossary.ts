import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const Term = z.object({
  term: z.string(),
  slug: z.string(),
  definition: z.string(),
  category: z.string(),
  aliases: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  relatedTerms: z.array(z.string()).default([]),
  examples: z.array(z.string()).optional(),
  links: z.array(z.object({ 
    label: z.string(), 
    url: z.string().url() 
  })).optional(),
  priority: z.number().default(0)
});

const Glossary = z.object({
  terms: z.array(Term),
  categories: z.record(z.object({
    name: z.string(),
    count: z.number(),
    description: z.string()
  })),
  totalCount: z.number(),
  lastUpdated: z.string()
});

try {
  const glossaryPath = path.join(process.cwd(), 'public', 'glossary.json');
  console.log('🔍 Validating glossary at:', glossaryPath);
  
  if (!fs.existsSync(glossaryPath)) {
    throw new Error(`Glossary file not found at ${glossaryPath}`);
  }
  
  const raw = JSON.parse(fs.readFileSync(glossaryPath, 'utf8'));
  const validatedGlossary = Glossary.parse(raw);
  
  console.log('✅ Glossary validated successfully!');
  console.log(`📊 Terms: ${validatedGlossary.totalCount}`);
  console.log(`🏷️ Categories: ${Object.keys(validatedGlossary.categories).length}`);
  console.log(`📅 Last updated: ${validatedGlossary.lastUpdated}`);
  
  // Additional validation checks
  const slugs = validatedGlossary.terms.map(t => t.slug);
  const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  
  if (duplicateSlugs.length > 0) {
    throw new Error(`Duplicate slugs found: ${duplicateSlugs.join(', ')}`);
  }
  
  console.log('✅ No duplicate slugs found');
  
  // Validate that all categories are referenced
  const referencedCategories = new Set(validatedGlossary.terms.map(t => t.category));
  const definedCategories = new Set(Object.keys(validatedGlossary.categories));
  
  const missingCategories = Array.from(referencedCategories).filter(cat => !definedCategories.has(cat));
  if (missingCategories.length > 0) {
    throw new Error(`Terms reference undefined categories: ${missingCategories.join(', ')}`);
  }
  
  console.log('✅ All categories are properly defined');
  
} catch (error) {
  console.error('❌ Glossary validation failed:', error);
  process.exit(1);
}
