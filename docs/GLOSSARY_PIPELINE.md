# Glossary Pipeline

Internal reference for the glossary generation system, from MDX source files to rendered UI.

---

## Table of Contents

1. [Pipeline Overview](#pipeline-overview)
2. [Source Files (MDX)](#source-files-mdx)
3. [Generator Script](#generator-script)
4. [Output Artifacts](#output-artifacts)
5. [Alias Resolution](#alias-resolution)
6. [Related Term Validation](#related-term-validation)
7. [Determinism Guarantees](#determinism-guarantees)
8. [Adding a New Term](#adding-a-new-term)
9. [Running the Pipeline](#running-the-pipeline)
10. [Edge Cases](#edge-cases)

---

## Pipeline Overview

```
MDX Files (source)
    ↓
Unified Generator (scripts/build-nexus-glossary-json.ts)
    ↓
JSON Artifacts (public/data/*.json)
    ↓
UI Components (Astro pages, React islands)
```

The unified generator is the single source of truth. It:
- Parses MDX front matter
- Normalizes titles, slugs, categories, tags
- Validates related terms
- Resolves aliases to canonical slugs
- Outputs deterministic JSON

---

## Source Files (MDX)

Location: `apps/web/src/content/glossary/*.mdx`

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Display name (e.g., "Iroha Virtual Machine (IVM)") |
| `slug` | string | URL slug (lowercase, no hyphens: `irohavirtualmachineivm`) |
| `category` | string | Category name (e.g., "Execution", "Consensus") |
| `summary` | string | 1-2 sentence description |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `tags` | string[] | Tag list (e.g., `["Nexus Architecture"]`) |
| `related` | string[] | Related term titles (validated against canonical) |
| `tagline` | string | "Why it matters" one-liner |
| `status` | string | `canonical`, `alias`, or `deprecated` |
| `targetSlug` | string | For aliases: the canonical slug to redirect to |

### Example MDX Front Matter

```yaml
---
title: "Iroha Virtual Machine (IVM)"
slug: irohavirtualmachineivm
category: "Execution"
tags:
  - "Nexus Architecture"
summary: "The IVM is a purpose-built deterministic runtime that executes Kotodama bytecode with typed ABIs and fixed gas costs."
tagline: "Ensures every node computes identical results, making cross-chain verification trustless."
related:
  - "IVM Bytecode"
  - "Kotodama"
  - "Action"
---

Additional markdown content goes here...
```

---

## Generator Script

Location: `scripts/build-nexus-glossary-json.ts`

### What It Does

1. **Loads MDX files** from `apps/web/src/content/glossary/`
2. **Parses front matter** using regex-based YAML extraction
3. **Normalizes fields**:
   - Titles: TitleCase, preserving acronyms (IVM, WSV, TEU)
   - Slugs: lowercase alphanumeric only
   - Categories: Title Case
   - Tags: alphabetically sorted, deduped
4. **Validates related terms** against canonical slugs
5. **Resolves aliases** (hardcoded + MDX-defined)
6. **Outputs JSON** with deterministic ordering

### Normalization Rules

**Title normalization**:
```typescript
// Input: "iroha virtual machine (ivm)"
// Output: "Iroha Virtual Machine (IVM)"

const ACRONYMS = new Set(['IVM', 'WSV', 'TEU', 'BFT', 'QC', ...]);
```

**Slug normalization**:
```typescript
// Input: "Iroha-Virtual-Machine"
// Output: "irohavirtualmachine"

function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}
```

**Category normalization**:
```typescript
// Input: "execution & vm"
// Output: "Execution & Vm"
```

---

## Output Artifacts

The generator produces four JSON files:

### 1. `glossary.v2025.json`

Full glossary data with metadata.

```json
{
  "terms": [
    {
      "slug": "accountid",
      "title": "AccountId",
      "summary": "The unique identifier...",
      "status": "canonical",
      "targetSlug": null,
      "definition": "The unique identifier...",
      "category": "Accounts & Identity",
      "aliases": [],
      "tags": ["Nexus Architecture"],
      "relatedTerms": ["accountlifecycle", "bech32format"],
      "examples": [],
      "links": [],
      "tagline": "Enables cross-space identity..."
    }
  ],
  "canonicalCount": 179,
  "aliasCount": 13,
  "deprecatedCount": 0,
  "version": 2025,
  "lastUpdated": "2025-12-01T22:00:00.000Z"
}
```

### 2. `glossary.json`

Legacy format (array of terms only).

```json
[
  { "slug": "accountid", "title": "AccountId", ... },
  { "slug": "accountlifecycle", "title": "Account Lifecycle", ... }
]
```

### 3. `glossary.index.json`

Minimal index for search.

```json
{
  "index": [
    {
      "slug": "accountid",
      "title": "AccountId",
      "type": "term",
      "category": "Accounts & Identity",
      "priority": 0,
      "aliases": [],
      "tags": ["Nexus Architecture"],
      "summary": "...",
      "glossaryRef": "/glossary/accountid",
      "blob": "accountid the unique identifier..."
    }
  ],
  "totalCount": 179,
  "lastUpdated": "2025-12-01T22:00:00.000Z"
}
```

### 4. `glossary.aliases.v2025.json`

Alias-to-canonical mappings.

```json
{
  "aliases": [
    { "alias": "ivm", "target": "irohavirtualmachineivm" },
    { "alias": "wsv", "target": "worldstateviewwsv" },
    { "alias": "teu", "target": "transactionexecutionunitsteu" }
  ]
}
```

---

## Alias Resolution

Aliases are resolved in two places:

### 1. Hardcoded Aliases

Defined in the generator for common abbreviations:

```typescript
const HARDCODED_ALIASES: AliasTerm[] = [
  { alias: 'ivm', target: 'irohavirtualmachineivm' },
  { alias: 'wsv', target: 'worldstateviewwsv' },
  { alias: 'teu', target: 'transactionexecutionunitsteu' },
  { alias: 'da', target: 'dataavailability' },
  { alias: 'qc', target: 'quorumcertificate' },
];
```

### 2. MDX-Defined Aliases

Any MDX file with `status: alias` and `targetSlug`:

```yaml
---
title: "IVM"
slug: ivm
status: alias
targetSlug: irohavirtualmachineivm
---
```

### Resolution Order

1. Check if slug exists as canonical
2. Check if slug exists in alias map
3. Check if title matches a canonical term (case-insensitive)

---

## Related Term Validation

The generator validates that every `related` entry resolves to a canonical slug.

```typescript
function resolveRelatedTerm(related: string): string | null {
  // Try direct slug lookup
  const asSlug = titleToSlug(related);
  if (canonicalBySlug.has(asSlug)) return asSlug;

  // Try alias resolution
  if (aliasMap.has(asSlug)) return aliasMap.get(asSlug);

  // Try title lookup
  const byTitle = canonicalByTitle.get(related.toLowerCase());
  if (byTitle) return normalizeSlug(byTitle.slug);

  return null; // Generates warning
}
```

**Warnings** are logged for unresolved related terms but don't fail the build.

---

## Determinism Guarantees

The generator ensures identical output on every run:

1. **Sorted terms**: Canonical terms sorted by slug (`a.localeCompare(b)`)
2. **Sorted aliases**: Alias array sorted by alias key
3. **Sorted tags**: Tags within each term sorted alphabetically
4. **Sorted related**: Related terms sorted alphabetically
5. **Deduped arrays**: No duplicate tags or related terms
6. **Stable JSON**: `JSON.stringify(data, null, 2) + '\n'`

### Verification

Run the parity check to confirm determinism:

```bash
pnpm glossary:verify
```

This runs the generator twice and compares outputs.

---

## Adding a New Term

### Step 1: Create MDX File

Create `apps/web/src/content/glossary/YourTermName.mdx`:

```yaml
---
title: "Your Term Name"
slug: yourtermname
category: "Category Name"
tags:
  - "Nexus Architecture"
summary: "One to two sentence description of the term."
tagline: "Why this term matters to users."
related:
  - "Related Term One"
  - "Related Term Two"
---

Optional additional content in markdown.
```

### Step 2: Validate Slug

- Must be lowercase
- Must be alphanumeric only (no hyphens, underscores)
- Must be unique

### Step 3: Validate Related Terms

Ensure all `related` entries match existing canonical term titles.

### Step 4: Run Generator

```bash
pnpm glossary:build
```

### Step 5: Verify Output

Check the generator output for warnings:

```
⚠️ Warnings (2):
   - Term "Your Term Name": related term "Nonexistent Term" not found
```

---

## Running the Pipeline

### Build Glossary JSON

```bash
# From project root
pnpm glossary:build

# Or from apps/web
pnpm generate:glossary
```

### Verify Determinism

```bash
pnpm glossary:verify
```

### Verify Live Deployment

```bash
pnpm glossary:verify:live https://soranauts.com
```

### Full Prebuild (includes glossary)

```bash
cd apps/web && pnpm prebuild
```

---

## Edge Cases

### Missing Related Slugs

If a `related` entry doesn't resolve, the generator:
- Logs a warning
- Excludes it from `relatedTerms` array
- Does NOT fail the build

### Duplicate Slugs

If two MDX files have the same slug:
- Second file overwrites first in the map
- No explicit warning (but results may be unexpected)

### Invalid Slug Format

If a slug contains uppercase or special characters:
- Generator normalizes it automatically
- Logs a warning about invalid format

### Empty Tags/Related

Empty arrays are valid:

```yaml
tags: []
related: []
```

### Alias to Non-Existent Target

If an alias points to a non-existent canonical:
- Logs a warning
- Alias is NOT included in output

---

## File Reference

| File | Purpose |
|------|---------|
| `scripts/build-nexus-glossary-json.ts` | Unified generator |
| `scripts/verify-generator-parity.ts` | Determinism checker |
| `scripts/verify-glossary-live.ts` | Live deployment checker |
| `apps/web/src/content/glossary/*.mdx` | Source MDX files |
| `apps/web/public/data/glossary.v2025.json` | Full output |
| `apps/web/public/glossary.json` | Legacy output |
| `apps/web/public/glossary.index.json` | Search index |
| `apps/web/public/glossary.aliases.v2025.json` | Alias mappings |


