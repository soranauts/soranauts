# Getting Started with Claude Code for Soranauts

## What is Claude Code?

**Claude Code** is a command-line AI coding assistant made by Anthropic (the same company that makes me, Claude). It's different from Cursor in a few key ways:

### Claude Code vs. Cursor

| Feature | Claude Code | Cursor |
|---------|-------------|--------|
| **Interface** | Terminal/command line | GUI editor (VS Code fork) |
| **Model** | Claude Sonnet 4 (Anthropic) | Multiple models (GPT-4, Claude, Codex) |
| **Approach** | Task-focused, agentic | Real-time autocomplete + chat |
| **Best For** | Complex refactoring, debugging, architecture | Daily coding, quick edits |
| **File Access** | Full repository access | Current file + context |
| **Autonomy** | High - can make multi-file changes | Medium - suggests changes |
| **Cost** | Included with Claude Pro | Separate subscription |

### When to Use Claude Code vs. Cursor

**Use Claude Code for:**
- Complex architecture changes
- Multi-file refactoring
- Understanding unfamiliar codebases
- Debugging tricky issues across files
- Learning how a system works
- Planning major features

**Use Cursor for:**
- Quick edits and tweaks
- Writing new functions
- Autocomplete while coding
- Chat about current file
- Fast iteration on single files

**Pro tip:** Use both! Claude Code for planning and big changes, Cursor for implementation.

---

## Installation

### Prerequisites
- macOS or Linux (Windows support via WSL)
- Git installed
- Node.js installed (for Soranauts project)
- Claude Pro subscription (includes Claude Code access)

### Install Claude Code

```bash
# Install via pip (Python package manager)
pip install claude-code-cli

# Or via Homebrew on macOS
brew install anthropic/tap/claude-code

# Verify installation
claude-code --version
```

### Authenticate

```bash
# Login to your Claude account
claude-code auth login

# This will open a browser to authenticate
# Follow the prompts and authorize the CLI
```

---

## Basic Usage

### Starting a Session

```bash
# Navigate to your project
cd ~/path/to/soranauts

# Start Claude Code
claude-code

# Or specify a task directly
claude-code "Help me understand the glossary architecture"
```

### The Claude Code Interface

When you start Claude Code, you'll see:

```
Claude Code v1.x.x
Working directory: ~/soranauts-main
Type 'help' for available commands or describe what you'd like to do.

>
```

**Key points:**
- Claude Code can see your **entire repository**
- It understands Git, file structure, and dependencies
- It can make multi-file changes autonomously
- **It will ask before committing or pushing**

---

## Getting Claude Code to Understand Your Codebase

### Step 1: Initial Context Setting

When you first start Claude Code on the Soranauts project:

```bash
claude-code
```

Then give it context:

```
> I'm working on the Soranauts project - a website about SORA blockchain.
  The project uses Astro, TypeScript, and has a complex glossary system.
  Can you read through the key architecture files to understand the project?
```

Claude Code will:
1. Scan your repository structure
2. Read README, ARCHITECTURE.md, and key files
3. Understand the glossary system
4. Learn your tech stack

### Step 2: Point to Key Files

Help Claude Code understand the important parts:

```
> The glossary system is complex. Please read:
  1. apps/web/src/data/taxonomy.ts (master data)
  2. apps/web/src/lib/glossary/glossary-loader.ts (data loading)
  3. glossary-architecture-explained.md (my architecture doc)
  4. CURSOR_RULES.md (project rules and guardrails)
```

### Step 3: Ask Questions to Verify Understanding

```
> Can you explain how the glossary system works in your own words?

> Where should I add a new glossary term?

> What happens when I run `pnpm build`?
```

If Claude Code's answers match reality, it understands your project!

---

## Practical Workflows for Soranauts

### Workflow 1: Understanding Existing Code

**Goal:** Understand how the glossary loader merges data

```bash
claude-code
```

```
> I want to understand how glossary-loader.ts merges data from 
  different sources. Can you walk me through the data flow?

> Show me an example of how a term gets loaded from taxonomy.ts
  and merged with its MDX file data.

> Create a flowchart (in text/markdown) showing this process.
```

Claude Code will:
- Read the relevant files
- Trace through the logic
- Explain in plain language
- Create diagrams to visualize

### Workflow 2: Adding a New Glossary Term

**Goal:** Add a term safely with all necessary updates

```bash
claude-code
```

```
> I want to add a new glossary term called "Proof of Stake".
  Can you:
  1. Create the MDX file with proper frontmatter
  2. Add it to taxonomy.ts with full metadata
  3. Verify it builds correctly
  4. Show me how to test it locally
```

Claude Code will:
- Create the files with correct structure
- Follow your project conventions
- Run the build to verify
- Explain what it did and why

### Workflow 3: Debugging Build Failures

**Goal:** Figure out why the build is failing

```bash
claude-code
```

```
> My build is failing with this error: [paste error]
  Can you:
  1. Identify the root cause
  2. Explain why it's happening
  3. Suggest a fix
  4. Verify the fix works
```

Claude Code will:
- Analyze the error message
- Check relevant files
- Understand dependencies
- Propose and test a solution

### Workflow 4: Refactoring Code

**Goal:** Improve glossary loading performance

```bash
claude-code
```

```
> The glossary loading seems slow. Can you:
  1. Analyze the current implementation
  2. Identify bottlenecks
  3. Suggest optimizations
  4. Implement the improvements while maintaining compatibility
```

Claude Code will:
- Profile the code
- Identify issues
- Propose solutions
- Make changes across multiple files
- Ensure tests still pass

### Workflow 5: Creating Documentation

**Goal:** Document the tag system for future developers

```bash
claude-code
```

```
> Create comprehensive documentation about the tag system:
  1. How tags are defined
  2. How they connect to glossary terms
  3. How they're used for navigation
  4. Include code examples
  Save this as TAG_SYSTEM_GUIDE.md
```

Claude Code will:
- Analyze the tag implementation
- Write clear documentation
- Include examples from your code
- Follow your documentation style

---

## Advanced Techniques

### Using Shared Context (Like ChatGPT's Zip Files)

Claude Code has **better** context handling than uploading zip files:

```bash
# Claude Code automatically sees your ENTIRE repo
# No need to create zip files or copy/paste code
```

But if you want to share specific context:

```
> Before we start, please read these files to understand the project:
  - CURSOR_RULES.md
  - glossary-architecture-explained.md
  - CSS_GUARDRAILS.md
  - DESIGN-TOKENS.md
  Now you're up to date on our standards and architecture.
```

### Multi-Step Tasks

Claude Code can handle complex, multi-step workflows:

```
> I want to add pagination to the glossary index. This requires:
  1. Updating the glossary page component
  2. Modifying the loader to support pagination
  3. Adding new URL routes for pages
  4. Updating tests
  5. Documenting the change
  
  Please create a plan first, then execute each step carefully.
```

Claude Code will:
- Create a detailed plan
- Ask for your approval
- Execute each step
- Verify nothing breaks
- Document changes

### Safe Experimentation

```
> Create a new branch called 'experiment/glossary-search'
  Then implement a client-side search feature for the glossary.
  If it works well, I'll merge it. If not, we'll delete the branch.
```

Claude Code handles Git operations safely:
- Creates branches
- Makes changes
- Commits with good messages
- **Asks before pushing**

### Code Reviews

```
> Review the changes in apps/web/src/lib/glossary/
  Check for:
  - TypeScript type safety issues
  - Performance concerns
  - Violations of our CSS guardrails
  - Breaking changes to the API
```

Claude Code will:
- Analyze your code
- Identify issues
- Suggest improvements
- Explain reasoning

---

## Guardrails for Claude Code

### Setting Up Project Rules

Create a `.claude/rules.md` file in your project:

```bash
mkdir .claude
cp /path/to/CURSOR_RULES.md .claude/rules.md
```

Claude Code will automatically read this file and follow the rules!

### Session-Level Instructions

At the start of each session:

```
> Follow the guardrails in CURSOR_RULES.md and CSS_GUARDRAILS.md.
  Never push to main without asking.
  Always verify builds succeed before committing.
  Explain your reasoning for architectural decisions.
```

### Interactive Approval

Claude Code asks before:
- Making Git commits
- Pushing to remote
- Deleting files
- Installing dependencies
- Running destructive commands

**You always have control.**

---

## Common Use Cases for Soranauts

### 1. Understanding the Glossary System

```bash
claude-code
```

```
> I'm confused about how the glossary works. Please:
  1. Read taxonomy.ts and glossary-loader.ts
  2. Explain the architecture in simple terms
  3. Create a diagram showing data flow
  4. Answer my questions as I learn
```

### 2. Adding New Content Safely

```
> I want to add 5 new glossary terms. Let's do them one at a time:
  1. Proof of Stake
  2. Proof of Work  
  3. Consensus Mechanism
  4. Byzantine Fault Tolerance
  5. Validator Node
  
  For each one, create both the MDX file and taxonomy entry.
  Verify the build works after each addition.
```

### 3. Fixing CSS Issues

```
> The glossary links are showing default blue instead of our brand color.
  Can you:
  1. Find where the issue is
  2. Explain why it's happening
  3. Fix it following our CSS guardrails
  4. Verify the fix in all contexts (articles, glossary index, etc.)
```

### 4. Debugging GitHub Actions

```
> The KB sync workflow keeps failing. The error is: [paste error]
  Can you:
  1. Read the workflow file (.github/workflows/kb-sync.yml)
  2. Understand what it's trying to do
  3. Identify why it's failing
  4. Fix it or suggest disabling it
```

### 5. Learning TypeScript Concepts

```
> I keep seeing this TypeScript error: [paste error]
  Can you:
  1. Explain what the error means in simple terms
  2. Show me the relevant code
  3. Explain why TypeScript is complaining
  4. Fix it and explain the fix
  5. Teach me how to avoid this in the future
```

---

## Tips for Effective Claude Code Usage

### 1. Be Specific About Goals

```
❌ "Fix the glossary"
✅ "The glossary loading is slow. Profile it and suggest optimizations."

❌ "Add a feature"
✅ "Add pagination to the glossary index, showing 50 terms per page."
```

### 2. Ask for Explanations

```
> Before making changes, explain:
  - What you're going to change and why
  - What files will be affected
  - Any potential risks or breaking changes
  - How you'll verify the change works
```

### 3. Request Incremental Changes

```
> Let's do this in small steps:
  1. First, just add the new field to the type definition
  2. Then, update the loader to populate it
  3. Then, display it in the UI
  4. Test after each step
```

### 4. Use Claude Code for Learning

```
> I don't understand how React hooks work in this component.
  Can you:
  1. Explain what each hook does
  2. Show me the data flow
  3. Suggest improvements
  4. Teach me the patterns being used
```

### 5. Combine with Your Own Knowledge

```
> I know we need to add a new category to the glossary.
  Based on the existing categories, what's the right way to do this?
  Consider: taxonomy.ts structure, type definitions, and UI changes.
```

---

## Troubleshooting

### Claude Code Can't Find Files

```bash
# Make sure you're in the project directory
pwd
# Should show: /path/to/soranauts-main

# If not, navigate there
cd ~/soranauts-main

# Then restart Claude Code
claude-code
```

### Claude Code Misunderstands the Architecture

```
> Let me clarify the architecture:
  [Paste relevant sections from glossary-architecture-explained.md]
  
  Now that you have the correct understanding, let's try again.
```

### Changes Break the Build

```
> The build is broken after your changes. Let's debug:
  1. Show me the error message
  2. Identify which change caused it
  3. Either fix it or revert that change
  4. Verify the build works again
```

### Claude Code is Too Slow

```bash
# Claude Code processes a lot of context
# For faster responses on specific files:

claude-code --files apps/web/src/lib/glossary/glossary-loader.ts

# This limits context to just that file
```

---

## Comparison: ChatGPT vs. Claude Code for Your Workflow

### What ChatGPT Does Well
- ✅ Remembers project context across sessions (with your zip file method)
- ✅ Good for design discussions and planning
- ✅ Can generate documentation and explanations
- ❌ Can't directly access your files (requires copy/paste or zip uploads)
- ❌ Can't run builds or verify changes
- ❌ Can't make actual file modifications

### What Claude Code Does Well
- ✅ Direct access to your entire codebase
- ✅ Can make multi-file changes automatically
- ✅ Runs builds and tests to verify changes
- ✅ Understands Git and can create branches/commits
- ✅ Better at understanding complex architecture
- ❌ Terminal-only (no GUI)
- ❌ Context resets between sessions (like ChatGPT without uploads)

### Best Practice: Use Both!

**Planning Phase (ChatGPT):**
```
User to ChatGPT:
"I want to add search to the glossary. How should I architect this?"

ChatGPT: [Suggests approach with pros/cons]

User: "That makes sense. Let me implement it with Claude Code."
```

**Implementation Phase (Claude Code):**
```bash
claude-code
```
```
User to Claude Code:
"Implement glossary search following this plan: [paste ChatGPT's plan]
Follow our project guardrails and verify everything works."

Claude Code: [Implements, tests, and commits changes]
```

**Refinement Phase (Cursor):**
```
# Use Cursor for quick tweaks to the implementation
# Like adjusting styling, fixing small bugs, etc.
```

---

## Your Workflow: Putting It All Together

### For Understanding Architecture (Your Main Goal)

**Use Claude Code like this:**

```bash
cd ~/soranauts-main
claude-code
```

```
> I'm learning software architecture through this project.
  I want to understand the glossary system deeply.
  
  Please:
  1. Read taxonomy.ts, glossary-loader.ts, and the MDX files
  2. Explain the three-layer architecture
  3. Walk me through an example: adding a new term
  4. Show me the data flow from source to runtime
  5. Help me trace through the code step-by-step
  
  Teach me like I'm learning, not just doing.
  Explain WHY things work, not just HOW.
```

Claude Code becomes your **personal tutor** who can:
- Show you real code from your project
- Trace through execution step-by-step
- Explain architectural decisions
- Answer "what if" questions
- Verify your understanding with exercises

### For Making Changes (With Confidence)

```
> I want to add a new glossary term, but I want to understand
  each step before doing it. Let's go through the process:
  
  1. First, show me where the term definition should go
  2. Explain why it goes there
  3. Then, create the file and explain the frontmatter
  4. Build the project and show me what changed
  5. Explain how the system found and processed my new term
```

This way, you're not just getting work done - **you're learning the system**.

---

## Next Steps

### 1. Install Claude Code

```bash
pip install claude-code-cli
claude-code auth login
```

### 2. Try Your First Session

```bash
cd ~/soranauts-main
claude-code
```

```
> Hello! I'm the owner of this project and I'm learning software architecture.
  Please read CURSOR_RULES.md and glossary-architecture-explained.md
  to understand the project and my learning goals.
  
  Then, help me understand: where would I add a new glossary term?
```

### 3. Compare with Your Current Workflow

- Try the same task in ChatGPT (with your zip file method)
- Try it in Claude Code
- Try it in Cursor
- See which feels most natural for different tasks

### 4. Develop Your Own Workflow

Over time, you'll discover:
- When each tool is best
- How to combine them effectively
- Your preferred style of learning
- What questions to ask

---

## Key Takeaways

1. **Claude Code = ChatGPT with direct code access**
   - No more zip files or copy/paste
   - It sees your whole project
   - It can make real changes

2. **Use it for learning, not just doing**
   - Ask "why" questions
   - Request step-by-step explanations
   - Trace through code together
   - Build mental models

3. **Combine tools strategically**
   - ChatGPT for planning and discussion
   - Claude Code for understanding and implementation
   - Cursor for day-to-day coding

4. **You're still in control**
   - Claude Code asks before Git operations
   - You approve major changes
   - You decide what to learn next

5. **Architecture understanding is your goal**
   - Use Claude Code as a tutor
   - Trace data flows
   - Understand design decisions
   - Build confidence in your knowledge

---

## Getting Help

### Claude Code Documentation
- Official docs: https://docs.anthropic.com/claude-code
- GitHub: https://github.com/anthropics/claude-code

### Your Project Resources
- `glossary-architecture-explained.md` - Your system overview
- `CURSOR_RULES.md` - Project guardrails
- `CSS_GUARDRAILS.md` - Styling rules
- `DESIGN-TOKENS.md` - Design system

### In Claude Code Sessions
```
> I'm stuck. Can you:
  1. Explain what I'm trying to do
  2. Show me the relevant code
  3. Suggest next steps
  4. Answer my questions patiently
```

---

## Final Thought

Claude Code isn't just another coding tool - it's a way to **learn by doing** with an expert assistant who has full context of your project. Use it to build the architectural understanding you want, not just to get tasks done.

Think of it as pair programming with an AI that never gets tired of explaining things.

Happy learning! 🚀

