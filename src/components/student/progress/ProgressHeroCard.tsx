import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Award } from "lucide-react";
import type { StudentOverview } from "@/data/student/progressData";

interface ProgressHeroCardProps {
  data: StudentOverview;
}

const ProgressHeroCard = ({ data }: ProgressHeroCardProps) => {
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (data.performanceIndex / 100) * circumference;

  const TrendIcon = data.trend === "up" ? TrendingUp : data.trend === "down" ? TrendingDown : Minus;
  const trendColor = data.trend === "up" ? "text-emerald-500" : data.trend === "down" ? "text-red-500" : "text-amber-500";
  const trendLabel = data.trend === "up" ? "Improving" : data.trend === "down" ? "Declining" : "Steady";

  const piColor = data.performanceIndex >= 75 ? "#10B981" 
    : data.performanceIndex >= 50 ? "#3B82F6" 
    : data.performanceIndex >= 35 ? "#F59E0B" 
    : "#EF4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
    >
      <div className="flex items-start gap-4">
        {/* PI Gauge */}
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" stroke="hsl(var(--muted)/0.2)" strokeWidth="8" fill="none" />
            <motion.circle
              cx="60" cy="60" r="52"
              stroke={piColor}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{data.performanceIndex}</span>
            <span className="text-[10px] text-muted-foreground font-medium">PI Score</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 min-w-0 space-y-2.5 pt-1">
          <div>
            <p className="text-sm font-semibold text-foreground truncate">{data.studentName}</p>
            <p className="text-xs text-muted-foreground">{data.batchName}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/10 rounded-lg px-2.5 py-1.5">
              <p className="text-[10px] text-muted-foreground">Accuracy</p>
              <p className="text-sm font-bold text-foreground">{data.overallAccuracy}%</p>
            </div>
            <div className="bg-muted/10 rounded-lg px-2.5 py-1.5">
              <p className="text-[10px] text-muted-foreground">Consistency</p>
              <p className="text-sm font-bold text-foreground">{data.consistency}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Trend */}
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{trendLabel}</span>
            </div>
            {/* Rank pill */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[hsl(var(--donut-coral))]/10 to-[hsl(var(--donut-orange))]/10 rounded-full">
              <Award className="w-3 h-3 text-[hsl(var(--donut-coral))]" />
              <span className="text-[10px] font-semibold text-[hsl(var(--donut-coral))]">
                #{data.rank} of {data.totalStudents}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressHeroCard;