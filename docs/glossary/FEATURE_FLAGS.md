# Glossary Feature Flags

| Flag | Default | Purpose |
| --- | --- | --- |
| `FEATURE_GLOSSARY_V2025` | `false` | Master switch for the V2025 glossary dataset, UI, and search experience. Disable to revert to the legacy glossary rendering. |
| `FEATURE_GLOSSARY_UI_CANONICAL` | `false` | Shows canonical badges, alias banners, popover hints, and search microcopy sourced from the canonical loader. |
| `FEATURE_GLOSSARY_ALIAS_REDIRECT` | `false` | Enables the client + middleware redirects that rewrite alias URLs to their canonical slug after paint (308 for SSR + `history.replaceState` on the client). |
| `FEATURE_GLOSSARY_V3_UI` | `false` | Renders the V3 React-based glossary term page with sections, anchors, keyboard navigation, and mobile drawer support for canonical terms. |
| `FEATURE_GLOSSARY_RELATED_ARTICLES` | `false` | Surfaces related-article cards on glossary terms using the generated `article-glossary-map.json`. |
| `FEATURE_EXPLORER_GLOSSARY_CONTEXT` | `false` | Adds related-term chips and recent-article context blocks to Explorer term + category views using the glossary relations map. |
| `GLOSSARY_CARD_SHOW_UPDATED` | `false` | Adds “Updated on YYYY-MM-DD” timestamps to glossary cards (intended for preview environments). |
| `TAG_HUB_V1` | `false` | Controls access to the `/explore` experience and tag detail routes. Listed here for completeness because Explorer shares glossary relations and canonical term lookups. |

## Operating the flags

- **Local development**: set flags inline when starting dev builds, e.g. `FEATURE_GLOSSARY_V2025=true FEATURE_GLOSSARY_V3_UI=true pnpm --filter @soranauts/web dev`.
- **Preview**: configure the environment variables in the Vercel Preview environment to validate a flag combination before rolling to production.
- **Production**: use the release checklist in `docs/release/glossary-v2025-phase14.md` and mirror the exact matrix when flipping flags in Vercel.

## Rollback guidance

1. Flip `FEATURE_GLOSSARY_V2025=false` to revert to the legacy glossary experience.
2. If Explorer needs to stay live but without alias context, keep `TAG_HUB_V1=true` and disable `FEATURE_EXPLORER_GLOSSARY_CONTEXT`.
3. To disable alias redirects without touching UI hints, disable `FEATURE_GLOSSARY_ALIAS_REDIRECT` while leaving `FEATURE_GLOSSARY_UI_CANONICAL=true`.

