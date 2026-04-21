import { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import type { ExamWithContext } from "@/data/student/progressData";

interface ExamHistoryTimelineProps {
  exams: ExamWithContext[];
  onSelectExam?: (examId: string) => void;
}

const ExamHistoryTimeline = memo(({ exams, onSelectExam }: ExamHistoryTimelineProps) => {
  const sorted = [...exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Exam History</h3>
      </div>

      <div className="space-y-2">
        {sorted.map((exam, i) => {
          const isAboveAvg = exam.deltaFromAverage > 0;
          const borderColor = isAboveAvg ? "border-l-emerald-500" : exam.deltaFromAverage >= -5 ? "border-l-amber-500" : "border-l-red-500";

          return (
            <motion.div
              key={exam.examId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => onSelectExam?.(exam.examId)}
              className={`border-l-3 ${borderColor} pl-3 py-2.5 cursor-pointer hover:bg-muted/5 rounded-r-lg transition-colors`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground truncate">{exam.examName}</span>
                <span className="text-xs text-muted-foreground ml-2">{new Date(exam.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>

              {/* Score bar */}
              <div className="flex items-center gap-2 text-[10px]">
                <div className="flex-1 flex items-center gap-1">
                  <span className="font-bold text-foreground">{exam.percentage}%</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Avg {exam.classAverage}%</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Top {exam.highestScore}%</span>
                </div>
                <span className={`font-semibold px-1.5 py-0.5 rounded ${
                  isAboveAvg ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  #{exam.rank}
                </span>
              </div>

              {/* Comparison mini bar */}
              <div className="relative h-1 bg-muted/15 rounded-full mt-1.5 overflow-hidden">
                <div className="absolute h-full bg-muted-foreground/20 rounded-full" style={{ width: `${exam.classAverage}%` }} />
                <div className={`absolute h-full rounded-full ${isAboveAvg ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: `${exam.percentage}%` }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
});

ExamHistoryTimeline.displayName = "ExamHistoryTimeline";
export default ExamHistoryTimeline;