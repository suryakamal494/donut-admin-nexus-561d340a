// Difficulty Analysis Component
// Shows performance breakdown by Easy / Medium / Hard difficulty levels

import { memo, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { EnhancedQuestionResult } from "@/data/student/testResultsGenerator";
import type { SectionResult } from "@/data/student/testResults";
import { getAccuracyColor, getQuestionStats } from "@/data/student/testResults";
interface DifficultyAnalysisProps {
  questions: EnhancedQuestionResult[];
  sections: SectionResult[];
}

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", color: "bg-emerald-500", lightBg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  medium: { label: "Medium", color: "bg-amber-500", lightBg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  hard: { label: "Hard", color: "bg-red-500", lightBg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
} as const;

type DifficultyKey = keyof typeof DIFFICULTY_CONFIG;

const getDifficultyStats = (qs: EnhancedQuestionResult[]) => getQuestionStats(qs);

const DifficultyAnalysis = memo(function DifficultyAnalysis({
  questions,
  sections,
}: DifficultyAnalysisProps) {
  const isMultiSection = sections.length > 1;
  const [expandedDifficulty, setExpandedDifficulty] = useState<DifficultyKey | null>(null);

  const difficultyData = useMemo(() => {
    return (["easy", "medium", "hard"] as DifficultyKey[]).map(level => {
      const qs = questions.filter(q => q.difficulty === level);
      const stats = getDifficultyStats(qs);
      const subjectBreakdown = isMultiSection
        ? sections.map(sec => {
            const secQs = qs.filter(q => q.sectionId === sec.id);
            return { subject: sec.name, ...getDifficultyStats(secQs) };
          }).filter(s => s.total > 0)
        : [];
      return { level, config: DIFFICULTY_CONFIG[level], ...stats, subjectBreakdown };
    });
  }, [questions, sections, isMultiSection]);

  return (
    <div className="space-y-3">
      {difficultyData.map((d) => (
        <div key={d.level}>
          <div
            className={cn(
              "p-3 rounded-lg border transition-colors",
              d.config.lightBg, d.config.border,
              isMultiSection && d.total > 0 && "cursor-pointer"
            )}
            onClick={() => {
              if (isMultiSection && d.total > 0) {
                setExpandedDifficulty(prev => prev === d.level ? null : d.level);
              }
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn("w-2.5 h-2.5 rounded-full", d.config.color)} />
                <span className={cn("text-sm font-semibold", d.config.text)}>{d.config.label}</span>
                <span className="text-xs text-muted-foreground">({d.total} Qs)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold", getAccuracyColor(d.accuracy))}>
                  {d.accuracy}%
                </span>
                {isMultiSection && d.total > 0 && (
                  expandedDifficulty === d.level ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: d.total > 0 ? `${(d.correct / d.total) * 100}%` : "0%" }}
                transition={{ duration: 0.6 }}
                className={cn("h-full rounded-full", d.config.color)}
              />
            </div>

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Correct: {d.correct}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                Wrong: {d.wrong}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                Skipped: {d.skipped}
              </span>
            </div>
          </div>

          <AnimatePresence>
            {isMultiSection && expandedDifficulty === d.level && d.subjectBreakdown.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="ml-4 mt-2 space-y-1.5 border-l-2 border-border pl-3">
                  {d.subjectBreakdown.map(sub => (
                    <div key={sub.subject} className="flex items-center justify-between text-xs py-1">
                      <span className="text-muted-foreground">{sub.subject}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-foreground">{sub.correct}/{sub.total}</span>
                        <span className={cn("font-semibold", getAccuracyColor(sub.accuracy))}>
                          {sub.accuracy}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
});

export default DifficultyAnalysis;
