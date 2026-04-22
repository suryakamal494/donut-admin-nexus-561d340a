// PracticeSummaryCard — end-of-practice celebration/summary
import React from "react";
import { Trophy, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Result {
  correct: boolean;
  topic?: string;
}

interface Props {
  results: Result[];
  subject?: string;
  onRetry?: () => void;
  onPracticeWeak?: (topic: string) => void;
}

const PracticeSummaryCard: React.FC<Props> = ({ results, subject, onRetry, onPracticeWeak }) => {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Identify weak topics
  const topicStats: Record<string, { correct: number; total: number }> = {};
  for (const r of results) {
    if (!r.topic) continue;
    if (!topicStats[r.topic]) topicStats[r.topic] = { correct: 0, total: 0 };
    topicStats[r.topic].total++;
    if (r.correct) topicStats[r.topic].correct++;
  }
  const weakTopics = Object.entries(topicStats)
    .filter(([, s]) => s.total > 0 && s.correct / s.total < 0.6)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .slice(0, 2);

  const emoji = pct >= 80 ? "🎉" : pct >= 60 ? "👍" : pct >= 40 ? "💪" : "📚";
  const message =
    pct >= 80
      ? "Excellent work!"
      : pct >= 60
      ? "Good job, keep it up!"
      : pct >= 40
      ? "You're getting there!"
      : "Let's practice more to improve!";

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 max-w-full">
      {/* Score header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-donut-coral to-donut-orange flex items-center justify-center flex-shrink-0">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-lg font-bold">
            {correct}/{total}{" "}
            <span className="text-2xl">{emoji}</span>
          </p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>

      {/* Dot grid */}
      <div className="flex flex-wrap gap-1.5">
        {results.map((r, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full",
              r.correct ? "bg-green-500" : "bg-destructive"
            )}
          />
        ))}
      </div>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Needs more practice
          </p>
          {weakTopics.map(([topic, stats]) => (
            <div
              key={topic}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="text-sm">
                <span className="font-medium">{topic}</span>
                <span className="text-muted-foreground ml-1.5 text-xs">
                  {stats.correct}/{stats.total}
                </span>
              </div>
              {onPracticeWeak && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => onPracticeWeak(topic)}
                >
                  Practice <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {onRetry && (
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={onRetry}>
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(PracticeSummaryCard);