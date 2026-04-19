/**
 * Batch overview tile — average, trend, at-risk count.
 */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ReportSummaryData {
  reports_batch_id: string;
  reports_batch_name: string;
  overall_trend: "improving" | "declining" | "stable";
  recent_exam_avg: number;
  at_risk_count: number;
  weak_topic_count: number;
  exam_count: number;
  total_students: number;
  suggested_focus: string;
}

const trendIcon = {
  improving: <TrendingUp className="w-4 h-4 text-emerald-600" />,
  declining: <TrendingDown className="w-4 h-4 text-destructive" />,
  stable: <Minus className="w-4 h-4 text-muted-foreground" />,
};

export default function ReportSummaryCard({ data }: { data: ReportSummaryData }) {
  const navigate = useNavigate();
  return (
    <Card className="p-4 space-y-3 bg-background">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
            Batch Overview
          </div>
          <div className="font-semibold text-sm truncate">{data.reports_batch_name}</div>
        </div>
        <Badge variant="outline" className="capitalize gap-1 text-[10px]">
          {trendIcon[data.overall_trend]}
          {data.overall_trend}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1">
        <Stat label="Avg" value={`${data.recent_exam_avg}%`} />
        <Stat label="At risk" value={String(data.at_risk_count)} tone={data.at_risk_count > 3 ? "danger" : undefined} />
        <Stat label="Weak topics" value={String(data.weak_topic_count)} />
      </div>

      {data.suggested_focus && (
        <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-2">
          {data.suggested_focus}
        </p>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="w-full h-8 text-xs justify-between"
        onClick={() => navigate(`/teacher/reports/${data.reports_batch_id}`)}
      >
        Open in Reports
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </Card>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "danger" }) {
  return (
    <div className="text-center rounded-md bg-muted/50 py-1.5">
      <div className={`text-base font-semibold tabular-nums ${tone === "danger" ? "text-destructive" : ""}`}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}
