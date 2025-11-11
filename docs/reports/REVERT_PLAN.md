# Revert Plan for Glossary UI Improvements

## Branch: `feature/glossary-ui-improvements`
## Date: 2025-01-11

---

## Quick Revert Commands

### Option 1: Revert Entire Feature Branch (Recommended)

If you need to completely revert all changes from this feature branch:

```bash
# On main branch
git checkout main
git reset --hard origin/main
```

### Option 2: Revert Specific Commits

If you need to revert specific commits:

```bash
# View commit history
git log --oneline feature/glossary-ui-improvements

# Revert a specific commit
git revert <commit-hash>
```

### Option 3: Create Rollback Branch

Create a backup branch before merging:

```bash
# Create backup branch from current state
git checkout feature/glossary-ui-improvements
git checkout -b feature/glossary-ui-improvements-backup

# Then proceed with merge to main
git checkout main
git merge feature/glossary-ui-improvements
```

---

## Key Changes Made (For Reference)

### Files Modified

1. **Design Tokens**
   - `DESIGN-TOKENS.md` - Added category color tokens
   - `apps/web/src/assets/styles/tokens.css` - Added CSS variables

2. **Glossary Components**
   - `apps/web/src/components/glossary/GlossaryScripts.astro` - V2 popover with keyboard support
   - `apps/web/src/components/glossary/GlossarySearchShell.astro` - Removed sticky behavior
   - `apps/web/src/components/tag-hub/TagFilters.tsx` - Removed sticky, added debounce

3. **Styles**
   - `apps/web/src/assets/styles/glossary.css` - Token usage, focus styles, link types
   - `apps/web/src/assets/styles/components/glossary.css` - Removed sticky positioning
   - `apps/web/src/assets/styles/components/tag.css` - Removed sticky positioning
   - `apps/web/src/assets/styles/glossary-popover.css` - Touch target improvements
   - `apps/web/src/assets/styles/utilities.css` - Added sr-only class

4. **Core Logic**
   - `apps/web/src/utils/glossary-auto-link.mjs` - V2 default, MAX_LINKS enforcement, data-link-type
   - `apps/web/src/layouts/BlogPostLayout.astro` - Removed legacy tooltip code

5. **Configuration**
   - All files with `GLOSSARY_V2` checks now default to `!== 'false'`

---

## Feature Flags

### GLOSSARY_V2 Environment Variable

**Current Behavior:** Defaults to `true` (V2 mode enabled)

**To Disable V2 Mode:**
```bash
# In .env or environment config
GLOSSARY_V2=false
```

**Revert to Legacy Mode:**
1. Set `GLOSSARY_V2=false` in environment
2. Restore legacy tooltip code from git history if needed:
   ```bash
   git show <previous-commit>:apps/web/src/layouts/BlogPostLayout.astro > legacy-tooltip.astro
   ```

---

## Rollback Scenarios

### Scenario 1: V2 Popover Issues

**Symptoms:** Popover not working, keyboard navigation broken

**Quick Fix:**
```bash
# Disable V2 mode temporarily
export GLOSSARY_V2=false
# Or set in .env file
```

**Full Revert:**
```bash
git checkout main
git reset --hard origin/main
```

### Scenario 2: Sticky Search Removal Causing Issues

**Symptoms:** Users complaining about search not being accessible

**Quick Fix:** Restore sticky positioning:
```css
/* In apps/web/src/assets/styles/components/glossary.css */
.glossary-search-shell {
  position: sticky;
  top: var(--space-20);
  z-index: 10;
  /* ... rest of styles ... */
}
```

### Scenario 3: Design Token Issues

**Symptoms:** Colors not displaying correctly

**Quick Fix:** Check if tokens are defined:
```bash
# Verify tokens.css is loaded
grep -r "color-category-token" apps/web/src/assets/styles/tokens.css
```

**Full Revert:** Restore hardcoded hex values from git history

### Scenario 4: MAX_LINKS_PER_ARTICLE Causing Issues

**Symptoms:** Important terms not being linked

**Quick Fix:** Increase limit temporarily:
```javascript
// In apps/web/src/utils/glossary-auto-link.mjs
const MAX_LINKS_PER_ARTICLE = 25; // Increase from 15
```

---

## Testing After Revert

After reverting, verify:

1. ✅ Glossary links work (click, keyboard)
2. ✅ Popover appears and closes correctly
3. ✅ Search functionality works
4. ✅ Colors display correctly
5. ✅ No console errors
6. ✅ Mobile experience acceptable

---

## Git History Reference

To see what was changed:

```bash
# Compare with main
git diff main..feature/glossary-ui-improvements

# See file changes
git diff main..feature/glossary-ui-improvements --stat

# View specific file changes
git diff main..feature/glossary-ui-improvements -- apps/web/src/utils/glossary-auto-link.mjs
```

---

## Emergency Contacts

If issues arise in production:

1. **Immediate:** Revert using Option 1 (reset main to origin/main)
2. **Investigation:** Check git log for specific commit causing issues
3. **Partial Fix:** Use feature flags or targeted reverts

---

## Pre-Merge Checklist

Before merging to main, ensure:

- [ ] All tests pass
- [ ] Manual testing completed
- [ ] Backup branch created
- [ ] Revert plan documented (this file)
- [ ] Feature flags tested
- [ ] Environment variables documented

---

**Last Updated:** 2025-01-11
**Branch:** `feature/glossary-ui-improvements`

