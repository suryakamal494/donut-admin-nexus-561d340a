import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface MultiSubjectRiskData {
  reports_batch_id: string;
  students: {
    id: string;
    name: string;
    roll: string;
    weak_chapter_count: number;
    weak_chapters: string[];
    pi: number;
    trend: string;
  }[];
}

export default function MultiSubjectRiskCard({ data }: { data: MultiSubjectRiskData }) {
  const navigate = useNavigate();
  if (!data.students.length) {
    return (
      <Card className="p-4 bg-background">
        <div className="text-sm font-semibold mb-1">No multi-area risk</div>
        <p className="text-xs text-muted-foreground">No students are weak in 2+ chapters in this batch.</p>
      </Card>
    );
  }
  return (
    <Card className="p-4 space-y-2 bg-background">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
          Multi-area risk
        </div>
        <div className="font-semibold text-sm">
          {data.students.length} students weak in 2+ chapters
        </div>
      </div>
      <ul className="divide-y">
        {data.students.slice(0, 8).map(s => (
          <li key={s.id} className="py-1.5 space-y-0.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(`/teacher/reports/${data.reports_batch_id}/students/${s.id}`)}
                className="text-xs font-medium text-left hover:underline truncate flex-1"
              >
                {s.name}
              </button>
              <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive flex-shrink-0">
                {s.weak_chapter_count} weak · PI {s.pi}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {s.weak_chapters.slice(0, 4).map(ch => (
                <Badge key={ch} variant="outline" className="text-[9px]">{ch}</Badge>
              ))}
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
        Open full roster
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </Card>
  );
}
