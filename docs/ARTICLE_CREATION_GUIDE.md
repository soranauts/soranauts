# ARTICLE_CREATION_GUIDE.md
# Soranauts — New Article Creation Guide (2025 Edition, Nexus Update)

---

## 1. Purpose

This guide provides the framework, standards, and requirements for creating **new** Soranauts articles from scratch.

> **Note:** This guide is for NEW content creation. For editing/updating existing articles, use `ARTICLE_EDIT_PLAN_TEMPLATE.md` instead.

---

## 2. Before You Start

### Required Inputs
- **Topic:** Clear subject focus
- **Article Type:** News | Guide | Explainer | Technical | Pillar
- **Primary Keyword:** Main SEO target
- **Source Materials:** Whitepapers, announcements, KB references
- **Target Length:** Based on article type (see Section 8)

### Pre-Writing Checklist
- [ ] Topic doesn't duplicate existing Soranauts content
- [ ] Source materials gathered and reviewed
- [ ] Primary and secondary keywords identified
- [ ] Article type determined
- [ ] Internal linking opportunities identified

---

## 3. Knowledge Base & Source-of-Truth Hierarchy

When writing technical content, verify facts using this authority order:

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

## 4. Article Structure Framework

### Required Sections (in order)

```
1. Opening Hook (1-2 paragraphs)
   └── Captures attention immediately
   └── States why this matters NOW

2. TL;DR (2-4 sentences or 3-5 bullets)
   └── Key takeaways for scanners
   └── Placed after hook, before main content

3. Main Content (varies by type)
   └── Logical flow from simple → complex
   └── Clear section headings (H2/H3)
   └── Short paragraphs (2-4 lines)

4. Practical Applications / Why It Matters
   └── Real-world relevance
   └── User benefits

5. FAQ Section (for articles >1,200 words)
   └── 5-12 questions
   └── Anticipates reader questions

6. Conclusion
   └── Brief recap
   └── Forward-looking statement or CTA
```

### Opening Hook Rules

**DO start with:**
- A bold claim or surprising fact
- A relatable problem the reader faces
- A compelling statistic
- A direct statement of value

**DO NOT start with:**
- "In this article, we will discuss..."
- "Blockchain technology is..."
- "Today we're going to talk about..."
- "Have you ever wondered..." (overused)
- Generic industry observations

**Examples of good hooks:**
```
✅ "SORA Nexus isn't just another blockchain upgrade—it's designed to be 
    the last blockchain architecture humanity will ever need."

✅ "With $150 billion processed through a single CBDC in 2024, the question 
    isn't whether blockchain can handle real finance—it's which one will."

✅ "Every time you bridge tokens between chains, you're paying a tax on 
    blockchain's biggest failure: fragmentation."
```

---

## 5. Writing Style Standards

### Voice & Tone
- **Voice:** Knowledgeable friend explaining to someone smart but new
- **Tone:** Confident but not arrogant; engaging but not hype-y
- **Register:** Professional-casual (not academic, not Reddit)

### Readability Rules
- Paragraphs: 2-4 lines max
- Sentences: Vary length (mix short punchy with longer explanatory)
- Active voice preferred
- Define technical terms on first use
- Use analogies for complex concepts

### Words/Phrases to AVOID
```
❌ "Revolutionary" / "Game-changing" / "Cutting-edge"
❌ "It is important to note that..."
❌ "In order to..."
❌ "Utilize" (use "use")
❌ "Leverage" (use "use" or be specific)
❌ "Ecosystem" in every sentence
❌ "Web3" without context
❌ Unexplained acronyms
```

### Words/Phrases to USE
```
✅ Concrete numbers and dates
✅ Specific examples
✅ "This means..." (to explain implications)
✅ "In practice..." (to ground abstract concepts)
✅ Comparison language ("Unlike X, SORA does Y")
```

---

## 6. Technical Content Translation

For Nexus/Iroha 3 technical content, use **progressive disclosure**:

### The Three-Layer Pattern

**Layer 1 — Plain English (required)**
> A simple analogy or one-sentence explanation anyone can understand.

**Layer 2 — Mechanism Overview (required)**
> How it works at a conceptual level, without implementation details.

**Layer 3 — Technical Detail (optional)**
> Specific parameters, algorithms, or specifications for advanced readers.

### Example: Explaining IVM

```markdown
**Plain English:** Think of the IVM as a universal calculator that always 
gives the exact same answer, no matter which computer runs it. Unlike 
other blockchain systems where tiny hardware differences can occasionally 
cause problems, the IVM guarantees identical results everywhere.

**How It Works:** The Iroha Virtual Machine (IVM) executes smart contracts 
using a fixed set of rules. It prohibits operations that could vary between 
computers (like certain math shortcuts) and packages all inputs in a 
standardized format. Every validator running the same contract will 
always reach the same conclusion.

**Technical Details:** The IVM provides 256 64-bit general-purpose registers, 
uses pointer-ABI types with Norito TLV envelopes, and enforces determinism 
by prohibiting floating-point operations and nondeterministic syscalls.
```

### Standard Analogies for Nexus Concepts

| Concept | Recommended Analogy |
|---------|---------------------|
| Lanes | Highway lanes / Grocery checkout lanes |
| Data Spaces | Private offices in a shared building |
| Merge Ledger | Master receipt combining all registers |
| IVM | Universal calculator with guaranteed results |
| FASTPQ Proofs | Proving your age without showing your ID |
| SUMERAGI | Voting system where validators agree |
| Kura | Filing cabinet (historical records) |
| WSV | Current balance sheet |

### Context Markers (required for Nexus content)
Always clarify version context:
- "In SORA Nexus (v3)..."
- "Under the Iroha 3 model..."
- "The Nexus Whitepaper specifies..."
- "Unlike SORA v2, Nexus..."

---

## 7. SEO & Discoverability

### Keyword Integration
- Primary keyword in: title, first 100 words, one H2, meta description
- Secondary keywords: distributed naturally through content
- Long-tail keywords: address in FAQ section
- **Never keyword stuff** — readability always wins

### Heading Hierarchy
- **H1:** Title only (one per article)
- **H2:** Major sections
- **H3:** Subsections
- Include keywords in ~30% of headings naturally

### Meta Description
- 150-160 characters
- Include primary keyword
- Create curiosity or state clear value
- No clickbait

### Image Optimization
- Descriptive filenames: `sora-nexus-architecture-diagram.png`
- Alt text: Descriptive, includes relevant keywords
- Aspect ratio: 16:9 or 2:1 for hero images

---

## 8. Article Types & Length Targets

| Type | Word Count | Structure Focus |
|------|------------|-----------------|
| **News/Update** | 600–1,000 | What happened, why it matters, what's next |
| **Explainer** | 1,200–1,800 | Concept → mechanism → applications |
| **Guide/Tutorial** | 1,500–2,500 | Problem → steps → outcome |
| **Technical Deep-Dive** | 1,800–2,800 | Overview → architecture → details → implications |
| **Pillar Content** | 2,500–4,500 | Comprehensive coverage, multiple sections, FAQ |

**Soranauts ideal range:** 1,800–2,800 words

---

## 9. Linking Strategy

### Internal Links (3-6 per article)

**Rules:**
- Use real slugs only: `/slug-name`
- No `/blog/`, `/glossary/`, `/content/`, `/explore/` prefixes
- No file paths

**Link Placement Strategy:**
- First mention of major ecosystem component → link to its explainer
- Related concepts → link to deeper coverage
- "Learn more" opportunities → link to relevant guides

**Provide for each link:**
- Slug
- Anchor text
- Placement location
- Relevance rationale

### External Links

**Whitelisted domains** (use HTML `<a target="_blank" rel="noopener noreferrer">`):
```
wiki.sora.org
soramitsu.co.jp
hyperledger.github.io/iroha-2-docs
polkaswap.io
kensetsu.io
tonswap.io
wiki.polkadot.network
docs.substrate.io
guide.kusama.network
```

**Non-whitelisted sources:** Summarize information; do not link.

### Glossary Integration
- **NEVER manually link glossary terms**
- Auto-linker handles plain text automatically
- Write terms naturally; system links them
- If auto-linking causes issues in FAQs, wrap with `<div data-no-glossary>`

---

## 10. FAQ Section Guidelines

### When to Include
- Articles >1,200 words: Required
- Articles <1,200 words: Optional but recommended

### Question Selection
- Anticipate what readers will ask after reading
- Include "what is" questions for key terms
- Include "how does" questions for mechanisms
- Include comparison questions ("How is X different from Y?")
- Include practical questions ("Can I use X for Y?")

### Answer Format
- 2-4 sentences for featured snippet optimization
- Can expand with additional detail
- Link to relevant internal content where appropriate

### Component Syntax
```jsx
<FaqSection>
  <details>
    <summary>What is SORA Nexus?</summary>
    SORA Nexus is the third major version of the SORA network, built on 
    Hyperledger Iroha 3. It introduces a unified ledger architecture with 
    data spaces, parallel lanes, and the Iroha Virtual Machine (IVM) for 
    deterministic smart contract execution.
  </details>
  <details>
    <summary>How is Nexus different from SORA v2?</summary>
    While SORA v2 operates as a Substrate-based chain, Nexus moves to 
    Hyperledger Iroha 3 with native support for private data spaces, 
    institutional use cases like CBDCs, and infinite horizontal scalability 
    through parallel lanes.
  </details>
</FaqSection>
```

**Forbidden:** `items={[...]}` prop syntax

---

## 11. Tables & Visual Elements

### When to Use Tables
- Comparing multiple items across same attributes
- Listing specifications or parameters
- Feature comparisons
- Quick-reference information

### Table Best Practices
- Clear headers
- Consistent data formatting
- Mobile-friendly (not too wide)
- Alt text for accessibility

### Suggested Table Types
- **Comparison tables:** "X vs Y vs Z"
- **Specification tables:** Technical parameters
- **Feature matrices:** What's included in each tier/version
- **Timeline tables:** Roadmap or historical progression

---

## 12. Frontmatter Template

```yaml
---
title: "Your Title Here (50-60 chars ideal)"
description: "Meta description with primary keyword (150-160 chars)"
publishDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD  # Same as publishDate for new articles
tags:
  - primary-tag
  - secondary-tag
  - tertiary-tag
  # 8-14 tags total
category: "Guides"  # or: News, Explainers, Technical, Ecosystem
author: "Soranauts Team"  # or specific author
image:
  src: "@/assets/images/your-image-name.png"
  alt: "Descriptive alt text with keywords"
draft: false
---
```

### Canonical Tags (use only these)
```
# Tokens
sora, xor, val, pswap, tbcd, kusd, xst, ken, pussy

# Products & Platforms
polkaswap, kensetsu, fearless-wallet, sora-card, tonswap

# Technology
nexus, iroha, iroha3, ivm, sumeragi, fastpq
bridges, interoperability, substrate, polkadot, ethereum

# Concepts
defi, liquidity, staking, governance, tokenomics
token-bonding-curve, data-spaces, cbdc, enterprise

# Content Types
guides, tutorials, explainers, technical, ecosystem
news, updates, community, announcements
```

**Deprecated tags (do not use):** `vxor`, `sora-v2`, `sora-v3` (use `nexus`)

---

## 13. Pre-Publish Checklist

### Content Quality
- [ ] Opening hook captures attention (no generic starts)
- [ ] TL;DR present and accurate
- [ ] Logical flow from simple → complex
- [ ] All technical terms explained on first use
- [ ] Paragraphs are 2-4 lines (no walls of text)
- [ ] Transitions between sections are smooth
- [ ] Conclusion provides closure and value

### Technical Accuracy
- [ ] Facts verified against KB source hierarchy
- [ ] Nexus/v3 context markers used where needed
- [ ] No outdated v2-only information (unless comparing)
- [ ] Numbers and specifications match whitepaper

### SEO & Structure
- [ ] Title is 50-60 characters with primary keyword
- [ ] Meta description is 150-160 characters
- [ ] Primary keyword in first 100 words
- [ ] Heading hierarchy correct (one H1, H2s for sections)
- [ ] 3-6 internal links placed naturally
- [ ] External links use correct attributes
- [ ] Image has descriptive alt text

### Formatting & Components
- [ ] No manual glossary links
- [ ] FAQ uses correct `<FaqSection>` syntax
- [ ] Tables are mobile-friendly
- [ ] Code blocks formatted correctly (if any)

### Metadata
- [ ] All frontmatter fields complete
- [ ] Tags are from canonical list (8-14 tags)
- [ ] Image path is correct
- [ ] Dates in ISO-8601 format

---

## 14. File Naming Convention

**Blog Post:** `kebab-case-slug.mdx`
**Location:** `apps/web/src/content/post/`

**Hero Image:** `kebab-case-slug.png` (match the post slug)
**Location:** `apps/web/src/assets/images/`

**OG Image:** Auto-generates to `apps/web/public/og/`

**Example:**
```
Post:  apps/web/src/content/post/sora-nexus-complete-guide.mdx
Image: apps/web/src/assets/images/sora-nexus-complete-guide.png
OG:    apps/web/public/og/sora-nexus-complete-guide.png (auto)
```

---

## 15. AI Assistant Instructions

When using this guide with Cursor or other AI assistants:

### Prompt Structure
```
Read ARTICLE_CREATION_GUIDE.md and create a new article about [TOPIC].

Article Type: [Guide/Explainer/Technical/News/Pillar]
Primary Keyword: [keyword]
Target Length: [word count]
Source Materials: [list attachments or KB paths]

Additional requirements:
- [specific asks]
```

### What AI Should Do
- Follow all structure requirements
- Use progressive disclosure for technical content
- Include all required sections
- Generate complete frontmatter
- Provide internal/external link recommendations
- Create FAQ section with proper syntax

### What AI Should NOT Do
- Invent facts not in source materials
- Skip required sections
- Use deprecated tags
- Manually link glossary terms
- Use forbidden URL patterns
- Start with generic openings

---

# END OF GUIDE
