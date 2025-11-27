import type { ReactNode } from 'react';

interface RelatedArticle {
  title: string;
  href: string;
  date?: string | null;
}

interface Props {
  term?: string | null;
  category?: string | null;
  relatedTerms?: string[];
  relatedArticles?: RelatedArticle[];
}

const humanize = (value: string): string =>
  value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const ExplorerGlossaryContext = ({
  term,
  category,
  relatedTerms = [],
  relatedArticles = [],
}: Props) => {
  const hasTerms = relatedTerms.length > 0;
  const hasArticles = relatedArticles.length > 0;

  if (!hasTerms && !hasArticles) {
    return null;
  }

  const title = term ? humanize(term) : category ?? 'Glossary context';

  const eyebrow: ReactNode = term ? 'Explorer term' : 'Explorer category';

  return (
    <aside className="explorer-context" aria-label="Glossary context">
      <header className="explorer-context__header">
        <span className="explorer-context__eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {term && (
          <a className="explorer-context__cta" href={`/glossary/${term}#definition`}>
            View glossary definition
          </a>
        )}
      </header>

      {hasTerms && (
        <section className="explorer-context__section" aria-label="Related terms">
          <h3>Related terms</h3>
          <div className="explorer-context__chips">
            {relatedTerms.map((slug) => (
              <a key={slug} className="tag tag--pill" href={`/glossary/${slug}#definition`}>
                {humanize(slug)}
              </a>
            ))}
          </div>
        </section>
      )}

      {hasArticles && (
        <section className="explorer-context__section" aria-label="Related articles">
          <h3>Recent articles</h3>
          <ul className="explorer-context__articles">
            {relatedArticles.map((article) => (
              <li key={`${article.href}-${article.title}`}>
                <a href={article.href}>{article.title}</a>
                {article.date && <span>{article.date}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
};

export default ExplorerGlossaryContext;

