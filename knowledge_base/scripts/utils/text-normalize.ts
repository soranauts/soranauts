import crypto from 'crypto';

/**
 * Normalize markdown text for deterministic hashing
 * This ensures stable content_sha256 across cosmetic HTML→MD changes
 */
export function normalizeForHash(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\n?/, '')     // strip front-matter
    .replace(/\r\n?/g, '\n')               // CRLF→LF
    .replace(/[""]/g, '"').replace(/['']/g, "'") // smart quotes → ASCII
    .replace(/[ \t]+/g, ' ')               // collapse spaces
    .replace(/\n{3,}/g, '\n\n')            // collapse blank lines
    .trim();
}

/**
 * Compute SHA256 hash of normalized markdown
 */
export function hashContent(normalizedText: string): string {
  return crypto.createHash('sha256').update(normalizedText, 'utf8').digest('hex');
}

/**
 * Normalize CJK whitespace for consistent hashing
 */
export function normalizeCJKWhitespace(text: string): string {
  return text
    .replace(/[\u2000-\u200B\u2028-\u2029]/g, ' ') // various unicode spaces
    .replace(/\u3000/g, ' ') // ideographic space → regular space
    .replace(/[ \t]+/g, ' '); // collapse spaces
}











