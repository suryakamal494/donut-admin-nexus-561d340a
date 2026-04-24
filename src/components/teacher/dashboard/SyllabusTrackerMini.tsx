import { useNavigate } from "react-router-dom";
import { ListChecks, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCopilot } from "@/components/teacher/routine-pilot/CopilotContext";

interface ChapterRow {
  id: string;
  chapter: string;
  subject: string;
  batchName: string;
  coveragePercent: number;
  // If true and premium is on, surface an inline AI nudge for this chapter.
  aiSuggestion?: string;
}

interface Props {
  hasCopilot: boolean;
  // Demo-stable list. Real data wires through Academic Progress later.
  chapters?: ChapterRow[];
}

const DEFAULT_CHAPTERS: ChapterRow[] = [
  {
    id: "ch-newton",
    chapter: "Newton's Laws of Motion",
    subject: "Physics",
    batchName: "Class 10-A",
    coveragePercent: 65,
    aiSuggestion: "Mark Section 3 done — confirmed in 4 classes",
  },
  {
    id: "ch-thermo",
    chapter: "Thermodynamics",
    subject: "Physics",
    batchName: "Class 11-B",
    coveragePercent: 30,
  },
  {
    id: "ch-em",
    chapter: "Electromagnetic Induction",
    subject: "Physics",
    batchName: "Class 11-B",
    coveragePercent: 80,
  },
];

export default function SyllabusTrackerMini({
  hasCopilot,
  chapters = DEFAULT_CHAPTERS,
}: Props) {
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();

  return (
    <Card className="bg-gradient-to-br from-white to-emerald-50/40 border-emerald-100/60 shadow-sm">
      <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-5">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <ListChecks className="w-3.5 h-3.5 text-white" />
          </div>
          Syllabus Progress
          <Badge
            variant="secondary"
            className="ml-auto text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100"
          >
            Required
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-5 space-y-2.5">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            className="p-2.5 sm:p-3 rounded-xl bg-white/90 border border-emerald-100/60"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {ch.chapter}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {ch.subject} • {ch.batchName}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 flex-shrink-0">
                {ch.coveragePercent}%
              </span>
            </div>
            <Progress value={ch.coveragePercent} className="h-1.5" />
            {hasCopilot && ch.aiSuggestion && (
              <button
                type="button"
                onClick={() => openCopilot({ routineKey: "lesson_prep" })}
                className="mt-2 w-full flex items-center gap-1.5 text-[11px] text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg px-2 py-1.5 transition-colors text-left"
              >
                <Sparkles className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{ch.aiSuggestion}</span>
              </button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="w-full h-9 text-xs font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          onClick={() => navigate("/teacher/academic-progress")}
        >
          Update Syllabus Progress
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}