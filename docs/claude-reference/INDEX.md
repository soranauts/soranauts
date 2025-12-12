# Claude Reference Files - Quick Index

> **Generated:** 2025-12-12  
> **Purpose:** Quick reference index for AI assistant article editing sessions

---

## 📁 Files in This Directory

| File | Purpose | Key Stats |
|------|---------|-----------|
| **README.md** | Main documentation and usage guide | How to use all reference files |
| **LINK_INVENTORY.md** | All valid internal links | 49 blog posts, 179 glossary terms |
| **CONTENT_SUMMARY.md** | Blog article metadata | Word counts, tags, links |
| **TAG_MATRIX.md** | Tag inventory and usage | All unique tags with frequencies |
| **GLOSSARY_TERMS.md** | Complete glossary reference | 179 terms by category |
| **SITE_STRUCTURE.md** | Overall site architecture | Navigation, content types, tech stack |
| **VALIDATION_REPORT.md** | Link validation results | Broken links, orphan content |
| **INDEX.md** | This file | Quick overview |

---

## 🎯 Common Tasks

### "I need to verify a link exists"
→ Open **LINK_INVENTORY.md** and search for the slug

### "What tags should I use?"
→ Open **TAG_MATRIX.md** to see commonly used tags

### "Has this topic been covered?"
→ Open **CONTENT_SUMMARY.md** and search for keywords

### "Does a glossary term exist for X?"
→ Open **GLOSSARY_TERMS.md** and search

### "Where does content go?"
→ Open **SITE_STRUCTURE.md** for file locations

### "Are there any broken links?"
→ Open **VALIDATION_REPORT.md** for current issues

---

## 📊 Current Site Statistics

- **Blog Posts:** 49
- **Glossary Terms:** 179
- **Broken Links:** 2 (see VALIDATION_REPORT.md)
- **Orphan Articles:** 15 (see VALIDATION_REPORT.md)

---

## 🔄 Update Commands

```bash
# Regenerate all reference files
cd /Users/dustinmatlock/Documents/GitHub/soranauts
npx tsx scripts/generate-claude-reference.ts
npx tsx scripts/validate-links.ts
```

---

## 🚦 Health Status

| Check | Status | Details |
|-------|--------|---------|
| Reference files generated | ✅ | 2025-12-12 |
| Link validation run | ✅ | 2025-12-12 |
| Broken links | ⚠️ | 2 found (assets, not articles) |
| Orphan content | ⚠️ | 15 articles need incoming links |
| Overall status | ✅ | Healthy with minor issues |

---

## 📝 For Claude/AI Assistants

When editing articles:

1. ✅ Always verify links in LINK_INVENTORY.md
2. ✅ Use established tags from TAG_MATRIX.md
3. ✅ Check for existing coverage in CONTENT_SUMMARY.md
4. ✅ Link to glossary terms when available
5. ✅ Follow patterns in SITE_STRUCTURE.md

---

## 🔗 Related Files

- `/MASTER_GUARDRAILS.md` - AI behavior rules
- `/CSS_GUARDRAILS.md` - Styling rules
- `/docs/AUTHORING_GUIDE.md` - Writing guidelines
- `/docs/glossary-architecture-explained.md` - System architecture

---

**Last Updated:** 2025-12-12


