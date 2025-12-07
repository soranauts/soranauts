# Soranauts Starlight Migration - Cursor Rules

> These rules guide Claude when working on the Starlight migration.
> Place this file at: `.cursor/rules/starlight-migration.md`

## Project Context

You are helping implement a Starlight documentation system for Soranauts, an educational site about the SORA blockchain ecosystem.

**Key Files:**
- `docs/starlight-migration/MIGRATION_PLAN.md` - The definitive implementation plan
- `docs/starlight-migration/PROGRESS.md` - Track completed tasks
- `docs/starlight-migration/ISSUES.md` - Log problems encountered

**Always read PROGRESS.md first** to understand current state before making changes.

---

## Architecture Rules

### What NOT to Touch
- `/glossary/*` routes and pages - Working perfectly, 368 terms
- `src/data/taxonomy.ts` - 5000 lines, do not modify
- `src/components/glossary/*` - Existing glossary components
- `GlossarySearchV2.tsx` - Keep this, integrate into unified search
- `search.ts` glossary engine - Keep this

### What We're Building
- `/docs/*` routes - New Starlight documentation
- Unified search modal - Combines Pagefind + GlossarySearchV2
- Custom Starlight components - Header, Search trigger

---

## Content Rules

### Frontmatter Schema

**Level 1 (Official) - from Wiki:**
```yaml
---
title: "Page Title"
description: "Brief description"
source: wiki
lastVerified: 2025-12-06
sidebar:
  badge:
    text: Official
    variant: success
---
```

**Level 2 (Technical) - from Iroha docs:**
```yaml
---
title: "Page Title"
description: "Brief description"
source: iroha_docs
lastVerified: 2025-12-06
sidebar:
  badge:
    text: Technical
    variant: note
---
```

**Level 3 (Archive) - historical content:**
```yaml
---
title: "Page Title"
description: "Brief description"
source: update
published: 2025-03-07
sidebar:
  badge:
    text: Archive
    variant: caution
---
```

### Required Callouts

**Official docs must start with:**
```mdx
:::tip Official Documentation
This content reflects the current SORA Wiki as of [DATE].
[View source](https://wiki.sora.org/[page])
:::
```

**Archive docs must start with:**
```mdx
:::caution Historical Content
This is an archived update from [DATE].
For current information, see [Fundamentals](/docs/fundamentals/).
:::
```

### Cross-Linking

**Link to glossary terms:**
```mdx
The [XOR](/glossary/xor) token is used for [staking](/glossary/staking).
```

**Link to other docs:**
```mdx
See [Tokenomics](/docs/fundamentals/tokenomics) for details.
```

---

## Content Standards

### Glossary Cross-Links

When linking to glossary terms from documentation:

- Always use `/glossary/term` format (no anchors)
- ✅ Correct: `[XOR](/glossary/xor)`
- ❌ Wrong: `[XOR](/glossary/xor#definition)`

Anchors on glossary pages may not work as expected due to header scroll behavior. Use clean links without hash fragments.

### Link Examples

```mdx
{/* ✅ Correct glossary links */}
The [XOR](/glossary/xor) token powers the network.
Learn about the [Token Bonding Curve](/glossary/tokenbondingcurve).
Use [Polkaswap](/glossary/polkaswap) for trading.

{/* ❌ Wrong - no anchors */}
The [XOR](/glossary/xor#definition) token powers the network.
Learn about the [Token Bonding Curve](/glossary/tokenbondingcurve#how-it-works).
```

### Slug Format

Glossary slugs use lowercase, no hyphens for compound terms:
- `/glossary/xor` (not `/glossary/x-o-r`)
- `/glossary/tokenbondingcurve` (not `/glossary/token-bonding-curve`)
- `/glossary/soraparliament` (not `/glossary/sora-parliament`)
- `/glossary/fearlesswallet` (not `/glossary/fearless-wallet`)

Check existing glossary files for correct slugs before linking.

---

## Code Style

### File Naming
- Docs: `kebab-case.mdx` (e.g., `sora-nexus.mdx`)
- Components: `PascalCase.tsx` or `PascalCase.astro`
- Scripts: `kebab-case.ts`

### Component Patterns

**Astro components:**
```astro
---
// Imports and logic here
import Something from './Something.astro';

const { prop } = Astro.props;
---

<div class="component">
  <!-- Template here -->
</div>

<style>
  /* Scoped styles */
</style>
```

**React islands:**
```tsx
// Use client:load for search components
// Use client:idle for non-critical interactivity
```

---

## Workflow Rules

### Before Starting Work
1. Read `PROGRESS.md` to see current state
2. Check `ISSUES.md` for known problems
3. Identify which phase/task you're working on

### After Completing Work
1. Update checkboxes in `PROGRESS.md`
2. Log any issues in `ISSUES.md`
3. Note any decisions/changes in the Change Log

### When Encountering Problems
1. Document in `ISSUES.md` with full details
2. Note error messages exactly
3. List attempted solutions
4. If blocked, note it and move to next task if possible

---

## Reference Material

### KB Sources (Read-Only Reference)
```
knowledge_base/curated/
├── wiki/                 # SORA Wiki content
├── iroha_docs/          # Hyperledger Iroha docs
├── ecosystem_updates/   # Medium posts (158K words)
├── soramitsu_site/      # Company website
└── ...
```

**Use these as reference when writing docs, but don't convert directly.**
Write new, concise content synthesized from these sources.

### Existing Site Structure
```
apps/web/src/
├── content/
│   ├── glossary/        # 368 MDX files - DON'T TOUCH
│   ├── post/            # Blog posts
│   ├── kb/              # Current KB (will coexist)
│   └── docs/            # NEW: Starlight docs
├── components/
│   ├── glossary/        # DON'T TOUCH
│   ├── starlight/       # NEW: Custom Starlight components
│   └── search/          # UPDATE: Unified search modal
├── data/
│   └── taxonomy.ts      # DON'T TOUCH
└── styles/
    └── starlight-custom.css  # NEW
```

---

## Testing Commands

```bash
# Validate docs frontmatter
pnpm docs:validate

# Check for broken links
pnpm docs:check-links

# Full build (includes Pagefind indexing)
pnpm build

# Development server
pnpm dev

# Run E2E tests
pnpm test:e2e
```

---

## Common Mistakes to Avoid

1. **Don't put docs under /glossary/** - Glossary stays separate
2. **Don't modify taxonomy.ts** - It's working, leave it alone
3. **Don't convert KB files directly** - Write new, concise content
4. **Don't forget callouts** - Every doc needs the appropriate callout
5. **Don't use wrong badge variant** - Official=success, Technical=note, Archive=caution
6. **Don't skip frontmatter validation** - Run `pnpm docs:validate` frequently

---

## Workflow

### End-of-Week Checkpoints

Before starting a new week, verify previous week's deliverables:

**Week 1 Checklist:**
- [ ] Starlight installed and building
- [ ] /docs route working
- [ ] starlight-custom.css exists with design tokens
- [ ] Custom Header.astro with glossary/blog links
- [ ] No route conflicts with /glossary/*

**Week 2 Checklist:**
- [ ] All 9 Level 1 pages created
- [ ] All have Official badge + :::tip callout
- [ ] All glossary links use /glossary/term (no anchors)
- [ ] PROGRESS.md updated

**Week 3 Checklist:**
- [ ] Level 2 Technical pages created
- [ ] Archive content migrated
- [ ] All badges correct (Technical=note, Archive=caution)

**Week 4 Checklist:**
- [ ] Unified search working
- [ ] Pagefind indexing docs
- [ ] GlossarySearchV2 integrated

**Week 5 Checklist:**
- [ ] E2E tests passing
- [ ] No broken links
- [ ] Performance acceptable

Run checklist before proceeding to next phase.

---

## Getting Help

If stuck on something:
1. Check ISSUES.md for similar problems
2. Check Starlight docs: https://starlight.astro.build
3. Document the issue fully and bring it back to the planning chat with Opus 4.5
