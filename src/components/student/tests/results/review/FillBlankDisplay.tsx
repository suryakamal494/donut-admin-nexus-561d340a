import { cn } from "@/lib/utils";

interface FillBlankDisplayProps {
  userAnswer?: Record<string, string>;
  correctAnswer: Record<string, string>;
  isAttempted: boolean;
}

export function FillBlankDisplay({ userAnswer, correctAnswer, isAttempted }: FillBlankDisplayProps) {
  return (
    <div className="space-y-2">
      {Object.entries(correctAnswer).map(([blankId, correct], idx) => {
        const userVal = userAnswer?.[blankId];
        const isRight = userVal?.toLowerCase() === correct.toLowerCase();
        return (
          <div key={blankId} className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground w-16">Blank {idx + 1}</span>
            <div className={cn(
              "flex-1 p-2 rounded border-2 text-sm",
              isAttempted
                ? isRight ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-red-50 border-red-500 text-red-700"
                : "bg-slate-50 border-slate-200 text-slate-400"
            )}>
              {isAttempted ? userVal || "—" : "—"}
            </div>
            <div className="flex-1 p-2 rounded border-2 bg-emerald-50 border-emerald-500 text-sm text-emerald-700">
              {correct}
            </div>
          </div>
        );
      })}
    </div>
  );
}
