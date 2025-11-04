# Knowledge Base Content Improvement Guide

This guide outlines how to use the Soranauts Knowledge Base to manually improve and update articles on the Soranauts website.

## Overview

The knowledge base indexes content from authoritative sources:
- SORA Wiki (Git-based sync)
- Hyperledger Iroha 2 documentation
- SORAMITSU website pages
- Medium ecosystem posts (SORA, Polkaswap, Fearless)
- Future: TONSWAP website/blog, Fearless GitHub repos

Use it as a research and validation tool to ensure accuracy and completeness.

## Process for Improving an Article

### Step 1: Identify the Article to Improve

Choose an article from `apps/web/src/content/post/` that needs:
- Fact-checking
- Additional details
- Updated information
- Better accuracy or citations

### Step 2: Formulate Research Queries

Based on the article's topic, create specific queries:
- Key concepts to verify
- Terms that need definition or explanation
- Facts that need validation
- Related topics to explore

**Example queries:**
- "What is the XOR token and its utility?"
- "How does SORA v3 governance work?"
- "What are the key features of Fearless Wallet?"

### Step 3: Retrieve Information from KB

Use the `kb:retrieve` command to search the knowledge base:

```bash
# Basic search
npm run kb:retrieve -- --query "SORA v3 governance changes" --limit 8

# Filter by source
npm run kb:retrieve -- --query "XOR token" --source wiki,iroha_docs --limit 5

# Filter by language
npm run kb:retrieve -- --query "Fearless Wallet features" --lang en --limit 8

# Time-scoped search (if using snapshots)
npm run kb:retrieve -- --query "Polkaswap updates" --asof 2025-11-02

# JSON output for detailed analysis
npm run kb:retrieve -- --query "XOR staking" --json > results.json
```

**Retrieval Options:**
- `--query <text>`: Your search query (required)
- `--limit <n>`: Number of results (default: 8)
- `--min-score <n>`: Minimum relevance score (default: 0.2)
- `--source <list>`: Filter by sources (e.g., `wiki,iroha_docs,ecosystem_updates`)
- `--lang <code>`: Filter by language (`en`, `ja`, `zh`)
- `--asof <date>`: Time-scope to snapshot date
- `--hybrid`: Use hybrid retrieval (vector + BM25)
- `--alpha <n>`: Hybrid fusion weight (default: 0.65)
- `--json`: Output as JSON for detailed analysis

### Step 4: Review Retrieved Content

Examine the retrieved chunks:
- **Relevance**: Do the results match your query?
- **Source**: Are they from authoritative sources?
- **Recency**: Is the information current?
- **Completeness**: Do they answer your question fully?

Look for:
- Direct answers to your queries
- Supporting evidence for claims
- Related information that could enhance the article
- Contradictions or outdated information

### Step 5: Improve the Article

Manually edit the article based on your findings:
1. **Verify Facts**: Cross-reference retrieved information with your article
2. **Add Details**: Incorporate relevant information from KB sources
3. **Update Content**: Fix outdated information
4. **Add Citations**: Reference sources when adding new information
5. **Maintain Tone**: Keep your writing style consistent

**Best Practices:**
- Always verify information from multiple sources when possible
- Cite authoritative sources (e.g., "According to the SORA Wiki...")
- Don't copy-paste directly; rewrite in your own words
- Keep the article's original voice and structure
- Focus on one article at a time for thorough review

### Step 6: Validate Improvements (Optional but Recommended)

After making significant changes, use `backtest.ts` to validate:

```bash
# Backtest an article against the KB
npm run kb:backtest -- --article apps/web/src/content/post/your-article.mdx

# Generate SARIF report for PR annotations
npm run kb:backtest -- --article path/to/article.mdx --sarif

# Time-scoped validation (use specific snapshot)
npm run kb:backtest -- --article path/to/article.mdx --asof 2025-11-02
```

The backtest will:
- Extract claims from your article
- Retrieve supporting evidence from the KB
- Score each claim (supported/conflicts/insufficient)
- Generate a report with suggested citations

**Review the backtest results:**
- **Supported claims**: Well-backed by KB evidence
- **Conflicts**: Claims that contradict KB sources (review carefully)
- **Insufficient**: Claims with weak or no supporting evidence (may need more research)

### Step 7: Commit and Publish

Once satisfied with improvements:
1. Commit the changes with a descriptive message
2. Push to your branch
3. Create or update a PR
4. Review the PR, then merge when ready

## Examples

### Example 1: Updating an Article About XOR Token

```bash
# 1. Research XOR token information
npm run kb:retrieve -- --query "XOR token utility and use cases" --source wiki --limit 10

# 2. Review results, edit article at apps/web/src/content/post/xor-token.mdx

# 3. Validate improvements
npm run kb:backtest -- --article apps/web/src/content/post/xor-token.mdx
```

### Example 2: Adding SORA v3 Governance Details

```bash
# 1. Search for governance information
npm run kb:retrieve -- --query "SORA v3 governance proposals voting" --hybrid --limit 8

# 2. Filter for most recent information
npm run kb:retrieve -- --query "SORA governance" --source ecosystem_updates --limit 5

# 3. Edit article with new information

# 4. Validate with backtest
npm run kb:backtest -- --article apps/web/src/content/post/sora-governance.mdx --sarif
```

## Tips for Effective Use

1. **Start Broad, Then Narrow**: Begin with general queries, then refine based on results
2. **Use Hybrid Retrieval**: The `--hybrid` flag combines semantic and keyword search for better results
3. **Check Multiple Sources**: Compare information across wiki, docs, and ecosystem updates
4. **Verify Timestamps**: Ensure information is current and relevant
5. **Keep Notes**: Document what you found and where, for future reference

## Troubleshooting

**No results found?**
- Try broader or different keywords
- Remove source filters to search all sources
- Check if the topic exists in the KB (run sync scripts if needed)

**Results not relevant?**
- Refine your query with more specific terms
- Use `--min-score` to filter low-relevance results
- Try hybrid retrieval for better keyword matching

**Information seems outdated?**
- Check the source date in retrieval results
- Re-sync sources: `npm run kb:sync:wiki` and `npm run kb:sync:medium`
- Re-ingest: `npm run kb:ingest`

## Next Steps

After improving articles, consider:
1. Running full KB verification: `npm run kb:test:determinism && npm run kb:test:retrieval`
2. Updating the KB README if you discover new useful sources
3. Sharing feedback on KB quality and coverage



