---
description: Write a session handoff document for the next session
---

# Handoff: Capture Session State for Continuation

## Objective

Create a structured handoff document that captures everything the next session needs to continue seamlessly. This externalizes the session's memory into a persistent file and compresses it to essentials.

## When to Use

- Before ending a long session where work will continue later
- Before hitting context limits (proactive, not reactive — heuristic: 25+ exchanges, 12+ files read, repeated mistakes, or 40% context usage)
- When switching phases (research → implementation, implementation → verification)
- Instead of relying on /compact for critical ongoing work

## Process

### 1. Analyze the Current Session

Review everything that happened:

- What was the original goal or task?
- What has been completed so far?
- What is still in progress or blocked?
- What key decisions were made and WHY?
- What files were read, created, or modified?
- What errors were encountered and how were they resolved?
- What dead ends were explored (so the next session doesn't repeat them)?

### 2. Gather Current State
```bash
git status
git diff --stat HEAD
git log --oneline -5
git branch --show-current
```

### 3. Archive Previous Handoff (if exists)

If `HANDOFF.md` already exists, move it to preserve history:
```bash
if [ -f "HANDOFF.md" ]; then
  PREV_DATE=$(head -5 HANDOFF.md | grep -o '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}' | head -1)
  mv HANDOFF.md "docs/handoffs/HANDOFF-${PREV_DATE:-previous}.md" 2>/dev/null || \
  mv HANDOFF.md "HANDOFF-previous.md"
fi
```

### 4. Write the Handoff Document

Save to: `HANDOFF.md` in the project root.

Use this structure:
```markdown
# Handoff: [Brief Task Description]

**Date:** [current date]
**Branch:** [current branch name]
**Last Commit:** [hash + message, or "uncommitted changes"]

## Goal

[1-2 sentences: what we're trying to accomplish.]

## Completed

- [x] [Task 1 — brief description of what was done]
- [x] [Task 2 — brief description]

## In Progress / Next Steps

- [ ] [Task 3 — what needs to happen next, with enough detail to act on]
- [ ] [Task 4 — include file paths and specific areas to focus on]

## Key Decisions

Document WHY choices were made, not just what was chosen:

- **[Decision]**: [What was chosen] — [Why, including alternatives rejected]

## Dead Ends (Don't Repeat These)

- [Approach that was tried and didn't work] — [Why it failed]
- [Investigation path that was irrelevant] — [What we found instead]

## Files Changed

- `path/to/file.ts` — [what changed and why, 1 line]
- `path/to/new-file.ts` — [NEW: what this file does]

## Current State

- **Build:** [passing/failing]
- **Tests:** [passing/failing — which specific tests]
- **Uncommitted changes:** [yes/no, what]

## Context for Next Session

[2-4 sentences: the MOST IMPORTANT thing the next agent needs to know.]

**Recommended first action:** [Exact command or step to take first]
```

### 5. Confirm

After writing the handoff:

1. Confirm the file was written with its full path
2. Suggest: "Next session: run /prime — it will read this handoff automatically."
3. If there are uncommitted changes, suggest running /commit first

## Quality Criteria

A good handoff should:
- Let a fresh agent continue without asking clarifying questions
- Be under 100 lines (concise — link to files, don't duplicate content)
- Include enough "why" context for the next agent to make the same decisions
- List dead ends to prevent wasted exploration
- Have a concrete "first action" recommendation

## Anti-patterns

- Don't include full file contents — reference paths instead
- Don't include conversation history — summarize findings
- Don't be vague ("fix the bug") — be specific ("fix SSE reconnection in hooks/useSSE.ts")
- Don't skip Dead Ends — this prevents the most common wasted effort
- Don't skip Key Decisions — without it, the next agent may reverse your choices
