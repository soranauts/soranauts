declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server';

  const Component: AstroComponentFactory;
  export default Component;
}

declare module '@astrolib/seo/src/AstroSeo.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server';

  const AstroSeo: AstroComponentFactory;
  export default AstroSeo;
}

declare module '@astrolib/seo' {
  import type { AstroComponentFactory } from 'astro/runtime/server';

  export type OpenGraph = {
    images?: Array<{
      url?: string;
      width?: number;
      height?: number;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
  export interface Props {
    title?: string;
    titleTemplate?: string;
    canonical?: string;
    description?: string;
    noindex?: boolean;
    nofollow?: boolean;
    openGraph?: any;
    twitter?: any;
    [key: string]: any;
  }

  const AstroSeo: AstroComponentFactory;
  export default AstroSeo;
  export { AstroSeo, OpenGraph, Props };
}
