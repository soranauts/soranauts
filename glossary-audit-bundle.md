# SORANAUTS Glossary Audit Bundle

**Generated:** 2024-12-10
**Purpose:** External review of Glossary v2025 system architecture and content

---

## 1. Glossary File Structure

### Content Directory
```
apps/web/src/content/glossary/
```

### Directory Structure
- **179 MDX term files** (*.mdx)
- **1 TypeScript config file** (glossary.featured.ts)
- No subdirectories - flat structure

### File Naming Convention
- PascalCase filenames matching title (e.g., `AccountId.mdx`, `DataSpaces.mdx`)
- Acronyms in CAPS (e.g., `FASTPQ.mdx`, `MLDSA87.mdx`)
- Compound terms concatenated (e.g., `TransactionLifecycle.mdx`, `WorldStateViewWSV.mdx`)

### Sample Files (alphabetical)
```
AccountId.mdx
AccountLifecycle.mdx
Action.mdx
ActivationSlot.mdx
Admission.mdx
...
ZKBackedAccessTickets.mdx
ZKDAProofs.mdx
ZKSTARKvsSTARK.mdx
```

---

## 2. Frontmatter Schema

### Official Schema (schemas/glossary.frontmatter.schema.json)

**Required fields:**
- `title` (string, 2-100 chars) - Title Case, acronyms UPPER
- `slug` (string, 2-60 chars) - lowercase alphanumeric only, pattern: `^[a-z0-9]+$`
- `category` (string) - enum with 10 allowed values
- `summary` (string, 20-300 chars) - One or two sentence definition

**Optional fields:**
- `tagline` (string, 10-150 chars) - "Why it matters" value proposition
- `tags` (array, max 10) - Sorted unique strings
- `related` (array, max 8) - Canonical slugs of related terms
- `aliases` (array) - Alternative names that redirect
- `deprecated` (boolean) - Mark term as deprecated
- `deprecatedReason` (string) - Required if deprecated=true
- `seeAlso` (string) - Slug of preferred term when deprecated
- `updatedAt` (date) - ISO date of last update
- `links` (array) - External resource links (NOT in official schema but used in files)

### Representative Examples

#### Example 1: Simple Term (AccountId.mdx)
```yaml
---
title: "Account ID"
slug: accountid
category: "Accounts & Identity"
tags:
  - "Nexus Architecture"
summary: "An Account ID is a typed Norito pointer that uniquely identifies a Nexus account across all networks, data spaces, and execution lanes. It encodes the network identifier, the data-space UUID, the domain, the human-readable account name, and a checksum that prevents malformed or ambiguous identifiers. This structured format ensures deterministic routing and stable identity resolution throughout SORA Nexus."
tagline: "Account IDs allow Nexus applications, smart contracts, validators, and users to reference accounts safely and consistently. The checksum prevents mis-addressing, the namespace fields prevent cross-domain collisions, and the typed Norito format ensures that account references behave identically across all lanes and data spaces. This enables reliable interoperability, secure transaction routing, and clear identity governance across the entire network."
related:
  - "Account Lifecycle"
  - "AssetDefinitionId"
  - "Bech32 Format"
  - "Dual-Sig"
  - "Multisig"
links:
  - label: "Nexus Whitepaper"
    url: "/documents/sora_nexus_whitepaper.pdf"
---
```

#### Example 2: Complex Term with Many Related (FASTPQ.mdx)
```yaml
---
title: "FASTPQ"
slug: fastpq
category: "Cryptography"
tags:
  - "Nexus Architecture"
summary: "SORA Nexus's zk-STARK proof system that captures Iroha Special Instructions with high throughput and post-quantum security."
tagline: "Captures Iroha Special Instructions with high throughput and post-quantum security."
related:
  - "FASTPQ Constraint System"
  - "FASTPQ End-to-End Example"
  - "FASTPQ Proof Composition"
  - "FASTPQ zk-STARK Proofs"
  - "FASTPQ-ISI Proofs"
links:
  - label: "Nexus Whitepaper"
    url: "/documents/sora_nexus_whitepaper.pdf"
---
```

#### Example 3: Governance/Architecture Term (DataSpaces.mdx)
```yaml
---
title: "Data Spaces"
slug: dataspaces
category: "Governance"
tags:
  - "Nexus Architecture"
summary: "Sovereignty-preserving partitions allowing different jurisdictions or applications to share the same ledger without sharing private data."
tagline: "Enables enterprises and regulators to participate in SORA while maintaining data isolation."
related:
  - "Private Data Spaces"
  - "Public Data Spaces"
  - "Sovereign Data Spaces"
  - "Data Space Directory"
  - "Data Availability"
links:
  - label: "Nexus Whitepaper"
    url: "/documents/sora_nexus_whitepaper.pdf"
---
```

### Frontmatter Variations Observed

| Field | Variation | Notes |
|-------|-----------|-------|
| `links` | Present in most files | NOT in official schema but commonly used |
| `related` | Uses Title Case names | Schema says slugs, but files use display names |
| `category` | Uses custom categories | Doesn't match schema enum (see Section 6) |
| `tagline` | Some are very short | e.g., "Creates." or "Enables commands." |

---

## 3. Content Structure

### MDX Body Content
**All 179 glossary MDX files have EMPTY body content** - only frontmatter is present.

The page rendering system pulls all display content from frontmatter fields:
- `summary` → Definition section
- `tagline` → "Why it matters" section
- `related` → Related terms chips
- `links` → Sources/resources section

### No MDX Components Used
Glossary term files do NOT import or use any MDX components. They are pure YAML frontmatter.

### Page Rendering (apps/web/src/pages/glossary/[slug].astro)
The page component reads from:
1. JSON data files (glossary.v2025.json)
2. MDX frontmatter as fallback
3. Taxonomy.ts for ecosystem terms

Key display logic:
```typescript
const displayDefinition = runtimeTerm?.definition ?? runtimeTerm?.summary ?? term.definition ?? term.summary ?? '';
const whyItMatters = term.tagline ?? term.subtitle ?? null;
```

---

## 4. Glossary Data Files

### File Inventory

| File | Location | Lines | Purpose |
|------|----------|-------|---------|
| glossary.v2025.json | apps/web/public/data/ | 9,774 | Primary data source |
| glossary.json | apps/web/public/ | 9,767 | Legacy format |
| glossary.index.json | apps/web/public/ | 4,258 | Search index |
| glossary.minimal.json | apps/web/public/data/ | 2,439 | SSR hero rendering |
| glossary.aliases.v2025.json | apps/web/public/ | 160 | Alias redirects |
| article-glossary-map.json | apps/web/public/data/ | 2,206 | Post-to-term mapping |
| Per-term JSON files | apps/web/public/data/glossary/terms/ | 369 files | Lazy loading |

### glossary.v2025.json Entry Schema
```json
{
  "slug": "accountid",
  "title": "Account ID",
  "summary": "A typed Norito pointer uniquely referencing...",
  "status": "canonical",
  "targetSlug": null,
  "definition": "A typed Norito pointer uniquely referencing...",
  "category": "Accounts & Identity",
  "aliases": [],
  "tags": ["Nexus Architecture"],
  "relatedTerms": ["accountlifecycle", "assetdefinitionid", "bech32format", "dualsig", "multisig"],
  "examples": [],
  "links": [],
  "tagline": "Enables human-readable addresses while preventing typos and cross-chain confusion."
}
```

### glossary.index.json Entry Schema
```json
{
  "slug": "xor",
  "title": "XOR",
  "type": "term",
  "category": "token",
  "priority": 0,
  "aliases": ["XOR"],
  "tags": ["token", "val", "pswap", "token bonding curve", "elastic supply", "polkaswap"],
  "summary": "The network utility token used for transaction fees...",
  "definition": "The network utility token used for transaction fees...",
  "entity": null,
  "versions": [],
  "relatedTerms": ["VAL", "PSWAP", "Token Bonding Curve", "Elastic Supply", "Polkaswap"],
  "glossaryRef": "/glossary/xor",
  "blob": "xor xor val pswap token bonding curve..."
}
```

### glossary.minimal.json Entry Schema
```json
{
  "slug": "accountid",
  "title": "Account ID",
  "category": "Accounts & Identity",
  "summary": "A typed Norito pointer uniquely referencing...",
  "tagline": "Enables human-readable addresses..."
}
```

### glossary.aliases.v2025.json Structure
```json
{
  "aliases": [
    { "alias": "ivm", "target": "irohavirtualmachineivm" },
    { "alias": "wsv", "target": "worldstateviewwsv" },
    { "alias": "da", "target": "dataavailability" },
    { "alias": "qc", "target": "quorumcertificate" },
    { "alias": "teu", "target": "transactionexecutionunitsteu" },
    { "alias": "sfq", "target": "starttimefairqueuingsfq" }
  ]
}
```
**Total aliases defined:** 38

---

## 5. Search Implementation

### Files
- `apps/web/src/lib/glossary/search.ts` - Main search engine
- `apps/web/tests/unit/glossary/search-engine.spec.ts` - Unit tests
- `apps/web/tests/e2e/glossary/search-ranking.spec.ts` - E2E tests

### Search Weights Configuration
```typescript
const WEIGHTS = {
  titleExact: 1000,    // Exact title match
  aliasExact: 900,     // Exact alias match
  prefix: 700,         // Prefix match
  titleToken: 600,     // Token in title
  aliasToken: 500,     // Token in alias
  tag: 300,            // Tag match
  body: 200,           // Definition body match
  fuzzy: 100,          // Fuzzy match (Levenshtein)
  priority: 5,         // Priority multiplier
};
```

### Indexed Fields
- **term** (title) - tokenized, exact match, prefix match
- **slug** - normalized
- **definition** - body text search
- **aliases** - tokenized, exact match
- **tags** - normalized matching
- **relatedTags** - normalized matching
- **priority** - sort weight

### Search Features
- Levenshtein fuzzy matching (distance ≤ 2)
- Alias resolution
- "Did you mean?" suggestions
- Featured entity highlighting
- Category filtering
- Type filtering (term, entity, version, tag)

---

## 6. Category & Tag Inventory

### Categories Used in MDX Files (179 files)

| Category | Count |
|----------|-------|
| Cryptography | 38 |
| Execution | 34 |
| Governance | 17 |
| Data Availability | 16 |
| Consensus | 14 |
| Networking | 11 |
| Serialization & Encoding | 10 |
| Observability & Operations | 9 |
| Accounts & Identity | 9 |
| Economics | 8 |
| Developer Experience | 6 |
| Use Cases | 4 |
| Storage | 3 |

### ⚠️ Schema vs Usage Mismatch
The official schema defines these categories:
```
Technology, Governance, Economics, Tokens, DeFi, 
Infrastructure, Community, Security, Interoperability, Development
```

**Actual categories used in MDX files do NOT match the schema enum.**

### Tags Inventory

| Tag | Count |
|-----|-------|
| Nexus Architecture | 179 (all files) |

All 179 MDX files use the same single tag: "Nexus Architecture"

### Additional Categories in JSON (from taxonomy.ts)
The JSON files include additional categories from the taxonomy system:
- Token
- DeFi
- Ecosystem
- General
- Technology
- Network

---

## 7. Related Terms Validation

### Sample of 10 Terms with Related Term Resolution

#### 1. Sumeragi
- **Related:** SUMERAGI Pipeline, Sumeragi Consensus, Commit Window, Epoch Beacon, Lane Finality
- **Status:** ✅ All files exist

#### 2. Norito
- **Related:** Norito TLV, Norito Codec, Norito Receipts, Norito Streaming, Norito-First APIs
- **Status:** ✅ All files exist

#### 3. Kotodama
- **Related:** Kotodama Bytecode, Kotodama Runtime, IVM Bytecode, Iroha Virtual Machine (IVM), Triggers
- **Status:** ✅ All files exist

#### 4. Poseidon2
- **Related:** Blake2b, Canonical Primitives, Commitments, Curve25519, DEEP-FRI
- **Status:** ✅ All files exist

#### 5. Ed25519
- **Related:** Blake2b, Canonical Primitives, Commitments, Curve25519, DEEP-FRI
- **Status:** ✅ All files exist

#### 6. ML-DSA-87
- **Related:** Merge Ledger, Blake2b, Canonical Primitives, Commitments, Curve25519
- **Status:** ✅ All files exist

#### 7. Kura
- **Related:** Erasure-Coded Kura, SoraFS, World State View (WSV)
- **Status:** ✅ All files exist

#### 8. Merge Ledger
- **Related:** ML-DSA-87, Action, Activation Slot, Admission, Aggregation
- **Status:** ✅ All files exist

#### 9. Governance Surfaces
- **Related:** Parameter Sets, Assembly, Governed Manifest, Runtime Upgrades, Data Spaces
- **Status:** ✅ All files exist

#### 10. Circuit Breakers
- **Related:** Circuit-Breaker State, Geo-Redundancy, Lane and DA Budgets, Lane-Scoped Recovery, Lane-Scoped State
- **Status:** ✅ All files exist

### Related Term Format Issue
⚠️ The `related` field in MDX files uses **display titles** (e.g., "Account Lifecycle") but the schema specifies **slugs** (e.g., "accountlifecycle"). The build script handles this conversion.

---

## 8. Potential Issues

### Critical Issues

#### 1. Category Schema Mismatch
**Severity:** High
**Issue:** MDX files use 13 custom categories that don't match the 10-item enum in the official schema.

**Used in files:** Accounts & Identity, Consensus, Cryptography, Data Availability, Developer Experience, Economics, Execution, Governance, Networking, Observability & Operations, Serialization & Encoding, Storage, Use Cases

**In schema:** Technology, Governance, Economics, Tokens, DeFi, Infrastructure, Community, Security, Interoperability, Development

**Impact:** Schema validation would fail for most terms.

### Moderate Issues

#### 2. Some Taglines Are Truncated/Incomplete
**Severity:** Medium
**Examples:**
- "Creates." (Account Lifecycle)
- "Enables commands." (Norito)
- "Unifies private data spaces." (SORA Nexus)

These don't explain "why it matters" - they're sentence fragments.

#### 3. Links Field Not in Schema
**Severity:** Low
**Issue:** The `links` array is used in most files but not defined in the official schema.
**Impact:** Schema validation would reject files with links if strict mode.

### Informational

#### 4. Single Tag Used
**Note:** All 179 MDX files use only "Nexus Architecture" as a tag.
**Impact:** Tags don't provide differentiation for filtering.

#### 5. No Duplicate Slugs or Titles
✅ Verified: All slugs are unique
✅ Verified: All titles are unique

#### 6. No Files Missing Required Fields
✅ All files have: title, slug, category, summary
✅ All files have: tagline (though some are minimal)
✅ All files have: related terms

#### 7. Alias Coverage
38 aliases defined for common abbreviations:
- IVM → irohavirtualmachineivm
- WSV → worldstateviewwsv
- DA → dataavailability
- TEU → transactionexecutionunitsteu
- etc.

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total MDX term files | 179 |
| Total terms in JSON (including taxonomy) | 369 |
| Total aliases defined | 38 |
| Total categories (MDX) | 13 |
| Total per-term JSON files | 369 |
| Files with all required fields | 179 (100%) |
| Duplicate slugs | 0 |
| Duplicate titles | 0 |
| Related terms validated | 10/10 ✅ |

---

## Recommendations

1. **Update schema** to match actual categories used, OR migrate terms to use schema-compliant categories
2. **Review short taglines** - several need expansion to properly explain "why it matters"
3. **Add `links` field to schema** since it's commonly used
4. **Consider diversifying tags** beyond just "Nexus Architecture"
5. **Document the build pipeline** that converts MDX frontmatter to JSON

---

*End of Audit Bundle*

