# Article Template & Guidelines for Soranauts

> For KB-aligned edit planning (before you rewrite an article), see  
> `docs/ARTICLE_EDIT_PLAN_TEMPLATE.md`.

## 📋 Article Structure Template

### Frontmatter (Required)
```yaml
---
publishDate: YYYY-MM-DDTHH:MM:SSZ
updateDate: YYYY-MM-DDTHH:MM:SSZ
title: "Article Title: Descriptive Subtitle for SEO"
excerpt: "Compelling 150-160 character description that includes target keywords and explains the value proposition."
image: ~/assets/images/article-filename.jpg
category: "Category Name"
tags: ["Primary", "Secondary", "Keywords", "For", "SEO"]
metadata:
  canonical: https://soranauts.com/article-slug
  robots:
    index: true
    follow: true
  title: "Article Title: Descriptive Subtitle | Soranauts"
  description: "SEO-optimized description with target keywords and value proposition."
  openGraph:
    url: https://soranauts.com/article-slug
    siteName: "Soranauts"
    images:
      - url: https://soranauts.com/assets/images/article-filename.jpg
        width: 900
        height: 506
    locale: "en_US"
    type: "article"
  twitter:
    handle: "@soranauts"
    site: "@soranauts"
    cardType: "summary_large_image"
---
```

### Content Structure
```markdown
<!-- NO H1 TITLE IN CONTENT - Blog layout handles this -->

[Opening paragraph that hooks the reader and introduces the main topic]

## Section Heading (H2)

[Content with 2-3 contextual links per major section]

### Subsection (H3)

[Supporting content with relevant internal/external links]

---

## Next Major Section (H2)

[Continue with natural flow and strategic linking]

---

## Conclusion Section (H2)

[Wrap up with key takeaways and call-to-action]

---

## Additional Resources

### 📚 Essential Reading
- [Internal Article Title](https://soranauts.com/internal-article-slug) - Brief description
- [Another Internal Article](https://soranauts.com/another-slug) - Brief description

### 🔗 External Tools & Platforms
- [Official Website](https://external-site.com) - What users can do there
- [Platform/Exchange](https://platform.com) - Brief description of value

### 🌐 Community & Support
- [Community Channel](https://community-link.com) - What users will find
- [Documentation](https://docs-site.com) - Comprehensive resources
- [Support Forum](https://support-link.com) - Help and assistance
```

## 🎯 Linking Guidelines

### In-Article Links (Contextual)
- **2-3 links per major section maximum**
- **External authority sources**: Official websites, documentation, tools
- **Internal deep-dives**: Related articles for specific topics
- **Descriptive anchor text**: Use meaningful, keyword-rich text
- **Natural placement**: Links should enhance understanding, not interrupt flow

### Link Types by Purpose
- **External Authority**: `[Company Name](https://official-site.com)` - First mention
- **Internal Deep-Dive**: `[Comprehensive Guide Title](https://soranauts.com/article-slug)` - Specific topics
- **Reference Links**: `[Source Name](https://source.com)` - Supporting evidence

### Avoid These Link Mistakes
- ❌ Duplicate links to same destination
- ❌ Generic anchor text like "click here" or "read more"
- ❌ Over-linking (more than 3 links per paragraph)
- ❌ Links that don't add value
- ❌ Broken or outdated links

## 📝 Content Guidelines

### Title Structure
- **Format**: "Primary Topic: Descriptive Subtitle for SEO"
- **Length**: 50-60 characters for optimal display
- **Keywords**: Include primary and secondary keywords
- **Value**: Promise clear benefit to reader

### Excerpt Guidelines
- **Length**: 150-160 characters
- **Keywords**: Include target keywords naturally
- **Value Proposition**: Explain what reader will learn
- **Call to Action**: Imply benefit or solution

### Section Headings
- **H2**: Major topics (2-4 per article)
- **H3**: Subsections within major topics
- **H4+**: Only if absolutely necessary
- **Keywords**: Include relevant keywords in headings
- **Descriptive**: Clear what section covers

### Content Flow
1. **Hook**: Engaging opening that addresses reader's problem
2. **Context**: Background information and why it matters
3. **Main Content**: Detailed explanation with examples
4. **Conclusion**: Key takeaways and next steps
5. **Resources**: Curated links for further exploration

## 🔍 SEO Checklist

### Before Publishing
- [ ] Title matches filename (for URL consistency)
- [ ] No duplicate H1 tags (blog layout handles title)
- [ ] No duplicate internal links
- [ ] All external links work and are relevant
- [ ] Meta description is 150-160 characters
- [ ] Images have descriptive alt text
- [ ] Internal links use descriptive anchor text
- [ ] External links open in new tab (if needed)
- [ ] Related Articles section will work (tags/category set)

### Content Quality
- [ ] Article provides unique value
- [ ] Information is accurate and up-to-date
- [ ] Writing is clear and engaging
- [ ] Proper use of headings and formatting
- [ ] Good balance of internal/external links
- [ ] Call-to-action included

## 🎨 Visual Guidelines

### Additional Resources Format
- **Use icons**: 📚 🔗 🌐 for visual distinction
- **Categorize clearly**: Essential Reading, External Tools, Community
- **Descriptive text**: Brief explanation of what user will find
- **Consistent formatting**: Same structure across all articles

### Link Styling
- **Internal links**: Standard blue with hover effects
- **External links**: Include external icon if needed
- **Resource links**: Categorized with clear descriptions

## 📊 Performance Tracking

### Monitor These Metrics
- **Click-through rates** on internal links
- **Related Articles performance**
- **External link clicks**
- **Time on page**
- **Bounce rate**

### Regular Updates
- **Quarterly**: Review and update external links
- **Monthly**: Check for broken links
- **As needed**: Update outdated information

## 🚫 Common Mistakes to Avoid

### Content Issues
- ❌ Starting with H1 title in content
- ❌ Duplicate links to same destination
- ❌ Generic or weak anchor text
- ❌ Over-linking in single sections
- ❌ Outdated or broken external links

### SEO Issues
- ❌ Title/URL mismatches
- ❌ Missing or poor meta descriptions
- ❌ No internal linking strategy
- ❌ Poor heading structure
- ❌ Missing alt text on images

### User Experience Issues
- ❌ Confusing navigation
- ❌ Redundant information
- ❌ Poor mobile formatting
- ❌ Slow loading images
- ❌ Inaccessible content

## 📋 Pre-Publication Checklist

### Technical
- [ ] File named to match title
- [ ] Frontmatter complete and accurate
- [ ] No duplicate titles or links
- [ ] All links tested and working
- [ ] Images optimized and have alt text

### Content
- [ ] Article provides unique value
- [ ] Information is accurate
- [ ] Writing is clear and engaging
- [ ] Proper heading structure
- [ ] Good link balance

### SEO
- [ ] Title optimized for search
- [ ] Meta description compelling
- [ ] Keywords naturally integrated
- [ ] Internal linking strategy implemented
- [ ] External links add authority

---

**Remember**: This template ensures consistent, SEO-optimized articles that provide value to readers while maintaining the site's professional standards.
