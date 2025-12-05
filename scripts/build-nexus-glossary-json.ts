/**
 * Unified Glossary Generator (Single Source of Truth)
 * 
 * Generates deterministic glossary JSON from MDX content files.
 * 
 * Features:
 * - Normalizes titles (TitleCase), slugs (lowercase), categories (Title Case)
 * - Stable sorts tags alphabetically, dedupes
 * - Validates related terms exist and resolves aliases → canonical
 * - Produces deterministic JSON (same ordering every build)
 * 
 * Outputs:
 *   - apps/web/public/data/glossary.v2025.json
 *   - apps/web/public/glossary.json
 *   - apps/web/public/glossary.index.json
 *   - apps/web/public/glossary.aliases.v2025.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'apps/web/src/content/glossary');
const TAXONOMY_PATH = path.join(ROOT, 'apps/web/src/data/taxonomy.ts');
const TAG_HUB_CONFIG_PATH = path.join(ROOT, 'apps/web/src/data/tag-hub.config.ts');
const GLOSSARY_DEFINITIONS_PATH = path.join(ROOT, 'apps/web/scripts/utils/glossary-definitions.ts');
const OUT_DATA = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');
const OUT_FULL = path.join(ROOT, 'apps/web/public/glossary.json');
const OUT_INDEX = path.join(ROOT, 'apps/web/public/glossary.index.json');
const OUT_ALIASES = path.join(ROOT, 'apps/web/public/glossary.aliases.v2025.json');
const OUT_TERMS_DIR = path.join(ROOT, 'apps/web/public/data/glossary/terms');
const OUT_MINIMAL_INDEX = path.join(ROOT, 'apps/web/public/data/glossary.minimal.json');

// Flag to include taxonomy terms (SORA ecosystem terms like XOR, Polkaswap, etc.)
const INCLUDE_TAXONOMY_TERMS = true;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface FrontMatter {
  title: string;
  slug: string;
  category: string;
  tags?: string[];
  summary: string;
  related?: string[];
  tagline?: string;
  aliases?: string[];
  status?: 'canonical' | 'alias' | 'deprecated';
  targetSlug?: string;
}

interface CanonicalTerm {
  slug: string;
  title: string;
  summary: string;
  status: 'canonical';
  targetSlug: null;
  definition: string;
  category: string;
  aliases: string[];
  tags: string[];
  relatedTerms: string[];
  examples: string[];
  links: Array<{ label: string; url: string }>;
  tagline?: string;
}

interface AliasTerm {
  alias: string;
  target: string;
}

interface GeneratorStats {
  canonicalCount: number;
  aliasCount: number;
  deprecatedCount: number;
  warnings: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalization Utilities
// ─────────────────────────────────────────────────────────────────────────────

const ACRONYMS = new Set([
  'IVM', 'WSV', 'TEU', 'BFT', 'QC', 'VRF', 'DA', 'QUIC', 'PQ', 'XOR', 'VAL',
  'PSWAP', 'TBCD', 'NFT', 'AMM', 'LP', 'DEX', 'DeFi', 'API', 'ABI', 'SDK',
  'SORA', 'DSID', 'CID', 'SSE', 'gRPC', 'REST', 'CBDC', 'NPoS', 'PoS', 'ID',
  'JSON', 'HTTP', 'HTTPS', 'TCP', 'UDP', 'TLS', 'SSL', 'DNS', 'URL', 'URI',
  'UUID', 'GUID', 'RPC', 'ZK', 'TVL', 'APY', 'APR', 'TON', 'ETH', 'BTC',
  'TONSWAP', 'HASHI', 'KUSD',
]);

// Crypto algorithms with special casing
const CRYPTO_ALGORITHMS: Record<string, string> = {
  'blake2b': 'BLAKE2b',
  'blake2s': 'BLAKE2s',
  'blake3': 'BLAKE3',
  'sha256': 'SHA-256',
  'sha512': 'SHA-512',
  'sha3': 'SHA-3',
  'keccak': 'Keccak',
  'keccak256': 'Keccak-256',
  'ed25519': 'Ed25519',
  'secp256k1': 'secp256k1',
  'sr25519': 'Sr25519',
  'ecdsa': 'ECDSA',
  'schnorr': 'Schnorr',
  'bls': 'BLS',
  'aes': 'AES',
  'rsa': 'RSA',
};

// Compound technical terms that need special handling
const COMPOUND_TERM_OVERRIDES: Record<string, string> = {
  'defi': 'DeFi',
  'assetdefinitionid': 'Asset Definition ID',
  'assetid': 'Asset ID',
  'accountid': 'Account ID',
  'domainid': 'Domain ID',
  'triggerid': 'Trigger ID',
  'roleid': 'Role ID',
  'permissionid': 'Permission ID',
  'peerid': 'Peer ID',
  'blockheaderid': 'Block Header ID',
  'computemanifest': 'Compute Manifest',
  'dataspace': 'Data Space',
  'dataspaces': 'Data Spaces',
  'worldstateview': 'World State View',
  'smartcontract': 'Smart Contract',
  'smartcontracts': 'Smart Contracts',
  'blockheader': 'Block Header',
  'blockhash': 'Block Hash',
  'merkletree': 'Merkle Tree',
  'merkleroot': 'Merkle Root',
  'merkleproof': 'Merkle Proof',
  'stateroot': 'State Root',
  'transactionpool': 'Transaction Pool',
  'crosschain': 'Cross-Chain',
  'sidechain': 'Sidechain',
  'parachain': 'Parachain',
  'relaychain': 'Relay Chain',
  'liquiditypool': 'Liquidity Pool',
  'liquiditypools': 'Liquidity Pools',
  'tokenbondingcurve': 'Token Bonding Curve',
  'bondingcurve': 'Bonding Curve',
  'pricefeed': 'Price Feed',
  'priceoracle': 'Price Oracle',
  'flashloan': 'Flash Loan',
  'yieldfarming': 'Yield Farming',
  'accountlifecycle': 'Account Lifecycle',
  'multisig': 'Multi-Sig',
  'multisignature': 'Multi-Signature',
  'loadbalancer': 'Load Balancer',
  'ratelimit': 'Rate Limit',
  'ratelimiting': 'Rate Limiting',
  'healthcheck': 'Health Check',
  'dataavailability': 'Data Availability',
  'xorutility': 'XOR Utility',
};

/**
 * Split camelCase or PascalCase into separate words
 */
function splitCamelCase(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Normalize title to Title Case, preserving acronyms and handling compound terms
 */
function normalizeTitle(title: string): string {
  // Check compound term overrides first
  const lowerNoSpace = title.toLowerCase().replace(/[\s_-]+/g, '');
  if (COMPOUND_TERM_OVERRIDES[lowerNoSpace]) {
    return COMPOUND_TERM_OVERRIDES[lowerNoSpace];
  }
  
  // Check crypto algorithms
  const lowerTitle = title.toLowerCase();
  if (CRYPTO_ALGORITHMS[lowerTitle]) {
    return CRYPTO_ALGORITHMS[lowerTitle];
  }
  
  // If title already has proper formatting (mixed case with spaces), preserve it
  if (/[A-Z]/.test(title) && /\s/.test(title)) {
    return title;
  }
  
  // If it's a single word that might be camelCase/PascalCase, split it
  if (!/\s/.test(title) && /[a-z][A-Z]|[A-Z]{2,}[a-z]/.test(title)) {
    const parts = splitCamelCase(title);
    return parts
      .map((word) => {
        const upper = word.toUpperCase();
        if (ACRONYMS.has(upper)) return upper;
        if (CRYPTO_ALGORITHMS[word.toLowerCase()]) return CRYPTO_ALGORITHMS[word.toLowerCase()];
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
  
  return title
    .split(/\s+/)
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) return upper;
      if (ACRONYMS.has(word)) return word;
      // Check crypto algorithms
      if (CRYPTO_ALGORITHMS[word.toLowerCase()]) return CRYPTO_ALGORITHMS[word.toLowerCase()];
      // Check for parenthetical acronyms like "(IVM)"
      const parenMatch = word.match(/^\(([A-Z]+)\)$/);
      if (parenMatch) return word;
      // Title case
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Normalize slug: lowercase, no hyphens in middle, alphanumeric only
 */
function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Validate slug format
 */
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+$/.test(slug);
}

/**
 * Normalize category to Title Case
 */
function normalizeCategory(category: string): string {
  return category
    .split(/[\s&]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' & ')
    .replace(/\s+&\s+/g, ' & ');
}

/**
 * Normalize tag (preserve case for known tags, lowercase otherwise)
 */
function normalizeTag(tag: string): string {
  const trimmed = tag.trim();
  // Preserve known multi-word tags
  if (trimmed === 'Nexus Architecture') return trimmed;
  return trimmed;
}

/**
 * Stable sort and dedupe array
 */
function stableSortDedupe(arr: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of arr.sort((a, b) => a.localeCompare(b))) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/**
 * Convert title to slug format for lookup
 */
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// YAML Front Matter Parser
// ─────────────────────────────────────────────────────────────────────────────

function parseFrontMatter(content: string, filename: string): FrontMatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const fm: Partial<FrontMatter> = {};

  // Parse title (with or without quotes)
  const titleMatch = yaml.match(/^title:\s*"?([^"\n]+)"?/m);
  if (titleMatch) fm.title = titleMatch[1].trim();

  // Parse slug
  const slugMatch = yaml.match(/^slug:\s*(\S+)/m);
  if (slugMatch) fm.slug = slugMatch[1].trim();

  // Parse category
  const categoryMatch = yaml.match(/^category:\s*"?([^"\n]+)"?/m);
  if (categoryMatch) fm.category = categoryMatch[1].trim();

  // Parse summary (with quotes)
  const summaryMatch = yaml.match(/^summary:\s*"([^"]+)"/m);
  if (summaryMatch) fm.summary = summaryMatch[1].trim();

  // Parse tags (array)
  const tagsSection = yaml.match(/^tags:\s*\n((?:\s+-\s*"[^"]+"\n?)+)/m);
  if (tagsSection) {
    fm.tags = [...tagsSection[1].matchAll(/- "([^"]+)"/g)].map((m) => m[1]);
  }

  // Parse related (array)
  const relatedSection = yaml.match(/^related:\s*\n((?:\s+-\s*"[^"]+"\n?)+)/m);
  if (relatedSection) {
    fm.related = [...relatedSection[1].matchAll(/- "([^"]+)"/g)].map((m) => m[1]);
  }

  // Parse tagline
  const taglineMatch = yaml.match(/^tagline:\s*"([^"]+)"/m);
  if (taglineMatch) fm.tagline = taglineMatch[1].trim();

  // Parse status
  const statusMatch = yaml.match(/^status:\s*(\S+)/m);
  if (statusMatch) {
    const status = statusMatch[1].trim().toLowerCase();
    if (status === 'canonical' || status === 'alias' || status === 'deprecated') {
      fm.status = status;
    }
  }

  // Parse targetSlug (for aliases)
  const targetMatch = yaml.match(/^targetSlug:\s*(\S+)/m);
  if (targetMatch) fm.targetSlug = targetMatch[1].trim();

  // Validate required fields
  if (!fm.title || !fm.slug || !fm.category || !fm.summary) {
    console.warn(`⚠️ Skipping ${filename}: missing required fields (title, slug, category, summary)`);
    return null;
  }

  return fm as FrontMatter;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hardcoded Alias Mappings (for common abbreviations)
// ─────────────────────────────────────────────────────────────────────────────

const HARDCODED_ALIASES: AliasTerm[] = [
  { alias: 'ivm', target: 'irohavirtualmachineivm' },
  { alias: 'iroha-virtual-machine', target: 'irohavirtualmachineivm' },
  { alias: 'wsv', target: 'worldstateviewwsv' },
  { alias: 'world-state-view', target: 'worldstateviewwsv' },
  { alias: 'space-directory', target: 'dataspacedirectory' },
  { alias: 'teu', target: 'transactionexecutionunitsteu' },
  { alias: 'transaction-execution-units', target: 'transactionexecutionunitsteu' },
  { alias: 'sfq', target: 'starttimefairqueuingsfq' },
  { alias: 'start-time-fair-queuing', target: 'starttimefairqueuingsfq' },
  { alias: 'da', target: 'dataavailability' },
  { alias: 'data-availability', target: 'dataavailability' },
  { alias: 'qc', target: 'quorumcertificate' },
  { alias: 'quorum-certificate', target: 'quorumcertificate' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Taxonomy Loader (SORA ecosystem terms)
// ─────────────────────────────────────────────────────────────────────────────

interface TaxonomyTerm {
  slug: string;
  title: string;
  type: string;
  category?: string;
  summary?: string;
  definition?: string;
  aliases?: string[];
  relatedTags?: string[];
  seeAlso?: string[];
  examples?: string[];
  links?: Array<{ label: string; url: string }>;
  priority?: number;
}

async function loadTaxonomyTerms(): Promise<CanonicalTerm[]> {
  if (!INCLUDE_TAXONOMY_TERMS) {
    return [];
  }

  try {
    // Dynamic import of taxonomy data
    const taxonomyModule = await import(TAXONOMY_PATH);
    const taxonomy = taxonomyModule.taxonomy || taxonomyModule.default?.taxonomy;
    
    if (!taxonomy || typeof taxonomy !== 'object') {
      console.warn('⚠️ Could not load taxonomy data');
      return [];
    }

    // Also load tag hub config for canonical tags
    const tagHubModule = await import(TAG_HUB_CONFIG_PATH);
    const tagHubMetadata = tagHubModule.tagHubMetadata || {};
    const canonicalTags = new Set(tagHubModule.CANONICAL_TAGS || []);
    
    // Load fallback definitions and categories for canonical tags
    const glossaryDefsModule = await import(GLOSSARY_DEFINITIONS_PATH);
    const getDefinitionForSlug = glossaryDefsModule.getDefinitionForSlug;
    const getCategoryForSlug = glossaryDefsModule.getCategoryForSlug;

    const terms: CanonicalTerm[] = [];
    const processedSlugs = new Set<string>();
    
    // Map taxonomy category to display category
    const categoryMap: Record<string, string> = {
      'token': 'Token',
      'technology': 'Technology',
      'governance': 'Governance',
      'defi': 'DeFi',
      'network': 'Network',
      'economics': 'Economics',
      'ecosystem': 'Ecosystem',
      'general': 'General',
    };

    // Process taxonomy terms
    for (const [key, node] of Object.entries(taxonomy)) {
      const term = node as TaxonomyTerm;
      
      // Include terms with definitions (glossary-worthy)
      if (!term.definition) {
        continue;
      }

      // Include both 'term' type and 'tag' type that have definitions
      if (term.type !== 'term' && term.type !== 'tag') {
        continue;
      }

      const slug = normalizeSlug(term.slug);
      if (processedSlugs.has(slug)) continue;
      processedSlugs.add(slug);

      const category = categoryMap[term.category || 'general'] || 'General';
      
      // Get whyItMatters from fallback entries if available
      const fallbackEntry = glossaryDefsModule.FALLBACK_ENTRIES?.[slug];
      const tagline = fallbackEntry?.whyItMatters || undefined;

      terms.push({
        slug,
        title: normalizeTitle(term.title),
        summary: term.summary || term.definition,
        status: 'canonical',
        targetSlug: null,
        definition: term.definition,
        category,
        aliases: (term.aliases || []).map((a) => a.toLowerCase()),
        tags: (term.relatedTags || []).map((t) => normalizeTag(t)),
        relatedTerms: (term.seeAlso || []).map((s) => normalizeSlug(s.toLowerCase().replace(/\s+/g, ''))),
        examples: term.examples || [],
        links: term.links || [],
        tagline,
      });
    }

    // Process canonical tags that might not be in taxonomy
    for (const tagSlug of canonicalTags) {
      const slug = normalizeSlug(tagSlug);
      if (processedSlugs.has(slug)) continue;
      
      // Check if there's metadata for this tag
      const metadata = tagHubMetadata[tagSlug] || tagHubMetadata[`tag-${tagSlug}`];
      
      // Get definition from metadata, fallback definitions, or skip
      let definition = metadata?.summary;
      if (!definition && typeof getDefinitionForSlug === 'function') {
        definition = getDefinitionForSlug(tagSlug);
      }
      
      if (definition) {
        processedSlugs.add(slug);
        
        // Get category from metadata, fallback entries, or default to general
        let categoryKey = metadata?.domain || 'general';
        if (categoryKey === 'general' && typeof getCategoryForSlug === 'function') {
          const fallbackCategory = getCategoryForSlug(tagSlug);
          if (fallbackCategory) categoryKey = fallbackCategory;
        }
        const category = categoryMap[categoryKey] || 'General';
        
        terms.push({
          slug,
          title: normalizeTitle(tagSlug.replace(/-/g, ' ')),
          summary: definition,
          status: 'canonical',
          targetSlug: null,
          definition,
          category,
          aliases: [],
          tags: metadata?.traits || [],
          relatedTerms: [],
          examples: [],
          links: [],
          tagline: undefined,
        });
      }
    }

    // Process FALLBACK_ENTRIES directly for tags that don't have pages yet
    // This ensures tags used on terms have dedicated glossary pages
    const fallbackEntries = glossaryDefsModule.FALLBACK_ENTRIES || {};
    for (const [entrySlug, entry] of Object.entries(fallbackEntries)) {
      const slug = normalizeSlug(entrySlug);
      if (processedSlugs.has(slug)) continue;
      
      const entryData = entry as { definition: string; category: string };
      if (!entryData.definition) continue;
      
      processedSlugs.add(slug);
      const category = categoryMap[entryData.category] || normalizeCategory(entryData.category) || 'General';
      
      terms.push({
        slug,
        title: normalizeTitle(
          entrySlug
            .replace(/-/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/nexusarchitecture/i, 'Nexus Architecture')
            .replace(/hyperledgeriroha/i, 'Hyperledger Iroha')
            .replace(/soraecosystem/i, 'SORA Ecosystem')
            .replace(/soranetwork/i, 'SORA Network')
            .replace(/smartcontracts/i, 'Smart Contracts')
            .replace(/buybackandburn/i, 'Buyback and Burn')
            .replace(/crosschain/i, 'Cross-Chain')
            .replace(/crossborderpayments/i, 'Cross-Border Payments')
            .replace(/realworldassets/i, 'Real-World Assets')
            .replace(/byzantinefaulttolerance/i, 'Byzantine Fault Tolerance')
            .replace(/borderlessfinance/i, 'Borderless Finance')
            .replace(/decentralizedexchange/i, 'Decentralized Exchange')
            .replace(/overcollateralized/i, 'Over-Collateralized')
            .replace(/supplyreduction/i, 'Supply Reduction')
            .replace(/supplymanagement/i, 'Supply Management')
            .replace(/priceoptimization/i, 'Price Optimization')
            .replace(/marketcycles/i, 'Market Cycles')
            .replace(/digitalcurrency/i, 'Digital Currency')
            .replace(/stableasset/i, 'Stable Asset')
            .replace(/memecoins/i, 'Meme Coins')
        ),
        summary: entryData.definition,
        status: 'canonical',
        targetSlug: null,
        definition: entryData.definition,
        category,
        aliases: [],
        tags: [],
        relatedTerms: [],
        examples: [],
        links: [],
        tagline: undefined,
      });
    }

    console.log(`📚 Loaded ${terms.length} taxonomy terms`);
    return terms;
  } catch (err) {
    console.warn('⚠️ Failed to load taxonomy terms:', err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Generator
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const stats: GeneratorStats = {
    canonicalCount: 0,
    aliasCount: 0,
    deprecatedCount: 0,
    warnings: [],
  };

  // 1. Load all MDX files
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  console.log(`📂 Found ${files.length} MDX files in ${CONTENT_DIR}`);

  // 1a. Load taxonomy terms (SORA ecosystem)
  const taxonomyTerms = await loadTaxonomyTerms();

  // 2. Parse front matter from each file
  const parsedTerms: FrontMatter[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const fm = parseFrontMatter(content, file);
    if (fm) {
      parsedTerms.push(fm);
    }
  }

  // 3. Build canonical terms map (for validation)
  const canonicalBySlug = new Map<string, FrontMatter>();
  const canonicalByTitle = new Map<string, FrontMatter>();

  for (const fm of parsedTerms) {
    const normalizedSlug = normalizeSlug(fm.slug);
    
    // Validate slug format
    if (!isValidSlug(normalizedSlug)) {
      stats.warnings.push(`Invalid slug format: "${fm.slug}" (should be lowercase alphanumeric)`);
    }

    if (fm.status === 'alias') {
      continue; // Skip aliases in first pass
    }

    canonicalBySlug.set(normalizedSlug, fm);
    canonicalByTitle.set(fm.title.toLowerCase(), fm);
  }

  // 4. Build alias mappings
  const aliasMap = new Map<string, string>();
  
  // Add hardcoded aliases
  for (const { alias, target } of HARDCODED_ALIASES) {
    if (canonicalBySlug.has(target)) {
      aliasMap.set(alias, target);
    }
  }

  // Add aliases from MDX files
  for (const fm of parsedTerms) {
    if (fm.status === 'alias' && fm.targetSlug) {
      const targetSlug = normalizeSlug(fm.targetSlug);
      if (canonicalBySlug.has(targetSlug)) {
        aliasMap.set(normalizeSlug(fm.slug), targetSlug);
      } else {
        stats.warnings.push(`Alias "${fm.slug}" points to non-existent target "${fm.targetSlug}"`);
      }
    }
  }

  // 5. Resolve related terms (title → canonical slug)
  function resolveRelatedTerm(related: string): string | null {
    // Try direct slug lookup
    const asSlug = titleToSlug(related);
    if (canonicalBySlug.has(asSlug)) {
      return asSlug;
    }

    // Try alias resolution
    if (aliasMap.has(asSlug)) {
      return aliasMap.get(asSlug)!;
    }

    // Try title lookup
    const byTitle = canonicalByTitle.get(related.toLowerCase());
    if (byTitle) {
      return normalizeSlug(byTitle.slug);
    }

    return null;
  }

  // 6. Build canonical terms array
  const canonicalTerms: CanonicalTerm[] = [];

  for (const fm of parsedTerms) {
    if (fm.status === 'alias' || fm.status === 'deprecated') {
      if (fm.status === 'deprecated') stats.deprecatedCount++;
      continue;
    }

    const normalizedSlug = normalizeSlug(fm.slug);

    // Normalize and validate related terms
    const resolvedRelated: string[] = [];
    for (const related of fm.related ?? []) {
      const resolved = resolveRelatedTerm(related);
      if (resolved) {
        resolvedRelated.push(resolved);
      } else {
        stats.warnings.push(`Term "${fm.title}": related term "${related}" not found`);
      }
    }

    // Build canonical term
    const term: CanonicalTerm = {
      slug: normalizedSlug,
      title: normalizeTitle(fm.title),
      summary: fm.summary,
      status: 'canonical',
      targetSlug: null,
      definition: fm.summary,
      category: normalizeCategory(fm.category),
      aliases: [],
      tags: stableSortDedupe((fm.tags ?? []).map(normalizeTag)),
      relatedTerms: stableSortDedupe(resolvedRelated),
      examples: [],
      links: [],
      ...(fm.tagline ? { tagline: fm.tagline } : {}),
    };

    canonicalTerms.push(term);
  }

  // 7. Merge taxonomy terms (SORA ecosystem terms like XOR, Polkaswap, etc.)
  const mdxSlugs = new Set(canonicalTerms.map((t) => t.slug));
  let taxonomyAdded = 0;
  
  for (const taxonomyTerm of taxonomyTerms) {
    // Only add if not already defined in MDX
    if (!mdxSlugs.has(taxonomyTerm.slug)) {
      canonicalTerms.push(taxonomyTerm);
      taxonomyAdded++;
      
      // Add any aliases from taxonomy term
      for (const alias of taxonomyTerm.aliases) {
        const normalizedAlias = normalizeSlug(alias);
        if (normalizedAlias && normalizedAlias !== taxonomyTerm.slug && !aliasMap.has(normalizedAlias)) {
          aliasMap.set(normalizedAlias, taxonomyTerm.slug);
        }
      }
    }
  }
  
  if (taxonomyAdded > 0) {
    console.log(`🔗 Merged ${taxonomyAdded} taxonomy terms (SORA ecosystem)`);
  }

  // 8. Sort canonical terms by slug (deterministic)
  canonicalTerms.sort((a, b) => a.slug.localeCompare(b.slug));

  // 10. Build alias array
  const aliases: AliasTerm[] = Array.from(aliasMap.entries())
    .map(([alias, target]) => ({ alias, target }))
    .sort((a, b) => a.alias.localeCompare(b.alias));

  // 11. Update stats
  stats.canonicalCount = canonicalTerms.length;
  stats.aliasCount = aliases.length;

  // 12. Build output payloads
  
  // glossary.v2025.json (full data)
  const glossaryV2025 = {
    terms: canonicalTerms,
    canonicalCount: stats.canonicalCount,
    aliasCount: stats.aliasCount,
    deprecatedCount: stats.deprecatedCount,
    version: 2025,
    lastUpdated: new Date().toISOString(),
  };

  // glossary.json (legacy format - array of terms)
  const glossaryLegacy = canonicalTerms;

  // glossary.index.json (minimal index)
  const glossaryIndex = {
    index: canonicalTerms.map((t) => ({
      slug: t.slug,
      title: t.title,
      type: 'term',
      category: t.category,
      priority: 0,
      aliases: t.aliases,
      tags: t.tags,
      summary: t.summary,
      definition: t.definition,
      entity: null,
      versions: [],
      relatedTerms: t.relatedTerms,
      glossaryRef: `/glossary/${t.slug}`,
      blob: [t.title, t.summary, ...t.tags, ...t.relatedTerms].join(' ').toLowerCase(),
    })),
    totalCount: stats.canonicalCount,
    lastUpdated: new Date().toISOString(),
  };

  // glossary.aliases.v2025.json
  const glossaryAliases = {
    aliases,
  };

  // 11. Write output files (deterministic JSON)
  const writeJson = (filePath: string, data: unknown, compact = false) => {
    const json = compact 
      ? JSON.stringify(data) + '\n'
      : JSON.stringify(data, null, 2) + '\n';
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, json, 'utf-8');
  };

  writeJson(OUT_DATA, glossaryV2025);
  writeJson(OUT_FULL, glossaryLegacy);
  writeJson(OUT_INDEX, glossaryIndex);
  writeJson(OUT_ALIASES, glossaryAliases);

  // 11a. Write per-term JSON files for lazy loading
  fs.mkdirSync(OUT_TERMS_DIR, { recursive: true });
  
  for (const term of canonicalTerms) {
    const termPath = path.join(OUT_TERMS_DIR, `${term.slug}.json`);
    writeJson(termPath, term, true); // Compact JSON for smaller payload
  }

  // 11b. Write minimal index (for SSR hero and list rendering)
  const minimalIndex = {
    terms: canonicalTerms.map((t) => ({
      slug: t.slug,
      title: t.title,
      category: t.category,
      summary: t.summary,
      tagline: t.tagline,
    })),
    canonicalCount: stats.canonicalCount,
    aliasCount: stats.aliasCount,
    version: 2025,
    lastUpdated: new Date().toISOString(),
  };
  writeJson(OUT_MINIMAL_INDEX, minimalIndex);

  // 12. Print summary
  console.log('\n✅ Generator completed successfully');
  console.log(`   Canonical: ${stats.canonicalCount}`);
  console.log(`   Aliases:   ${stats.aliasCount}`);
  console.log(`   Deprecated: ${stats.deprecatedCount}`);
  console.log('\n📁 Output files:');
  console.log(`   ${OUT_DATA}`);
  console.log(`   ${OUT_FULL}`);
  console.log(`   ${OUT_INDEX}`);
  console.log(`   ${OUT_ALIASES}`);
  console.log(`   ${OUT_MINIMAL_INDEX}`);
  console.log(`   ${OUT_TERMS_DIR}/<slug>.json (${stats.canonicalCount} files)`);

  // 13. Print warnings
  if (stats.warnings.length > 0) {
    console.log(`\n⚠️ Warnings (${stats.warnings.length}):`);
    for (const warning of stats.warnings.slice(0, 20)) {
      console.log(`   - ${warning}`);
    }
    if (stats.warnings.length > 20) {
      console.log(`   ... and ${stats.warnings.length - 20} more`);
    }
  }

  // 14. Output stats for verification
  const statsOutput = {
    canonical: stats.canonicalCount,
    aliases: stats.aliasCount,
    deprecated: stats.deprecatedCount,
    warnings: stats.warnings.length,
  };
  console.log('\n📊 Stats:', JSON.stringify(statsOutput));
}

main().catch((err) => {
  console.error('❌ Generator failed:', err);
  process.exit(1);
});
