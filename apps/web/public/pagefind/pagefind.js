const warn = () => {
  if (typeof console !== 'undefined') {
    console.warn(
      'Pagefind is only available in production builds. Run "pnpm build && pnpm preview" to test search functionality.'
    );
  }
};

export async function init() {
  warn();
}

export async function options() {
  warn();
}

export async function mergeIndex() {
  warn();
}

export async function search() {
  warn();
  return {
    results: [],
    unfilteredResultCount: 0,
    filters: {},
    totalFilters: {},
    timings: {
      preload: 0,
      search: 0,
      total: 0
    }
  };
}

export async function debouncedSearch(term, options, debounceTimeoutMs) {
  warn();
  return search(term, options, debounceTimeoutMs);
}

export async function preload() {
  warn();
}

export async function filters() {
  warn();
  return {};
}

export async function destroy() {
  warn();
}

export default {
  init,
  options,
  mergeIndex,
  search,
  debouncedSearch,
  preload,
  filters,
  destroy
};


