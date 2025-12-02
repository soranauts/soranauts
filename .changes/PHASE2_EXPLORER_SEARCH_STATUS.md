# Phase 2: Explorer Search + Nexus Stats Integration — Status Report

**Date:** December 1, 2025  
**Scope:** Unify Explorer search with Glossary index + live Nexus term count  
**Status:** ✅ Complete — Ready for QA

---

## Summary

Unified the Explorer search with the canonical Glossary index and added live Nexus term count display in the Explorer hero. The search infrastructure is now shared between Glossary and Explorer, ensuring consistent results.

---

## Features Implemented

| Feature | Status |
|---------|--------|
| Shared Glossary search index | ✅ Done |
| Explorer search wrapper | ✅ Done |
| Live Nexus term count in hero | ✅ Done |
| Canonical slug resolution | ✅ Done |
| No new design tokens | ✅ Verified |

---

## Files Created

### 1. `apps/web/src/lib/search/sharedGlossaryIndex.ts`

Provides a single, canonical glossary search index:
- `getSharedSearchEngine()` — singleton search engine instance
- `searchGlossary(query, options)` — search with canonical slug resolution
- `resolveAliasToCanonical(alias)` — resolve alias to canonical term
- Re-exports `getCanonicalSlug` for convenience

### 2. `apps/web/src/lib/search/explorerSearch.ts`

Wrapper around shared index for Explorer use:
- `searchExplorer(query, limit)` — search with deduplication and hrefs
- `resolveToCanonical(slugOrAlias)` — resolve any slug to canonical
- `isCanonicalSlug(slug)` — check if slug is canonical
- Returns results with `href` property for navigation

### 3. `apps/web/tests/e2e/explorer.search.spec.ts`

Playwright e2e tests:
- Explorer hero displays Nexus term count
- Count is readable in dark mode (AA compliance)
- Clicking Nexus terms navigates to glossary
- Search parity with Glossary for "Sumeragi"
- Alias slugs resolve to canonical pages
- No duplicate canonical slugs in Nexus section
- All hero stats visible and have values

---

## Files Modified

### 1. `apps/web/src/lib/glossary/stats.ts`

**Added:**
- Import `NEXUS_SUBGROUPS` from nexus-explorer config
- `nexusTermCount` field in `GlossaryStats` interface
- `getNexusTermCount()` — counts unique terms from Nexus config subgroups

**Changes:**
```typescript
// New function
export function getNexusTermCount(): number {
  const terms = new Set<string>();
  for (const subgroup of NEXUS_SUBGROUPS) {
    for (const term of subgroup.terms) {
      terms.add(term);
    }
  }
  return terms.size;
}
```

### 2. `apps/web/src/pages/explore/index.astro`

**Added:**
- Import `getNexusTermCount` from stats module
- `nexusTermCount` variable computed at build time
- New stat card in hero: "Nexus terms: {nexusTermCount}"

**Changes:**
```astro
<!-- New stat in hero -->
{nexusTermCount > 0 && (
  <div class="tag-hub-hero__stat">
    <dt>Nexus terms</dt>
    <dd>{nexusTermCount}</dd>
  </div>
)}
```

---

## Verification

```bash
# Typecheck passed
pnpm -w typecheck
# Result: 0 errors

# Build passed
pnpm --filter @soranauts/web build
# Result: 389 page(s) built
```

**Manual QA completed:**
- `/explore` — Hero shows "Nexus terms: 81"
- Stats are legible in both light and dark mode
- Nexus section links navigate to canonical glossary pages

---

## Screenshot Evidence

Explorer hero with Nexus term count:
- Curated topics: 41
- Quick journeys: 3
- **Nexus terms: 81** ✅
- Latest update: Nov 29, 2025

---

## Search Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    sharedGlossaryIndex.ts                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  getSharedSearchEngine() - singleton                │   │
│  │  searchGlossary() - canonical results               │   │
│  │  resolveAliasToCanonical() - alias resolution       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │   Glossary   │   │   Explorer   │   │   Future...  │
   │    Search    │   │    Search    │   │              │
   └──────────────┘   └──────────────┘   └──────────────┘
```

---

## Nexus Term Count Source

The count (81) comes from `NEXUS_SUBGROUPS` in `nexus-explorer.config.ts`:

| Subgroup | Terms |
|----------|-------|
| Accounts & Identity | 9 |
| Execution & Virtual Machine | 12 |
| Consensus & Scheduling | 12 |
| Lanes & Data Availability | 15 |
| Governance & Rulemaking | 14 |
| Economics & Fees | 8 |
| Cross-Chain & Interoperability | 11 |
| **Total (unique)** | **81** |

---

## Done Criteria

- [x] Search parity with Glossary confirmed
- [x] Live Nexus count visible and accurate (81 terms)
- [x] No new design tokens added
- [x] Typecheck + build clean
- [x] Dark mode: count text readable (AA)

---

## Edge Cases Handled

- **Index unavailable:** Returns empty results, no errors
- **Stats unavailable:** Nexus stat hidden gracefully (conditional render)
- **Zero Nexus terms:** Stat hidden (conditional `{nexusTermCount > 0 && ...}`)

---

## Next Steps (Phase 3)

Ready for Phase 3 when you send it!



