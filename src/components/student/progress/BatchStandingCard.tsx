import { motion } from "framer-motion";
import { Users } from "lucide-react";
import type { StudentOverview } from "@/data/student/progressData";

interface BatchStandingCardProps {
  data: StudentOverview;
}

const BatchStandingCard = ({ data }: BatchStandingCardProps) => {
  // Position on 0-100 scale
  const studentPos = Math.min(100, Math.max(0, data.overallAccuracy));
  const avgPos = Math.min(100, Math.max(0, data.batchAverage));
  const topPos = Math.min(100, Math.max(0, data.topperAccuracy));

  const isAboveAvg = data.deltaFromAverage > 0;
  const statusColor = isAboveAvg ? "text-emerald-600" : "text-red-500";
  const statusBg = isAboveAvg ? "bg-emerald-50" : "bg-red-50";
  const statusLabel = data.percentile >= 90 ? "Top 10%" 
    : isAboveAvg ? "Above Average" 
    : Math.abs(data.deltaFromAverage) <= 5 ? "Near Average" 
    : "Below Average";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Batch Standing</h3>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBg} ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Visual Bar */}
      <div className="relative h-3 bg-muted/15 rounded-full mb-6 mt-2">
        {/* Avg marker */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-muted-foreground/40 z-10"
          style={{ left: `${avgPos}%` }}
        />
        <div
          className="absolute -top-5 text-[9px] text-muted-foreground font-medium whitespace-nowrap"
          style={{ left: `${avgPos}%`, transform: 'translateX(-50%)' }}
        >
          Avg {data.batchAverage}%
        </div>

        {/* Top marker */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-emerald-400 z-10"
          style={{ left: `${topPos}%` }}
        />
        <div
          className="absolute -bottom-5 text-[9px] text-emerald-600 font-medium whitespace-nowrap"
          style={{ left: `${topPos}%`, transform: 'translateX(-50%)' }}
        >
          Top {data.topperAccuracy}%
        </div>

        {/* Student marker */}
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${studentPos}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute -top-1 w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] border-2 border-white shadow-lg z-20"
          style={{ transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{data.overallAccuracy}%</p>
          <p className="text-[10px] text-muted-foreground">You</p>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${isAboveAvg ? 'text-emerald-600' : 'text-red-500'}`}>
            {isAboveAvg ? '+' : ''}{data.deltaFromAverage}%
          </p>
          <p className="text-[10px] text-muted-foreground">vs Average</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-muted-foreground">{data.deltaFromTop}%</p>
          <p className="text-[10px] text-muted-foreground">vs Top</p>
        </div>
      </div>
    </motion.div>
  );
};

export default BatchStandingCard;