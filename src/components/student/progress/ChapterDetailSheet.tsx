import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { ChapterMastery } from "@/data/student/progressData";

interface ChapterDetailSheetProps {
  chapter: ChapterMastery;
  onClose: () => void;
}

const statusColors = {
  strong: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  moderate: { bar: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  weak: { bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
};

const ChapterDetailSheet = ({ chapter, onClose }: ChapterDetailSheetProps) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />
      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto lg:max-w-lg lg:left-auto lg:right-4 lg:bottom-4 lg:rounded-2xl"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 lg:hidden">
          <div className="w-10 h-1 rounded-full bg-muted/30" />
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground">{chapter.chapterName}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted/10 flex items-center justify-center min-h-[44px] min-w-[44px]">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-muted/10 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold text-foreground">{chapter.avgSuccessRate}%</p>
              <p className="text-[10px] text-muted-foreground">Success Rate</p>
            </div>
            <div className="bg-muted/10 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold text-foreground">{chapter.questionsAttempted}</p>
              <p className="text-[10px] text-muted-foreground">Questions</p>
            </div>
            <div className="bg-muted/10 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold text-foreground">{chapter.examsAppeared}</p>
              <p className="text-[10px] text-muted-foreground">Exams</p>
            </div>
          </div>

          {/* Topics */}
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Topics</h4>
          <div className="space-y-2.5">
            {chapter.topics
              .sort((a, b) => a.accuracy - b.accuracy)
              .map((topic, i) => {
                const cfg = statusColors[topic.status];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-foreground truncate">{topic.topicName}</span>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-[10px] text-muted-foreground">{topic.questionsAsked} Qs</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
                            {topic.accuracy}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted/15 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${topic.accuracy}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChapterDetailSheet;