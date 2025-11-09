// Simple in-memory rate limiter for development
// In production, use Redis or similar for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (request: Request) => string;
}

export function createRateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, keyGenerator } = options;

  return (request: Request): { allowed: boolean; remaining: number; resetTime: number } => {
    const key = keyGenerator ? keyGenerator(request) : 'default';
    const now = Date.now();
    
    // Clean up expired entries
    for (const [k, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(k);
      }
    }
    
    const entry = rateLimitStore.get(key);
    
    if (!entry) {
      // First request
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      };
    }
    
    if (now > entry.resetTime) {
      // Window expired, reset
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      };
    }
    
    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }
    
    // Increment count
    entry.count++;
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  };
}

// Helper function to get client IP address
function getClientIP(request: Request): string {
  if (!request || typeof request.headers?.get !== 'function') {
    return 'prerender';
  }

  const headers = request.headers;
  
  // Check for forwarded headers first (common in production)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP if there are multiple
    return forwardedFor.split(',')[0].trim();
  }
  
  // Check for real IP header
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  // Check for Cloudflare IP
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  // Fallback to a default key (for development)
  return 'development';
}

// Default rate limiter for quote API
export const quoteRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  keyGenerator: (request: Request) => {
    const ip = getClientIP(request);
    return `quote:${ip}`;
  }
});
