import React from 'react';

export interface GlossaryTermHeroProps {
  title: string;
  category?: string | null;
  categorySlug?: string | null;
  summary?: string | null;
}

/**
 * Rich gradient hero header for glossary term pages.
 * Uses the .glossary-hero class with branded gradient background.
 * Displays title, category badge, and summary only.
 * Related terms are shown in a dedicated section below.
 * Follows Soranauts design tokens and Glossary QA rules.
 */
export function GlossaryTermHero({
  title,
  category,
  categorySlug,
  summary,
}: GlossaryTermHeroProps) {
  // Derive slug from category if not provided
  const slug = categorySlug || category?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <section className="glossary-hero">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <div className="flex flex-col items-start space-y-3">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            {title}
          </h1>
          {category && (
            <a 
              href={`/glossary?category=${encodeURIComponent(slug || '')}#glossary-search-results`}
              className="chip chip--md chip--neutral hover:bg-white/20 transition-colors"
              title={`View all ${category} terms`}
            >
              {category}
            </a>
          )}
        </div>
        
        {summary && (
          <p className="max-w-prose text-base md:text-lg leading-relaxed">
            {summary}
          </p>
        )}
      </div>
    </section>
  );
}

export default GlossaryTermHero;

