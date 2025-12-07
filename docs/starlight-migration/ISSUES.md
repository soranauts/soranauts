# Migration Issues Log

> Track problems, blockers, and their resolutions here.

---

## Active Issues

<!-- Issues currently blocking or affecting work -->

### Issue Template
```
### ISS-XXX: [Brief Title]
**Status:** 🔴 Blocking | 🟡 In Progress | 🟢 Resolved
**Phase:** Week X
**Reported:** [DATE]
**Resolved:** [DATE or N/A]

**Description:**
[What's the problem?]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Error Messages:**
```
[paste any errors]
```

**Attempted Solutions:**
- [ ] Solution 1 - Result
- [ ] Solution 2 - Result

**Resolution:**
[How it was fixed, or workaround]

**Lessons Learned:**
[What to avoid in future]
```

---

## Issue Log

### ISS-001: [Example - Remove this]
**Status:** 🟢 Resolved  
**Phase:** Week 1  
**Reported:** 2025-12-06  
**Resolved:** 2025-12-06

**Description:**
Example issue template - delete this when you have real issues.

**Resolution:**
Deleted the example.

---

<!-- Add new issues below this line -->

---

## Resolved Issues Archive

<!-- Move resolved issues here to keep Active section clean -->

---

## Common Problems & Solutions

### Starlight Configuration

**Problem:** Starlight routes conflict with existing routes
```
Solution: Ensure Starlight is configured with explicit base path
and existing routes take precedence in astro.config.mjs
```

**Problem:** Custom components not loading
```
Solution: Check component paths in starlight() config are relative
to project root, not src/
```

### Search Issues

**Problem:** Pagefind not indexing new docs
```
Solution: Run full build (pnpm build), Pagefind runs post-build
Check pagefind config excludes aren't too aggressive
```

**Problem:** GlossarySearchV2 not loading in unified modal
```
Solution: Ensure glossary JSON is generated before search init
Check async loading order
```

### Build Issues

**Problem:** MDX parsing errors
```
Solution: Check for unescaped < > characters in content
Ensure all JSX expressions are properly closed
```

**Problem:** Missing frontmatter fields
```
Solution: Run pnpm docs:validate to identify which files
Use the frontmatter template from MIGRATION_PLAN.md
```

### Content Issues

**Problem:** Glossary links broken
```
Solution: Use format [Term](/glossary/slug) not [Term](/docs/glossary/slug)
Glossary stays at /glossary/*, not under /docs/
```

**Problem:** Images not loading
```
Solution: Place images in public/docs/images/
Reference as /docs/images/filename.png
```

---

## Questions for Opus 4.5 Review

<!-- Questions to bring back to the planning chat -->

1. 

---

## Escalation Notes

<!-- For issues that need external help (Starlight Discord, etc.) -->
