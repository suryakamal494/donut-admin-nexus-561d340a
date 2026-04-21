import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface SubjectBatchStandingProps {
  subjectName: string;
  accuracy: number;
  batchAverage: number;
  topperAccuracy: number;
  rank: number;
  totalStudents: number;
  percentile: number;
}

const SubjectBatchStanding = ({
  subjectName,
  accuracy,
  batchAverage,
  topperAccuracy,
  rank,
  totalStudents,
  percentile,
}: SubjectBatchStandingProps) => {
  const studentPos = Math.min(100, Math.max(0, accuracy));
  const avgPos = Math.min(100, Math.max(0, batchAverage));
  const topPos = Math.min(100, Math.max(0, topperAccuracy));
  const deltaFromAvg = accuracy - batchAverage;
  const deltaFromTop = accuracy - topperAccuracy;
  const isAboveAvg = deltaFromAvg > 0;

  const statusLabel =
    percentile >= 90
      ? "Top 10%"
      : isAboveAvg
      ? "Above Average"
      : Math.abs(deltaFromAvg) <= 5
      ? "Near Average"
      : "Below Average";

  const statusColor = isAboveAvg ? "text-emerald-600" : "text-red-500";
  const statusBg = isAboveAvg ? "bg-emerald-50" : "bg-red-50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">
            In {subjectName}
          </h3>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBg} ${statusColor}`}
        >
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
          style={{ left: `${avgPos}%`, transform: "translateX(-50%)" }}
        >
          Avg {batchAverage}%
        </div>

        {/* Top marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-emerald-400 z-10"
          style={{ left: `${topPos}%` }}
        />
        <div
          className="absolute -bottom-5 text-[9px] text-emerald-600 font-medium whitespace-nowrap"
          style={{ left: `${topPos}%`, transform: "translateX(-50%)" }}
        >
          Top {topperAccuracy}%
        </div>

        {/* Student marker */}
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${studentPos}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute -top-1 w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] border-2 border-white shadow-lg z-20"
          style={{ transform: "translateX(-50%)" }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center">
          <p className="text-base font-bold text-foreground">
            #{rank}
            <span className="text-xs font-normal text-muted-foreground">
              /{totalStudents}
            </span>
          </p>
          <p className="text-[10px] text-muted-foreground">Rank</p>
        </div>
        <div className="text-center">
          <p
            className={`text-base font-bold ${
              isAboveAvg ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {isAboveAvg ? "+" : ""}
            {deltaFromAvg}%
          </p>
          <p className="text-[10px] text-muted-foreground">vs Avg</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-muted-foreground">
            {deltaFromTop}%
          </p>
          <p className="text-[10px] text-muted-foreground">vs Top</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectBatchStanding;