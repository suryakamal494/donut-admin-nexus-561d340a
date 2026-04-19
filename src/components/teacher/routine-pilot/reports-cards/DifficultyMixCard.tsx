import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface DifficultyMixData {
  reports_batch_id: string;
  exam_id: string;
  exam_name: string;
  difficulty_mix: { level: string; question_count: number; avg_success_rate: number }[];
  cognitive_mix: { type: string; question_count: number; avg_success_rate: number }[];
}

const levelColor = (l: string) =>
  l === "easy" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" :
  l === "medium" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" :
  "bg-destructive/15 text-destructive border-destructive/30";

export default function DifficultyMixCard({ data }: { data: DifficultyMixData }) {
  return (
    <Card className="p-4 space-y-3 bg-background">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
          Difficulty & cognitive mix
        </div>
        <div className="font-semibold text-sm">{data.exam_name}</div>
      </div>

      {data.difficulty_mix.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Difficulty</div>
          <div className="grid grid-cols-3 gap-1.5">
            {data.difficulty_mix.map(d => (
              <div key={d.level} className={`rounded border p-2 ${levelColor(d.level)}`}>
                <div className="text-xs capitalize font-medium">{d.level}</div>
                <div className="text-base font-semibold tabular-nums">{d.avg_success_rate}%</div>
                <div className="text-[10px] opacity-80">{d.question_count} q</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.cognitive_mix.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cognitive type</div>
          <div className="flex flex-wrap gap-1">
            {data.cognitive_mix.map(c => (
              <Badge key={c.type} variant="outline" className="text-[10px]">
                {c.type} · {c.avg_success_rate}% ({c.question_count}q)
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
