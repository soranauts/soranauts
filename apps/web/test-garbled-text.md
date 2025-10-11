# Test Case for Garbled Text Issue

## Expected Output:
- "sustainable blockchain" should become "sustainable [blockchain](/glossary/blockchain)"
- "energy-intensive governance" should become "energy-intensive [governance](/glossary/governance)"

## Actual Broken Output:
- "sustainablblockchainive" (garbled)
- "regovernancenergy-intensive" (garbled)

## The Problem:
When the plugin tries to link terms in bold text, it's creating garbled concatenated words instead of proper links. This suggests the text replacement logic is fundamentally broken when dealing with nested text nodes (text inside bold/emphasis elements).

## Test Paragraph:
```
In modern blockchain design, PoS is seen as a more sustainable, balancing decentralization with lower environmental impact. Rather than energy-intensive mining, SORA emphasizes collaborative governance, validator participation, and algorithmic monetary systems.
```

## Expected Links:
- "blockchain" → `/glossary/blockchain`
- "sustainable" → `/glossary#sustainability` (if exists)
- "energy-intensive" → should remain unlinked
- "governance" → `/glossary/governance`
- "validator" → `/glossary/validator`
