---
description: Cold-start orientation — load project context before any work
---

# Prime: Load Project Context

## Objective

Build understanding of the project's current state before beginning any work. This replaces ad-hoc file reading with a structured, repeatable orientation that keeps the context window lean.

## Process

### 1. Read Agent Rules

Read `AGENTS.md` in full — project identity, tech stack, folder structure, conventions.
Read `CLAUDE.md` for pointers to additional context files.

If `.claude/rules/` exists, list the files but do NOT read them yet — they load on demand when you work on matching paths.

### 2. Read Current State

Read `PROJECT_STATE.md` — current phase, active task, known bugs, next steps, session log.

### 3. Check Git State

```bash
git log --oneline -12
git status
git branch --show-current
git diff --stat HEAD
```

### 4. Verify State Accuracy

Compare `PROJECT_STATE.md` claims against what you see in git log and the filesystem:

- Does the "current task" match recent commits?
- Are items marked as completed actually done?
- Are there uncommitted changes not mentioned in state?
- Were any AI context files (`.cursorrules`, `AGENTS.md`, `CLAUDE.md`, `.claude/rules/`, `.claude/commands/`) modified in recent commits? If so, note what changed.

Flag every discrepancy.

### 5. Read the Development Plan (if applicable)

If `DEVELOPMENT-PLAN.md` or equivalent exists, read it to understand:
- Phase structure and current position
- What comes next after the current task
- Any blocked items or dependencies

### 6. Check for Handoff

If `HANDOFF.md` exists, read it for continuation context from the previous session:
- What was completed
- What is in progress
- Key decisions and their rationale
- Dead ends to avoid
- Recommended first action

### 7. Check Environment Health (quick)

```bash
# Adapt these to your project's stack:
# Node/Next.js:
npx next build 2>&1 | tail -5
# or just type-check:
npx tsc --noEmit 2>&1 | tail -10
```

Only run if the project has a build step. Skip for research-only sessions.

## Output

Summarize in under 200 words using this structure:

~~~
### Project State
- Phase: [current phase]
- Task: [current task from PROJECT_STATE.md]
- Branch: [branch name]
- Last 3 commits: [one-line summaries]
- Uncommitted changes: [yes/no, brief description]
- State discrepancies: [any mismatches between PROJECT_STATE.md and reality]

### Environment
- Build: [passing/failing/not checked]
- Known bugs: [from PROJECT_STATE.md]

### AI Context Changes
- [Any recent changes to rules, commands, or agent docs — or "none"]

### Continuation
- [HANDOFF.md summary if present, or "no handoff document"]

### Recommended First Action
- [What should happen next based on all of the above]
~~~

**Do not begin any work until the human confirms the state is accurate and approves the recommended action.**
