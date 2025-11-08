# Overrides Layer

The `overrides` layer is reserved for **rare, explicit exceptions** that cannot be solved cleanly in the normal layers.

## When to use

Use `@layer overrides` only when:

- A third-party library or legacy markup cannot be changed, and
- A scoped fix is required to align it with our design system, and
- The change would otherwise force an unsafe or leaky rule in `components` or `utilities`.

## Rules

- Prefer fixing the source (markup, component, or tokens) before adding an override.
- All overrides must:
  - Be tightly scoped (target specific selectors or routes).
  - Use existing design tokens (no ad-hoc hex/spacing).
  - Include a short comment with context and a link/ID to the related issue.
- Periodically review and delete stale overrides.

If you are unsure whether something belongs in `overrides`, it probably doesn’t.
