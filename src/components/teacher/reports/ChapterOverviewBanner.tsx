import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChapterOverviewBannerProps {
  chapterName: string;
  overallSuccessRate: number;
  examsCovering: number;
  totalQuestionsAsked: number;
}

export const ChapterOverviewBanner = ({ chapterName, overallSuccessRate, examsCovering, totalQuestionsAsked }: ChapterOverviewBannerProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "rounded-xl p-3 sm:p-4 text-white shadow-lg",
      overallSuccessRate >= 75 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
      overallSuccessRate >= 50 ? "bg-gradient-to-r from-teal-500 to-cyan-500" :
      overallSuccessRate >= 35 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
      "bg-gradient-to-r from-red-500 to-rose-500"
    )}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">{overallSuccessRate}%</h2>
        <div>
          <p className="text-xs font-medium text-white/90">{chapterName}</p>
          <p className="text-[11px] text-white/60">{totalQuestionsAsked} questions · {examsCovering} exam{examsCovering > 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  </motion.div>
);
