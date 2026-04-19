/**
 * Single exam analysis — verdict, performance bands, score distribution.
 */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MiniBarChart from "./MiniBarChart";

export interface ExamResultData {
  reports_batch_id: string;
  exam_id: string;
  exam_name: string;
  date: string;
  total_marks: number;
  class_average: number;
  highest_score: number;
  pass_percentage: number;
  total_students: number;
  attempted_count?: number;
  verdict_text?: string;
  bands?: { key: string; label: string; count: number }[];
  topic_flags?: { topic: string; success_rate: number; status: string }[];
  score_distribution?: { range: string; count: number }[];
}

export default function ExamResultCard({ data }: { data: ExamResultData }) {
  const navigate = useNavigate();
  const avgPct = data.total_marks
    ? Math.round((data.class_average / data.total_marks) * 100)
    : 0;
  const weakTopics = (data.topic_flags ?? []).filter((t) => t.status === "weak").slice(0, 4);

  return (
    <Card className="p-4 space-y-3 bg-background">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
          Exam Analysis
        </div>
        <div className="font-semibold text-sm">{data.exam_name}</div>
        <div className="text-[11px] text-muted-foreground">
          {data.date?.slice(0, 10)} · {data.total_marks} marks
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MetricTile label="Avg" value={`${avgPct}%`} />
        <MetricTile label="Pass" value={`${data.pass_percentage}%`} />
        <MetricTile label="Top" value={String(data.highest_score)} />
      </div>

      {data.verdict_text && (
        <p className="text-xs leading-relaxed border-l-2 border-primary/40 pl-2 text-foreground/80">
          {data.verdict_text}
        </p>
      )}

      {data.bands && data.bands.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Performance bands
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {data.bands.map((b) => (
              <div key={b.key} className="text-center rounded bg-muted/40 py-1">
                <div className="text-sm font-semibold tabular-nums">{b.count}</div>
                <div className="text-[9px] text-muted-foreground leading-tight">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.score_distribution && data.score_distribution.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Score distribution
          </div>
          <MiniBarChart
            data={data.score_distribution.map((d) => ({ label: d.range, value: d.count }))}
          />
        </div>
      )}

      {weakTopics.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Weak topics
          </div>
          <div className="flex flex-wrap gap-1">
            {weakTopics.map((t) => (
              <Badge key={t.topic} variant="outline" className="text-[10px] border-destructive/40 text-destructive">
                {t.topic} · {t.success_rate}%
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="w-full h-8 text-xs justify-between"
        onClick={() =>
          navigate(`/teacher/reports/${data.reports_batch_id}/exams/${data.exam_id}`)
        }
      >
        Open exam report
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </Card>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center rounded-md bg-muted/50 py-1.5">
      <div className="text-base font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}
