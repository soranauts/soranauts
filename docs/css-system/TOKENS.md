> Token Set: **v1**  
> Last updated: **2025-11-07**  
> Source of truth: `apps/web/src/assets/styles/tokens.css` and `tailwind.config.cjs` (kept in sync)

# Design Tokens

## Canonical Token File
- `apps/web/src/assets/styles/tokens.css` defines the authoritative token set inside `@layer theme`.
- The `:root` block provides light-mode values; `:root.dark` overrides the same variables for dark mode.
- Component, utility, and override layers must consume these variables rather than redefining colors or spacing.

### Color Families
- **Brand:** `--color-brand-400`, `--color-brand-500`, `--color-brand-600`, `--color-brand-soft`
- **Base Theme:** `--color-bg`, `--color-surface`, `--color-surface-soft`, `--color-border`, `--color-border-strong`
- **Text:** `--color-text`, `--color-muted`, `--color-soft` (with legacy aliases for backward compatibility)
- **Links:** `--color-link`, `--color-link-hover`, `--color-link-muted`
- **Status:** `--color-success`, `--color-warning`, `--color-error`, `--color-info`

### Structural Tokens
- **Spacing:** `--space-*` mirrors Tailwind’s scale (`0` through `96`, fractional steps, and `px`).
- **Radii:** `--radius-none` → `--radius-3xl`, plus `--radius-full`.
- **Shadows:** `--shadow-*` and `--shadow-elevated` cover elevation options.
- **Breakpoints:** `--bp-sm`, `--bp-md`, `--bp-lg`, `--bp-xl`, `--bp-2xl` align with layout/container queries.
- **Motion:** `--motion-duration-fast/normal/slow`, `--motion-ease-standard`, `--motion-ease-emphasized` standardize transitions.

## System Consumption
- `apps/web/src/assets/styles/system.css` imports tokens first, then `base.css`, `components/*.css`, and `utilities.css`, keeping layer order intact.
- These downstream files rely on token variables for color, spacing, motion, and responsive behavior.
- `CustomStyles.astro` may reference tokens but should not redefine them; all token maintenance happens in `tokens.css` (mirrored in `tailwind.config.cjs`).

## Tailwind Integration
- `tailwind.config.cjs` maps Tailwind theme entries to the CSS variables (e.g., `brand.500` → `var(--color-brand-500)`).
- This allows utilities like `bg-brand-500` or `text-text-muted` to resolve to the same token values used by components and utilities, keeping Tailwind and the layered system in sync.

## Glossary & Component Usage
- Glossary link styles and category pills consume tokens (`var(--color-link)`, `var(--color-text-muted)`, `var(--color-bg-surface)`, `var(--color-border-subtle)`) to remain accessible in both themes.
- Component styles (`button.css`, `card.css`, `tag.css`, `form.css`, `layout.css`) and shared utilities apply tokens exclusively, ensuring consistent color, spacing, and motion values across the site.
- New overrides or feature CSS must continue to use the token palette instead of hard-coded hex values.
