const normalizeSlug = (value?: string | null): string =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

interface AliasRedirectParams {
  featureGlossaryV2025: boolean;
  featureGlossaryAliasRedirect: boolean;
  requestedSlug?: string;
  resolvedSlug?: string;
}

export const shouldApplyAliasRedirect = ({
  featureGlossaryV2025,
  featureGlossaryAliasRedirect,
  requestedSlug,
  resolvedSlug,
}: AliasRedirectParams): boolean => {
  if (!featureGlossaryV2025 || !featureGlossaryAliasRedirect) {
    return false;
  }

  const requested = normalizeSlug(requestedSlug);
  const resolved = normalizeSlug(resolvedSlug);

  if (!requested || !resolved) {
    return false;
  }

  return requested !== resolved;
};



