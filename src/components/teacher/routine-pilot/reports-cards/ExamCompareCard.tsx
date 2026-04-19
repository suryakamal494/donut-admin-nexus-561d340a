import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

export interface ExamCompareData {
  reports_batch_id: string;
  exam_a: { exam_id: string; exam_name: string; date: string; avg_pct: number; pass_percentage: number; weak_topics: string[] };
  exam_b: { exam_id: string; exam_name: string; date: string; avg_pct: number; pass_percentage: number; weak_topics: string[] };
  delta_avg_pct: number;
  delta_pass_pct: number;
  new_weak_topics: string[];
  improved_topics: string[];
}

export default function ExamCompareCard({ data }: { data: ExamCompareData }) {
  const Arrow = ({ d }: { d: number }) =>
    d > 0 ? <TrendingUp className="w-3 h-3 text-emerald-600" /> :
    d < 0 ? <TrendingDown className="w-3 h-3 text-destructive" /> : null;

  return (
    <Card className="p-4 space-y-3 bg-background">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Exam comparison</div>

      <div className="grid grid-cols-2 gap-3">
        {[data.exam_a, data.exam_b].map((e, i) => (
          <div key={e.exam_id} className="space-y-1 rounded bg-muted/40 p-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{i === 0 ? "A" : "B"}</div>
            <div className="font-semibold text-xs truncate">{e.exam_name}</div>
            <div className="text-[10px] text-muted-foreground">{e.date?.slice(0, 10)}</div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-muted-foreground">Avg</span>
              <span className="font-semibold tabular-nums">{e.avg_pct}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground">Pass</span>
              <span className="font-semibold tabular-nums">{e.pass_percentage}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="text-center rounded bg-muted/40 py-2">
          <div className="flex items-center justify-center gap-1 text-base font-semibold tabular-nums">
            <Arrow d={data.delta_avg_pct} />
            {data.delta_avg_pct > 0 ? "+" : ""}{data.delta_avg_pct}%
          </div>
          <div className="text-[10px] text-muted-foreground">Δ Avg</div>
        </div>
        <div className="text-center rounded bg-muted/40 py-2">
          <div className="flex items-center justify-center gap-1 text-base font-semibold tabular-nums">
            <Arrow d={data.delta_pass_pct} />
            {data.delta_pass_pct > 0 ? "+" : ""}{data.delta_pass_pct}%
          </div>
          <div className="text-[10px] text-muted-foreground">Δ Pass</div>
        </div>
      </div>

      {data.new_weak_topics.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-destructive">New weak topics</div>
          <div className="flex flex-wrap gap-1">
            {data.new_weak_topics.map(t => (
              <Badge key={t} variant="outline" className="text-[10px] border-destructive/40 text-destructive">{t}</Badge>
            ))}
          </div>
        </div>
      )}
      {data.improved_topics.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-emerald-700">Improved topics</div>
          <div className="flex flex-wrap gap-1">
            {data.improved_topics.map(t => (
              <Badge key={t} variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-700">{t}</Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
