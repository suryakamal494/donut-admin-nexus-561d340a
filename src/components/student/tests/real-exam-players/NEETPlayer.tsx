// NEET NTA Interface Player
// Simulates the actual NTA NEET examination interface

import { memo } from "react";

interface NEETPlayerProps {
  testId: string;
  // Additional props will be added as the player is developed
}

export const NEETPlayer = memo(function NEETPlayer({ testId }: NEETPlayerProps) {
  return (
    <div className="h-[100dvh] flex flex-col bg-green-50">
      {/* NTA NEET-style Header */}
      <header className="bg-green-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
            <span className="text-green-800 font-bold text-xs">NTA</span>
          </div>
          <div>
            <h1 className="font-semibold">NEET (UG) - 2025</h1>
            <p className="text-xs text-green-200">National Eligibility cum Entrance Test</p>
          </div>
        </div>
        <div className="bg-white text-green-800 px-3 py-1 rounded font-mono text-lg font-bold">
          03:19:45
        </div>
      </header>

      {/* Main Content Placeholder */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-800/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏗️</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            NEET Interface
          </h2>
          <p className="text-slate-600 text-sm">
            The NTA NEET interface is coming soon. This will replicate the actual examination environment 
            including Physics, Chemistry, and Biology sections with OMR-style answer marking.
          </p>
          <p className="text-xs text-slate-400 mt-4">Test ID: {testId}</p>
        </div>
      </div>

      {/* NTA-style Footer */}
      <footer className="bg-green-100 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
        <span>National Testing Agency</span>
        <span>© 2025 NTA. All Rights Reserved.</span>
      </footer>
    </div>
  );
});
