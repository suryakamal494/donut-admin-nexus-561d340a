import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPerformanceColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";

interface ExamEntry {
  examId: string;
  examName: string;
  date: string;
  percentage: number;
  score: number;
  maxScore: number;
  rank: number;
  totalStudents: number;
}

interface ExamHistoryTimelineProps {
  examHistory: ExamEntry[];
  batchId: string;
}

const INITIAL_COUNT = 10;

export const ExamHistoryTimeline = ({ examHistory, batchId }: ExamHistoryTimelineProps) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? examHistory : examHistory.slice(0, INITIAL_COUNT);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
      <Card className="card-premium">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Exam History
            <InfoTooltip content="Chronological list of all exams this student appeared in. Shows score, percentage, and rank. Tap to view full exam results." />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          {examHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No exam history available.</p>
          ) : (
            <>
              {visible.map((exam, i) => {
                const pctColors = getPerformanceColor(exam.percentage);
                return (
                  <motion.div
                    key={exam.examId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/teacher/reports/${batchId}/exams/${exam.examId}`)}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-muted flex flex-col items-center justify-center">
                      <span className={cn("text-sm font-bold", pctColors.text)}>{exam.percentage}%</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{exam.examName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(new Date(exam.date), "dd MMM yyyy")} · {exam.score}/{exam.maxScore}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Award className="w-3 h-3" />
                        Rank {exam.rank}/{exam.totalStudents}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {examHistory.length > INITIAL_COUNT && !showAll && (
                <Button variant="ghost" size="sm" onClick={() => setShowAll(true)} className="w-full text-xs text-muted-foreground mt-1">
                  View all {examHistory.length} exams
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
