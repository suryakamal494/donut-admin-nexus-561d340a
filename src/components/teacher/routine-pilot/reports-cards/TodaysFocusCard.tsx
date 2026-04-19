import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingDown, TrendingUp, Minus } from "lucide-react";

export interface TodaysFocusData {
  reports_batch_id: string;
  reports_batch_name: string;
  overall_trend: "improving" | "declining" | "stable";
  recent_exam_avg: number;
  suggested_focus: string;
  priority_topics: { topic: string; chapter: string; successRate: number }[];
  students_to_check_in: { studentId: string; studentName: string; reason: string; avgPercentage: number }[];
  at_risk_count: number;
  weak_topic_count: number;
}

const trendIcon = {
  improving: <TrendingUp className="w-4 h-4 text-emerald-600" />,
  declining: <TrendingDown className="w-4 h-4 text-destructive" />,
  stable: <Minus className="w-4 h-4 text-muted-foreground" />,
};

export default function TodaysFocusCard({ data }: { data: TodaysFocusData }) {
  return (
    <Card className="p-4 space-y-3 bg-gradient-to-br from-primary/5 to-background border-primary/20">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-primary mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Today's Focus
          </div>
          <div className="font-semibold text-sm">{data.reports_batch_name} · {data.recent_exam_avg}% avg</div>
        </div>
        <Badge variant="outline" className="capitalize gap-1 text-[10px]">
          {trendIcon[data.overall_trend]}
          {data.overall_trend}
        </Badge>
      </div>

      {data.suggested_focus && (
        <p className="text-xs leading-relaxed border-l-2 border-primary/40 pl-2 text-foreground/80">
          {data.suggested_focus}
        </p>
      )}

      {data.priority_topics.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Priority topics</div>
          <ul className="text-xs space-y-0.5">
            {data.priority_topics.map(t => (
              <li key={t.topic} className="flex items-center justify-between">
                <span className="truncate">{t.topic} <span className="text-muted-foreground">in {t.chapter}</span></span>
                <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive flex-shrink-0">
                  {t.successRate}%
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.students_to_check_in.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Students to check in</div>
          <ul className="text-xs space-y-0.5">
            {data.students_to_check_in.map(s => (
              <li key={s.studentId} className="flex items-center justify-between gap-2">
                <span className="truncate">
                  <span className="font-medium">{s.studentName}</span>
                  <span className="text-muted-foreground"> — {s.reason}</span>
                </span>
                <span className="text-[10px] tabular-nums flex-shrink-0">{s.avgPercentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
