import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

export interface ActionableInsightsData {
  reports_batch_id: string;
  exam_id: string;
  exam_name: string;
  insights: {
    id: string;
    type: "reteach" | "practice" | "celebrate" | "attention";
    severity: "critical" | "warning" | "positive";
    finding: string;
    detail: string;
    affected_students: { id: string; name: string; score: number }[];
    suggested_action: string;
    action_type: "homework" | "practice" | "none";
    action_payload: { topic?: string; difficulty?: string; studentIds?: string[] };
  }[];
}

const sevStyle = (s: string) =>
  s === "critical" ? "border-destructive/40 bg-destructive/5" :
  s === "warning" ? "border-amber-500/40 bg-amber-500/5" :
  "border-emerald-500/40 bg-emerald-500/5";

const typeIcon = (t: string) => {
  if (t === "reteach") return <BookOpen className="w-3.5 h-3.5" />;
  if (t === "practice") return <AlertCircle className="w-3.5 h-3.5" />;
  if (t === "celebrate") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />;
  return <AlertTriangle className="w-3.5 h-3.5 text-destructive" />;
};

export default function ActionableInsightsCard({ data }: { data: ActionableInsightsData }) {
  if (!data.insights.length) {
    return (
      <Card className="p-4 bg-background">
        <div className="text-sm font-semibold mb-1">No insights yet</div>
        <p className="text-xs text-muted-foreground">Run an exam to generate actionable insights.</p>
      </Card>
    );
  }
  return (
    <div className="space-y-2">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-1">
        Actionable insights · {data.exam_name}
      </div>
      {data.insights.map((ins) => (
        <Card key={ins.id} className={`p-3 space-y-2 border ${sevStyle(ins.severity)}`}>
          <div className="flex items-start gap-2">
            {typeIcon(ins.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold capitalize">{ins.type}</span>
                <Badge variant="outline" className="text-[9px] capitalize">{ins.severity}</Badge>
              </div>
              <div className="text-xs font-medium mt-0.5">{ins.finding}</div>
              <p className="text-[11px] text-muted-foreground mt-1">{ins.detail}</p>
            </div>
          </div>

          {ins.affected_students.length > 0 && (
            <div className="flex flex-wrap gap-1 pl-5">
              {ins.affected_students.slice(0, 5).map(s => (
                <Badge key={s.id} variant="outline" className="text-[9px]">
                  {s.name} · {s.score}%
                </Badge>
              ))}
              {ins.affected_students.length > 5 && (
                <Badge variant="outline" className="text-[9px]">+{ins.affected_students.length - 5}</Badge>
              )}
            </div>
          )}

          {ins.action_type !== "none" && (
            <Button
              size="sm"
              className="w-full h-7 text-xs"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("rp:handoff-homework", {
                  detail: {
                    contextBanner: `${ins.suggested_action}: ${ins.finding}`,
                    topic: ins.action_payload.topic,
                    difficulty: ins.action_payload.difficulty,
                    studentIds: ins.action_payload.studentIds ?? ins.affected_students.map(s => s.id),
                    studentNames: ins.affected_students.map(s => s.name),
                  },
                }));
              }}
            >
              {ins.suggested_action}
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}
