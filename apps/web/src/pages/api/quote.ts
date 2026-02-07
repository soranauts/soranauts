import type { APIRoute } from 'astro';
import { ZodError, z } from 'zod';
import { env } from '../../server/env';
import { quoteRateLimit } from '../../server/rate-limit';

const quoteSchema = z.object({
  a: z.string().min(1),
  b: z.string().min(1),
  amount: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid amount format'),
});

export const GET: APIRoute = async (context) => {
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

    const { request, url } = context;

    // Check rate limit
    const rateLimitResult = quoteRateLimit(request, { clientAddress: context.clientAddress });
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

    const isDev = import.meta.env.DEV;
    const isValidationError = error instanceof ZodError;
    const status = isValidationError ? 400 : 502;
    const payload: Record<string, unknown> = {
      error: isValidationError ? 'Invalid request' : 'Failed to get quote',
    };
    // Do not include error message or stack trace details in the client response.
    // Detailed information is already logged server-side via console.error above.

    return new Response(JSON.stringify(payload), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
