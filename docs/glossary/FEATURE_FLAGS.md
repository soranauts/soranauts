# Glossary Feature Flags

> **Updated Phase 8:** Production defaults are now `true` for stable features.

## Production Flags (default: true)

| Flag | Default | Purpose |
| --- | --- | --- |
| `FEATURE_GLOSSARY_V2025` | `true` | Master switch for the V2025 glossary dataset, UI, and search experience. |
| `FEATURE_GLOSSARY_V3_UI` | `true` | Renders the V3 React-based glossary term page with sections, anchors, keyboard navigation, and mobile drawer support. |
| `FEATURE_GLOSSARY_QUICKVIEW` | `true` | Enables the right-panel Quick-View overlay for term previews. |
| `FEATURE_EXPLORER_V3` | `true` | Unified Explorer with Nexus section and live stats. |
| `FEATURE_EXPLORER_GLOSSARY_CONTEXT` | `true` | Adds related-term chips and recent-article context blocks to Explorer views. |
| `TAG_HUB_V1` | `true` | Controls access to the `/explore` experience and tag detail routes. |

## Optional Flags (default: false)

| Flag | Default | Purpose |
| --- | --- | --- |
| `FEATURE_GLOSSARY_UI_CANONICAL` | `false` | Shows canonical badges, alias banners, popover hints. |
| `FEATURE_GLOSSARY_ALIAS_REDIRECT` | `false` | Enables client + middleware redirects for alias URLs. |
| `FEATURE_GLOSSARY_RELATED_ARTICLES` | `false` | Surfaces related-article cards on glossary terms. |
| `GLOSSARY_CARD_SHOW_UPDATED` | `false` | Adds "Updated on YYYY-MM-DD" timestamps (preview only). |

## Removed Flags

| Flag | Status | Notes |
| --- | --- | --- |
| `SKIP_GLOSSARY_GENERATOR` | **Removed** | Unified generator is now the default. |

## Operating the flags

- **Local development**: set flags inline when starting dev builds, e.g. `FEATURE_GLOSSARY_V3_UI=false pnpm --filter @soranauts/web dev`.
- **Preview**: configure the environment variables in the Vercel Preview environment.
- **Production**: use `pnpm release:prod` for one-command deployment.

## Rollback guidance

1. Set `FEATURE_GLOSSARY_V3_UI=false` in Vercel to revert to legacy term pages.
2. Set `FEATURE_GLOSSARY_QUICKVIEW=false` to disable Quick-View panel.
3. Set `FEATURE_EXPLORER_V3=false` to disable unified Explorer.
4. For full rollback, run `pnpm rollback:prod` (reverts last commit and redeploys).

See `docs/RELEASE_NOTES.md` for detailed rollback procedures.

