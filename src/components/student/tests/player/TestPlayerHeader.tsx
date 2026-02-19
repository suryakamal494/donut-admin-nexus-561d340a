// Test Player Header Component
// Timer, subject tabs, and test info
// Mobile-first with compact layout and timer urgency animations

import { memo, useCallback } from "react";
import { X, Clock, Calculator, Maximize2, Minimize2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { TestSection } from "@/data/student/testQuestions";
import { formatTimeDisplay, getTimeUrgency, getSectionStats } from "@/data/student/testSession";
import type { TestSessionQuestion } from "@/data/student/testSession";

interface TestPlayerHeaderProps {
  testName: string;
  sections: TestSection[];
  currentSectionId: string;
  sessionQuestions: TestSessionQuestion[];
  remainingTime: number;
  totalDuration: number;
  showCalculator: boolean;
  isFullscreen: boolean;
  onSectionChange: (sectionId: string) => void;
  onToggleCalculator: () => void;
  onToggleFullscreen: () => void;
  onExit: () => void;
}

// Bold, visually distinct colors - always visible, not just on hover
const sectionColors: Record<string, { active: string; inactive: string; ring: string }> = {
  physics: {
    active: "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200/50",
    inactive: "bg-purple-500/90 text-white border-purple-500/80",
    ring: "ring-purple-400",
  },
  chemistry: {
    active: "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200/50",
    inactive: "bg-emerald-500/90 text-white border-emerald-500/80",
    ring: "ring-emerald-400",
  },
  mathematics: {
    active: "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200/50",
    inactive: "bg-blue-500/90 text-white border-blue-500/80",
    ring: "ring-blue-400",
  },
  biology: {
    active: "bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200/50",
    inactive: "bg-rose-500/90 text-white border-rose-500/80",
    ring: "ring-rose-400",
  },
  botany: {
    active: "bg-green-600 text-white border-green-600 shadow-lg shadow-green-200/50",
    inactive: "bg-green-500/90 text-white border-green-500/80",
    ring: "ring-green-400",
  },
  zoology: {
    active: "bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-200/50",
    inactive: "bg-pink-500/90 text-white border-pink-500/80",
    ring: "ring-pink-400",
  },
  english: {
    active: "bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-200/50",
    inactive: "bg-amber-500/90 text-white border-amber-500/80",
    ring: "ring-amber-400",
  },
  hindi: {
    active: "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-200/50",
    inactive: "bg-orange-500/90 text-white border-orange-500/80",
    ring: "ring-orange-400",
  },
};

const TestPlayerHeader = memo(function TestPlayerHeader({
  testName,
  sections,
  currentSectionId,
  sessionQuestions,
  remainingTime,
  totalDuration,
  showCalculator,
  isFullscreen,
  onSectionChange,
  onToggleCalculator,
  onToggleFullscreen,
  onExit,
}: TestPlayerHeaderProps) {
  const timeUrgency = getTimeUrgency(remainingTime, totalDuration * 60);

  const getColorClasses = useCallback((subject: string, isActive: boolean) => {
    const colors = sectionColors[subject.toLowerCase()] || sectionColors.physics;
    return {
      base: isActive ? colors.active : colors.inactive,
      ring: colors.ring,
    };
  }, []);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 safe-area-top">
      {/* Top Row: Timer + Actions - Compact on mobile */}
      <div className="flex items-center justify-between px-2 py-1.5 sm:px-4 sm:py-2">
        {/* Exit Button (Mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden text-muted-foreground hover:text-foreground"
          onClick={onExit}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Test Name (Desktop) */}
        <div className="hidden lg:block">
          <h1 className="font-semibold text-foreground text-sm truncate max-w-[200px]">
            {testName}
          </h1>
        </div>

        {/* Timer - Always Centered/Visible with urgency animations */}
        <motion.div
          animate={{
            scale: timeUrgency === "danger" ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: timeUrgency === "danger" ? Infinity : 0,
            repeatType: "reverse",
          }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm",
            "transition-colors duration-300",
            timeUrgency === "normal" && "bg-muted text-foreground",
            timeUrgency === "warning" && "bg-amber-100 text-amber-700 shadow-md shadow-amber-200/50",
            timeUrgency === "danger" && "bg-red-100 text-red-600 shadow-lg shadow-red-200/50"
          )}
        >
          {/* Animated clock icon */}
          <motion.div
            animate={{
              rotate: timeUrgency === "danger" ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              duration: 0.3,
              repeat: timeUrgency === "danger" ? Infinity : 0,
              repeatDelay: 0.7,
            }}
          >
            {timeUrgency === "danger" ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
          </motion.div>
          
          {/* Time display */}
          <span>{formatTimeDisplay(remainingTime)}</span>
          
          {/* Urgency indicator dot */}
          {timeUrgency !== "normal" && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "w-2 h-2 rounded-full",
                timeUrgency === "warning" && "bg-amber-500",
                timeUrgency === "danger" && "bg-red-500 animate-ping"
              )}
            />
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {showCalculator && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onToggleCalculator}
            >
              <Calculator className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex text-muted-foreground hover:text-foreground"
            onClick={onExit}
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Subject Tabs - Show unique subjects (group sections by subject) */}
      {sections.length > 1 && (
        <div className="relative">
          {/* Fade gradients to indicate more content */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none sm:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none sm:hidden" />
          
          <div className="flex gap-1.5 sm:gap-2 px-2 sm:px-4 pb-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory sm:justify-center">
            {(() => {
              // Deduplicate: show one tab per unique subject
              const seenSubjects = new Set<string>();
              const uniqueSubjectSections = sections.filter((section) => {
                if (seenSubjects.has(section.subject)) return false;
                seenSubjects.add(section.subject);
                return true;
              });

              return uniqueSubjectSections.map((section) => {
                // Check if current section belongs to this subject
                const currentSection = sections.find((s) => s.id === currentSectionId);
                const isActive = currentSection?.subject === section.subject;
                
                // Stats: sum all sections for this subject
                const subjectSections = sections.filter((s) => s.subject === section.subject);
                const subjectQuestions = subjectSections.flatMap((s) =>
                  sessionQuestions.filter((q) => q.sectionId === s.id)
                );
                const answered = subjectQuestions.filter(
                  (q) => q.status === "answered" || q.status === "answered_marked"
                ).length;
                const total = subjectQuestions.length;

                const colors = getColorClasses(section.subject, isActive);

                // On click, jump to first section of this subject
                const firstSectionOfSubject = subjectSections[0];

                return (
                  <motion.button
                    key={section.subject}
                    onClick={() => onSectionChange(firstSectionOfSubject.id)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium",
                      "transition-all duration-200 shrink-0 snap-start",
                      "min-h-[36px] min-w-[80px] justify-center",
                      colors.base,
                      isActive && `ring-2 ring-offset-1 ${colors.ring}`
                    )}
                  >
                    <span className="truncate max-w-[60px] sm:max-w-none capitalize">{section.subject}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                        isActive ? "bg-white/25" : "bg-white/20"
                      )}
                    >
                      {answered}/{total}
                    </span>
                  </motion.button>
                );
              });
            })()}
          </div>
        </div>
      )}
    </header>
  );
});

export default TestPlayerHeader;