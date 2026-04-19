import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ChapterDeepDiveData {
  reports_batch_id: string;
  chapter: {
    chapter_id: string;
    chapter: string;
    overall_success_rate: number;
    total_questions_asked: number;
    exams_covering: number;
    topics: { topic: string; success_rate: number; status: string; questions: number }[];
    student_buckets: { key: string; label: string; count: number }[];
    exam_breakdown: { exam_id: string; exam: string; date: string; questions_from_chapter: number; avg_success_rate: number }[];
  };
}

const tileColor = (status: string) =>
  status === "weak" ? "bg-destructive/15 text-destructive border-destructive/30" :
  status === "moderate" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" :
  "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";

export default function ChapterDeepDiveCard({ data }: { data: ChapterDeepDiveData }) {
  const navigate = useNavigate();
  const c = data.chapter;
  return (
    <Card className="p-4 space-y-3 bg-background">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">Chapter deep dive</div>
        <div className="font-semibold text-sm">{c.chapter}</div>
        <div className="text-[11px] text-muted-foreground">
          {c.overall_success_rate}% avg · {c.total_questions_asked} questions · {c.exams_covering} exams
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Topic heatmap</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {c.topics.map(t => (
            <div key={t.topic} className={`rounded border px-2 py-1 ${tileColor(t.status)}`}>
              <div className="text-[10px] font-medium truncate">{t.topic}</div>
              <div className="text-xs font-semibold tabular-nums">{t.success_rate}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Student buckets</div>
        <div className="grid grid-cols-4 gap-1.5">
          {c.student_buckets.map(b => (
            <div key={b.key} className="text-center rounded bg-muted/40 py-1">
              <div className="text-sm font-semibold tabular-nums">{b.count}</div>
              <div className="text-[9px] text-muted-foreground leading-tight">{b.label}</div>
            </div>
          ))}
        </div>
      </div>

      {c.exam_breakdown.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Per exam</div>
          <ul className="text-xs space-y-0.5">
            {c.exam_breakdown.slice(0, 5).map(e => (
              <li key={e.exam_id} className="flex items-center justify-between gap-2">
                <span className="truncate">{e.exam}</span>
                <Badge variant="outline" className="text-[10px] flex-shrink-0">
                  {e.questions_from_chapter}q · {e.avg_success_rate}%
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="w-full h-8 text-xs justify-between"
        onClick={() => navigate(`/teacher/reports/${data.reports_batch_id}/chapters/${c.chapter_id}`)}
      >
        Open chapter report
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </Card>
  );
}
