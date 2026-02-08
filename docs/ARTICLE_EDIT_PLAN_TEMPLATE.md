# ARTICLE_EDIT_PLAN_TEMPLATE.md
# Soranauts — Master Article Edit Plan Template (2025 Edition, Nexus Update)

---

## 1. Purpose & Workflow

This template defines the structure, standards, and verification rules for creating a **full Edit Plan** when updating or modernizing an **existing** Soranauts article.

> **Note:** This template is for EDITING existing content. For creating NEW articles from scratch, use `ARTICLE_CREATION_GUIDE.md` instead.

### Your Task
Create a **FULL Edit Plan** for `<article path>` using *every required section* in this document.

### Inputs Required
- Article MDX path (e.g., `apps/web/src/content/post/sora-ecosystem-explained.mdx`)
- Change scope: `minor` | `targeted` | `full-modernization`
- Notes about: outdated mechanisms, pre-Nexus references, SORA v3/Iroha 3 developments

### Output
A structured **Edit Plan** — **NOT** a rewrite.  
Rewrite instructions appear only *inside* the plan as directives.

---

## 2. Knowledge Base & Source-of-Truth Hierarchy

When verifying or updating technical details, use this authority order (highest → lowest):

| Priority | Source | Use For |
|----------|--------|---------|
| 1 | `knowledge_base/curated/nexus_whitepaper` | SORA Nexus/v3 canonical reference |
| 2 | `knowledge_base/curated/sora_updates` | Recent ecosystem announcements |
| 3 | `knowledge_base/curated/wiki` | SORA Wiki (general reference) |
| 4 | `knowledge_base/curated/iroha_docs` | Hyperledger Iroha technical docs |
| 5 | `knowledge_base/curated/soramitsu_site` | Soramitsu corporate announcements |
| 6 | `knowledge_base/curated/research` | BCK21–BCK24 academic papers |
| 7 | `knowledge_base/curated/internal-research` | Internal research notes |
| 8 | `knowledge_base/curated/articles` | Prior Soranauts articles |
| 9 | `knowledge_base/curated/*_updates` | Polkaswap, TONSWAP, Fearless updates |

**Conflict Resolution:** Prefer higher-ranked sources and most recent snapshots.

---

## 3. Plan-Mode Execution Rules

### A. Plan-Only Behavior
- Output **only** an Edit Plan
- No rewriting, no summaries, no draft replacements
- The plan may **describe** rewrites but not **perform** them

### B. Article as Primary Source
- The article at `<path>` is the base document
- All analysis must align with this version's current state

### C. Knowledge Base Integration
- Cross-check all facts against Source-of-Truth hierarchy
- Use only curated sources for protocol corrections
- Mark roadmap/timeline items with: **"As of [Month Year]…"**

### D. Glossary Enforcement
- **NEVER add manual glossary links**
- Glossary auto-linker operates on plain text automatically
- Glossary links are automatically suppressed inside `<CalloutBox>`, `<StyledTable>`, `<TableCaption>`, `<SourcesList>`, and `<FaqSection>` — no manual wrapping needed
- For inline HTML blocks needing suppression, use `<div data-no-glossary>`
- The `SKIP_ELEMENTS` Set in `glossary-auto-link.mjs` controls build-time suppression

### E. Internal Linking Rules
All internal links must use real slugs only: `/slug-name`

**Forbidden patterns:**
- `/blog/...`
- `/glossary/...`
- `/content/...`
- `/explore/...`
- File paths (`apps/web/src/...`)
- External URLs for internal content

Provide **3–6 internal links** with:
- Slug
- Placement location
- Relevance rationale

### F. External Link Rules
Format: `<a href="URL" target="_blank" rel="noopener noreferrer">anchor text</a>`

**Tiered approach — link selectively based on source authority:**
- **Tier 1** (IMF, BIS, World Bank, Federal Reserve, central bank publications): Dofollow link in article body
- **Tier 2** (sora.org whitepaper, wiki.sora.org, soramitsu.co.jp, bakong.nbc.gov.kh): Dofollow link in article body
- **Tier 3** (Quality journalism — Reuters, Forbes): Rarely link, only when essential
- **Tier 4** (Industry blogs, LinkedIn, YouTube, aggregators): **No link** — cite in bibliography only

**Never nofollow editorial links** — Google treats this as unnatural.

### G. Tag & Metadata Rules
- Use Tag Matrix only (see Section 6)
- No invented tags
- Only change metadata when Section 8 explicitly requires it

### H. Template Order
- Follow required section order exactly
- No new sections
- All listed sections must appear in output

---

## 4. Nexus Whitepaper Translation Rules

For articles referencing Nexus architecture, IVM, Lanes, Data Spaces, SUMERAGI, or FASTPQ:

### Accuracy First
- Technical correctness must never be sacrificed for simplification
- When unsure: defer to Nexus Whitepaper → Iroha Docs → SORA Updates

### Human-Friendly Explanations
Use progressive disclosure:
1. **Simple explanation** (analogy or metaphor)
2. **Mid-level detail** (mechanism overview)
3. **Technical clarification** (optional, for advanced readers)

**Good metaphors to suggest:**
- Lanes = "dedicated conveyor belts" or "highway lanes that merge"
- Data Spaces = "private offices in a shared building"
- IVM = "a universal calculator that always gives the same answer"
- FASTPQ = "proving you're over 21 without showing your ID"

### No Raw Math
- Articles should *mention* mechanics, not expose equations
- Replace formulas with intuitive descriptions
- Note where technical appendices or FAQs could help

### Context Markers
When referencing Nexus mechanisms, use phrases like:
- "In Nexus (SORA v3)…"
- "Under the new Iroha 3 model…"
- "According to the Nexus Whitepaper…"

---

## 5. Glossary, Auto-Linker & FAQ Rules

### Glossary
- No manual `[term](/glossary/term)` links ever
- Auto-linker handles plain text automatically
- Glossary links are automatically suppressed inside blog components (`<CalloutBox>`, `<StyledTable>`, `<FaqSection>`, etc.)
- For inline HTML blocks, use `<div data-no-glossary>` wrapper

### FAQ Component
Use `<FaqSection>` with literal `<details>` children:

```jsx
<FaqSection>
  <details>
    <summary>Question text here?</summary>
    Answer paragraph here.
  </details>
  <details>
    <summary>Another question?</summary>
    Another answer.
  </details>
</FaqSection>
```

**Forbidden:** `items={[...]}` prop syntax

---

## 6. Metadata & Frontmatter Standards

### Title
- 50–60 characters ideal
- Include primary keyword naturally
- No clickbait

### Description/Excerpt
- ≤160 characters
- Neutral, ecosystem-aligned
- Include primary keyword

### Dates
- ISO-8601 format: `YYYY-MM-DD`
- `publishDate`: Original publication
- `updatedDate`: Must reflect actual revision date

### Tags (8–14 canonical tags)
**Allowed tags** (from Tag Matrix):
```
sora, xor, val, pswap, tbcd, kusd, xst, ken
polkaswap, defi, liquidity, staking, governance
nexus, iroha, iroha3, sora-v3
bridges, interoperability, ethereum, polkadot
cbdc, enterprise, payments
tokenomics, token-bonding-curve
guides, tutorials, explainers
ecosystem, community, updates
```

**Deprecated tags** (do not use):
- `vxor` (use `val`)
- `substrate` (use `polkadot` or remove)
- `sora-2` (use `sora` or `nexus`)

### Images
- Wide aspect ratio (16:9 or 2:1)
- Do not modify existing image paths unless broken
- Alt text must be descriptive and include keywords

---

## 7. TL;DR Guidelines

- **Length:** 2–4 sentences
- **Placement:** After introduction, before main content
- **Content:** Mention key components (XOR, Polkaswap, relevant tokens, Nexus if applicable)
- **Tone:** Informative, no hype
- **Format:** Can use bullet points for scannability

---

## 8. Structural Checklist

### Required Elements
- [ ] Strong opening hook (not generic)
- [ ] TL;DR present and well-positioned
- [ ] Logical section flow
- [ ] Smooth transitions between sections
- [ ] Conclusion with "Why It Matters" framing
- [ ] FAQ section (if article >1,200 words)
- [ ] Paragraphs 2–4 lines each (no walls of text)

### Length Targets by Type
| Article Type | Word Count |
|--------------|------------|
| News/Update | 600–1,000 |
| Standard | 1,200–1,800 |
| Pillar/Guide | 2,000–3,500+ |
| Technical Deep-Dive | 1,000–2,200 |
| **Soranauts Ideal** | **1,800–2,800** |

---

## 9. Edit Plan Output Format

Output sections in **this exact order**:

### 1️⃣ Overview
- Article path
- Current word count
- Change scope
- Summary of needed changes

### 2️⃣ Audience & Intent
- Target reader profile
- Reading intent (learn, decide, implement)
- Knowledge level assumed

### 3️⃣ Structure & Flow Analysis
- Current structure assessment
- Recommended reorganization (if any)
- Section-by-section notes

### 4️⃣ Clarity, Tone & Voice
- Current tone assessment
- Inconsistencies to fix
- Specific passages needing revision

### 5️⃣ Technical & Factual Accuracy
- Facts to verify against KB
- Outdated information to update
- Nexus/v3 updates needed
- Sources to cite

### 6️⃣ Glossary Integration
- Terms that should auto-link
- Terms incorrectly linked (to fix)
- FAQ sections needing `data-no-glossary`

### 7️⃣ Internal & External Linking Strategy
- Internal links to add (slug, placement, rationale)
- External links to add (whitelisted only)
- Broken links to fix

### 8️⃣ Tag & Metadata Optimization
- Current tags assessment
- Tags to add/remove
- Title/description improvements
- Date updates needed

### 9️⃣ Validation & QA
- Pre-publish checklist
- Specific items to verify
- Regression concerns
- Component migration status (are callouts/tables using `<CalloutBox>`/`<StyledTable>` or still inline HTML?)

### ✅ Final Review Summary
Brief checklist confirming Edit Plan completeness.

---

## 10. Quick Reference: Change Scope Definitions

| Scope | Description | Typical Changes |
|-------|-------------|-----------------|
| **Minor** | Typos, broken links, small factual corrections | <10 edits, no structural changes |
| **Targeted** | Specific section updates, adding Nexus context | 10–30 edits, some new content |
| **Full Modernization** | Complete refresh for Nexus era | Significant rewrites, new structure possible |

---

# END OF TEMPLATE
