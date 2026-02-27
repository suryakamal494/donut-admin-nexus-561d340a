import { Trophy, AlertTriangle, BookOpen, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { VerdictSummary } from "@/data/teacher/examResults";

interface VerdictBannerProps {
  examName: string;
  verdict: VerdictSummary;
}

export const VerdictBanner = ({ examName, verdict }: VerdictBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 p-4 sm:p-5 text-white shadow-lg"
    >
      {/* Title row */}
      <p className="text-xs font-medium text-white/70 mb-1 truncate">{examName}</p>

      {/* Verdict text */}
      <h2 className="text-base sm:text-lg font-bold leading-snug mb-3">
        Class average {verdict.averagePercentage}%
        <span className="mx-1.5 text-white/50">|</span>
        {verdict.passedCount} of {verdict.totalAttempted} passed
      </h2>

      {/* Insight pills */}
      <div className="flex flex-wrap gap-2">
        {verdict.atRiskCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            {verdict.atRiskCount} at risk
          </span>
        )}
        {verdict.weakTopicCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-medium">
            <BookOpen className="w-3 h-3" />
            {verdict.weakTopicCount} weak topic{verdict.weakTopicCount > 1 ? 's' : ''}
          </span>
        )}
        {verdict.topStudent && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-medium">
            <Trophy className="w-3 h-3" />
            Top: {verdict.topStudent.name.split(' ')[0]} {verdict.topStudent.percentage}%
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-medium">
          <TrendingUp className="w-3 h-3" />
          Avg {verdict.averagePercentage}%
        </span>
      </div>
    </motion.div>
  );
};
