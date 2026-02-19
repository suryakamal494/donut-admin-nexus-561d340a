import { cn } from "@/lib/utils";

interface MatrixMatchDisplayProps {
  userAnswer?: Record<string, string>;
  correctAnswer: Record<string, string>;
  isAttempted: boolean;
}

export function MatrixMatchDisplay({ userAnswer, correctAnswer, isAttempted }: MatrixMatchDisplayProps) {
  return (
    <div className="space-y-2">
      {Object.entries(correctAnswer).map(([rowId, correctCol]) => {
        const userCol = userAnswer?.[rowId];
        const isRight = userCol === correctCol;
        return (
          <div key={rowId} className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground w-16">{rowId}</span>
            <span className="text-muted-foreground">→</span>
            <span className={cn(
              "px-2 py-1 rounded border",
              isAttempted
                ? isRight ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-red-50 border-red-500 text-red-700"
                : "bg-slate-50 border-slate-200 text-slate-400"
            )}>
              {isAttempted ? userCol || "—" : "—"}
            </span>
            {!isRight && (
              <>
                <span className="text-muted-foreground">✓</span>
                <span className="px-2 py-1 rounded border bg-emerald-50 border-emerald-500 text-emerald-700">{correctCol}</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
