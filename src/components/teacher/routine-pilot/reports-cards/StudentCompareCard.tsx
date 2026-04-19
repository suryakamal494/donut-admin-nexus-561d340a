import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface StudentCompareData {
  reports_batch_id: string;
  student_a: { id: string; name: string; roll: string; pi: number; accuracy: number; trend: string; weak_topic_names: string[]; suggested_difficulty: string };
  student_b: { id: string; name: string; roll: string; pi: number; accuracy: number; trend: string; weak_topic_names: string[]; suggested_difficulty: string };
  delta_pi: number;
  delta_accuracy: number;
}

export default function StudentCompareCard({ data }: { data: StudentCompareData }) {
  return (
    <Card className="p-4 space-y-3 bg-background">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Student comparison</div>
      <div className="grid grid-cols-2 gap-3">
        {[data.student_a, data.student_b].map((s, i) => (
          <div key={s.id} className="space-y-1 rounded bg-muted/40 p-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{i === 0 ? "A" : "B"}</div>
            <div className="font-semibold text-xs truncate">{s.name}</div>
            <div className="text-[10px] text-muted-foreground">Roll {s.roll}</div>
            <div className="flex justify-between pt-1">
              <span className="text-[10px] text-muted-foreground">PI</span>
              <span className="font-semibold tabular-nums">{s.pi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-muted-foreground">Accuracy</span>
              <span className="font-semibold tabular-nums">{s.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-muted-foreground">Suggested</span>
              <span className="font-semibold capitalize text-xs">{s.suggested_difficulty}</span>
            </div>
            {s.weak_topic_names.slice(0, 3).length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {s.weak_topic_names.slice(0, 3).map(t => (
                  <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        Δ PI: <span className={data.delta_pi >= 0 ? "text-emerald-700 font-semibold" : "text-destructive font-semibold"}>
          {data.delta_pi > 0 ? "+" : ""}{data.delta_pi}
        </span>
        {" · "}
        Δ Accuracy: <span className={data.delta_accuracy >= 0 ? "text-emerald-700 font-semibold" : "text-destructive font-semibold"}>
          {data.delta_accuracy > 0 ? "+" : ""}{data.delta_accuracy}%
        </span>
      </div>
    </Card>
  );
}
