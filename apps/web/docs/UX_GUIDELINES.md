# SORA Explorer UX Guidelines

## Clickable cards pattern

- Navigational cards in `/explore` and SORA Explorer-adjacent grids are implemented as full-surface `<a>` elements with `role="group"` to provide a single focus target.
- Headings (`<h3>`) remain inside the link for semantic clarity. Hover and focus states reuse existing design tokens (e.g. `var(--overlay-focus)`).
- When introducing interactive children (toggles, buttons, etc.) inside a card, ensure they stop event propagation so the card link does not hijack their behaviour.
- Keyboard interaction should allow Tab + Enter/Space to activate the card naturally. Verify with both keyboard and pointer during QA.
- If a design requires primary inline controls, prefer a non-clickable container and follow standard button/link patterns instead of this navigational card style.


