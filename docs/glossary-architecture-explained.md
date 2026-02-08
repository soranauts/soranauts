# Soranauts Glossary Architecture Explained

## Overview
You have **384 canonical glossary terms** in your system right now. The confusion you're experiencing comes from the fact that your glossary exists in **multiple places with different purposes**, and understanding how they connect is key to working with it effectively.

## The Three-Layer System

### Layer 1: MDX Files (Content Layer)
**Location:** `apps/web/src/content/glossary/*.mdx`
**Count:** 179 files
**Purpose:** Individual glossary pages with full content and SEO

These are **individual page files** for glossary terms - think of them like blog posts. Each one has:
- Frontmatter metadata (title, slug, category, tags, summary, related terms)
- Optional body content for detailed explanations
- Used to generate dedicated pages like `/glossary/accountid`

**Example structure:**
```markdown
---
title: "AccountId"
slug: accountid
category: "Accounts & Identity"
tags:
  - "Nexus Architecture"
summary: "A typed Norito pointer..."
related:
  - "Account Lifecycle"
  - "AssetDefinitionId"
---
```

### Layer 2: Taxonomy System (Unified Data)
**Location:** `apps/web/src/data/taxonomy.ts`
**Count:** 137 base terms + dynamic tags
**Purpose:** Single source of truth for term metadata

This is your **master data structure** that combines:
- Core glossary terms (137 defined)
- Dynamic tags from your content
- Relationships between terms
- Category classifications

The taxonomy is what powers:
- `sora-glossary.ts` (exports terms for the glossary pages)
- Tag system
- Cross-references and "see also" links

### Layer 3: JSON Files (Build Output)
**Location:** `apps/web/public/*.json` and `apps/web/public/data/*.json`
**Purpose:** Pre-compiled glossary data for fast runtime access

These are **generated files** created during your build process:

- `glossary.v2025.json` (333KB)
  - **384 canonical terms**
  - **39 aliases**
  - **0 deprecated terms**
  - Full structured data for the glossary

- `glossary.json` (314KB)
  - Legacy format (older system)
  - Being phased out but still used as fallback

- `glossary.aliases.v2025.json` (2.9KB)
  - Mapping of alternative names to canonical terms

- `glossary.index.json` (406KB)
  - Search index for quick lookups

## How They Connect

```
MDX Files (179)              Taxonomy (137 + tags)           JSON Files (384)
    │                              │                              │
    ├─> Provides detailed    ──>  Combined with        ──>   Compiled into
    │   page content              core data                   runtime files
    │                              │                              │
    └─> Used for /glossary/x  ──>  Merged with tags    ──>   Used by app
                                   from content                 at runtime
```

### The Build Process:
1. **Taxonomy (`taxonomy.ts`)** defines core terms with definitions, categories, relationships
2. **MDX files** provide additional content and page-specific metadata
3. **Build script** merges these sources and generates JSON files
4. **Runtime** (`glossary-loader.ts`) loads JSON and provides query functions

## Why You Have "Different Sets of Terms"

You mentioned files got separated - here's what likely happened:

1. **Original terms** were added to `taxonomy.ts` manually (137 terms)
2. **New terms** were added as MDX files only (179 files total)
3. **Build process** combined both sources into the JSON output (384 terms)

The **384 terms** in `glossary.v2025.json` is the **complete, current glossary**. This is the number that matters.

## Understanding the Data Flow

### When you add a new term, you should:

**Option A: Full Term (recommended for important terms)**
1. Add to `taxonomy.ts` with all metadata
2. Optionally create MDX file for detailed page
3. Run build to update JSON

**Option B: Quick Term (for simpler entries)**
1. Create MDX file in `content/glossary/`
2. Include frontmatter with definition
3. Build process picks it up automatically

### When you query a term at runtime:

```typescript
// This code in glossary-loader.ts handles everything:
getGlossaryTerm('xor')  // Returns merged data from:
  // 1. taxonomy.ts definition
  // 2. MDX frontmatter
  // 3. Legacy JSON fallback
```

## The Feature Flag System

Your code has a feature flag: `FEATURE_GLOSSARY_V2025`

```typescript
const mode = FEATURE_GLOSSARY_V2025 ? 'v2025' : 'legacy';
```

This lets you switch between:
- **v2025**: New system (384 terms in `glossary.v2025.json`)
- **legacy**: Old system (`glossary.json`)

You're currently using the **v2025 system** which is why your term count is 384.

## Common Confusion Points

### "Why do I have 137 in taxonomy but 384 in JSON?"
The taxonomy is the **core** set. The JSON includes:
- All 137 taxonomy terms
- Additional terms from MDX files
- Dynamically generated tag entries
- Merged metadata from multiple sources

### "Why do files feel separated?"
Because they serve different purposes:
- **Taxonomy** = Structured data
- **MDX** = Content + SEO pages
- **JSON** = Runtime performance

### "How do I know which is the source of truth?"
For the **current count**: `glossary.v2025.json` (384 terms)
For **editing**: Depends on what you're changing:
  - Core definition → `taxonomy.ts`
  - Page content → MDX file
  - Aliases → Either place, merged during build

## Your Tag Matrix / Taxonomy System

You mentioned wanting a "taxonomy system for navigation and education" - you actually have this! It's the relationship between:

1. **Categories** (token, technology, governance, defi, network, economics)
2. **Tags** (like "Nexus Architecture", "SORA Blockchain")
3. **Related Terms** (cross-references between glossary entries)
4. **See Also** (additional related concepts)

These create a **knowledge graph** where terms connect to each other.

## What You Should Do Next

### To understand your current system:
1. Look at `glossary.v2025.json` - this is your complete glossary (384 terms)
2. Pick a term and trace it through:
   - Does it exist in `taxonomy.ts`?
   - Does it have an MDX file?
   - How does `glossary-loader.ts` merge them?

### To add new terms consistently:
1. **Decide**: Is this a core term or supplementary?
2. **Core terms**: Add to `taxonomy.ts` first
3. **All terms**: Create MDX file for the page
4. **Run build**: Let the system merge and compile

### To fix "separated" terms:
1. Audit which terms are in `taxonomy.ts` vs. only MDX
2. For important terms, move their definitions into `taxonomy.ts`
3. Keep MDX for page-specific content
4. Let the build process handle the merge

## Key Files to Study

1. `apps/web/src/data/taxonomy.ts` - Master term definitions
2. `apps/web/src/lib/glossary/glossary-loader.ts` - How terms are loaded/merged
3. `apps/web/public/data/glossary.v2025.json` - Your complete glossary output
4. Any MDX file in `content/glossary/` - Individual term pages

## Architecture Principles

This system follows a common pattern called **"Source of Truth with Multiple Views"**:

- **Single Source**: Taxonomy + MDX content
- **Multiple Outputs**: JSON files for different purposes
- **Runtime Abstraction**: `glossary-loader.ts` hides complexity
- **Build-time Merging**: Combines sources during compilation

This is actually **good architecture** - it just needs documentation (which is what this is!).

## Mental Model for Software Development

### What you're experiencing is normal:
Systems grow organically, and understanding comes in layers. You started with "make it work" and now you're at "understand how it works" which is exactly the right progression.

### Key architectural concept here:
**Separation of Concerns**
- Content (MDX) is separate from data (taxonomy)
- Runtime code (loader) is separate from build code
- Frontend is separate from data layer

This is GOOD design - it just takes time to understand.

### What "high quality code generation" means here:
1. Knowing which file to edit for which purpose
2. Understanding the build -> runtime pipeline
3. Recognizing data flow patterns
4. Being able to trace a term through the system

You don't need to memorize TypeScript syntax. You need to understand:
- **Where data lives**
- **How it flows**
- **When it transforms**
- **What depends on what**

This is called **software architecture**, and you're learning it right now by working through this problem.

## Next Steps for Learning

1. **Trace one term end-to-end**
   - Pick "XOR"
   - Find it in taxonomy.ts
   - See if it has an MDX file
   - Look at it in glossary.v2025.json
   - Understand how glossary-loader.ts retrieves it

2. **Make a small change**
   - Add a new term to taxonomy.ts
   - Create its MDX file
   - Run the build
   - Verify it appears in the JSON

3. **Document as you go**
   - Keep notes on what you learn
   - Draw diagrams of data flow
   - Write down "gotchas" you discover

## The Empowerment You're Looking For

Understanding architecture is like understanding a city's layout. Once you know:
- Where the residential areas are (data)
- Where the commercial areas are (logic)
- How the roads connect them (data flow)

You can navigate confidently and make good decisions about where to build new things.

You're not looking to be a programmer who writes every function. You're looking to be an architect who understands the system well enough to:
- Know which AI model to ask for what
- Spot when something is being done in the wrong place
- Understand why builds fail
- Make informed decisions about structure

That's exactly what this document is helping you build toward.

---

## Summary

- **You have 384 terms** (not separated, just distributed across layers)
- **The architecture is sound** (taxonomy → loader → JSON → runtime)
- **Your confusion is normal** (complex systems take time to understand)
- **You're on the right path** (asking architectural questions is exactly right)

The "full picture" you want is understanding these three layers and how they flow together. You don't need to write the TypeScript - you need to understand where things go and why, so you can direct the AI effectively.
