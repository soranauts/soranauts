# PDF Processing Guide

## Current Implementation

### ✅ What Works
- **Text Extraction**: All text content from PDFs is extracted
- **Page Splitting**: Each PDF page becomes a separate markdown file
- **Metadata Tracking**: Page numbers and source file tracked
- **Markdown Output**: Converted to markdown format for ingestion

### ❌ Current Limitations

1. **No Image Extraction**:
   - The `pdf-parse` library does NOT extract images from PDFs
   - Images in PDFs are completely ignored
   - No visual content is processed

2. **No OCR**:
   - Text embedded in images (screenshots, diagrams) is NOT extracted
   - Charts, graphs, and visual content are lost

3. **Text-Only Processing**:
   - Only plain text is extracted
   - Layout information may be lost
   - Tables may not be perfectly preserved

## How to Add a PDF

### Step 1: Place PDF File
```bash
# Create directory if needed
mkdir -p knowledge_base/pdfs

# Copy your PDF
cp /path/to/fearless-wallet-docs.pdf knowledge_base/pdfs/
```

### Step 2: Import PDF
```bash
pnpm --filter @soranauts/web kb:pdf:import
```

This will:
- Process all PDFs in `knowledge_base/pdfs/`
- Extract text from each page
- Create markdown files in `knowledge_base/pdfs_md/`
- Format: `{filename}-page-{N}.md`

### Step 3: Ingest (Already Updated)
The ingest script now includes `pdfs_md/` directory automatically:
```bash
pnpm --filter @soranauts/web kb:ingest
```

## Example Output

For a PDF named `fearless-wallet-docs.pdf` with 50 pages:

```
knowledge_base/pdfs_md/
├── fearless-wallet-docs-page-1.md
├── fearless-wallet-docs-page-2.md
├── ...
└── fearless-wallet-docs-page-50.md
```

Each file contains:
```markdown
---
title: fearless-wallet-docs.pdf - Page 1
source: pdf
source_url: file://knowledge_base/pdfs/fearless-wallet-docs.pdf
pdf_source: knowledge_base/pdfs/fearless-wallet-docs.pdf
pdf_page: 1
content_sha256: ...
snapshot_id: 2025-11-02
---

# fearless-wallet-docs.pdf - Page 1

[Extracted text content from page 1...]
```

## File Size Considerations

### For Large PDFs (58MB):
- The PDF file itself is stored in `knowledge_base/pdfs/`
- Only the extracted markdown is indexed (much smaller)
- Consider adding `knowledge_base/pdfs/` to `.gitignore` if PDFs are large
- Or use Git LFS for PDF storage

### Recommended Setup:
```gitignore
# In knowledge_base/.gitignore
pdfs/*.pdf
!pdfs/.gitkeep
```

## Future Enhancements (Not Implemented)

### Image Extraction Options:
1. **pdfjs-dist** (Mozilla PDF.js):
   - Can render PDF pages as images
   - Extract images from PDF pages
   - More complex, requires page rendering

2. **pdf-lib + canvas**:
   - Extract and save images from PDFs
   - Convert to PNG/JPG for storage
   - Would need vision model integration

3. **OCR Integration**:
   - Use Tesseract.js or cloud OCR
   - Extract text from images in PDFs
   - Process screenshots and diagrams

### Vision Model Integration:
- Use GPT-4 Vision or CLIP
- Analyze extracted PDF images
- Generate descriptions/embeddings
- Store alongside text chunks

## Current Workaround

For PDFs with important images:
1. **Manual Extraction**: Extract images manually and add alt text
2. **Descriptive Text**: Ensure PDF has good text descriptions of visual content
3. **Separate Image Files**: Export important diagrams as separate images with descriptions

## GitBook Export Tips

If exporting from GitBook:
1. **Export Format**: Choose PDF export that preserves text well
2. **Images**: Ensure images have captions/alt text in original
3. **Text Descriptions**: GitBook PDFs usually have good text extraction
4. **Structure**: Page breaks are usually preserved well











