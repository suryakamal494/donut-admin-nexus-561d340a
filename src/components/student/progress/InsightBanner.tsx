import { motion } from "framer-motion";
import { Sparkles, Target, Star } from "lucide-react";
import type { StudentAIInsight } from "@/data/student/progressData";

interface InsightBannerProps {
  insight: StudentAIInsight;
}

const InsightBanner = ({ insight }: InsightBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[hsl(var(--donut-coral))]/10 via-[hsl(var(--donut-orange))]/5 to-white/70 backdrop-blur-xl rounded-2xl p-5 border border-[hsl(var(--donut-coral))]/20 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-[hsl(var(--donut-coral))]" />
        <h3 className="text-sm font-semibold text-foreground">Your Learning Insight</h3>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-3">{insight.summary}</p>

      {insight.strengths.length > 0 && (
        <div className="flex items-start gap-2 mb-2">
          <Star className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Strengths: </span>
            {insight.strengths.join(", ")}
          </p>
        </div>
      )}

      {insight.priorities.length > 0 && (
        <div className="flex items-start gap-2">
          <Target className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Focus: </span>
            {insight.priorities.join(", ")}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default InsightBanner;