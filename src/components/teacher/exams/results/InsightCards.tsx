import { Brain, SkipForward } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { QuestionAnalysis } from "@/data/teacher/examResults";

interface InsightCardsProps {
  questions: QuestionAnalysis[];
}

export const InsightCards = ({ questions }: InsightCardsProps) => {
  if (questions.length === 0) return null;

  // Hardest question (lowest success rate)
  const hardest = [...questions].sort((a, b) => a.successRate - b.successRate)[0];
  // Most skipped (highest unattempted)
  const mostSkipped = [...questions].sort((a, b) => b.unattempted - a.unattempted)[0];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Key Insights</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {hardest && (
          <Card className="card-premium border-l-4 border-l-red-400">
            <CardContent className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-red-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Hardest Question</p>
                <p className="text-sm font-semibold truncate">
                  Q{hardest.questionNumber} — {hardest.topic}
                </p>
                <p className="text-xs text-red-600 font-medium">
                  {hardest.successRate}% success rate
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {mostSkipped && mostSkipped.unattempted > 0 && (
          <Card className="card-premium border-l-4 border-l-amber-400">
            <CardContent className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <SkipForward className="w-4 h-4 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Most Skipped</p>
                <p className="text-sm font-semibold truncate">
                  Q{mostSkipped.questionNumber} — {mostSkipped.topic}
                </p>
                <p className="text-xs text-amber-600 font-medium">
                  {mostSkipped.unattempted} unattempted
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
