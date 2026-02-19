// Score Breakdown Component
// Visual breakdown of correct, incorrect, and skipped questions

import { memo } from "react";
import { CheckCircle2, XCircle, MinusCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getAccuracyColor } from "@/data/student/testResults";

interface ScoreBreakdownProps {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
}

const ScoreBreakdown = memo(function ScoreBreakdown({
  totalQuestions,
  attempted,
  correct,
  incorrect,
  skipped,
  accuracy,
}: ScoreBreakdownProps) {
  const stats = [
    {
      label: "Correct",
      value: correct,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      barColor: "bg-emerald-500",
    },
    {
      label: "Incorrect",
      value: incorrect,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
      barColor: "bg-red-500",
    },
    {
      label: "Skipped",
      value: skipped,
      icon: MinusCircle,
      color: "text-slate-600",
      bg: "bg-slate-100",
      barColor: "bg-slate-400",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-border p-4 sm:p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        Score Breakdown
      </h3>
      
      {/* Progress Bar */}
      <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(correct / totalQuestions) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-emerald-500 h-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(incorrect / totalQuestions) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-red-500 h-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(skipped / totalQuestions) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-slate-400 h-full"
        />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={cn(
              "flex flex-col items-center p-3 sm:p-4 rounded-xl",
              stat.bg
            )}
          >
            <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6 mb-1", stat.color)} />
            <span className={cn("text-xl sm:text-2xl font-bold", stat.color)}>
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Accuracy & Attempted */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Attempted</p>
          <p className="font-bold text-foreground">
            {attempted} <span className="text-muted-foreground font-normal">/ {totalQuestions}</span>
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Accuracy</p>
          <p className={cn(
            "font-bold",
            getAccuracyColor(accuracy)
          )}>
            {accuracy}%
          </p>
        </div>
      </div>
    </div>
  );
});

export default ScoreBreakdown;
