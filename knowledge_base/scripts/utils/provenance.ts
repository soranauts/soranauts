import { createHash } from 'crypto';
import { parse as parseUrl } from 'url';

/**
 * Generate a stable document ID from a normalized URL
 */
export function makeDocId(url: string): string {
  // Normalize URL: lowercase, remove trailing slash, remove common query params
  const parsed = parseUrl(url);
  const normalized = `${parsed.protocol}//${parsed.host}${parsed.pathname?.replace(/\/$/, '') || ''}`
    .toLowerCase()
    .trim();
  
  // Use SHA1 for shorter IDs (document IDs, not security hashes)
  return createHash('sha1').update(normalized).digest('hex').substring(0, 16);
}

/**
 * Compute SHA256 checksum of content
 */
export function computeChecksum(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Get current snapshot ID in YYYY-MM-DD format
 */
export function currentSnapshotId(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Provenance metadata interface
 */
export interface ProvenanceMetadata {
  source_url: string;
  snapshot_id: string;
  fetched_at: string; // ISO timestamp
  etag?: string;
  last_modified?: string;
  lang?: string;
  license?: string;
  checksum_sha256: string;
  content_hash: string;
  doc_id: string;
}

/**
 * Create provenance metadata for a document
 */
export function createProvenance(data: {
  source_url: string;
  content: string;
  etag?: string;
  last_modified?: string;
  lang?: string;
  license?: string;
  snapshot_id?: string;
}): ProvenanceMetadata {
  const snapshotId = data.snapshot_id || currentSnapshotId();
  const contentHash = computeChecksum(data.content);
  
  // For checksum, we hash the normalized content (what gets stored)
  // This should match what ingest.ts uses for normalization
  const normalized = data.content
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const checksum = computeChecksum(normalized);
  
  return {
    source_url: data.source_url,
    snapshot_id: snapshotId,
    fetched_at: new Date().toISOString(),
    etag: data.etag,
    last_modified: data.last_modified,
    lang: data.lang,
    license: data.license,
    checksum_sha256: checksum,
    content_hash: contentHash,
    doc_id: makeDocId(data.source_url),
  };
}



















