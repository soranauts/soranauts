/**
 * UX Experiments Module
 * 
 * Dev-only toggles for A/B testing Quick-View and UI variations.
 * Disabled in production. Results stored in localStorage.
 * 
 * Usage:
 *   import { experiments, trackExperimentEvent } from '~/lib/flags/experiments';
 *   
 *   if (experiments.quickViewAnimation === 'fade') {
 *     // Use fade animation
 *   }
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ExperimentConfig {
  /** Quick-View open animation: 'slide' (default) or 'fade' */
  quickViewAnimation: 'slide' | 'fade';
  
  /** Tagline emphasis: 'normal' (default) or 'strong' */
  taglineEmphasis: 'normal' | 'strong';
  
  /** Related terms count: 3 (default) or 6 */
  relatedCount: 3 | 6;
  
  /** Show experiment badge in dev */
  showBadge: boolean;
}

export interface ExperimentEvent {
  experiment: keyof ExperimentConfig;
  variant: string;
  action: 'view' | 'click' | 'dwell';
  value?: number;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'soranauts_experiments';
const EVENTS_KEY = 'soranauts_experiment_events';
const MAX_EVENTS = 100;

const DEFAULT_CONFIG: ExperimentConfig = {
  quickViewAnimation: 'slide',
  taglineEmphasis: 'normal',
  relatedCount: 3,
  showBadge: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Environment Check
// ─────────────────────────────────────────────────────────────────────────────

function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for dev mode indicators
  const isDev = import.meta.env?.DEV === true;
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1');
  
  return isDev || isLocalhost;
}

// ─────────────────────────────────────────────────────────────────────────────
// Storage
// ─────────────────────────────────────────────────────────────────────────────

function loadConfig(): ExperimentConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  if (!isDevMode()) return DEFAULT_CONFIG;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  
  return DEFAULT_CONFIG;
}

function saveConfig(config: ExperimentConfig): void {
  if (typeof window === 'undefined') return;
  if (!isDevMode()) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage errors
  }
}

function loadEvents(): ExperimentEvent[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  
  return [];
}

function saveEvents(events: ExperimentEvent[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Keep only last N events
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore storage errors
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Experiment API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Current experiment configuration.
 * Returns defaults in production; configurable in dev.
 */
export const experiments: ExperimentConfig = loadConfig();

/**
 * Update experiment configuration (dev only).
 */
export function setExperiment<K extends keyof ExperimentConfig>(
  key: K,
  value: ExperimentConfig[K]
): void {
  if (!isDevMode()) {
    console.warn('[Experiments] Cannot modify experiments in production');
    return;
  }
  
  (experiments as any)[key] = value;
  saveConfig(experiments);
  
  console.log(`[Experiments] Set ${key} = ${value}`);
}

/**
 * Reset all experiments to defaults.
 */
export function resetExperiments(): void {
  if (!isDevMode()) return;
  
  Object.assign(experiments, DEFAULT_CONFIG);
  saveConfig(experiments);
  
  console.log('[Experiments] Reset to defaults');
}

/**
 * Track an experiment event.
 */
export function trackExperimentEvent(
  experiment: keyof ExperimentConfig,
  action: 'view' | 'click' | 'dwell',
  value?: number
): void {
  if (!isDevMode()) return;
  
  const event: ExperimentEvent = {
    experiment,
    variant: String(experiments[experiment]),
    action,
    value,
    timestamp: Date.now(),
  };
  
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
  
  if (experiments.showBadge) {
    console.log(`[Experiments] ${experiment}:${event.variant} → ${action}`, value);
  }
}

/**
 * Get experiment results summary.
 */
export function getExperimentResults(): Record<string, { views: number; clicks: number; avgDwell: number }> {
  const events = loadEvents();
  const results: Record<string, { views: number; clicks: number; dwells: number[]; avgDwell: number }> = {};
  
  for (const event of events) {
    const key = `${event.experiment}:${event.variant}`;
    
    if (!results[key]) {
      results[key] = { views: 0, clicks: 0, dwells: [], avgDwell: 0 };
    }
    
    if (event.action === 'view') results[key].views++;
    if (event.action === 'click') results[key].clicks++;
    if (event.action === 'dwell' && event.value) {
      results[key].dwells.push(event.value);
    }
  }
  
  // Calculate averages
  for (const key of Object.keys(results)) {
    const { dwells } = results[key];
    if (dwells.length > 0) {
      results[key].avgDwell = Math.round(dwells.reduce((a, b) => a + b, 0) / dwells.length);
    }
  }
  
  return results;
}

/**
 * Clear experiment events.
 */
export function clearExperimentEvents(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(EVENTS_KEY);
  } catch {
    // Ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Console API (dev only)
// ─────────────────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined' && isDevMode()) {
  (window as any).__experiments = {
    config: experiments,
    set: setExperiment,
    reset: resetExperiments,
    track: trackExperimentEvent,
    results: getExperimentResults,
    clear: clearExperimentEvents,
  };
  
  console.log('[Experiments] Dev mode enabled. Access via window.__experiments');
}


