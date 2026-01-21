// JEE Advanced IIT Interface Player
// Simulates the actual IIT JEE Advanced examination interface

import { memo } from "react";

interface JEEAdvancedPlayerProps {
  testId: string;
  // Additional props will be added as the player is developed
}

export const JEEAdvancedPlayer = memo(function JEEAdvancedPlayer({ testId }: JEEAdvancedPlayerProps) {
  return (
    <div className="h-[100dvh] flex flex-col bg-gray-50">
      {/* IIT-style Header */}
      <header className="bg-gradient-to-r from-amber-700 to-amber-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-amber-700 font-bold text-xs">IIT</span>
          </div>
          <div>
            <h1 className="font-semibold">JEE (Advanced) - 2025</h1>
            <p className="text-xs text-amber-200">Paper 1</p>
          </div>
        </div>
        <div className="bg-white text-amber-800 px-3 py-1 rounded font-mono text-lg font-bold">
          02:59:45
        </div>
      </header>

      {/* Main Content Placeholder */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-700/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏗️</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            JEE Advanced Interface
          </h2>
          <p className="text-slate-600 text-sm">
            The IIT JEE Advanced interface is coming soon. This will replicate the actual examination environment 
            with Paper 1 & 2 support, complex question types, and section-wise submission.
          </p>
          <p className="text-xs text-slate-400 mt-4">Test ID: {testId}</p>
        </div>
      </div>

      {/* IIT-style Footer */}
      <footer className="bg-gray-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
        <span>Indian Institutes of Technology</span>
        <span>© 2025 JAB. All Rights Reserved.</span>
      </footer>
    </div>
  );
});
