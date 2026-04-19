import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, PencilLine, Layers, Calendar, ClipboardList, BarChart3 } from "lucide-react";
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
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg border bg-card hover:bg-muted/40 transition-colors p-3 group"
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
      </div>
    </button>
  );
}
