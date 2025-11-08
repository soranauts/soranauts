# Layered CSS Compiler Debug Notes

## Summary
- Migrated runtime to **Node 20.3.0**, removing the Astro WASM compiler crash.
- Verified the layered CSS pipeline (`tailwind.css` → `system.css` → tokens/base/components/utilities`) compiles cleanly.
- Confirmed the remaining runtime failure is isolated to `@vercel/analytics/astro`, not the CSS system.

## Resolution Steps
### 1. Baseline Environment
- Switched Node via `fnm` → **20.3.0** (Astro-supported).
- Ensured `apps/web/src/assets/styles/tailwind.css` contains only:
  ```
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  @import "./system.css";
  ```
- Removed all direct `system.css` imports from layout files.
- Cleared `.astro` cache and reinstalled dependencies with `pnpm install`.

### 2. Minimal Repro Test
Reduced `Layout.astro` to:
```astro
---
import '~/assets/styles/tailwind.css';
---
<html><body><slot /></body></html>
```
Running `pnpm --filter @soranauts/web dev` succeeded, proving the compiler is stable under Node 20.3.0.

### 3. Stepwise Reintegration
- Reintroduced `glossary*.css` files and component imports (`CommonMeta`, `SchemaMarkup`, `SearchModal`, etc.) incrementally.
- Confirmed the entire layered cascade renders without PostCSS or `@layer` conflicts.

### 4. Runtime Integration Check
- `CustomStyles.astro` and `@vercel/speed-insights/astro` run without issues.
- `@vercel/analytics/astro` → `<VercelAnalytics />` resolves to `undefined`, causing a runtime crash (not compile-time).
- Current mitigation: keep the Vercel Analytics import/usage commented out until the integration is updated.

## Outcome
- Layered CSS system verified healthy; Tailwind entry is now the single gateway for reset/base/components/utilities.
- Existing documentation (`OVERVIEW.md`, `TOKENS.md`) remains accurate—no token changes required.
- Next step: revisit Vercel Analytics after confirming compatibility guidance for future Astro versions.

