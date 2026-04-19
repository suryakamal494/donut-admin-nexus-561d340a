/**
 * Recent exams trend — list + mini line chart.
 */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MiniTrendChart from "./MiniTrendChart";

export interface RecentExamsData {
  reports_batch_id: string;
  exams: {
    id: string;
    name: string;
    date: string;
    total_marks: number;
    class_average: number;
    pass_percentage: number;
  }[];
}

export default function RecentExamsCard({ data }: { data: RecentExamsData }) {
  const navigate = useNavigate();
  if (!data.exams.length) {
    return (
      <Card className="p-4 bg-background">
        <div className="text-sm font-semibold mb-1">Recent Exams</div>
        <p className="text-xs text-muted-foreground">No completed exams for this batch yet.</p>
      </Card>
    );
  }
  // Trend is chronological (oldest → newest)
  const chrono = [...data.exams].sort((a, b) => (a.date < b.date ? -1 : 1));
  const trend = chrono.map((e) => ({
    label: e.name.length > 12 ? e.name.slice(0, 10) + "…" : e.name,
    value: e.total_marks ? Math.round((e.class_average / e.total_marks) * 100) : 0,
  }));

  return (
    <Card className="p-4 space-y-2 bg-background">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
          Recent Exams
        </div>
        <div className="font-semibold text-sm">Class average % over time</div>
      </div>
      <MiniTrendChart data={trend} />
      <ul className="divide-y">
        {data.exams.slice(0, 4).map((e) => {
          const pct = e.total_marks ? Math.round((e.class_average / e.total_marks) * 100) : 0;
          return (
            <li key={e.id} className="flex items-center gap-2 py-1.5">
              <button
                type="button"
                onClick={() =>
                  navigate(`/teacher/reports/${data.reports_batch_id}/exams/${e.id}`)
                }
                className="flex-1 min-w-0 text-left hover:underline"
              >
                <div className="text-xs font-medium truncate">{e.name}</div>
                <div className="text-[10px] text-muted-foreground">{e.date?.slice(0, 10)}</div>
              </button>
              <span className="text-xs font-semibold tabular-nums w-10 text-right">{pct}%</span>
            </li>
          );
        })}
      </ul>
      <Button
        variant="ghost"
        size="sm"
        className="w-full h-7 text-xs justify-between mt-1"
        onClick={() => navigate(`/teacher/reports/${data.reports_batch_id}`)}
      >
        Open all exams
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </Card>
  );
}
