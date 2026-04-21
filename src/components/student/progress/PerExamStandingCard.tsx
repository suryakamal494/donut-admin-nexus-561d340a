import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Award, Target } from "lucide-react";
import type { ExamWithContext } from "@/data/student/progressData";

interface PerExamStandingCardProps {
  exam: ExamWithContext | null;
  onClose: () => void;
}

const PerExamStandingCard = memo(({ exam, onClose }: PerExamStandingCardProps) => {
  if (!exam) return null;

  const isAboveAvg = exam.deltaFromAverage > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <Award className="w-4 h-4 text-[hsl(var(--donut-coral))] flex-shrink-0" />
            <h3 className="text-sm font-semibold text-foreground truncate">
              {exam.examName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted/10 flex items-center justify-center min-h-[44px] min-w-[44px] flex-shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Score */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-foreground">{exam.score}</span>
          <span className="text-lg text-muted-foreground">/ {exam.maxScore}</span>
          <span className="ml-auto text-2xl font-bold bg-gradient-to-r from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] bg-clip-text text-transparent">
            {exam.percentage}%
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-muted/10 rounded-xl px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-foreground">
              #{exam.rank}
              <span className="text-xs font-normal text-muted-foreground">
                /{exam.totalStudents}
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground">Rank</p>
          </div>
          <div className="bg-muted/10 rounded-xl px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-foreground">
              {exam.percentile}<span className="text-xs">th</span>
            </p>
            <p className="text-[10px] text-muted-foreground">Percentile</p>
          </div>
        </div>

        {/* Comparison Bars */}
        <div className="space-y-2.5">
          {/* vs Average */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-14">vs Avg</span>
            <div className="flex-1 h-2 bg-muted/15 rounded-full overflow-hidden relative">
              <div
                className="absolute h-full bg-muted-foreground/20 rounded-full"
                style={{ width: `${exam.classAverage}%` }}
              />
              <div
                className={`absolute h-full rounded-full ${
                  isAboveAvg ? "bg-emerald-400" : "bg-red-400"
                }`}
                style={{ width: `${exam.percentage}%` }}
              />
            </div>
            <span
              className={`text-xs font-bold min-w-[40px] text-right ${
                isAboveAvg ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {isAboveAvg ? "+" : ""}
              {exam.deltaFromAverage}%
            </span>
          </div>

          {/* vs Top */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-14">vs Top</span>
            <div className="flex-1 h-2 bg-muted/15 rounded-full overflow-hidden relative">
              <div
                className="absolute h-full bg-emerald-200 rounded-full"
                style={{ width: `${exam.highestScore}%` }}
              />
              <div
                className="absolute h-full bg-[hsl(var(--donut-coral))] rounded-full"
                style={{ width: `${exam.percentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground min-w-[40px] text-right">
              {exam.deltaFromTop}%
            </span>
          </div>
        </div>

        {/* Motivational line */}
        <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-muted/20">
          {isAboveAvg
            ? `You scored ${exam.deltaFromAverage}% above the class average 🎉`
            : `${Math.abs(exam.deltaFromAverage)}% more effort needed to beat the class average`}
        </p>
      </motion.div>
    </AnimatePresence>
  );
});

PerExamStandingCard.displayName = "PerExamStandingCard";
export default PerExamStandingCard;