// Question Palette Component
// Mobile: Bottom sheet | Desktop: Sidebar panel
// Shows all questions with wrap grid layout - NO scrollbars

import { memo, useMemo } from "react";
import { CheckCircle2, Circle, Flag, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TestSection } from "@/data/student/testQuestions";
import type { TestSessionQuestion } from "@/data/student/testSession";
import { getQuestionsBySection, getSectionStats } from "@/data/student/testSession";

interface QuestionPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  sections: TestSection[];
  sessionQuestions: TestSessionQuestion[];
  currentQuestionIndex: number;
  currentSectionId: string;
  onQuestionSelect: (index: number) => void;
  onSectionChange: (sectionId: string) => void;
}

const statusStyles = {
  not_visited: {
    bg: "bg-slate-200",
    border: "border-slate-300",
    text: "text-slate-600",
  },
  not_answered: {
    bg: "bg-red-100",
    border: "border-red-400",
    text: "text-red-700",
  },
  answered: {
    bg: "bg-emerald-500",
    border: "border-emerald-600",
    text: "text-white",
  },
  marked_review: {
    bg: "bg-purple-500",
    border: "border-purple-600",
    text: "text-white",
  },
  answered_marked: {
    bg: "bg-purple-500",
    border: "border-purple-600",
    text: "text-white",
  },
};

// Section tab colors matching header
const sectionTabColors: Record<string, { active: string; inactive: string }> = {
  physics: {
    active: "bg-purple-600 text-white",
    inactive: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  },
  chemistry: {
    active: "bg-emerald-600 text-white",
    inactive: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  },
  mathematics: {
    active: "bg-blue-600 text-white",
    inactive: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  biology: {
    active: "bg-rose-600 text-white",
    inactive: "bg-rose-100 text-rose-700 hover:bg-rose-200",
  },
  english: {
    active: "bg-amber-600 text-white",
    inactive: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  },
};

// Compact Legend Item
const LegendItem = memo(function LegendItem({
  icon: Icon,
  label,
  count,
  bgClass,
  textClass,
}: {
  icon: typeof Circle;
  label: string;
  count: number;
  bgClass: string;
  textClass: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
      <span className={cn("w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center", bgClass)}>
        <Icon className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5", textClass)} />
      </span>
      <span className="text-muted-foreground hidden sm:inline">{label}</span>
      <motion.span 
        key={count}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className="font-bold text-foreground"
      >
        {count}
      </motion.span>
    </div>
  );
});

// Question Grid with wrap layout - no internal scroll
// Supports section grouping when sections have sub-sections within a subject
const PaletteGrid = memo(function PaletteGrid({
  questions,
  currentQuestionIndex,
  allQuestions,
  onQuestionSelect,
  sections,
  currentSectionId,
}: {
  questions: TestSessionQuestion[];
  currentQuestionIndex: number;
  allQuestions: TestSessionQuestion[];
  onQuestionSelect: (index: number) => void;
  sections?: TestSection[];
  currentSectionId?: string;
}) {
  // Check if subject has sub-sections (multiple sections for same subject)
  const currentSubject = sections?.find((s) => s.id === currentSectionId)?.subject;
  const subjectSections = sections?.filter((s) => s.subject === currentSubject);
  const hasSubSections = subjectSections && subjectSections.length > 1;

  if (hasSubSections && subjectSections) {
    // Grouped by section
    return (
      <div className="space-y-3">
        {subjectSections.map((section) => {
          const sectionQuestions = questions.filter((q) => q.sectionId === section.id);
          if (sectionQuestions.length === 0) return null;

          return (
            <div key={section.id}>
              <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                {section.name} ({sectionQuestions.filter((q) => q.status === "answered" || q.status === "answered_marked").length}/{sectionQuestions.length})
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {sectionQuestions.map((q) => (
                  <PaletteButton
                    key={q.id}
                    q={q}
                    globalIndex={allQuestions.findIndex((aq) => aq.id === q.id)}
                    isCurrent={allQuestions.findIndex((aq) => aq.id === q.id) === currentQuestionIndex}
                    onQuestionSelect={onQuestionSelect}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Flat grid (no sub-sections)
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {questions.map((q) => {
        const globalIndex = allQuestions.findIndex((aq) => aq.id === q.id);
        return (
          <PaletteButton
            key={q.id}
            q={q}
            globalIndex={globalIndex}
            isCurrent={globalIndex === currentQuestionIndex}
            onQuestionSelect={onQuestionSelect}
          />
        );
      })}
    </div>
  );
});

// Individual palette button
const PaletteButton = memo(function PaletteButton({
  q,
  globalIndex,
  isCurrent,
  onQuestionSelect,
}: {
  q: TestSessionQuestion;
  globalIndex: number;
  isCurrent: boolean;
  onQuestionSelect: (index: number) => void;
}) {
  const style = statusStyles[q.status];
  const isAnswered = q.status === "answered" || q.status === "answered_marked";
  const isMarked = q.status === "marked_review" || q.status === "answered_marked";

  return (
    <motion.button
      onClick={() => onQuestionSelect(globalIndex)}
      initial={false}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm",
        "border-2 transition-all duration-200",
        style.bg,
        style.border,
        style.text,
        isCurrent && "ring-2 ring-primary ring-offset-1 scale-110 z-10 shadow-lg"
      )}
    >
      {q.questionNumber}
      
      {/* Answered checkmark indicator */}
      {isAnswered && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 flex items-center justify-center border border-white"
        >
          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
        </motion.span>
      )}
      
      {/* Marked flag indicator */}
      {isMarked && !isAnswered && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-600 flex items-center justify-center border border-white"
        >
          <Flag className="w-2 h-2 text-white" />
        </motion.span>
      )}
    </motion.button>
  );
});

const QuestionPalette = memo(function QuestionPalette({
  isOpen,
  onClose,
  sections,
  sessionQuestions,
  currentQuestionIndex,
  currentSectionId,
  onQuestionSelect,
  onSectionChange,
}: QuestionPaletteProps) {
  // Calculate stats for all sections
  const overallStats = useMemo(() => {
    return {
      answered: sessionQuestions.filter(
        (q) => q.status === "answered" || q.status === "answered_marked"
      ).length,
      notAnswered: sessionQuestions.filter((q) => q.status === "not_answered").length,
      marked: sessionQuestions.filter(
        (q) => q.status === "marked_review" || q.status === "answered_marked"
      ).length,
      notVisited: sessionQuestions.filter((q) => q.status === "not_visited").length,
    };
  }, [sessionQuestions]);

  // Get questions for the current subject (not just current section — show all for subject)
  const currentSectionQuestions = useMemo(() => {
    // Find the subject of the current section
    const currentSection = sections.find((s) => s.id === currentSectionId);
    if (!currentSection) return getQuestionsBySection(sessionQuestions, currentSectionId);
    
    // Get all sections for this subject
    const subjectSections = sections.filter((s) => s.subject === currentSection.subject);
    if (subjectSections.length <= 1) {
      return getQuestionsBySection(sessionQuestions, currentSectionId);
    }
    
    // Return all questions for all sections in this subject
    const subjectSectionIds = new Set(subjectSections.map((s) => s.id));
    return sessionQuestions.filter((q) => subjectSectionIds.has(q.sectionId));
  }, [sessionQuestions, currentSectionId, sections]);

  const handleQuestionClick = (index: number) => {
    onQuestionSelect(index);
    onClose();
  };

  const getSectionTabColors = (subject: string, isActive: boolean) => {
    const colors = sectionTabColors[subject.toLowerCase()] || sectionTabColors.physics;
    return isActive ? colors.active : colors.inactive;
  };

  const PaletteContent = (
    <div className="flex flex-col h-full">
      {/* Subject Pills - Colored, grouped by unique subjects */}
      {sections.length > 1 && (
        <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-border bg-muted/30">
          {(() => {
            const seenSubjects = new Set<string>();
            const uniqueSubjectSections = sections.filter((s) => {
              if (seenSubjects.has(s.subject)) return false;
              seenSubjects.add(s.subject);
              return true;
            });

            return uniqueSubjectSections.map((section) => {
              const currentSection = sections.find((s) => s.id === currentSectionId);
              const isActive = currentSection?.subject === section.subject;
              
              // Sum stats across all sections for this subject
              const subjectSections = sections.filter((s) => s.subject === section.subject);
              const subjectQuestions = subjectSections.flatMap((s) =>
                sessionQuestions.filter((q) => q.sectionId === s.id)
              );
              const answered = subjectQuestions.filter(
                (q) => q.status === "answered" || q.status === "answered_marked"
              ).length;
              const total = subjectQuestions.length;

              const firstSectionOfSubject = subjectSections[0];

              return (
                <button
                  key={section.subject}
                  onClick={() => onSectionChange(firstSectionOfSubject.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
                    "transition-all duration-200",
                    getSectionTabColors(section.subject, isActive)
                  )}
                >
                  <span className="truncate max-w-[50px] sm:max-w-none capitalize">{section.subject}</span>
                  <span
                    className={cn(
                      "px-1 py-0.5 rounded text-[9px] font-bold",
                      isActive ? "bg-white/25" : "bg-current/10"
                    )}
                  >
                    {answered}/{total}
                  </span>
                </button>
              );
            });
          })()}
        </div>
      )}

      {/* Legend - Compact inline */}
      <div className="px-3 py-2 border-b border-border bg-white">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <LegendItem
            icon={CheckCircle2}
            label="Answered"
            count={overallStats.answered}
            bgClass="bg-emerald-500"
            textClass="text-white"
          />
          <LegendItem
            icon={Circle}
            label="Unanswered"
            count={overallStats.notAnswered}
            bgClass="bg-red-100"
            textClass="text-red-600"
          />
          <LegendItem
            icon={Flag}
            label="Marked"
            count={overallStats.marked}
            bgClass="bg-purple-500"
            textClass="text-white"
          />
          <LegendItem
            icon={HelpCircle}
            label="Not Visited"
            count={overallStats.notVisited}
            bgClass="bg-slate-200"
            textClass="text-slate-500"
          />
        </div>
      </div>

      {/* Question Grid - scrollable area without visible scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
        <PaletteGrid
          questions={currentSectionQuestions}
          currentQuestionIndex={currentQuestionIndex}
          allQuestions={sessionQuestions}
          onQuestionSelect={handleQuestionClick}
          sections={sections}
          currentSectionId={currentSectionId}
        />
      </div>
    </div>
  );

  // Mobile: Bottom Sheet
  return (
    <>
      {/* Mobile Sheet */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl p-0 lg:hidden">
          <SheetHeader className="px-3 py-2 border-b border-border">
            <SheetTitle className="text-sm font-semibold">Question Palette</SheetTitle>
          </SheetHeader>
          {PaletteContent}
        </SheetContent>
      </Sheet>

      {/* Desktop: Sidebar (always visible) */}
      <aside
        className={cn(
          "hidden lg:flex flex-col w-64 border-l border-border bg-white",
          "h-full overflow-hidden"
        )}
      >
        <div className="px-3 py-2 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-foreground text-sm">Question Palette</h3>
        </div>
        {PaletteContent}
      </aside>
    </>
  );
});

export default QuestionPalette;