# Taxonomy Rebuild — Verification Run (2025-11-23)

- canonical count: **52** (matches matrix; scripts idempotent except for known whitespace diff in dry-run output)
- quick-path violations: **0**
- posts with taxonomy issues flagged: **44** (needs editorial follow-up when rewriting articles)
- link hygiene violations: **249** markdown externals, **106** absolute internal URLs (no inline HTML target/rel gaps)
- verification run confirmed scripts only touched config/code—no MDX body edits and no `updateDate` changes

To re-run the automated checks safely:

```
pnpm --filter @soranauts/web update:canonical-tags:dry
pnpm --filter @soranauts/web taxonomy:consistency
pnpm --filter @soranauts/web taxonomy:update-articles       # dry-run by default
pnpm --filter @soranauts/web links:report
pnpm --filter @soranauts/web typecheck && pnpm --filter @soranauts/web build
```


