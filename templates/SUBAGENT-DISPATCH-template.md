# Subagent Dispatch — [Feature/Batch Name]

> **LEAD-V Usage:** SCOUT generates this prompt. Human reviews and runs it as a single IMPLEMENT session. IMPLEMENT spawns sub-agents via the Agent tool. Human reviews the aggregate diff. VERIFY audits after.

## Mode

This is an `IMPLEMENT PROMPT (Subagent/Sonnet):` — a single prompt that dispatches multiple independent tasks to sub-agents with built-in review. Use `(Subagent/Opus):` for complex or architecture-sensitive batches.

## Rules for the Coordinator (You)

1. Spawn ONE sub-agent per task using the Agent tool
2. Each sub-agent gets ONLY its task description and relevant file paths — no session history
3. After each sub-agent completes, spawn a review sub-agent that checks:
   - **Spec compliance:** Does the implementation match the task description exactly?
   - **Code quality:** Is it consistent with CLAUDE.md? Clean, readable, no unnecessary changes?
4. If either review fails, the original sub-agent fixes and re-reviews (max 2 retries, then mark BLOCKED)
5. Do NOT commit — show aggregate diff when all tasks complete
6. Report final status per task: PASS / FAIL / BLOCKED

## Anti-Rationalizations
- "I can do these tasks myself without sub-agents" → No. Dispatch them. Fresh context per task prevents drift.
- "This task is too small for a sub-agent" → Dispatch it anyway. Consistency matters more than efficiency.
- "The review sub-agent is overkill for this" → It's not. Two-stage review is the point.
- "I'll batch these related tasks into one sub-agent" → No. One task, one sub-agent. Independence is the constraint.
- "I'll commit as I go" → Never. Aggregate diff at the end. Human reviews before any commit.

## When to Use This Mode

- 4+ independent tasks that don't depend on each other's output
- Batch operations (adding multiple routes, components, schema types)
- Tasks where each can be verified in isolation
- NOT for tightly coupled changes where task 3 depends on task 2's output

## Tasks

- [ ] **Task 1:** [Description. Include exact file paths and expected behavior.]
- [ ] **Task 2:** [Description.]
- [ ] **Task 3:** [Description.]
- [ ] **Task 4:** [Description.]

## Shared Context for All Sub-Agents

[Any project conventions, file patterns, or reference code that every sub-agent needs. Keep minimal — only what's required.]
