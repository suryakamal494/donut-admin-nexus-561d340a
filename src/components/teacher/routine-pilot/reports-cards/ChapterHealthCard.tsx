/**
 * Chapter health card — sortable list of chapters with weak-topic counts.
 */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ChapterHealthData {
  reports_batch_id: string;
  chapters: {
    id: string;
    name: string;
    avg_success_rate: number;
    status: "strong" | "moderate" | "weak";
    weak_topic_count: number;
    exams_covering: number;
  }[];
}

const statusColor = {
  strong: "border-emerald-500/40 text-emerald-600",
  moderate: "border-amber-500/40 text-amber-600",
  weak: "border-destructive/40 text-destructive",
};

export default function ChapterHealthCard({ data }: { data: ChapterHealthData }) {
  const navigate = useNavigate();
  // Sort weak first
  const sorted = [...data.chapters].sort((a, b) => a.avg_success_rate - b.avg_success_rate);
  const visible = sorted.slice(0, 6);

  return (
    <Card className="p-4 space-y-2 bg-background">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
          Chapter Health
        </div>
        <div className="font-semibold text-sm">Weakest first</div>
      </div>
      <ul className="divide-y">
        {visible.map((ch) => (
          <li key={ch.id} className="flex items-center gap-2 py-1.5">
            <button
              type="button"
              onClick={() =>
                navigate(`/teacher/reports/${data.reports_batch_id}/chapters/${ch.id}`)
              }
              className="flex-1 min-w-0 text-left hover:underline"
            >
              <div className="text-xs font-medium truncate">{ch.name}</div>
              <div className="text-[10px] text-muted-foreground">
                {ch.exams_covering} exam{ch.exams_covering !== 1 ? "s" : ""} ·{" "}
                {ch.weak_topic_count} weak topic{ch.weak_topic_count !== 1 ? "s" : ""}
              </div>
            </button>
            <Badge variant="outline" className={`text-[9px] capitalize ${statusColor[ch.status]}`}>
              {ch.status}
            </Badge>
            <span className="text-xs font-semibold tabular-nums w-9 text-right">
              {ch.avg_success_rate}%
            </span>
          </li>
        ))}
      </ul>
      {sorted.length > visible.length && (
        <p className="text-[10px] text-muted-foreground text-center">
          + {sorted.length - visible.length} more chapters
        </p>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="w-full h-7 text-xs justify-between mt-1"
        onClick={() => navigate(`/teacher/reports/${data.reports_batch_id}`)}
      >
        Open Reports
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </Card>
  );
}
