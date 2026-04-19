import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Send, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const bandStyles: Record<string, { dot: string; ring: string; tint: string }> = {
  mastery_ready:     { dot: "bg-emerald-500", ring: "border-emerald-500 text-emerald-700 dark:text-emerald-300", tint: "bg-emerald-50 dark:bg-emerald-950/30" },
  stable_progress:   { dot: "bg-teal-500",    ring: "border-teal-500 text-teal-700 dark:text-teal-300",          tint: "bg-teal-50 dark:bg-teal-950/30" },
  reinforcement:     { dot: "bg-amber-500",   ring: "border-amber-500 text-amber-700 dark:text-amber-300",       tint: "bg-amber-50 dark:bg-amber-950/30" },
  foundational_risk: { dot: "bg-rose-500",    ring: "border-rose-500 text-rose-700 dark:text-rose-300",          tint: "bg-rose-50 dark:bg-rose-950/30" },
};

export default function BandedHomeworkView({ content }: { content: any }) {
  const bands = content.bands ?? [];
  const [active, setActive] = useState(0);
  const band = bands[active];
  const style = band ? bandStyles[band.key] ?? bandStyles.stable_progress : bandStyles.stable_progress;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {content.due_date && (
            <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due {content.due_date}</div>
          )}
          <div className="flex items-center gap-1"><Users className="w-3 h-3" />4 bands</div>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("Schedule dialog (mock)")}>
          <Send className="w-3 h-3 mr-1" /> Schedule send
        </Button>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {bands.map((b: any, i: number) => {
          const s = bandStyles[b.key] ?? bandStyles.stable_progress;
          const isActive = i === active;
          return (
            <button
              key={b.key}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap border transition-all",
                isActive ? `${s.ring} bg-card font-medium` : "border-transparent text-muted-foreground hover:bg-muted"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", s.dot)} />
              {b.label}
              <span className="opacity-60">({b.student_count})</span>
            </button>
          );
        })}
      </div>

      {band && (
        <div className={cn("rounded-lg border p-3 space-y-3", style.tint)}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={cn("w-2.5 h-2.5 rounded-full", style.dot)} />
              <span className="text-sm font-semibold">{band.label}</span>
            </div>
            <Badge variant="outline" className="text-[10px] gap-1 bg-card">
              <Clock className="w-3 h-3" /> {band.estimated_minutes} min
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground italic">{band.instructions}</p>
          <ol className="space-y-2 list-decimal pl-5">
            {(band.problems ?? []).map((p: any, i: number) => (
              <li key={i} className="text-sm">
                <div>{p.prompt}</div>
                {p.hint && (
                  <div className="text-xs text-muted-foreground italic mt-0.5">Hint: {p.hint}</div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
