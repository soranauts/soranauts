/**
 * Insights Module (Privacy-Safe Analytics)
 * 
 * Lightweight in-house analytics for Quick-View usage and Explorer journeys.
 * - No PII collection
 * - localStorage for aggregated counts
 * - Batched summaries (optional API)
 * - Disabled in production if no API key
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface QuickViewEvent {
  slug: string;
  timestamp: number;
  duration?: number;
}

interface InsightsData {
  quickViewOpens: Record<string, number>;
  quickViewDurations: Record<string, number[]>;
  journeyCompletions: Record<string, number>;
  lastUpdated: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Storage
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'soranauts_insights';
const MAX_DURATION_SAMPLES = 10;

function getInsightsData(): InsightsData {
  if (typeof window === 'undefined') {
    return createEmptyData();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as InsightsData;
    }
  } catch {
    // Ignore parse errors
  }
  
  return createEmptyData();
}

function saveInsightsData(data: InsightsData): void {
  if (typeof window === 'undefined') return;
  
  try {
    data.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors (quota, private mode)
  }
}

function createEmptyData(): InsightsData {
  return {
    quickViewOpens: {},
    quickViewDurations: {},
    journeyCompletions: {},
    lastUpdated: Date.now(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Session State
// ─────────────────────────────────────────────────────────────────────────────

let currentQuickViewEvent: QuickViewEvent | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// Tracking Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Track Quick-View panel open.
 */
export function trackQuickViewOpen(slug: string): void {
  if (typeof window === 'undefined') return;
  
  // Close previous event if any
  if (currentQuickViewEvent) {
    trackQuickViewClose(currentQuickViewEvent.slug);
  }
  
  currentQuickViewEvent = {
    slug,
    timestamp: Date.now(),
  };
  
  const data = getInsightsData();
  data.quickViewOpens[slug] = (data.quickViewOpens[slug] ?? 0) + 1;
  saveInsightsData(data);
  
  if (import.meta.env.DEV) {
    console.log(`[Insights] Quick-View opened: ${slug}`);
  }
}

/**
 * Track Quick-View panel close.
 */
export function trackQuickViewClose(slug: string): void {
  if (typeof window === 'undefined') return;
  
  if (currentQuickViewEvent && currentQuickViewEvent.slug === slug) {
    const duration = Date.now() - currentQuickViewEvent.timestamp;
    
    const data = getInsightsData();
    if (!data.quickViewDurations[slug]) {
      data.quickViewDurations[slug] = [];
    }
    
    // Keep only last N samples
    data.quickViewDurations[slug].push(duration);
    if (data.quickViewDurations[slug].length > MAX_DURATION_SAMPLES) {
      data.quickViewDurations[slug].shift();
    }
    
    saveInsightsData(data);
    
    if (import.meta.env.DEV) {
      console.log(`[Insights] Quick-View closed: ${slug} (${duration}ms)`);
    }
    
    currentQuickViewEvent = null;
  }
}

/**
 * Track Explorer journey completion.
 */
export function trackJourneyCompletion(journeyId: string): void {
  if (typeof window === 'undefined') return;
  
  const data = getInsightsData();
  data.journeyCompletions[journeyId] = (data.journeyCompletions[journeyId] ?? 0) + 1;
  saveInsightsData(data);
  
  if (import.meta.env.DEV) {
    console.log(`[Insights] Journey completed: ${journeyId}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reporting Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get top viewed terms.
 */
export function getTopTerms(limit = 10): Array<{ slug: string; count: number }> {
  const data = getInsightsData();
  
  return Object.entries(data.quickViewOpens)
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get average time spent on Quick-View by term.
 */
export function getAverageDurations(): Record<string, number> {
  const data = getInsightsData();
  const averages: Record<string, number> = {};
  
  for (const [slug, durations] of Object.entries(data.quickViewDurations)) {
    if (durations.length > 0) {
      const sum = durations.reduce((a, b) => a + b, 0);
      averages[slug] = Math.round(sum / durations.length);
    }
  }
  
  return averages;
}

/**
 * Get journey completion stats.
 */
export function getJourneyStats(): Array<{ journeyId: string; completions: number }> {
  const data = getInsightsData();
  
  return Object.entries(data.journeyCompletions)
    .map(([journeyId, completions]) => ({ journeyId, completions }))
    .sort((a, b) => b.completions - a.completions);
}

/**
 * Get full insights summary.
 */
export function getInsightsSummary() {
  const data = getInsightsData();
  
  return {
    totalQuickViewOpens: Object.values(data.quickViewOpens).reduce((a, b) => a + b, 0),
    uniqueTermsViewed: Object.keys(data.quickViewOpens).length,
    topTerms: getTopTerms(10),
    averageDurations: getAverageDurations(),
    journeyStats: getJourneyStats(),
    lastUpdated: data.lastUpdated,
  };
}

/**
 * Clear all insights data.
 */
export function clearInsights(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Batched Reporting (optional API)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send batched insights to API (if available).
 * Called periodically or on page unload.
 */
export async function flushInsights(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // Only flush if API endpoint is configured
  const apiEndpoint = import.meta.env.PUBLIC_INSIGHTS_API;
  if (!apiEndpoint) {
    if (import.meta.env.DEV) {
      console.log('[Insights] No API endpoint configured, skipping flush');
    }
    return;
  }
  
  const summary = getInsightsSummary();
  
  try {
    await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(summary),
      keepalive: true, // Allow sending on page unload
    });
    
    if (import.meta.env.DEV) {
      console.log('[Insights] Flushed to API');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Insights] Failed to flush:', error);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-flush on page unload
// ─────────────────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushInsights();
    }
  });
}


