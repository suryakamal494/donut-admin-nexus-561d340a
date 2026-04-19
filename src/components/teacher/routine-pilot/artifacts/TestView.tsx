import { Badge } from "@/components/ui/badge";
import { Clock, Award } from "lucide-react";

const typeMeta: Record<string, { label: string; color: string }> = {
  mcq: { label: "MCQ", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  short: { label: "Short", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  long: { label: "Long", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
};

export default function TestView({ content }: { content: any }) {
  const qs = content.questions ?? [];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{content.duration_minutes} min</Badge>
        <Badge variant="outline"><Award className="w-3 h-3 mr-1" />{content.total_marks} marks</Badge>
        <Badge variant="outline">{qs.length} questions</Badge>
      </div>
      {content.instructions && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3">{content.instructions}</p>
      )}
      <div className="space-y-3">
        {qs.map((q: any, i: number) => {
          const tm = typeMeta[q.type] ?? { label: q.type, color: "bg-muted" };
          return (
            <div key={i} className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Q{i + 1}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${tm.color}`}>{tm.label}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">{q.marks} mark{q.marks > 1 ? "s" : ""}</Badge>
              </div>
              <p className="text-sm leading-relaxed">{q.prompt}</p>
              {q.options && (
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {q.options.map((opt: string, j: number) => (
                    <div key={j} className="text-xs px-2 py-1 rounded bg-muted/60">
                      {String.fromCharCode(65 + j)}. {opt}
                    </div>
                  ))}
                </div>
              )}
              {q.answer && (
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">Answer: </span>
                  <span className="font-medium text-emerald-600">{q.answer}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
