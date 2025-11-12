# Related Articles V2 Update Summary

## Overview

Upgraded the Related Articles component to a hybrid recommender system with graceful fallbacks, enabling it to work effectively even when many legacy posts lack tags. Added a CLI tool for tag backfilling to improve content metadata over time.

## What Changed

### Core Implementation

**New Files:**
- `apps/web/src/config/related.config.ts` - Centralized weights configuration
- `apps/web/src/utils/related.ts` - Hybrid recommendation engine
- `apps/web/scripts/related-tags-suggest.ts` - Tag backfill CLI tool
- `apps/web/docs/related-readme.md` - Technical documentation
- `apps/web/tests/unit/related/related.spec.ts` - Unit tests
- `apps/web/tests/unit/related/related.snapshot.spec.ts` - Snapshot tests for algorithm drift detection

**Modified Files:**
- `apps/web/src/components/blog/RelatedArticles.astro` - Feature flag + new logic
- `apps/web/src/layouts/BlogPostLayout.astro` - Passes updateDate to component
- `apps/web/package.json` - Added `web:related:suggest` script

### Key Features

1. **Multi-Signal Scoring System**
   - Tag matching (3.0x weight)
   - Foundational tag bonus (0.4x)
   - Glossary term overlap (1.6x)
   - Title keyword similarity (1.2x)
   - Same section/category (0.6x)
   - Recency decay (0.8x max)

2. **Graceful Fallbacks**
   - Works for posts with 0 tags
   - Falls back to title keywords, glossary terms, section, and recency
   - Backfills with recency-based posts if threshold not met

3. **Quality Guardrails**
   - Minimum score threshold (0.5)
   - Series deduplication (max 1 per series, detects `-part-\d+` pattern)
   - Zero-state hiding (<2 results)
   - Deterministic ordering: `score DESC → updateDate DESC → slug ASC`

4. **Feature Flag**
   - `RELATED_V2` defaults to `true` in dev, `false` in prod
   - Safe rollout with legacy fallback

5. **Tag Backfill CLI**
   - Suggests tags for posts with 0 tags
   - Uses glossary terms, nearest neighbors, taxonomy
   - Preview mode by default, `--apply` to write
   - Safety limits (max 4 tags, confidence threshold)

## Configuration

Weights are tunable in `apps/web/src/config/related.config.ts` (single source of truth):

```typescript
{
  tagMatch: 3.0,
  foundationalBonus: 0.4,
  glossaryOverlap: 1.6,
  titleKeyword: 1.2,
  sameSection: 0.6,
  recencyMax: 0.8,
  minScoreThreshold: 0.5,
  minResultsCount: 2,
}
```

**Stop Words**: Exported as `stopWordsArray` from `related.config.ts` for title keyword filtering. Single source of truth for all tokenization.

**Glossary Source**: `public/glossary.json` (generated at build time). System fails gracefully if missing (skips glossary overlap signal).

## Usage

### Enable in Production (Canary)

```bash
RELATED_V2=true pnpm --filter @soranauts/web build
```

### Disable in Development

```bash
RELATED_V2=false pnpm dev
```

### Tag Backfill

```bash
# Preview suggestions (dry-run by default)
pnpm web:related:suggest

# Apply changes
pnpm web:related:suggest --apply

# With options
pnpm web:related:suggest --limit 20 --confidence 0.5 --apply
```

**Scripts:**
- `"web:related:suggest"`: Tag backfill CLI (preview/apply modes)
- `"web:test:related"`: Run related articles unit tests

## Testing

Run unit tests:
```bash
pnpm web:test:related
# or
pnpm test:unit tests/unit/related
```

**Test Coverage:**
- Exclusion logic (current post, drafts, canonicalized)
- Deterministic ordering under ties
- Zero-state behavior (<2 results)
- Series deduplication
- Threshold backfill triggers
- Snapshot tests for algorithm drift detection (fixed fixture: 5 tagged + 5 untagged posts)

## Performance Impact

- **Build-time only**: No runtime network/FS reads in Astro component
- **O(N) complexity**: Single pass through candidate set
- **Expected build time regression**: <5%
- **Optimizations**: 
  - Glossary data cached after first load
  - Short-circuit to top-10 heap when stable (future optimization)
- **Lighthouse/CLS**: Unchanged (visual tokens/classes preserved)

## Breaking Changes

**None** - Feature is behind flag, legacy behavior preserved when flag is false.

## Migration Notes

1. **Default Behavior**: V2 enabled in dev, disabled in prod
2. **Weights**: Can be tuned without code changes via config file
3. **Tagging**: Use CLI tool to backfill tags over time
4. **Debugging**: Check `data-rel-score` and `data-rel-signals` attributes in dev

## Next Steps

1. Test on sample of 10 posts (mix of tagged/untagged)
2. Verify zero-state behavior
3. Tune weights if needed
4. Run tag backfill CLI on untagged posts
5. Enable in production after verification

## Sample Output

**Related Articles (V2 enabled):**
- Shows 3-5 relevant articles
- Each card has `data-rel-score` and `data-rel-signals` attributes
- Debug logs in dev console show scoring breakdown

**Tag Backfill CLI:**
```
SLUG                                              CURRENT        SUGGESTED                CONFIDENCE   SIGNALS
────────────────────────────────────────────────────────────────────────────────────────────────────────────
post-without-tags                                —              sora, xor, defi          0.65         glossary:sora;neighbor:xor
```

## Documentation

- Technical docs: `apps/web/docs/related-readme.md`
- Config: `apps/web/src/config/related.config.ts`
- Tests: `apps/web/tests/unit/related/related.spec.ts`

