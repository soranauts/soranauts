# BCK21 (Blockchain in Kyoto 2021) Source Files

This directory contains raw source files for BCK21 proceedings.

## Usage

1. **Download files** from the BCK21 proceedings page
2. **Place files** in this directory:
   - RIS files: `*.ris`
   - PDF files: `*.pdf`
3. **Run import script**:
   ```bash
   pnpm --filter @soranauts/web kb:bck24:import --year bck21
   ```

See `knowledge_base/sources/bck24/README.md` for full documentation.

