# ARTICLE_EDIT_PLAN_TEMPLATE.md
# Soranauts — Master Article Edit Plan Template (2025 Edition, Nexus Update)

---

# 1. Purpose & Workflow
This template defines the exact structure, standards, and verification rules editors or AI assistants must follow when creating a **full Edit Plan** for any Soranauts article.

Your task:  
Create a **FULL Edit Plan** for `<article link or path>` using *every required section* in this document.

Inputs:
- Article URL or MDX path (e.g. `apps/web/src/content/post/sora-ecosystem-explained.mdx`)
- Change scope: minor update / targeted update / full modernization
- Notes about outdated mechanisms, pre-Nexus references, or new SORA v3/Iroha 3 developments

Output:
A structured **Edit Plan** — **NOT** a rewrite.  
Rewrite instructions appear only *inside* the plan.

---

# 2. Knowledge Base & Source–of–Truth Hierarchy (CRITICAL)

When verifying or updating technical details, always use this authority order (highest → lowest):

1. **knowledge_base/curated/nexus_whitepaper** — SORA Nexus Whitepaper (canonical for SORA v3)  
2. **knowledge_base/curated/sora_updates** — SORA v3 ecosystem updates  
3. **knowledge_base/curated/wiki** — SORA Wiki  
4. **knowledge_base/curated/iroha_docs** — Hyperledger Iroha documentation  
5. **knowledge_base/curated/soramitsu_site** — Soramitsu announcements  
6. **knowledge_base/curated/research** — bck21–bck24  
7. **knowledge_base/curated/internal-research**  
8. **knowledge_base/curated/articles** — prior Soranauts articles  
9. **knowledge_base/curated/*_updates** — Polkaswap, TONSWAP, Fearless, ecosystem updates  

When sources conflict:  
**Prefer higher-ranked directories and the most recent snapshot.**

---

# 2.1 Plan-Mode Execution Rules (AI Assistants & Cursor)

### A. Plan-Only Behavior
- Output **only** an Edit Plan.
- No rewriting, no summaries, no draft replacements.
- The plan may **describe** rewrites but not **perform** them.

### B. `<link>` as Primary Source
- The article at `<link>` is the base document.
- All analysis must align with this version.

### C. Required Knowledge Base Integration
- Cross-check facts with the Source–of–Truth hierarchy.
- Use only curated wiki/docs/updates for protocol corrections.
- Mark roadmap items with:  
  **“As of <Month Year>…”**

### D. Glossary Enforcement
- **No manual glossary links** ever.
- Glossary auto-linker operates on plain text only.
- If auto-linking misfires inside FAQs, suggest `<div data-no-glossary>`.

### E. Internal Linking Guardrails
- All internal links must use real slugs: `/slug`
- Forbidden:
  - `/blog/...`
  - `/glossary/...`
  - `/content/...`
  - `/explore/...`
  - File paths
- Provide 3–6 internal links:
  - Each with slug, placement, and rationale.

### F. External Link Rules (UPDATED)
Whitelisted (use HTML `<a>` tags with `target="_blank" rel="noopener noreferrer">`):
- SORA Wiki  
- Soramitsu  
- Hyperledger Iroha Docs  
- Polkaswap  
- Kensetsu  
- TONSWAP  
- Polkadot Wiki  
- Polkadot Docs  
- Kusama Wiki  

Non-whitelisted sources → summarize, do not link.

### G. Tag & Metadata Behavior
- Use Tag Matrix only.
- No invented tags.
- Only change metadata when Section 8 requires it.

### H. Template Order Strictness
- Follow the required section order exactly.
- No new sections.
- All listed sections must appear.

---

# X. Nexus Whitepaper Interpretation & Translation Rules (MANDATORY)

Because the **SORA Nexus Whitepaper** introduces highly technical concepts  
(e.g., IVM execution, Lanes & Merge, Data Spaces, Sumeragi NEW_VIEW gating, deterministic ordering, FASTPQ theory),  
all Soranauts articles must translate these ideas into **clear, accessible explanations** without losing correctness.

Editors must follow:

### 1. Accuracy Comes First
- Technical correctness must never be sacrificed for simplification.
- If unsure: defer to the Nexus Whitepaper → Iroha Docs → SORA Updates hierarchy.

### 2. Use Human-Friendly Bridges
When explaining technical material:
- Use metaphors (e.g., “lanes are like dedicated conveyor belts for transactions”).  
- Use comparisons (e.g., “Nexus handles transactions like a multi-lane highway where cars merge under strict rules”).  
- Use progressive disclosure:
  1. Simple explanation  
  2. Mid-level detail  
  3. Technical clarification (optional)

### 3. No Raw Math in Articles
- Articles should *mention* the mechanic, not expose full equations.
- Summaries:
  - Replace math with intuition (e.g., “the system deterministically chooses leaders using a predictable random function”).
- Plans must note when technical appendices or FAQs may help.

### 4. Explicit Context Markers
- When referencing any advanced mechanism:
  - “In Nexus (SORA v3)…”
  - “Under the new Iroha 3 model…”
  - “According to the Nexus Whitepaper…”

### 5. Steer Readers Toward Understanding
Every Edit Plan must:
- Flag dense paragraphs that need simplification.
- Suggest metaphors or real-world analogies.
- Identify where visual or diagram-friendly explanations could help.
- Recommend FAQ items to handle difficult concepts.

This is required for all articles that reference Nexus architecture, Sumeragi, IVM, Lanes, Data Spaces, DA, or queueing rules.

---

# 3. Glossary, Auto-Linker, and FAQ Rules

Glossary rules:
- No manual links.
- Let the auto-linker work on plain text.
- Avoid glossary terms inside `<details><summary>` tags.

FAQ rules:
- Use `<FaqSection>` with **literal** `<details>` children.
- No `items={[...]}` props.
- Avoid double headings (choose default or custom).

---

# 4. Internal Link System (CRITICAL)
- Use real slugs only: `/sora-ecosystem-explained`
- Provide 3–6 internal links:
  - slug  
  - relevance  
  - placement  

Internal link tiers:
1. Ecosystem context  
2. Protocol + economics  
3. Market/behavior (only if necessary)

---

# 5. External Link Guardrails (UPDATED)
Whitelisted:
- SORA Wiki  
- Soramitsu  
- Iroha Docs  
- Polkaswap  
- TONSWAP  
- Kensetsu  
- Polkadot Wiki/Docs  
- Kusama Wiki  

Use HTML `<a>` tags with full security attributes.  
Anything else must be summarized.

---

# 6. Metadata & Frontmatter Standards

Title:
- 50–60 characters
Excerpt:
- ≤160 characters, neutral, ecosystem-aligned

Dates:
- ISO-8601  
- `updateDate` must reflect real revisions

Tags:
- 8–12 canonical tags  
- No deprecated tags (e.g., `vxor`, `substrate`, `sora-v3`)

Images:
- Wide aspect ratio  
- Do not modify image path

---

# 7. TL;DR Guidelines
- 2–4 sentences  
- Mention key ecosystem components (XOR, Polkaswap, KUSD, Iroha 3, Nexus, TONSWAP, SORA Card)  
- No hype  
- Place after introduction  

---

# 8. Structural Checklist
Check for:
- Strong intro
- TL;DR present  
- Logical flow  
- Smooth transitions  
- Conclusion / “Why It Matters”  
- FAQ section  
- Paragraphs 2–4 lines each

Length targets:
- Short: 600–1,000  
- Standard: 1,200–1,800  
- Pillar: 2,000–3,500+  
- Technical: 1,000–2,200  
- Soranauts ideal: 1,800–2,800  

---

# 9. ARTICLE EDIT PLAN — REQUIRED OUTPUT FORMAT

Cursor MUST output sections in **this exact order**:

1️⃣ **Overview**  
2️⃣ **Audience & Intent**  
3️⃣ **Structure & Flow Analysis**  
4️⃣ **Clarity, Tone & Voice**  
5️⃣ **Technical & Factual Accuracy**  
6️⃣ **Glossary Integration**  
7️⃣ **Internal & External Linking Strategy**  
8️⃣ **Tag & Metadata Optimization**  
9️⃣ **Validation & QA**  

### ✅ Final Review Summary  
A brief final checklist confirming the Edit Plan meets all requirements.

---

# END OF TEMPLATE
