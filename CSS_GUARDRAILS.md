# Soranauts CSS Guardrails

Authoritative rules for how CSS, Tailwind, and components are structured.
Humans and AI (Cursor/ChatGPT/etc.) must follow this on all edits.

The goals:
- Consistent Soranauts branding
- Predictable dark/light mode
- No regressions to default Tailwind blue
- Scoped, maintainable custom CSS

---

## 1. Architecture

1. Tailwind is the primary styling system.
2. CSS variables in `CustomStyles.astro` (see `DESIGN-TOKENS.md`) are the
   single source of truth for colors.
3. Custom CSS is allowed only when:
   - It uses those variables; and
   - It is scoped to a clear class or uses `@layer base/components` cleanly.

**Load order (must be preserved):**

1. `@tailwind base`
2. `@tailwind components`
3. `@tailwind utilities`
4. Design tokens / shared styles (`CustomStyles.astro`, tokens files)
5. Feature / component CSS (glossary, TOC, FAQ, etc.)
6. No later file may redefine global link colors outside the agreed rules.

---

## 2. Color Rules

1. All colors MUST come from:
   - CSS variables defined in `DESIGN-TOKENS.md`, or
   - Tailwind semantic colors mapped to those variables.

2. Do **NOT**:
   - Introduce `text-blue-*` or raw blue hex values for links.
   - Use random new hex values for UI without updating tokens.

3. If a design needs a new shade:
   - Add it to `DESIGN-TOKENS.md`,
   - Map it in `tailwind.config.*`,
   - Then use that semantic name.

---

## 3. Link Styling Rules

Global behavior is centralized. Do not override it casually.

1. Base anchors (`a`) are styled once via `@layer base` using
   `--color-link` and `--color-link-hover`.

2. `.prose a` follows the same tokens, defined via `@layer components`.

3. Do NOT:
   - Reintroduce browser default blue.
   - Add additional `a { ... }` blocks in other CSS files.
   - Use `!important` on link colors unless documented.

4. Components that need special link behavior (e.g. nav, footer)
   must use explicit Tailwind classes (`text-text-muted`, `text-link`, etc.),
   not new global rules.

---

## 4. Glossary-Specific Guardrails

Glossary has special styling but must never leak.

1. All glossary styles MUST be scoped with one of:

   - `.glossary-index`
   - `.glossary-article`
   - `.glossary-popover`
   - `.glossary-term` (when used, assumed inside a glossary context or `.prose`)

2. In articles:
   - `.prose a.glossary-term`:
     - Muted gray text
     - Dotted underline
     - On hover: brand link color + tooltip
   - This is the ONLY place where glossary links are de-emphasized gray.

3. On glossary index pages:
   - Category colors are allowed ONLY under `.glossary-index ...`.
   - No rule in glossary CSS may target bare `a` globally.

4. Do not rely on JS to “fix” glossary styles. If a page lacks styles, import
   the correct CSS or layout instead.

---

## 5. Component Scoping

All custom components must be styled via scoped classes and tokens.

Examples (class names illustrative):

- `header`: `.site-header`, `.nav-link`
- `footer`: `.site-footer`
- TOC: `.toc`, `.toc-title`, `.toc a`
- FAQ: `.faq-item`, `.faq-question`, `.faq-answer`
- Disclaimer: `.disclaimer`, `.disclaimer-title`
- Search: `.search-input`, `.search-result`
- Donate: `.donate-card`, etc.

Rules:

1. Use `@layer components` for these.
2. No deeply nested selectors like `.prose h2 strong span a`.
3. Keep selectors shallow and semantic:
   - ✅ `.toc a.active`
   - ❌ `.blog-page .content .wrapper .toc ul li a span`

---

## 6. Tailwind Usage

1. Prefer Tailwind utilities for:
   - Layout (flex, grid, gap, padding, margin)
   - Typography scale
   - Radius, shadows
   - Responsive and state variants

2. Use custom CSS when:
   - A pattern is repeated across many components, OR
   - It involves things awkward in utilities (complex underline, popover arrow, etc.)

3. Tailwind config:
   - Must read from CSS variables, not hardcode conflicting palettes.
   - No global reset of `a` colors via Tailwind that contradicts tokens.

---

## 7. No Hacks (Seriously)

Avoid:

- `!important` on shared elements (links, body, headings).
- JS that mutates styles for layout/color (only for behavior: open/close, etc.).
- Styles that depend on specific DOM depth.

If something “only works with JS injection” or deep selectors, fix the layout
or import order instead.

---

## 8. Safe AI / Cursor Instructions

When using AI to edit this repo, always include:

- “Follow `DESIGN-TOKENS.md` and `CSS_GUARDRAILS.md`.”
- “Do not reintroduce default blue link styles.”
- “Use existing tokens and Tailwind semantic colors.”
- “Scope new styles under a clear component class; no global `a {}` or `body {}` overrides.”

Any change that breaks these rules should be reverted.


