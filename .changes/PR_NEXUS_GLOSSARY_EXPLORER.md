Nexus Glossary + Explorer: 179 new entries, alias unification, Explorer groups
==============================================================================

## Summary
- 179 Nexus-specific MDX entries landed under `apps/web/src/content/glossary`.
- Explorer group data + Nexus Architecture collection keep the UI in sync.
- Alias coverage unified IVM/WSV/TEU/SFQ/Space Directory families.
- Related chips + summaries normalized (Title Case, ASCII, canonical names).

## Changes
- Added 179 canonical glossary entries (one file per title; no hyphenated slugs).
- Added `apps/web/src/components/explore/explorer.config.ts` with functional groups + Nexus Architecture collection.
- Updated `apps/web/public/glossary.aliases.v2025.json` with 9 new redirects.
- Updated `apps/web/public/data/glossary.v2025.json` (`aliasCount: 47`, refreshed timestamp).
- Added verification tooling + npm scripts for Nexus glossary smoke tests.

## Schema & Glossary QA Rules Satisfied
- Required frontmatter keys (title/slug/category/tags/summary/related) present across all entries.
- Categories limited to approved functional set; every entry tagged `Nexus Architecture`.
- Slugs enforce `[a-z0-9]+` with acronyms preserved; explorer references canonical titles only.
- Aliases stored as lowercase slugs; canonical count + alias count metadata aligned with loader guardrails.

## Validation
- `pnpm -w typecheck`
- `pnpm --filter @soranauts/web build`
- Phase-7 glossary validator: 179/179 OK, zero unresolved related terms.
- Manual UI spot-checks: `/glossary/*` hero + `/explore` group rendering verified.

## Manual Testing Checklist
- [x] `pnpm --filter @soranauts/web dev` loads without glossary regression warnings.
- [x] `/explore` shows Nexus Architecture collection plus functional groups.
- [x] Alias redirects (`/glossary/ivm`, `/glossary/wsv`, `/glossary/teu`, `/glossary/sfq`, `/glossary/space-directory`) land on canonical destinations.
- [x] Random glossary entries display correct Title Case `<h1>` + related chips.
- [x] Nexus verification script succeeds against local preview.

## Deploy Plan
1. Merge `feature/nexus-glossary-explorer-v1` → `main`.
2. Trigger Vercel preview build automatically.
3. Run `pnpm --filter @soranauts/web run verify:nexus:preview` (sets `$PREVIEW_URL`) to smoke-test aliases, random entries, and `/explore`.
4. If green, promote preview → production.
5. Post-deploy: `pnpm --filter @soranauts/web run verify:nexus`.

## Rollback Plan
1. Revert the merge commit via GitHub UI (content-only change; no migrations).
2. Redeploy production (Vercel redeploy) to purge cache.
3. Re-run `verify:nexus` to ensure aliases + explorer revert cleanly.

## Follow-up Tasks
- Enrich selected Nexus entries with deep-dive body copy (beyond summaries).
- Expand article auto-link coverage to reference new glossary canon (respect existing automation).
- Address outstanding Astro/Pagefind warnings (unchanged, non-blocking).

