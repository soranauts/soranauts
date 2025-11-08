# Component Layer Reference

This guide summarizes the component APIs defined under `apps/web/src/assets/styles/components/`. Each class set is token-driven and designed to replace equivalent Tailwind blobs.

## Buttons (`button.css`)
- **`.btn`** — Base button primitive using `--space-*` for padding, `--radius-full`, border color `--color-border`, and neutral text `--color-text`. Includes hover/focus states and reduced-motion handling.
- **Modifiers:**
  - **`.btn--primary`** — Brand foreground action using `--color-brand-500`/`--color-brand-400` and tokenized shadows.
  - **`.btn--ghost`** — Transparent button that relies on link tokens for text/hover color.
  - **`.btn--soft`** — Subtle filled variant mixing surface tokens for background/border.
  - **`.btn--small`** — Compact padding and reduced font size using spacing tokens.
  - **`.btn--block`** — Full-width modifier (`width: 100%`).
- **Modern CSS:** logical padding properties, focus-visible ring via token-based box-shadow, reduced-motion fallback.

## Cards (`card.css`)
- **`.card`** — Flexible vertical container with `--space-*` gaps, `--radius-xl`, `--shadow-elevated`, and border color derived from `--color-border`. Hover state lifts using tokenized color-mix shadows.
- **`.card__header`, `.card__media`, `.card__actions`** — Structured sub-elements that manage spacing and rounding; the media element inherits `--radius-lg` for nested visuals.
- **`.card-grid`** — Defines display grid + container query responsive columns.
  - **`.card-grid--balanced`** aligns child cards to stretch uniformly.
- **Modern CSS:** `container-type: inline-size` and `@container` breakpoints referencing `--bp-md`/`--bp-xl` for responsive column count; logical margins/gaps; reduced-motion fallback.

## Tags (`tag.css`)
- **`.tag`** — Inline badge with `--radius-full`, neutral background created with `color-mix` of surface tokens, uppercase microcopy styling using `--color-muted`.
- **`.tag--category`** — Interactive badge that uses link tokens for active states; supports `[data-active="true"]` toggling.
- **`.tag--pill`** — Alternate body text badge with adjusted spacing and letter-case.
- **Modern CSS:** logical padding, focus-visible token ring, reduced-motion toggle.

## Forms (`form.css`)
- **`.field`** — Grid wrapper with spacing tokens; organizes label/control/help/error blocks.
- **`.field-label`** — Uses `--color-text` + `--color-muted` for optional hints.
- **`.field-control`** — Positions icons or adornments alongside inputs.
- **`.field-input` / `.field textarea` / `.field select`** — Apply tokenized padding, borders (`--color-border`), background mix, and hover/focus transitions. Placeholder text references `--color-soft`.
- **`.field-help`** — Neutral supporting copy.
- **`.field-error`** — Highlights validation issues via `--color-error` and participates in `:has()` selectors.
- **`.field--inline`** — Responsive label-control layout switching to two-column grid at `--bp-md`.
- **Modern CSS:** `:has(.field-error)` to escalate error styles, logical spacing, container breakpoints, prefers-reduced-motion guard.

## Layout (`layout.css`)
- **`.layout-shell`** — Page wrapper using `min-height: 100dvh`, flex column layout, inherits `--color-bg`/`--color-text`, and sets `container-type` for descendant container queries.
- **`.section`** — Constrained content well using logical padding/margins, grid layout, and container responsiveness based on `--bp-*` tokens.
- **`.section--narrow`** — Reduced max-width for focused content.
- **`.section__header`** — Centralized header stack that flips to left-aligned at medium containers.
- **`.section__content` / `.section__content--columns`** — Grid body with optional multi-column layout triggered by container queries (2 columns at `--bp-md`, 3 columns at `--bp-xl`).
- **`.layout-shell__footer`** — Adds consistent spacing above footer content.
- **Modern CSS:** container queries, logical spacing, and reduced-motion adjustments.

## Token Dependencies
Across all components, colors, spacing, radii, shadows, and typography originate from the token layer. This ensures light/dark mode support, consistent elevations, and future theming with minimal code churn.
