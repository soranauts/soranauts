import React from 'react';

export interface GlossaryTermHeroProps {
  title: string;
  category?: string | null;
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
  summary,
}: GlossaryTermHeroProps) {
  return (
    <section className="glossary-hero">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-3">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            {title}
          </h1>
          {category && (
            <span className="chip chip--md chip--neutral">
              {category}
            </span>
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

