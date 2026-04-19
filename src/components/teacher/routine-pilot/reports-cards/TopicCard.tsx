import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface TopicAnalysisData {
  reports_batch_id: string;
  topic: {
    topic: string;
    chapter: string;
    chapter_id: string;
    success_rate: number;
    status: "strong" | "moderate" | "weak";
    affected_students: { id: string; name: string; accuracy: number }[];
    exam_count: number;
  };
}

const statusColor = (s: string) =>
  s === "weak" ? "border-destructive/40 text-destructive" :
  s === "moderate" ? "border-amber-500/40 text-amber-600" :
  "border-emerald-500/40 text-emerald-700";

export default function TopicCard({ data }: { data: TopicAnalysisData }) {
  const navigate = useNavigate();
  const t = data.topic;
  return (
    <Card className="p-4 space-y-3 bg-background">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">Topic</div>
          <div className="font-semibold text-sm">{t.topic}</div>
          <div className="text-[11px] text-muted-foreground">in {t.chapter} · {t.exam_count} exam(s)</div>
        </div>
        <Badge variant="outline" className={`capitalize text-[10px] ${statusColor(t.status)}`}>
          {t.success_rate}% · {t.status}
        </Badge>
      </div>

      {t.affected_students.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t.affected_students.length} students struggling
          </div>
          <ul className="divide-y">
            {t.affected_students.slice(0, 6).map(s => (
              <li key={s.id} className="flex items-center justify-between py-1 text-xs">
                <span className="truncate">{s.name}</span>
                <span className="font-semibold tabular-nums text-destructive">{s.accuracy}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        {t.status === "weak" && (
          <Button
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("rp:handoff-homework", {
                detail: {
                  contextBanner: `Reteach ${t.topic} — ${t.affected_students.length} students at ${t.success_rate}% success`,
                  topic: t.topic,
                  difficulty: "easy",
                  studentIds: t.affected_students.map(s => s.id),
                  studentNames: t.affected_students.map(s => s.name),
                },
              }));
            }}
          >
            Generate Homework
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-xs justify-between"
          onClick={() => navigate(`/teacher/reports/${data.reports_batch_id}/chapters/${t.chapter_id}`)}
        >
          Open chapter
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
