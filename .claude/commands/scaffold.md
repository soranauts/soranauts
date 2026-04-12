---
description: Bootstrap LEAD-V v3.0 in a new or existing project — creates all directories, copies root files, and guides CUSTOMIZE setup
argument-hint: [path-to-lead-framework-folder]
---

# Scaffold: Bootstrap LEAD-V v3.0 in This Project

## Objective

Set up the full LEAD-V v3.0 directory structure, root files, slash commands, and agent definitions in this project. By the end, the project is ready for `/prime` on the next session.

## Prerequisites

- The LEAD-V framework folder must be accessible. Default location: `lead-framework/` in the project root, or passed as `$ARGUMENTS`.
- If `$ARGUMENTS` is provided, use that path. Otherwise look for `lead-framework/` in the project root.

```bash
LEAD_DIR="${ARGUMENTS:-lead-framework}"
if [ ! -d "$LEAD_DIR" ]; then
  echo "ERROR: LEAD-V framework not found at $LEAD_DIR"
  echo "Usage: /scaffold path/to/lead-framework"
  exit 1
fi
```

## Process

### Step 1: Read the Project Before Touching Anything

Understand what exists before creating anything:

```bash
# Project structure
ls -la
ls -la .claude/ 2>/dev/null || echo "No .claude/ directory"

# Existing root files that might conflict
for f in CLAUDE.md AGENTS.md VERIFY.md PROJECT_STATE.md DEVELOPMENT-PLAN.md .cursorrules; do
  [ -f "$f" ] && echo "EXISTS: $f" || echo "MISSING: $f"
done

# Tech stack detection
[ -f "package.json" ] && echo "DETECTED: Node.js project" && head -20 package.json
[ -f "pyproject.toml" ] && echo "DETECTED: Python project" && head -20 pyproject.toml
[ -f "Cargo.toml" ] && echo "DETECTED: Rust project" && head -5 Cargo.toml
[ -f "go.mod" ] && echo "DETECTED: Go project" && head -5 go.mod

# Git state
git status 2>/dev/null || echo "Not a git repository"
git log --oneline -5 2>/dev/null || echo "No git history"
```

**Report what you found and wait for confirmation before proceeding.**

### Step 2: Create Directory Structure

Create the `.claude/` directory tree and docs structure:

```bash
# Claude Code directories
mkdir -p .claude/commands
mkdir -p .claude/rules
mkdir -p .claude/agents

# Documentation directories (Layer 3 — reference)
mkdir -p docs/specs
mkdir -p docs/guides
mkdir -p docs/research
mkdir -p docs/handoffs
```

If any of these directories already exist, skip them — do NOT overwrite or modify existing contents.

List what was created and confirm with the human.

### Step 3: Copy Slash Commands

Copy the LEAD-V slash commands into `.claude/commands/`:

```bash
# Core commands
cp "$LEAD_DIR/.claude/commands/prime.md" .claude/commands/prime.md
cp "$LEAD_DIR/.claude/commands/handoff.md" .claude/commands/handoff.md
cp "$LEAD_DIR/.claude/commands/commit.md" .claude/commands/commit.md
cp "$LEAD_DIR/.claude/commands/verify.md" .claude/commands/verify.md
```

If project-specific prime commands exist in the framework (e.g., `prime-frontend-template.md`), list them and ask the human which ones to copy:

```bash
echo "Available specialized prime commands:"
ls "$LEAD_DIR/.claude/commands/prime-"*.md 2>/dev/null || echo "None found"
echo ""
echo "Copy any of these? They'll need CUSTOMIZE markers filled in."
```

**Wait for confirmation.**

### Step 4: Copy Agent Definitions

```bash
cp "$LEAD_DIR/agents/research-analyst.md" .claude/agents/research-analyst.md
```

List what was copied. If additional agent definitions exist in the framework, offer them.

### Step 5: Copy Root Files

For each root file, check whether it already exists:

**If it does NOT exist** — copy the template:

```bash
for f in CLAUDE.md AGENTS.md VERIFY.md PROJECT_STATE.md; do
  if [ ! -f "$f" ]; then
    cp "$LEAD_DIR/root-files/$f" "./$f"
    echo "CREATED: $f (from template)"
  else
    echo "SKIPPED: $f (already exists — will merge in Step 7)"
  fi
done
```

**If it DOES exist** — do NOT overwrite. Flag it for merging in Step 7.

For optional files:

```bash
# .cursorrules — only if using Cursor for implementation
if [ ! -f ".cursorrules" ]; then
  echo "OPTIONAL: .cursorrules (for Cursor IDE users)"
  echo "Copy .cursorrules? (Only needed if using Cursor for implementation)"
fi

# DEVELOPMENT-PLAN.md — only for multi-phase projects
if [ ! -f "DEVELOPMENT-PLAN.md" ]; then
  echo "OPTIONAL: DEVELOPMENT-PLAN.md (for multi-phase projects)"
  echo "Copy DEVELOPMENT-PLAN.md template?"
fi
```

**Wait for confirmation on optional files.**

### Step 6: Detect Tech Stack and Create Domain Rules

Based on what was detected in Step 1, suggest domain rules:

~~~
Detected: [tech stack from Step 1]

Recommended .claude/rules/ files:
~~~

**For Next.js / React projects:**
- `frontend.md` — component conventions, styling patterns, route structure
- `schema.md` — JSON-LD and structured data conventions (if applicable)
- `api.md` — API route and server action conventions

**For Python projects:**
- `backend.md` — module structure, import conventions, error handling
- `testing.md` — pytest patterns, fixture conventions

**For any project:**
- `git.md` — branch strategy, commit conventions (if not using /commit)

If rule templates exist in the framework (`$LEAD_DIR/rules-examples/`), list them:

```bash
echo "Available rule templates:"
ls "$LEAD_DIR/rules-examples/"*.md 2>/dev/null || echo "None found"
echo ""
echo "These are templates with CUSTOMIZE markers."
echo "Which ones should I copy and fill in?"
```

**Wait for the human to choose.** Copy selected templates to `.claude/rules/`.

### Step 7: Fill In CUSTOMIZE Markers

This is the most important step. Read the project (Step 1 findings) and fill in every `<!-- CUSTOMIZE -->` marker in the copied files.

**For each file that has CUSTOMIZE markers:**

1. Read the file
2. Identify every `<!-- CUSTOMIZE -->` section
3. Using what you learned about the project in Step 1, propose the fill-in content
4. Show the proposed content to the human
5. Wait for approval before writing

**Files that typically need customization:**
- `AGENTS.md` — project name, tech stack table, folder structure, conventions
- `CLAUDE.md` — project summary, pointer to AGENTS.md
- `VERIFY.md` — context file list for the auditor role
- `PROJECT_STATE.md` — current phase, environment status, active task
- `.cursorrules` (if copied) — project identity, tech stack, conventions
- Any `.claude/rules/*.md` files — project-specific values (brand, sizing, patterns)

**If root files already existed (flagged in Step 5):**

Open both the existing file and the LEAD-V template side by side. Identify what LEAD-V sections are missing from the existing file. Propose additions that preserve existing content and add LEAD-V structure. Every LEAD-V section should be marked with `<!-- LEAD-V v3.0 -->` comment so the user can identify what was added.

**Show all proposed changes. Wait for approval on each file.**

### Step 8: Configure Claude Code Permissions

Check for existing settings:

```bash
cat .claude/settings.json 2>/dev/null || echo "No settings file"
cat .claude/settings.local.json 2>/dev/null || echo "No local settings file"
```

If no settings exist, create a starter `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(head *)",
      "Bash(tail *)",
      "Bash(find *)",
      "Bash(grep *)",
      "Bash(rg *)",
      "Bash(wc *)",
      "Bash(tree *)"
    ],
    "deny": []
  }
}
```

Note: This is a conservative starter. The human can add more permissions (build commands, test runners, etc.) as they become familiar with their workflow. Running with `--dangerously-skip-permissions` is fine for experienced users.

**Show the proposed settings and wait for confirmation.**

### Step 9: Create .gitignore Additions

Check if `.gitignore` exists and add LEAD-V entries if missing:

```bash
# Entries to add to .gitignore (if not already present)
# Anchored with / so they only match at repo root — without this,
# macOS case-insensitive filesystems silently ignore .claude/commands/handoff.md
/HANDOFF.md
docs/handoffs/
.claude/settings.local.json
```

Show proposed additions. Do NOT overwrite existing `.gitignore` — append only.

### Step 10: Verify the Setup

Run a verification sweep that catches the most common installation failures:

```bash
echo "=== LEAD-V v3.0 Setup Verification ==="
echo ""
PASS=0
FAIL=0

# Directory structure
echo "Directories:"
for d in .claude .claude/commands .claude/rules .claude/agents docs/specs docs/guides docs/research docs/handoffs; do
  if [ -d "$d" ]; then
    echo "  ✓ $d"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $d (MISSING)"
    FAIL=$((FAIL + 1))
  fi
done
echo ""

# Root files
echo "Root files:"
for f in CLAUDE.md AGENTS.md VERIFY.md PROJECT_STATE.md; do
  if [ -f "$f" ]; then
    echo "  ✓ $f"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $f (MISSING)"
    FAIL=$((FAIL + 1))
  fi
done
echo ""

# Slash commands (4 required core commands)
echo "Slash commands:"
REQUIRED_CMDS="prime.md handoff.md commit.md verify.md"
for f in $REQUIRED_CMDS; do
  if [ -f ".claude/commands/$f" ]; then
    echo "  ✓ /$(basename $f .md)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ /$(basename $f .md) (MISSING)"
    FAIL=$((FAIL + 1))
  fi
done
TOTAL_CMDS=$(ls .claude/commands/*.md 2>/dev/null | wc -l | tr -d ' ')
echo "  Total commands: $TOTAL_CMDS (4 required + optional)"
echo ""

# CRITICAL: Check for commands at wrong path (common failure)
WRONG_PATH=$(ls commands/*.md 2>/dev/null | wc -l | tr -d ' ')
if [ "$WRONG_PATH" -gt 0 ]; then
  echo "  ⚠ WARNING: Found $WRONG_PATH command files at root commands/"
  echo "    Claude Code requires .claude/commands/ — root commands/ will NOT register"
  ls commands/*.md 2>/dev/null | sed 's/^/    → /'
  FAIL=$((FAIL + 1))
  echo ""
fi

# Frontmatter validation (commands must have description: field)
echo "Frontmatter check:"
for f in .claude/commands/*.md; do
  if [ -f "$f" ]; then
    if head -5 "$f" | grep -q "description:"; then
      echo "  ✓ $(basename $f) has description"
    else
      echo "  ✗ $(basename $f) MISSING description frontmatter"
      FAIL=$((FAIL + 1))
    fi
  fi
done
echo ""

# Domain rules validation (if any exist, check paths: frontmatter)
if ls .claude/rules/*.md 2>/dev/null | head -1 > /dev/null 2>&1; then
  echo "Domain rules:"
  for f in .claude/rules/*.md; do
    if head -5 "$f" | grep -q "paths:"; then
      echo "  ✓ $(basename $f) has paths frontmatter"
    else
      echo "  ⚠ $(basename $f) MISSING paths frontmatter (won't auto-load)"
    fi
  done
  echo ""
fi

# Agent definitions
echo "Agent definitions:"
ls .claude/agents/*.md 2>/dev/null | while read f; do echo "  ✓ $(basename $f)"; done
[ ! "$(ls .claude/agents/*.md 2>/dev/null)" ] && echo "  (none)"
echo ""

# CUSTOMIZE markers remaining
echo "Remaining CUSTOMIZE markers:"
CUSTOMIZE_FOUND=0
for f in CLAUDE.md AGENTS.md VERIFY.md PROJECT_STATE.md .cursorrules; do
  if [ -f "$f" ]; then
    count=$(grep -c "CUSTOMIZE" "$f" 2>/dev/null || echo 0)
    if [ "$count" -gt 0 ]; then
      echo "  ⚠ $f has $count unfilled markers"
      CUSTOMIZE_FOUND=$((CUSTOMIZE_FOUND + count))
    fi
  fi
done
for f in .claude/rules/*.md; do
  if [ -f "$f" ]; then
    count=$(grep -c "CUSTOMIZE" "$f" 2>/dev/null || echo 0)
    if [ "$count" -gt 0 ]; then
      echo "  ⚠ $f has $count unfilled markers"
      CUSTOMIZE_FOUND=$((CUSTOMIZE_FOUND + count))
    fi
  fi
done
[ "$CUSTOMIZE_FOUND" -eq 0 ] && echo "  ✓ All markers filled"
echo ""

# .gitignore check
echo "Gitignore:"
for entry in "/HANDOFF.md" "docs/handoffs/" ".claude/settings.local.json"; do
  if [ -f ".gitignore" ] && grep -qF "$entry" .gitignore; then
    echo "  ✓ $entry"
    PASS=$((PASS + 1))
  else
    echo "  ⚠ $entry not in .gitignore"
  fi
done
echo ""

# Summary
echo "=== Results: $PASS passed, $FAIL failed ==="
if [ "$FAIL" -eq 0 ]; then
  echo "✓ LEAD-V v3.0 installation verified."
else
  echo "✗ $FAIL issues found — fix before running /prime."
fi
```

### Step 11: Recommend First Action

Based on the project state:

~~~
Setup complete. LEAD-V v3.0 is installed.

Next steps:
1. Fill any remaining CUSTOMIZE markers flagged above
2. Start your next session with: /prime
3. Open Claude.ai and upload LEAD-V-FRAMEWORK-REFERENCE.md
   to your SCOUT project knowledge

Your first /prime session will verify that everything is
connected and report the project state.
~~~

## Quality Criteria

A successful scaffold means:
- All directories exist
- All required root files are present and customized
- Slash commands are executable (run `/prime` to test)
- No CUSTOMIZE markers remain unfilled
- .gitignore has LEAD-V entries
- The human approved every file before it was written
- Existing project files were preserved (not overwritten)

## Anti-Patterns

- Never overwrite an existing file without showing the merge diff first
- Never fill CUSTOMIZE markers with guesses — ask if unsure
- Never create domain rules the human didn't request
- Never modify source code files — this command only touches framework/config files
- Never run without showing the plan first — scaffold is a setup tool, not an autonomous agent
