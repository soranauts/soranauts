# Glossary Authoring Guide

A quick guide for writing and maintaining SORA Glossary terms.

## New Term in 60 Seconds

1. **Create the file:**
   ```bash
   touch apps/web/src/content/glossary/YourTerm.mdx
   ```

2. **Use the VS Code snippet:**
   - Type `glossary` and press Tab
   - Fill in the placeholders

3. **Preview locally:**
   ```bash
   pnpm author:preview yourterm
   ```

4. **Validate before committing:**
   ```bash
   pnpm content:fix && pnpm content:validate
   ```

## Front-matter Cheatsheet

```yaml
---
title: "Token Bonding Curve"           # Required: Title Case
slug: tokenbondingcurve                 # Required: lowercase, no spaces
category: "Economics"                   # Required: see valid categories
summary: "One or two sentences..."      # Required: max 300 chars
tagline: "Why it matters..."            # Recommended: max 150 chars
tags:                                   # Optional: sorted a-z
  - "DeFi"
  - "Tokenomics"
related:                                # Optional: canonical slugs only
  - xor
  - polkaswap
---
```

### Valid Categories

| Category | Description |
|----------|-------------|
| Technology | Core tech, protocols, algorithms |
| Governance | Voting, parliament, proposals |
| Economics | Tokenomics, monetary policy |
| Tokens | XOR, VAL, PSWAP, etc. |
| DeFi | Liquidity, swaps, pools |
| Infrastructure | Nodes, bridges, networks |
| Community | DAOs, contributors, events |
| Security | Cryptography, audits, safety |
| Interoperability | Cross-chain, bridges |
| Development | SDKs, APIs, tooling |

### Field Rules

| Field | Format | Example |
|-------|--------|---------|
| title | Title Case (acronyms UPPER) | "Token Bonding Curve", "XOR" |
| slug | lowercase alphanumeric only | `tokenbondingcurve`, `xor` |
| category | Title Case, from list | "Economics" |
| summary | ≤ 2 sentences, ≤ 300 chars | Brief explanation |
| tagline | ≤ 150 chars | "Why it matters" statement |
| tags | Sorted A-Z, unique | `["DeFi", "Tokenomics"]` |
| related | Canonical slugs only | `[xor, polkaswap]` |

## Common Errors & Quick Fixes

### ❌ "Slug must be lowercase alphanumeric"
```yaml
# Wrong
slug: token-bonding-curve

# Right
slug: tokenbondingcurve
```

### ❌ "Title should be Title Case"
```yaml
# Wrong
title: "token bonding curve"

# Right
title: "Token Bonding Curve"
```

Run `pnpm content:fix` to auto-correct casing issues.

### ❌ "Related term does not exist"
Check that the related slug exists in another MDX file:
```bash
grep -l "^slug: xor" apps/web/src/content/glossary/*.mdx
```

### ❌ "Tags should be sorted alphabetically"
```yaml
# Wrong
tags:
  - "Tokenomics"
  - "DeFi"

# Right
tags:
  - "DeFi"
  - "Tokenomics"
```

Run `pnpm content:fix` to auto-sort tags.

## Preview & Quick-View

### Preview a Term
```bash
pnpm author:preview <slug>
```

This opens `http://localhost:4321/glossary/<slug>?term=<slug>` with the Quick-View panel.

### Deep-link to Quick-View
Add `?term=<slug>` to any glossary page URL:
```
/glossary/xor?term=tokenbondingcurve
```

## Regenerate OG Image

After updating a term's title or category:
```bash
pnpm og:glossary --changed
```

Or regenerate all:
```bash
pnpm og:glossary
```

## VS Code Setup

### Recommended Extensions
- MDX (unifiedjs.vscode-mdx)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- YAML (redhat.vscode-yaml)

### Snippets
| Prefix | Description |
|--------|-------------|
| `glossary` | Full term template |
| `frontmatter` | Front-matter block only |
| `tagline` | Add tagline field |
| `related` | Add related terms array |
| `tags` | Add tags array |

## Workflow Checklist

Before submitting a PR:

- [ ] `pnpm content:fix` — auto-fix casing/sorting
- [ ] `pnpm content:lint` — check for passive voice, vague phrases
- [ ] `pnpm content:validate` — validate schema
- [ ] `pnpm glossary:build` — ensure build succeeds
- [ ] `pnpm author:preview <slug>` — visual check

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `pnpm content:lint` | Check content quality |
| `pnpm content:validate` | Validate front-matter schema |
| `pnpm content:fix` | Auto-fix common issues |
| `pnpm author:preview <slug>` | Open term preview |
| `pnpm glossary:build` | Regenerate glossary JSON |
| `pnpm og:glossary` | Generate OG images |

## Need Help?

- Check existing terms for examples
- Run `pnpm content:validate --verbose` for detailed errors
- Open an issue if you're stuck


