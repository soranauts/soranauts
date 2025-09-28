import { test, expect } from '@playwright/test';

test.describe('Quote API', () => {
  test('should return quote data for valid request', async ({ request }) => {
    const response = await request.get('/api/quote?a=XOR&b=KUSD&amount=100');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('out');
    expect(data).toHaveProperty('fee');
    expect(data).toHaveProperty('route');
    
    // Check rate limit headers
    expect(response.headers()['x-ratelimit-limit']).toBe('30');
    expect(response.headers()['x-ratelimit-remaining']).toBeDefined();
    expect(response.headers()['x-ratelimit-reset']).toBeDefined();
    
    // Check cache headers
    expect(response.headers()['cache-control']).toBe('public, s-maxage=10, stale-while-revalidate=30');
  });

  test('should return 400 for invalid parameters', async ({ request }) => {
    const response = await request.get('/api/quote?a=&b=KUSD&amount=100');
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should return 400 for invalid amount format', async ({ request }) => {
    const response = await request.get('/api/quote?a=XOR&b=KUSD&amount=invalid');
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should respect rate limiting', async ({ request }) => {
    // Make multiple requests quickly to test rate limiting
    const requests = [];
    for (let i = 0; i < 35; i++) { // Exceed the 30 request limit
      requests.push(request.get('/api/quote?a=XOR&b=KUSD&amount=100'));
    }
    
    const responses = await Promise.all(requests);
    
    // Count successful vs rate limited responses
    let successCount = 0;
    let rateLimitedCount = 0;
    
    for (const response of responses) {
      if (response.status() === 200) {
        successCount++;
      } else if (response.status() === 429) {
        rateLimitedCount++;
        
        // Check rate limit headers on 429 responses
        expect(response.headers()['retry-after']).toBeDefined();
        expect(response.headers()['x-ratelimit-limit']).toBe('30');
        expect(response.headers()['x-ratelimit-remaining']).toBe('0');
      }
    }
    
    // Should have exactly 30 successful requests and 5 rate limited
    expect(successCount).toBe(30);
    expect(rateLimitedCount).toBe(5);
  });

  test('should include proper error response for rate limiting', async ({ request }) => {
    // Exceed rate limit
    for (let i = 0; i < 31; i++) {
      await request.get('/api/quote?a=XOR&b=KUSD&amount=100');
    }
    
    const response = await request.get('/api/quote?a=XOR&b=KUSD&amount=100');
    
    expect(response.status()).toBe(429);
    
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Rate limit exceeded');
    expect(data).toHaveProperty('retryAfter');
    expect(typeof data.retryAfter).toBe('number');
  });

  test('should handle different IP addresses independently', async ({ browser }) => {
    // Create two different browser contexts to simulate different IPs
    const context1 = await browser.newContext({
      extraHTTPHeaders: {
        'x-forwarded-for': '192.168.1.1'
      }
    });
    const context2 = await browser.newContext({
      extraHTTPHeaders: {
        'x-forwarded-for': '192.168.1.2'
      }
    });
    
    const request1 = context1.request();
    const request2 = context2.request();
    
    // Both should be able to make requests independently
    const response1 = await request1.get('/api/quote?a=XOR&b=KUSD&amount=100');
    const response2 = await request2.get('/api/quote?a=XOR&b=KUSD&amount=100');
    
    expect(response1.status()).toBe(200);
    expect(response2.status()).toBe(200);
    
    await context1.close();
    await context2.close();
  });
});


