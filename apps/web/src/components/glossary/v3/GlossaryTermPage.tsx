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
}

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
            <h1>{title}</h1>
            {summary && <p className="glossary-v3__summary">{summary}</p>}
            <p>{definition}</p>
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

