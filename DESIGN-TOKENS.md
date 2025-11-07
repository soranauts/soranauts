# Soranauts Design Tokens

Single source of truth for colors, typography semantics, and link behavior
used across the Soranauts site (blog, glossary, donate, tools, etc).

All theme values must be driven from these tokens.

---

## 1. Brand Palette

**Primary Brand**

- `brand-500` — `#E3242D` (SORA red, primary)
- `brand-400` — `#F13D46` (hover, subtle accents)
- `brand-600` — `#BF1F26` (active, outlines, stronger emphasis)
- `brand-soft` — `rgba(227, 36, 45, 0.12)` (soft backgrounds, highlights)

**Status**

- `success` — `#22C55E`
- `warning` — `#FBBF24`
- `error` — `#F97316`
- `info` — `#38BDF8`

No other random brand colors should be introduced without updating this file.

---

## 2. Theme: Light & Dark

We use `darkMode: 'class'` (Tailwind). The `dark` class on `<html>` or `<body>`
switches tokens.

### 2.1 Base CSS Variables

Add the following to `CustomStyles.astro` (or the global style entry) and treat
it as the canonical token set:

```css
:root {
  /* Brand */
  --color-brand-500: #E3242D;
  --color-brand-400: #F13D46;
  --color-brand-600: #BF1F26;
  --color-brand-soft: rgba(227, 36, 45, 0.12);

  /* Light mode (default) */
  --color-bg-page: #F4F5F7;
  --color-bg-surface: #FFFFFF;
  --color-bg-soft: #E5E7EB;
  --color-border-subtle: #D1D5DB;
  --color-text-main: #111827;
  --color-text-muted: #4B5563;
  --color-text-soft: #6B7280;

  /* Link colors (light) */
  --color-link: var(--color-brand-500);
  --color-link-hover: var(--color-brand-400);
  --color-link-muted: #9CA3AF;

  /* Status */
  --color-success: #22C55E;
  --color-warning: #FBBF24;
  --color-error: #F97316;
  --color-info: #38BDF8;
}

/* Dark mode override */
:root.dark {
  --color-bg-page: #050609;
  --color-bg-surface: #0C0F14;
  --color-bg-soft: #141821;
  --color-border-subtle: #232733;
  --color-text-main: #E5E7EB;
  --color-text-muted: #9CA3AF;
  --color-text-soft: #6B7280;

  --color-link: var(--color-brand-400);
  --color-link-hover: #FF5C6A;
  --color-link-muted: #6B7280;
}

/* Global body usage */
body {
  background-color: var(--color-bg-page);
  color: var(--color-text-main);
}
```

All components and pages must rely on these variables (directly or via Tailwind).

3. Tailwind Mapping

In tailwind.config.*, extend Tailwind to read from the tokens:

// Tailwind excerpt
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          soft: 'var(--color-brand-soft)',
        },
        page: 'var(--color-bg-page)',
        surface: 'var(--color-bg-surface)',
        soft: 'var(--color-bg-soft)',
        border: {
          subtle: 'var(--color-border-subtle)',
        },
        text: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
          soft: 'var(--color-text-soft)',
        },
        link: {
          DEFAULT: 'var(--color-link)',
          hover: 'var(--color-link-hover)',
          muted: 'var(--color-link-muted)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

Use these semantic utilities in components:

Backgrounds: bg-page, bg-surface, bg-soft

Text: text-text-main, text-text-muted, text-text-soft

Borders: border-border-subtle

Links: text-link, hover:text-link-hover

Brand CTAs: bg-brand-500, hover:bg-brand-400, etc.

4. Global Link Behavior

All unscoped links share a consistent look.

Add in global CSS after Tailwind (e.g. @layer base):

@layer base {
  a {
    color: var(--color-link);
    text-decoration: underline;
    text-decoration-color: var(--color-link);
    text-underline-offset: 0.18em;
    text-decoration-thickness: 1px;
    transition: color 150ms ease, text-decoration-color 150ms ease;
  }

  a:hover {
    color: var(--color-link-hover);
    text-decoration-color: var(--color-link-hover);
  }
}

Typography plugin (.prose) uses the same tokens:

@layer components {
  .prose a {
    color: var(--color-link);
    text-decoration: underline;
    text-underline-offset: 0.18em;
  }
  .prose a:hover {
    color: var(--color-link-hover);
  }
}

No Tailwind default blues should be used for standard links.

5. Glossary Tokens & Behavior

In-Article (Glossary Terms Embedded in Content)

Appearance: subtle, neutral, not distracting.

Behavior: dotted underline, muted color; on hover → brand red + tooltip.

@layer components {
  .prose a.glossary-term {
    color: var(--color-text-muted);
    text-decoration: underline dotted;
    text-decoration-color: rgba(148, 163, 253, 0.3);
    text-underline-offset: 0.16em;
    cursor: help;
    transition: color 150ms ease, text-decoration-color 150ms ease;
  }

  .prose a.glossary-term:hover {
    color: var(--color-link);
    text-decoration-color: var(--color-link);
  }

  .glossary-popover {
    background-color: var(--color-bg-surface);
    color: var(--color-text-main);
    border: 1px solid var(--color-border-subtle);
    box-shadow: 0 10px 40px rgba(0,0,0,0.45);
  }
}

Glossary Index / Cards

Scoped under .glossary-index root.

Allows category accent colors, but only within that scope.

Example:

@layer components {
  .glossary-index .glossary-term {
    color: var(--color-text-main);
    text-decoration: underline dotted;
  }

  .glossary-index .glossary-term[data-cat="token"] {
    color: #F97316;
  }

  .glossary-index .glossary-term[data-cat="technology"] {
    color: #38BDF8;
  }

  /* Add more categories as needed */
}

No glossary rules should affect global links outside .glossary-index / .glossary-article / .glossary-popover.

6. Component-Level Design Notes

These use the same tokens; see CSS_GUARDRAILS.md for implementation rules.

Header: bg-surface/95, border-b border-border-subtle, links text-text-muted hover:text-link, active text-brand-500 border-b-2 border-brand-500.

Footer: bg-soft, text-text-soft, links text-link.

Blog Article Shell: bg-surface, rounded-3xl, border-border-subtle.

Tag Pills: bg-brand-soft, text-brand-400, border-brand-500/40.

TOC: bg-soft, border-subtle, links text-text-soft hover:text-link, active text-link font-semibold.

FAQ: closed → bg-soft border-subtle; open → border-brand-500 bg-brand-soft/10.

Search Input: bg-soft border-subtle text-text-main, focus ring brand-500.

Financial Disclaimer: dark panel, border-left in --color-warning, body text in warning color; styled via tokens only.

Donate / Special Pages: may use stronger brand accents but must still consume the same tokens.

All new UI should map back to these semantic tokens.

---


