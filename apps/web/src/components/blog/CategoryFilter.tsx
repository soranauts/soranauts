import type { Post } from '~/types';

interface CategoryFilterProps {
  categories: string[];
  initialCategory?: string;
  allPosts: Post[]; // Required - no fallback
}

export default function CategoryFilter({ categories, initialCategory, allPosts }: CategoryFilterProps) {
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

  // Get normalized categories from posts
  const normalizedCategories = categories.map(normalizeCategory);

  // No client-side filtering needed - we navigate to category pages

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

  // Calculate post counts for each category using server-side data
  const getCategoryPostCount = (category: string): number => {
    if (category === 'all') return allPosts.length;
    const normalizedCategory = normalizeCategory(category);
    return allPosts.filter(post => normalizeCategory(post.category) === normalizedCategory).length;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Filter by Category:
      </h3>
      <div className="flex flex-wrap gap-2">
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
        {categories.map((category) => {
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
              {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(/\bSora\b/g, 'SORA').replace(/\bDefi\b/g, 'DeFi').replace(/\bAnd\b/g, '&')} ({postCount})
            </button>
          );
        })}
      </div>
    </div>
  );
}
