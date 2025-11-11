const resolveFlag = () => {
  const inlineValue = import.meta.env?.TAG_HUB_V1;
  if (inlineValue !== undefined) {
    return inlineValue;
  }

  if (typeof process !== 'undefined') {
    const runtimeValue = process.env?.TAG_HUB_V1;
    if (runtimeValue !== undefined) {
      return runtimeValue;
    }
  }

  return undefined;
};

const rawFlag = resolveFlag();
if (typeof console !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[featureFlags] TAG_HUB_V1 raw flag:', rawFlag);
}
export const TAG_HUB_V1 = String(rawFlag ?? 'false') === 'true';
if (typeof console !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[featureFlags] TAG_HUB_V1 enabled:', TAG_HUB_V1);
}
export const TAG_HUB_V1_ENABLED = TAG_HUB_V1;

export const isTagHubEnabled = (): boolean => TAG_HUB_V1;



