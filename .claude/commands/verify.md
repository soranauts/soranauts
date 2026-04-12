---
description: Post-implementation audit — run the verification checklist as executable steps
argument-hint: [file-path-or-git-ref]
---

# Verify: Post-Implementation Audit

## Objective

Audit the most recent implementation for scope compliance, diff quality, build health, and state accuracy. This is the verification step of the Assistance Loop, run as executable checks rather than a manual checklist.

## Input

If `$ARGUMENTS` is provided, use it as the audit target:
- A file path: audit changes to that specific file
- A git ref (e.g., `HEAD~1`): audit changes since that ref
- Empty: audit the most recent uncommitted changes or last commit

```bash
if [ -n "$ARGUMENTS" ]; then
  echo "Audit target: $ARGUMENTS"
else
  echo "Audit target: most recent changes (uncommitted or last commit)"
fi
```

## Process

### 1. Identify What Changed

```bash
# If there are uncommitted changes, audit those:
git diff --stat HEAD
# If working tree is clean, audit the last commit:
git diff --stat HEAD~1 HEAD
# List any untracked files:
git ls-files --others --exclude-standard
```

Record the list of modified files for scope checking.

### 2. Scope Compliance

Read the original prompt or task description (from PROJECT_STATE.md, HANDOFF.md, or the human).

Check:
- [ ] **Files match prompt scope.** Were only the expected files modified?
- [ ] **No unintended creations.** Any new files that weren't requested?
- [ ] **No unintended deletions.** Any files removed that shouldn't have been?

Report: PASS or FAIL with specifics.

### 3. Diff Review

Read the full diff:

```bash
# Uncommitted changes:
git diff HEAD
# Or last commit:
git diff HEAD~1 HEAD
```

Check:
- [ ] **Every change makes sense** in the context of the task
- [ ] **No formatting-only changes** outside the task scope
- [ ] **No commented-out code** left behind (old code should be removed, not commented)
- [ ] **No TODO/FIXME/HACK placeholders** left as stubs instead of implementations

Report: PASS or FAIL with specifics.

### 4. File Inventory

- [ ] **File count reasonable.** Does the number of modified files match the task size?
- [ ] **File locations correct.** Are files in the expected directories per project conventions?
- [ ] **No surprise dependencies.** Check for unexpected new imports or packages.

Report: PASS or FAIL with specifics.

### 5. Build Verification

Detect and run the project's build/check commands:

```bash
# Detect project type and run appropriate checks:
if [ -f "package.json" ]; then
  # Check for available scripts
  grep -o '"typecheck"\|"lint"\|"build"\|"test"' package.json 2>/dev/null
  # Run type-check if available:
  npm run typecheck 2>&1 | tail -10 || npx tsc --noEmit 2>&1 | tail -10
  # Run lint if available:
  npm run lint 2>&1 | tail -10
  # Run build:
  npm run build 2>&1 | tail -10
elif [ -f "Cargo.toml" ]; then
  cargo check 2>&1 | tail -10
elif [ -f "pyproject.toml" ]; then
  python -m pytest --co -q 2>&1 | tail -10
fi
```

Check:
- [ ] **Build passes** (no errors)
- [ ] **No new warnings** introduced by this change
- [ ] **Tests pass** (if the project has tests)

Report: PASS or FAIL with specifics.

### 6. Content Accuracy

- [ ] **Output matches expected.** Does the implementation do what was requested?
- [ ] **Behavior is correct.** If UI: visually verify. If API: test the endpoint.

Report: PASS or FAIL with specifics.

### 7. State Updates

- [ ] **PROJECT_STATE.md reflects reality.** Current task, completed items, and bugs are accurate.
- [ ] **AI context changes documented.** If agent rules/commands/docs were modified, the commit should include a Context section.

Report: PASS or FAIL with specifics.

## Output

Summarize results:

~~~
### Verification Report

| Check | Result | Notes |
|-------|--------|-------|
| Scope compliance | PASS/FAIL | [details] |
| Diff review | PASS/FAIL | [details] |
| File inventory | PASS/FAIL | [details] |
| Build | PASS/FAIL | [details] |
| Content accuracy | PASS/FAIL | [details] |
| State updates | PASS/FAIL | [details] |

**Overall: PASS / FAIL**

[If FAIL — generate a scoped fix prompt below]
~~~

### If Any Check Fails

Generate a targeted IMPLEMENT prompt that fixes only what failed:

~~~
IMPLEMENT PROMPT (Sonnet):

## Task
[Fix the specific issue identified in verification]

## Context
[Reference the files and the verification failure]

## Constraints
- Only modify: [the specific files that need fixing]
- Do NOT: [touch anything else]

## Verification
[How to confirm the fix worked]
~~~

**Do not proceed to the next task until all checks pass.**

### If All Checks Pass

Update PROJECT_STATE.md with the verification result and recommend the next action.
