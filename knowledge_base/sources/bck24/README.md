# BCK24 (Blockchain Kaigi 2024) Source Files

This directory contains raw source files for BCK24 proceedings:

- **RIS files** (`.ris`): Bibliographic metadata in RIS format
- **PDF files** (`.pdf`): Full paper PDFs

## Usage

1. **Download files** from: https://journals.jps.jp/doi/book/10.7566/BCK24
2. **Place files** in this directory:
   - RIS files: `*.ris`
   - PDF files: `*.pdf`
3. **Run import script**:
   ```bash
   # Process specific year
   pnpm --filter @soranauts/web kb:bck24:import --year bck24
   
   # Process all years (bck21, bck22, bck23, bck24)
   pnpm --filter @soranauts/web kb:bck24:import --year all
   ```

## Output

The script will:
- Parse RIS files for metadata (title, authors, DOI, abstract, etc.)
- Match PDFs to RIS entries
- Generate curated markdown summaries in `knowledge_base/curated/research/bck24/`
- One markdown file per paper (not per page)

## Filtering

The script automatically includes:
- All papers by Makoto Takemiya
- Papers relevant to SORA/Iroha/Soramitsu/CBDCs/infrastructure
- All BCK24 papers (tagged as general if not directly relevant)

## Notes

- PDFs are NOT committed to git (gitignored)
- Only curated markdown summaries are committed
- PDFs are used only to improve summaries, not to create per-page markdown

