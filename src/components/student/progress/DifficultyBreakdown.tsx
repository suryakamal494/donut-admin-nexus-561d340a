import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import type { DifficultyBreakdown as DifficultyBreakdownType } from "@/data/student/progressData";

interface DifficultyBreakdownProps {
  data: DifficultyBreakdownType[];
}

const levelConfig = {
  easy: { label: "Easy", color: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  medium: { label: "Medium", color: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  hard: { label: "Hard", color: "bg-red-500", bg: "bg-red-50", text: "text-red-700" },
};

const DifficultyBreakdown = ({ data }: DifficultyBreakdownProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Difficulty Performance</h3>
      </div>

      <div className="space-y-3">
        {data.map((d) => {
          const cfg = levelConfig[d.level];
          return (
            <div key={d.level}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
                  {cfg.label}
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{d.questionsAttempted} Qs</span>
                  <span className="font-bold text-foreground">{d.accuracy}%</span>
                </div>
              </div>
              <div className="h-2 bg-muted/15 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.accuracy}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${cfg.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground mt-3">
        Avg time: {Math.round(data.reduce((s, d) => s + d.avgTimePerQuestion, 0) / data.length)}s per question
      </p>
    </motion.div>
  );
};

export default DifficultyBreakdown;