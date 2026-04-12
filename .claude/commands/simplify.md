---
description: Code simplification audit — reviews recent changes for reuse, quality, and efficiency
---

# /simplify — Code Simplification Audit

Run a simplification review on recently changed files. Report only — do not modify any files.

## Steps

1. Run `git diff --name-only HEAD~3` to identify recently changed files. If a specific file or directory was provided as an argument, use that instead.

2. For each file, evaluate against these five principles:

**Principle 1 — Preserve Behavior Exactly**
Would any proposed simplification change inputs, outputs, side effects, error behavior, or edge cases? If uncertain, skip it.

**Principle 2 — Follow Project Conventions**
Read CLAUDE.md and neighboring code. Does this file match the project's patterns for imports, naming, error handling, and types? Flag inconsistencies.

**Principle 3 — Prefer Clarity Over Cleverness**
Find: dense ternary chains, chained reduces with inline logic, clever one-liners that require a mental pause. Suggest the explicit alternative.

**Principle 4 — Maintain Balance**
Watch for over-simplification traps:
- Inlining a helper that gave a concept a name
- Combining unrelated logic into one function
- Removing abstraction that exists for testability
- Optimizing for line count instead of comprehension

**Principle 5 — Verify with Tests**
Confirm tests exist for any code you'd propose simplifying. If no tests cover it, flag that as the first action item — not the simplification.

3. For each finding, report:
   - File and line range
   - Which principle applies
   - Current code snippet (brief)
   - Proposed simplification (brief)
   - Risk level: LOW (pure readability) / MEDIUM (logic restructure) / HIGH (touches shared interface)

4. Output format:

~~~
## Simplification Report

### [filename]
**Finding 1** (Principle N — [name]) — Risk: [level]
Current: [snippet]
Proposed: [snippet]
Rationale: [one sentence]

### Summary
- Total files reviewed: N
- Findings: N (LOW: N, MEDIUM: N, HIGH: N)
- Files with no findings: [list]
~~~

## Anti-Rationalizations

- "This file is fine, no need to look closely" → Look closely. That's the task.
- "This is just style preference" → Apply Principle 2. Match the project, not your preference.
- "I should just fix this while I'm here" → No. Report only. Never modify files.
- "The code is too complex to simplify safely" → Report it as HIGH risk. Let the human decide.

## Rules
- Do not commit
