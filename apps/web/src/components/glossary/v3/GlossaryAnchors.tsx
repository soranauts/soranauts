import React, { type RefObject } from 'react';

import type { GlossaryV3Section } from './types';

interface GlossaryAnchorsProps {
  sections: GlossaryV3Section[];
  activeSection: string;
  onSelect: (id: string) => void;
  anchorRef: RefObject<HTMLDivElement>;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}

const GlossaryAnchors = ({
  sections,
  activeSection,
  onSelect,
  anchorRef,
  drawerOpen,
  onCloseDrawer,
}: GlossaryAnchorsProps) => {
  const renderList = () => (
    <ul className="glossary-v3__anchor-list">
      {sections.map((section) => (
        <li key={section.id}>
          <button
            type="button"
            className={[
              'glossary-v3__anchor-button',
              activeSection === section.id ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              onSelect(section.id);
              onCloseDrawer();
            }}
          >
            {section.label}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <React.Fragment>
      <div
        className="glossary-v3__anchors"
        ref={anchorRef}
        tabIndex={-1}
        aria-label="Glossary sections"
      >
        <h2>Sections</h2>
        {renderList()}
      </div>

      <div
        className={[
          'glossary-v3__anchors-drawer',
          drawerOpen ? 'is-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        id="glossary-v3-drawer"
        aria-label="Glossary sections (mobile)"
      >
        {renderList()}
      </div>
    </React.Fragment>
  );
};

export default GlossaryAnchors;

