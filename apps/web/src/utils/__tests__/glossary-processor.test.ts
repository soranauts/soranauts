import { describe, it, expect } from 'vitest';
import { 
  processGlossaryData, 
  searchTerms, 
  getTermBySlug, 
  getTermsByCategory,
  getRelatedTerms 
} from '../glossary-processor';

describe('Glossary Processor', () => {
  let glossaryData: any;

  beforeAll(() => {
    glossaryData = processGlossaryData();
  });

  describe('processGlossaryData', () => {
    it('should process all terms correctly', () => {
      expect(glossaryData).toBeDefined();
      expect(glossaryData.terms).toBeInstanceOf(Array);
      expect(glossaryData.totalCount).toBeGreaterThan(0);
      expect(glossaryData.lastUpdated).toBeDefined();
    });

    it('should generate valid slugs', () => {
      glossaryData.terms.forEach((term: any) => {
        expect(term.slug).toBeDefined();
        expect(term.slug).toMatch(/^[a-z0-9-]+$/);
        expect(term.slug).not.toContain('--');
      });
    });

    it('should generate aliases for all terms', () => {
      glossaryData.terms.forEach((term: any) => {
        expect(term.aliases).toBeInstanceOf(Array);
        expect(term.aliases.length).toBeGreaterThan(0);
        expect(term.aliases).toContain(term.term);
      });
    });

    it('should generate tags for all terms', () => {
      glossaryData.terms.forEach((term: any) => {
        expect(term.tags).toBeInstanceOf(Array);
        expect(term.tags.length).toBeGreaterThan(0);
        expect(term.tags).toContain(term.category);
      });
    });

    it('should assign priorities correctly', () => {
      const xorTerm = glossaryData.terms.find((t: any) => t.term === 'XOR');
      expect(xorTerm?.priority).toBe(100);
      
      const blockchainTerm = glossaryData.terms.find((t: any) => t.term === 'Blockchain');
      expect(blockchainTerm?.priority).toBe(5);
    });

    it('should count categories correctly', () => {
      expect(glossaryData.categories).toBeDefined();
      expect(glossaryData.categories.token).toBeDefined();
      expect(glossaryData.categories.token.count).toBeGreaterThan(0);
    });
  });

  describe('searchTerms', () => {
    it('should find terms by name', () => {
      const results = searchTerms('XOR', glossaryData);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].term).toBe('XOR');
    });

    it('should find terms by definition', () => {
      const results = searchTerms('utility token', glossaryData);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.term === 'XOR')).toBe(true);
    });

    it('should find terms by aliases', () => {
      const results = searchTerms('decentralized exchange', glossaryData);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.term === 'DEX')).toBe(true);
    });

    it('should be case insensitive', () => {
      const lowerResults = searchTerms('xor', glossaryData);
      const upperResults = searchTerms('XOR', glossaryData);
      expect(lowerResults.length).toBe(upperResults.length);
    });
  });

  describe('getTermBySlug', () => {
    it('should find term by slug', () => {
      const term = getTermBySlug('xor', glossaryData);
      expect(term).toBeDefined();
      expect(term?.term).toBe('XOR');
    });

    it('should return undefined for non-existent slug', () => {
      const term = getTermBySlug('non-existent', glossaryData);
      expect(term).toBeUndefined();
    });
  });

  describe('getTermsByCategory', () => {
    it('should return terms for valid category', () => {
      const tokenTerms = getTermsByCategory('token', glossaryData);
      expect(tokenTerms.length).toBeGreaterThan(0);
      expect(tokenTerms.every(t => t.category === 'token')).toBe(true);
    });

    it('should return empty array for invalid category', () => {
      const invalidTerms = getTermsByCategory('invalid', glossaryData);
      expect(invalidTerms.length).toBe(0);
    });
  });

  describe('getRelatedTerms', () => {
    it('should return related terms for valid term', () => {
      const related = getRelatedTerms('xor', glossaryData);
      expect(related.length).toBeGreaterThan(0);
      expect(related.length).toBeLessThanOrEqual(5);
    });

    it('should return empty array for non-existent term', () => {
      const related = getRelatedTerms('non-existent', glossaryData);
      expect(related.length).toBe(0);
    });
  });

  describe('slug collision prevention', () => {
    it('should have unique slugs', () => {
      const slugs = glossaryData.terms.map((t: any) => t.slug);
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });
  });
});


