import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface QuestionAnalysisData {
  reports_batch_id: string;
  exam_id: string;
  exam_name: string;
  questions: {
    q_no: number;
    topic: string;
    difficulty: string;
    cognitive_type: string;
    success_rate: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    avg_time_s: number;
  }[];
}

const diffColor = (d: string) =>
  d === "hard" ? "border-destructive/40 text-destructive" :
  d === "medium" ? "border-amber-500/40 text-amber-600" :
  "border-emerald-500/40 text-emerald-700";

export default function QuestionAnalysisCard({ data }: { data: QuestionAnalysisData }) {
  const navigate = useNavigate();
  return (
    <Card className="p-4 space-y-3 bg-background">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">Question analysis</div>
        <div className="font-semibold text-sm">{data.exam_name}</div>
        <div className="text-[11px] text-muted-foreground">{data.questions.length} questions</div>
      </div>

      <ul className="divide-y text-xs">
        {data.questions.slice(0, 10).map(q => (
          <li key={q.q_no} className="py-1.5 flex items-center gap-2">
            <span className="font-semibold tabular-nums w-6">Q{q.q_no}</span>
            <span className="flex-1 min-w-0 truncate">{q.topic}</span>
            <Badge variant="outline" className={`text-[9px] capitalize ${diffColor(q.difficulty)}`}>
              {q.difficulty}
            </Badge>
            <span className="font-semibold tabular-nums w-10 text-right">{q.success_rate}%</span>
            <span className="text-[10px] text-muted-foreground tabular-nums w-10 text-right">{q.avg_time_s}s</span>
          </li>
        ))}
      </ul>

      <Button
        variant="ghost"
        size="sm"
        className="w-full h-8 text-xs justify-between"
        onClick={() => navigate(`/teacher/reports/${data.reports_batch_id}/exams/${data.exam_id}`)}
      >
        Open exam report
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </Card>
  );
}
