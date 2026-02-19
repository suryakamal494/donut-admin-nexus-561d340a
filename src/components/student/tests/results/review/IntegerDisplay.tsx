import { cn } from "@/lib/utils";

interface IntegerDisplayProps {
  userAnswer?: number;
  correctAnswer: number;
  isAttempted: boolean;
  isCorrect: boolean;
}

export function IntegerDisplay({ userAnswer, correctAnswer, isAttempted, isCorrect }: IntegerDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className={cn(
        "p-3 rounded-lg border-2",
        isAttempted
          ? isCorrect ? "bg-emerald-50 border-emerald-500" : "bg-red-50 border-red-500"
          : "bg-slate-50 border-slate-200"
      )}>
        <p className="text-xs text-muted-foreground mb-1">Your Answer</p>
        <p className={cn(
          "font-bold text-lg",
          isCorrect ? "text-emerald-600" : isAttempted ? "text-red-600" : "text-slate-400"
        )}>
          {isAttempted ? userAnswer : "—"}
        </p>
      </div>
      <div className="p-3 rounded-lg bg-emerald-50 border-2 border-emerald-500">
        <p className="text-xs text-muted-foreground mb-1">Correct Answer</p>
        <p className="font-bold text-lg text-emerald-600">{correctAnswer}</p>
      </div>
    </div>
  );
}
