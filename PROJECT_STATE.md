<!-- LEAD-V v3.1 -->
# Soranauts — Project State

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-04-12 (Session 1)
> Updated by: SCOUT — LEAD-V v3.1 installation

## Phase Status

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Site Launch | COMPLETE | v1.0.0 released, live at soranauts.com |
| 1 | LEAD-V Installation | IN PROGRESS | Installing v3.1 framework |
| 2 | Iroha Lab | NOT STARTED | Taira testnet connection (separate repo) |
| 3 | Content Pipeline | NOT STARTED | CBDC comparison article, stakeholder outreach |

## Environment Status

- **Package manager:** pnpm 9.12.2 (enforced via preinstall check)
- **Build:** PASSING as of 2026-04-12 (main branch, clean working tree)
- **Deployment:** Vercel (soranauts.com)
- **Tests:** Vitest (unit) + Playwright (E2E)
- **Content:** 194 glossary MDX, 46 blog posts, 26 docs pages

## Known Bugs

None reported.

## Current Task

Installing LEAD-V v3.1 framework into the Soranauts repo:
- Slash commands in `.claude/commands/` (7 commands)
- Root context files: CLAUDE.md, AGENTS.md, VERIFY.md, this file
- Templates directory (INITIAL, SPEC, SUBAGENT-DISPATCH)
- Research analyst agent definition
- .gitignore updates for LEAD-V entries

## What Was Done Last Session

- P1: Research prompt — mapped existing repo state for LEAD-V installation
- Confirmed: no root CLAUDE.md, AGENTS.md, VERIFY.md exist (clean slate)
- Confirmed: `.claude/` exists with `rules.md` (379 lines) and `settings.local.json`
- Confirmed: `.claude/` is gitignored — needs selective update for commands to be tracked
- Confirmed: no turbo.json (uses pnpm --filter, not Turborepo)

## Active Blockers

None.

## Immediate Next Tasks (In Order)

1. Complete LEAD-V v3.1 file installation (P2)
2. Verify installation with `/prime`
3. Resume Iroha Lab work (P0.5.4 — Taira testnet `02-taira-connect.ts`)

## Session Log

| Session | Date | Focus | Commit |
|---------|------|-------|--------|
| 1 | 2026-04-12 | LEAD-V v3.1 installation | pending |

## Session Notes

- `.cursorrules` (379 lines) has minor drift from `.claude/rules.md` — "368 terms" vs "384 terms". Out of scope for this installation; flag for future cleanup.
- Existing `docs/claude-context/CLAUDE.md` is NOT the root CLAUDE.md Claude Code reads. The new root CLAUDE.md supersedes it for agent context; the docs version can be archived.

---

## New Session Starter Prompts

### General opener

~~~
Continuing Soranauts development. Follow the Session Protocol.
Read PROJECT_STATE.md and tell me the current status and recommended next task.
Don't start implementation until I confirm.
~~~

### Task-specific template

~~~
Execute [TASK_ID] — [brief description].

Read the full prompt spec before starting.
[Any extra context]

Verify: [what success looks like].
When done, update state and commit.
~~~
