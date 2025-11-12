# Knowledge Base Standards

This document defines the standards, conventions, and best practices for the Soranauts Knowledge Base system.

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [File Naming Conventions](#file-naming-conventions)
3. [Frontmatter Schema](#frontmatter-schema)
4. [Source Types](#source-types)
5. [Ingestion Rules](#ingestion-rules)
6. [Migration Rules](#migration-rules)
7. [Source-of-Truth Locations](#source-of-truth-locations)

## Directory Structure

### Top-Level Organization

```
knowledge_base/
├── sources/              # Raw source mirrors (not ingested directly)
│   ├── fearless_github/ # Fearless Wallet GitHub repos (android/, ios/)
│   └── ...
├── curated/             # Curated KB content (ingested)
│   ├── wiki/            # SORA wiki (git submodule/clone)
│   ├── iroha_docs/      # Iroha docs (git submodule/clone)
│   ├── ecosystem_updates/  # Medium posts (SORA)
│   ├── polkaswap_updates/  # Medium posts (Polkaswap)
│   ├── fearless_updates/   # Medium posts (Fearless)
│   ├── tonswap_updates/     # Medium posts (TONSWAP)
│   ├── soramitsu_site/      # Scraped SORAMITSU website
│   ├── tonswap_site/        # Scraped TONSWAP website
│   ├── articles/            # Reference articles
│   ├── internal-research/  # Internal research notes (Authority Level 1)
│   └── community-memos/     # Community governance memos (Authority Level 3)
│       ├── 2023/            # Memos organized by year
│       ├── 2024/
│       └── 2025/
├── meta/                # Metadata and configuration
│   └── tag-suggestion-matrix.md
├── docs/                # KB documentation
│   ├── archive/         # Archived/outdated docs
│   └── ...
├── snapshots/           # Read-only historical records (YYYY-MM-DD/)
│   └── ...
├── .kb_index/           # Build artifacts (gitignored)
│   ├── chroma/          # ChromaDB vector store
│   ├── bm25/            # BM25 index
│   ├── manifest.json    # Index manifest
│   └── .embedding_cache/ # Embedding cache
├── scripts/             # KB scripts and utilities
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   └── tests/            # Test files
└── assets/              # Shared assets (images, etc.)
```

### Directory Rules

- **`sources/`**: Raw source mirrors (e.g., cloned GitHub repos). These are NOT ingested directly. Create markdown summaries that point to these sources instead.
- **`curated/`**: All content that should be ingested and indexed. Must have valid frontmatter.
- **`snapshots/`**: Read-only historical records. Excluded from ingestion by default.
- **`.kb_index/`**: Build artifacts. Must be gitignored. Reproducible from curated content.

## File Naming Conventions

### Markdown Files

- **Format**: `kebab-case.md` or `kebab-case.mdx`
- **Slug generation**: Use kebab-case, CJK-stable slugs
- **Examples**:
  - `sora-v3-announcement.md`
  - `iroha-consensus-explained.md`
  - `polkaswap-tokenomics.md`

### Invalid Patterns

- ❌ Spaces: `sora v3.md`
- ❌ Special chars: `sora_v3.md`, `sora.v3.md`
- ❌ Uppercase: `SORA-v3.md` (use lowercase)
- ❌ Duplicate extensions: `file.md.md`

### Source-Specific Naming

- **Medium imports**: `medium-com-{publication}-{slug}-{id}.md`
- **Scraped sites**: `{domain}-{path-slug}.md`
- **Git repos**: Preserve original structure, but ensure markdown files have frontmatter

## Frontmatter Schema

### Canonical Schema (Required Fields)

All curated KB markdown files MUST include the following frontmatter:

```yaml
---
title: "Document Title"                    # Required: Human-readable title
slug: "kebab-case-slug"                    # Required: Unique identifier (kebab-case, CJK-stable)
source: "wiki"                             # Required: Source type (see Source Types)
source_url: "https://example.com/doc"      # Required: Original source URL
publishDate: "2025-01-15T10:00:00Z"       # Required: ISO 8601 datetime
content_sha256: "abc123..."                # Required: SHA256 of normalized content (64 chars)
snapshot_id: "2025-01-15"                 # Required: YYYY-MM-DD snapshot identifier
---
```

### Optional Fields

```yaml
---
# ... required fields ...

updateDate: "2025-01-20T15:00:00Z"        # Optional: Last update datetime (ISO 8601)
source_commit: "abc123def456"              # Optional: Git commit SHA (for git-sourced content)
canonical_url: "https://canonical.url"     # Optional: Canonical URL if different from source_url
lang: "en"                                  # Optional: Language code (en, ja, zh)
detected_lang: "en"                        # Optional: Auto-detected language
lang_confidence: 0.95                      # Optional: Detection confidence (0-1)
tags: ["tag1", "tag2"]                     # Optional: Array of tags
version: "1.0.0"                           # Optional: Document version
image_rights: "SORA Official / Medium"     # Optional: Image rights/license
retrieved_at: "2025-01-15T10:00:00Z"      # Optional: When content was retrieved (ISO 8601)
source_title: "Original Title"             # Optional: Original title from source
embed_model: "text-embedding-3-large"      # Optional: Embedding model used
embed_dim: 3072                            # Optional: Embedding dimensions
file_path: "curated/wiki/guide.md"         # Optional: Relative path in KB
license_hint: "CC-BY-4.0"                  # Optional: License hint
---
```

### Field Validation Rules

- **`slug`**: Must match regex `/^[a-z0-9-]+$/` (kebab-case, lowercase, alphanumeric + hyphens)
- **`source`**: Must be one of the defined source types (see Source Types)
- **`source_url`**: Must be a valid URL
- **`publishDate`**: Must be ISO 8601 datetime string
- **`content_sha256`**: Must be exactly 64 hexadecimal characters
- **`snapshot_id`**: Must match regex `/^\d{4}-\d{2}-\d{2}$/` (YYYY-MM-DD)

## Source Types

The `source` field must be one of:

- `wiki` - SORA wiki (wiki.sora.org)
- `iroha_docs` - Hyperledger Iroha 2 documentation
- `soramitsu` - SORAMITSU website content
- `update` - Medium posts (SORA ecosystem)
- `polkaswap_update` - Polkaswap Medium posts
- `fearless_update` - Fearless Wallet Medium posts
- `tonswap_update` - TONSWAP Medium posts
- `tonswap_site` - TONSWAP website content
- `article` - Reference articles
- `imported` - Manually imported content
- `meta` - Metadata/documentation files
- `bck21`, `bck22`, `bck23`, `bck24` - BCK research papers
- `internal-research` - Internal research notes (Authority Level 1, requires team confirmation)
- `community-memo` - Community governance memos (Authority Level 3, supplemental)
- `pdf` - PDF imports

## Ingestion Rules

### Included Directories

- `curated/` (all subdirectories)
- Files matching `**/*.md` or `**/*.mdx`

### Excluded Directories

- `sources/` - Raw source mirrors (not ingested)
- `snapshots/` - Historical records (read-only)
- `.kb_index/` - Build artifacts
- `scripts/` - Script files
- `docs/` - Documentation (unless explicitly included)
- `meta/` - Metadata files
- `node_modules/` - Dependencies
- `.git/` - Git metadata

### Ingestion Process

1. **File Discovery**: Recursively scan `curated/` for `.md`/`.mdx` files
2. **Frontmatter Validation**: Validate against canonical schema
3. **Content Normalization**: Normalize whitespace, line endings, CJK spacing
4. **Chunking**: Token-aware chunking (~450 tokens, 15% overlap)
5. **Embedding**: Generate embeddings (cached for unchanged files)
6. **Indexing**: Upsert to ChromaDB and BM25 indices

### Delta Re-indexing

- Files are tracked by `content_sha256` (normalized content hash)
- Unchanged files are skipped (no API calls)
- Changed files: delete old chunks, create new ones
- Deleted files: remove chunks from index

## Migration Rules

### Legacy Field Mappings

When migrating legacy frontmatter to the canonical schema:

| Legacy Field | Canonical Field | Notes |
|-------------|-----------------|-------|
| `checksum_sha256` | `content_sha256` | Direct mapping |
| `content_hash` | `content_sha256` | Direct mapping |
| `doc_id` | `slug` | Generate slug if missing (from title or filename) |
| `fetched_at` | `retrieved_at` | Convert to ISO 8601 if needed |
| `license` | `image_rights` | If applicable, otherwise preserve as optional metadata |
| `publishDate` | `publishDate` | Ensure ISO 8601 format |

### Migration Process

1. **Read legacy frontmatter**
2. **Map legacy fields** to canonical schema
3. **Generate missing required fields** (e.g., `slug` from title/filename)
4. **Preserve extra fields** as optional metadata (don't delete)
5. **Validate** against canonical schema
6. **Write migrated frontmatter**

### Slug Generation

If `slug` is missing, generate from:
1. Existing `slug` field (if valid)
2. `title` field (kebab-case conversion)
3. Filename (without extension, kebab-case)

Example: `"SORA v3 Announcement"` → `"sora-v3-announcement"`

## Source-of-Truth Locations

### Primary Sources

- **SORA Wiki**: `curated/wiki/` (git clone from `sora-xor/sora-docs`, branch `develop`)
- **Iroha Docs**: `curated/iroha_docs/` (git clone from Hyperledger Iroha 2 docs)
- **Medium Posts**: `curated/ecosystem_updates/`, `curated/polkaswap_updates/`, etc. (RSS import)
- **Scraped Sites**: `curated/soramitsu_site/`, `curated/tonswap_site/` (web scraping)

### Sync Scripts

- `scripts/sora_wiki_sync.ts` - Sync SORA wiki
- `scripts/iroha_docs_sync.ts` - Sync Iroha docs
- `scripts/medium_import.ts` - Import Medium posts
- `scripts/soramitsu_scrape.ts` - Scrape SORAMITSU site
- `scripts/tonswap_scrape.ts` - Scrape TONSWAP site
- `scripts/fearless_github_sync.ts` - Sync Fearless GitHub repos (to `sources/`)

### Build Artifacts

- **Index**: `.kb_index/` (ChromaDB + BM25)
- **Manifest**: `.kb_index/manifest.json`
- **Cache**: `.kb_index/.embedding_cache/`

## Snapshots

### Purpose

Snapshots are read-only historical records for reproducibility and auditing.

### Location

`snapshots/YYYY-MM-DD/` - Dated snapshot directories

### Rules

- **Excluded from ingestion** by default
- **Read-only** - do not modify snapshot contents
- **Optional pruning** - remove obviously redundant snapshots (e.g., empty or identical to previous)
- **Documentation** - Each snapshot should have a manifest documenting what was captured

## Authority Weighting

### Overview

The KB system uses authority-based scoring to prioritize high-quality, authoritative sources in retrieval results. Authority is computed automatically at ingestion time based on source type and file path.

### Authority Levels

- **Level 1 (Highest)**: BCK research papers, formal whitepapers/specs, internal research
  - BCK papers: `source` in `["bck21", "bck22", "bck23", "bck24"]`
  - Path pattern: `curated/research/bck*`
  - Internal research: `source` in `["internal-research"]` or path pattern `curated/internal-research/`
  - **Note**: Internal research requires explicit confirmation from SORAMITSU Core Research Team to be assigned Level 1
  
- **Level 2 (High)**: Official documentation
  - SORA wiki: `curated/wiki/`
  - Iroha docs: `curated/iroha_docs/`
  - Official sites: `curated/soramitsu_site/`, `curated/tonswap_site/`
  - Source types: `wiki`, `iroha_docs`, `soramitsu`, `tonswap_site`
  
- **Level 3 (Normal)**: Soranauts editorial content, community memos (default)
  - Ecosystem updates, articles, guides, governance notes
  - Community memos: `source` in `["community-memo"]` or path pattern `curated/community-memos/`
  - Default for any content that doesn't match Level 1 or 2
  - Community memos are supplemental and never override Level 1–2 sources
  
- **Level 4 (Low)**: External blogs/opinion/unverified commentary
  - Currently defaults to Level 3 (can be extended if external sources are identified)

### Authority Multipliers

Authority affects retrieval scoring through multipliers:

- **Level 1**: ×1.30 (+30% boost)
- **Level 2**: ×1.15 (+15% boost)
- **Level 3**: ×1.00 (neutral)
- **Level 4**: ×0.85 (-15% penalty)

### Application

Authority multipliers are applied:
- **Vector search**: After computing similarity scores
- **BM25 search**: After computing BM25 relevance scores
- **Hybrid fusion**: Applied before combining BM25 and vector scores (both RRF and alpha blending)

### Computation

Authority is computed deterministically in `knowledge_base/scripts/utils/authority.ts`:
- Based on `source` field from frontmatter
- Based on file path relative to KB root
- Defaults to Level 3 if no match

### Storage

- Stored in `ChunkMetadata.authority` (optional, defaults to 3)
- Stored in `Bm25Document.authority` (required, defaults to 3)
- Persisted in ChromaDB metadata and BM25 index

## Validation

### Automated Checks

1. **Layout Validation**: Directory structure matches standards
2. **Frontmatter Validation**: All curated files have valid frontmatter
3. **Schema Compliance**: Required fields present and valid
4. **Slug Uniqueness**: No duplicate slugs
5. **Link Validation**: Internal links resolve correctly
6. **Authority Assignment**: BCK papers → Level 1, official docs → Level 2, others → Level 3

### CI Integration

- Run validation on PRs and main branch
- Fail on standards violations
- Generate reports for review

## Best Practices

1. **Always validate frontmatter** before committing curated content
2. **Use descriptive slugs** that are human-readable
3. **Preserve provenance** - include `source_url` and `source_commit` when available
4. **Normalize dates** - use ISO 8601 format consistently
5. **Document changes** - update `KB_REFACTOR_REPORT.md` for major changes
6. **Test ingestion** locally before pushing changes
7. **Keep snapshots** for reproducibility, but don't commit them unless necessary

## Rollback

If standards need to be reverted:

```bash
git checkout main
git branch -D feature/kb-refactor-v1
```

See `KB_REFACTOR_REPORT.md` for detailed rollback procedures.

