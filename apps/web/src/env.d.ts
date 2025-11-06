// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GLOSSARY_SEARCH_V2?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
