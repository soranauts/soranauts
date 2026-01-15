# Soranauts Key Decisions

> **Last Updated:** 2026-01-15
> **Rule:** Every decision must have evidence (commit, file, or comment)

---

## Decision Log

### 2025-12 — Glossary v2025 Migration

| Aspect | Detail |
|--------|--------|
| **Decision** | Migrated to Glossary v2025 format with phased rollout |
| **Evidence** | Commits: `d3dc925`, `b8df06d`, `1aac250` |
| **Reason** | Standardize glossary data structure, enable aliases, improve search |
| **Phases** | Phase 7 (UI migration) → Phase 8 (canonical UI) → Phase 9 (final rollout) |

### 2025-12 — Starlight Integration

| Aspect | Detail |
|--------|--------|
| **Decision** | Use Starlight native Pagefind instead of custom search |
| **Evidence** | Commit: `b0ed154` |
| **Reason** | Better styling, native integration, reduced maintenance |

### 2025-11 — Monorepo Structure

| Aspect | Detail |
|--------|--------|
| **Decision** | Organize as pnpm monorepo with apps/ and packages/ |
| **Evidence** | File: `pnpm-workspace.yaml` |
| **Reason** | Separate concerns: web app, blockchain facade, shared config |

### 2025-11 — Glossary Tag Diversification

| Aspect | Detail |
|--------|--------|
| **Decision** | Diversify tags based on category |
| **Evidence** | Commit: `3717c9d` |
| **Reason** | Improve discoverability and SEO |

### 2025-11 — Remove Duplicate Chips

| Aspect | Detail |
|--------|--------|
| **Decision** | Remove duplicate chips from term hero, use Related section only |
| **Evidence** | Commit: `54fa677` |
| **Reason** | Cleaner UI, avoid redundancy |

---

## Recent Decisions (From Git Log)

| Hash | Decision |
|------|----------|
| 54fa677 | refactor: Remove duplicate chips from term hero |
| b0ed154 | fix(search): use Starlight native Pagefind |
| 3717c9d | feat(glossary): diversify tags based on category |
| d3dc925 | Phase 9: Final rollout — Glossary v2025 |
| 04d969a | feat: add Starlight custom CSS with Soranauts design tokens |

---

## How to Add Decisions

1. Find evidence: `git log --oneline --grep="[keyword]"`
2. Only add if you can point to proof
3. Mark "Reason: Undocumented" if no reason in code
