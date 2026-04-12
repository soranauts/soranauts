---
description: Create a standardized atomic commit with AI context tracking
---

# Commit: Standardized Atomic Commit

## Process

### 1. Review Changes

```bash
git status
git diff HEAD
git diff --stat HEAD
git ls-files --others --exclude-standard
```

Check for files that should NOT be committed:
- `.env` or credential files
- Large binary files
- Files unrelated to the current task
- `HANDOFF.md` (session-temporary, not persistent)

### 2. Stage Relevant Files

Add only files related to the current task. Stage deliberately — never `git add .` without reviewing.

```bash
# Stage specific files:
git add path/to/file1.ts path/to/file2.ts

# Or stage by directory if all changes in the directory are related:
git add src/components/auth/
```

### 3. Verify Staging

Confirm what is staged vs unstaged:

```bash
git diff --cached --stat
git diff --stat
```

If nothing is staged, stop:

```bash
git diff --cached --quiet && echo "Nothing staged — nothing to commit" && exit 0
```

### 4. Identify AI Context Changes

Check if any of these are in the staged changes:
- `.cursorrules`
- `AGENTS.md` or `CLAUDE.md`
- `.claude/rules/*.md`
- `.claude/commands/*.md`
- `PROJECT_STATE.md`
- `DEVELOPMENT-PLAN.md`
- Any files in `docs/specs/`, `docs/guides/`, or `lead-framework/`

If yes, the commit message needs a `Context:` section.

### 5. Construct Commit Message

Use conventional commit format with scope:

**Tags:**
- `feat:` — New capability or feature
- `fix:` — Bug fix
- `refactor:` — Code restructure without behavior change
- `docs:` — Documentation only
- `test:` — Test additions or fixes
- `chore:` — Build, CI, tooling changes
- `perf:` — Performance improvement
- `style:` — Formatting, CSS, visual changes (no logic change)

**Format:**

~~~
tag(scope): concise description of what changed

[Body — explain WHY this change was made, not just what changed.
Include context that isn't obvious from the diff.]

[Context: section — only if AI layer files were modified]
Context:
- Updated .claude/rules/frontend.md with sizing scale
- Added .claude/commands/prime-blog.md for blog sessions
- Noted: blog template needs FAQ schema section added

[References]
Fixes #123
Dev plan: P2.4
~~~

### 6. Show Message and Wait for Approval

Present the complete commit message to the human. Format it clearly so they can review:

~~~
Proposed commit message:

  tag(scope): description

  Body text here.

  Context:
  - AI layer changes listed here

  Dev plan: P-number
~~~

**Do not run `git commit` until the human approves the message.**

### 7. Commit

After approval:

```bash
git commit -m "the approved message"
```

### 8. Confirm

```bash
git log --oneline -3
```

Report the commit hash and confirm success.

## Examples

**Simple commit (no AI context changes):**

~~~
fix: change Organization schema to ProfessionalService on about page
~~~

**Commit with AI context tracking:**

~~~
feat(blog): add dental blog post template with FAQ schema

Created reusable blog post template optimized for AI search visibility.
Includes FAQ schema markup, internal linking structure, and content
guidelines for dental practice topics.

Context:
- Added .claude/rules/blog.md with blog content conventions
- Updated AGENTS.md blog section with directory structure
- Created .claude/commands/prime-blog.md for blog-focused sessions

Dev plan: P16
~~~

**Commit with bug fix context:**

~~~
fix(auth): prevent session timeout during Supabase token refresh

Users were being logged out mid-session when the Supabase access token
expired. The refresh handler was swallowing errors silently. Now retries
once before redirecting to login.

Fixes #42
Dev plan: P3.2
~~~

## Rules

- **Never commit without human approval.** Show the message, wait for confirmation.
- **One task per commit.** Don't batch unrelated changes.
- **Stage deliberately.** Review what you're staging. Never blind `git add .`.
- **Explain the why.** The diff shows what changed. The message explains why.
- **Track AI context.** If agent rules, commands, or docs changed, include the Context section.
