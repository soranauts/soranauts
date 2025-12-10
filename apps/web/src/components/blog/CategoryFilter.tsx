import { useState } from 'react';
import type { Post } from '~/types';

interface CategoryFilterProps {
  categories: string[];
  initialCategory?: string;
  allPosts: Post[]; // Required - no fallback
}

// Number of categories to show before collapsing
const VISIBLE_CATEGORIES = 4;

export default function CategoryFilter({ categories, initialCategory, allPosts }: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Detect current page to highlight the correct button
  const getCurrentCategory = (): string => {
    if (typeof window === 'undefined') return 'all';
    
    const path = window.location.pathname;
    if (path === '/blog' || path === '/blog/') return 'all';
    
    const categoryMatch = path.match(/^\/category\/(.+)$/);
    if (categoryMatch) {
      // Find the original category name from the slug
      const slug = categoryMatch[1];
      const category = categories.find(cat => normalizeCategory(cat) === slug);
      return category || 'all';
    }
    
    return 'all';
  };

  // Normalize category casing - ensure consistent slug format (matches cleanSlug from permalinks.ts)
  const normalizeCategory = (category: string): string => {
    return category
      .toLowerCase()
      .replace(/&/g, 'and') // Replace & with 'and' (like limax does)
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const currentCategory = getCurrentCategory();

  // Calculate post counts for each category using server-side data
  const getCategoryPostCount = (category: string): number => {
    if (category === 'all') return allPosts.length;
    const normalizedCategory = normalizeCategory(category);
    return allPosts.filter(post => normalizeCategory(post.category || '') === normalizedCategory).length;
  };

  // Sort categories by post count (descending), keeping most popular first
  const sortedCategories = [...categories].sort((a, b) => {
    return getCategoryPostCount(b) - getCategoryPostCount(a);
  });

  // Determine which categories to show
  // Always include the current category in visible set if it exists
  const getVisibleCategories = () => {
    if (isExpanded) return sortedCategories;
    
    const topCategories = sortedCategories.slice(0, VISIBLE_CATEGORIES);
    
    // If current category is not 'all' and not in top categories, include it
    if (currentCategory !== 'all' && !topCategories.includes(currentCategory)) {
      // Replace the last visible category with the current one
      topCategories[VISIBLE_CATEGORIES - 1] = currentCategory;
    }
    
    return topCategories;
  };

  const visibleCategories = getVisibleCategories();
  const hiddenCount = sortedCategories.length - VISIBLE_CATEGORIES;
  const showExpandButton = hiddenCount > 0;

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      // Navigate to main blog page
      window.location.href = '/blog';
    } else {
      // Navigate to category page
      const categorySlug = normalizeCategory(category);
      window.location.href = `/category/${categorySlug}`;
    }
  };

  // Format category name for display
  const formatCategoryName = (category: string): string => {
    return category
      .replace(/-/g, ' ')
      .replace(/\band\b/g, '&')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\bSora\b/g, 'SORA')
      .replace(/\bDefi\b/g, 'DeFi');
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Filter by Category:
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* All button - always visible */}
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentCategory === 'all'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          All ({getCategoryPostCount('all')})
        </button>

        {/* Visible categories */}
        {visibleCategories.map((category) => {
          const postCount = getCategoryPostCount(category);
          return (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentCategory === category
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {formatCategoryName(category)} ({postCount})
            </button>
          );
        })}

        {/* Expand/Collapse button */}
        {showExpandButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Show fewer categories' : `Show ${hiddenCount} more categories`}
          >
            {isExpanded ? 'Show less' : `+${hiddenCount} more`}
          </button>
        )}
      </div>
    </div>
  );
}
