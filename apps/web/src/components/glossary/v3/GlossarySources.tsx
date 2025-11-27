import React from 'react';

interface GlossarySource {
  label: string;
  url: string;
}

interface GlossarySourcesProps {
  sources: GlossarySource[];
}

const GlossarySources = ({ sources }: GlossarySourcesProps) => {
  if (!sources.length) return null;

  return (
    <section id="sources" className="glossary-v3__section" aria-labelledby="sources-heading">
      <h3 id="sources-heading">Sources</h3>
      <ul className="glossary-v3__sources-list">
        {sources.map((source) => (
          <li key={source.url}>
            <a className="glossary-v3__source-link" href={source.url} target="_blank" rel="noopener noreferrer">
              <span>{source.label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export type { GlossarySource };
export default GlossarySources;

