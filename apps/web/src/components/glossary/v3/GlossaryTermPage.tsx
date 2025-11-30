import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import '~/assets/styles/glossary-v3.css';

import GlossaryAnchors from './GlossaryAnchors';
import GlossaryRelated from './GlossaryRelated';
import GlossarySources, { type GlossarySource } from './GlossarySources';
import type { GlossaryV3Section } from './types';

export type { GlossaryV3Section } from './types';

export interface GlossaryTermPageProps {
  title: string;
  summary?: string | null;
  definition: string;
  whyItMatters?: string | null;
  related: Array<{ term: string; href: string }>;
  sources?: GlossarySource[];
  categoryLabel?: string | null;
  chips?: Array<{ term: string; href: string }>;
  definitionHtml?: string;
  lastUpdate?: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

interface SectionVisibilityConfig {
  hasWhy: boolean;
  hasRelated: boolean;
  hasSources: boolean;
}

export function buildSections({ hasWhy, hasRelated, hasSources }: SectionVisibilityConfig): GlossaryV3Section[] {
  const base: GlossaryV3Section[] = [
    { id: 'definition', label: 'Definition', visible: true },
    { id: 'why', label: 'Why it matters', visible: hasWhy },
    { id: 'related', label: 'Related', visible: hasRelated },
    { id: 'sources', label: 'Sources', visible: hasSources },
  ];

  return base.filter((section) => section.visible);
}

export function resolveHashTarget(hash: string, sections: GlossaryV3Section[]): string | null {
  if (!hash) return null;
  const normalized = hash.startsWith('#') ? hash.slice(1) : hash;
  const match = sections.find((section) => section.id === normalized);
  return match ? match.id : null;
}

const GlossaryTermPage = ({
  title,
  summary,
  definition,
  whyItMatters,
  related,
  sources = [],
  categoryLabel,
  chips = [],
  definitionHtml,
  lastUpdate,
}: GlossaryTermPageProps) => {
  const hasWhy = Boolean(whyItMatters && whyItMatters.trim().length);
  const hasRelated = related.length > 0;
  const hasSources = sources.length > 0;

  const sections = useMemo(
    () => buildSections({ hasWhy, hasRelated, hasSources }),
    [hasWhy, hasRelated, hasSources],
  );

  const [activeSection, setActiveSection] = useState<string>('definition');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const anchorsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    window.history.replaceState({}, '', `#${id}`);
  }, []);

  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: '-20% 0px -60% 0px',
      },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const handleHash = () => {
      const target = resolveHashTarget(window.location.hash, sections);
      if (target) {
        scrollToSection(target);
        setActiveSection(target);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [sections, scrollToSection]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setDrawerOpen(true);
        anchorsRef.current?.focus();
        return;
      }

      if (event.key === 'j' || event.key === 'k') {
        event.preventDefault();
        const index = sections.findIndex((section) => section.id === activeSection);
        const nextIndex = event.key === 'j' ? index + 1 : index - 1;
        const nextSection = sections[nextIndex];
        if (nextSection) {
          scrollToSection(nextSection.id);
        }
        return;
      }

      if (event.key === 'Enter' && document.activeElement === anchorsRef.current) {
        event.preventDefault();
        scrollToSection(activeSection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sections, activeSection, scrollToSection]);

  const handleAnchorSelect = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <div className="glossary-v3">
      <button
        type="button"
        className="glossary-v3__sections-toggle"
        onClick={() => setDrawerOpen((prev) => !prev)}
        aria-expanded={drawerOpen}
        aria-controls="glossary-v3-drawer"
      >
        Sections
      </button>

      <div className="glossary-v3__layout">
        <GlossaryAnchors
          sections={sections}
          activeSection={activeSection}
          onSelect={handleAnchorSelect}
          anchorRef={anchorsRef}
          drawerOpen={drawerOpen}
          onCloseDrawer={() => setDrawerOpen(false)}
        />

        <div className="glossary-v3__content">
          <section id="definition" className="glossary-v3__definition scroll-mt-28 md:scroll-mt-32">
            <header className="flex flex-col gap-3 pb-6 md:pb-8 border-b border-white/10 dark:border-slate-800/60 mb-6">
              {lastUpdate && lastUpdate !== '—' && (
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500">
                  Last Update <span className="normal-case tracking-normal font-medium text-slate-600 dark:text-slate-300 ml-2">{lastUpdate}</span>
                </div>
              )}
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 dark:text-slate-500">
                Definition
              </p>
            </header>
            <div
              className="prose prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: definitionHtml ?? `<p>${escapeHtml(definition)}</p>` }}
            />
          </section>

          {hasWhy && (
            <section id="why" className="glossary-v3__section scroll-mt-28 md:scroll-mt-32" aria-labelledby="why-heading">
              <h3 id="why-heading">Why it matters</h3>
              <p>{whyItMatters}</p>
            </section>
          )}

          <GlossaryRelated items={related} />
          <GlossarySources sources={sources} />
        </div>
      </div>

      <span className="glossary-v3__sr" aria-live="polite">
        Current section: {activeSection}
      </span>
    </div>
  );
};

export default GlossaryTermPage;

