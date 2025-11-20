# ARTICLE_EDIT_PLAN_TEMPLATE.md
# Soranauts — Master Article Edit Plan Template (2025 Edition)

# 1. Purpose & Workflow
This template defines how editors or AI assistants (Cursor, ChatGPT, etc.) must analyze and improve a Soranauts article.

Your task:
Create a FULL Edit Plan for <article link or path> using the sections in this document exactly.

Inputs expected:
- Article URL or MDX path (e.g. apps/web/src/content/post/sora-ecosystem-explained.mdx)
- Change scope: minor update / targeted update / full modernization
- Notes about outdated mechanisms or recent SORA/TON/KUSD developments

Output:
A structured Edit Plan — NOT a rewrite — using the exact section order below.

# 2. Knowledge Base & Source–of–Truth Hierarchy
When making factual corrections or recommendations, follow this authority order (highest → lowest):

1. knowledge_base/curated/wiki — SORA Wiki  
2. knowledge_base/curated/iroha_docs — Hyperledger Iroha Docs  
3. knowledge_base/curated/soramitsu_site — Soramitsu  
4. knowledge_base/curated/research — bck21–bck24  
5. knowledge_base/curated/internal-research  
6. knowledge_base/curated/articles — prior Soranauts features  
7. knowledge_base/curated/*_updates — Polkaswap, TONSWAP, SORA v3 updates  

When sources conflict: prefer higher-ranked directories and the most recent snapshot.

# 2.1 Plan-Mode Execution Rules (Cursor & AI Assistants)

These rules define *how* Cursor must behave when generating an Edit Plan using the standard prompt:

“Use ARTICLE_EDIT_PLAN_TEMPLATE.md. Create a full Edit Plan for <link>.”

### A. Plan-Only Behavior (No Rewriting)
- The assistant must ONLY produce an Edit Plan.
- No rewritten article content, no partial rewrites, no summaries, no draft replacements.
- All rewrite instructions must appear *inside the plan*, not executed in the output.

### B. <link> as the Primary Source of Truth
- The article located at <link> is the base document for the entire plan.
- All analysis must align with this version of the article.
- Do not reference older revisions or unrelated drafts.

### C. Required Knowledge Base Integration
When the template calls for factual verification or expansion, Cursor must:
- Cross-check details against the Knowledge Base Source Hierarchy.
- Use curated wiki files, polkaswap_updates, ecosystem_updates, and research snapshots as authoritative sources.
- Clearly identify where KB-driven corrections or expansions are required.
- Tag all roadmap or speculative statements with:
  **“As of <Month Year>…”**
  to distinguish live vs planned features.

### D. Glossary & FAQ Enforcement
- No manual glossary links are ever allowed.
- Glossary auto-linking must operate on plain text only.
- FAQs must follow Section 3 rules (FaqSection + literal <details> children).
- If the auto-linker injects excessive links inside FAQs, instruct wrapping problematic areas with `<div data-no-glossary>`.

### E. Linking Guardrails
- Internal links must use real slugs only (`/slug`).
- No `/blog/...`, file-system paths, or `/glossary/...` links.
- External links must follow Section 5 whitelisting.
- All forbidden external sources must be summarized, not linked.

### F. Tag & Metadata Normalization
Every Edit Plan must:
- Propose 8–12 normalized tags.
- Provide a ≤160-character excerpt revision.
- Confirm category alignment.
- Confirm image path without changing it.
- Validate canonical URL and dates.

### G. Edit Plan Tone & Density
- The Edit Plan must be concise, actionable, and template-driven.
- Avoid unnecessary exposition or re-explaining the entire article.
- Each section should map cleanly to the template’s structure.

### H. Structural & Organizational Compliance
- Follow the section order in the ARTICLE EDIT PLAN format exactly.
- Do not introduce new sections or rearrange required ones.
- Any deviation must be justified inside the plan but not executed.

# 3. Glossary, Auto-Linker, and FAQ Rules
Glossary rules:
- Do not add manual glossary links (/glossary/...).
- Do not wrap glossary terms in <a> or custom components.
- The auto-linker handles glossary linking.
- Avoid glossary terms inside <details> summaries or props.

FAQ rules:
- Use the FaqSection component.
- FaqSection must wrap literal <details> children.
- Do NOT use items={[...]} or any props-based content.
- Use <div data-no-glossary> only if auto-linker injects links into FAQ content.

FAQ heading rules:
- FaqSection renders a heading by default (“FAQs”).
- Avoid double headings:
  - EITHER rely on the default heading and do NOT add `## FAQs`,
  - OR set `title=""` on FaqSection and add your own `## FAQs`.
- Every Edit Plan must declare which pattern to use.

# 4. Internal Link System (CRITICAL)
Soranauts uses NO "/blog" prefix.

All article URLs follow:
/<slug>

Examples:
- /sora-ecosystem-explained
- /deep-dive-into-xor-val-and-pswap
- /soras-token-bonding-curve-dollar-tbcd-explained
- /best-decentralized-exchanges-dexs

Internal link rules:
- MUST use real slugs: /<slug>
- NEVER generate:
  - /blog/...
  - /content/...
  - /post/...
  - /glossary/...
  - /explore/...
  - /features
  - /donate
  - /about

Required internal link hierarchy (3–6 links):

Tier 1 — Direct ecosystem context  
Tier 2 — Protocol + economic structure  
Tier 3 — Market/behavior (only when contextually relevant)

For each internal link:
- Provide exact slug path
- Explain relevance
- Specify placement (intro, mid-section, conclusion)

# 5. External Link Guardrails (UPDATED)
Whitelisted domains (MUST use target="_blank" rel="noopener noreferrer"):
- SORA Wiki
- Soramitsu
- Hyperledger Iroha Docs
- Polkaswap
- Kensetsu
- TONSWAP
- Polkadot Wiki
- Polkadot Documentation (docs.polkadot.com)
- Kusama Wiki

Implementation detail for MDX articles:
- When proposing or editing article content, external links to whitelisted domains MUST be written as HTML `<a>` tags with `target="_blank" rel="noopener noreferrer"` (not bare Markdown `[text](url)`), so they always open in a new tab and follow security best practices.
- Do NOT remove, rewrite, or de-link whitelisted sources.

Forbidden:
- Ethereum.org
- TON.org general docs
- Generic crypto education sites
- Commercial crypto blogs

Non-whitelisted sources must be summarized, not linked.

# 6. Metadata & Frontmatter Standards
Title:
- Clear, descriptive, ~50–60 characters

Excerpt:
- ≤160 characters
- Neutral, factual
- Include 1–2 ecosystem elements

Dates:
- ISO-8601  
- updateDate must reflect real edits

Tags:
- 8–12 normalized
- lowercase, hyphenated
- no deprecated tags (vxor, substrate)

Image:
- Wide aspect ratio
- Do not change path

# 7. TL;DR Guidelines
- Place after introduction
- 2–4 concise sentences
- Mention an ecosystem piece (XOR, Polkaswap, KUSD, Iroha 3, TONSWAP, Kensetsu, SORA Card)
- No hype

Example TL;DR:
SORA’s decentralized economy is built around XOR, Polkaswap, KUSD and ongoing SORA v3 development on Hyperledger Iroha 3. This article explains how governance, liquidity, and cross-chain infrastructure connect across the ecosystem.

# 8. Structural Checklist
Check for:
- Strong introduction
- TL;DR
- Logical flow
- Smooth transitions
- Conclusion or “Why It Matters”
- Proper FAQ section

Preferred paragraph size: 2–4 lines.

# 9. Recommended Length
Short updates: 600–1,000  
Standard explainers: 1,200–1,800  
Pillar/flagship: 2,000–3,500+  
Technical: 1,000–2,200  

Soranauts sweet spot: 1,800–2,800.

# 10. ARTICLE EDIT PLAN — REQUIRED OUTPUT FORMAT

Cursor MUST output sections in this exact order:

1️⃣ Overview  
2️⃣ Audience & Intent  
3️⃣ Structure & Flow Analysis  
4️⃣ Clarity, Tone & Voice  
5️⃣ Technical & Factual Accuracy  
6️⃣ Glossary Integration  
7️⃣ Internal & External Linking Strategy  
8️⃣ Tag & Metadata Optimization  
9️⃣ Validation & QA  

✅ Final Review Summary

Each section must follow the bullet structure defined earlier.

# END OF TEMPLATE
