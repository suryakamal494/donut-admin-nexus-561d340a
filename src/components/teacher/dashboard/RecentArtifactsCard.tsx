import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  BookOpen,
  ClipboardList,
  Presentation,
  BarChart3,
  CalendarDays,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCopilot } from "@/components/teacher/routine-pilot/CopilotContext";

interface Artifact {
  id: string;
  title: string;
  type: string;
  batch_id: string;
  created_at: string;
}

const TYPE_META: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
  lesson_plan: { icon: BookOpen, label: "Lesson Plan", color: "from-teal-500 to-cyan-500" },
  homework: { icon: ClipboardList, label: "Homework", color: "from-amber-500 to-orange-500" },
  banded_homework: { icon: ClipboardList, label: "Homework", color: "from-amber-500 to-orange-500" },
  test: { icon: FileText, label: "Test", color: "from-rose-500 to-pink-500" },
  ppt: { icon: Presentation, label: "Slides", color: "from-violet-500 to-fuchsia-500" },
  report: { icon: BarChart3, label: "Report", color: "from-indigo-500 to-blue-500" },
  schedule: { icon: CalendarDays, label: "Schedule", color: "from-emerald-500 to-green-500" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function RecentArtifactsCard() {
  const { openCopilot } = useCopilot();
  const [items, setItems] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("rp_artifacts")
        .select("id, title, type, batch_id, created_at")
        .order("created_at", { ascending: false })
        .limit(3);
      if (cancelled) return;
      setItems((data ?? []) as Artifact[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="bg-gradient-to-br from-white to-violet-50/30 border-violet-100/60 shadow-lg shadow-violet-500/5">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-white" />
          </div>
          Recent AI Work
          <Badge
            variant="secondary"
            className="ml-auto text-[10px] uppercase bg-violet-50 text-violet-700 border border-violet-100"
          >
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-3 sm:px-6 pb-3 sm:pb-6">
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-muted/40 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-sm text-muted-foreground">
              Nothing yet — create your first lesson plan with Copilot.
            </p>
            <Button
              size="sm"
              className="mt-3 h-9 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0"
              onClick={() => openCopilot({ routineKey: "lesson_prep" })}
            >
              Open Copilot
            </Button>
          </div>
        ) : (
          items.map((art) => {
            const meta = TYPE_META[art.type] ?? {
              icon: FileText,
              label: art.type,
              color: "from-slate-500 to-slate-600",
            };
            const Icon = meta.icon;
            return (
              <button
                key={art.id}
                type="button"
                onClick={() =>
                  openCopilot({
                    routineKey:
                      art.type === "lesson_plan"
                        ? "lesson_prep"
                        : art.type === "test"
                          ? "test_creation"
                          : "homework",
                    batchId: art.batch_id,
                  })
                }
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-violet-100/60 hover:border-violet-300 hover:shadow-md hover:bg-white transition-all duration-150 active:scale-[0.99] text-left"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm truncate text-foreground">
                    {art.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {meta.label} • {timeAgo(art.created_at)}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}