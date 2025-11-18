# Article Edit Plan Template for Soranauts

This template is designed for editors and AI assistants (Cursor, ChatGPT, etc.) to create **edit plans** for Soranauts articles in a consistent, KB-aligned way.

Use it whenever you are:

- Updating an existing article with new ecosystem data  
- Migrating legacy content (old FAQs, manual glossary links)  
- Performing a full editorial pass on structure, tags, or metadata  

---

## 1. Task & Workflow

**Task:**  
Create a structured **Edit Plan** to improve `<article link or path>` while preserving its voice and intent.

**Inputs you should receive or infer:**

- Article URL or repo path (e.g., `apps/web/src/content/post/sora-ecosystem-explained.mdx`)  
- Change scope: `minor update` / `targeted section updates` / `full rewrite`  
- Any notes on outdated data, governance changes, or glossary behavior  

**Outputs you should produce:**

- An **Edit Plan** with these sections:
  - `Assessment`
  - `Recommended KB-backed changes`
  - `FAQ plan`
  - `Metadata & tags`
  - `Open questions` (if any)  
- Optionally, a **revised MDX draft** if explicitly requested

**Rules of engagement:**

- Do **not** add manual glossary links (`<a>`, `<GlossaryLink>`, markdown links) for glossary terms  
- Keep tone factual, neutral, and non-promotional  
- Cross-check any SORA v3 / Fujiwara / Iroha 3 statements with the Knowledge Base hierarchy before including  

---

## 2. Knowledge Base & Glossary Standards

**Authoritative source order (highest → lowest):**

1. `knowledge_base/curated/wiki` — SORA Wiki  
2. `knowledge_base/curated/iroha_docs` — Hyperledger Iroha docs  
3. `knowledge_base/curated/soramitsu_site` — SORAMITSU official pages  
4. `knowledge_base/curated/research` — numbered research sets (bck21–bck24)  
5. `knowledge_base/curated/internal-research` — internal technical notes  
6. `knowledge_base/curated/articles` — prior Soranauts features  
7. `knowledge_base/curated/*_updates` — ecosystem, Polkaswap, TONSWAP, etc.  

When sources conflict, prefer the higher-ranked directory and the **most recent snapshot**.

### Glossary rules

- Leave glossary terms as **plain text**; the auto-linker handles them at build time  
- Do **not** wrap terms like `bonding curve`, `liquidity`, `governance`, `SORA Parliament`, etc. in manual links  
- Avoid adding links inside `<details>` summaries or component props  
- You may link to `/explore/...` pages for **Explorer tag pages**, but never to `/glossary/...` term URLs  

### Tag guidelines

- Aim for **8–12 tags** per article  
- Use **lowercase, hyphenated** tokens (e.g., `sora-v3`, `bonding-curve`, `governance`)  
- Align with the Tag Suggestion Matrix categories:
  - Core: `sora`, `xor`, `kusd`, `val`, `pswap`  
  - Ecosystem: `polkaswap`, `tonswap`, `kensetsu`  
  - Governance: `governance`, `parliament`, `treasury`  
  - Infra: `hyperledger-iroha`, `sora-v3`, `hub-chain`  
  - Research: `economics`, `tokenomics`, `cbdc`  

### Quick verification checklist

For any article touching core topics, verify:

- **SORA v3 status:** pre-mainnet, in active development on Fujiwara testnet  
- **Iroha 3 / Nexus phrasing:** “being developed on Hyperledger Iroha 3” and “expected to introduce” future features  
- **Kensetsu & KUSD:** over-collateralized vaults, 19.5% fee allocation, KUSD as proposed builder payment unit in v3  
- **SORA Card:** current rollout region, supported assets, and positioning as DeFi ↔ fiat bridge  
- **Polkaswap & TONSWAP:** roles, bridge connectivity, fee and burn mechanics at a high level  
- **Governance & Parliament:** SORA v2 governance vs planned SORA v3 (Nexus) Parliament-based model  

If something is uncertain or speculative, mark it as **“research in progress”** or use phrasing like **“is expected to”** rather than asserting it as live.

---

## 3. TL;DR & Structure Guidelines

### TL;DR pattern

- Add a `## TL;DR` section **near the top** (after the intro paragraph if present)  
- Use **2–4 short, neutral sentences**  
- Mention at least **one** core ecosystem component (SORA, Polkaswap, Iroha 3 / Nexus, Kensetsu, SORA Card, TONSWAP)  
- Avoid hype, marketing language, or exact launch dates for SORA v3  

**Example:**

> SORA is an economic system built around XOR, Polkaswap, Kensetsu, and a forthcoming SORA v3 hub chain on Hyperledger Iroha 3.  
> This article explains how tokenomics, governance, and cross-chain connectivity fit together to support a decentralized economy.  
> It reflects the current 2025 roadmap, where SORA v3 remains in active development on the Fujiwara testnet.

### Structural checklist

When writing your Edit Plan, note whether the article has:

- A clear **introduction** explaining who the article is for and why it matters  
- Logical flow: background → core mechanics → implications / use cases  
- Smooth transitions between sections (no abrupt topic jumps)  
- A **conclusion** or “Why this matters” section summarizing the big picture  
- Optional **Further Reading** section for internal and external links  

### Voice & tone

- **Explanatory, confident, and concise** — Soranauts style  
- Preserve **historical context** instead of deleting outdated mechanisms; mark them as historical where needed  
- Avoid speculative or promotional phrasing; flag opinions as such and keep the core narrative factual  

---

## 4. Recommended Article Length & Structure

Use these ranges to keep depth, SEO value, and KB performance consistent:

| Type | Word Count | Best Used For |
|------|-------------|---------------|
| **Short form** | 600–1,000 | News updates, small feature announcements |
| **Standard** | 1,200–1,800 | Focused educational explainers or governance summaries |
| **Pillar / Flagship** | 2,000–3,500+ | Ecosystem overviews and long-form deep dives (e.g., “SORA Ecosystem Explained”) |
| **Technical / KB Reference** | 1,000–2,200 | Documentation-style posts (tokenomics, protocols, parameters) |

**Soranauts Ideal Range:**  
**1,800–2,800 words** for core ecosystem articles — ensures rich context without overloading readers or Pagefind (~25 KB/page limit).

**Formatting best practices:**
- Short paragraphs (3–4 lines max)  
- Clear hierarchy (H2 → H3 → bullets)  
- 2–3 internal links per section  
- Include `## TL;DR`, and 4–7 FAQs using `FaqSection`  
- Maintain calm, factual tone  
- Include 8–12 normalized tags  

These standards help every article stay semantically rich, SEO-aligned, and retrievable through the Knowledge Base embeddings.

---

## 5. SEO & Linking Strategy

- **Internal links:** Use canonical slug paths (e.g., `/sora-ecosystem-explained`) without `/blog` or other directory prefixes. This keeps live URLs consistent across Astro routes and eliminates mismatched links in production.
- **Allowed destinations:** Limit internal references to `/blog`, `/explore`, `/features`, `/donate`, and `/glossary` namespaces plus canonical slugs. Do not link to staging or localhost URLs.
- **External links:** Only include approved domains (SORA Wiki, Soramitsu, Hyperledger Iroha Docs, Polkaswap, Kensetsu, TONSWAP) and append `{target="_blank" rel="noopener noreferrer"}` to each. Prefer sourcing claims from the Knowledge Base hierarchy before referencing external docs.
- **Anchor density:** Aim for 2–3 internal links per major section and keep anchor text descriptive (avoid “click here”).

---

## 6. FAQ System with `FaqSection`
*(existing content unchanged)*

---

## 7. Metadata & Frontmatter

When drafting an Edit Plan, include a short checklist for frontmatter and on-page SEO:

- **Title (`title` / HTML `<title>`):**
  - Aim for a concise, descriptive title that surfaces core entities (e.g., `SORA`, `TBCD`, `KUSD`, `Kensetsu`).  
  - Keep total length around **580 px** in common SEO tools (roughly **50–60 characters** in Latin script) to avoid truncation in search results.  
  - Avoid keyword stuffing; prioritize clarity over packing in every term.

- **Meta description (`excerpt` / description):**
  - Write **1–2 neutral sentences** summarizing what the article covers and who it is for.  
  - Target around **920 px** in SEO tools (roughly **140–160 characters**) so the description is readable without being cut off.  
  - Mention at least one or two key concepts or entities (e.g., `SORA`, `Polkaswap`, `Kensetsu`, `SORA v3`) in natural language, not as a keyword list.

- **Other frontmatter:**
  - Ensure `publishDate` and `updateDate` are ISO8601 (`YYYY-MM-DDTHH:MM:SSZ`) and reflect reality.  
  - Confirm `category` matches the current article emphasis (e.g., `Economics & Policy`, `DeFi & Trading`, `Technology & Architecture`).  
  - Keep `canonicalURL` pointing to the live production URL for the article.  
  - Validate that `image` paths resolve and are appropriate for social previews.

---

## 8. Edit Plan Skeleton
*(existing content unchanged)*

---

## 9. Applying This Template to an Article
*(existing content unchanged)*
