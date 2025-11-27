export interface AutoLinkConfig {
  disabled: boolean;
  noLink: string[];
  maxLinksPerPost: number;
  maxLinksPerTerm: number;
}

const DEFAULT_CONFIG: AutoLinkConfig = {
  disabled: false,
  noLink: [],
  maxLinksPerPost: Number.POSITIVE_INFINITY,
  maxLinksPerTerm: 2,
};

const parsePositiveNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }

  if (typeof value === 'string') {
    const numeric = Number.parseInt(value, 10);
    if (Number.isFinite(numeric) && numeric > 0) {
      return Math.floor(numeric);
    }
  }

  return undefined;
};

const toSlugValue = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().toLowerCase();
  return trimmed.length ? trimmed : undefined;
};

export function resolveAutoLinkConfig(frontmatter?: Record<string, unknown> | null): AutoLinkConfig {
  if (!frontmatter) {
    return DEFAULT_CONFIG;
  }

  const disabled = Boolean(frontmatter.disableGlossaryAutoLink);
  const noLinkInput = Array.isArray(frontmatter.glossaryNoLink) ? frontmatter.glossaryNoLink : [];
  const noLink = Array.from(
    new Set(
      noLinkInput
        .map(toSlugValue)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const maxLinksPerPost =
    parsePositiveNumber((frontmatter as any).glossaryMaxLinksPerPost) ??
    DEFAULT_CONFIG.maxLinksPerPost;

  const maxLinksPerTerm =
    parsePositiveNumber((frontmatter as any).glossaryMaxLinksPerTerm) ??
    DEFAULT_CONFIG.maxLinksPerTerm;

  return {
    disabled,
    noLink,
    maxLinksPerPost,
    maxLinksPerTerm,
  };
}

export const AUTO_LINK_DEFAULTS = DEFAULT_CONFIG;

