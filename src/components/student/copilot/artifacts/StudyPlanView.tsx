import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Calendar, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import MathMarkdown from "../MathMarkdown";

interface PlanItem {
  task: string;
  duration?: string;
  resource?: string;
}

interface PlanDay {
  day: number;
  label?: string;
  date?: string;
  items: PlanItem[];
}

interface StudyPlanContent {
  title: string;
  subject?: string;
  total_days: number;
  days: PlanDay[];
  tips?: string[];
}

interface Props {
  content: StudyPlanContent;
  completedTasks?: Set<string>;
  onToggleTask?: (dayIndex: number, itemIndex: number) => void;
}

export default function StudyPlanView({ content, completedTasks, onToggleTask }: Props) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));

  const toggleDay = (d: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  const totalItems = content.days?.reduce((s, d) => s + (d.items?.length ?? 0), 0) ?? 0;
  const completedCount = completedTasks?.size ?? 0;
  const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{content.title}</h3>
      </div>

      {totalItems > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{completedCount}/{totalItems} tasks</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="space-y-2">
        {content.days?.map((day, dIdx) => {
          const expanded = expandedDays.has(dIdx);
          const dayCompleted = day.items?.every((_, iIdx) =>
            completedTasks?.has(`${dIdx}-${iIdx}`)
          );

          return (
            <Card key={dIdx} className={cn(dayCompleted && "border-emerald-500/20 bg-emerald-50/30")}>
              <button
                className="w-full flex items-center gap-2 p-3 text-left"
                onClick={() => toggleDay(dIdx)}
              >
                {dayCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className="text-xs font-semibold text-primary">Day {day.day ?? dIdx + 1}</span>
                {day.label && <span className="text-xs text-muted-foreground truncate">— {day.label}</span>}
              </button>
              {expanded && (
                <CardContent className="px-3 pb-3 pt-0 ml-6 space-y-1.5">
                  {day.items?.map((item, iIdx) => {
                    const done = completedTasks?.has(`${dIdx}-${iIdx}`);
                    return (
                      <div
                        key={iIdx}
                        className={cn(
                          "flex items-start gap-2 p-2 rounded-md text-xs",
                          done ? "bg-emerald-50 text-emerald-800" : "bg-muted/30",
                          onToggleTask && "cursor-pointer hover:bg-accent/50"
                        )}
                        onClick={() => onToggleTask?.(dIdx, iIdx)}
                      >
                        {done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <div>
                          <MathMarkdown compact className="text-xs">{item.task}</MathMarkdown>
                          {item.duration && <span className="text-[10px] text-muted-foreground">{item.duration}</span>}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {content.tips && content.tips.length > 0 && (
        <Card className="border-primary/10 bg-primary/5">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-primary mb-1">💡 Tips</p>
            <ul className="space-y-0.5">
              {content.tips.map((tip, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1">
                  <span>•</span> {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}