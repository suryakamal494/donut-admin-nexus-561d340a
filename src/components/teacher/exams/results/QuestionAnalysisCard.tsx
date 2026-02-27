import { useState } from "react";
import { CheckCircle2, XCircle, MinusCircle, Clock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getPerformanceColor } from "@/lib/reportColors";
import { type QuestionAnalysis } from "@/data/teacher/examResults";

interface QuestionAnalysisCardProps {
  question: QuestionAnalysis;
}

export const QuestionAnalysisCard = ({ question }: QuestionAnalysisCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const colors = getPerformanceColor(question.successRate);
  const truncatedText = question.questionText.length > 80
    ? question.questionText.slice(0, 80) + "…"
    : question.questionText;

  return (
    <Card className={cn("card-premium border-l-4", colors.border)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">Q{question.questionNumber}</span>
              <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", colors.badge)}>
                {question.difficulty}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {question.cognitiveType}
              </Badge>
            </div>
            <p className="text-sm font-medium leading-snug">{truncatedText}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{question.topic}</p>
          </div>
        </div>

        {/* Success Rate Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Success Rate</span>
            <span className={cn("font-semibold", colors.text)}>{question.successRate}%</span>
          </div>
          <Progress value={question.successRate} className="h-2" />
        </div>

        {/* Attempt Breakdown */}
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{question.correctAttempts}</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-500" />
            <span>{question.incorrectAttempts}</span>
          </div>
          <div className="flex items-center gap-1">
            <MinusCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{question.unattempted}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{question.averageTime}s</span>
          </div>
        </div>

        {/* View Question toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 h-7 text-xs gap-1.5"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {expanded ? "Hide Question" : "View Question"}
        </Button>

        {expanded && (
          <div className="mt-3 pt-3 border-t space-y-2">
            <p className="text-sm leading-relaxed">{question.questionText}</p>
            {question.options && question.options.length > 0 && (
              <div className="space-y-1.5">
                {question.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-lg border",
                      opt.isCorrect
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300 font-medium"
                        : "bg-muted/50 border-border text-muted-foreground"
                    )}
                  >
                    <span className="font-medium mr-1.5">{opt.id.toUpperCase()}.</span>
                    {opt.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
