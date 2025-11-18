import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { env } from '../env';

const STATE_DIR = join(env.KB_DIR, 'scripts', '.state');

export interface MediumState {
  lastProcessed: Record<string, {
    guid: string;
    pubDate: string;
    processedAt: string;
  }>;
}

export interface SoramitsuState {
  urls: Record<string, {
    etag?: string;
    lastModified?: string;
    sha256?: string;
    disallowed?: boolean;
    fetchedAt: string;
  }>;
  robotsSnapshot?: Record<string, {
    url: string;
    sha256: string;
    fetchedAt: string;
  }>;
}

/**
 * Load state file, creating directory if needed
 */
export function loadState<T>(filename: string, defaultValue: T): T {
  const filepath = join(STATE_DIR, filename);
  
  if (!existsSync(filepath)) {
    return defaultValue;
  }
  
  try {
    const content = readFileSync(filepath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.warn(`Failed to load state file ${filename}, using default:`, error);
    return defaultValue;
  }
}

/**
 * Save state file
 */
export function saveState<T>(filename: string, state: T): void {
  const filepath = join(STATE_DIR, filename);
  
  // Ensure directory exists
  mkdirSync(dirname(filepath), { recursive: true });
  
  writeFileSync(filepath, JSON.stringify(state, null, 2) + '\n', 'utf-8');
}

/**
 * Load medium state
 */
export function loadMediumState(): MediumState {
  return loadState<MediumState>('.medium_state.json', { lastProcessed: {} });
}

/**
 * Save medium state
 */
export function saveMediumState(state: MediumState): void {
  saveState('.medium_state.json', state);
}

/**
 * Load soramitsu state
 */
export function loadSoramitsuState(): SoramitsuState {
  return loadState<SoramitsuState>('.soramitsu_state.json', { urls: {} });
}

/**
 * Save soramitsu state
 */
export function saveSoramitsuState(state: SoramitsuState): void {
  saveState('.soramitsu_state.json', state);
}


















