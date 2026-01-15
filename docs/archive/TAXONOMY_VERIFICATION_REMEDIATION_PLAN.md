# Taxonomy Verification and Remediation Plan

## 1) Scope and Objectives

**Objective**: Bring the Soranauts taxonomy system into full compliance with authoritative rules, ensuring canonical tags are the single source of truth, glossary terms map correctly, and article frontmatter adheres to standards.

**Key Compliance Rules**:
- Canonical tags come ONLY from `knowledge_base/meta/tag-suggestion-matrix.md`
- Explorer must show ONLY canonical tags via `isCanonicalTag` filter
- Glossary terms must map 1:1 to canonical tags and carry `status = canonical` or `deprecated`
- Deprecated terms must not appear in article frontmatter
- Articles must use 8–12 tags, lowercase-hyphen, canonical-only
- No manual glossary links; only the auto-linker may generate glossary anchors
- External links must be HTML `<a>` with `target="_blank" rel="noopener noreferrer"`; internal links must be `/slug`
- Images remain wide aspect ratio; do not change paths
- Explorer folder is `tag-hub` (not `explorer`); config lives under `apps/web/src/config/`

**Deliverables**:
- Verified canonical tag list synchronized from matrix
- Glossary alignment audit and remediation
- Article tag normalization (8–12 tags, canonical-only, lowercase-hyphen)
- External link compliance audit
- Three helper scripts with dry-run modes
- Zero-violation validation suite

---

## 2) Snapshot Inventory and Live Diffs

Snapshot extraction:
```bash
TMP=.tmp_taxonomy_snapshot && rm -rf "$TMP" && unzip -q /mnt/data/taxonomy_snapshot.zip -d "$TMP"
```

Diff the critical files:
```bash
git --no-pager diff --no-index "$TMP/apps/web/src/config/tag-hub.config.ts" apps/web/src/config/tag-hub.config.ts || true
git --no-pager diff --no-index "$TMP/apps/web/src/config/glossary.config.ts" apps/web/src/config/glossary.config.ts || true
git --no-pager diff --no-index "$TMP/knowledge_base/meta/tag-suggestion-matrix.md" knowledge_base/meta/tag-suggestion-matrix.md || true
git --no-pager diff --no-index "$TMP/apps/web/src/pages/explore.astro" apps/web/src/pages/explore.astro || true
```

Confirm actual structure:
- Explorer components live under `apps/web/src/components/tag-hub/`
- No legacy `explorer/` folder
- Config lives under `apps/web/src/config/`

**Current State Verification**:
- ✅ Explorer folder confirmed as `tag-hub` (`apps/web/src/components/tag-hub/`)
- ✅ Config files in `apps/web/src/config/` (tag-hub.config.ts, glossary.config.ts)
- ✅ `isCanonicalTag` function exists in `apps/web/src/config/tag-hub.config.ts`
- ✅ Explorer page uses `getAllTagHubViewModels()` which filters via `isCanonicalTag`

---

## 3) Canonical Tag Source-of-Truth Verification

**Source File**: `knowledge_base/meta/tag-suggestion-matrix.md`

**Current Matrix Tags** (from reading): 52 tags across 6 domains:
- Core Protocols: sora, iroha, iroha3, hyperledger, substrate, xor, val, pswap
- Tokenomics: kensetsu, kusd, tbcd, bonding-curve, elastic-supply, real-world-assets, tokenomics, stablecoin
- Governance: parliament, governance, council, voting, proposal, referendum
- Infrastructure: bridges, hashi, cross-chain, interoperability, parachain
- Products & Ecosystem: polkaswap, sora-card, fearless-wallet, marketplace, explorer, tonswap, dex, wallet
- Concepts & Research: defi, decentralization, liquidity, economics, roadmap, staking, validator, blockchain, tokenization

**Current CANONICAL_TAGS in `tag-hub.config.ts`**: 82 tags (needs verification)

**Verification Steps**:
1. Parse `tag-suggestion-matrix.md` table rows, extract Tag column values
2. Normalize all tags to lowercase-hyphen format (already lowercase in matrix)
3. Compare against `CANONICAL_TAGS` array in `apps/web/src/config/tag-hub.config.ts`
4. Generate report:
   - Tags in matrix but missing from CANONICAL_TAGS (additions needed)
   - Tags in CANONICAL_TAGS but missing from matrix (removals needed)
   - Case/format mismatches

**Expected Issues**:
- CANONICAL_TAGS may contain tags not in matrix → need removal
- Some tags may have different casing or hyphenation
- Quick paths in `tagHubQuickPaths` may reference non-canonical tags

**Validation Command**:
```bash
rg -n "CANONICAL_TAGS" apps/web/src/config/tag-hub.config.ts
rg -n "tag-suggestion-matrix" apps/web/src/config/tag-hub.config.ts
```

---

## 4) Glossary Alignment and Deprecations

**Source files**:
- `apps/web/src/config/glossary.config.ts` (canonical term handling)
- `knowledge_base/meta/tag-suggestion-matrix.md` (canonical tags)

**Verification**:
- Every canonical tag from the matrix must have a glossary entry.
- Each glossary entry must include `status: "canonical" | "deprecated"`.
- Articles must not use deprecated tags.

**Verification Steps**:
1. Extract all canonical tags from matrix (Section 3 output)
2. For each canonical tag, check if a glossary entry exists:
   - Check glossary config for matching slug
   - Verify `status` field is `canonical` or `deprecated`
   - If missing status, check `CANONICAL_TERM_SLUGS` in `glossary.config.ts`
3. Map deprecated terms:
   - Find all glossary entries with `status: "deprecated"`
   - Scan article frontmatter for deprecated tags
   - Generate violation report

**Expected Issues**:
- Some canonical tags may not have glossary entries
- Some glossary entries may be missing `status` field
- Deprecated terms may appear in article frontmatter
- `CANONICAL_TERM_SLUGS` in `glossary.config.ts` may not match matrix tags

**Validation Commands**:
```bash
rg -n "status.*deprecated" apps/web/src/config/glossary.config.ts
rg -n "^tags:" -g "apps/web/src/content/post/**/*.mdx" | head -20
```

**Remediation Requirements**:
- Ensure every canonical tag has a corresponding glossary entry
- Set `status: "canonical"` for all active canonical tags
- Set `status: "deprecated"` for removed tags
- Remove deprecated tags from all article frontmatter

---

## 5) Explorer Filter and UI Verification

**Source Files**:
- `apps/web/src/pages/explore.astro`
- `apps/web/src/lib/tag-hub.ts`
- `apps/web/src/components/tag-hub/TagFilters.tsx`
- `apps/web/src/config/tag-hub.config.ts`

**Verification Steps**:
1. Confirm `getAllTagHubViewModels()` filters via `isCanonicalTag`:
   - Check `apps/web/src/lib/tag-hub.ts:168` → `.filter((node) => node.type === 'tag' && isCanonicalTag(node.slug))`
2. Verify `TagFilters.tsx` receives only canonical tags:
   - Check props passed from `explore.astro` → `islandTags` derived from `tags`
   - `tags` comes from `getAllTagHubViewModels()` which filters canonical
3. Verify quick paths reference only canonical tags:
   - Check `tagHubQuickPaths` in `tag-hub.config.ts`
   - Validate each `tags` array contains only canonical slugs
4. Check for any hardcoded non-canonical tag references:
   - Search for tag slugs not in CANONICAL_TAGS

**Validation Commands**:
```bash
rg -n "isCanonicalTag" apps/web/src/pages/explore.astro apps/web/src/components/tag-hub apps/web/src/lib/tag-hub.ts
rg -n "getAllTagHubViewModels" apps/web/src
rg -n "tagHubQuickPaths" apps/web/src/config/tag-hub.config.ts
```

**Expected Compliance**:
- ✅ `isCanonicalTag` is used in `getAllTagHubViewModels()` (verified)
- ⚠️ Quick paths may reference non-canonical tags if CANONICAL_TAGS is out of sync
- ⚠️ TagFilters component should not render deprecated tags (needs verification)

---

## 6) Article Tag Normalization Audit

**Source**: `apps/web/src/content/post/**/*.mdx` (48 files found)

**Audit Rules**:
- Tag count: 8–12 tags per article
- Format: lowercase-hyphen (e.g., `sora-parliament`, not `SORA Parliament`)
- Canonical-only: all tags must be in CANONICAL_TAGS
- No deprecated tags

**Scan Commands**:
```bash
# Count tags per article
rg -n "^tags:" -g "apps/web/src/content/post/**/*.mdx" -A 15

# Extract all unique tags
rg -o "^\s+-\s+(.+)$" -g "apps/web/src/content/post/**/*.mdx" | sort -u

# Check for non-lowercase tags
rg -n "^\s+-\s+[A-Z]" -g "apps/web/src/content/post/**/*.mdx"
```

**Violation Detection Script Logic**:
1. Parse each MDX frontmatter (YAML section)
2. Extract `tags` array
3. For each article, check:
   - Tag count: `tags.length >= 8 && tags.length <= 12`
   - Format: `tag.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)`
   - Canonical: `isCanonicalTag(tag)` or `CANONICAL_TAGS.includes(tag)`
   - Deprecated: tag not in deprecated glossary terms list
4. Generate violation table:
   ```
   File | Issue | Details
   ---- | ----- | -------
   article.mdx | Too few tags | Only 5 tags (need 8-12)
   article.mdx | Non-canonical | Tags: ["old-tag", "deprecated-tag"]
   article.mdx | Invalid format | Tag: "SORA Parliament" (should be "sora-parliament")
   ```

**Expected Issues**:
- Some articles may have < 8 or > 12 tags
- Some tags may use Title Case or spaces instead of lowercase-hyphen
- Some tags may reference deprecated or non-canonical terms
- Tag normalization may be inconsistent

---

## 7) External Link Whitelist Audit

**Source**: `apps/web/src/content/post/**/*.mdx`

**Compliance Rules**:
- External links must use HTML `<a>` tags (not markdown `[text](url)`)
- Must include `target="_blank" rel="noopener noreferrer"`
- Internal links must use `/slug` format (not full URLs)
- Links should be to whitelisted domains (if whitelist exists)

**Scan Commands**:
```bash
# Find external HTTP/HTTPS links
rg -n "href=\"http" apps/web/src/content/post -g '*.mdx'

# Find markdown-style external links
rg -n "\[.*\]\(https?://" apps/web/src/content/post -g '*.mdx'

# Find links missing target/rel
rg -n '<a href="https?://[^"]*"[^>]*(?!target=)' apps/web/src/content/post -g '*.mdx'
```

**Whitelist Domains** (to be defined):
- `sora.org`, `wiki.sora.org`
- `soramitsu.co.jp`
- `polkadot.network`, `kusama.network`
- `docs.iroha.tech`
- `polkaswap.io`, `tonswap.com`
- Other trusted SORA ecosystem domains

**Violation Detection**:
1. Scan all MDX files for link patterns
2. Identify:
   - Markdown links to external URLs → should be HTML `<a>`
   - HTML `<a>` without `target="_blank" rel="noopener noreferrer"`
   - Links to non-whitelisted domains (if whitelist enforced)
   - Internal links using full URLs instead of `/slug`

**Expected Issues**:
- Some articles may use markdown `[text](https://...)` for external links
- Some HTML links may be missing `target` or `rel` attributes
- Internal links may use full `https://soranauts.com/...` instead of `/...`

**Sample Valid External Link**:
```html
<a href="https://sora.org" target="_blank" rel="noopener noreferrer">SORA</a>
```

**Sample Valid Internal Link**:
```markdown
[Understanding XOR](/sora-xor-token-supply-explained)
```

---

## 8) Risks and Edge Cases

**Pitfalls Identified**:

1. **Auto-linker Inside `<details>` Elements**
   - Glossary auto-linker may generate anchors inside `<details>` that break expand/collapse
   - **Mitigation**: Add `data-no-glossary` attribute to `<details>` elements

2. **Stale JSON Artifacts**
   - Generated taxonomy files may contain non-canonical tags
   - **Mitigation**: Verify generated files filter via `isCanonicalTag` or regenerate

3. **Uncommitted Branch Edits**
   - Working branch may have uncommitted taxonomy changes
   - **Mitigation**: Create feature branch, commit checkpoint before remediation

4. **Cache or Build Quirks**
   - Astro build cache may retain old taxonomy data
   - **Mitigation**: Clear `.astro` cache, rebuild from scratch

5. **Quick Path Tag References**
   - `tagHubQuickPaths` may reference tags removed from CANONICAL_TAGS
   - **Mitigation**: Validate quick paths after canonical tag sync

6. **Glossary Status Field Missing**
   - Some glossary entries may lack `status` field
   - Falls back to `CANONICAL_TERM_SLUGS` whitelist
   - **Mitigation**: Ensure all canonical tags have explicit `status: "canonical"`

7. **Tag Normalization Edge Cases**
   - Tags with special characters, numbers, or multiple hyphens
   - **Mitigation**: Use consistent `cleanSlug()` normalization function

8. **Article Frontmatter Parsing**
   - YAML frontmatter may have inconsistent formatting
   - **Mitigation**: Use robust YAML parser (gray-matter or js-yaml)

9. **Case Sensitivity**
   - Tag matching must be case-insensitive but stored lowercase
   - **Mitigation**: Normalize all tags to lowercase before comparison

10. **Deprecated Tag Migration**
    - Articles using deprecated tags need replacement suggestions
    - **Mitigation**: Generate migration map (deprecated → canonical)

---

## 9) Remediation Actions (Deterministic, Step-by-Step)

### Phase 1: Create Helper Scripts

**Script 1: `apps/web/scripts/update-canonical-tags.ts`**
- Purpose: Regenerate `CANONICAL_TAGS` array from `tag-suggestion-matrix.md`
- Input: `knowledge_base/meta/tag-suggestion-matrix.md`
- Output: Updated `apps/web/src/config/tag-hub.config.ts` (CANONICAL_TAGS section only)
- Dry-run mode: `--dry-run` flag prints changes without writing
- Logic:
  1. Parse markdown table, extract Tag column
  2. Normalize to lowercase-hyphen
  3. Sort alphabetically
  4. Generate new CANONICAL_TAGS array
  5. Replace array in tag-hub.config.ts (preserve other content)

**Script 2: `apps/web/scripts/taxonomy-consistency-report.ts`**
- Purpose: Cross-check canonical tags vs glossary vs articles
- Output: JSON/table report of inconsistencies
- Checks:
  - Canonical tags missing from glossary
  - Glossary entries missing status
  - Deprecated tags in article frontmatter
  - Non-canonical tags in articles
  - Quick paths referencing non-canonical tags
- Dry-run mode: Report only, no fixes

**Script 3: `apps/web/scripts/update-article-tags.ts`**
- Purpose: Normalize article frontmatter tags
- Input: `apps/web/src/content/post/**/*.mdx`
- Output: Updated MDX files with normalized tags
- Actions:
  - Normalize to lowercase-hyphen
  - Remove non-canonical tags (with warning)
  - Remove deprecated tags (with warning)
  - Adjust count to 8–12 (add related tags if < 8, remove least relevant if > 12)
- Dry-run mode: `--dry-run` prints changes without writing

### Phase 2: Add Package.json Scripts

Add to `apps/web/package.json`:
```json
{
  "scripts": {
    "update:canonical-tags": "tsx apps/web/scripts/update-canonical-tags.ts",
    "taxonomy:consistency": "tsx apps/web/scripts/taxonomy-consistency-report.ts",
    "taxonomy:update-articles": "tsx apps/web/scripts/update-article-tags.ts"
  }
}
```

### Phase 3: Dry-Run Sequence

```bash
# 1. Check current state
pnpm taxonomy:consistency

# 2. Preview canonical tag updates
pnpm update:canonical-tags --dry-run

# 3. Preview article tag updates
pnpm taxonomy:update-articles --dry-run
```

### Phase 4: Apply Changes

```bash
# 1. Create feature branch
git checkout -b taxonomy/remediation-$(date +%Y%m%d)

# 2. Update canonical tags
pnpm update:canonical-tags

# 3. Verify quick paths still valid
pnpm taxonomy:consistency

# 4. Update article tags (interactive mode recommended)
pnpm taxonomy:update-articles

# 5. Fix external links manually (or create script)
# (External link fixes may require manual review)

# 6. Verify glossary alignment
# (Update glossary config status fields as needed)

# 7. Run full validation
pnpm taxonomy:consistency
pnpm web:taxonomy:validate
pnpm typecheck
```

### Phase 5: Commit

```bash
git add apps/web/src/config/tag-hub.config.ts
git add apps/web/src/content/post/
git add apps/web/scripts/
git add apps/web/package.json
git commit -m "taxonomy: sync canonical tags from matrix, normalize article tags

- Regenerate CANONICAL_TAGS from tag-suggestion-matrix.md (52 canonical tags)
- Remove non-canonical tags from CANONICAL_TAGS array
- Normalize article frontmatter tags (8-12 tags, lowercase-hyphen, canonical-only)
- Remove deprecated tags from articles
- Add taxonomy consistency scripts with dry-run modes
- Verify explorer filters via isCanonicalTag
- Update quick paths to reference only canonical tags"
```

---

## 10) Validation and QA

### Validation Commands

```bash
# 1. Re-diff canonical tags
pnpm update:canonical-tags --dry-run | diff -u - <(cat apps/web/src/config/tag-hub.config.ts | grep -A 100 "CANONICAL_TAGS")

# 2. Re-scan articles
pnpm taxonomy:consistency

# 3. Verify isCanonicalTag usage
rg -n "isCanonicalTag" apps/web/src --type ts --type tsx --type astro

# 4. Check external links
rg -n "href=\"http" apps/web/src/content/post -g '*.mdx' | grep -v 'target="_blank" rel="noopener noreferrer"'

# 5. Web build
pnpm build

# 6. Type check
pnpm typecheck

# 7. Taxonomy validation
pnpm web:taxonomy:validate
```

### Acceptance Criteria

**Zero-Violation Checklist**:
- ✅ All tags in CANONICAL_TAGS exist in tag-suggestion-matrix.md
- ✅ All tags in tag-suggestion-matrix.md exist in CANONICAL_TAGS
- ✅ All glossary entries for canonical tags have `status: "canonical"`
- ✅ No deprecated tags in article frontmatter
- ✅ All articles have 8–12 tags
- ✅ All article tags are lowercase-hyphen format
- ✅ All article tags are canonical (pass `isCanonicalTag`)
- ✅ All external links use HTML `<a>` with `target="_blank" rel="noopener noreferrer"`
- ✅ All internal links use `/slug` format
- ✅ Explorer page shows only canonical tags (verified via `isCanonicalTag` filter)
- ✅ Quick paths reference only canonical tags
- ✅ Build succeeds without errors
- ✅ Type check passes

**Manual QA Steps**:
1. Visit `/explore` page, verify only canonical tags displayed
2. Check tag pages (`/tag/sora`, etc.) render correctly
3. Verify glossary auto-linking works in articles
4. Test external links open in new tab with correct rel
5. Verify article tag counts are 8–12

---

## 11) Rollback Strategy

### Feature Branch Boundary

```bash
# Before starting remediation
git checkout -b taxonomy/remediation-$(date +%Y%m%d)
git push -u origin taxonomy/remediation-$(date +%Y%m%d)
```

### Stash Checkpoint

```bash
# Create backup branch
git checkout -b taxonomy/backup-$(date +%Y%m%d)
git checkout taxonomy/remediation-$(date +%Y%m%d)

# Stash uncommitted changes if any
git stash push -m "pre-remediation checkpoint"
```

### Hard Reset Instructions

If remediation causes issues:

```bash
# Option 1: Reset to branch start
git reset --hard origin/taxonomy/remediation-$(date +%Y%m%d)

# Option 2: Reset to main/master
git reset --hard origin/main  # or origin/master

# Option 3: Restore from backup branch
git checkout taxonomy/backup-$(date +%Y%m%d)
git checkout -b taxonomy/remediation-restored
```

### File-Level Rollback

If only specific files need rollback:

```bash
# Restore single file from main
git checkout origin/main -- apps/web/src/config/tag-hub.config.ts

# Restore all MDX files
git checkout origin/main -- apps/web/src/content/post/
```

### Verification After Rollback

```bash
# Verify clean state
git status
pnpm build
pnpm typecheck
```

---

## 12) Timeboxed Execution Timeline

- **Inventory & diffs**: 10–15 min
- **Canonical vs matrix checks**: 10–15 min
- **Glossary alignment scan**: 10–15 min
- **Article tag audit**: 15–30 min
- **Build + validate**: 10–15 min
- **If scripts are needed**: add 20–40 min per script (dry-run first)

**Target**: ~45–120 minutes for verification + basic remediation.

---

## Appendix: Example Script Structure

### update-canonical-tags.ts (pseudo-code)

```typescript
import fs from 'fs';
import path from 'path';
import { parse } from 'gray-matter';

const DRY_RUN = process.argv.includes('--dry-run');

function extractTagsFromMatrix(matrixPath: string): string[] {
  // Parse markdown table, extract Tag column
  // Normalize to lowercase-hyphen
  // Return sorted array
}

function updateTagHubConfig(configPath: string, newTags: string[]): void {
  // Read config file
  // Replace CANONICAL_TAGS array (preserve other content)
  // Write back if not dry-run
}

const matrixPath = 'knowledge_base/meta/tag-suggestion-matrix.md';
const configPath = 'apps/web/src/config/tag-hub.config.ts';

const canonicalTags = extractTagsFromMatrix(matrixPath);
console.log(`Found ${canonicalTags.length} canonical tags`);

if (DRY_RUN) {
  console.log('Dry-run mode: would update CANONICAL_TAGS to:', canonicalTags);
} else {
  updateTagHubConfig(configPath, canonicalTags);
  console.log('Updated CANONICAL_TAGS');
}
```
