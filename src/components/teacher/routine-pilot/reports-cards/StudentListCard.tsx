/**
 * Compact student list card — at-risk or top performers.
 */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface StudentListData {
  reports_batch_id: string;
  title: string;
  variant: "at_risk" | "top_performers";
  students: {
    id: string;
    name: string;
    roll: string;
    avg: number;
    pi: number;
    bucket?: string;
    trend?: "up" | "down" | "flat";
  }[];
}

const trendIcon = (t?: string) => {
  if (t === "up") return <TrendingUp className="w-3 h-3 text-emerald-600" />;
  if (t === "down") return <TrendingDown className="w-3 h-3 text-destructive" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const bucketColor = (bucket?: string) => {
  if (bucket === "risk") return "border-destructive/40 text-destructive";
  if (bucket === "reinforcement") return "border-amber-500/40 text-amber-600";
  if (bucket === "mastery") return "border-emerald-500/40 text-emerald-600";
  return "";
};

export default function StudentListCard({ data }: { data: StudentListData }) {
  const navigate = useNavigate();
  if (!data.students.length) {
    return (
      <Card className="p-4 bg-background">
        <div className="text-sm font-semibold mb-1">{data.title}</div>
        <p className="text-xs text-muted-foreground">No students match this filter for the current batch.</p>
      </Card>
    );
  }
  return (
    <Card className="p-4 space-y-2 bg-background">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
            {data.variant === "at_risk" ? "At-risk students" : "Top performers"}
          </div>
          <div className="font-semibold text-sm">{data.title}</div>
        </div>
        <Badge variant="outline" className="text-[10px]">
          {data.students.length}
        </Badge>
      </div>
      <ul className="divide-y">
        {data.students.map((s) => (
          <li key={s.id} className="flex items-center gap-2 py-1.5">
            <button
              type="button"
              onClick={() =>
                navigate(`/teacher/reports/${data.reports_batch_id}/students/${s.id}`)
              }
              className="flex-1 min-w-0 text-left hover:underline"
            >
              <div className="text-xs font-medium truncate">{s.name}</div>
              <div className="text-[10px] text-muted-foreground">Roll {s.roll}</div>
            </button>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {s.bucket && (
                <Badge variant="outline" className={`text-[9px] capitalize ${bucketColor(s.bucket)}`}>
                  {s.bucket}
                </Badge>
              )}
              <span className="text-xs font-semibold tabular-nums w-9 text-right">{s.avg}%</span>
              {trendIcon(s.trend)}
            </div>
          </li>
        ))}
      </ul>
      <Button
        variant="ghost"
        size="sm"
        className="w-full h-7 text-xs justify-between mt-1"
        onClick={() => navigate(`/teacher/reports/${data.reports_batch_id}`)}
      >
        See full roster
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </Card>
  );
}
