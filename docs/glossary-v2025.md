## Glossary v2025 Rollout Notes

- **Phase 7–9:** Canonical dataset (52 canonical / 5 alias / 0 deprecated), alias-aware loader, canonical UI hints, analytics, and sitemaps behind `FEATURE_GLOSSARY_V2025`, `FEATURE_GLOSSARY_UI_CANONICAL`, `FEATURE_GLOSSARY_ALIAS_REDIRECT`.
- **Phase 10 (V3 UI):** A premium glossary layout with anchors, keyboard shortcuts, and optional sources. Ship it behind `FEATURE_GLOSSARY_V3_UI` (default `false`). When the flag is `true`, canonical term pages render:
  - Definition (summary lead + definition body)
  - Optional “Why it matters” (tagline/subtitle)
  - Related canonical entries
  - Optional sources block (from `term.links`)
  - Left anchor navigation with `/`, `j`, `k`, and `Enter` keyboard support, plus mobile drawer toggle.
- **Phase 11 (Auto-link QA & Article Pass):**
  - Hardened markdown auto-linking so only canonical slugs are linked, aliases resolve to canonical URLs, and links are skipped in headings, code, URLs, and `data-no-glossary` regions.
  - New front matter controls per post: `glossaryNoLink` (array), `glossaryMaxLinksPerPost` (number), `glossaryMaxLinksPerTerm` (number, default `2`).
  - Dry-run script `pnpm --filter @soranauts/web glossary:autolink:check` summarizes proposed changes; report stored at `/tmp/phase11-autolink-report.txt`.
  - Relations script `pnpm --filter @soranauts/web glossary:relations:build` emits `public/data/article-glossary-map.json`, powering the optional `FEATURE_GLOSSARY_RELATED_ARTICLES` section on glossary terms.
- **Phase 12 (Explorer v2 glossary context):**
  - `FEATURE_EXPLORER_GLOSSARY_CONTEXT` (default `false`) surfaces Explorer glossary panels using `apps/web/public/data/article-glossary-map.json`.
  - Tag (Explorer “term”) pages render `ExplorerGlossaryContext` with co-located terms + related articles, plus a shortcut to `/glossary/{slug}#definition`.
  - Explorer domain sections render the same component (terms-only) showing top glossary chips derived from the relations map.
  - Rebuild / refresh relations data with `pnpm --filter @soranauts/web glossary:relations:build` whenever posts or glossary links change.

