export const DISPLAY_DELIMITERS = /[\s/_-]+/;

export const ACRONYM_TOKENS = new Set([
  // Token symbols
  'xor',
  'val',
  'pswap',
  // Network/Platform names
  'sora',
  'tonswap',
  'ipfs',
  // Technical acronyms
  'dex',
  'amm',
  'dao',
  'nft',
  'cbdc',
  'evm',
  'lp',
  'kpi',
  'wasm',
  'api',
  // Payment types
  'qr',
  // Nexus-specific acronyms
  'ivm',
  'wsv',
  'sfq',
  'teu',
  'da',
  'zk',
]);

export const HIDDEN_RENDER_SLUGS = new Set(['alias-redirect', 'autolinkconfig']);

export const hasContent = (value?: string | null): boolean =>
  typeof value === 'string' && value.trim().length > 0;

const formatAcronymAwareToken = (token: string): string => {
  if (!token) return '';
  const normalized = token.toLowerCase();
  if (ACRONYM_TOKENS.has(normalized) || /^v\d+$/i.test(token)) {
    return normalized.toUpperCase();
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const formatTitleToken = (token: string): string => {
  if (!token) return '';
  return token.charAt(0).toUpperCase() + token.slice(1);
};

export const formatGlossaryTitle = (value?: string | null): string => {
  const source = value?.trim();
  if (!source) return '';
  
  // If the title contains uppercase letters (indicating it's already formatted),
  // preserve it as-is. This handles titles like "Start-Time Fair Queuing (SFQ)"
  // or "Iroha Virtual Machine (IVM)" that should not be reformatted.
  if (/[A-Z]/.test(source)) {
    return source;
  }
  
  const tokens = source.split(DISPLAY_DELIMITERS).filter(Boolean);
  if (!tokens.length) return source;
  // Check if entire string is a single acronym token (e.g., "TONSwap" -> "TONSWAP")
  if (tokens.length === 1) {
    const normalized = tokens[0].toLowerCase();
    if (ACRONYM_TOKENS.has(normalized)) {
      return normalized.toUpperCase();
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

