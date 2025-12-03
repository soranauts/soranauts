import React from 'react';

interface GlossaryRelatedProps {
  items: Array<{ term: string; href: string; slug?: string }>;
}

const GlossaryRelated = ({ items }: GlossaryRelatedProps) => {
  if (!items.length) return null;

  return (
    <section id="related" className="glossary-v3__section scroll-mt-28 md:scroll-mt-32" aria-labelledby="related-heading">
      <h3 id="related-heading">Related terms</h3>
      <ul className="glossary-v3__related-list">
        {items.map((item) => {
          // Extract slug from href if not provided directly
          const slug = item.slug || item.href.replace('/glossary/', '').replace(/\/$/, '');
          return (
            <li key={item.href}>
              <a 
                className="glossary-v3__chip" 
                href={item.href}
                data-qv-trigger={slug}
              >
                {item.term}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default GlossaryRelated;

