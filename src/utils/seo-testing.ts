// SEO Testing Utilities
export interface SEOTestResult {
  passed: boolean;
  message: string;
  suggestion?: string;
}

export interface SEOAuditResult {
  score: number;
  results: SEOTestResult[];
  recommendations: string[];
}

// Test functions for SEO validation
export function testTitleTag(title: string): SEOTestResult {
  if (!title) {
    return {
      passed: false,
      message: "Missing title tag",
      suggestion: "Add a descriptive title tag"
    };
  }
  
  if (title.length < 30) {
    return {
      passed: false,
      message: "Title too short",
      suggestion: "Title should be 30-60 characters for optimal SEO"
    };
  }
  
  if (title.length > 60) {
    return {
      passed: false,
      message: "Title too long",
      suggestion: "Title should be 30-60 characters for optimal SEO"
    };
  }
  
  return {
    passed: true,
    message: "Title tag is optimal"
  };
}

export function testMetaDescription(description: string): SEOTestResult {
  if (!description) {
    return {
      passed: false,
      message: "Missing meta description",
      suggestion: "Add a compelling meta description"
    };
  }
  
  if (description.length < 120) {
    return {
      passed: false,
      message: "Meta description too short",
      suggestion: "Description should be 120-160 characters for optimal SEO"
    };
  }
  
  if (description.length > 160) {
    return {
      passed: false,
      message: "Meta description too long",
      suggestion: "Description should be 120-160 characters for optimal SEO"
    };
  }
  
  return {
    passed: true,
    message: "Meta description is optimal"
  };
}

export function testHeadingStructure(headings: string[]): SEOTestResult {
  if (headings.length === 0) {
    return {
      passed: false,
      message: "No headings found",
      suggestion: "Add H1, H2, H3 headings to structure your content"
    };
  }
  
  const h1Count = headings.filter(h => h.startsWith('H1')).length;
  if (h1Count === 0) {
    return {
      passed: false,
      message: "No H1 heading found",
      suggestion: "Add an H1 heading to your page"
    };
  }
  
  if (h1Count > 1) {
    return {
      passed: false,
      message: "Multiple H1 headings found",
      suggestion: "Use only one H1 heading per page"
    };
  }
  
  return {
    passed: true,
    message: "Heading structure is good"
  };
}

export function testImageAltText(images: HTMLImageElement[]): SEOTestResult {
  const imagesWithoutAlt = images.filter(img => !img.alt);
  
  if (imagesWithoutAlt.length > 0) {
    return {
      passed: false,
      message: `${imagesWithoutAlt.length} images missing alt text`,
      suggestion: "Add descriptive alt text to all images"
    };
  }
  
  return {
    passed: true,
    message: "All images have alt text"
  };
}

export function testInternalLinks(links: HTMLAnchorElement[]): SEOTestResult {
  const internalLinks = links.filter(link => 
    link.href.startsWith('/') || 
    link.href.includes(window.location.hostname)
  );
  
  if (internalLinks.length < 2) {
    return {
      passed: false,
      message: "Not enough internal links",
      suggestion: "Add more internal links to improve site structure"
    };
  }
  
  return {
    passed: true,
    message: "Good internal linking"
  };
}

// Main SEO audit function
export function performSEOAudit(document: Document): SEOAuditResult {
  const results: SEOTestResult[] = [];
  const recommendations: string[] = [];
  
  // Test title
  const title = document.querySelector('title')?.textContent || '';
  results.push(testTitleTag(title));
  
  // Test meta description
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  results.push(testMetaDescription(metaDescription));
  
  // Test headings
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .map(h => `H${h.tagName[1]} ${h.textContent?.trim() || ''}`)
    .filter(h => h.length > 3);
  results.push(testHeadingStructure(headings));
  
  // Test images
  const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
  results.push(testImageAltText(images));
  
  // Test internal links
  const links = Array.from(document.querySelectorAll('a')) as HTMLAnchorElement[];
  results.push(testInternalLinks(links));
  
  // Calculate score
  const passedTests = results.filter(r => r.passed).length;
  const score = Math.round((passedTests / results.length) * 100);
  
  // Generate recommendations
  results.forEach(result => {
    if (!result.passed && result.suggestion) {
      recommendations.push(result.suggestion);
    }
  });
  
  return {
    score,
    results,
    recommendations
  };
}

// Browser console testing function
export function runSEOAuditInBrowser() {
  if (typeof window === 'undefined') {
    console.log('This function must be run in the browser');
    return;
  }
  
  const audit = performSEOAudit(document);
  
  console.log('🔍 SEO Audit Results:');
  console.log(`Score: ${audit.score}/100`);
  console.log('\n📊 Test Results:');
  audit.results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${index + 1}. ${result.message}`);
    if (result.suggestion) {
      console.log(`   💡 ${result.suggestion}`);
    }
  });
  
  if (audit.recommendations.length > 0) {
    console.log('\n🚀 Recommendations:');
    audit.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  return audit;
}
