# Glossary Tooltip & Sticky Search Evaluation Report

**Date:** 2025-01-11  
**Scope:** Glossary auto-linking system and sticky search interfaces on `/glossary` and `/explore` pages  
**Status:** Evaluation Complete — Recommendations Ready

---

## Executive Summary

This evaluation examines two critical UX systems in Soranauts: (1) the glossary auto-linking system that injects educational tooltips into article content, and (2) the sticky search interfaces on glossary and explore pages. Both systems are functional but present opportunities for improved accessibility, visual consistency, and user experience refinement.

### Key Findings

**Glossary Linking System:**
- ✅ **Strengths:** Sophisticated priority-based selection prevents link fatigue; one-per-article limit maintains readability
- ⚠️ **Issues:** Dual implementation modes (V2 vs legacy) create inconsistency; tooltip accessibility gaps; category colors don't align with design tokens
- 📊 **Impact:** Medium — affects educational clarity and accessibility compliance

**Sticky Search:**
- ✅ **Strengths:** Consistent implementation across pages; proper backdrop blur and shadow tokens
- ⚠️ **Issues:** Fixed sticky positioning may feel heavy on smaller screens; no adaptive visibility patterns
- 📊 **Impact:** Low-Medium — visual weight concerns, but functional

### Priority Recommendations

1. **High Priority:** Unify glossary tooltip implementation (consolidate V2/legacy modes)
2. **High Priority:** Improve glossary link accessibility (keyboard navigation, ARIA, screen readers)
3. **Medium Priority:** Align category colors with design token system
4. **Medium Priority:** Implement adaptive sticky search behavior (fade/shrink on scroll)
5. **Low Priority:** Performance optimization for auto-linking plugin

---

## 1. Glossary Linking Analysis

### 1.1 Current Implementation

**Auto-Linking Plugin:** `apps/web/src/utils/glossary-auto-link.mjs`

The system uses a sophisticated four-pass algorithm:

1. **Pattern Building:** Creates regex patterns for all terms/aliases, sorted by priority (highest first) and length (longest first)
2. **Occurrence Collection:** Scans all text nodes, skipping headings, tables, code blocks, and manually linked terms
3. **Best Occurrence Selection:** Scores each occurrence using:
   - Base priority (0-100+)
   - Foundational boost (+20)
   - Early paragraph boost (+10 for first 1/3)
   - Middle paragraph boost (+5 for middle 1/3)
4. **Link Injection:** Creates links with destination hierarchy:
   - Priority ≥90 OR (foundational + priority ≥30): `/glossary/${slug}` (direct page)
   - Priority ≥20: `/glossary#glossary-${slug}` (anchor link)
   - Priority <20: `/glossary#${category}` (category section)

**Key Constants:**
- `MAX_LINKS_PER_ARTICLE = 15` (not enforced in current code)
- `MAX_LINKS_PER_PARAGRAPH = 2` (not enforced)
- `HIGH_PRIORITY_THRESHOLD = 90`

### 1.2 Priority Logic Evaluation

**Strengths:**
- ✅ Intelligent distribution prevents clustering in early paragraphs
- ✅ Foundational terms get appropriate emphasis
- ✅ One-per-article limit prevents link fatigue
- ✅ Manual link detection prevents double-linking

**Concerns:**
- ⚠️ `MAX_LINKS_PER_ARTICLE` constant exists but isn't enforced — could lead to excessive linking
- ⚠️ Priority thresholds (90, 30, 20) are hardcoded — no documentation of rationale
- ⚠️ Paragraph position scoring may favor longer articles disproportionately

**Recommendation:** Add enforcement of `MAX_LINKS_PER_ARTICLE` limit and document priority threshold rationale.

### 1.3 Link Pattern Consistency

**Three Link Types Identified:**

1. **Tooltip Links (In-Article):**
   - V2 mode: `class="glossary"` with `data-cat`, `data-title`, `data-def`
   - Legacy mode: `class="glossary-term glossary-term-${category}"` with `aria-describedby`
   - Visual: Dotted underline, muted color, hover → brand red

2. **Tag/Category Links (Cards):**
   - Used in glossary cards, related content sections
   - Category-specific colors (hardcoded hex values)
   - Direct navigation to category sections

3. **Full-Page Links:**
   - High-priority terms link to `/glossary/${slug}`
   - Used for foundational or very high-priority terms

**Issue:** Visual differentiation between link types is inconsistent. Category colors use hardcoded hex values instead of design tokens.

**Files Affected:**
- `apps/web/src/assets/styles/glossary.css` (lines 36-106) — hardcoded category colors
- `apps/web/src/utils/glossary-auto-link.mjs` (lines 350-364) — dual mode implementation

### 1.4 Tooltip UX Evaluation

**V2 Mode (GLOSSARY_V2=true):**
- **Implementation:** CSS + JavaScript popover system
- **Component:** `apps/web/src/components/glossary/GlossaryScripts.astro`
- **Styles:** `apps/web/src/assets/styles/glossary-popover.css`
- **Behavior:** Click to open, fixed positioning, mobile sheet mode
- **Accessibility:** 
  - ✅ ARIA dialog with `aria-hidden`, `aria-labelledby`
  - ✅ Keyboard: Escape to close, focus management
  - ⚠️ Missing: Keyboard navigation to open (Enter/Space on link)
  - ⚠️ Missing: Focus trap within popover

**Legacy Mode (GLOSSARY_V2=false):**
- **Implementation:** JavaScript click/keyboard handlers
- **Component:** `apps/web/src/layouts/BlogPostLayout.astro` (lines 167-215)
- **Styles:** `apps/web/src/assets/styles/glossary.css` (lines 149-203)
- **Behavior:** Click/Enter to show, auto-hide after 8 seconds
- **Accessibility:**
  - ✅ Keyboard: Enter to open, Escape to close
  - ⚠️ Missing: ARIA attributes (relies on `aria-describedby` but no proper tooltip role)
  - ⚠️ Missing: Screen reader announcements

**Mobile Behavior:**
- V2: Sheet mode (bottom of viewport) on screens <640px
- Legacy: Fixed positioning at bottom (lines 191-203 in glossary.css)
- Both: Appropriate mobile adaptations

**Tooltip Content:**
- Definition truncated to 240 characters (V2) or full definition (legacy)
- V2 includes "Open full entry" CTA
- Legacy shows definition only

**Recommendation:** Consolidate to V2 mode as default, add keyboard open support, improve ARIA.

### 1.5 Cognitive Load Assessment

**Link Density Analysis:**
- Current system: One link per term per article (good)
- No per-paragraph limit enforcement (potential issue)
- Priority-based selection naturally limits high-density scenarios

**Visual Clutter:**
- Category colors help differentiate but use non-token colors
- Dotted underline is subtle and appropriate
- Hover states are clear but may be missed by keyboard users

**Educational Value:**
- ✅ Prioritizes foundational terms appropriately
- ✅ Even distribution prevents early-article bias
- ⚠️ Low-priority terms link to category sections (less educational value)

**Recommendation:** Consider adding visual indicator for link destination type (tooltip vs. full page).

---

## 2. Sticky Search Analysis

### 2.1 Current Implementation

**Glossary Page (`/glossary`):**
- **Component:** `GlossarySearchShell.astro` wrapping `GlossarySearchV2.tsx`
- **CSS:** `.glossary-search-shell` in `apps/web/src/assets/styles/components/glossary.css`
- **Sticky:** `position: sticky; top: var(--space-20);` (5rem / 80px)
- **Responsive:** `top: var(--space-24);` (6rem / 96px) on md+ breakpoints

**Explore Page (`/explore`):**
- **Component:** `TagFilters.tsx` with `.tag-hub-controls__inner`
- **CSS:** `apps/web/src/assets/styles/components/tag.css` (lines 160-176)
- **Sticky:** `position: sticky; top: var(--space-20);` (same as glossary)
- **Responsive:** `top: var(--space-24);` on md+ breakpoints

**Shared Styling:**
- `backdrop-filter: blur(18px)` — glassmorphism effect
- `box-shadow: var(--shadow-elevated)` — consistent elevation
- `background: color-mix(in srgb, var(--color-surface) 96%, var(--color-surface-soft) 4%)`
- `border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent)`
- `z-index: 10` — appropriate layering

### 2.2 Visual Weight Analysis

**Dimensions:**
- Glossary: Padding `var(--space-6)` (1.5rem), border-radius `var(--radius-3xl)` (1.5rem)
- Explore: Similar padding and border-radius
- Both: Max-width constraints (120ch glossary, 100ch explore)

**Visual Prominence:**
- ✅ Proper use of design tokens for background, border, shadow
- ✅ Backdrop blur creates appropriate depth
- ⚠️ Fixed sticky positioning means search is always visible — may feel heavy during long scrolls
- ⚠️ No visual feedback when search becomes sticky (no transition/animation)

**Design Token Compliance:**
- ✅ Uses `var(--shadow-elevated)` correctly
- ✅ Uses `var(--color-surface)`, `var(--color-border)` tokens
- ✅ Uses spacing tokens (`var(--space-20)`, `var(--space-24)`)
- ✅ Backdrop blur is appropriate for glassmorphism

### 2.3 Scroll Behavior Assessment

**Current Behavior:**
- Search becomes sticky immediately when scrolling past initial position
- No fade, shrink, or adaptive visibility
- Always maintains full height and opacity

**User Experience:**
- ✅ Search remains accessible during scroll (good for long pages)
- ⚠️ May feel visually heavy, especially on smaller screens
- ⚠️ No indication that search is "stuck" vs. in normal flow

**Performance:**
- `backdrop-filter: blur(18px)` can cause performance issues on lower-end devices
- No `will-change` or GPU acceleration hints
- Sticky positioning is generally performant

**Recommendation:** Consider adaptive visibility (fade on scroll down, show on scroll up) or compact mode when sticky.

### 2.4 Alternative Behavior Research

**Best Practices from Knowledge Base UX:**
- **GitHub:** Search collapses to icon when scrolling down, expands on scroll up
- **MDN:** Search remains sticky but becomes more compact
- **Stripe Docs:** Search fades slightly when scrolling, brightens on hover/focus
- **Tailwind Docs:** Search stays sticky but adds subtle shadow when stuck

**Recommended Alternatives:**

1. **Adaptive Visibility (Recommended):**
   - Fade out (opacity 0.6) when scrolling down
   - Fade in (opacity 1) when scrolling up or hovering
   - Implementation: Add scroll direction detection, CSS transitions

2. **Compact Mode:**
   - Shrink height when sticky (reduce padding)
   - Show full search on focus/hover
   - Implementation: CSS `:has()` or JavaScript class toggle

3. **Shadow Enhancement:**
   - Add stronger shadow when sticky (indicates "floating" state)
   - Implementation: Add class on scroll, enhance `box-shadow`

4. **Non-Sticky Mobile:**
   - Remove sticky on mobile (<768px) to reduce visual weight
   - Keep search at top of content
   - Implementation: Media query override

**Recommendation:** Implement adaptive visibility (option 1) as it balances accessibility with visual weight.

---

## 3. Accessibility Audit

### 3.1 Keyboard Navigation

**Glossary Links:**
- ✅ V2: Click opens popover (but no keyboard open)
- ✅ Legacy: Enter opens tooltip
- ✅ Both: Escape closes tooltip/popover
- ⚠️ Missing: Tab navigation between glossary links not clearly indicated
- ⚠️ Missing: Focus styles may be insufficient (rely on default browser outline)

**Sticky Search:**
- ✅ Search input is keyboard accessible
- ✅ Category filters are keyboard navigable
- ✅ Results are keyboard navigable (arrow keys in GlossarySearchV2)
- ✅ Focus management is appropriate

**Recommendations:**
- Add keyboard open support for V2 popover (Enter/Space on glossary link)
- Enhance focus styles for glossary links (use `var(--overlay-focus)`)

### 3.2 Screen Reader Support

**Glossary Links:**
- ⚠️ V2: Missing `aria-label` or `aria-describedby` on links
- ⚠️ Legacy: Uses `aria-describedby` but tooltip may not be announced
- ⚠️ Both: No indication that link opens tooltip vs. navigates

**Tooltips/Popovers:**
- ✅ V2: Proper ARIA dialog with `aria-hidden`, `aria-labelledby`
- ⚠️ Legacy: Tooltip uses `hidden` attribute but no ARIA role
- ⚠️ Both: No `aria-live` region for dynamic content

**Search:**
- ✅ Search input has proper labels
- ✅ Results have `role="status"` and `aria-live="polite"`
- ✅ Filter buttons have `aria-pressed` states

**Recommendations:**
- Add `aria-label="Glossary term: [term name]. Click for definition."` to glossary links
- Add `role="tooltip"` to legacy tooltips
- Consider `aria-live="polite"` for tooltip content

### 3.3 Visual Accessibility

**Color Contrast:**
- ✅ Glossary links: Use `var(--color-text-muted)` (good contrast)
- ⚠️ Category colors: Some hardcoded colors may not meet WCAG AA (need verification)
  - Token: `#F97316` (orange) — needs verification
  - Technology: `#E3242D` (matches brand-500) — good
  - Governance: `#7C3AED` (purple) — needs verification
- ✅ Hover states: Use `var(--color-link)` (good contrast)

**Focus Indicators:**
- ⚠️ Glossary links: Rely on default browser outline (may be insufficient)
- ✅ Search inputs: Use `var(--overlay-focus)` for focus ring (good)
- ✅ Buttons: Proper focus styles

**Recommendations:**
- Verify category color contrast ratios (target WCAG AA: 4.5:1 for text)
- Add explicit focus styles for glossary links using `var(--overlay-focus)`
- Consider adding visible focus indicator for keyboard users

---

## 4. Performance Review

### 4.1 Auto-Linking Performance

**Plugin Execution:**
- **Complexity:** O(n × m) where n = text nodes, m = glossary terms
- **Optimization:** Patterns sorted by priority/length (early termination possible)
- **Caching:** No caching of processed articles (reprocesses on each build)

**Potential Issues:**
- Large articles with many paragraphs may slow build time
- Regex patterns are compiled once per build (good)
- No memoization of term lookups

**Recommendations:**
- Consider caching processed AST nodes if build times become an issue
- Monitor build performance for large articles (>50 paragraphs)

### 4.2 Sticky Search Performance

**Scroll Performance:**
- `backdrop-filter: blur(18px)` can cause repaints on scroll
- No `will-change` hints for GPU acceleration
- Sticky positioning is generally performant (handled by browser)

**JavaScript:**
- GlossarySearchV2: Debounced search (120ms) — appropriate
- TagFilters: No debounce on search (could be optimized)
- Event listeners: Properly cleaned up

**Recommendations:**
- Add `will-change: transform` to sticky search containers for GPU acceleration
- Consider reducing blur intensity on mobile (18px → 12px)
- Add debounce to TagFilters search input (150ms)

---

## 5. Design Token Compliance

### 5.1 Current Token Usage

**Glossary Styles:**
- ✅ Uses `var(--color-text-main)`, `var(--color-text-muted)` for text
- ✅ Uses `var(--color-link)`, `var(--color-link-hover)` for links
- ✅ Uses `var(--color-bg-surface)`, `var(--color-border-subtle)` for tooltips
- ⚠️ Category colors use hardcoded hex values instead of tokens

**Sticky Search:**
- ✅ Uses `var(--color-surface)`, `var(--color-border)` correctly
- ✅ Uses `var(--shadow-elevated)` correctly
- ✅ Uses spacing tokens (`var(--space-20)`, `var(--space-24)`)
- ✅ Uses `color-mix()` for semi-transparent backgrounds

### 5.2 Token Violations

**Category Colors (High Priority):**
- Location: `apps/web/src/assets/styles/glossary.css` (lines 36-106)
- Issue: Hardcoded hex values instead of design tokens
- Examples:
  - Token: `#F97316` (should use status/warning token or new category token)
  - Technology: `#E3242D` (matches brand-500, but should use token)
  - Governance: `#7C3AED` (no equivalent token)
  - DeFi: `#15803D` (no equivalent token)
  - Network: `#2563EB` (no equivalent token)
  - Economics: `#BE185D` (no equivalent token)

**Recommendation:** Either:
1. Add category color tokens to `DESIGN-TOKENS.md` and `tokens.css`
2. Use existing status tokens where semantically appropriate
3. Use brand token variations with opacity for consistency

**Shadow Usage:**
- ✅ Consistent use of `var(--shadow-elevated)`
- ✅ No hardcoded shadow values

**Spacing:**
- ✅ Consistent use of spacing tokens
- ✅ Responsive breakpoints use appropriate tokens

### 5.3 Missing Token Opportunities

**Tooltip Shadows:**
- Current: Hardcoded `rgba(15, 23, 42, 0.24)` in glossary.css
- Should use: `var(--shadow-elevated)` or new `--shadow-tooltip` token

**Mobile Tooltip Shadows:**
- Current: Hardcoded `rgba(15, 23, 42, 0.3)` in glossary.css
- Should use: Token-based shadow

**Recommendation:** Create `--shadow-tooltip` token or use existing `--shadow-elevated`.

---

## 6. Recommendations (Prioritized)

### High Priority

#### 6.1 Unify Glossary Tooltip Implementation
**Rationale:** Dual V2/legacy modes create inconsistency, maintenance burden, and accessibility gaps.

**Implementation:**
1. Make V2 mode default (set `GLOSSARY_V2=true` in production)
2. Add keyboard open support to V2 popover:
   - Add `keydown` listener for Enter/Space on glossary links
   - Prevent default navigation, show popover
3. Improve V2 ARIA:
   - Add `aria-label` to glossary links: `"Glossary term: [term]. Click for definition."`
   - Ensure popover announces when opened
4. Remove legacy mode code after migration period

**Files:**
- `apps/web/src/components/glossary/GlossaryScripts.astro` (add keyboard handler)
- `apps/web/src/utils/glossary-auto-link.mjs` (remove legacy mode)
- `apps/web/src/layouts/BlogPostLayout.astro` (remove legacy script)

**Expected Benefit:** Consistent UX, improved accessibility, reduced maintenance.

---

#### 6.2 Improve Glossary Link Accessibility
**Rationale:** Missing keyboard navigation, insufficient focus indicators, and unclear screen reader support.

**Implementation:**
1. Add explicit focus styles:
   ```css
   .glossary-term:focus-visible {
     outline: 2px solid var(--overlay-focus);
     outline-offset: 2px;
   }
   ```
2. Add `aria-label` to all glossary links
3. Add `role="tooltip"` to legacy tooltips (if keeping temporarily)
4. Ensure keyboard open works in V2 mode

**Files:**
- `apps/web/src/assets/styles/glossary.css` (add focus styles)
- `apps/web/src/utils/glossary-auto-link.mjs` (add aria-label)
- `apps/web/src/components/glossary/GlossaryScripts.astro` (keyboard handler)

**Expected Benefit:** WCAG AA compliance, better keyboard navigation, screen reader support.

---

### Medium Priority

#### 6.3 Align Category Colors with Design Tokens
**Rationale:** Hardcoded hex values violate design token system and create maintenance issues.

**Implementation:**
1. Add category color tokens to `DESIGN-TOKENS.md`:
   ```css
   --color-category-token: #F97316;
   --color-category-technology: var(--color-brand-500);
   --color-category-governance: #7C3AED;
   --color-category-defi: #15803D;
   --color-category-network: #2563EB;
   --color-category-economics: #BE185D;
   ```
2. Update `apps/web/src/assets/styles/glossary.css` to use tokens
3. Map tokens in `tailwind.config.cjs` if needed

**Files:**
- `DESIGN-TOKENS.md` (add category tokens)
- `apps/web/src/assets/styles/tokens.css` (add CSS variables)
- `apps/web/src/assets/styles/glossary.css` (replace hex with tokens)

**Expected Benefit:** Design system consistency, easier theme updates, maintainability.

---

#### 6.4 Implement Adaptive Sticky Search Behavior
**Rationale:** Fixed sticky positioning can feel visually heavy; adaptive visibility improves UX.

**Implementation:**
1. Add scroll direction detection:
   ```javascript
   let lastScrollY = 0;
   let scrollDirection = 'up';
   
   window.addEventListener('scroll', () => {
     const currentScrollY = window.scrollY;
     scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
     lastScrollY = currentScrollY;
   });
   ```
2. Add CSS classes for fade states:
   ```css
   .glossary-search-shell.is-scrolling-down {
     opacity: 0.6;
     transition: opacity 200ms ease;
   }
   
   .glossary-search-shell.is-scrolling-up,
   .glossary-search-shell:hover,
   .glossary-search-shell:focus-within {
     opacity: 1;
   }
   ```
3. Apply classes based on scroll direction and interaction

**Files:**
- `apps/web/src/components/glossary/GlossarySearchShell.astro` (add script)
- `apps/web/src/assets/styles/components/glossary.css` (add fade styles)
- `apps/web/src/assets/styles/components/tag.css` (same for explore page)

**Expected Benefit:** Reduced visual weight, improved scroll experience, modern UX pattern.

---

#### 6.5 Enforce Link Density Limits
**Rationale:** Constants exist but aren't enforced; could lead to excessive linking.

**Implementation:**
1. Enforce `MAX_LINKS_PER_ARTICLE` limit in selection logic:
   ```javascript
   // After scoring, sort and take top N
   const sortedOccurrences = Array.from(selectedOccurrences.entries())
     .sort((a, b) => b[1].score - a[1].score)
     .slice(0, MAX_LINKS_PER_ARTICLE);
   ```
2. Add `MAX_LINKS_PER_PARAGRAPH` enforcement if needed
3. Log warning if limit is reached

**Files:**
- `apps/web/src/utils/glossary-auto-link.mjs` (add enforcement)

**Expected Benefit:** Prevents link fatigue, maintains readability, predictable behavior.

---

### Low Priority

#### 6.6 Performance Optimizations
**Rationale:** Minor performance improvements for large articles and mobile devices.

**Implementation:**
1. Add `will-change: transform` to sticky search containers
2. Reduce backdrop blur on mobile (18px → 12px)
3. Add debounce to TagFilters search (150ms)

**Files:**
- `apps/web/src/assets/styles/components/glossary.css`
- `apps/web/src/assets/styles/components/tag.css`
- `apps/web/src/components/tag-hub/TagFilters.tsx`

**Expected Benefit:** Smoother scrolling on lower-end devices, better mobile performance.

---

#### 6.7 Add Visual Link Destination Indicators
**Rationale:** Users may not understand difference between tooltip links and full-page links.

**Implementation:**
1. Add subtle icon or indicator for full-page links (high priority terms)
2. Consider different underline style (solid vs. dotted) for link types
3. Add tooltip hint: "Click for full definition" vs. "Click for quick definition"

**Files:**
- `apps/web/src/utils/glossary-auto-link.mjs` (add data attribute)
- `apps/web/src/assets/styles/glossary.css` (style indicators)

**Expected Benefit:** Clearer user expectations, better educational flow.

---

## 7. Implementation Roadmap

### Phase 1: Critical Fixes (Week 1)
1. Unify glossary tooltip implementation (6.1)
2. Improve glossary link accessibility (6.2)

### Phase 2: Design System Alignment (Week 2)
3. Align category colors with tokens (6.3)
4. Enforce link density limits (6.5)

### Phase 3: UX Enhancements (Week 3)
5. Implement adaptive sticky search (6.4)
6. Add visual link indicators (6.7)

### Phase 4: Performance (Week 4)
7. Performance optimizations (6.6)

---

## 8. Testing Checklist

### Accessibility Testing
- [ ] Keyboard navigation through all glossary links
- [ ] Screen reader announcements for tooltips
- [ ] Focus indicators visible and clear
- [ ] Color contrast ratios meet WCAG AA
- [ ] Mobile touch targets ≥44×44px

### Visual Testing
- [ ] Category colors consistent across pages
- [ ] Sticky search behavior on various screen sizes
- [ ] Tooltip positioning doesn't overflow viewport
- [ ] Dark mode colors appropriate

### Performance Testing
- [ ] Build time acceptable for large articles
- [ ] Scroll performance smooth with backdrop blur
- [ ] Search debounce prevents excessive queries

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## 9. Conclusion

The glossary auto-linking and sticky search systems are well-architected and functional, but present opportunities for improved accessibility, design token alignment, and user experience refinement. The highest-impact improvements are unifying the tooltip implementation and enhancing accessibility, followed by design system consistency and adaptive UX patterns.

**Next Steps:**
1. Review and approve recommendations
2. Create implementation tickets for Phase 1
3. Begin with critical accessibility fixes
4. Iterate based on user feedback

---

**Report Generated:** 2025-01-11  
**Evaluated By:** AI Assistant (Cursor)  
**Review Status:** Ready for Team Review

