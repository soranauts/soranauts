type PosthogClient = {
  capture: (eventName: string, eventProperties?: Record<string, unknown>) => void;
};

type GtagFunction = (...args: unknown[]) => void;

export type GlossaryEvent =
  | { name: 'glossary_alias_view'; alias: string; target: string }
  | { name: 'glossary_alias_redirect'; alias: string; target: string }
  | { name: 'search_alias_match'; alias: string; target: string };

export function emit(event: GlossaryEvent): void {
  if (typeof window === 'undefined') return;

  if (window.posthog?.capture) {
    window.posthog.capture(event.name, event);
    return;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', event.name, event);
    return;
  }

  if (import.meta.env.DEV) {
    console.debug('[analytics]', event);
  }
}

