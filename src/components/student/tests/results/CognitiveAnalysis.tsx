// Cognitive Analysis Component
// Shows performance breakdown by cognitive type (Logical, Analytical, etc.)

import { memo, useMemo, useState } from "react";
import { Brain, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { EnhancedQuestionResult, CognitiveType } from "@/data/student/testResultsGenerator";
import type { SectionResult } from "@/data/student/testResults";

interface CognitiveAnalysisProps {
  questions: EnhancedQuestionResult[];
  sections: SectionResult[];
}

const COGNITIVE_COLORS: Record<CognitiveType, { bg: string; text: string; light: string }> = {
  Logical: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-100" },
  Analytical: { bg: "bg-violet-500", text: "text-violet-600", light: "bg-violet-100" },
  Conceptual: { bg: "bg-teal-500", text: "text-teal-600", light: "bg-teal-100" },
  Numerical: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-100" },
  Application: { bg: "bg-indigo-500", text: "text-indigo-600", light: "bg-indigo-100" },
  Memory: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-100" },
};

const CognitiveAnalysis = memo(function CognitiveAnalysis({
  questions,
  sections,
}: CognitiveAnalysisProps) {
  const isMultiSection = sections.length > 1;
  const [showSubjects, setShowSubjects] = useState(false);

  const cognitiveData = useMemo(() => {
    const types = Object.keys(COGNITIVE_COLORS) as CognitiveType[];
    return types.map(type => {
      const qs = questions.filter(q => q.cognitiveType === type);
      const total = qs.length;
      const attempted = qs.filter(q => q.isAttempted).length;
      const correct = qs.filter(q => q.isCorrect).length;
      const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

      // Subject-wise breakdown
      const subjectBreakdown = isMultiSection
        ? sections.map(sec => {
            const secQs = qs.filter(q => q.sectionId === sec.id);
            const secAttempted = secQs.filter(q => q.isAttempted).length;
            const secCorrect = secQs.filter(q => q.isCorrect).length;
            return {
              subject: sec.name,
              total: secQs.length,
              correct: secCorrect,
              accuracy: secAttempted > 0 ? Math.round((secCorrect / secAttempted) * 100) : 0,
            };
          }).filter(s => s.total > 0)
        : [];

      return { type, total, attempted, correct, accuracy, subjectBreakdown, colors: COGNITIVE_COLORS[type] };
    }).filter(d => d.total > 0);
  }, [questions, sections, isMultiSection]);

  // Find strongest and weakest
  const strongest = useMemo(() => {
    if (cognitiveData.length === 0) return null;
    return cognitiveData.reduce((best, d) => d.accuracy > best.accuracy ? d : best);
  }, [cognitiveData]);

  const weakest = useMemo(() => {
    if (cognitiveData.length === 0) return null;
    return cognitiveData.reduce((worst, d) => d.accuracy < worst.accuracy ? d : worst);
  }, [cognitiveData]);

  const maxAccuracy = Math.max(...cognitiveData.map(d => d.accuracy), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span />
        {isMultiSection && (
          <button
            onClick={() => setShowSubjects(prev => !prev)}
            className="text-xs text-primary font-medium flex items-center gap-1"
          >
            {showSubjects ? "Hide" : "Show"} Subjects
            {showSubjects ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Strongest / Weakest badges */}
      {strongest && weakest && strongest.type !== weakest.type && strongest.total >= 3 && weakest.total >= 3 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
            <TrendingUp className="w-3 h-3" />
            Strongest: {strongest.type} ({strongest.accuracy}% on {strongest.total} Qs)
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200">
            <TrendingDown className="w-3 h-3" />
            Weakest: {weakest.type} ({weakest.accuracy}% on {weakest.total} Qs)
          </span>
        </div>
      )}

      {/* Horizontal bar chart */}
      <div className="space-y-3">
        {cognitiveData.map((d, idx) => (
          <div key={d.type}>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", d.colors.light, d.colors.text)}>
                {d.type}
              </span>
              <span className="text-[10px] text-muted-foreground ml-auto">
                {d.correct}/{d.total} correct
              </span>
              <span className={cn(
                "text-xs font-bold",
                d.accuracy >= 70 ? "text-emerald-600" : d.accuracy >= 40 ? "text-amber-600" : "text-red-600"
              )}>
                {d.accuracy}%
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.accuracy / 100) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.08 * idx }}
                className={cn("h-full rounded-full", d.colors.bg)}
              />
            </div>

            {/* Subject breakdown toggle */}
            <AnimatePresence>
              {showSubjects && isMultiSection && d.subjectBreakdown.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-3 mt-1.5 space-y-1 border-l-2 border-border pl-3">
                    {d.subjectBreakdown.map(sub => (
                      <div key={sub.subject} className="flex items-center justify-between text-[10px] py-0.5">
                        <span className="text-muted-foreground">{sub.subject}</span>
                        <span className={cn(
                          "font-semibold",
                          sub.accuracy >= 70 ? "text-emerald-600" : sub.accuracy >= 40 ? "text-amber-600" : "text-red-600"
                        )}>
                          {sub.correct}/{sub.total} ({sub.accuracy}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CognitiveAnalysis;
