# Social Media Image Preview Fix - Complete Solution

## Problem
Blog posts were showing the generic "SORANAUTS" social share image instead of their specific blog post images in Telegram and other social media previews.

## Root Cause
**Duplicate Twitter image meta tags** were being generated:
1. `Layout.astro` was setting the generic social share image first
2. `BlogPostLayout.astro` was setting the specific blog post image second
3. Social platforms (like Telegram) read the **first** meta tag, which was the generic image

## Complete Solution

### 1. Copy Blog Post Images to Public Folder
```bash
# Copy all blog post images from assets to public folder
find src/content/post -name "*.mdx" -exec grep -l "image:" {} \; | xargs -I {} sh -c 'grep "image:" "{}" | head -1 | sed "s/.*image: *//" | sed "s/~/assets/images///" | sed "s/\"//g"' | while read img; do if [ -f "src/assets/images/$img" ]; then cp "src/assets/images/$img" "public/"; echo "Copied $img"; fi; done
```

### 2. Fix Duplicate Twitter Meta Tags
**Layout.astro** - Make Twitter image conditional:
```astro
export interface Props {
  metadata?: MetaDataType;
  isBlogPost?: boolean;  // Add this prop
}

const { metadata = {}, isBlogPost = false } = Astro.props;

<!-- Twitter Image Meta Tag - Only for non-blog pages -->
{!isBlogPost && <meta name="twitter:image" content={`${SITE.site}/soranauts-social-share.jpg`} />}
```

**BlogPostLayout.astro** - Pass isBlogPost prop and set specific image:
```astro
<Layout metadata={enhancedMetadata} isBlogPost={true}>
  <!-- Twitter Image Meta Tag for Blog Posts -->
  <meta name="twitter:image" content={directImageUrl} />
```

### 3. Use Direct URLs for Open Graph Images
**src/utils/images.ts** - Modified `adaptOpenGraphImages`:
```typescript
// For Open Graph images, use direct URLs instead of processed images
if (image.url.startsWith('~/assets/images/')) {
  const directUrl = image.url.replace('~/assets/images/', '/');
  return {
    url: String(new URL(directUrl, astroSite)),
    width: image?.width || defaultWidth,
    height: image?.height || defaultHeight,
  };
}
```

### 4. Pass Original Image Path
**src/pages/[...blog]/index.astro** - Pass original image path:
```astro
<Layout post={{ ...post, image: image, originalImage: post.image }} url={url} metadata={metadata}>
```

**src/layouts/BlogPostLayout.astro** - Use original path:
```typescript
const getDirectImageUrl = (): string => {
  const originalImage = (post as any).originalImage || post.image;
  if (!originalImage) return `${SITE.site}/soranauts-social-share.jpg`;
  if (typeof originalImage === 'string') {
    if (originalImage.startsWith('~/assets/images/')) {
      return `${SITE.site}${originalImage.replace('~/assets/images/', '/')}`;
    }
    return `${SITE.site}${originalImage}`;
  }
  return `${SITE.site}/soranauts-social-share.jpg`;
};
```

## Key Files Modified
- `src/layouts/Layout.astro` - conditional Twitter image
- `src/layouts/BlogPostLayout.astro` - specific blog post Twitter image
- `src/pages/[...blog]/index.astro` - pass originalImage prop
- `src/utils/images.ts` - direct URLs for Open Graph
- `public/` - copy all blog post images here

## Testing Commands
```bash
# Test local development
curl -s "http://localhost:4321/blog-post-url" | grep -E "twitter:image"

# Test production
curl -s "https://soranauts.com/blog-post-url" | grep -E "twitter:image"

# Should show only ONE twitter:image meta tag with the specific blog post image
```

## Prevention
- Always check for duplicate meta tags when adding social media features
- Use conditional rendering for layout-specific meta tags
- Test with `curl` and `grep` to verify meta tag output
- Copy static assets to `public/` folder for direct URL access

## Result
- ✅ Blog posts show their specific images in Telegram/social previews
- ✅ Homepage and other pages still use generic social share image
- ✅ No duplicate meta tags
- ✅ Direct URLs work reliably across all platforms
