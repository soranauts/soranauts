# Known Bugs & Issues

## Active Bugs

### 1. ChromaDB Query Error (CRITICAL - Blocks Retrieval)
**Status:** Unresolved  
**Error:** `TypeError: Cannot read properties of undefined (reading 'generate')`  
**Location:** `knowledge_base/scripts/retrieve.ts:215` (Collection.query)  
**Impact:** Retrieval script fails when querying ChromaDB  
**Likely Cause:** Embedding model configuration issue - ChromaDB may not have the embedding function properly initialized  
**Workaround:** None - retrieval is currently broken  
**Next Steps:** 
- Check ChromaDB collection has embedding function set
- Verify `env.EMBED_MODEL` matches what was used during ingestion
- Check if collection was created with proper embedding configuration

### 2. Duplicate Main Execution (MINOR)
**Status:** Unresolved  
**Symptom:** "Query: ..." printed twice when running retrieve script  
**Location:** `knowledge_base/scripts/retrieve.ts`  
**Impact:** Cosmetic - doesn't break functionality  
**Likely Cause:** Main function called multiple times or module loaded twice  
**Next Steps:**
- Check `import.meta.url` comparison logic
- Verify no duplicate imports

## Fixed Bugs

### ✅ CLI Argument Parsing (FIXED)
**Status:** Resolved  
**Issue:** Commander.js was parsing arguments when `bm25.ts` was imported by `retrieve.ts`  
**Fix:** Wrapped `program.parse()` in `bm25.ts` to only run when script is executed directly  
**Fix Date:** 2025-01-XX

---

**Last Updated:** 2025-01-XX  
**Total Active Bugs:** 2 (1 critical, 1 minor)



















