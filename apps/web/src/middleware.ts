import { defineMiddleware } from 'astro:middleware';

import { FEATURE_GLOSSARY_ALIAS_REDIRECT, FEATURE_GLOSSARY_V2025 } from './config/feature-flags';
import glossaryAliasesV2025 from '../public/glossary.aliases.v2025.json';

const aliasMap = new Map<string, string>();

glossaryAliasesV2025.aliases?.forEach(({ alias, target }) => {
  const normalizedAlias = alias?.trim().toLowerCase();
  const normalizedTarget = target?.trim().toLowerCase();
  if (!normalizedAlias || !normalizedTarget) return;
  aliasMap.set(normalizedAlias, normalizedTarget);
});

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  if (!FEATURE_GLOSSARY_V2025 || !FEATURE_GLOSSARY_ALIAS_REDIRECT || aliasMap.size === 0) {
    return next();
  }

  const url = new URL(request.url);
  if (!url.pathname.startsWith('/glossary/')) {
    return next();
  }

  const slug = url.pathname.replace(/^\/glossary\//, '').replace(/\/+$/, '').toLowerCase();
  if (!slug) {
    return next();
  }

  const targetSlug = aliasMap.get(slug);
  if (!targetSlug || targetSlug === slug) {
    return next();
  }

  url.pathname = `/glossary/${targetSlug}`;
  return redirect(`${url.pathname}${url.search}${url.hash}`, 308);
});

