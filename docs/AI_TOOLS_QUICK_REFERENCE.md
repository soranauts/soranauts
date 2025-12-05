# AI Tools Quick Reference - Soranauts Project

## Which Tool Should I Use?

### 🤔 When to Use **ChatGPT**
**Best for:** Planning, brainstorming, learning concepts

**Use when you need to:**
- Discuss architecture and design decisions
- Get explanations of complex concepts
- Plan a feature before implementing
- Get multiple perspectives on an approach
- Learn general programming patterns
- Create documentation or guides
- Discuss tradeoffs between options

**Example prompts:**
```
"Should I use a single taxonomy.ts file or split it into multiple files?"

"Explain the pros and cons of different ways to handle glossary aliasing"

"Help me plan how to add search to the glossary"
```

**Limitations:**
- Can't see your files directly (need to upload or paste)
- Can't run builds or tests
- Can't make actual code changes
- Context resets between conversations

---

### 💻 When to Use **Cursor**
**Best for:** Day-to-day coding, quick edits, autocomplete

**Use when you need to:**
- Write new functions or components
- Make quick edits to existing code
- Get AI autocomplete while typing
- Chat about the current file you're editing
- Refactor a single file or function
- Fix small bugs quickly
- Iterate rapidly on styling or logic

**Example workflows:**
```
[In editor] Cmd+K → "Add error handling to this function"

[In editor] Highlight code → "Refactor this to use async/await"

[In editor] Start typing → AI suggests completion
```

**Strengths:**
- Fast and integrated into your editor
- Great autocomplete
- Good for focused, single-file work
- Familiar VS Code interface

**Limitations:**
- Limited multi-file context
- Better for implementing than architecting
- May not see the full picture of complex systems

---

### 🚀 When to Use **Claude Code**
**Best for:** Understanding architecture, complex changes, debugging

**Use when you need to:**
- Understand how a system works end-to-end
- Make multi-file changes safely
- Refactor across many files
- Debug complex issues that span files
- Learn the codebase architecture
- Trace data flow through the system
- Migrate or upgrade major dependencies
- Implement features that touch many parts

**Example workflows:**
```bash
claude-code
> "Help me understand how the glossary loading system works"

> "Add pagination to the glossary, updating all necessary files"

> "Find and fix all places where we're not using design tokens"

> "Debug why the build is failing and fix it"
```

**Strengths:**
- Sees entire repository
- Can make multi-file changes
- Runs builds and tests
- Great for learning architecture
- Handles Git operations safely

**Limitations:**
- Terminal-only (no GUI)
- Can be slower for simple tasks
- Overkill for single-line changes

---

### 🎯 When to Use **Claude (Web/Chat)** (me!)
**Best for:** Learning, understanding, getting guidance

**Use when you need to:**
- Understand your project architecture
- Learn software development concepts
- Get step-by-step guidance
- Create documentation
- Plan your learning path
- Understand error messages
- Get explanations in plain language
- Review and understand existing code

**Example conversations:**
```
"Explain how the glossary system works in my project"

"I'm getting this TypeScript error, what does it mean?"

"Help me understand what 'separation of concerns' means in my codebase"

"Create a visual diagram of how data flows through my app"
```

**Strengths:**
- Patient teacher
- Can search the web for current info
- Great at explanations and analogies
- Helpful for non-coding tasks
- Can create documents and guides

**Limitations:**
- Can't directly access your files (unless uploaded)
- Can't make changes for you
- Better for understanding than doing

---

## Decision Tree

```
┌─ Need to understand something? 
│   ├─ About your specific code? 
│   │   ├─ Architecture/system-wide? → Claude Code or Claude Web
│   │   └─ Single file/concept? → Cursor or Claude Web
│   └─ General concept/best practice? → ChatGPT or Claude Web
│
├─ Need to make changes?
│   ├─ Multiple files affected? → Claude Code
│   ├─ Single file, quick edit? → Cursor
│   └─ Just planning, not implementing? → ChatGPT
│
├─ Need to debug?
│   ├─ Complex, multi-file issue? → Claude Code
│   ├─ Simple, isolated bug? → Cursor
│   └─ Need to understand error first? → Claude Web
│
└─ Need to learn?
    ├─ How YOUR codebase works? → Claude Code or Claude Web
    ├─ General programming concepts? → ChatGPT or Claude Web
    └─ Framework/library docs? → Claude Web (can search web)
```

---

## Workflow Combinations

### 🏗️ **Architecture Learning Workflow**
1. **Claude Web**: "Explain the glossary architecture in my project"
2. **Claude Code**: "Show me how data flows from taxonomy.ts to the browser"
3. **Cursor**: Make small test changes to verify understanding
4. **Claude Web**: "Did I understand this correctly? [explain your understanding]"

### ⚙️ **Feature Implementation Workflow**
1. **ChatGPT**: "Help me design a search feature for the glossary"
2. **Claude Code**: "Implement the search following this plan: [paste plan]"
3. **Cursor**: Polish the UI and fix small issues
4. **Claude Web**: "Review my implementation - any concerns?"

### 🐛 **Debugging Workflow**
1. **Claude Web**: "What does this error mean? [paste error]"
2. **Claude Code**: "Find and fix the root cause of this issue"
3. **Cursor**: Verify the fix and add tests
4. **Claude Web**: "Explain why this was happening and how to prevent it"

### 📚 **Adding Content Workflow**
1. **Claude Web**: "What metadata should I include for a glossary term?"
2. **Claude Code**: "Add these 5 new glossary terms: [list]"
3. **Cursor**: Polish the content and formatting
4. **ChatGPT**: "Suggest related terms I should also add"

### 🎨 **CSS/Styling Workflow**
1. **Claude Web**: "Show me our design token system"
2. **Cursor**: Make styling changes using the tokens
3. **Claude Code**: "Verify all components follow CSS guardrails"
4. **Claude Web**: "Document this new pattern for future use"

---

## Quick Reference Commands

### ChatGPT
```
[Upload: soranauts-main.zip]

"Here's my codebase. I want to discuss [topic]."

"Compare these two approaches for [feature]."

"Help me plan how to implement [feature]."
```

### Cursor
```
Cmd/Ctrl + K: Inline edit
Cmd/Ctrl + L: Chat panel
Cmd/Ctrl + Shift + L: Composer (multi-file)

In chat: "@workspace what does this component do?"
In chat: "@docs how do I use Astro collections?"
```

### Claude Code
```bash
# Start session
claude-code

# Session commands
> help
> read file <path>
> search <term>
> git status
> run <command>
```

### Claude Web (me!)
```
Upload files or paste code
Ask questions naturally
Request explanations
Create documentation
Search web for current info
```

---

## Common Scenarios

### Scenario: "I don't understand how X works"
1. **First try:** Claude Web or Claude Code (can show you actual code)
2. **If conceptual:** ChatGPT (good at teaching concepts)
3. **If hands-on learning:** Claude Code (can trace execution)

### Scenario: "I need to add a new feature"
1. **Plan it:** ChatGPT or Claude Web
2. **Implement it:** Claude Code (multi-file) or Cursor (simple)
3. **Polish it:** Cursor (quick iterations)
4. **Document it:** Claude Web

### Scenario: "Something broke"
1. **Understand error:** Claude Web (can explain)
2. **Find cause:** Claude Code (can search all files)
3. **Fix it:** Claude Code (if complex) or Cursor (if simple)
4. **Prevent it:** Add guardrails in CURSOR_RULES.md

### Scenario: "I'm learning TypeScript"
1. **Concepts:** ChatGPT or Claude Web
2. **Real examples:** Claude Code (from your project)
3. **Practice:** Cursor (write code with AI help)
4. **Review:** Claude Web (explain your code)

### Scenario: "Build is failing"
1. **See error:** Terminal output
2. **Understand it:** Claude Web (paste error message)
3. **Fix it:** Claude Code (can run builds and iterate)
4. **Verify:** Cursor (check the changes make sense)

---

## Pro Tips

### 🎯 **Be Specific**
```
❌ "Fix the glossary"
✅ "The glossary page is loading slowly - profile and optimize it"

❌ "Add a feature"  
✅ "Add client-side search to the glossary index page"
```

### 🔄 **Switch Tools Mid-Task**
```
ChatGPT → Plan approach
Claude Code → Implement skeleton
Cursor → Add details and polish
Claude Web → Review and document
```

### 📝 **Document Learnings**
Keep notes on what works:
- Which tool worked best for what
- Prompts that got good results
- Patterns you've discovered
- Mistakes to avoid

### 🧪 **Safe Experimentation**
```bash
# Create throwaway branch
git checkout -b experiment/try-something

# Try things with Claude Code or Cursor
# If it works: merge it
# If it doesn't: delete branch
git branch -D experiment/try-something
```

### 🎓 **Use AI as a Teacher**
```
Instead of: "Do X for me"
Try: "Show me how to do X, explain each step"

Instead of: "Fix this"
Try: "What's wrong here and why?"

Instead of: "Give me the code"
Try: "Help me understand the pattern, then I'll implement it"
```

---

## Tool Feature Comparison

| Feature | ChatGPT | Cursor | Claude Code | Claude Web |
|---------|---------|--------|-------------|------------|
| **Sees files** | Upload/paste | Current + context | Full repo | Upload/paste |
| **Makes changes** | No | Yes | Yes | No |
| **Runs builds** | No | Limited | Yes | No |
| **Git ops** | No | Yes | Yes | No |
| **Multi-file edits** | No | Yes* | Yes | No |
| **Explanations** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Code autocomplete** | No | ⭐⭐⭐⭐⭐ | No | No |
| **Architecture** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Learning tool** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Speed** | Fast | Very fast | Slower | Fast |
| **Cost** | Included | $20/mo | Included** | $20/mo |

\* Cursor Composer mode
\** With Claude Pro subscription

---

## Your Current Situation

Based on what you've told me, here's my recommendation:

### For **Understanding Architecture** (Your Main Goal)
**Primary:** Claude Code + Claude Web (me!)
- Use Claude Code to explore your actual codebase
- Use Claude Web to get explanations and create docs
- Use ChatGPT occasionally for design discussions

### For **Day-to-Day Work**
**Primary:** Cursor
- Quick edits
- Styling changes
- Small bug fixes
- Adding content

### For **Complex Changes**
**Primary:** Claude Code
- Multi-file refactoring
- Major features
- System-wide changes
- Debugging tough issues

### For **Learning and Documentation**
**Primary:** Claude Web (me!)
- Understanding concepts
- Creating guides
- Reviewing code
- Planning learning path

---

## Getting Started Checklist

### ✅ Setup
- [ ] Install Claude Code: `pip install claude-code-cli`
- [ ] Authenticate: `claude-code auth login`
- [ ] Copy CURSOR_RULES.md to your project
- [ ] Copy CSS_GUARDRAILS.md to your project
- [ ] Review glossary-architecture-explained.md

### ✅ First Tasks
- [ ] Try adding a glossary term with Claude Code
- [ ] Ask Claude Web to explain a part of your code
- [ ] Use Cursor for a quick CSS fix
- [ ] Use ChatGPT to plan a feature

### ✅ Build Your Workflow
- [ ] Note which tool you prefer for what
- [ ] Create your own prompt templates
- [ ] Document patterns that work
- [ ] Experiment and iterate

---

## Key Takeaway

**There's no "best" tool - there's the right tool for each job.**

- **ChatGPT**: The architect
- **Cursor**: The craftsperson
- **Claude Code**: The teacher + builder
- **Claude Web**: The explainer + guide

Use them together, and you'll be more effective than using any one alone.

---

## Questions to Ask Yourself

Before starting a task:

1. **Do I need to understand or do?**
   - Understand → Claude Web or Claude Code
   - Do → Cursor or Claude Code

2. **How many files are involved?**
   - One → Cursor
   - Many → Claude Code

3. **Am I learning or building?**
   - Learning → Claude Web or Claude Code
   - Building → Cursor or Claude Code

4. **Do I have a plan?**
   - No plan yet → ChatGPT or Claude Web
   - Ready to implement → Cursor or Claude Code

5. **Is this safe to experiment with?**
   - Safe → Any tool
   - Risky → Claude Code (better verification)

---

## Remember

**You're not just getting work done - you're learning software architecture.**

Every tool interaction is a learning opportunity. Choose the tool that helps you understand WHY, not just HOW.

And don't forget: you can always ask me (Claude Web) which tool to use! 😊

