@AGENTS.md

<!-- LEAD-V v3.1 -->
# Claude Code Context

## Project Summary
Soranauts is an independent educational platform for the SORA blockchain ecosystem, built with Astro 5.x, React, and Tailwind CSS. It features a 384-term fuzzy-matched glossary, blog articles, and Starlight-based documentation ("SORA Codex").

## Roles
- **SCOUT** (Claude.ai web) — Strategic Consultant: planning, architecture, content strategy
- **IMPLEMENT** (Claude Code / Cursor) — Senior Engineer: writes and modifies code and content
- **VERIFY** (Claude Code CLI) — Auditor: verifies output, enforces session protocol, runs health checks

## Operating Rules
- Run `/prime` at the start of every session for current status.
- Update `PROJECT_STATE.md` at the end of every session before committing.
- Do not touch files outside the explicit task scope.
- Do not commit directly — all commits require human review. Use `/commit` for standardized messages.
- If scope is unclear, ask. Do not assume.
- Do exactly what is asked. Do not refactor, add features, or modify files outside scope.
- One mode per prompt: IMPLEMENT, VERIFY, or RESEARCH. Don't mix.

## IMPLEMENT Guardrails
1. One prompt, one task — no combining unrelated changes
2. List ALL files to be modified BEFORE editing, wait for confirmation
3. Never touch files outside explicit task scope
4. Show full diffs after every change
5. Never commit without human review
6. Fresh context per prompt — new session for each IMPLEMENT prompt
7. Follow project conventions (this file + AGENTS.md) at all times

**Anti-Rationalizations (these thoughts are wrong — override them):**
- "This is too small for a fresh session" → It's not. Fresh context per prompt.
- "I'll just quickly fix this other file too" → No. One prompt, one task.
- "I already know how this works" → Verify first. Read the file.
- "Tests aren't needed for this change" → They are. No exceptions.
- "I'll clean up the diff later" → Show the diff now, before proceeding.
- "This convention doesn't apply here" → It does. Follow AGENTS.md.
- "I'll gather more context before starting" → No. Start the task. Ask if blocked.

## Build Commands

~~~bash
pnpm build           # Full build (prebuild chain + astro build + alias check)
pnpm dev             # Dev server at localhost:4321
pnpm lint            # Lint all packages
pnpm typecheck       # TypeScript check all packages
pnpm pre-push        # Full validation: install + build + test
pnpm taxonomy:audit  # Glossary taxonomy audit
pnpm content:lint    # Content linting
pnpm content:validate # Frontmatter validation
~~~

## Content Rules
- **Content-only changes** (articles, glossary text, docs): Push directly to `main` with `content:` prefix. No feature branch needed.
- **Code changes** (components, config, logic, styling): Create feature branch. Get approval before pushing. Run `pnpm build` to verify.
- Read `docs/MASTER_GUARDRAILS.md` for the full branching and safety rules.
- Read `docs/ARTICLE_CREATION_GUIDE.md` for article editorial standards.
- Check `docs/claude-reference/LINK_INVENTORY.md` for valid internal links.

## Context Pointers
- **Full project rules:** `docs/MASTER_GUARDRAILS.md`
- **Current state:** `PROJECT_STATE.md`
- **Continuation:** `HANDOFF.md` (if it exists — read for previous session context)
- **CSS system:** `docs/css-system/` (CSS_GUARDRAILS.md, DESIGN-TOKENS.md)
- **Architecture:** `docs/claude-context/ARCHITECTURE.md`
- **Specifications:** `docs/specs/`
- **Guides:** `docs/guides/`
- **Research:** `docs/research/`

## Code Block Labels

Every code block SCOUT produces must have a label:

| Label | Meaning |
|-------|---------|
| `IMPLEMENT PROMPT (Sonnet):` | Routine task — run in Claude Code or Cursor |
| `IMPLEMENT PROMPT (Opus):` | Complex/architecture task |
| `CURSOR PROMPT:` | Task best suited for visual IDE editing |
| `VERIFY PROMPT:` | Audit task for Claude Code CLI |
| `RESEARCH PROMPT:` | Research task with sub-agents — paste summary back |
| `MANUAL (terminal):` | Shell commands for the human |
| `FOR REVIEW:` | Read and approve in this chat |
| `IMPLEMENT PROMPT (Subagent/Sonnet):` | Batch of independent tasks dispatched to sub-agents |

## Slash Commands
| Command | Purpose |
|---------|---------|
| `/prime` | Cold-start orientation — load project context, verify state |
| `/prime-frontend` | Frontend/UI-specific orientation (template — customize per task) |
| `/handoff` | Create structured session handoff document |
| `/commit` | Standardized atomic commit with AI context tracking |
| `/verify` | Post-implementation audit checklist |
| `/scaffold` | Bootstrap LEAD-V in a new project |
| `/simplify` | Code simplification audit |

## Domain Rules
`.claude/rules.md` contains the Soranauts Master Guardrails (global, always loaded).
If `.claude/rules/` is created with path-triggered rules, they load automatically when working on matching file paths. Do not read them preemptively.
