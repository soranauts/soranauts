# SORA Explorer Data Guidelines

## Canonical tag labels

- The SORA Explorer uses `CANONICAL_LABELS` in `apps/web/src/lib/tag-hub.ts` as the single source of truth for ticker and acronym casing.
- Update the map whenever a new ecosystem token/brand needs enforced casing. Keep keys lowercase and values in their desired display form.
- UI code should call `formatTagLabel(slug, fallbackTitle)` instead of manually uppercasing or lowercasing tag names.
- Do **not** mutate slugs, routes, or taxonomy identifiers when adjusting labels. The helper is display-only.
- Avoid naive `toUpperCase()`/`toLowerCase()` transformations in SORA Explorer components, filters, or search labels—always defer to `formatTagLabel`.


