import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import { format } from "date-fns";
import type { ChapterExamBreakdown as ChapterExamBreakdownType } from "@/data/teacher/reportsData";

interface ChapterExamBreakdownProps {
  examBreakdown: ChapterExamBreakdownType[];
  batchId: string;
  currentPath: string;
}

export const ChapterExamBreakdown = ({ examBreakdown, batchId, currentPath }: ChapterExamBreakdownProps) => {
  const navigate = useNavigate();
  const [showAllExams, setShowAllExams] = useState(false);

  const visibleExams = showAllExams ? examBreakdown : examBreakdown.slice(0, 3);
  const hasMoreExams = examBreakdown.length > 3;

  return (
    <Card className="card-premium">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Exam-wise Breakdown
          <InfoTooltip content="Shows how this chapter was tested across different exams. Click any exam to view its full results." />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {visibleExams.map((exam) => (
          <div
            key={exam.examId}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/40 cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => navigate(`/teacher/reports/${batchId}/exams/${exam.examId}?returnTo=${encodeURIComponent(currentPath)}`)}
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">{exam.examName}</p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(exam.date), "dd MMM yyyy")}
                <span>·</span>
                <span>{exam.questionsFromChapter} Qs from this chapter</span>
              </div>
            </div>
            <div className={cn(
              "shrink-0 text-xs font-bold px-2 py-1 rounded-md",
              exam.avgSuccessRate >= 65 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
              exam.avgSuccessRate >= 40 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {exam.avgSuccessRate}%
            </div>
          </div>
        ))}

        {hasMoreExams && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowAllExams(!showAllExams)}
          >
            {showAllExams ? (
              <><ChevronUp className="w-3.5 h-3.5 mr-1" /> Show less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5 mr-1" /> View all {examBreakdown.length} exams</>
            )}
          </Button>
        )}

        {examBreakdown.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No exam data for this chapter yet.</p>
        )}
      </CardContent>
    </Card>
  );
};
