import { describe, it, expect, beforeEach } from 'vitest';
import { __resetRateLimitStoreForTests, createRateLimit, quoteRateLimit } from '../rate-limit';

describe('Rate Limiter', () => {
  beforeEach(() => {
    __resetRateLimitStoreForTests();
  });

  describe('createRateLimit', () => {
    it('should allow requests within the limit', () => {
      const rateLimit = createRateLimit({
        windowMs: 60000, // 1 minute
        maxRequests: 5,
        keyGenerator: () => 'test-key'
      });

      const request = new Request('https://example.com');
      
      // First 5 requests should be allowed
      for (let i = 0; i < 5; i++) {
        const result = rateLimit(request);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4 - i);
      }
    });

    it('should block requests after limit is exceeded', () => {
      const rateLimit = createRateLimit({
        windowMs: 60000, // 1 minute
        maxRequests: 3,
        keyGenerator: () => 'test-key'
      });

      const request = new Request('https://example.com');
      
      // First 3 requests should be allowed
      for (let i = 0; i < 3; i++) {
        const result = rateLimit(request);
        expect(result.allowed).toBe(true);
      }
      
      // 4th request should be blocked
      const result = rateLimit(request);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', async () => {
      const rateLimit = createRateLimit({
        windowMs: 100, // 100ms window
        maxRequests: 2,
        keyGenerator: () => 'test-key'
      });

      const request = new Request('https://example.com');
      
      // Use up the limit
      rateLimit(request);
      rateLimit(request);
      
      // Should be blocked
      let result = rateLimit(request);
      expect(result.allowed).toBe(false);
      
      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be allowed again
      result = rateLimit(request);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(1);
    });

    it('should use different keys for different clients', () => {
      const rateLimit = createRateLimit({
        windowMs: 60000,
        maxRequests: 2,
        keyGenerator: (request) => {
          const url = new URL(request.url);
          return url.searchParams.get('client') || 'default';
        }
      });

      const request1 = new Request('https://example.com?client=user1');
      const request2 = new Request('https://example.com?client=user2');
      
      // Both clients should be able to make requests independently
      const result1 = rateLimit(request1);
      const result2 = rateLimit(request2);
      
      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
      expect(result1.remaining).toBe(1);
      expect(result2.remaining).toBe(1);
    });
  });

  describe('quoteRateLimit', () => {
    it('should have correct default configuration', () => {
      const request = new Request('https://example.com/api/quote');
      
      // Should allow up to 30 requests per minute
      const result = quoteRateLimit(request, { clientAddress: '203.0.113.1' });
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });

    it('should rate limit per clientAddress', () => {
      const request = new Request('https://example.com/api/quote', {
        headers: {
          'x-forwarded-for': '203.0.113.195', // ignored by default in unit tests
        }
      });
      
      // First 30 requests should be allowed.
      for (let i = 0; i < 30; i++) {
        const result = quoteRateLimit(request, { clientAddress: '203.0.113.2' });
        expect(result.allowed).toBe(true);
      }

      // 31st request should be blocked.
      const blocked = quoteRateLimit(request, { clientAddress: '203.0.113.2' });
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
    });

    it('should ignore forwarded headers by default', () => {
      // Unless TRUST_PROXY_HEADERS is enabled, x-forwarded-for should not affect keying.
      const requestWithForwarded = new Request('https://example.com/api/quote', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      });
      const requestWithoutForwarded = new Request('https://example.com/api/quote');

      // Both should map to the same key ("quote:unknown") when clientAddress is not supplied.
      const first = quoteRateLimit(requestWithForwarded);
      expect(first.allowed).toBe(true);
      expect(first.remaining).toBe(29);
      
      const second = quoteRateLimit(requestWithoutForwarded);
      expect(second.allowed).toBe(true);
      expect(second.remaining).toBe(28);
    });
  });
});

