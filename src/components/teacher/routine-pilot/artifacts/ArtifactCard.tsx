import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, PencilLine, Layers, Calendar, ClipboardList, BarChart3, Maximize2, Download } from "lucide-react";
import type { Artifact } from "../types";

const meta: Record<Artifact["type"], { icon: React.ElementType; label: string; color: string }> = {
  lesson_plan: { icon: BookOpen, label: "Lesson Plan", color: "text-blue-600" },
  ppt: { icon: Layers, label: "Slide Deck", color: "text-purple-600" },
  test: { icon: FileText, label: "Test", color: "text-orange-600" },
  homework: { icon: PencilLine, label: "Homework", color: "text-emerald-600" },
  banded_homework: { icon: PencilLine, label: "Banded Homework", color: "text-emerald-600" },
  schedule: { icon: Calendar, label: "Scheduled", color: "text-teal-600" },
  report: { icon: BarChart3, label: "Report", color: "text-indigo-600" },
};

export default function ArtifactCard({ artifact, onClick }: { artifact: Artifact; onClick: () => void }) {
  const m = meta[artifact.type] ?? { icon: ClipboardList, label: artifact.type, color: "text-muted-foreground" };
  const Icon = m.icon;
  const date = new Date(artifact.created_at);
  // Try to extract a short batch tag (e.g. "10A") from artifact content if present
  const batchTag = (artifact.content as any)?.batch_short
    ?? (artifact.content as any)?.batch_label
    ?? null;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
      className="w-full text-left rounded-lg border bg-card hover:bg-muted/40 hover:-translate-y-0.5 hover:shadow-md transition-all p-3 group cursor-pointer"
    >
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 ${m.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-normal">{m.label}</Badge>
            <span className="text-[10px] text-muted-foreground">
              {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </div>
          <div className="text-xs font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {artifact.title}
          </div>
        </div>
        {batchTag && (
          <Badge className="text-[10px] h-4 px-1.5 font-medium bg-donut-teal/15 text-donut-teal border-donut-teal/30 hover:bg-donut-teal/20 flex-shrink-0">
            {batchTag}
          </Badge>
        )}
      </div>

      <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
        >
          <Maximize2 className="w-3 h-3" />
          Expand
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>
    </div>
  );
}
