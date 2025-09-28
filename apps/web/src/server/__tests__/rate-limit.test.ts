import { describe, it, expect, beforeEach } from 'vitest';
import { createRateLimit, quoteRateLimit } from '../rate-limit';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear the rate limit store before each test
    // Note: In a real test environment, you'd want to mock or reset the store
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
      const result = quoteRateLimit(request);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });

    it('should use IP-based keys', () => {
      // Mock request with IP header
      const request = new Request('https://example.com/api/quote', {
        headers: {
          'x-forwarded-for': '192.168.1.1'
        }
      });
      
      const result = quoteRateLimit(request);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });

    it('should handle multiple IP addresses in x-forwarded-for', () => {
      const request = new Request('https://example.com/api/quote', {
        headers: {
          'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178'
        }
      });
      
      const result = quoteRateLimit(request);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });

    it('should fallback to development key when no IP headers', () => {
      const request = new Request('https://example.com/api/quote');
      
      const result = quoteRateLimit(request);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });
  });
});


