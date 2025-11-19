# Related Articles Recommender

Hybrid recommender system for blog post related articles with graceful fallbacks for posts with missing tags.

## Overview

The Related Articles component uses a multi-signal scoring system to recommend relevant posts:

1. **Tag matching**: Exact tag overlap (case-insensitive slug equality)
2. **Foundational bonus**: Extra weight for tags linked to glossary terms or high-priority taxonomy nodes
3. **Glossary overlap**: Count of shared glossary terms between posts
4. **Title keyword**: Tokenized title word overlap (stop-word filtered)
5. **Same section**: Category match bonus
6. **Recency**: Time-decay based on updateDate (0 at >365d, 0.5 at 180d, 1.0 at ≤90d)

## Configuration

Weights are configured in `apps/web/src/config/related.config.ts`:

```typescript
export const relatedConfig: RelatedConfig = {
  tagMatch: 3.0,              // Weight per shared tag
  foundationalBonus: 0.4,     // Bonus if any tag is foundational
  glossaryOverlap: 1.6,       // Weight per glossary term overlap
  titleKeyword: 1.2,          // Weight per title keyword match
  sameSection: 0.6,           // Weight for same category
  recencyMax: 0.8,            // Max weight for recency signal
  minScoreThreshold: 0.5,     // Minimum score to include
  minResultsCount: 2,          // Minimum results to show section
};
```

### Tuning Weights

To adjust ranking behavior, edit `related.config.ts`:

**Example: Emphasize tag matching**
```typescript
tagMatch: 5.0,  // Increased from 3.0
```

**Example: Reduce recency influence**
```typescript
recencyMax: 0.4,  // Decreased from 0.8
```

**Example: Require higher quality matches**
```typescript
minScoreThreshold: 1.0,  // Increased from 0.5
```

After changing weights, rebuild to see new ordering:
```bash
pnpm build
```

## Feature Flag

The new recommender is controlled by the `RELATED_V2` environment variable:

- **Development**: Enabled by default (`RELATED_V2=true` when `NODE_ENV=development`)
- **Production**: Disabled by default unless explicitly set

To enable in production:
```bash
RELATED_V2=true pnpm build
```

To disable in development:
```bash
RELATED_V2=false pnpm dev
```

## Tag Backfill Helper

The CLI tool suggests tags for posts with 0 tags:

### Preview Mode (Default)
```bash
pnpm web:related:suggest
```

### Limit Results
```bash
pnpm web:related:suggest --limit 20
```

### Adjust Confidence Threshold
```bash
pnpm web:related:suggest --confidence 0.5
```

### Apply Changes
```bash
pnpm web:related:suggest --apply
```

### Combined Options
```bash
pnpm web:related:suggest --limit 20 --confidence 0.4 --apply
```

The tool suggests tags based on:
- **Glossary terms**: Matches found in title/excerpt
- **Nearest neighbors**: Tags from posts with similar titles
- **Taxonomy**: Validates suggestions against taxonomy system

**Safety features**:
- Never adds more than 4 tags per post
- Never overwrites existing tags (only appends)
- Skips if confidence < threshold
- Dry-run by default (use `--apply` to write)

## Output Format

Each related article card includes debug attributes:

- `data-rel-score`: Final relevance score (rounded to 3 decimals)
- `data-rel-signals`: JSON object with individual signal values:
  ```json
  {
    "tagMatch": 2,
    "foundationalBonus": 1,
    "glossaryOverlap": 3,
    "titleKeyword": 1,
    "sameSection": 1,
    "recency": 0.85
  }
  ```

## Quality Guardrails

1. **Exclusions**: Current post, drafts, and canonicalized-out posts are excluded
2. **Series deduplication**: At most one post per series (detected by `-part-\d+` pattern)
3. **Threshold filtering**: Only results above `minScoreThreshold` are included
4. **Backfill**: If fewer than `minResultsCount` exceed threshold, fill with recency-based posts from same section (labeled `fallback:recency`)
5. **Zero-state**: Section hides if fewer than 2 results

## Deterministic Ordering

Results are sorted by:
1. Score (descending)
2. UpdateDate (descending, fallback to publishDate)
3. Slug (ascending, tie-breaker)

This ensures stable, reproducible results across builds.

## Debugging

In development mode, the component logs top candidates to console:

```
[related] Top 10 candidates for: SORA Ecosystem Explained
[related] Current post tags: sora, iroha, xor, val, pswap
────────────────────────────────────────────────────────────────────────────────
[related] 8.450 | sora-v3-guide-fujiwara-testnet-xor-fees | tagMatch:2.00 foundationalBonus:1.00 glossaryOverlap:2.00 titleKeyword:1.00 sameSection:1.00 recency:0.85
[related] 7.200 | polkaswap-architecture-guide | tagMatch:1.00 glossaryOverlap:3.00 titleKeyword:0.00 sameSection:1.00 recency:0.90
...
```

## Testing

Run unit tests:
```bash
pnpm test:unit
```

Test specific related articles logic:
```bash
pnpm test tests/unit/related
```

## Performance

- **Build-time only**: All computation happens at build time, no runtime fetches
- **O(N) complexity**: Single pass through candidate set
- **Short-circuit**: Stops after collecting top 10 candidates
- **Caching**: Glossary data cached after first load

Expected build time impact: <5% regression.






