import { memo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ChevronRight, AlertCircle } from "lucide-react";
import type { ChapterMastery } from "@/data/student/progressData";

interface ChapterMasteryListProps {
  chapters: ChapterMastery[];
  onSelectChapter: (chapterId: string) => void;
}

const statusConfig = {
  strong: { color: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", label: "Strong" },
  moderate: { color: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", label: "Moderate" },
  weak: { color: "bg-red-500", bg: "bg-red-50", text: "text-red-700", label: "Weak" },
};

const INITIAL_SHOW = 8;

const ChapterMasteryList = memo(({ chapters, onSelectChapter }: ChapterMasteryListProps) => {
  const sorted = [...chapters].sort((a, b) => a.avgSuccessRate - b.avgSuccessRate);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? sorted : sorted.slice(0, INITIAL_SHOW);
  const hasMore = sorted.length > INITIAL_SHOW;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Chapter Mastery</h3>

      <div className="space-y-2">
        {visible.map((ch, i) => {
          const cfg = statusConfig[ch.status];
          const TrendIcon = ch.trend === "up" ? TrendingUp : ch.trend === "down" ? TrendingDown : Minus;
          const trendColor = ch.trend === "up" ? "text-emerald-500" : ch.trend === "down" ? "text-red-500" : "text-muted-foreground";
          const weakTopics = ch.topics.filter(t => t.status === "weak").length;

          return (
            <motion.button
              key={ch.chapterId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * Math.min(i, 8) }}
              onClick={() => onSelectChapter(ch.chapterId)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/10 transition-colors text-left min-h-[48px]"
            >
              {/* Status dot */}
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.color}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{ch.chapterName}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
                      {ch.avgSuccessRate}%
                    </span>
                    <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-muted/15 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ch.avgSuccessRate}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * i }}
                    className={`h-full rounded-full ${cfg.color}`}
                  />
                </div>

                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <span>{ch.topics.length} topics</span>
                  {weakTopics > 0 && (
                    <span className="flex items-center gap-0.5 text-red-500">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {weakTopics} weak
                    </span>
                  )}
                  <span>{ch.examsAppeared} exams</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </motion.button>
          );
        })}

        {hasMore && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="w-full text-center text-xs font-medium text-[hsl(var(--donut-coral))] hover:underline py-2 min-h-[44px]"
          >
            {showAll ? "Show less" : `Show all ${sorted.length} chapters`}
          </button>
        )}
      </div>
    </motion.div>
  );
});

ChapterMasteryList.displayName = "ChapterMasteryList";
export default ChapterMasteryList;