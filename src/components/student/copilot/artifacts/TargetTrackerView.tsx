import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MathMarkdown from "../MathMarkdown";

interface SubjectGap {
  subject: string;
  current: number;
  target: number;
  gap: number;
  priority_topics?: string[];
}

interface TodayTask {
  task: string;
  subject?: string;
  duration?: string;
}

interface TargetTrackerContent {
  exam_name: string;
  exam_date?: string;
  current_score: number;
  target_score: number;
  max_score: number;
  subjects: SubjectGap[];
  today_plan?: TodayTask[];
  days_remaining?: number;
  weekly_target?: number;
}

interface Props {
  content: TargetTrackerContent;
}

export default function TargetTrackerView({ content }: Props) {
  const currentPct = content.max_score > 0 ? Math.round((content.current_score / content.max_score) * 100) : 0;
  const targetPct = content.max_score > 0 ? Math.round((content.target_score / content.max_score) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{content.exam_name}</h3>
        {content.days_remaining != null && (
          <span className="ml-auto text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            {content.days_remaining}d left
          </span>
        )}
      </div>

      {/* Score overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-3">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-[10px] text-muted-foreground">Current</p>
              <p className="text-xl font-bold text-foreground">{content.current_score}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-primary mx-2" />
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Target</p>
              <p className="text-xl font-bold text-primary">{content.target_score}</p>
            </div>
            <div className="text-right ml-3">
              <p className="text-[10px] text-muted-foreground">Max</p>
              <p className="text-sm text-muted-foreground">{content.max_score}</p>
            </div>
          </div>
          <div className="relative">
            <Progress value={currentPct} className="h-3" />
            <div
              className="absolute top-0 h-3 w-0.5 bg-primary"
              style={{ left: `${targetPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
            <span>{currentPct}%</span>
            <span>Target: {targetPct}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Subject gaps */}
      {content.subjects?.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Subject-wise Gap</p>
          {content.subjects.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{s.subject}</span>
                  <span className={cn(
                    "text-[10px] font-medium",
                    s.gap <= 0 ? "text-emerald-600" : s.gap <= 10 ? "text-amber-600" : "text-red-600"
                  )}>
                    {s.gap <= 0 ? "On track" : `+${s.gap} needed`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>Now: {s.current}</span>
                  <span>→</span>
                  <span>Target: {s.target}</span>
                </div>
                {s.priority_topics && s.priority_topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {s.priority_topics.map((t, j) => (
                      <span key={j} className="text-[9px] bg-accent px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Today's plan */}
      {content.today_plan && content.today_plan.length > 0 && (
        <Card className="border-primary/20">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-primary mb-1.5">📋 Today's Plan</p>
            <div className="space-y-1">
              {content.today_plan.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-1.5 bg-muted/30 rounded">
                  <span>{t.task}</span>
                  {t.duration && <span className="text-[10px] text-muted-foreground">{t.duration}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}