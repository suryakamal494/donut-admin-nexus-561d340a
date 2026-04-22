import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectStat {
  subject: string;
  accuracy: number;
  trend: "up" | "down" | "flat";
  total_attempts: number;
  mastery_topics: number;
  weak_topics: number;
}

interface WeekStat {
  week: string;
  attempts: number;
  accuracy: number;
}

interface ProgressReportContent {
  title: string;
  period?: string;
  overall_accuracy: number;
  overall_trend: "up" | "down" | "flat";
  total_attempts: number;
  subjects: SubjectStat[];
  weekly_activity?: WeekStat[];
  recommendations?: string[];
}

interface Props {
  content: ProgressReportContent;
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-600" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

export default function ProgressReportView({ content }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{content.title}</h3>
        {content.period && <span className="text-[10px] text-muted-foreground ml-auto">{content.period}</span>}
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-primary/5">
          <CardContent className="p-2.5 text-center">
            <p className="text-[9px] text-muted-foreground">Accuracy</p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-lg font-bold text-foreground">{content.overall_accuracy}%</p>
              <TrendIcon trend={content.overall_trend} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 text-center">
            <p className="text-[9px] text-muted-foreground">Attempts</p>
            <p className="text-lg font-bold text-foreground">{content.total_attempts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 text-center">
            <p className="text-[9px] text-muted-foreground">Subjects</p>
            <p className="text-lg font-bold text-foreground">{content.subjects?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-subject */}
      {content.subjects?.map((sub, i) => (
        <Card key={i}>
          <CardContent className="p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold">{sub.subject}</span>
                <TrendIcon trend={sub.trend} />
              </div>
              <span className={cn(
                "text-xs font-bold",
                sub.accuracy >= 75 ? "text-emerald-600" : sub.accuracy >= 50 ? "text-blue-600" : "text-red-600"
              )}>
                {sub.accuracy}%
              </span>
            </div>
            <Progress value={sub.accuracy} className="h-1.5" />
            <div className="flex gap-3 text-[10px] text-muted-foreground">
              <span>{sub.total_attempts} attempts</span>
              <span className="text-emerald-600">{sub.mastery_topics} mastered</span>
              <span className="text-red-600">{sub.weak_topics} weak</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Weekly activity bars */}
      {content.weekly_activity && content.weekly_activity.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Weekly Activity</p>
            <div className="flex items-end gap-1 h-16">
              {content.weekly_activity.map((w, i) => {
                const maxAttempts = Math.max(...content.weekly_activity!.map((x) => x.attempts), 1);
                const height = (w.attempts / maxAttempts) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className={cn(
                        "w-full rounded-t-sm",
                        w.accuracy >= 75 ? "bg-emerald-400" : w.accuracy >= 50 ? "bg-blue-400" : "bg-amber-400"
                      )}
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-[8px] text-muted-foreground">{w.week}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {content.recommendations && content.recommendations.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-primary mb-1">🎯 Recommendations</p>
            <ul className="space-y-0.5">
              {content.recommendations.map((r, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1">
                  <span>•</span> {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}