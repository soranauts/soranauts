import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const quoteSchema = z.object({
  out: z.string(),
  fee: z.string(),
  route: z.array(z.string()),
});

type QuoteData = z.infer<typeof quoteSchema>;

interface QuoteToolClientProps {
  className?: string;
}

export default function QuoteToolClient({ className = '' }: QuoteToolClientProps) {
  const [tokenA, setTokenA] = useState('XOR');
  const [tokenB, setTokenB] = useState('KUSD');
  const [amount, setAmount] = useState('100');
  const [isEnabled, setIsEnabled] = useState(false);

  const { data: quote, isLoading, error, refetch } = useQuery<QuoteData>({
    queryKey: ['quote', tokenA, tokenB, amount],
    queryFn: async () => {
      const response = await fetch(`/api/quote?a=${tokenA}&b=${tokenB}&amount=${amount}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      return quoteSchema.parse(data);
    },
    enabled: isEnabled && amount !== '' && tokenA !== tokenB,
    retry: 1,
  });

  const handleGetQuote = () => {
    setIsEnabled(true);
    refetch();
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        SORA Quote Tool
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token A
          </label>
          <input
            type="text"
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., XOR"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token B
          </label>
          <input
            type="text"
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., KUSD"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., 100"
            min="0"
            step="0.000001"
          />
        </div>

        <button
          onClick={handleGetQuote}
          disabled={isLoading || tokenA === tokenB || amount === ''}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          {isLoading ? 'Getting Quote...' : 'Get Quote'}
        </button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p className="text-red-700 dark:text-red-400 text-sm">
              Error: {error instanceof Error ? error.message : 'Failed to get quote'}
            </p>
          </div>
        )}

        {quote && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 space-y-2">
            <h3 className="font-medium text-green-800 dark:text-green-200">Quote Result</h3>
            <div className="text-sm text-green-700 dark:text-green-300">
              <p><strong>Output:</strong> {quote.out} {tokenB}</p>
              <p><strong>Fee:</strong> {quote.fee} {tokenB}</p>
              <p><strong>Route:</strong> {quote.route.join(' → ')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
