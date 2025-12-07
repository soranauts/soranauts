# Cursor Session Prompts for Starlight Migration

> Copy-paste these prompts when starting work sessions with Claude in Cursor.
> Customize the [BRACKETED] sections as needed.

---

## Session Start Prompt (Use Every Time)

```
I'm continuing work on the Soranauts Starlight migration.

Please read these files first:
1. docs/starlight-migration/PROGRESS.md - Current status
2. docs/starlight-migration/ISSUES.md - Known problems
3. .cursor/rules/starlight-migration.md - Project rules

Current focus: [WEEK X - PHASE NAME]

Today I want to: [SPECIFIC TASK]

Reference the MIGRATION_PLAN.md for specifications.
```

---

## Week 1: Foundation Prompts

### Day 1-2: Installation
```
I'm starting Week 1 of the Starlight migration.

Task: Install and configure Starlight

Steps needed:
1. Install @astrojs/starlight package
2. Update astro.config.mjs with Starlight integration
3. Configure sidebar structure per MIGRATION_PLAN.md
4. Disable Starlight's built-in Pagefind (pagefind: false)
5. Create a test page at docs/index.mdx
6. Verify the build succeeds and /docs route works

Important: Don't touch /glossary/* routes - they must continue working.

Start with step 1 and proceed through each step, verifying as you go.
```

### Day 3-4: Design Tokens
```
Continuing Week 1 - Design Token Integration

Task: Create starlight-custom.css that maps Soranauts design tokens to Starlight

Requirements:
1. Map SORA red (#E3242D) to accent color
2. Set up category badge colors (token, technology, governance, defi, network, economics)
3. Configure typography (Inter for body, JetBrains Mono for code)
4. Ensure dark mode works correctly

Reference:
- Existing Tailwind config for current color values
- MIGRATION_PLAN.md for the CSS variable mappings

Create the file at: apps/web/src/styles/starlight-custom.css
```

### Day 5: Custom Components
```
Continuing Week 1 - Custom Starlight Components

Task: Create custom Header and Search components for Starlight

1. Create apps/web/src/components/starlight/Header.astro
   - Extend default Starlight header
   - Add prominent link to /glossary
   - Add link to /blog

2. Create apps/web/src/components/starlight/Search.astro
   - Replace Starlight's search with our unified modal trigger
   - Button that will open UnifiedSearchModal (implement modal in Week 4)
   - Show ⌘K keyboard shortcut

3. Update astro.config.mjs to use these custom components

Reference MIGRATION_PLAN.md for the component code structure.
```

---

## Week 2: Level 1 Content Prompts

### Fundamentals
```
Starting Week 2 - Creating Level 1 Documentation

Task: Create the Fundamentals section (4 pages)

Reference material to read:
- knowledge_base/curated/wiki/ (SORA Wiki source)
- Current KB files for context

Create these files:
1. apps/web/src/content/docs/fundamentals/index.mdx
   - SORA Overview
   - 1500-2000 words
   - Cover: What is SORA, economic philosophy, key innovations

2. apps/web/src/content/docs/fundamentals/tokenomics.mdx
   - Token Bonding Curve and XOR economics
   - 2000-2500 words
   - Cover: TBC mechanism, XOR supply, price stability

3. apps/web/src/content/docs/fundamentals/governance.mdx
   - SORA Parliament and voting
   - 1500-2000 words
   - Cover: How governance works, proposals, voting

4. apps/web/src/content/docs/fundamentals/sora-nexus.mdx
   - SORA Nexus features
   - 1000-1500 words
   - Cover: What's new in Nexus

Requirements:
- Use Level 1 frontmatter (source: wiki, Official badge)
- Start each with :::tip Official Documentation callout
- Cross-link glossary terms like [XOR](/glossary/xor)
- Concise, educational tone

Start with fundamentals/index.mdx and show me for review before proceeding.
```

### Products
```
Continuing Week 2 - Products Section

Task: Create the Products section (5 pages)

Create these files:
1. apps/web/src/content/docs/products/polkaswap.mdx (2000-2500 words)
2. apps/web/src/content/docs/products/fearless-wallet.mdx (1500-2000 words)
3. apps/web/src/content/docs/products/sora-card.mdx (1000-1500 words)
4. apps/web/src/content/docs/products/tonswap/index.mdx (1500-2000 words)
5. apps/web/src/content/docs/products/tonswap/features.mdx (1000-1500 words)

Reference:
- knowledge_base/curated/wiki/ for official info
- knowledge_base/curated/polkaswap-fearless.md for product details
- knowledge_base/curated/tonswap-soramitsu.md for TONSWAP

Same requirements as Fundamentals (Level 1 frontmatter, callouts, cross-links).
```

---

## Week 3: Level 2 + Archive Prompts

### Technical Documentation
```
Starting Week 3 - Technical Documentation

Task: Create Level 2 technical docs

Reference material:
- knowledge_base/curated/iroha_docs/ (primary source)
- knowledge_base/curated/interoperability.md

Create these files with Level 2 frontmatter (source: iroha_docs, Technical badge):

Iroha section:
1. technical/iroha/index.mdx - Iroha overview (2000-2500 words)
2. technical/iroha/consensus.mdx - Sumeragi BFT (1500-2000 words)
3. technical/iroha/smart-contracts.mdx - Smart contracts (1500-2000 words)

Bridges section:
4. technical/bridges/ethereum.mdx - HASHI bridge (1000-1500 words)
5. technical/bridges/polkadot.mdx - XCM integration (1000-1500 words)
6. technical/bridges/ton.mdx - TON bridge (1000-1500 words)

Integration section:
7. technical/integration/getting-started.mdx - Dev quickstart (1500-2000 words)

Use :::note Technical Documentation callout.
Include code examples where relevant.
```

### Archive
```
Continuing Week 3 - Archive Section

Task: Create curated archive pages

This is NOT a dump of all Medium posts. Select only landmark content:
- Major product launches
- Significant protocol changes
- Annual summaries

Create:
1. archive/index.mdx - Timeline overview with links to highlights
2. archive/2025/sora-nexus-launch.mdx - Nexus announcement
3. archive/2024/sora-card-launch.mdx - SORA Card launch
4. archive/2024/year-review.mdx - 2024 summary
5. archive/2023/polkaswap-v2.mdx - Polkaswap 2.0
6. archive/2022/kusama-parachain.mdx - Kusama slot
7. archive/2021/sora-v2-launch.mdx - SORA v2

Use Level 3 frontmatter (source: update, Archive badge, published date).
Start each with :::caution Historical Content callout.
Keep each 500-1000 words - these are summaries, not full articles.
```

---

## Week 4: Search & Automation Prompts

### Unified Search
```
Starting Week 4 - Unified Search Implementation

Task: Create the unified search modal

1. First, update Pagefind configuration to index entire site:
   - /docs/* (new Starlight content)
   - /blog/* (existing)
   - /glossary/* (existing)

2. Create apps/web/src/components/search/UnifiedSearchModal.tsx
   - Triggered by Cmd+K
   - Three sections: Glossary, Documentation, Blog
   - Glossary uses existing GlossarySearchV2/search.ts engine
   - Docs/Blog use Pagefind
   - Keyboard navigation between results

3. Update the Starlight Search.astro component to trigger this modal

4. Remove/retire old Pagefind implementation if separate

Reference MIGRATION_PLAN.md for the component structure and search logic.
```

### CI/CD
```
Continuing Week 4 - CI/CD Setup

Task: Create validation pipeline

1. Create scripts/docs-validate.ts
   - Check all docs have required frontmatter
   - Check archive docs have caution callouts
   - Check official docs have success badges

2. Create .github/workflows/docs-validation.yml
   - Run on PRs that touch docs/
   - Run validation script
   - Run link checker
   - Run build

3. Add scripts to package.json:
   - "docs:validate": "tsx scripts/docs-validate.ts"
   - "docs:check-links": "..." (use linkinator or similar)

Reference MIGRATION_PLAN.md for the validation script code.
```

---

## Week 5-6: Testing & Launch Prompts

### Testing
```
Starting Week 5 - Testing Phase

Run through this checklist and fix any issues:

1. Automated tests:
   - pnpm docs:validate
   - pnpm docs:check-links  
   - pnpm build
   - pnpm test:e2e

2. Manual testing (I'll do this, but prepare the checklist):
   - Generate a testing checklist based on MIGRATION_PLAN.md
   - Include navigation, search, content, performance, accessibility

3. Fix any issues found and log in ISSUES.md

What issues are found when running the automated tests?
```

### Pre-Launch
```
Week 6 - Pre-Launch Preparation

1. Create a PR with all migration changes
2. Generate a summary of what's included
3. Create a deployment checklist
4. Document rollback procedure

Show me:
- List of all new files created
- List of all modified files
- Any breaking changes to watch for
- Smoke test URLs to check after deploy
```

---

## Issue Resolution Prompt

```
I've encountered an issue during the Starlight migration.

**Issue:** [BRIEF DESCRIPTION]

**Phase:** Week [X]

**What I was trying to do:**
[STEPS]

**What happened:**
[ERROR OR UNEXPECTED BEHAVIOR]

**Error message (if any):**
```
[PASTE ERROR]
```

**What I've already tried:**
1. [ATTEMPT 1]
2. [ATTEMPT 2]

Please help diagnose and fix this issue.
```

---

## Resume After Break Prompt

```
I'm resuming work on the Starlight migration after a break.

Please:
1. Read docs/starlight-migration/PROGRESS.md
2. Read docs/starlight-migration/ISSUES.md
3. Tell me:
   - What's completed
   - What's in progress
   - What's blocked
   - Recommended next task

Then let's continue from where we left off.
```
