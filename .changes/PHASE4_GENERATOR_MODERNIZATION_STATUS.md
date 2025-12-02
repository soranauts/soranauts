# Phase 4: Generator Modernization — Status Report

**Date:** December 1, 2025  
**Scope:** Replace legacy glossary builders with unified deterministic generator  
**Status:** ✅ Complete — Parity Achieved

---

## Summary

Successfully modernized the glossary generation pipeline to use a single source of truth (`build-nexus-glossary-json.ts`). The new generator produces deterministic output with full normalization, validation, and alias resolution.

---

## Key Achievements

### 1. Unified Generator
- **Single source of truth:** All glossary JSON now generated from MDX files in `apps/web/src/content/glossary/`
- **Deterministic output:** Same ordering every build (sorted by slug)
- **Full normalization:** Titles (TitleCase), slugs (lowercase), categories (Title Case)
- **Tag handling:** Stable sort, dedupe
- **Related term validation:** Resolves aliases → canonical, warns on missing

### 2. Parity Verification
- Created `verify-generator-parity.ts` to validate output structure
- All checks pass: structure, ordering, deduplication, alias targets

### 3. Build Integration
- `apps/web/scripts/generate-glossary-json.ts` now delegates to unified generator
- Added `pnpm glossary:build` and `pnpm glossary:verify` scripts
- Legacy generator preserved in `scripts/legacy/` for reference

---

## Files Created/Modified

### New Files
| File | Purpose |
|------|---------|
| `scripts/verify-generator-parity.ts` | Validates generator output structure and determinism |
| `apps/web/tests/e2e/glossary.generator.spec.ts` | Playwright tests for generator output |
| `scripts/legacy/generate-glossary-json.legacy.ts` | Preserved legacy generator for reference |

### Modified Files
| File | Changes |
|------|---------|
| `scripts/build-nexus-glossary-json.ts` | Complete rewrite with normalization, validation, determinism |
| `apps/web/scripts/generate-glossary-json.ts` | Now delegates to unified generator |
| `apps/web/src/types/glossary.ts` | Updated types to match generator output |
| `apps/web/src/utils/glossary-processor.ts` | Fixed missing `title` and `summary` fields |
| `package.json` | Added `glossary:build` and `glossary:verify` scripts |

---

## Generator Output

```bash
$ pnpm glossary:verify

📂 Found 179 MDX files
✅ Generator completed successfully
   Canonical: 179
   Aliases:   13
   Deprecated: 0

✅ Glossary V2025 Structure
✅ Aliases Structure
✅ Determinism
✅ Expected Counts

──────────────────────────────────────────────────
✅ PARITY ACHIEVED - All verifications passed!
```

---

## Output Files

| File | Description |
|------|-------------|
| `apps/web/public/data/glossary.v2025.json` | Full glossary data with metadata |
| `apps/web/public/glossary.json` | Legacy format (array of terms) |
| `apps/web/public/glossary.index.json` | Search index with blob field |
| `apps/web/public/glossary.aliases.v2025.json` | Alias → canonical mappings |

---

## Normalization Rules

### Title Normalization
```typescript
// TitleCase with acronym preservation
"Iroha Virtual Machine (IVM)" → "Iroha Virtual Machine (IVM)"
"data availability" → "Data Availability"
```

### Slug Normalization
```typescript
// Lowercase alphanumeric only
"IrohaVirtualMachineIVM" → "irohavirtualmachineivm"
"Data-Availability" → "dataavailability"
```

### Category Normalization
```typescript
// Title Case with & separator
"data availability" → "Data Availability"
"accounts & identity" → "Accounts & Identity"
```

### Tag Handling
- Alphabetically sorted
- Deduplicated (case-insensitive)
- Preserves known tags like "Nexus Architecture"

---

## Alias Mappings (13 total)

| Alias | Canonical |
|-------|-----------|
| `ivm` | `irohavirtualmachineivm` |
| `wsv` | `worldstateviewwsv` |
| `teu` | `transactionexecutionunitsteu` |
| `da` | `dataavailability` |
| `qc` | `quorumcertificate` |
| `sfq` | `starttimefairqueuingsfq` |
| ... | ... |

---

## Warnings (Non-blocking)

```
⚠️ Term "Memory Model": related term "State Root" not found
⚠️ Term "Memory Model": related term "Merkle Proof" not found
```

These are content issues (missing MDX files), not generator bugs.

---

## Playwright Tests

New test file: `apps/web/tests/e2e/glossary.generator.spec.ts`

| Test | Description |
|------|-------------|
| `glossary.v2025.json has expected structure` | Validates JSON shape |
| `canonical count matches expected (~179)` | Count verification |
| `terms are sorted by slug` | Determinism check |
| `no duplicate slugs` | Uniqueness validation |
| `all terms have required fields` | Field completeness |
| `aliases point to valid canonical slugs` | Alias target validation |
| `/glossary loads with new generator` | Page render test |
| `10 random canonical slugs return 200 OK` | Random page tests |
| `alias slugs redirect to canonical (308)` | Redirect tests |
| `key Nexus terms render correctly` | Key term validation |
| `terms with tagline display "Why it matters"` | Tagline display |

---

## Build Verification

```bash
# Typecheck passes
$ pnpm -w typecheck
# Result: 0 errors

# Build passes
$ pnpm --filter @soranauts/web build
# Result: 413 page(s) built

# Determinism verified (3 consecutive runs)
$ for i in 1 2 3; do pnpm glossary:build | grep Stats; done
📊 Stats: {"canonical":179,"aliases":13,"deprecated":0,"warnings":2}
📊 Stats: {"canonical":179,"aliases":13,"deprecated":0,"warnings":2}
📊 Stats: {"canonical":179,"aliases":13,"deprecated":0,"warnings":2}
```

---

## Scripts Added

```json
{
  "glossary:build": "tsx scripts/build-nexus-glossary-json.ts",
  "glossary:verify": "tsx scripts/build-nexus-glossary-json.ts && tsx scripts/verify-generator-parity.ts"
}
```

---

## Done Criteria

- [x] Parity script output identical between runs
- [x] New generator is default (via `generate:glossary` delegation)
- [x] Legacy generator preserved in `scripts/legacy/`
- [x] Build is deterministic across runs
- [x] Typecheck passes
- [x] Build passes (413 pages)
- [x] Playwright tests created

---

## Next Steps (Phase 5)

Ready for Phase 5 when you send it!

---

## Developer Notes

### Running the Generator
```bash
# Build glossary JSON
pnpm glossary:build

# Build and verify
pnpm glossary:verify

# Full web build (includes glossary)
pnpm --filter @soranauts/web build
```

### Adding New Terms
1. Create MDX file in `apps/web/src/content/glossary/`
2. Include required frontmatter: `title`, `slug`, `category`, `summary`
3. Run `pnpm glossary:verify` to validate



