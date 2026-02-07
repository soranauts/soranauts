import { env } from './env';

// In-memory rate limiting is best-effort only. In production, prefer a distributed
// limiter (Redis/KV/Durable Objects) to avoid bypass in multi-instance deployments.

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastSeen: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const MAX_KEYS = 5_000;
const CLEANUP_INTERVAL_MS = 10_000;
let lastCleanup = 0;

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (request: Request, info: { clientAddress?: string | null }) => string;
}

export function createRateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, keyGenerator } = options;

  return (
    request?: Request | null,
    info: { clientAddress?: string | null } = {},
  ): { allowed: boolean; remaining: number; resetTime: number } => {
    if (!request) {
      const now = Date.now();
      return {
        allowed: true,
        remaining: maxRequests,
        resetTime: now + windowMs,
      };
    }

    const now = Date.now();

    // Periodic cleanup + bounded memory to reduce header-spoof key exhaustion.
    if (now - lastCleanup >= CLEANUP_INTERVAL_MS) {
      lastCleanup = now;
      for (const [k, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
          rateLimitStore.delete(k);
        }
      }
      while (rateLimitStore.size > MAX_KEYS) {
        const oldestKey = rateLimitStore.keys().next().value;
        if (!oldestKey) break;
        rateLimitStore.delete(oldestKey);
      }
    }

    const key = keyGenerator ? keyGenerator(request, info) : 'default';
    
    const entry = rateLimitStore.get(key);
    
    if (!entry) {
      // First request
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
        lastSeen: now,
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }
    
    if (now > entry.resetTime) {
      // Window expired, reset
      const next: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs,
        lastSeen: now,
      };
      rateLimitStore.delete(key);
      rateLimitStore.set(key, next);
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }
    
    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      entry.lastSeen = now;
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }
    
    // Increment count
    entry.count++;
    entry.lastSeen = now;
    // Touch to make eviction roughly LRU (Map iteration order is insertion order).
    rateLimitStore.delete(key);
    rateLimitStore.set(key, entry);
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  };
}

// Helper function to get client IP address
function getClientIP(request?: Request | null, clientAddress?: string | null): string {
  if (clientAddress) return clientAddress;
  if (!request) return 'prerender';

  let headers: Headers;
  try {
    headers = request.headers;
  } catch {
    return 'prerender';
  }

  if (!headers || typeof headers.get !== 'function') {
    return 'prerender';
  }

  if (!env.TRUST_PROXY_HEADERS) {
    // Do not trust spoofable forwarded headers unless explicitly enabled.
    return 'unknown';
  }

  // Check for Cloudflare IP
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  // Check for real IP header (common with some proxies)
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Check for forwarded-for as a fallback. If a client supplies this header,
  // proxies typically append the real IP to the end; prefer the last value.
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    return parts[parts.length - 1] ?? 'unknown';
  }

  // Fallback to a default key (for development)
  return 'unknown';
}

// Default rate limiter for quote API
export const quoteRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  keyGenerator: (request: Request, info) => {
    const ip = getClientIP(request, info.clientAddress);
    return `quote:${ip}`;
  },
});

// Test helper (kept explicit to avoid accidental production use).
export function __resetRateLimitStoreForTests(): void {
  rateLimitStore.clear();
  lastCleanup = 0;
}
