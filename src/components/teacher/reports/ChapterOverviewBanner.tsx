import { Badge } from "@/components/ui/badge";
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
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={cn(
      "rounded-xl p-4 sm:p-5 text-white shadow-lg",
      overallSuccessRate >= 75 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
      overallSuccessRate >= 50 ? "bg-gradient-to-r from-teal-500 to-cyan-500" :
      overallSuccessRate >= 35 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
      "bg-gradient-to-r from-red-500 to-rose-500"
    )}
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium text-white/70">{chapterName}</p>
      <Badge className="bg-white/20 text-white border-0 text-[10px]">
        {examsCovering} exam{examsCovering > 1 ? "s" : ""}
      </Badge>
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold mb-1">{overallSuccessRate}%</h2>
    <p className="text-xs text-white/70">Overall success rate · {totalQuestionsAsked} questions asked</p>
  </motion.div>
);
