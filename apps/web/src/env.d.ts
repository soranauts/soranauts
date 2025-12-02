// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="astro-icon" />
/// <reference path="./types/astrolib-seo.d.ts" />

interface ImportMetaEnv {
  readonly GLOSSARY_SEARCH_V2?: string;
  readonly TAG_HUB_V1?: string;
  readonly NAV_LOGO_LAYERED?: string;
  readonly FEATURE_GLOSSARY_V2025?: string;
  readonly FEATURE_GLOSSARY_UI_CANONICAL?: string;
  readonly FEATURE_GLOSSARY_ALIAS_REDIRECT?: string;
  readonly FEATURE_GLOSSARY_V3_UI?: string;
  readonly FEATURE_GLOSSARY_QUICKVIEW?: string;
  readonly FEATURE_GLOSSARY_RELATED_ARTICLES?: string;
  readonly FEATURE_EXPLORER_V3?: string;
  readonly FEATURE_EXPLORER_GLOSSARY_CONTEXT?: string;
  readonly GLOSSARY_CARD_SHOW_UPDATED?: string;
  readonly SITE_ORIGIN?: string;
  readonly VERCEL_TOKEN?: string;
  readonly VERCEL_TEAM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
