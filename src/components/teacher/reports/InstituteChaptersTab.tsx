import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/reportColors";
import { motion, AnimatePresence } from "framer-motion";
import type { InstituteQuestionAnalysis, InstituteChapterSummary } from "@/data/teacher/instituteTestDetailData";

const difficultyColors: Record<string, string> = {
  easy: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  hard: "text-red-600 dark:text-red-400",
};

const statusBadge = (status: "strong" | "moderate" | "weak") => {
  const colors = getStatusColor(status);
  return <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-medium", colors.badge)}>{status}</Badge>;
};

interface InstituteChaptersTabProps {
  chapterSummary: InstituteChapterSummary[];
  questionsByChapter: Map<string, InstituteQuestionAnalysis[]>;
  expandedChapters: Set<string>;
  onToggleChapter: (ch: string) => void;
}

export const InstituteChaptersTab = ({ chapterSummary, questionsByChapter, expandedChapters, onToggleChapter }: InstituteChaptersTabProps) => (
  <div className="space-y-3">
    {chapterSummary.map((ch, i) => {
      const isOpen = expandedChapters.has(ch.chapter);
      const chQuestions = questionsByChapter.get(ch.chapter) || [];
      const chStatus: "strong" | "moderate" | "weak" = ch.avgCorrectRate >= 60 ? "strong" : ch.avgCorrectRate >= 35 ? "moderate" : "weak";
      return (
        <motion.div key={ch.chapter} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.04 }}>
          <Card className="card-premium overflow-hidden">
            <button className="w-full p-3.5 sm:p-4 flex items-center gap-3 text-left" onClick={() => onToggleChapter(ch.chapter)}>
              <div className={cn("shrink-0 w-11 h-11 rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm", getStatusColor(chStatus).bg)}>
                {ch.avgCorrectRate}%
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">{ch.chapter}</h3>
                  {statusBadge(chStatus)}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {ch.totalQuestions} Q · {ch.strongCount} strong · {ch.weakCount} weak
                </div>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-3.5 pb-3.5 space-y-2 border-t border-border/50 pt-2">
                    {chQuestions.map(q => (
                      <div key={q.questionId} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0", getStatusColor(q.status).bg)}>
                          {q.questionNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-foreground">{q.topic}</span>
                          <div className="text-[10px] text-muted-foreground">
                            <span className={difficultyColors[q.difficulty]}>{q.difficulty}</span> · {q.correctPercentage}% correct · {q.attemptPercentage}% attempted
                          </div>
                        </div>
                        {statusBadge(q.status)}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      );
    })}
  </div>
);
