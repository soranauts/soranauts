const PLACEHOLDER_VALUES = new Set(['todo']);

const MAX_SUMMARY_LENGTH = 160;

const stripHtml = (value: string): string => value.replace(/<[^>]+>/g, ' ');

const collapseWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const trimTrailingPunctuation = (value: string): string => value.replace(/[,:;]+$/g, '').trim();

export const needsSummary = (value?: string | null): boolean => {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  if (!normalized.length) return true;
  return PLACEHOLDER_VALUES.has(normalized);
};

export const synthesizeSummaryFromDefinition = (
  definition?: string | null,
  maxLength = MAX_SUMMARY_LENGTH,
): string | null => {
  if (!definition) return null;
  let cleaned = collapseWhitespace(stripHtml(definition));
  if (!cleaned) return null;

  const sentenceMatch = cleaned.match(/[^.!?]+[.!?]/);
  let candidate = sentenceMatch ? sentenceMatch[0] : cleaned;
  candidate = trimTrailingPunctuation(candidate);

  if (candidate.length > maxLength) {
    let truncated = candidate.slice(0, maxLength).trim();
    truncated = truncated.replace(/\s+\S*$/, '').trim();
    truncated = trimTrailingPunctuation(truncated);
    if (!truncated) return null;
    candidate = `${truncated}…`;
  }

  return candidate || null;
};

