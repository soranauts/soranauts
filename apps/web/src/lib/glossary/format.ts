export const DISPLAY_DELIMITERS = /[\s/_-]+/;

// Token symbols - always UPPERCASE
export const TOKEN_SYMBOLS = new Set([
  'xor', 'val', 'pswap', 'tbcd', 'kusd', 'xstusd', 'eth', 'btc', 'dot', 'ksm',
]);

// Technical acronyms - always UPPERCASE  
export const ACRONYM_TOKENS = new Set([
  // Token symbols (also acronyms)
  'xor', 'val', 'pswap', 'tbcd', 'kusd',
  // Network/Platform acronyms
  'sora', 'ipfs', 'ton',
  // DeFi/Crypto acronyms
  'dex', 'amm', 'dao', 'nft', 'cbdc', 'evm', 'lp', 'kpi', 'apy', 'apr', 'tvl',
  // Technical acronyms
  'wasm', 'api', 'abi', 'sdk', 'rpc', 'json', 'http', 'https', 'tcp', 'udp',
  'tls', 'ssl', 'dns', 'url', 'uri', 'uuid', 'guid', 'id', 'ids',
  // Payment types
  'qr',
  // Nexus-specific acronyms
  'ivm', 'wsv', 'sfq', 'teu', 'da', 'zk', 'bft', 'qc', 'vrf', 'pq',
  'cid', 'dsid', 'sse', 'grpc', 'rest', 'quic', 'npos', 'pos', 'pow',
]);

// Cryptographic algorithms - special casing
export const CRYPTO_ALGORITHMS: Record<string, string> = {
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

// Product/brand names - Title Case preserved
export const PRODUCT_NAMES = new Set([
  'polkaswap', 'tonswap', 'hashi', 'fearless', 'kensetsu', 'demeter',
  'polkadot', 'kusama', 'substrate', 'ethereum', 'bitcoin', 'telegram',
  'soramitsu', 'hyperledger', 'iroha', 'sumeragi', 'ceres', 'adar',
]);

// Compound technical terms that need splitting (camelCase/PascalCase patterns)
export const COMPOUND_TERM_OVERRIDES: Record<string, string> = {
  // Special case: DeFi is not a typical acronym
  'defi': 'DeFi',
  
  // Nexus ID types
  'assetdefinitionid': 'Asset Definition ID',
  'assetid': 'Asset ID',
  'accountid': 'Account ID',
  'domainid': 'Domain ID',
  'triggerid': 'Trigger ID',
  'roleid': 'Role ID',
  'permissionid': 'Permission ID',
  'peerid': 'Peer ID',
  'blockheaderid': 'Block Header ID',
  
  // Nexus technical terms
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
  'mempool': 'Mempool',
  
  // Cross-chain terms
  'crosschain': 'Cross-Chain',
  'sidechain': 'Sidechain',
  'parachain': 'Parachain',
  'relaychain': 'Relay Chain',
  
  // DeFi compound terms
  'liquiditypool': 'Liquidity Pool',
  'liquiditypools': 'Liquidity Pools',
  'tokenbondingcurve': 'Token Bonding Curve',
  'bondingcurve': 'Bonding Curve',
  'pricefeed': 'Price Feed',
  'priceoracle': 'Price Oracle',
  'flashloan': 'Flash Loan',
  'yieldfarming': 'Yield Farming',
  
  // Account/Identity terms
  'accountlifecycle': 'Account Lifecycle',
  'multisig': 'Multi-Sig',
  'multisignature': 'Multi-Signature',
  
  // Technical infrastructure
  'loadbalancer': 'Load Balancer',
  'ratelimit': 'Rate Limit',
  'ratelimiting': 'Rate Limiting',
  'healthcheck': 'Health Check',
  'heartbeat': 'Heartbeat',
  'timestamp': 'Timestamp',
  'datetime': 'Date Time',
  
  // DeFi/Economics terms
  'elasticsupply': 'Elastic Supply',
  'totalvaluelocked': 'Total Value Locked',
  'liquiditymining': 'Liquidity Mining',
  'impermanentloss': 'Impermanent Loss',
  'slippage': 'Slippage',
  'gastoken': 'Gas Token',
  
  // Serialization
  'protobuf': 'Protobuf',
  'flatbuffers': 'FlatBuffers',
  'messagepack': 'MessagePack',
};

export const HIDDEN_RENDER_SLUGS = new Set(['alias-redirect', 'autolinkconfig']);

export const hasContent = (value?: string | null): boolean =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * Split camelCase or PascalCase into separate words
 * e.g., "AssetDefinitionId" → ["Asset", "Definition", "Id"]
 */
const splitCamelCase = (str: string): string[] => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean);
};

/**
 * Format a single token with proper casing rules
 */
const formatAcronymAwareToken = (token: string): string => {
  if (!token) return '';
  const normalized = token.toLowerCase();
  
  // Check crypto algorithms first (special casing)
  if (CRYPTO_ALGORITHMS[normalized]) {
    return CRYPTO_ALGORITHMS[normalized];
  }
  
  // Token symbols and acronyms → UPPERCASE
  if (ACRONYM_TOKENS.has(normalized) || TOKEN_SYMBOLS.has(normalized)) {
    return normalized.toUpperCase();
  }
  
  // Version strings like "v2", "v3" → uppercase
  if (/^v\d+$/i.test(token)) {
    return token.toUpperCase();
  }
  
  // Product names → Title Case
  if (PRODUCT_NAMES.has(normalized)) {
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }
  
  // Default: Title Case
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const formatTitleToken = (token: string): string => {
  if (!token) return '';
  return token.charAt(0).toUpperCase() + token.slice(1);
};

/**
 * Format glossary title with smart casing rules:
 * - Compound terms are split and properly spaced
 * - Acronyms/tokens → UPPERCASE
 * - Crypto algorithms → proper casing (BLAKE2b, SHA-256)
 * - Product names → Title Case
 */
export const formatGlossaryTitle = (value?: string | null): string => {
  const source = value?.trim();
  if (!source) return '';
  
  // Check for compound term overrides first (exact match)
  const lowerSource = source.toLowerCase().replace(/[\s_-]+/g, '');
  if (COMPOUND_TERM_OVERRIDES[lowerSource]) {
    return COMPOUND_TERM_OVERRIDES[lowerSource];
  }
  
  // If the title already has proper formatting (mixed case with spaces),
  // preserve it. This handles "Start-Time Fair Queuing (SFQ)" etc.
  if (/[A-Z]/.test(source) && /\s/.test(source)) {
    return source;
  }
  
  // Check for crypto algorithms
  const lowerSourceTrimmed = source.toLowerCase();
  if (CRYPTO_ALGORITHMS[lowerSourceTrimmed]) {
    return CRYPTO_ALGORITHMS[lowerSourceTrimmed];
  }
  
  // If it's a single word with no delimiters, check if it's camelCase/PascalCase
  if (!DISPLAY_DELIMITERS.test(source) && /[a-z][A-Z]|[A-Z]{2,}[a-z]/.test(source)) {
    const parts = splitCamelCase(source);
    return parts.map(formatAcronymAwareToken).join(' ');
  }
  
  // If it's a single lowercase word that might be a compound
  if (!DISPLAY_DELIMITERS.test(source) && source === source.toLowerCase() && source.length > 10) {
    // Try to find it in compound overrides
    if (COMPOUND_TERM_OVERRIDES[source]) {
      return COMPOUND_TERM_OVERRIDES[source];
    }
  }
  
  const tokens = source.split(DISPLAY_DELIMITERS).filter(Boolean);
  if (!tokens.length) return source;
  
  // Check if entire string is a single acronym token
  if (tokens.length === 1) {
    const normalized = tokens[0].toLowerCase();
    if (ACRONYM_TOKENS.has(normalized) || TOKEN_SYMBOLS.has(normalized)) {
      return normalized.toUpperCase();
    }
    if (CRYPTO_ALGORITHMS[normalized]) {
      return CRYPTO_ALGORITHMS[normalized];
    }
  }
  
  return tokens.map(formatAcronymAwareToken).join(' ');
};

export const formatCategoryLabel = (value?: string | null): string => {
  const source = value?.trim();
  if (!source) return '';
  const tokens = source.split(DISPLAY_DELIMITERS).filter(Boolean);
  if (!tokens.length) return source;
  return tokens.map(formatTitleToken).join(' ');
};

export const truncateOneLiner = (value?: string | null, max = 220): string => {
  const source = value?.trim();
  if (!source) return '';
  if (source.length <= max) return source;
  return `${source.slice(0, max - 1).trimEnd()}…`;
};

export const isRenderableGlossaryEntry = <T extends { slug?: string; status?: string; definition?: string | null; category?: string | null }>(
  entry: T | null | undefined,
): entry is T => {
  if (!entry) return false;
  const status = (entry.status ?? 'canonical').toLowerCase();
  if (status !== 'canonical') return false;
  if (entry.slug && HIDDEN_RENDER_SLUGS.has(entry.slug)) return false;
  if (!hasContent(entry.definition)) return false;
  if (!hasContent(entry.category)) return false;
  return true;
};

export const formatCompoundAcronym = (value?: string | null): string => {
  const source = value?.trim();
  if (!source) return '';
  if (/^[A-Z][A-Z\s\d]+$/.test(source)) return source;
  if (/sora\s*v\s*2/i.test(source)) return 'SORA V2';
  if (/sora\s*v\s*3/i.test(source)) return 'SORA V3';
  if (/qr\s*payment/i.test(source)) return 'QR PAYMENTS';
  return source;
};

export const formatGlossaryDate = (updateDate?: string | null, publishDate?: string | null): string => {
  const dateStr = updateDate || publishDate;
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.valueOf())) return '—';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
};

/**
 * Format a hashtag/tag with proper casing:
 * - Token symbols → #XOR, #VAL, #PSWAP
 * - Acronyms → #DEX, #AMM, #NFT
 * - Product names → #Polkaswap, #Tonswap
 * - General concepts → #staking, #liquidity, #validator
 */
export const formatHashtag = (value?: string | null): string => {
  const source = value?.trim();
  if (!source) return '';
  
  // Remove # prefix if present for processing
  const tag = source.startsWith('#') ? source.slice(1) : source;
  const normalized = tag.toLowerCase().replace(/[\s_-]+/g, '');
  
  // Token symbols → UPPERCASE
  if (TOKEN_SYMBOLS.has(normalized)) {
    return normalized.toUpperCase();
  }
  
  // Acronyms → UPPERCASE
  if (ACRONYM_TOKENS.has(normalized)) {
    return normalized.toUpperCase();
  }
  
  // Crypto algorithms → special casing
  if (CRYPTO_ALGORITHMS[normalized]) {
    return CRYPTO_ALGORITHMS[normalized];
  }
  
  // Product names → Title Case
  if (PRODUCT_NAMES.has(normalized)) {
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }
  
  // Compound terms with spaces/hyphens → Title Case each word
  if (/[\s_-]/.test(tag)) {
    return tag
      .split(/[\s_-]+/)
      .map(word => {
        const lowerWord = word.toLowerCase();
        if (ACRONYM_TOKENS.has(lowerWord) || TOKEN_SYMBOLS.has(lowerWord)) {
          return lowerWord.toUpperCase();
        }
        return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
      })
      .join(' ');
  }
  
  // General concepts → lowercase
  return normalized;
};

