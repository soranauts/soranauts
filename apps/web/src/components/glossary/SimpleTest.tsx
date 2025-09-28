import React from 'react';

export default function SimpleTest() {
  return (
    <div className="p-4 bg-green-100 rounded">
      <h2 className="text-xl font-bold mb-2">React Component Working!</h2>
      <p>This is a simple React component that should render immediately.</p>
      <p>If you see this, React hydration is working correctly.</p>
    </div>
  );
}


