---
title: 'Changelog'
layout: '~/layouts/MarkdownLayout.astro'
lastUpdated: '2025-11-28'
metadata:
  title: 'Changelog | Soranauts'
  description: 'Release notes and improvements shipped to the Soranauts platform.'
  robots:
    index: true
    follow: true
---

Soranauts is a living platform. Every deploy blends design, documentation, and automation work so contributors can trust what they read and ship faster. Below is an overview of the most impactful improvements currently on the main branch.

## 2025 Highlights

- **Design system refresh** — Gradient tokens, typography guardrails, and component polish now drive the About, Changelog, Donate, and future landing pages (`accd248`, `d059834`). Design tokens system with CSS variables and guardrails documentation ensures consistent branding across all components (`ef25e71`, `545f453`, `0f1d6f9`).
- **Story-first landing pages** — `/about` and `/changelog` were rebuilt with PageLayout, Stats, ItemGrid, and Timeline widgets to surface impact, roadmaps, and support paths in one glance (`accd248`, `f496615`).
- **Knowledge base hardening** — Nightly ingestion, provenance checkpoints, and SARIF-backed QA keep 1,000+ documents verifiable (`dbbe542`, `4fa31f8`, `accd248`).
- **Glossary v2025** — Canonical glossary dataset (52 canonical terms, 5 aliases, 0 deprecated) powers Explorer, search, and Tag Hub with consistent alias→canonical resolution, server + client redirects, canonical `<link>` tags, and XML sitemaps (`phase7–14`, `glossary.v2025.json`).
- **Unified search** — Pagefind-only search, clickable glossary cards, and glossary auto-linking deliver instant answers without external services (`a86edc1`, `a41dc2c`, `cc7bfd9`). The Command+K modal now has type-aware chips for **Glossary**, **Articles**, and **Tags**, alias microcopy, and improved tag search backed by Pagefind filters (`8a58707`, `3458f1b`, `65ce073`, `3dbeb63`).

## Design System & CSS Guardrails

- Design tokens system established with CSS variables for brand colors, theme values, and interaction overlays (`d059834`, `accd248`). All components now consume semantic tokens instead of hard-coded colors (`ef25e71`, `545f453`).
- CSS guardrails documentation provides authoritative rules for Tailwind usage, component scoping, and link styling to prevent regressions (`d059834`). No default blue links or ad-hoc color overrides allowed (`ef25e71`).
- Glossary UI improvements integrate design tokens for consistent category colors, hover states, and accessibility enhancements (`0f1d6f9`). About page polish aligns with the new token system (`545f453`).
- Component-level design patterns unified using `.card-link` and token-driven colors for blog cards, related articles, and clickable blocks (`545f453`).

## Knowledge Base & Content Automation

- Incremental ingestion and embedding caches reduce rebuild costs while keeping AI retrieval deterministic (`f067575`, `4fa31f8`).
- Automated pipelines now pull from the SORA wiki, Iroha docs, Medium ecosystem updates, and GitHub repositories nightly (`dbbe542`, `06a2cf2`).
- Article modernization program delivers TL;DR sections, comparison matrices, collapsible FAQs, and refreshed metadata across 26+ long-form guides (`d8b2b4f`, `f338cfb`, `ba3f75c`, `8c6e780`, `35e42d4`).

## Glossary Evolution

- Taxonomy hardening introduced category-aware relationships, aliases, and SORA v3 context for every term (`f7ed77e`, `155efaa`).
- Auto-linking precision improved to avoid tables/FAQs while still enhancing body copy (`c8c7081`, `e93b8d8`). Phase 11 added front-matter controls, alias→canonical linking, and per-paragraph deduplication for glossary autolinks.
- Cards gained full-click targets, search chips, and hover previews to make glossary browsing feel native (`b26e3c6`, `cc7bfd9`). V2025 cards now share a canonical-aware loader with Explorer and Tag Hub and can optionally show an "Updated on" timestamp (`GLOSSARY_CARD_SHOW_UPDATED`).
- Glossary UI improvements add accessibility enhancements with proper focus states, minimum touch targets, and keyboard navigation (`0f1d6f9`). Design token integration ensures consistent category colors and hover states (`0f1d6f9`, `545f453`), while the V3 term layout introduces structured sections, anchors, and keyboard-driven navigation (`FEATURE_GLOSSARY_V3_UI`).
- Alias handling now includes inline alias banners, “via alias” microcopy in popovers and search results, soft client redirects (`history.replaceState`), and optional 308 server/static redirects behind feature flags and Vercel `vercel.json` (`FEATURE_GLOSSARY_ALIAS_REDIRECT`).
- Definitions and one-line summaries were refreshed with updated sources, generator guards, and backfill scripts so no glossary card ships with `"TODO"` placeholders (`summary backfill`, `glossary.v2025` generator).

## Search & Discovery

- Unified Pagefind search replaced Typesense, cutting infrastructure costs while keeping instant results (`a86edc1`, `a2e51f4`). Pagefind CLI integrated directly into Astro build process for seamless search index generation (`ba2e04f`).
- Search modal refreshed with improved highlighting, better styling, and enhanced keyboard navigation (`8a58707`, `3458f1b`, `65ce073`). It now exposes separate tabs for glossary entries, long-form articles, and tag pages, with type + category filters and alias-aware analytics events.
- Sitemaps, canonical enforcement, and direct-path redirects ensure every article is reachable by users and bots (`9c2b579`, `c8a0aa8`, `914ea99`, `6f30dd3`). Dedicated glossary sitemaps for canonical and alias URLs (52/5) and `<link rel="canonical">` tags on term pages keep search engines focused on the v2025 dataset (`generate-glossary-sitemaps.ts`, Phase 9/13).
- Related Articles and improvements to nav hierarchy boost serendipitous discovery (`011aae7`, `3e7e20b`). Explore page reordered to show Foundational Topics and Quick Paths before search for better discoverability (`ccab8f8`), and Explorer now surfaces glossary context + related articles via `article-glossary-map.json` when flags are enabled (`FEATURE_EXPLORER_GLOSSARY_CONTEXT`, `FEATURE_GLOSSARY_RELATED_ARTICLES`).

## Publishing, SEO & Sharing

- Standardized 1200×630 Open Graph images, canonical URL audits, and metadata refreshes keep social and SERP previews accurate (`bbbd80d`, `26559d3`, `9c2b579`).
- Telegram/social sharing bugs were resolved with cache-busted assets and Vercel image optimizations (`a5be70a`, `5d64729`, `607ba31`).
- Vercel Analytics and Speed Insights give ongoing performance visibility (`f20902f`, `11f4b1e`).

## Platform & CI Reliability

- Monorepo migration consolidated web + knowledge base code with pnpm standardization for reproducible builds (`2fdd5ea`, `607ba31`, `d5bc323`).
- CI guardrails prevent large file commits, enforce incremental cache rules, and keep Pagefind builds green (`32ed0fe`, `f9b689a`, `100d940`). New cross-system tests cover glossary sitemaps, canonical links, alias resolution, autolink exclusions, and Explorer glossary context (`tests/cross/*`, Phase 13).
- Vercel + pnpm version parity fixes removed deployment blockers (`bdc07fe`, `d942893`, `4f9b733`). A dedicated Redirects Guard workflow now verifies production glossary alias 308s and dataset counts against `vercel.json` on a schedule and via manual dispatch (`.github/workflows/redirects-guard.yml`).
- Build warnings silenced for JSON imports and prerender configurations (`5192c32`). Vercel adapter added and build warnings addressed (`76f2c9f`). Reverted to static build after Vercel adapter failure (`c941393`).
- Mobile navigation action bar visibility improved for better UX (`de71629`).
- **Responsive navigation overhaul** — Mobile menu extended to 1024px breakpoint (was 768px) for improved tablet experience (`d292ab6`). Desktop navigation spacing optimized with responsive gaps and font sizing to prevent overflow on tablets. Touch targets improved to meet 44px minimum accessibility standard across all interactive elements. Header padding adjusted for better tablet spacing (`lg:px-6 xl:px-8`).

## Looking Ahead

We are tracking additional UX experiments (interactive metrics, contributor dashboards, deeper Explorer–glossary integrations) and are continuing the article modernization rollout across 2024–2025 posts. If you spot an issue or want to suggest a feature, drop a note in the [Soranauts Telegram](https://t.me/Soranauts).

---

*Last updated: November 28, 2025*
