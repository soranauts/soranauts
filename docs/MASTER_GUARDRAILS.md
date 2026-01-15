# Soranauts Master Guardrails for AI Assistants

> **For Cursor, Claude Code, and other AI coding assistants**
> 
> This file combines and references all project guardrails.
> Read this first, then refer to specific documents for details.

---

## 🎯 Quick Start for AI Assistants

Before doing ANY work on this project:

1. ✅ Read this entire file
2. ✅ Read `CSS_GUARDRAILS.md` for styling rules
3. ✅ Read `DESIGN-TOKENS.md` for design system
4. ✅ Read `glossary-architecture-explained.md` for system architecture
5. ✅ Follow safety checks in `PUSH_SAFETY_CHECK.md` before pushing

---

## 🚨 CRITICAL: Production Safety

### Branch Requirements by Change Type

| Change Type | Branch Required? | Can Push to Main? |
|-------------|------------------|-------------------|
| **Content-only updates** (articles, glossary text, dates, typos) | ❌ No | ✅ Yes |
| Code changes (components, utilities, logic) | ✅ Yes | ❌ No |
| Configuration changes (package.json, astro.config, etc.) | ✅ Yes | ❌ No |
| Styling changes (CSS, Tailwind classes) | ✅ Yes | ❌ No |
| New features or components | ✅ Yes | ❌ No |

### How to Identify Content-Only Changes

**Direct commits to `main` are allowed when ALL modified files are in:**
- `apps/web/src/content/post/*.mdx` — Blog articles
- `apps/web/src/content/glossary/*.mdx` — Glossary term content
- `docs/` — Documentation files
- `*.md` files in project root (except config files)

**Examples of content-only changes:**
- Updating `updateDate` in article frontmatter
- Fixing typos in article text
- Changing "November 2025" to "December 2025"
- Adding internal links to articles
- Updating FAQ answers
- Editorial improvements

**If ANY non-content file is modified, create a feature branch.**

### Pre-Push Checklist (For Code Changes)
See `PUSH_SAFETY_CHECK.md` for the complete checklist. Key points:
1. ✅ Verify you're on a feature branch (not `main`)
2. ✅ Run `pnpm build` - ensure no errors
3. ✅ Check for sensitive data (API keys, tokens)
4. ✅ Verify no large files (>10MB)
5. ✅ Remove duplicate files (" 2", " 3" suffixes)
6. ✅ Get explicit user approval

### Pre-Push Checklist (For Content-Only Changes)
1. ✅ Verify ONLY content files are modified (`git status`)
2. ✅ Run `pnpm build` - ensure no errors
3. ✅ Commit with clear message (e.g., `content: update article dates`)
4. ✅ Push directly to `main`

---

## 📚 Architecture Understanding Required

### Glossary System (368 terms)
The user is learning software architecture. **Always explain your reasoning.**

**Read these files to understand the system:**
- `glossary-architecture-explained.md` - Complete architecture guide
- `apps/web/src/data/taxonomy.ts` - Master term definitions (5000+ lines)
- `apps/web/src/lib/glossary/glossary-loader.ts` - How terms are loaded

**Three-layer architecture:**
1. **MDX files** (`apps/web/src/content/glossary/*.mdx`) - Individual pages
2. **Taxonomy** (`apps/web/src/data/taxonomy.ts`) - Master data (137 core terms)
3. **JSON files** (`apps/web/public/data/*.json`) - Build outputs (368 terms total)

**NEVER manually edit JSON files** - they are generated during build.

### Adding New Glossary Terms

**Process:**
1. Create MDX file in `apps/web/src/content/glossary/TermName.mdx`
2. For core terms, also add to `taxonomy.ts`
3. Run `pnpm build` to generate JSON
4. Verify term appears in `glossary.v2025.json`

**Template:**
```markdown
---
title: "Term Name"
slug: term-name
category: "technology" # token|technology|governance|defi|network|economics
tags:
  - "SORA Blockchain"
summary: "Brief definition"
related:
  - "Related Term 1"
---
```

---

## 🎨 CSS and Styling Rules

**MUST READ:** `CSS_GUARDRAILS.md` - Comprehensive CSS rules

### Key Principles
1. **ALWAYS use design tokens** from `DESIGN-TOKENS.md`
2. **NEVER hardcode colors** (no hex values, no `text-blue-*`)
3. **ALWAYS scope styles** to component classes
4. **NEVER write global selectors** (`a {}`, `body {}`)

### Correct Pattern
```css
/* ✅ CORRECT */
.my-component {
  color: var(--color-text);
  background: var(--color-surface);
}

.my-component:hover {
  color: var(--color-link-hover);
}
```

### Wrong Pattern
```css
/* ❌ WRONG */
a {
  color: blue !important;
}

.card {
  background: #E3242D;
}
```

### Tailwind Usage
```tsx
{/* ✅ CORRECT */}
<a className="text-link hover:text-link-hover">

{/* ❌ WRONG */}
<a className="text-blue-500 hover:text-blue-700">
```

---

## 💻 TypeScript and Code Quality

### Type Safety
```typescript
// ✅ CORRECT - Use proper types
interface GlossaryTerm {
  slug: string;
  title: string;
  definition: string;
}

// ❌ WRONG - No 'any' types
function getTerm(slug: any): any {  // AVOID
}
```

### Error Handling
```typescript
// ✅ CORRECT - Handle errors
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Failed:', error);
  return null;
}
```

---

## 🔄 Git Workflow

### Branch Strategy

**For code/config/styling changes:**
```bash
# ALWAYS create feature branches
git checkout -b feature/your-feature-name

# Get user approval before pushing
git push origin feature/your-feature-name
```

**For content-only changes:**
```bash
# Verify only content files changed
git status

# If ONLY .mdx content files or docs changed:
git add .
git commit -m "content: brief description of changes"
git push origin main
```

### Commit Message Prefixes
- `content:` — Article/glossary content updates
- `feat:` — New features
- `fix:` — Bug fixes
- `style:` — CSS/styling changes
- `refactor:` — Code refactoring
- `docs:` — Documentation updates
- `chore:` — Maintenance tasks

### Files to NEVER Commit
- `.env` or `.env.local`
- `node_modules/`
- `.sqlite3` files
- `.embedding_cache/`
- Files with " 2" or " 3" suffixes (duplicates)
- API keys or tokens
- Large binary files (>10MB)

---

## 🤖 AI Assistant Behavior

### Teaching Mode
**The user is learning software architecture.** Your role is to:
1. **Explain reasoning** before making changes
2. **Show what will change** and why
3. **Ask for confirmation** on major operations
4. **Verify builds** after changes
5. **Use analogies** to explain complex concepts

### When User Asks for Changes
```
❌ Don't just do it silently
✅ Explain what you'll do first
✅ Show affected files
✅ Verify build succeeds
✅ Explain what changed and why
```

### When User is Confused
```
✅ Use analogies and real-world comparisons
✅ Draw text diagrams when helpful
✅ Start high-level, then go into details
✅ Check understanding with questions
✅ Provide concrete examples from codebase
```

### Red Flags - Stop and Ask
If you encounter these, **STOP and ask user:**
1. 🚨 Deleting files in `apps/web/src/data/`
2. 🚨 Modifying JSON files in `public/data/`
3. 🚨 Changes affecting >50 files
4. 🚨 Installing new dependencies
5. 🚨 Build failing after your changes
6. 🚨 User showing frustration about architecture
7. 🚨 Pushing CODE changes to `main` (content-only is OK)

---

## 📁 Project Structure

### Key Directories
```
soranauts-main/
├── apps/web/src/
│   ├── content/          # MDX content (posts, glossary)
│   ├── data/            # TypeScript data files (taxonomy)
│   ├── lib/             # Core logic (loaders, utilities)
│   ├── components/      # React/Astro components
│   └── pages/           # Routes and pages
├── apps/web/public/     # Static assets and build outputs
│   └── data/           # Generated JSON files (DON'T EDIT)
├── docs/               # Documentation and reference files
│   └── claude-reference/  # AI assistant reference files
├── knowledge_base/      # Curated content
├── scripts/            # Build and utility scripts
└── .github/workflows/  # CI/CD (be careful!)
```

### Important Files
- `taxonomy.ts` - Master glossary data
- `glossary-loader.ts` - Data loading logic
- `CSS_GUARDRAILS.md` - Styling rules
- `DESIGN-TOKENS.md` - Design system
- `MASTER_GUARDRAILS.md` - This file

### Reference Files for Article Editing
- `docs/claude-reference/LINK_INVENTORY.md` - All valid internal links
- `docs/claude-reference/CONTENT_SUMMARY.md` - Article metadata
- `docs/claude-reference/TAG_MATRIX.md` - Tag usage
- `docs/claude-reference/VALIDATION_REPORT.md` - Broken links, orphans
- `docs/ARTICLE_CREATION_GUIDE.md` - New article standards
- `docs/ARTICLE_EDIT_PLAN_TEMPLATE.md` - Article editing standards

---

## 🛠️ Build and Development

### Commands
```bash
pnpm dev              # Development server
pnpm build            # Production build (always verify!)
pnpm preview          # Preview production
pnpm test             # Run tests
pnpm lint             # Check code quality
```

### Build Verification
**ALWAYS verify builds before committing:**
```bash
pnpm build
# Check output for errors
# Verify glossary count: should be 368 terms
```

---

## 🔗 Reference Documents

### Must Read (in order)
1. **This file** - Master guardrails
2. **`glossary-architecture-explained.md`** - System architecture
3. **`CSS_GUARDRAILS.md`** - Styling rules
4. **`DESIGN-TOKENS.md`** - Design system
5. **`PUSH_SAFETY_CHECK.md`** - Pre-push checklist

### For Article Editing
1. **`docs/ARTICLE_EDIT_PLAN_TEMPLATE.md`** - Editing standards
2. **`docs/ARTICLE_CREATION_GUIDE.md`** - New article standards
3. **`docs/claude-reference/LINK_INVENTORY.md`** - Valid links
4. **`docs/claude-reference/TAG_MATRIX.md`** - Tag reference

### Additional Resources
- `CLAUDE_CODE_GUIDE.md` - How to use Claude Code
- `AI_TOOLS_QUICK_REFERENCE.md` - Which tool to use when
- `ARCHITECTURE.md` - General project architecture
- `CONTRIBUTING.md` - Contribution guidelines

---

## 🎓 Learning Goals

The user wants to:
- ✅ Understand software architecture deeply
- ✅ Learn how systems connect and flow
- ✅ Make informed decisions about structure
- ✅ Know when to use which AI model
- ✅ Build confidence through understanding

**Support this by:**
- Explaining WHY, not just HOW
- Using the codebase as teaching material
- Tracing data flows step-by-step
- Creating diagrams and documentation
- Being patient and thorough

---

## ⚡ Quick Reference

### Add Glossary Term
```bash
# 1. Create MDX file
touch apps/web/src/content/glossary/NewTerm.mdx
# 2. Add to taxonomy.ts (for core terms)
# 3. Build
pnpm build
# 4. Verify in glossary.v2025.json
```

### Fix CSS Issue
```bash
# 1. Check design tokens
cat DESIGN-TOKENS.md
# 2. Find offending CSS
grep -r "text-blue-500" apps/web/src/
# 3. Replace with tokens
# 4. Test: pnpm dev
```

### Content-Only Git Workflow (Articles, Glossary Text)
```bash
# Verify only content files changed
git status
# Should show ONLY files in:
#   - apps/web/src/content/post/
#   - apps/web/src/content/glossary/
#   - docs/

# Commit and push directly
git add .
git commit -m "content: update article dates and links"
git push origin main
```

### Code Change Git Workflow
```bash
git checkout -b feature/my-changes
# Make changes...
git add .
git commit -m "feat: describe changes"
# Ask user before:
git push origin feature/my-changes
```

---

## 🚦 Traffic Light System

### 🟢 Green Light (Safe to do)
- Create feature branches
- Make changes on feature branches
- Run builds and tests
- Explain your reasoning
- Ask clarifying questions
- **Push content-only changes to `main`**

### 🟡 Yellow Light (Ask first)
- Installing new dependencies
- Modifying package.json
- Creating new workflows
- Large refactoring (>10 files)
- Changing architecture

### 🔴 Red Light (Never do without explicit approval)
- Push CODE changes to `main` branch
- Delete files in `/src/data/`
- Modify JSON in `/public/data/`
- Commit sensitive data
- Disable safety checks

---

## 📞 When in Doubt

**If you're unsure:**
1. Explain what you're thinking
2. Present options with pros/cons
3. Ask the user to decide
4. Document the decision

**Remember:** The user is learning. Every interaction is a teaching opportunity.

---

## Version
- Master Guardrails v1.1
- Added content-only direct commit workflow
- Last updated: 2025-12
