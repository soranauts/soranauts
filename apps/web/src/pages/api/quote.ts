import type { APIRoute } from 'astro';
import { z } from 'zod';
import { env } from '../../server/env';
import { quoteRateLimit } from '../../server/rate-limit';

const quoteSchema = z.object({
  a: z.string().min(1),
  b: z.string().min(1),
  amount: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid amount format'),
});

export const GET: APIRoute = async ({ request, url }) => {
  try {
    if (import.meta.env.PRERENDER) {
      return new Response(
        JSON.stringify({ error: 'Quote API is available at runtime only.' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Check rate limit
    const rateLimitResult = quoteRateLimit(request);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // Check for required parameters first
    const a = url.searchParams.get('a');
    const b = url.searchParams.get('b');
    const amount = url.searchParams.get('amount');
    
    if (!a || !b || !amount) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: a, b, amount' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate query parameters
    const searchParams = url.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const validatedQuery = quoteSchema.parse(query);

    // Call DEX API
    const dexUrl = new URL('/quote', env.DEX_API_URL);
    dexUrl.searchParams.set('a', validatedQuery.a);
    dexUrl.searchParams.set('b', validatedQuery.b);
    dexUrl.searchParams.set('amount', validatedQuery.amount);

    const response = await fetch(dexUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`DEX API error: ${response.status}`);
    }

    const quoteData = await response.json();

    return new Response(JSON.stringify(quoteData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      },
    });
  } catch (error) {
    console.error('Quote API error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get quote',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
