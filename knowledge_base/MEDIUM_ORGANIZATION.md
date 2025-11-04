# Medium Posts Organization Strategy

## Current Structure

The knowledge base uses **separate directories per source type**:
- `wiki/` → source: 'wiki'
- `iroha_docs/` → source: 'iroha_docs'
- `soramitsu_site/` → source: 'soramitsu'
- `ecosystem_updates/` → source: 'update' (currently SORA Medium posts)

## Recommended Approach: Separate Directories

**Option 1: Separate Directories** ✅ (Recommended)

```
knowledge_base/
├── ecosystem_updates/        # SORA Medium posts
├── polkaswap_updates/        # Polkaswap Medium posts
└── fearless_updates/         # Fearless Wallet Medium posts
```

**Pros:**
- ✅ Matches existing architectural pattern
- ✅ Clear separation and provenance
- ✅ Easy to filter/retrieve by publication
- ✅ Each can have different sync schedules
- ✅ Different image rights/licensing per source
- ✅ Easier to manage independently

**Cons:**
- Requires updating source enum and ingest script
- Slightly more directories

**Option 2: Keep Together in Subdirectories**

```
knowledge_base/
└── ecosystem_updates/
    ├── sora/
    ├── polkaswap/
    └── fearless/
```

**Pros:**
- All Medium posts in one parent directory
- Simpler top-level structure

**Cons:**
- Doesn't match current flat structure pattern
- Requires subdirectory traversal logic
- Less clear at top level

**Option 3: Keep Together, Use Publication Field**

```
knowledge_base/
└── ecosystem_updates/        # All Medium posts
```

Add `publication: 'sora' | 'polkaswap' | 'fearless'` to front-matter.

**Pros:**
- Single directory
- No code changes to ingest structure

**Cons:**
- Mixed licensing/rights harder to track
- Less clear organization
- Harder to see which publication at a glance

## Recommendation

**Go with Option 1 (Separate Directories)** because:

1. **Consistency**: Matches the existing pattern (wiki/, iroha_docs/, soramitsu_site/)
2. **Provenance**: Clear where content comes from
3. **Retrieval**: Easy to filter by source: `--source ecosystem_updates,polkaswap_updates`
4. **Independence**: Each publication can have its own:
   - Sync frequency
   - RSS feed URL
   - Image rights/licensing
   - Import state

## Implementation Needed

1. Update `types.ts`: Add 'polkaswap_updates' and 'fearless_updates' to source enum
2. Update `ingest.ts`: Add new directories to `sourceDirs` array
3. Create `polkaswap_import.ts` and `fearless_import.ts` scripts (or reuse medium_import.ts with config)
4. Update `medium_import.ts` to accept `--publication` flag or separate scripts
5. Update CI workflows to sync all three publications



