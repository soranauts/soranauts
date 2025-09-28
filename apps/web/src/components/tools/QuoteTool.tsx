import React from 'react';
import QuoteToolClient from './QuoteToolClient';

interface QuoteToolProps {
  className?: string;
}

export default function QuoteTool({ className = '' }: QuoteToolProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        SORA Quote Tool
      </h2>
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    </div>
  );
}
