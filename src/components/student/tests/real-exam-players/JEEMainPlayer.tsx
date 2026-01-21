// JEE Main NTA Interface Player
// Simulates the actual NTA JEE Main examination interface

import { memo } from "react";

interface JEEMainPlayerProps {
  testId: string;
  // Additional props will be added as the player is developed
}

export const JEEMainPlayer = memo(function JEEMainPlayer({ testId }: JEEMainPlayerProps) {
  return (
    <div className="h-[100dvh] flex flex-col bg-slate-100">
      {/* NTA-style Header */}
      <header className="bg-blue-900 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
            <span className="text-blue-900 font-bold text-xs">NTA</span>
          </div>
          <div>
            <h1 className="font-semibold">JEE (Main) - 2025</h1>
            <p className="text-xs text-blue-200">Computer Based Test</p>
          </div>
        </div>
        <div className="bg-white text-blue-900 px-3 py-1 rounded font-mono text-lg font-bold">
          02:59:45
        </div>
      </header>

      {/* Main Content Placeholder */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-blue-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏗️</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            JEE Main Interface
          </h2>
          <p className="text-slate-600 text-sm">
            The NTA JEE Main interface is coming soon. This will replicate the actual examination environment 
            including the question panel, navigation, and submission flow.
          </p>
          <p className="text-xs text-slate-400 mt-4">Test ID: {testId}</p>
        </div>
      </div>

      {/* NTA-style Footer */}
      <footer className="bg-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
        <span>National Testing Agency</span>
        <span>© 2025 NTA. All Rights Reserved.</span>
      </footer>
    </div>
  );
});
