---
title: 'Website Improvements'
layout: '~/layouts/MarkdownLayout.astro'
lastUpdated: '2025-11-09'
metadata:
  title: 'Website Improvements | Soranauts'
  description: 'Recent improvements and new features added to the Soranauts website.'
  robots:
    index: true
    follow: true
---

Soranauts is a living platform. Every deploy blends design, documentation, and automation work so contributors can trust what they read and ship faster. Below is an overview of the most impactful improvements currently on the main branch.

## 2025 Highlights

- **Design system refresh** — Gradient tokens, typography guardrails, and component polish now drive the About, Changelog, Donate, and future landing pages (`accd248`, `d059834`).
- **Story-first landing pages** — `/about` and `/changelog` were rebuilt with PageLayout, Stats, ItemGrid, and Timeline widgets to surface impact, roadmaps, and support paths in one glance (`accd248`, `f496615`).
- **Knowledge base hardening** — Nightly ingestion, provenance checkpoints, and SARIF-backed QA keep 1,000+ documents verifiable (`dbbe542`, `4fa31f8`, `accd248`).
- **Glossary 2.0** — 130+ definitions, taxonomy-driven relations, hover cards, and Telegram-friendly previews make SORA terminology approachable (`f7ed77e`, `155efaa`, `b26e3c6`, `0336296`, `432e2c8`, `bb0b5be`).
- **Unified search** — Pagefind-only search, clickable glossary cards, and glossary auto-linking deliver instant answers without external services (`a86edc1`, `a41dc2c`, `cc7bfd9`).

## Knowledge Base & Content Automation

- Incremental ingestion and embedding caches reduce rebuild costs while keeping AI retrieval deterministic (`f067575`, `4fa31f8`).
- Automated pipelines now pull from the SORA wiki, Iroha docs, Medium ecosystem updates, and GitHub repositories nightly (`dbbe542`, `06a2cf2`).
- Article modernization program delivers TL;DR sections, comparison matrices, collapsible FAQs, and refreshed metadata across 26+ long-form guides (`d8b2b4f`, `f338cfb`, `ba3f75c`, `8c6e780`, `35e42d4`).

## Glossary Evolution

- Taxonomy hardening introduced category-aware relationships, aliases, and SORA v3 context for every term (`f7ed77e`, `155efaa`).
- Auto-linking precision improved to avoid tables/FAQs while still enhancing body copy (`c8c7081`, `e93b8d8`).
- Cards gained full-click targets, search chips, and hover previews to make glossary browsing feel native (`b26e3c6`, `cc7bfd9`).

## Search & Discovery

- Unified Pagefind search replaced Typesense, cutting infrastructure costs while keeping instant results (`a86edc1`, `a2e51f4`).
- Sitemaps, canonical enforcement, and direct-path redirects ensure every article is reachable by users and bots (`9c2b579`, `c8a0aa8`, `914ea99`, `6f30dd3`).
- Related Articles and improvements to nav hierarchy boost serendipitous discovery (`011aae7`, `3e7e20b`).
- Glossary search assets now preload safely even during static builds, preventing empty states when Pagefind hasn’t warmed yet (`bb0b5be`, `c941393`).

## Publishing, SEO & Sharing

- Standardized 1200×630 Open Graph images, canonical URL audits, and metadata refreshes keep social and SERP previews accurate (`bbbd80d`, `26559d3`, `9c2b579`).
- Telegram/social sharing bugs were resolved with cache-busted assets and Vercel image optimizations (`a5be70a`, `5d64729`, `607ba31`).
- Vercel Analytics and Speed Insights give ongoing performance visibility (`f20902f`, `11f4b1e`).

## Platform & CI Reliability

- Monorepo migration consolidated web + knowledge base code with pnpm standardization for reproducible builds (`2fdd5ea`, `607ba31`, `d5bc323`).
- CI guardrails prevent large file commits, enforce incremental cache rules, and keep Pagefind builds green (`32ed0fe`, `f9b689a`, `100d940`).
- Vercel + pnpm version parity fixes removed deployment blockers (`bdc07fe`, `d942893`, `4f9b733`).
- Static build path reinstated after adapter regressions; JSON import warnings fixed and Quote API now skips rate limiting during prerender to keep deploys reliable (`5192c32`, `76f2c9f`, `c941393`, `bb0b5be`).
- Mobile navigation action bar received contrast updates so search and theme controls remain visible at all breakpoints (`de71629`).
- Legacy Markdown duplicates were removed so Astro pages render authoritative `/about` and `/changelog` content (`c2f4859`).

## Looking Ahead

We are tracking additional UX experiments (interactive metrics, contributor dashboards) and are continuing the article modernization rollout across 2024–2025 posts. If you spot an issue or want to suggest a feature, drop a note in the [Soranauts Telegram](https://t.me/Soranauts).

---

*Last updated: November 9, 2025*