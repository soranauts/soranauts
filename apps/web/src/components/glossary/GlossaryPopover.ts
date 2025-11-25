export function mountGlossaryPopover() {
  const pop = document.getElementById('g-pop');
  if (!pop) return;

  const globalWindow = window as typeof window & { __GLOSSARY_POP_MOUNTED__?: boolean };
  if (globalWindow.__GLOSSARY_POP_MOUNTED__) {
    return;
  }

  globalWindow.__GLOSSARY_POP_MOUNTED__ = true;

  const card = pop.querySelector('.g-pop__card') as HTMLElement | null;
  const title = pop.querySelector('.g-pop__title') as HTMLElement | null;
  const body = pop.querySelector('.g-pop__body') as HTMLElement | null;
  const cta = pop.querySelector('.g-pop__cta') as HTMLAnchorElement | null;
  const closeBtn = pop.querySelector('.g-pop__close') as HTMLButtonElement | null;
  const backdrop = pop.querySelector('.g-pop__backdrop') as HTMLElement | null;

  if (!card || !title || !body || !cta || !closeBtn || !backdrop) {
    return;
  }

  let currentAnchor: HTMLAnchorElement | null = null;

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest?.('a.glossary') as HTMLAnchorElement | null;

    if (!anchor) {
      if (pop.getAttribute('aria-hidden') === 'false' && !card.contains(event.target as Node)) {
        hide();
      }
      return;
    }

    event.preventDefault();
    show(anchor);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && pop.getAttribute('aria-hidden') === 'false') {
      hide();
    }
  });

  function show(anchor: HTMLAnchorElement) {
    currentAnchor = anchor;

    const titleText = (anchor.dataset.title || anchor.textContent || '').trim();
    const def = ((anchor.dataset.def || '').trim()).slice(0, 240);
    const canonicalSlug = anchor.dataset.canonicalSlug || anchor.dataset.slug || '';

    title.textContent = titleText;
    body.textContent = def || 'Tap “Open full entry” to learn more.';

    const href = anchor.getAttribute('href') || (canonicalSlug ? `/glossary/${canonicalSlug}` : '#');
    cta.href = href;
    cta.setAttribute('aria-label', `Open full glossary entry for ${titleText || 'this term'}`);

    const rect = anchor.getBoundingClientRect();
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const top = rect.top - 8;

    card.style.left = `${rect.left + rect.width / 2}px`;
    card.style.top = `${top}px`;

    pop.classList.toggle('g-pop--sheet', top < 160 || viewportWidth < 640);
    pop.setAttribute('aria-hidden', 'false');

    closeBtn.focus({ preventScroll: true });
  }

  function hide() {
    pop.setAttribute('aria-hidden', 'true');

    if (currentAnchor) {
      currentAnchor.focus({ preventScroll: true });
    }

    currentAnchor = null;
  }

  closeBtn.addEventListener('click', hide);
  backdrop.addEventListener('click', hide);
}

