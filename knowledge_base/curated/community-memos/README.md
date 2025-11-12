# Community Memos Directory

This directory contains community governance memos and related documents for the SORA ecosystem, organized by year.

## Purpose

Community memos provide contextual, supplemental information about ecosystem developments, governance decisions, and community activities. These documents are indexed in the Knowledge Base with **Authority Level 3** (supplemental, not canonical).

## Authority Level

- **Level 3 (Neutral)**: Community memos are treated as supplemental material
- They provide context but never override Level 1 (BCK papers, internal research) or Level 2 (official docs/wiki) sources
- Used for background information and community perspective

## Directory Structure

Community memos are organized by year:

```
community-memos/
├── 2023/
│   ├── SORA Community Memo-2023-July.pdf
│   ├── SORA Community Memo-2023-September.pdf
│   └── ...
├── 2024/
│   ├── SORA Community Memo-2024-January.pdf
│   ├── SORA Community Memo-2024-February.pdf
│   └── ...
└── 2025/
    ├── SORA Community Memo-2025-January.pdf
    ├── SORA Community Memo-2025-February.pdf
    └── ...
```

**Place memos in the appropriate year folder** based on the memo's date.

## Adding Memos

### PDF Files

Place PDF memo files in the appropriate year subdirectory (e.g., `2024/`, `2025/`). The ingestion pipeline will automatically:
- Recursively scan all year subdirectories
- Extract text from PDFs
- Convert to markdown format (placed next to the PDF in the same year folder)
- Generate proper frontmatter
- Index for retrieval

**Important**: 
- Files with `invoice` in the filename OR `type: invoice` in frontmatter are automatically excluded from ingestion
- Invoices are allowed for archival purposes but will be skipped during ingestion via filename/frontmatter rules

### Frontmatter Template

When manually creating markdown memos, use this template (place in the appropriate year folder):

```yaml
---
title: "Community Memo – 2025 September"
slug: "community-memo-2025-09"
source: "community-memo"
source_url: "internal://soranauts/community-memos/2025/community-memo-2025-09"
publishDate: "2025-09-30T00:00:00Z"
updateDate: "2025-09-30T00:00:00Z"
content_sha256: ""
snapshot_id: "2025-09-30"
verified_by: "Community Governance Group"
tags: ["sora", "governance", "ecosystem", "community"]
---
```

Note: The `source_url` should include the year path (e.g., `community-memos/2025/...`).

### Required Fields

- `title`: Human-readable title
- `slug`: Kebab-case unique identifier
- `source`: Must be `"community-memo"`
- `source_url`: Internal URL or file path
- `publishDate`: ISO 8601 datetime
- `content_sha256`: Will be computed during ingestion (can be empty initially)
- `snapshot_id`: YYYY-MM-DD format

### Optional Fields

- `updateDate`: Last update datetime
- `verified_by`: Who verified/approved the memo
- `tags`: Array of relevant tags

## Invoice Exclusion

To exclude a file from ingestion:

1. **Filename method**: Include `invoice` in the filename (e.g., `Community-Memo-Invoice-2025-09.pdf`)
2. **Frontmatter method**: Add `type: invoice` to the frontmatter

## Examples

- `2025/Community-Memo-2025-September.pdf` → Will be ingested
- `2025/Community-Memo-Invoice-2025-September.pdf` → Will be excluded (invoice in filename)
- `2024/community-memo-2024-09.md` → Will be ingested (if no `type: invoice`)
- Invoices can be archived in year folders but will be automatically excluded from ingestion

## Retrieval Behavior

Community memos appear in retrieval results as supplemental context. They will:
- Never outrank Level 1–2 sources on the same topic
- Provide additional context and community perspective
- Support understanding of ecosystem developments

