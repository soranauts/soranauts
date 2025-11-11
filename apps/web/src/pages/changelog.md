---
title: 'Changelog'
layout: '~/layouts/MarkdownLayout.astro'
lastUpdated: '2025-01-27'
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
- **Glossary 2.0** — 75+ definitions, taxonomy-driven relations, hover cards, and Telegram-friendly previews make SORA terminology approachable (`f7ed77e`, `155efaa`, `b26e3c6`). Recent UI improvements add accessibility enhancements, design token integration, and refreshed definitions (`0f1d6f9`, `97e44bf`, `b60c31a`).
- **Unified search** — Pagefind-only search, clickable glossary cards, and glossary auto-linking deliver instant answers without external services (`a86edc1`, `a41dc2c`, `cc7bfd9`). Pagefind CLI integration and search modal refresh improve highlighting and keyboard navigation (`ba2e04f`, `8a58707`, `3458f1b`, `65ce073`).

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
- Auto-linking precision improved to avoid tables/FAQs while still enhancing body copy (`c8c7081`, `e93b8d8`).
- Cards gained full-click targets, search chips, and hover previews to make glossary browsing feel native (`b26e3c6`, `cc7bfd9`).
- Glossary UI improvements add accessibility enhancements with proper focus states, minimum touch targets, and keyboard navigation (`0f1d6f9`). Design token integration ensures consistent category colors and hover states (`0f1d6f9`, `545f453`).
- Definitions refreshed with updated sources and corrected external links (`97e44bf`, `b60c31a`).

## Search & Discovery

- Unified Pagefind search replaced Typesense, cutting infrastructure costs while keeping instant results (`a86edc1`, `a2e51f4`). Pagefind CLI integrated directly into Astro build process for seamless search index generation (`ba2e04f`).
- Search modal refreshed with improved highlighting, better styling, and enhanced keyboard navigation (`8a58707`, `3458f1b`, `65ce073`). Search highlight styling improved and features page search functionality fixed (`3458f1b`).
- Sitemaps, canonical enforcement, and direct-path redirects ensure every article is reachable by users and bots (`9c2b579`, `c8a0aa8`, `914ea99`, `6f30dd3`).
- Related Articles and improvements to nav hierarchy boost serendipitous discovery (`011aae7`, `3e7e20b`). Explore page reordered to show Foundational Topics and Quick Paths before search for better discoverability (`ccab8f8`).

## Publishing, SEO & Sharing

- Standardized 1200×630 Open Graph images, canonical URL audits, and metadata refreshes keep social and SERP previews accurate (`bbbd80d`, `26559d3`, `9c2b579`).
- Telegram/social sharing bugs were resolved with cache-busted assets and Vercel image optimizations (`a5be70a`, `5d64729`, `607ba31`).
- Vercel Analytics and Speed Insights give ongoing performance visibility (`f20902f`, `11f4b1e`).

## Platform & CI Reliability

- Monorepo migration consolidated web + knowledge base code with pnpm standardization for reproducible builds (`2fdd5ea`, `607ba31`, `d5bc323`).
- CI guardrails prevent large file commits, enforce incremental cache rules, and keep Pagefind builds green (`32ed0fe`, `f9b689a`, `100d940`).
- Vercel + pnpm version parity fixes removed deployment blockers (`bdc07fe`, `d942893`, `4f9b733`).
- Build warnings silenced for JSON imports and prerender configurations (`5192c32`). Vercel adapter added and build warnings addressed (`76f2c9f`). Reverted to static build after Vercel adapter failure (`c941393`).
- Mobile navigation action bar visibility improved for better UX (`de71629`).
- **Responsive navigation overhaul** — Mobile menu extended to 1024px breakpoint (was 768px) for improved tablet experience (`d292ab6`). Desktop navigation spacing optimized with responsive gaps and font sizing to prevent overflow on tablets. Touch targets improved to meet 44px minimum accessibility standard across all interactive elements. Header padding adjusted for better tablet spacing (`lg:px-6 xl:px-8`).

## Looking Ahead

We are tracking additional UX experiments (interactive metrics, contributor dashboards) and are continuing the article modernization rollout across 2024–2025 posts. If you spot an issue or want to suggest a feature, drop a note in the [Soranauts Telegram](https://t.me/Soranauts).

---

*Last updated: January 27, 2025*
