import React, { useState } from 'react';

export default function GlossarySimple() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Simple React Test Component
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          If you can see this text, React is working!
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-700 dark:text-blue-300 mb-2">
            Click the button below to test React state:
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Click me! Count: {count}
          </button>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-700 dark:text-green-300">
            ✅ React component is rendering<br/>
            ✅ React state is working<br/>
            ✅ React hydration is successful
          </p>
        </div>
      </div>
    </div>
  );
}


