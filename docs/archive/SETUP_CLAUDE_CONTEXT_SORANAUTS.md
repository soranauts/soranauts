# SETUP_CLAUDE_CONTEXT.md — Soranauts Edition

> **Instruction file for Claude Code CLI**  
> **Version:** 3.0.0 (Soranauts-specific)  
> **Based on:** ai-engineer-journey v2.1.0 template  
> **Purpose:** Generate verified project context files for Claude Projects  
> **Key Principle:** Never write documentation from memory — always read actual source files first

---

## Why This Exists

Claude Code CLI often generates documentation with:
- Hallucinated glossary counts (says 368 when it's actually 370)
- Wrong file paths (assumes `src/` when Soranauts uses `apps/web/src/`)
- Fictional commit hashes and branch names
- Made-up features or statuses

**This template enforces verification at every step with Soranauts-specific commands.**

---

## How to Use

1. Place this file in the Soranauts repo root or `docs/` folder
2. Run with Claude Code CLI: `claude "Follow SETUP_CLAUDE_CONTEXT.md exactly. Complete Phase 0 first."`
3. Or paste sections into Cursor as prompts

**CRITICAL:** Complete Phase 0 (data gathering) before writing ANY documentation.

---

## [PHASE 0] PRE-FLIGHT: Gather Real Data First

**DO NOT SKIP THIS PHASE. DO NOT WRITE ANY DOCS UNTIL THIS IS COMPLETE.**

### 0.1 — Verify Soranauts Repo Structure

```bash
# Confirm we're in the right repo
pwd
ls -la
cat package.json | jq '{name, version}' 2>/dev/null

# Confirm monorepo structure
ls apps/
ls packages/
cat pnpm-workspace.yaml 2>/dev/null
```

**Expected output:** Should see `apps/web/`, `packages/`, monorepo config.  
**If this fails:** You may be in the wrong directory.

### 0.2 — Extract Glossary Metrics (CRITICAL)

```bash
# Canonical term count (the main glossary JSON)
GLOSSARY_FILE="apps/web/src/data/glossary.v2025.json"
CANONICAL_COUNT=$(cat "$GLOSSARY_FILE" | jq '.terms | length')
echo "Canonical terms: $CANONICAL_COUNT"

# Alias count (redirects to canonical terms)
ALIAS_FILE="apps/web/src/data/glossary.aliases.v2025.json"
ALIAS_COUNT=$(cat "$ALIAS_FILE" | jq 'length' 2>/dev/null || echo "0")
echo "Aliases: $ALIAS_COUNT"

# MDX glossary pages (should roughly match canonical count)
MDX_COUNT=$(ls apps/web/src/content/glossary/*.mdx 2>/dev/null | wc -l | tr -d ' ')
echo "MDX pages: $MDX_COUNT"

# Categories
CATEGORY_COUNT=$(cat "$GLOSSARY_FILE" | jq '[.terms[].category] | unique | length')
echo "Categories: $CATEGORY_COUNT"
```

**Record these EXACT values. They change frequently.**

### 0.3 — Extract Content Metrics

```bash
# Blog post count
BLOG_COUNT=$(ls apps/web/src/content/post/*.mdx 2>/dev/null | wc -l | tr -d ' ')
echo "Blog posts: $BLOG_COUNT"

# Docs pages (Starlight)
DOCS_COUNT=$(find apps/web/src/content/docs -name "*.mdx" 2>/dev/null | wc -l | tr -d ' ')
echo "Docs pages: $DOCS_COUNT"

# Learning paths
LEARNING_PATHS=$(ls apps/web/src/content/learning-path/*.json 2>/dev/null | wc -l | tr -d ' ')
echo "Learning paths: $LEARNING_PATHS"
```

### 0.4 — Extract Git Information

```bash
# Recent commits (last 10)
echo "=== Recent Commits ==="
git log --oneline -10

# Branch info
echo -e "\n=== Branches ==="
BRANCH_COUNT=$(git branch -a | wc -l | tr -d ' ')
echo "Total branches: $BRANCH_COUNT"
git branch -a | head -15

# Current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Last commit hash and date
LAST_COMMIT=$(git log -1 --format="%h")
LAST_COMMIT_DATE=$(git log -1 --format="%ci")
echo "Last commit: $LAST_COMMIT ($LAST_COMMIT_DATE)"

# Total commit count
TOTAL_COMMITS=$(git rev-list --count HEAD)
echo "Total commits: $TOTAL_COMMITS"

# Tags
TAG_COUNT=$(git tag | wc -l | tr -d ' ')
echo "Tags: $TAG_COUNT"
```

### 0.5 — Check CI/CD and Test Status

```bash
# GitHub Actions workflows
echo "=== CI Workflows ==="
ls .github/workflows/

# Run tests (capture counts)
echo -e "\n=== Test Status ==="
cd apps/web

# Unit tests
echo "Running unit tests..."
pnpm test --passWithNoTests 2>&1 | tail -5

# E2E tests (list only, don't run)
echo -e "\nE2E test files:"
ls tests/e2e/*.spec.ts 2>/dev/null | wc -l | tr -d ' '

# Build check
echo -e "\n=== Build Check ==="
pnpm build 2>&1 | grep -E "pages|error|success" | tail -5

cd ../..
```

### 0.6 — Check Existing Reference Files

```bash
# Soranauts has reference files that may already exist
echo "=== Existing Reference Files ==="
ls docs/claude-reference/ 2>/dev/null || echo "No claude-reference folder"
ls docs/claude-context/ 2>/dev/null || echo "No claude-context folder (will create)"

# Check if LINK_INVENTORY exists (has valid slugs)
if [ -f "docs/claude-reference/LINK_INVENTORY.md" ]; then
    echo "LINK_INVENTORY.md exists - use this for slug validation"
fi

# Check if CONTENT_SUMMARY exists
if [ -f "docs/claude-reference/CONTENT_SUMMARY.md" ]; then
    echo "CONTENT_SUMMARY.md exists - has article metadata"
fi
```

### 0.7 — Record All Values (MANDATORY)

**STOP. Fill in this table with ACTUAL values before proceeding:**

```markdown
## PRE-FLIGHT DATA COLLECTION — SORANAUTS

| Metric | Command Used | Actual Value |
|--------|--------------|--------------|
| Canonical terms | `jq '.terms \| length' glossary.v2025.json` | |
| Aliases | `jq 'length' glossary.aliases.v2025.json` | |
| MDX glossary pages | `ls ... \| wc -l` | |
| Categories | `jq '[.terms[].category] \| unique \| length'` | |
| Blog posts | `ls ... \| wc -l` | |
| Docs pages | `find ... \| wc -l` | |
| Learning paths | `ls ... \| wc -l` | |
| Total branches | `git branch -a \| wc -l` | |
| Tags | `git tag \| wc -l` | |
| Total commits | `git rev-list --count HEAD` | |
| Last commit | `git log -1 --format="%h"` | |
| CI workflows | `ls .github/workflows/` | |
| Build status | `pnpm build` | ✅ or ❌ |

**Data collected on:** [DATE/TIME]
**Data collected by:** Claude Code CLI
```

**ONLY proceed to Phase 1 after recording real values.**

---

## [PHASE 1] Create Directory Structure

```bash
mkdir -p docs/claude-context
```

---

## [PHASE 2] Create PROJECT_STATE.md

**File:** `docs/claude-context/PROJECT_STATE.md`

**INSTRUCTION:** Replace ALL `[VALUE]` placeholders with data from Phase 0.

```markdown
# Soranauts Project State

> **Last Updated:** [TODAY'S DATE]  
> **Data Source:** Extracted from codebase on [DATE]

---

## Quick Reference (Verified)

| Metric | Value | Verification Command |
|--------|-------|---------------------|
| Glossary terms | [VALUE] canonical | `jq '.terms \| length' apps/web/src/data/glossary.v2025.json` |
| Aliases | [VALUE] | `jq 'length' apps/web/src/data/glossary.aliases.v2025.json` |
| MDX glossary pages | [VALUE] | `ls apps/web/src/content/glossary/*.mdx \| wc -l` |
| Categories | [VALUE] | `jq '[.terms[].category] \| unique \| length'` |
| Blog posts | [VALUE] | `ls apps/web/src/content/post/*.mdx \| wc -l` |
| Docs pages | [VALUE] | `find apps/web/src/content/docs -name "*.mdx" \| wc -l` |
| Total commits | [VALUE] | `git rev-list --count HEAD` |
| Branches | [VALUE] | `git branch -a \| wc -l` |

---

## Current Status

**Phase:** [Pre-Open-Source Launch / Maintenance / Active Development]

### What Works ✅
[FROM: Build output, test results, live site verification]
- [ ] Production site: https://soranauts.com — Verified: `curl -I https://soranauts.com`
- [ ] Glossary system — Verified: [BUILD_OUTPUT]
- [ ] CI workflows — Verified: `ls .github/workflows/`
- [ ] E2E tests — Verified: [TEST_OUTPUT]

### In Progress 🔄
[FROM: git status, TODO comments, recent commits]
- [ ] [Task] — Evidence: `[commit hash or file]`

### Known Issues ⚠️
[FROM: grep TODO/FIXME results, failing tests, CI status]
- [ ] [Issue] — Location: `[file:line or workflow name]`

---

## Recent Activity

[FROM: git log --oneline -10]

| Hash | Date | Description |
|------|------|-------------|
| [HASH] | [DATE] | [MESSAGE] |

---

## Key Files

| File | Purpose | Verified |
|------|---------|----------|
| `apps/web/src/data/glossary.v2025.json` | Canonical glossary terms | ✅ |
| `apps/web/src/data/glossary.aliases.v2025.json` | Alias redirects | ✅ |
| `apps/web/src/data/taxonomy.ts` | Single source of truth | ✅ |
| `vercel.json` | Redirects and headers | ✅ |
| `.github/workflows/web-e2e.yml` | E2E test workflow | ✅ |

---

## Verification Commands

To re-verify this data:
```bash
# Glossary
cat apps/web/src/data/glossary.v2025.json | jq '.terms | length'
cat apps/web/src/data/glossary.aliases.v2025.json | jq 'length'

# Content
ls apps/web/src/content/post/*.mdx | wc -l
find apps/web/src/content/docs -name "*.mdx" | wc -l

# Git
git log --oneline -5
git branch -a | wc -l
```
```

---

## [PHASE 3] Create ARCHITECTURE.md

**File:** `docs/claude-context/ARCHITECTURE.md`

**INSTRUCTION:** Only document what you can verify exists.

```markdown
# Soranauts Architecture

> **Last Updated:** [TODAY'S DATE]  
> **Source:** Extracted from actual config files

---

## Tech Stack (Verified from package.json)

| Layer | Technology | Version | Source |
|-------|------------|---------|--------|
| Framework | Astro | [RUN: `cat apps/web/package.json \| jq '.dependencies.astro'`] | `apps/web/package.json` |
| UI | React | [FROM: package.json] | `apps/web/package.json` |
| Styling | Tailwind CSS | [FROM: package.json] | `apps/web/package.json` |
| Content | MDX | — | `apps/web/src/content/` |
| Search | Pagefind | [FROM: package.json] | `apps/web/package.json` |
| Testing | Playwright | [FROM: package.json] | `apps/web/package.json` |
| Testing | Vitest | [FROM: package.json] | `apps/web/package.json` |
| Monorepo | pnpm + Turbo | — | `pnpm-workspace.yaml` |
| Deployment | Vercel | — | `vercel.json` |

---

## Project Structure (Actual)

[RUN: `tree -L 3 -d --prune` or equivalent]

```
soranauts/
├── apps/
│   └── web/                    # Main Astro site
│       ├── src/
│       │   ├── components/     # React + Astro components
│       │   ├── content/        # Content collections (MDX)
│       │   │   ├── glossary/   # [VALUE] MDX term pages
│       │   │   ├── post/       # [VALUE] blog articles
│       │   │   └── docs/       # [VALUE] Starlight docs
│       │   ├── data/           # JSON data files
│       │   │   ├── glossary.v2025.json
│       │   │   ├── glossary.aliases.v2025.json
│       │   │   └── taxonomy.ts
│       │   └── pages/          # Route pages
│       └── tests/e2e/          # Playwright tests
├── packages/
│   ├── chain/                  # Blockchain facade
│   ├── config/                 # Shared config
│   └── ui/                     # Shared components
├── knowledge_base/             # RAG system (future: soranauts-ai)
├── docs/
│   ├── claude-reference/       # Reference files for Claude
│   └── claude-context/         # Session continuity files
└── .github/workflows/          # CI workflows
```

---

## Content Collections

| Collection | Location | Count | Format |
|------------|----------|-------|--------|
| Glossary | `apps/web/src/content/glossary/` | [VALUE] | MDX |
| Blog | `apps/web/src/content/post/` | [VALUE] | MDX |
| Docs | `apps/web/src/content/docs/` | [VALUE] | MDX |

---

## CI Workflows (from .github/workflows/)

[LIST EACH WORKFLOW FILE WITH ITS PURPOSE]

| Workflow | Purpose | Status |
|----------|---------|--------|
| [FILENAME].yml | [PURPOSE] | ✅/❌ |

---

## Protected Routes

These routes should not break:
- `/glossary/*` — Glossary term pages
- `/explore` — Tag explorer
- `/learn` — Learning paths
- `/docs/*` — Starlight documentation
- `/blog/*` — Blog articles
```

---

## [PHASE 4] Create DECISIONS.md

**File:** `docs/claude-context/DECISIONS.md`

**INSTRUCTION:** Only document decisions with EVIDENCE. No speculation.

```markdown
# Soranauts Key Decisions

> **Last Updated:** [TODAY'S DATE]  
> **Rule:** Every decision must have evidence (commit, file, or comment)

---

## Decision Log

### [DATE] — [Decision Title]

| Aspect | Detail |
|--------|--------|
| **Decision** | [What was decided] |
| **Evidence** | Commit: `[HASH]` OR File: `[PATH]` |
| **Reason** | [Only if documented in commit message or code comment] |
| **Alternatives** | [Only if documented] |

---

## Recent Decisions (From Git Log)

[SEARCH: git log --oneline --grep="decision\|chose\|option\|instead" | head -10]

---

## How to Add Decisions

1. Find evidence: `git log --oneline --grep="[keyword]"`
2. Only add if you can point to proof
3. Mark "Reason: Undocumented" if no reason in code
```

---

## [PHASE 5] Create NEXT_STEPS.md

**File:** `docs/claude-context/NEXT_STEPS.md`

```markdown
# Soranauts Next Steps

> **Last Updated:** [TODAY'S DATE]  
> **Sources:** git status, TODO comments, session log

---

## Priority Legend

- 🔴 **P0** — Blocking / Critical
- 🟠 **P1** — High priority
- 🟡 **P2** — Medium priority  
- 🟢 **P3** — Low priority / Nice to have

---

## Sources

| Source | Command | Items Found |
|--------|---------|-------------|
| Uncommitted | `git status` | [COUNT] |
| TODO comments | `grep -r "TODO" apps/web/src/` | [COUNT] |
| FIXME comments | `grep -r "FIXME" apps/web/src/` | [COUNT] |

---

## Immediate (From git status)

| Task | Priority | Source |
|------|----------|--------|
| [Uncommitted file or WIP] | 🔴 P0 | `git status` |

---

## From TODO Comments

| Task | Priority | Location |
|------|----------|----------|
| [TODO text] | 🟠 P1 | `[file:line]` |

---

## Planned (Open-Source Prep)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1 | Branch cleanup ([ACTUAL] → ~5) | 🔴 P0 | Pending |
| 2 | Tag cleanup | 🟠 P1 | Pending |
| 3 | v1.0.0 release | 🔴 P0 | Pending |
| 4 | README refresh | 🔴 P0 | Pending |
| 5 | CONTRIBUTING.md | 🟠 P1 | Pending |
| 6 | Issue templates | 🟠 P1 | Pending |

---

## Completed Recently

[FROM: git log --oneline -10]

| Date | Task | Commit |
|------|------|--------|
| [DATE] | [MESSAGE] | `[HASH]` |
```

---

## [PHASE 6] Create SESSION_LOG.md

**File:** `docs/claude-context/SESSION_LOG.md`

```markdown
# Soranauts Session Log

> **Purpose:** Track what was done in each Claude/AI session  
> **Format:** Newest entries at top

---

## [DATE] — Context System Setup

**Duration:** ~30 min  
**Tools Used:** Claude Code CLI

### Completed
- [x] Phase 0: Pre-flight data gathering
- [x] Phase 1-6: Created claude-context files
- [x] Phase 7: Verification passed

### Metrics Verified
| Metric | Value |
|--------|-------|
| Canonical terms | [VALUE] |
| Aliases | [VALUE] |
| Blog posts | [VALUE] |
| Branches | [VALUE] |

### Commits This Session
```
[PASTE: git log --oneline -5]
```

### Handoff Notes
[What the next session needs to know]

---

## How to Update

After each session:
```bash
# Get commits from this session
git log --oneline --since="4 hours ago"

# Add new entry at TOP of this file
```
```

---

## [PHASE 7] VERIFICATION (MANDATORY)

**DO NOT COMMIT WITHOUT RUNNING THESE CHECKS.**

### 7.1 — Verify Glossary Metrics Match

```bash
echo "=== GLOSSARY VERIFICATION ==="

# Check stated vs actual
STATED_TERMS=$(grep -oE '[0-9]+ canonical' docs/claude-context/PROJECT_STATE.md | grep -oE '[0-9]+' | head -1)
ACTUAL_TERMS=$(cat apps/web/src/data/glossary.v2025.json | jq '.terms | length')
echo "Terms - Stated: $STATED_TERMS, Actual: $ACTUAL_TERMS"
[ "$STATED_TERMS" = "$ACTUAL_TERMS" ] && echo "✅ Match" || echo "❌ MISMATCH - FIX THIS"

STATED_ALIASES=$(grep -oE 'Aliases.*[0-9]+' docs/claude-context/PROJECT_STATE.md | grep -oE '[0-9]+' | head -1)
ACTUAL_ALIASES=$(cat apps/web/src/data/glossary.aliases.v2025.json | jq 'length')
echo "Aliases - Stated: $STATED_ALIASES, Actual: $ACTUAL_ALIASES"
[ "$STATED_ALIASES" = "$ACTUAL_ALIASES" ] && echo "✅ Match" || echo "❌ MISMATCH - FIX THIS"
```

### 7.2 — Verify Content Counts Match

```bash
echo "=== CONTENT VERIFICATION ==="

STATED_BLOGS=$(grep -oE 'Blog posts.*[0-9]+' docs/claude-context/PROJECT_STATE.md | grep -oE '[0-9]+' | head -1)
ACTUAL_BLOGS=$(ls apps/web/src/content/post/*.mdx 2>/dev/null | wc -l | tr -d ' ')
echo "Blogs - Stated: $STATED_BLOGS, Actual: $ACTUAL_BLOGS"
[ "$STATED_BLOGS" = "$ACTUAL_BLOGS" ] && echo "✅ Match" || echo "❌ MISMATCH - FIX THIS"
```

### 7.3 — Verify All Referenced Files Exist

```bash
echo "=== FILE VERIFICATION ==="

# Check key files exist
for file in \
  "apps/web/src/data/glossary.v2025.json" \
  "apps/web/src/data/glossary.aliases.v2025.json" \
  "apps/web/src/data/taxonomy.ts" \
  "vercel.json" \
  ".github/workflows/web-e2e.yml"
do
  [ -f "$file" ] && echo "✅ $file" || echo "❌ MISSING: $file"
done
```

### 7.4 — Verify No Placeholders Remain

```bash
echo "=== PLACEHOLDER CHECK ==="
grep -r "\[VALUE\]\|\[DATE\]\|\[HASH\]\|TODO\|TBD" docs/claude-context/ 2>/dev/null && echo "❌ Found unfilled placeholders!" || echo "✅ No placeholders found"
```

### 7.5 — Summary

```bash
echo ""
echo "=== FINAL CHECKLIST ==="
echo "[ ] Glossary metrics match actual counts"
echo "[ ] Content counts match actual counts"  
echo "[ ] All key files exist"
echo "[ ] No placeholder text remaining"
echo "[ ] Branch count is accurate"
echo ""
echo "If ALL checks pass, proceed to Phase 8."
```

---

## [PHASE 8] Commit (Only After Verification Passes)

```bash
git add docs/claude-context/

git diff --cached --stat

git commit -m "docs: add Claude context system (verified)

Files created:
- PROJECT_STATE.md: Current status and metrics
- ARCHITECTURE.md: Tech stack and structure
- DECISIONS.md: Key decisions with evidence
- NEXT_STEPS.md: Prioritized backlog
- SESSION_LOG.md: Running session history

Metrics verified:
- Glossary: [ACTUAL] canonical terms, [ACTUAL] aliases
- Content: [ACTUAL] blog posts, [ACTUAL] docs pages
- Git: [ACTUAL] branches, [ACTUAL] commits"

git push
```

---

## [PHASE 9] Output Summary

Provide this final summary:

```markdown
## Context System Created Successfully

| File | Lines | Key Metrics |
|------|-------|-------------|
| PROJECT_STATE.md | [COUNT] | Glossary: X terms, Y aliases |
| ARCHITECTURE.md | [COUNT] | Tech stack: Astro + React + Tailwind |
| DECISIONS.md | [COUNT] | Evidence-backed decisions: [COUNT] |
| NEXT_STEPS.md | [COUNT] | Pending tasks: [COUNT] |
| SESSION_LOG.md | [COUNT] | Initial session logged |

### Verification Results
- [x] Glossary counts match: [ACTUAL] canonical, [ACTUAL] aliases
- [x] Content counts match: [ACTUAL] blogs, [ACTUAL] docs
- [x] All key files verified to exist
- [x] No placeholders remaining
- [x] Committed and pushed to main

### Next Steps
1. Upload these files to Claude Project for context
2. Start new chat with: "Read docs/claude-context/PROJECT_STATE.md for current state"
```

---

## Quick Reference

| File | Purpose | Update Frequency |
|------|---------|------------------|
| PROJECT_STATE.md | Current status snapshot | Weekly or after major changes |
| ARCHITECTURE.md | Tech stack reference | When deps/structure changes |
| DECISIONS.md | Decision log | When decisions are made |
| NEXT_STEPS.md | Task backlog | Each session |
| SESSION_LOG.md | Session history | End of each session |

---

## Common Mistakes to Avoid

| Mistake | Why It's Bad | How to Avoid |
|---------|--------------|--------------|
| Writing "370 terms" from memory | Real count may have changed | Always run `jq '.terms \| length'` |
| Assuming file paths | Soranauts is a monorepo | Use `apps/web/src/...` paths |
| Using fake commit hashes | Breaks trust in docs | Copy from `git log` output |
| Skipping Phase 0 | All metrics will be wrong | Complete data table first |
| Not running Phase 7 | Errors compound | Always verify before commit |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0.0 | 2026-01-15 | Soranauts-specific: monorepo paths, glossary verification, content counts |
| 2.1.0 | 2026-01-15 | Generic template from ai-engineer-journey |
| 2.0.0 | 2026-01-14 | Added mandatory verification phase |
| 1.0.0 | 2026-01-14 | Initial version |
