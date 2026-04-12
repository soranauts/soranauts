# INITIAL: Structured Feature Request

Use this template to describe what you want to build before engaging SCOUT. Fill in each section, then share the completed file with SCOUT to get well-informed, scoped prompts.

**When to use this:** Features requiring more than a quick description, new feature areas where the AI needs significant context, or tasks where you've seen AI tools miss important constraints.

**When to skip this:** Bug fixes, small edits, routine tasks, or work in well-understood areas where SCOUT already has sufficient context.

---

## FEATURE

[Describe what you want to build — be specific about functionality,
user-visible behavior, and why this matters. One paragraph minimum.
Include: what the user sees, what happens behind the scenes, and
how this connects to the broader project.]

## EXAMPLES

[List any existing code in your project that does something similar,
or external examples to reference. Point to specific files and explain
what to follow — not just the path, but which pattern matters.]

- `path/to/similar-feature.tsx` — follow this component pattern
- `path/to/existing-implementation.ts` — reuse this data flow
- [External URL or reference] — adapt this approach

## DOCUMENTATION

[Links to relevant docs, APIs, or specifications. Be specific about
which sections matter — don't just link to a homepage.]

- [Library documentation URL] — specific section needed
- `docs/specs/relevant-spec.md` — section 3 covers the requirements
- [API reference URL] — endpoint X is the one we need

## GOTCHAS

[Things AI assistants commonly miss, quirks of your codebase,
constraints that aren't obvious from the code. This is the most
valuable section — it prevents the most common wasted iterations.]

- [Known limitation or edge case]
- [Pattern that looks wrong but is intentional — explain why]
- [Dependency version constraint or compatibility note]
- [Convention that differs from framework defaults]
- [Environment-specific behavior the AI won't know about]

---

## Filled-In Example

Below is a completed INITIAL.md for a real feature. Use this as a reference for the level of detail expected.

---

### FEATURE

Add a blog infrastructure to the wakelocal marketing site. Users should be able to read blog posts at `/blog` (list page) and `/blog/[slug]` (individual post). Posts are stored as MDX files in `content/blog/` with frontmatter for title, date, author, description, and tags. The blog list page shows cards with title, date, excerpt, and a read-more link. Each post page renders the MDX content with the project's standard layout, includes FAQ schema markup if the post has an FAQ section, and includes breadcrumb navigation. This is the foundation for the content marketing strategy — the first 5 posts will target dental practice visibility topics.

### EXAMPLES

- `apps/web/app/(marketing)/about/page.tsx` — follow this page structure for layout, metadata export, and JSON-LD placement
- `apps/web/app/(marketing)/services/page.tsx` — follow the card grid pattern for the blog list page
- `apps/web/lib/fonts.ts` — use the same font configuration (Outfit)

### DOCUMENTATION

- Next.js App Router docs — specifically the generateStaticParams pattern for dynamic routes
- MDX integration: https://nextjs.org/docs/app/building-your-application/configuring/mdx — the `@next/mdx` approach
- `docs/specs/DESIGN-SYSTEM.md` — section 2 covers the sizing scale that all blog typography must follow
- `.claude/rules/schema.md` — FAQ schema requirements for posts with FAQ sections

### GOTCHAS

- The project uses Tailwind CSS v4 with CSS-first configuration in `globals.css`, NOT `tailwind.config.ts`. Don't create or reference a tailwind config file.
- MakerKit has its own blog module but we're NOT using it — it's too opinionated for our content strategy. Build from scratch following the page patterns above.
- The sizing scale in `.claude/rules/frontend.md` overrides all MakerKit defaults. Every text element must match the scale — don't use MakerKit's default sizes.
- JSON-LD goes in each page component, NOT in layout.tsx. See the about page for the pattern.
- Blog images should use `next/image` with explicit width/height — no unsized images.
- The `content/blog/` directory doesn't exist yet — it needs to be created.
