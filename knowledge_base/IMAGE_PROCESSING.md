# Image Processing in Knowledge Base

## Current Image Handling

### 1. **Image Download** (During Import)
- Images are extracted from HTML during Medium post import
- Downloaded to local directories: `{publication}/images/`
- Filenames are hashed: `{sha256(url)}.{ext}`
- Original URLs are replaced with local paths: `./images/{hash}.{ext}`

### 2. **Image Preservation in Markdown**
- Images are converted to Markdown format: `![alt text](./images/hash.jpg)`
- Alt text and titles from HTML `<img>` tags are preserved
- Image references remain in the markdown content

### 3. **Current Limitations**
- **No image embeddings**: Images are NOT currently analyzed or embedded
- **Alt text only**: The AI can see alt text descriptions, but not the actual image content
- **No OCR**: Text in images is not extracted
- **No vision models**: No CLIP, GPT-4 Vision, or similar image understanding models

## What the AI Can See

### ✅ Available in Context:
1. **Alt text**: `![alt text description](./images/hash.jpg)`
2. **Image titles**: If present in original HTML
3. **Image position**: Where images appear in the document flow
4. **Captions**: If images had captions in the original post

### ❌ Not Available:
1. **Actual image pixels/content**
2. **Visual understanding** (diagrams, charts, screenshots)
3. **Text in images** (OCR not performed)
4. **Image embeddings** for visual similarity search

## Example

When a Medium post has:
```html
<img src="https://cdn.medium.com/chart.png" alt="SORA tokenomics chart showing distribution" />
```

It becomes in markdown:
```markdown
![SORA tokenomics chart showing distribution](./images/a1b2c3d4.png)
```

The AI sees: "SORA tokenomics chart showing distribution" but **cannot see the actual chart**.

## Future Enhancements (Not Implemented)

### Potential Improvements:
1. **Vision Models**:
   - Use GPT-4 Vision or CLIP to generate image embeddings
   - Store alongside text embeddings in vector DB
   - Enable visual similarity search

2. **OCR Integration**:
   - Extract text from images (diagrams, screenshots)
   - Append to markdown content
   - Makes text-in-images searchable

3. **Multimodal Embeddings**:
   - Combine text + image embeddings
   - Retrieve both text chunks and relevant images
   - Return images with text context in retrieval

4. **Image Description Generation**:
   - Use vision models to auto-generate detailed descriptions
   - Store in metadata for better retrieval

## Current Workaround

For better image context, ensure posts have:
- **Descriptive alt text**: `![Detailed description of what's shown]`
- **Captions**: Text near images explaining their content
- **Context in text**: Mention what images show in surrounding paragraphs

This way, even though the AI can't "see" images, the alt text and surrounding context provide sufficient information for most queries.










