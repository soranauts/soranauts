# Blog Post Template: Nexus Glossary V2025 Launch

> **Status:** Draft template — fill in placeholders and add screenshots before publishing.

---

## Title Options

Choose one:

1. **"Introducing the SORA Nexus Glossary V2025: Learning Mode for DeFi"**
2. **"How We Rebuilt the SORA Glossary from the Ground Up"**
3. **"From 847KB to 320KB: The Engineering Behind Nexus Glossary V2025"**

---

## Meta Information

- **Author:** [Author Name]
- **Publish Date:** December 2025
- **Category:** Product Update
- **Tags:** Glossary, SORA, DeFi, Learning, Web Development
- **Featured Image:** [Insert glossary-hero.png]
- **Excerpt:** The Nexus Glossary V2025 introduces instant Quick-View previews, curated learning journeys, and a 62% reduction in load times—transforming how users discover SORA ecosystem concepts.

---

## Article Outline

### 1. Why We Rebuilt the Glossary

**Word count target:** 200-300 words

The SORA ecosystem has grown significantly since our initial glossary launch. With 179 terms spanning tokenomics, governance, DeFi mechanics, and infrastructure, users needed a better way to navigate this complexity.

Our previous glossary worked, but it had limitations:

- **Full page loads** for every term lookup interrupted the learning flow
- **No learning paths** meant users had to discover connections on their own
- **Large payloads** slowed down initial page loads
- **Limited authoring tools** made contributing difficult

We set out to solve these problems with a complete rebuild.

**Key questions we asked:**
- How can users preview terms without losing their place?
- How can we guide learners through related concepts?
- How can we make the experience fast on any connection?
- How can we make contributing as easy as possible?

The result is the Nexus Glossary V2025.

[Insert screenshot: glossary-hero.png]

---

### 2. Deep Dive: Quick-View Panel

**Word count target:** 300-400 words

The Quick-View panel is the centerpiece of this release. It transforms glossary exploration from a series of page navigations into a fluid, contextual experience.

#### How It Works

When you hover over or click any glossary chip (those pill-shaped term links), a panel slides in from the right edge of the screen. Inside, you'll find:

1. **Category badge** — Immediately see what domain this term belongs to
2. **Title and summary** — The core definition at a glance
3. **"Why it matters" callout** — A highlighted tagline explaining the term's significance
4. **Related terms** — Up to 4 related concepts with their own taglines
5. **"Go deeper" link** — Navigate to the full term page when you're ready

[Insert screenshot: quick-view.png]

#### Technical Implementation

The Quick-View panel is designed for performance:

```
User hovers over chip
       ↓
Prefetch term JSON (background)
       ↓
User clicks chip
       ↓
Check in-memory cache
       ↓
Display immediately (or fetch if not cached)
       ↓
Prefetch related terms
```

We use an LRU (Least Recently Used) cache that holds the 50 most recently viewed terms. Combined with hover-based prefetching, this means most Quick-View opens feel instant.

#### Accessibility

The panel is fully accessible:

- **Focus trap** keeps keyboard navigation within the panel
- **Escape key** closes the panel
- **Screen readers** announce when the panel opens and closes
- **Reduced motion** users see a fade instead of a slide animation

#### Deep Linking

Every Quick-View state is shareable. Add `?term=<slug>` to any glossary URL:

```
https://soranauts.com/glossary?term=tokenbondingcurve
https://soranauts.com/glossary/xor?term=polkaswap
```

This makes it easy to share specific term previews in documentation, chat, or social media.

---

### 3. Explorer V3: Learning Journeys

**Word count target:** 300-400 words

The Explorer has been completely rebuilt around the concept of **learning journeys**—curated paths that guide users through related concepts in a logical order.

#### Nexus Architecture

The new Nexus Architecture section organizes all 179 glossary terms into logical domains:

| Domain | Focus |
|--------|-------|
| Ecosystem | Adoption, community, partnerships |
| DeFi | Liquidity, trading, pools |
| Economics | Tokenomics, monetary policy |
| Governance | Voting, proposals, DAOs |
| Technology | Protocols, infrastructure |

[Insert screenshot: explorer-hero.png]

Within each domain, terms are grouped into **subgroups** for easier navigation:

```
Economics
├── Core Tokens (XOR, VAL, PSWAP)
├── Monetary Policy (TBC, Elastic Supply)
├── Fee Mechanisms (XOR Fee Equilibrium)
└── Staking & Rewards (Nomination, Validators)
```

[Insert screenshot: subgroups.png]

#### Quick Journeys

For users who want structured learning, we've created curated paths:

- **DeFi Basics** — Understand SORA's DeFi stack in 8 terms
- **Governance 101** — Learn how SORA is governed in 6 terms
- **Token Economics** — Master SORA tokenomics in 10 terms
- **Developer Onboarding** — Build on SORA in 12 terms

Each journey shows your progress and highlights the next recommended term.

#### Glossary Context

Every Explorer page now includes related glossary terms as clickable chips. Click any chip to open the Quick-View panel without leaving the Explorer.

---

### 4. Under the Hood: Generator & JSON Split

**Word count target:** 300-400 words

The technical foundation of this release is a complete rebuild of our data pipeline.

#### The Problem

Our previous approach generated a single large JSON file containing all glossary data:

```
glossary.json — 847 KB
├── 179 terms with full content
├── All metadata
└── All relationships
```

This meant every page load fetched nearly 1MB of data, even if the user only wanted to look up one term.

#### The Solution

The new unified generator produces a split output:

```
apps/web/public/data/
├── glossary.v2025.json          # 320 KB — minimal index
├── glossary.aliases.v2025.json  # Alias mappings
├── glossary.stats.v2025.json    # Build statistics
└── terms/
    ├── xor.json                 # ~2 KB each
    ├── polkaswap.json
    └── ...179 more terms
```

The minimal index contains only what's needed for search and listing:
- Slug
- Title
- Category
- Summary
- Tagline

Full term data (body content, related terms, aliases, metadata) loads on demand when a user opens the Quick-View or navigates to a term page.

#### Deterministic Builds

A key requirement was **determinism**: the same input must always produce identical output. This enables:

- **Reliable caching** — CDN and browser caches work correctly
- **Easy diffing** — Changes in output reflect real content changes
- **Reproducible CI** — Builds are identical across environments

We achieved this by:
- Sorting all arrays consistently
- Removing timestamps from output
- Using stable hashing for cache keys

#### The Generator

The unified generator (`scripts/build-nexus-glossary-json.ts`) handles:

1. **Parsing** — Extract front-matter and content from MDX files
2. **Validation** — Check against JSON Schema
3. **Normalization** — Standardize categories, sort tags, resolve aliases
4. **Transformation** — Build relationship graph
5. **Output** — Generate all JSON files atomically

```bash
pnpm glossary:build
```

---

### 5. Performance & Determinism

**Word count target:** 200-300 words

Performance was a primary goal for this release. Here's what we achieved:

#### Payload Reduction

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Initial JSON | 847 KB | 320 KB | **–62%** |
| Per-Term Load | N/A | ~2 KB avg | Lazy loaded |

#### Load Time Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Time to Interactive | 2.4s | 1.1s | **–54%** |
| Largest Contentful Paint | 1.8s | 0.9s | **–50%** |

#### How We Did It

1. **Minimal index** — Only essential fields in the main JSON
2. **Lazy loading** — Full term data fetches on demand
3. **Prefetching** — Related terms load in background on hover
4. **Caching** — In-memory LRU cache prevents redundant fetches
5. **Deterministic output** — Enables effective CDN caching

#### Build Reliability

Deterministic builds mean:
- Same input → Same output (byte-for-byte)
- No flaky CI from timestamp variance
- Meaningful diffs in version control
- Reliable cache invalidation

---

### 6. How to Contribute

**Word count target:** 200-300 words

We've made contributing to the glossary easier than ever.

#### Quick Start

1. **Create a new term file:**
   ```bash
   touch apps/web/src/content/glossary/YourTerm.mdx
   ```

2. **Use the VS Code snippet:**
   Type `glossary` and press Tab to scaffold the file.

3. **Preview your term:**
   ```bash
   pnpm author:preview yourterm
   ```

4. **Validate before committing:**
   ```bash
   pnpm content:fix && pnpm content:validate
   ```

#### Authoring Tools

| Tool | Command | Purpose |
|------|---------|---------|
| Content Linter | `pnpm content:lint` | Check for quality issues |
| Schema Validator | `pnpm content:validate` | Validate front-matter |
| Auto-Fixer | `pnpm content:fix` | Fix casing, sort tags |
| Preview | `pnpm author:preview <slug>` | Open with Quick-View |

#### Front-Matter Schema

Every term needs:
- `title` — Title Case
- `slug` — lowercase alphanumeric
- `category` — from allowed list
- `summary` — 20-300 characters
- `tagline` — (recommended) why it matters

See the [Authoring Guide](https://github.com/soranauts/soranauts/blob/main/docs/AUTHORING_GUIDE.md) for full details.

---

## Call to Action

**Explore the new glossary:**
- [Glossary](https://soranauts.com/glossary)
- [Explorer](https://soranauts.com/explore)

**Contribute:**
- [Authoring Guide](https://github.com/soranauts/soranauts/blob/main/docs/AUTHORING_GUIDE.md)
- [GitHub Repository](https://github.com/soranauts/soranauts)

**Join the community:**
- [Twitter/X](https://twitter.com/soranetwork)
- [Telegram](https://t.me/soranetwork)

---

## Image Placeholders

Replace these before publishing:

1. `[glossary-hero.png]` — Glossary homepage with search and cards
2. `[quick-view.png]` — Quick-View panel showing a term
3. `[explorer-hero.png]` — Explorer homepage with Nexus section
4. `[subgroups.png]` — Subgroup organization within a domain
5. `[glossary-term.png]` — Full term page (optional)

---

## SEO Checklist

- [ ] Title contains primary keyword (SORA Glossary)
- [ ] Meta description under 160 characters
- [ ] Alt text on all images
- [ ] Internal links to glossary and explorer
- [ ] External links to SORA ecosystem sites
- [ ] Heading hierarchy (H1 → H2 → H3)
- [ ] Featured image optimized for social sharing

---

*Template version: 1.0 — December 2025*


