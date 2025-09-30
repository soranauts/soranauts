# Custom Social Sharing Images Guide

This guide explains how to add custom social sharing images for any page on the Soranauts website.

## Overview

Each page can specify its own social sharing image that will be used when the page is shared on:
- **Twitter/X** - Shows as a large image card
- **Facebook** - Shows in the link preview
- **LinkedIn** - Shows in the link preview
- **WhatsApp** - Shows in the link preview
- **Other platforms** - Any platform that supports Open Graph meta tags

## Image Requirements

### Dimensions
- **Recommended**: 1200x630 pixels (1.91:1 aspect ratio)
- **Minimum**: 600x315 pixels
- **Maximum**: 8MB file size

### Format
- **Recommended**: JPG or PNG
- **Quality**: High quality, crisp text and graphics

### Content Guidelines
- Include the page title or key concept
- Use the Soranauts brand colors and fonts
- Keep text large and readable on mobile
- Avoid cluttered designs
- Include relevant SORA ecosystem imagery

## How to Add Custom Images

### Step 1: Create the Image
1. Design your social sharing image (1200x630px)
2. Save it in the `public/` directory
3. Use a descriptive filename like `page-name-social-share.jpg`

### Step 2: Update Page Metadata
Add the custom image to your page's metadata:

```astro
---
// Your page imports and setup
---

<Layout 
  metadata={{
    title: 'Your Page Title',
    description: 'Your page description',
    openGraph: {
      url: `${SITE.site}/your-page-url`,
      siteName: 'Soranauts',
      type: 'website',
      images: [
        {
          url: `${SITE.site}/your-custom-image.jpg`,
          width: 1200,
          height: 630
        }
      ]
    },
    twitter: {
      cardType: 'summary_large_image'
    }
  }}
>
  <!-- Your page content -->
</Layout>
```

### Step 3: Test Your Implementation
1. Use Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Use Twitter's [Card Validator](https://cards-dev.twitter.com/validator)
3. Test on different platforms to ensure the image displays correctly

## Examples

### Current Implementations

#### Glossary Page
- **File**: `public/sora-glossary-social-share.jpg`
- **Shows**: SORA Glossary title with relevant icons/terms

#### Blog Posts
- **File**: `public/soranauts-social-share.jpg` (default)
- **Shows**: Soranauts branding with SORA ecosystem imagery

### Template for New Pages

```astro
---
import Layout from '~/layouts/Layout.astro';
import { SITE } from '~/utils/config';
// Other imports...

// Your page logic...
---

<Layout 
  metadata={{
    title: 'Page Title | Soranauts',
    description: 'Brief description of your page content.',
    openGraph: {
      url: `${SITE.site}/your-page-url`,
      siteName: 'Soranauts',
      type: 'website',
      images: [
        {
          url: `${SITE.site}/your-page-social-share.jpg`,
          width: 1200,
          height: 630
        }
      ]
    },
    twitter: {
      cardType: 'summary_large_image'
    }
  }}
>
  <!-- Your page content -->
</Layout>
```

## Best Practices

### Design
- Use high contrast text for readability
- Include the Soranauts logo
- Keep the design consistent with the website branding
- Use relevant SORA ecosystem imagery (tokens, network diagrams, etc.)

### Technical
- Always specify width and height in metadata
- Use absolute URLs (include `${SITE.site}/`)
- Test on multiple platforms
- Keep file sizes reasonable (under 1MB when possible)

### SEO
- Use descriptive filenames
- Include relevant keywords in the image alt text
- Ensure the image represents the page content accurately

## Troubleshooting

### Image Not Showing
1. Check that the file exists in the `public/` directory
2. Verify the URL in metadata is correct
3. Clear social media platform caches using their debug tools
4. Check that the image dimensions meet platform requirements

### Poor Quality on Mobile
1. Ensure text is large enough to read on small screens
2. Use high resolution images (1200x630px minimum)
3. Avoid fine details that won't be visible on mobile

### Platform-Specific Issues
- **Twitter**: Use `summary_large_image` card type
- **Facebook**: Images must be at least 600x315px
- **LinkedIn**: Similar to Facebook, prefers larger images

## Future Enhancements

Consider implementing:
- Automatic image generation for blog posts
- Dynamic social images based on page content
- A/B testing different social images
- Analytics to track social sharing engagement





