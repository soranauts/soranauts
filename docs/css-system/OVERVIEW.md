# Soranauts CSS System Overview

## Cascade Architecture
- The global cascade is declared in `apps/web/src/assets/styles/system.css` using `@layer reset, base, theme, components, utilities, overrides;`.
- Stylesheets are imported in layer order so that lower layers (e.g., `base`) provide defaults while higher layers (e.g., `components`) can safely override them.
- Tailwind’s generated styles (base → components → utilities) still load via `tailwind.css`. Our custom layers are appended afterwards so token-driven rules can override or coexist with Tailwind utilities without removing them.

## Entry Point (`system.css`)
- `system.css` is the single import that wires the layered system:
  - `tokens.css` → `@layer theme`
  - `base.css` → `@layer base`
  - Component styles (`components/*.css`) → `@layer components`
  - `utilities.css` → `@layer utilities`
- The `overrides` layer is reserved for future use when component-specific adjustments are required after utilities.

## Tokens (`tokens.css`)
- Defines all design tokens under `@layer theme` and `:root` / `:root.dark`.
- Provides the canonical values for:
  - Brand palette (`--color-brand-*`)
  - Backgrounds, surfaces, borders, text, links, and status colors
  - Spacing scale (`--space-*`), radii (`--radius-*`), shadows (`--shadow-*`), breakpoints (`--bp-*`)
  - Font stacks (`--font-sans`, `--font-mono`, etc.)
- Components, utilities, and future overrides must consume these tokens instead of hard-coded values.

## Base (`base.css`)
- Contains reset rules (`box-sizing`, zeroed margins) and element defaults under `@layer base`.
- Establishes site-wide body typography/background and shared behaviors for anchors, images, and reduced-motion preferences.
- No layout- or component-specific styling lives here.

## Utilities (`utilities.css`)
- Implements a minimal, token-backed helper set (`flex`, `grid`, gap/spacing, sizing, text alignment, `surface`).
- Utilities use only semantic tokens and are intended to replace the most common Tailwind utility combinations gradually.

## Components (`components/*.css`)
- Each file defines stable class APIs that map to the visual primitives already used throughout the site:
  - `button.css` → `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--soft`, `.btn--small`, `.btn--block`
  - `card.css` → `.card`, `.card-grid`, `.card__header`, `.card__media`, `.card__actions`
  - `tag.css` → `.tag`, `.tag--category`, `.tag--pill`
  - `form.css` → `.field`, `.field-label`, `.field-input`, `.field-help`, `.field-error`, `.field--inline`
  - `layout.css` → `.layout-shell`, `.section`, `.section--narrow`, `.section__header`, `.section__content`, `.section__content--columns`
- Modern CSS features are leveraged where beneficial:
  - `container-type` / `@container` for responsive card and section layouts
  - `:has()` for field error states
  - Logical spacing properties and `dvh` for layout shells
  - Reduced-motion media queries mirrored across components
- These classes are ready to replace existing Tailwind blobs on a component-by-component basis without affecting runtime today.

## Coexisting With Tailwind
- Tailwind remains active via `tailwind.config.cjs` and `tailwind.css`; many templates still rely on utility classes.
- Design tokens mirror values provided to Tailwind (colors, fonts) so both systems stay in sync.
- As we migrate templates to the new classes and utilities, the layered system will supersede Tailwind utility strings safely because it loads after Tailwind’s layers and uses the same token values.
- No runtime changes were made; documentation reflects the current branch state.
