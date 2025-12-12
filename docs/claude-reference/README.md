# Claude Article Editing Reference

> **Purpose:** This directory contains comprehensive reference files for AI assistants (Claude, Cursor, etc.) working on Soranauts content creation and editing.

**Generated:** 2025-12-12  
**Last Updated:** 2025-12-12  
**Maintained by:** Automated script (`scripts/generate-claude-reference.ts`)

---

## 📋 Quick Start

When starting an article editing session, load these files in order:

1. **`SITE_STRUCTURE.md`** - Understand the overall architecture
2. **`LINK_INVENTORY.md`** - Reference for all valid internal links
3. **`TAG_MATRIX.md`** - See what tags are commonly used
4. **`CONTENT_SUMMARY.md`** - Review existing content to avoid duplication
5. **`GLOSSARY_TERMS.md`** - Check glossary terms for definitions
6. **`VALIDATION_REPORT.md`** - Check for broken links and orphan content

---

## 📁 File Descriptions

### 1. LINK_INVENTORY.md
**Purpose:** Complete list of all valid internal links on the site.

**Use when:**
- Creating new internal links in articles
- Verifying link validity before publishing
- Finding the correct slug for a topic
- Checking if a glossary term exists

**Contains:**
- All 49 blog post slugs with titles
- All 179 glossary term slugs
- Static page routes
- Dynamic route patterns

**Example usage:**
```markdown
<!-- ✅ CORRECT - verified in LINK_INVENTORY.md -->
Check out our [XOR guide](/deep-dive-into-xor-val-and-pswap)

<!-- ❌ WRONG - slug doesn't exist -->
Read about [XOR](/xor-explained)
```

---

### 2. CONTENT_SUMMARY.md
**Purpose:** Metadata and linking patterns for all blog articles.

**Use when:**
- Checking what topics have already been covered
- Finding related articles to link to
- Understanding tag usage patterns
- Researching article depth (word counts)
- Identifying which articles link where

**Contains:**
- Title, publish date, update date
- Word count estimates
- All tags used
- Internal links made from each article
- External domains referenced

**Example usage:**
```
Query: "Has anyone written about Kensetsu?"
Answer: Check CONTENT_SUMMARY.md → Yes, 
"exploring-sora-kensetsu-polkaswap" (849 words, updated 2025-11-18)
```

---

### 3. TAG_MATRIX.md
**Purpose:** Complete inventory of all tags and their usage frequency.

**Use when:**
- Deciding what tags to add to new content
- Standardizing tag naming
- Finding high-value tags to prioritize
- Avoiding duplicate/similar tags

**Contains:**
- All unique tags sorted by usage count
- Where tags are used (blog, glossary, both)
- High-value tags (10+ uses)
- Tag guidelines and conventions

**Example usage:**
```
Query: "Should I tag this as 'governance' or 'sora-governance'?"
Answer: Check TAG_MATRIX.md → 'governance' has 23 uses,
'sora-governance' doesn't exist. Use 'governance'.
```

---

### 4. GLOSSARY_TERMS.md
**Purpose:** Complete list of all glossary terms with definitions.

**Use when:**
- Checking if a term is already defined
- Finding the correct glossary slug for linking
- Understanding term categories
- Identifying gaps in glossary coverage

**Contains:**
- All 179 glossary terms
- Term categories (token, technology, governance, etc.)
- Brief summaries
- Terms organized by category

**Example usage:**
```
Query: "Should I define 'Hyperledger Iroha' inline or link to glossary?"
Answer: Check GLOSSARY_TERMS.md → It exists at /glossary/hyperledger-iroha
→ Link to it instead of defining inline.
```

---

### 5. SITE_STRUCTURE.md
**Purpose:** Overall architecture and organization of the website.

**Use when:**
- Understanding how content is organized
- Learning the navigation structure
- Finding where to place new content
- Understanding the three-layer glossary system
- Reviewing linking conventions

**Contains:**
- Main navigation structure
- Content type descriptions
- Technology stack overview
- Architecture patterns (three-layer glossary)
- Design system references
- Linking conventions

**Example usage:**
```
Query: "Where does blog content live?"
Answer: SITE_STRUCTURE.md says:
"apps/web/src/content/post/" for MDX files,
URL pattern is "/[slug]"
```

---

### 6. VALIDATION_REPORT.md
**Purpose:** Automated validation report for link integrity and content discoverability.

**Use when:**
- Checking for broken internal links
- Identifying orphan content (articles with no incoming links)
- Quality assurance before publishing
- Planning content improvement initiatives

**Contains:**
- List of broken internal links
- List of orphan articles (no incoming links)
- Recommendations for fixing issues
- Summary statistics

**Example usage:**
```
Query: "Are there any broken links in the codebase?"
Answer: Check VALIDATION_REPORT.md → 2 broken links found
(both are asset links, not article links)
```

---

## 🔄 Updating Reference Files

These files are **generated automatically** and should not be manually edited.

### When to regenerate:
- After adding new blog posts
- After adding new glossary terms
- After major content updates
- Before starting a major editing session
- If files are more than 1 week old

### How to regenerate:
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts
npx tsx scripts/generate-claude-reference.ts
npx tsx scripts/validate-links.ts
```

This will:
1. Scan all blog posts in `apps/web/src/content/post/`
2. Scan all glossary terms in `apps/web/src/content/glossary/`
3. Extract metadata and linking patterns
4. Regenerate all 5 reference files
5. Validate internal links and find orphan content
6. Update generation timestamps

---

## 📊 Current Statistics

As of 2025-12-12:

- **Blog Posts:** 49 articles
- **Glossary Terms:** 179 terms
- **Unique Tags:** (see TAG_MATRIX.md)
- **Static Pages:** 10+ pages
- **Dynamic Routes:** 6 patterns

---

## 🎯 Best Practices for Article Editing

### 1. Always Verify Links
Before adding an internal link, check `LINK_INVENTORY.md` to ensure the slug exists.

```markdown
<!-- ✅ DO THIS -->
1. Check LINK_INVENTORY.md for correct slug
2. Add link: [text](/verified-slug)
3. Verify it works

<!-- ❌ DON'T DO THIS -->
1. Guess the slug: [text](/probably-this-slug)
2. Hope it works
```

### 2. Use Established Tags
Check `TAG_MATRIX.md` before creating new tags. Reuse existing tags when possible.

```yaml
# ✅ GOOD - Uses established high-value tags
tags:
  - sora
  - defi
  - polkaswap
  - tokenomics

# ❌ BAD - Creates new tags unnecessarily
tags:
  - sora-network
  - decentralized-finance
  - polkaswap-dex
  - token-economics
```

### 3. Link to Glossary Terms
If a technical term has a glossary entry, link to it instead of defining it inline.

```markdown
<!-- ✅ GOOD -->
SORA uses [Hyperledger Iroha](/glossary/hyperledger-iroha) for governance.

<!-- ❌ BAD -->
SORA uses Hyperledger Iroha (a permissioned blockchain framework) for governance.
```

### 4. Check for Duplicate Content
Before writing a new article, check `CONTENT_SUMMARY.md` to see what's already covered.

### 5. Follow Existing Patterns
Review similar articles in `CONTENT_SUMMARY.md` to match:
- Tag usage patterns
- Linking density (internal/external)
- Word count targets
- Category conventions

---

## 🔗 Related Documentation

These reference files complement the main project documentation:

### Master Documentation
- **`/MASTER_GUARDRAILS.md`** - AI assistant behavior rules
- **`/CSS_GUARDRAILS.md`** - Styling and design rules
- **`/DESIGN-TOKENS.md`** - Design system tokens

### Architecture
- **`/docs/glossary-architecture-explained.md`** - How the glossary system works
- **`/ARCHITECTURE.md`** - Overall project architecture

### Content Standards
- **`/docs/GLOSSARY_CONTENT_STANDARDS.md`** - Glossary writing guidelines
- **`/docs/AUTHORING_GUIDE.md`** - Article writing guidelines
- **`/ARTICLE_TEMPLATE.md`** - Template for new articles

---

## 🐛 Known Limitations

1. **Custom Slugs**: Only 2 articles use custom slugs. Most derive from filename.
2. **Tag Aliases**: The system doesn't track tag aliases/synonyms automatically.
3. **Broken Links**: Reference files don't validate if linked content actually exists.
4. **Update Dates**: Some older articles may have stale update dates.

---

## 🆘 Troubleshooting

### Problem: Link doesn't work but is in LINK_INVENTORY.md
**Solution:** Check if you're using the correct prefix:
- Blog: `/[slug]` (e.g., `/sora-ecosystem-explained`)
- Glossary: `/glossary/[slug]` (e.g., `/glossary/xor`)

### Problem: Tag appears in multiple variations
**Solution:** Pick the most commonly used variant from TAG_MATRIX.md

### Problem: Article metadata looks wrong
**Solution:** Regenerate reference files - the source file may have been updated

### Problem: Glossary term doesn't appear
**Solution:** Term may be in `taxonomy.ts` but not in MDX files, or vice versa

---

## 📮 Questions?

If you encounter issues or have suggestions for improving these reference files:

1. Check if regenerating helps: `npx tsx scripts/generate-claude-reference.ts`
2. Review the generation script: `scripts/generate-claude-reference.ts`
3. Consult the main docs: `MASTER_GUARDRAILS.md` and architecture docs

---

## 📝 Generation Metadata

- **Script:** `scripts/generate-claude-reference.ts`
- **Dependencies:** `gray-matter` for MDX frontmatter parsing
- **Source Directories:**
  - Blog: `apps/web/src/content/post/`
  - Glossary: `apps/web/src/content/glossary/`
  - Pages: `apps/web/src/pages/`
- **Output:** `docs/claude-reference/`

---

**Remember:** These files are your source of truth for site content. Always verify against them before making assertions about what exists on the site.

