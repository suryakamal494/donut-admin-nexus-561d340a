import { Badge } from "@/components/ui/badge";
import { Clock, Target, Package, ListChecks, BookOpen } from "lucide-react";

export default function LessonPlanView({ content }: { content: any }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>{content.duration_minutes} minutes</span>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Objectives</h3>
        </div>
        <ul className="space-y-1.5 pl-6 list-disc text-sm marker:text-muted-foreground">
          {(content.objectives ?? []).map((o: string, i: number) => <li key={i}>{o}</li>)}
        </ul>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Materials</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(content.materials ?? []).map((m: string, i: number) => (
            <Badge key={i} variant="secondary" className="font-normal">{m}</Badge>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-2">
          <ListChecks className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Sections</h3>
        </div>
        <div className="space-y-2">
          {(content.sections ?? []).map((s: any, i: number) => (
            <div key={i} className="rounded-lg border p-3 bg-card">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">{s.name}</div>
                <Badge variant="outline" className="text-[10px]">{s.minutes} min</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {content.homework && (
        <section>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Homework</h3>
          </div>
          <p className="text-sm text-muted-foreground">{content.homework}</p>
        </section>
      )}
    </div>
  );
}
