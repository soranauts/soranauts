# Quick Command Reference

> **Purpose:** One-line commands for common reference file operations

---

## 🔄 Regenerate All Reference Files

```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts && npx tsx scripts/generate-claude-reference.ts && npx tsx scripts/validate-links.ts
```

---

## 📊 Individual Operations

### Generate Core Reference Files
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts
npx tsx scripts/generate-claude-reference.ts
```

**Output:**
- LINK_INVENTORY.md
- CONTENT_SUMMARY.md
- TAG_MATRIX.md
- GLOSSARY_TERMS.md
- SITE_STRUCTURE.md

---

### Validate Links and Find Orphans
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts
npx tsx scripts/validate-links.ts
```

**Output:**
- VALIDATION_REPORT.md

---

## 📁 View Reference Files

### List All Reference Files
```bash
ls -lh /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference/
```

### View File Sizes
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference
wc -l *.md
```

### Check Last Modified
```bash
ls -lt /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference/*.md | head -5
```

---

## 🔍 Quick Searches

### Find a Blog Post Slug
```bash
grep "your-search-term" /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference/LINK_INVENTORY.md
```

### Find a Glossary Term
```bash
grep -i "your-term" /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference/GLOSSARY_TERMS.md
```

### Check Tag Usage
```bash
grep "your-tag" /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference/TAG_MATRIX.md
```

### Find Broken Links
```bash
cat /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference/VALIDATION_REPORT.md | grep "Broken Link"
```

---

## 📝 Content Operations

### Count Blog Posts
```bash
ls -1 /Users/dustinmatlock/Documents/GitHub/soranauts/apps/web/src/content/post/*.mdx | wc -l
```

### Count Glossary Terms
```bash
ls -1 /Users/dustinmatlock/Documents/GitHub/soranauts/apps/web/src/content/glossary/*.mdx | wc -l
```

### List Recent Blog Posts
```bash
ls -lt /Users/dustinmatlock/Documents/GitHub/soranauts/apps/web/src/content/post/*.mdx | head -5
```

---

## 🛠️ Script Management

### View Generation Script
```bash
cat /Users/dustinmatlock/Documents/GitHub/soranauts/scripts/generate-claude-reference.ts
```

### View Validation Script
```bash
cat /Users/dustinmatlock/Documents/GitHub/soranauts/scripts/validate-links.ts
```

### Make Scripts Executable (if needed)
```bash
chmod +x /Users/dustinmatlock/Documents/GitHub/soranauts/scripts/generate-claude-reference.ts
chmod +x /Users/dustinmatlock/Documents/GitHub/soranauts/scripts/validate-links.ts
```

---

## 🧹 Cleanup (Use with Caution)

### Remove All Reference Files (to regenerate fresh)
```bash
rm /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference/*.md
```

**⚠️ Warning:** This will delete all reference files. Only use if you plan to regenerate immediately.

---

## 📦 Dependencies

### Check if gray-matter is installed
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts
pnpm list gray-matter
```

### Install/Update gray-matter
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts
pnpm add -D -w gray-matter
```

---

## 🔄 Automated Workflow

### Full Regeneration with Verification
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts && \
echo "🔄 Regenerating reference files..." && \
npx tsx scripts/generate-claude-reference.ts && \
echo "✅ Core files generated" && \
npx tsx scripts/validate-links.ts && \
echo "✅ Validation complete" && \
echo "📊 Summary:" && \
wc -l docs/claude-reference/*.md | tail -1
```

---

## 📋 Pre-Article Editing Checklist

Run these commands before starting an article editing session:

```bash
# 1. Navigate to project
cd /Users/dustinmatlock/Documents/GitHub/soranauts

# 2. Check if reference files are recent (< 7 days old)
find docs/claude-reference -name "*.md" -mtime -7

# 3. If old or empty, regenerate
npx tsx scripts/generate-claude-reference.ts
npx tsx scripts/validate-links.ts

# 4. Verify generation
ls -lh docs/claude-reference/

# 5. Check for issues
cat docs/claude-reference/VALIDATION_REPORT.md
```

---

## 🎯 Common Tasks

### Task: "I need to add a link to an article"
```bash
# Find the correct slug
grep -i "article-topic" docs/claude-reference/LINK_INVENTORY.md
```

### Task: "What tags should I use?"
```bash
# View most common tags
head -30 docs/claude-reference/TAG_MATRIX.md
```

### Task: "Has this topic been covered?"
```bash
# Search existing content
grep -i "topic-keyword" docs/claude-reference/CONTENT_SUMMARY.md
```

### Task: "Does a glossary term exist?"
```bash
# Search glossary
grep -i "term-name" docs/claude-reference/GLOSSARY_TERMS.md
```

---

## 🚨 Troubleshooting

### Problem: Scripts won't run
```bash
# Check Node version (needs 18+)
node --version

# Check if tsx is available
npx tsx --version

# Try with explicit npx
npx --yes tsx scripts/generate-claude-reference.ts
```

### Problem: "Cannot find module 'gray-matter'"
```bash
# Install dependency
cd /Users/dustinmatlock/Documents/GitHub/soranauts
pnpm add -D -w gray-matter
```

### Problem: Reference files are empty
```bash
# Check if content directories exist
ls apps/web/src/content/post/
ls apps/web/src/content/glossary/

# Regenerate with verbose output
npx tsx scripts/generate-claude-reference.ts
```

### Problem: Validation report shows many broken links
```bash
# View the report
cat docs/claude-reference/VALIDATION_REPORT.md

# Check if it's a false positive (dynamic routes)
# Most broken links should be assets or external URLs
```

---

## 📅 Maintenance Schedule

### Weekly
```bash
# Regenerate reference files
cd /Users/dustinmatlock/Documents/GitHub/soranauts
npx tsx scripts/generate-claude-reference.ts
npx tsx scripts/validate-links.ts
```

### After Content Changes
```bash
# Quick regeneration after adding posts
npx tsx scripts/generate-claude-reference.ts
```

### Before Major Edits
```bash
# Full validation before editing session
npx tsx scripts/generate-claude-reference.ts && \
npx tsx scripts/validate-links.ts && \
cat docs/claude-reference/VALIDATION_REPORT.md
```

---

## 🔗 Related Commands

### Build the Site
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts
pnpm build
```

### Run Dev Server
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts
pnpm dev
```

### Check for Linting Errors
```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts
pnpm lint
```

---

**Quick Copy-Paste Commands:**

```bash
# Full regeneration (most common)
cd /Users/dustinmatlock/Documents/GitHub/soranauts && npx tsx scripts/generate-claude-reference.ts && npx tsx scripts/validate-links.ts

# View validation results
cat /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference/VALIDATION_REPORT.md

# Check file ages
ls -lt /Users/dustinmatlock/Documents/GitHub/soranauts/docs/claude-reference/*.md
```

---

*Last Updated: 2025-12-12*

