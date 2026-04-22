import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ExamWithContext } from "@/data/student/progressData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExamHistoryTimelineProps {
  exams: ExamWithContext[];
  onSelectExam?: (examId: string) => void;
  selectedExamId?: string | null;
}

const ExamHistoryTimeline = memo(({ exams, onSelectExam, selectedExamId }: ExamHistoryTimelineProps) => {
  const navigate = useNavigate();
  const sorted = [...exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const BATCH_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const visibleExams = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Exam History</h3>
        </div>
        {!selectedExamId && (
          <p className="text-[10px] text-muted-foreground/70 mb-3 ml-6">Tap any exam for details</p>
        )}
        {selectedExamId && <div className="mb-3" />}

        <div className="space-y-1.5">
          {visibleExams.map((exam, i) => {
            const isAboveAvg = exam.deltaFromAverage > 0;
            const borderColor = isAboveAvg ? "border-l-emerald-500" : exam.deltaFromAverage >= -5 ? "border-l-amber-500" : "border-l-red-500";
            const isSelected = selectedExamId === exam.examId;

            return (
              <motion.div
                key={exam.examId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * Math.min(i, 10) }}
                onClick={() => onSelectExam?.(exam.examId)}
                className={`
                  border-l-3 ${borderColor} pl-3 py-2.5 pr-2 cursor-pointer rounded-r-lg transition-all group
                  ${isSelected
                    ? 'bg-[hsl(var(--donut-coral))]/5 shadow-sm'
                    : 'hover:bg-muted/5 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">{exam.examName}</span>
                  <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {new Date(exam.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[hsl(var(--donut-coral))]' : 'text-muted-foreground/40 group-hover:text-muted-foreground'}`} />
                  </div>
                </div>

                {/* Score bar */}
                <div className="flex items-center gap-2 text-[10px]">
                  <div className="flex-1 flex items-center gap-1 flex-wrap">
                    <span className="font-bold text-foreground">{exam.percentage}%</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Avg {exam.classAverage}%</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Top {exam.highestScore}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold px-1.5 py-0.5 rounded ${
                      isAboveAvg ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      #{exam.rank}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/student/tests/${exam.examId}/results`);
                          }}
                          className="w-7 h-7 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-muted/20 transition-colors -mr-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[hsl(var(--donut-coral))]" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="text-xs">
                        View detailed report
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Comparison mini bar */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative h-1 bg-muted/15 rounded-full mt-1.5 overflow-hidden cursor-help">
                      <div className="absolute h-full bg-muted-foreground/20 rounded-full" style={{ width: `${exam.classAverage}%` }} />
                      <div className={`absolute h-full rounded-full ${isAboveAvg ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: `${exam.percentage}%` }} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-[200px]">
                    <p>Colored bar = your score ({exam.percentage}%)</p>
                    <p>Grey bar = class average ({exam.classAverage}%)</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            );
          })}

          {/* Show more / count indicator */}
          {sorted.length > BATCH_SIZE && (
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Showing {Math.min(visibleCount, sorted.length)} of {sorted.length} exams
              </span>
              {hasMore ? (
                <button
                  onClick={() => setVisibleCount(c => Math.min(c + BATCH_SIZE, sorted.length))}
                  className="text-xs font-medium text-[hsl(var(--donut-coral))] hover:underline min-h-[44px] px-2"
                >
                  Show {Math.min(BATCH_SIZE, sorted.length - visibleCount)} more
                </button>
              ) : (
                <button
                  onClick={() => setVisibleCount(BATCH_SIZE)}
                  className="text-xs font-medium text-muted-foreground hover:underline min-h-[44px] px-2"
                >
                  Collapse
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
});

ExamHistoryTimeline.displayName = "ExamHistoryTimeline";
export default ExamHistoryTimeline;