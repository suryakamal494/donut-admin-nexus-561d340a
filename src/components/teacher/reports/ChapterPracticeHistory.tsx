import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronRight, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPracticeHistory } from "@/data/teacher/practiceHistoryData";
import type { PracticeSession } from "@/data/teacher/practiceHistoryData";

const bandDots: Record<string, string> = {
  mastery: "bg-emerald-500",
  stable: "bg-teal-500",
  reinforcement: "bg-amber-500",
  risk: "bg-red-500",
};

interface Props {
  chapterId: string;
  batchId: string;
}

const VISIBLE_DEFAULT = 3;

export const ChapterPracticeHistory = ({ chapterId, batchId }: Props) => {
  const navigate = useNavigate();
  const sessions = getPracticeHistory(chapterId, batchId);
  const [showAll, setShowAll] = useState(false);

  if (sessions.length === 0) {
    return (
      <Card className="card-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Practice History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="w-10 h-10 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No practice sessions yet</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">
              Generate homework from the Student Performance section above
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasMore = sessions.length > VISIBLE_DEFAULT;
  const visible = showAll ? sessions : sessions.slice(0, VISIBLE_DEFAULT);

  return (
    <Card className="card-premium">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Practice History
          <span className="text-xs font-normal text-muted-foreground ml-1">({sessions.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {visible.map((session) => (
          <SessionRow key={session.id} session={session} />
        ))}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? (
              <>Show less <ChevronUp className="w-3 h-3 ml-1" /></>
            ) : (
              <>Show all {sessions.length} sessions <ChevronDown className="w-3 h-3 ml-1" /></>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const SessionRow = ({ session }: { session: PracticeSession }) => {
  const navigate = useNavigate();
  const totalStudents = session.bands.reduce((s, b) => s + b.studentsAssigned, 0);
  const totalCompleted = session.bands.reduce((s, b) => s + b.completedCount, 0);
  const completionPct = totalStudents > 0 ? Math.round((totalCompleted / totalStudents) * 100) : 0;
  const avgAccuracy = Math.round(session.bands.reduce((s, b) => s + b.avgAccuracy, 0) / session.bands.length);

  return (
    <div
      className="flex items-center gap-3 rounded-lg border p-2.5 hover:bg-muted/40 transition-colors cursor-pointer group"
      onClick={() => navigate(`/teacher/reports/${session.batchId}/chapters/${session.chapterId}/practice/${session.id}`)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {new Date(session.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="text-xs text-muted-foreground">
            {session.totalQuestions} questions
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {/* Band dots */}
          <div className="flex items-center gap-1">
            {session.bands.map(b => (
              <span key={b.key} className={cn("w-2 h-2 rounded-full", bandDots[b.key])} title={b.label} />
            ))}
          </div>

          <span className="text-xs text-muted-foreground">
            {completionPct}% completed
          </span>
          <span className="text-xs text-muted-foreground">
            Avg accuracy: {avgAccuracy}%
          </span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
    </div>
  );
};
