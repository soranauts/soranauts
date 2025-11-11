import { useEffect, useMemo, useState } from 'react';
import { formatTagLabel } from '~/lib/tag-hub';

type TagHubTrait =
  | 'foundational'
  | 'glossary-linked'
  | 'beginner-friendly'
  | 'advanced'
  | 'trending'
  | 'builder-guide';

type Tag = {
  slug: string;
  title: string;
  summary?: string;
  domain: string;
  domainLabel?: string;
  traits: TagHubTrait[];
  quickPathIds: string[];
  usageCount: number;
  firstSeen?: string;
  lastSeen?: string;
  glossaryRef?: string;
  category?: string;
  relatedTags: string[];
  aliases: string[];
};

type DomainOption = {
  id: string;
  label: string;
};

type TraitFilterOption = {
  id: string;
  label: string;
  trait: TagHubTrait;
};

type SortOption = 'freshness' | 'count' | 'alpha';

type Props = {
  tags: Tag[];
  domains: DomainOption[];
  traitFilters: TraitFilterOption[];
  title?: string;
  description?: string;
};

const SORT_LABELS: Record<SortOption, string> = {
  freshness: 'Freshness',
  count: 'Count',
  alpha: 'A–Z',
};

const sortByFreshness = (a: Tag, b: Tag) => {
  const aDate = a.lastSeen ? new Date(a.lastSeen).valueOf() : 0;
  const bDate = b.lastSeen ? new Date(b.lastSeen).valueOf() : 0;
  return bDate - aDate;
};

const sortByCount = (a: Tag, b: Tag) => b.usageCount - a.usageCount;

const sortByAlpha = (a: Tag, b: Tag) => a.title.localeCompare(b.title, 'en');

const SORTERS: Record<SortOption, (a: Tag, b: Tag) => number> = {
  freshness: sortByFreshness,
  count: sortByCount,
  alpha: sortByAlpha,
};

const slugToPath = (slug: string) => `/tag/${slug.replace(/^tag-/, '')}`;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const matchesQuery = (tag: Tag, query: string) => {
  if (!query) return true;
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  const haystack = [
    tag.title,
    tag.summary ?? '',
    tag.slug,
    ...(tag.aliases ?? []),
    ...(tag.relatedTags ?? []),
  ]
    .map((value) => normalize(value))
    .join(' ');

  return haystack.includes(normalizedQuery);
};

const useQueryState = (tags: Tag[], traitFilters: TraitFilterOption[]) => {
  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  const parseTraits = (raw: string | null): TagHubTrait[] => {
    if (!raw) return [];
    const values = raw.split(',').map((value) => value.trim());
    const valid = new Set(traitFilters.map((filter) => filter.trait));
    return values.filter((value): value is TagHubTrait => valid.has(value as TagHubTrait));
  };

  const [search, setSearch] = useState<string>(searchParams?.get('q') ?? '');
  const [domain, setDomain] = useState<string>(searchParams?.get('domain') ?? 'all');
  const [sort, setSort] = useState<SortOption>(() => {
    const value = searchParams?.get('sort');
    return value === 'alpha' || value === 'count' || value === 'freshness' ? value : 'freshness';
  });
  const [traits, setTraits] = useState<TagHubTrait[]>(parseTraits(searchParams?.get('traits') ?? null));

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim().length > 0) params.set('q', search.trim());
    if (domain !== 'all') params.set('domain', domain);
    if (sort !== 'freshness') params.set('sort', sort);
    if (traits.length > 0) params.set('traits', traits.join(','));

    const paramString = params.toString();
    const newUrl = paramString.length > 0 ? `?${paramString}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [search, domain, sort, traits]);

  return {
    search,
    setSearch,
    domain,
    setDomain,
    sort,
    setSort,
    traits,
    setTraits,
  };
};

const filterTag = (
  tag: Tag,
  searchQuery: string,
  domainFilter: string,
  traitSet: Set<TagHubTrait>,
) => {
  if (!matchesQuery(tag, searchQuery)) return false;

  if (domainFilter !== 'all' && tag.domain !== domainFilter) return false;

  if (traitSet.size > 0) {
    const tagTraits = new Set(tag.traits ?? []);
    for (const trait of traitSet) {
      if (!tagTraits.has(trait)) return false;
    }
  }

  return true;
};

const formatCount = (count: number) => {
  if (count === 0) return 'No posts yet';
  if (count === 1) return '1 post';
  return `${count.toLocaleString()} posts`;
};

const formatDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return null;
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};

const TraitChip = ({ label }: { label: string }) => (
  <span className="tag-card__chip">{label}</span>
);

const TagFilters = ({ tags, domains, traitFilters, title, description }: Props) => {
  const { search, setSearch, domain, setDomain, sort, setSort, traits, setTraits } =
    useQueryState(tags, traitFilters);

  const traitSet = useMemo(() => new Set(traits), [traits]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input (150ms) for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 150);
    return () => clearTimeout(timer);
  }, [search]);

  const results = useMemo(() => {
    const filtered = tags.filter((tag) => filterTag(tag, debouncedSearch, domain, traitSet));
    return filtered.sort(SORTERS[sort]);
  }, [tags, debouncedSearch, domain, traitSet, sort]);

  const toggleTrait = (trait: TagHubTrait) => {
    setTraits((prev) => {
      if (prev.includes(trait)) {
        return prev.filter((value) => value !== trait);
      }
      return [...prev, trait];
    });
  };

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en', {
        maximumFractionDigits: 0,
      }),
    [],
  );

  return (
    <section className="tag-hub-controls" aria-label="Tag explorer controls and results">
      <div className="tag-hub-controls__inner">
        {(title || description) && (
          <header className="tag-hub-controls__header">
            {title && <h2 className="tag-hub-controls__title">{title}</h2>}
            {description && <p className="tag-hub-controls__description">{description}</p>}
          </header>
        )}
        <div className="tag-hub-controls__toolbar">
          <div className="tag-hub-controls__inputs">
            <div className="tag-hub-controls__search">
              <label htmlFor="tag-hub-search" className="sr-only">
                Search tags
              </label>
              <input
                id="tag-hub-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tags, aliases, and summaries"
                autoComplete="off"
              />
            </div>

            <div className="tag-hub-controls__selects">
              <label className="sr-only" htmlFor="tag-hub-domain">
                Filter by domain
              </label>
              <select
                id="tag-hub-domain"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
              >
                <option value="all">All domains</option>
                {domains.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="tag-hub-sort">
                Sort tags
              </label>
              <select
                id="tag-hub-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <option key={option} value={option}>
                    {SORT_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tag-hub-controls__meta" role="status" aria-live="polite">
            <p className="tag-hub-controls__count" data-testid="tag-hub-count">
              {results.length === 0
                ? 'No tags match your filters yet.'
                : `${formatter.format(results.length)} tag${results.length === 1 ? '' : 's'} available`}
            </p>
          </div>
        </div>

        <div className="tag-hub-controls__filters" role="group" aria-label="Tag traits">
          {traitFilters.map((filter) => {
            const active = traitSet.has(filter.trait);
            return (
              <button
                key={filter.id}
                type="button"
                className={`tag-filter-pill${active ? ' tag-filter-pill--active' : ''}`}
                onClick={() => toggleTrait(filter.trait)}
                aria-pressed={active}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="tag-hub-controls__results">
        <div className="tag-hub-grid" data-testid="tag-hub-results">
          {results.length === 0 ? (
            <div className="tag-hub-empty">
              <h3>Try adjusting your filters</h3>
              <p>
                Widen the trait selection, clear the domain filter, or search for a broader term to
                discover relevant topics.
              </p>
            </div>
          ) : (
            results.map((tag) => {
              const lastUpdated = formatDate(tag.lastSeen);
              const formattedTitle = formatTagLabel(tag.slug, tag.title);
              return (
                // If interactive children are added, ensure they stop propagation so the card link remains the primary activation target.
                <a key={tag.slug} className="tag-card" href={slugToPath(tag.slug)} role="group">
                  <div className="tag-card__header">
                    <span className="tag-card__domain">{tag.domainLabel ?? tag.domain.replace(/-/g, ' ')}</span>
                    {tag.glossaryRef && <span className="tag-card__badge">Glossary</span>}
                  </div>
                  <h3 className="tag-card__title">{formattedTitle}</h3>
                  {tag.summary && <p className="tag-card__summary">{tag.summary}</p>}
                  <div className="tag-card__footer">
                    <span className="tag-card__stat">{formatCount(tag.usageCount)}</span>
                    {lastUpdated && (
                      <span className="tag-card__stat tag-card__stat--muted">
                        Updated {lastUpdated}
                      </span>
                    )}
                  </div>
                  {tag.traits.length > 0 && (
                    <div className="tag-card__traits" aria-label="Tag traits">
                      {tag.traits.map((trait) => (
                        <TraitChip key={`${tag.slug}-${trait}`} label={trait.replace(/-/g, ' ')} />
                      ))}
                    </div>
                  )}
                </a>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default TagFilters;

export type { TagHubTrait, TraitFilterOption as TagHubTraitFilter, DomainOption as TagHubDomainOption, Tag as TagHubClientTag };



