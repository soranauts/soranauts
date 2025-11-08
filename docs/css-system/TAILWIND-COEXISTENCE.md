# Tailwind Coexistence Guide

## Tailwind Is Still Active
- The site still imports `apps/web/src/assets/styles/tailwind.css` at the top of `Layout.astro` and keeps `tailwind.config.cjs` intact.
- Tailwind’s base/component/utility layers generate many of the classes currently used in templates and markdown content.

## Where Tailwind Is Used Today
- Most page templates, widgets, and markdown content rely on Tailwind utility strings for layout (`flex`, `grid`, spacing, typography, color states, etc.).
- Glossary-specific styles in `glossary.css` and related assets still use Tailwind utilities alongside newer tokenized rules.
- Legacy aliases in `tokens.css` (`--aw-*`) map to the previous palette so existing Tailwind-driven components remain visually unchanged.

## Role of the Layered CSS System
- Our custom layers (`tokens`, `base`, `components`, `utilities`) load after Tailwind, allowing token-driven classes to override or complement Tailwind utilities without removing them.
- New helpers in `utilities.css` offer token-aligned replacements for the most common Tailwind patterns (e.g., `.flex`, `.gap-4`, `.surface`).
- Component classes provide semantic alternatives to long Tailwind strings while matching existing visuals.

## Migration Strategy
- Continue authoring new work against the token-backed classes and utilities.
- When refactoring a template, replace multi-utility Tailwind blobs with their semantic counterparts (e.g., `.btn`, `.card-grid`, `.field`).
- Because both systems share the same token values, mixed usage is safe. Remove Tailwind dependencies only after confirming coverage by the layered system.

## Summary
Tailwind remains part of the toolchain today. The layered CSS system sits on top of it, shares the same design tokens, and enables a gradual, low-risk migration away from raw utility strings.
