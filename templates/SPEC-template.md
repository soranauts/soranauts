# [Feature Name] — Specification

> **LEAD-V Usage:** Fill this in during SCOUT planning or after brainstorming. Share with IMPLEMENT before the first P1 prompt. This locks engineering decisions so IMPLEMENT doesn't have to guess.

---

## 1. Objective

**What:** [One sentence — what are we building?]
**Why:** [One sentence — what problem does this solve?]
**Success criteria:** [How do we know it's done? Be specific and testable.]

---

## 2. Commands

~~~bash
# Build
[e.g., npm run build]

# Test
[e.g., npm test -- --coverage]

# Dev
[e.g., npm run dev]

# Lint
[e.g., npm run lint --fix]
~~~

---

## 3. Project Structure

Where does new code go? Map it explicitly.

~~~
[e.g., apps/web/app/(marketing)/feature/  → Page routes]
[e.g., apps/web/lib/feature/              → Business logic]
[e.g., apps/web/components/feature/       → UI components]
[e.g., supabase/migrations/               → Database changes]
~~~

---

## 4. Code Style

One real code snippet showing the project's conventions beats three paragraphs describing them. Paste an example of well-written code from this codebase that the new feature should follow:

~~~typescript
// Paste example here
~~~

- **Naming conventions:** [e.g., camelCase functions, PascalCase components, kebab-case files]
- **Import ordering:** [e.g., React → third-party → internal → types]

---

## 5. Testing Strategy

- **Framework:** [e.g., Vitest, Jest, Playwright]
- **Test location:** [e.g., colocated `tests/` dirs, top-level `tests/`]
- **Coverage expectation:** [e.g., all new business logic, not UI glue]
- **Test levels:**
  - **Unit:** [what gets unit tested]
  - **Integration:** [what gets integration tested]
  - **E2E:** [what gets e2e tested, if anything]

---

## 6. Boundaries

### Always Do

- [e.g., Run tests before marking task complete]
- [e.g., Follow CLAUDE.md conventions]
- [e.g., Validate inputs at API boundaries]

### Ask First

- [e.g., Database schema changes]
- [e.g., Adding new dependencies]
- [e.g., Changing shared component APIs]

### Never Do

- [e.g., Commit secrets or API keys]
- [e.g., Modify files outside task scope]
- [e.g., Remove failing tests without approval]
