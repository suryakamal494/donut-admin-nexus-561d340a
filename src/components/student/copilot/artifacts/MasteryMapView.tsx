import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Brain, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicRow {
  topic: string;
  accuracy: number;
  attempts: number;
  band: string;
}

interface SubjectBlock {
  subject: string;
  topics: TopicRow[];
  overall_accuracy?: number;
}

interface MasteryMapContent {
  title: string;
  subjects: SubjectBlock[];
  strongest?: string[];
  weakest?: string[];
  cold_topics?: string[];
}

interface Props {
  content: MasteryMapContent;
  onPracticeTopic?: (subject: string, topic: string) => void;
}

const bandConfig: Record<string, { color: string; bg: string; label: string }> = {
  mastery_ready: { color: "text-emerald-700", bg: "bg-emerald-500", label: "Mastery" },
  stable: { color: "text-blue-700", bg: "bg-blue-500", label: "Stable" },
  reinforcement: { color: "text-amber-700", bg: "bg-amber-500", label: "Reinforce" },
  foundational_risk: { color: "text-red-700", bg: "bg-red-500", label: "Needs Work" },
  unknown: { color: "text-muted-foreground", bg: "bg-muted", label: "New" },
};

export default function MasteryMapView({ content, onPracticeTopic }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{content.title}</h3>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-2">
        {content.strongest && content.strongest.length > 0 && (
          <Card className="border-emerald-500/20 bg-emerald-50/50">
            <CardContent className="p-2">
              <p className="text-[9px] font-medium text-emerald-600 mb-1">💪 Strongest</p>
              {content.strongest.map((t, i) => (
                <p key={i} className="text-[10px] text-emerald-800 truncate">{t}</p>
              ))}
            </CardContent>
          </Card>
        )}
        {content.weakest && content.weakest.length > 0 && (
          <Card className="border-red-500/20 bg-red-50/50">
            <CardContent className="p-2">
              <p className="text-[9px] font-medium text-red-600 mb-1">⚠️ Weakest</p>
              {content.weakest.map((t, i) => (
                <p key={i} className="text-[10px] text-red-800 truncate">{t}</p>
              ))}
            </CardContent>
          </Card>
        )}
        {content.cold_topics && content.cold_topics.length > 0 && (
          <Card className="border-border bg-muted/30">
            <CardContent className="p-2">
              <p className="text-[9px] font-medium text-muted-foreground mb-1">❄️ Not Practiced</p>
              {content.cold_topics.map((t, i) => (
                <p key={i} className="text-[10px] text-muted-foreground truncate">{t}</p>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Subject blocks */}
      {content.subjects?.map((sub, sIdx) => (
        <Card key={sIdx}>
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">{sub.subject}</p>
              {sub.overall_accuracy != null && (
                <span className="text-[10px] text-muted-foreground">{sub.overall_accuracy}% overall</span>
              )}
            </div>
            {sub.topics?.map((topic, tIdx) => {
              const cfg = bandConfig[topic.band] ?? bandConfig.unknown;
              return (
                <div key={tIdx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{topic.topic}</span>
                      <span className={cn("text-[9px] px-1 py-0.5 rounded", cfg.color, `${cfg.bg}/10`)}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{topic.accuracy}%</span>
                      {onPracticeTopic && topic.band !== "mastery_ready" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1.5 text-[9px]"
                          onClick={() => onPracticeTopic(sub.subject, topic.topic)}
                        >
                          <Dumbbell className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Progress value={topic.accuracy} className={cn("h-1.5", `[&>div]:${cfg.bg}`)} />
                  <p className="text-[9px] text-muted-foreground">{topic.attempts} attempts</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}