import React from 'react';

export interface GlossaryTermHeroProps {
  title: string;
  category?: string | null;
  summary?: string | null;
  chips?: Array<{ term: string; href: string }>;
}

/**
 * Dedupe and sort chips alphabetically.
 * Ensures unique chips per term and stable ordering.
 */
function normalizeChips(chips: Array<{ term: string; href: string }>): Array<{ term: string; href: string }> {
  const seen = new Set<string>();
  return chips
    .filter((chip) => {
      const key = chip.href.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.term.localeCompare(b.term, 'en'));
}

/**
 * Rich gradient hero header for glossary term pages.
 * Uses the .glossary-hero class with branded gradient background.
 * Displays title, category badge, summary, and canonical chips only.
 * Follows Soranauts design tokens and Glossary QA rules.
 */
export function GlossaryTermHero({
  title,
  category,
  summary,
  chips = [],
}: GlossaryTermHeroProps) {
  const normalizedChips = normalizeChips(chips);
  return (
    <section className="glossary-hero">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-3">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            {title}
          </h1>
          {category && (
            <span className="glossary-chip w-max">
              {category}
            </span>
          )}
        </div>
        
        {summary && (
          <p className="max-w-prose text-base md:text-lg leading-relaxed">
            {summary}
          </p>
        )}
        
        {normalizedChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {normalizedChips.map((chip) => (
              <a
                key={chip.href}
                className="glossary-chip glossary-chip--muted"
                href={chip.href}
              >
                {chip.term}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GlossaryTermHero;

