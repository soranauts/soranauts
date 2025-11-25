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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
