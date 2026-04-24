// Inline banner shown when the router resumes an existing session.
// See Rule 4 in docs/04-student/copilot-session-continuity.md.
import React from "react";
import { RotateCcw, Sparkles } from "lucide-react";

interface Props {
  threadTitle: string;
  toolLabel: string;
  onStartFresh: () => void;
}

const ContinuationBanner: React.FC<Props> = ({ threadTitle, toolLabel, onStartFresh }) => {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 mb-3 rounded-lg border border-donut-coral/20 bg-donut-coral/5 text-xs">
      <div className="flex items-center gap-2 min-w-0 text-foreground/80">
        <Sparkles className="w-3.5 h-3.5 text-donut-coral flex-shrink-0" />
        <span className="truncate">
          Continuing <span className="font-medium text-foreground">{toolLabel}</span> · {threadTitle}
        </span>
      </div>
      <button
        onClick={onStartFresh}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
      >
        <RotateCcw className="w-3 h-3" />
        Start fresh
      </button>
    </div>
  );
};

export default ContinuationBanner;