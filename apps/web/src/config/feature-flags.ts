type FlagName = 'FEATURE_GLOSSARY_V2025' | 'TAG_HUB_V1';

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

export const FEATURE_GLOSSARY_V2025 = asBoolean(resolveFlag('FEATURE_GLOSSARY_V2025'));
export const TAG_HUB_V1 = asBoolean(resolveFlag('TAG_HUB_V1'));


