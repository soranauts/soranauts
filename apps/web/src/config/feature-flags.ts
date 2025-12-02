/**
 * Feature Flags Configuration
 * 
 * Production defaults are set to 'true' for stable features.
 * Override via environment variables when needed.
 */

type FlagName =
  | 'FEATURE_GLOSSARY_V2025'
  | 'FEATURE_GLOSSARY_UI_CANONICAL'
  | 'FEATURE_GLOSSARY_ALIAS_REDIRECT'
  | 'FEATURE_GLOSSARY_V3_UI'
  | 'FEATURE_GLOSSARY_QUICKVIEW'
  | 'FEATURE_GLOSSARY_RELATED_ARTICLES'
  | 'FEATURE_EXPLORER_V3'
  | 'FEATURE_EXPLORER_GLOSSARY_CONTEXT'
  | 'TAG_HUB_V1'
  | 'GLOSSARY_CARD_SHOW_UPDATED';

const resolveFlag = (name: FlagName): string | undefined => {
  const inlineValue = import.meta.env?.[name as keyof ImportMetaEnv] as string | undefined;
  if (inlineValue !== undefined) return inlineValue;
  if (typeof process !== 'undefined') {
    return process.env?.[name];
  }
  return undefined;
};

const asBoolean = (value: string | undefined, fallback = 'false'): boolean =>
  String(value ?? fallback).toLowerCase() === 'true';

// ─────────────────────────────────────────────────────────────────────────────
// Production Flags (default: true)
// ─────────────────────────────────────────────────────────────────────────────

/** Use the 2025 glossary dataset */
export const FEATURE_GLOSSARY_V2025 = asBoolean(resolveFlag('FEATURE_GLOSSARY_V2025'), 'true');

/** Glossary V3 UI: React-based term pages with sections, anchors, keyboard nav */
export const FEATURE_GLOSSARY_V3_UI = asBoolean(resolveFlag('FEATURE_GLOSSARY_V3_UI'), 'true');

/** Quick-View panel: Right-panel overlay for term previews */
export const FEATURE_GLOSSARY_QUICKVIEW = asBoolean(resolveFlag('FEATURE_GLOSSARY_QUICKVIEW'), 'true');

/** Explorer V3: Unified Explorer with Nexus section and live stats */
export const FEATURE_EXPLORER_V3 = asBoolean(resolveFlag('FEATURE_EXPLORER_V3'), 'true');

/** Explorer Glossary Context: Related-term chips and article context */
export const FEATURE_EXPLORER_GLOSSARY_CONTEXT = asBoolean(
  resolveFlag('FEATURE_EXPLORER_GLOSSARY_CONTEXT'),
  'true',
);

/** Tag Hub V1: Enable the Explorer/Tag Hub */
export const TAG_HUB_V1 = asBoolean(resolveFlag('TAG_HUB_V1'), 'true');

// ─────────────────────────────────────────────────────────────────────────────
// Optional Flags (default: false)
// ─────────────────────────────────────────────────────────────────────────────

/** Canonical UI rendering mode */
export const FEATURE_GLOSSARY_UI_CANONICAL = asBoolean(resolveFlag('FEATURE_GLOSSARY_UI_CANONICAL'));

/** Alias redirect handling */
export const FEATURE_GLOSSARY_ALIAS_REDIRECT = asBoolean(resolveFlag('FEATURE_GLOSSARY_ALIAS_REDIRECT'));

/** Show related articles on term pages */
export const FEATURE_GLOSSARY_RELATED_ARTICLES = asBoolean(
  resolveFlag('FEATURE_GLOSSARY_RELATED_ARTICLES'),
);

/** Show "Updated" badge on glossary cards */
export const GLOSSARY_CARD_SHOW_UPDATED = asBoolean(resolveFlag('GLOSSARY_CARD_SHOW_UPDATED'));
