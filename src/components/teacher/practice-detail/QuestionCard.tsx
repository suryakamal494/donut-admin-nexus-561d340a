import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { accuracyColor } from "./constants";
import { Badge } from "@/components/ui/badge";
import type { QuestionResult } from "@/data/teacher/practiceSessionDetailData";

const optionLabels = ["A", "B", "C", "D"];

interface QuestionCardProps {
  question: QuestionResult;
  index: number;
  bandKey: string;
}

export function QuestionCard({ question, index, bandKey }: QuestionCardProps) {
  const [showSolution, setShowSolution] = useState(false);
  const successStyle = question.successRate >= 75
    ? "border-l-emerald-500"
    : question.successRate >= 50
    ? "border-l-teal-500"
    : question.successRate >= 35
    ? "border-l-amber-500 bg-amber-500/5"
    : "border-l-red-500 bg-red-500/5";

  return (
    <div className={cn("border border-l-4 rounded-lg p-3 space-y-2", successStyle)}>
      <div className="flex items-start gap-2.5">
        <span className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5",
          "bg-primary/10 text-primary"
        )}>
          Q{index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground leading-relaxed">{question.text}</p>
          <div className="flex items-center gap-2 flex-wrap mt-1.5">
            <Badge variant="outline" className="text-xs">{question.topic}</Badge>
            <Badge variant="secondary" className="text-xs">{question.difficulty}</Badge>
            <span className={cn("text-xs font-medium ml-auto", accuracyColor(question.successRate))}>
              {question.successRate}% success ({question.correctAttempts}/{question.totalAttempts})
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-muted-foreground hover:text-foreground h-7 px-2 gap-1"
        onClick={() => setShowSolution((v) => !v)}
      >
        <Eye className="w-3 h-3" />
        {showSolution ? "Hide Solution" : "View Solution"}
        {showSolution ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </Button>

      {showSolution && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1">
          {question.options.map((opt, i) => (
            <div
              key={i}
              className={cn(
                "text-xs px-2.5 py-1.5 rounded-md border",
                i === question.correctOption
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-medium"
                  : "bg-muted/30 border-border text-muted-foreground"
              )}
            >
              <span className="font-semibold mr-1">{optionLabels[i]}.</span>
              {opt}
              {i === question.correctOption && <CheckCircle2 className="w-3 h-3 inline ml-1 -mt-0.5" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
