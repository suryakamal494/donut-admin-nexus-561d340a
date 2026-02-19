import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionDisplayProps {
  options: { id: string; text: string; isCorrect: boolean }[];
  userAnswer?: string | string[] | number | Record<string, string>;
  isAttempted: boolean;
  isMultiple: boolean;
}

const optionLabels = ["A", "B", "C", "D", "E", "F"];

export function OptionDisplay({ options, userAnswer, isAttempted, isMultiple }: OptionDisplayProps) {
  const isSelected = (optId: string) => {
    if (!userAnswer) return false;
    if (isMultiple && Array.isArray(userAnswer)) return userAnswer.includes(optId);
    return userAnswer === optId;
  };

  return (
    <div className="space-y-2">
      {options.map((opt, idx) => {
        const selected = isSelected(opt.id);
        const correct = opt.isCorrect;

        let borderClass = "border-border bg-white";
        let iconNode: React.ReactNode = null;

        if (selected && correct) {
          borderClass = "border-emerald-500 bg-emerald-50";
          iconNode = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
        } else if (selected && !correct) {
          borderClass = "border-red-500 bg-red-50";
          iconNode = <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
        } else if (!selected && correct) {
          borderClass = "border-emerald-500 bg-emerald-50/30";
          iconNode = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
        }

        return (
          <div
            key={opt.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border-2 transition-all",
              borderClass
            )}
          >
            <span className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
              selected && correct ? "bg-emerald-500 text-white" :
              selected && !correct ? "bg-red-500 text-white" :
              !selected && correct ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500" :
              "bg-muted text-muted-foreground"
            )}>
              {optionLabels[idx]}
            </span>
            <p className="text-sm text-foreground flex-1 pt-1">{opt.text}</p>
            {iconNode}
          </div>
        );
      })}
    </div>
  );
}
