// Section Navigation Component
// Sub-navigation bar for sections within a subject (e.g., JEE Advanced)
// Horizontally scrollable on mobile, inline on desktop
// Mobile-first with 44px+ touch targets

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { TestSection } from "@/data/student/testQuestions";
import type { TestSessionQuestion } from "@/data/student/testSession";
import { getSectionStats } from "@/data/student/testSession";

interface SectionNavigationProps {
  sections: TestSection[];
  currentSectionId: string;
  sessionQuestions: TestSessionQuestion[];
  currentSubject: string;
  onSectionChange: (sectionId: string) => void;
}

const sectionTypeIcons: Record<string, string> = {
  "Single Correct": "①",
  "Multiple Correct": "②",
  "Numerical": "③",
  "Paragraph": "④",
};

const SectionNavigation = memo(function SectionNavigation({
  sections,
  currentSectionId,
  sessionQuestions,
  currentSubject,
  onSectionChange,
}: SectionNavigationProps) {
  // Filter sections for the current subject only
  const subjectSections = useMemo(
    () => sections.filter((s) => s.subject === currentSubject),
    [sections, currentSubject]
  );

  // Don't render if subject has only 1 section (no section navigation needed)
  if (subjectSections.length <= 1) return null;

  return (
    <div className="bg-muted/30 border-b border-border">
      {/* Section instruction banner for current section */}
      {(() => {
        const currentSection = sections.find((s) => s.id === currentSectionId);
        if (!currentSection?.instructions) return null;
        return (
          <div className="px-3 py-1.5 text-[11px] sm:text-xs text-muted-foreground bg-amber-50/80 border-b border-amber-100 leading-relaxed">
            <span className="font-semibold text-amber-700">Section Instructions: </span>
            {currentSection.instructions}
          </div>
        );
      })()}

      {/* Section tabs */}
      <div className="relative">
        {/* Fade edges on mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none sm:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none sm:hidden" />

        <div className="flex gap-1 px-2 py-1.5 sm:px-4 sm:py-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory sm:justify-center">
          {subjectSections.map((section, idx) => {
            const isActive = section.id === currentSectionId;
            const stats = getSectionStats(sessionQuestions, section.id);
            const icon = sectionTypeIcons[section.name] || `${idx + 1}`;

            return (
              <motion.button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-medium",
                  "transition-all duration-200 shrink-0 snap-start",
                  "min-h-[34px] min-w-[70px] justify-center",
                  "border",
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-md"
                    : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="text-[10px] sm:text-xs opacity-70">{icon}</span>
                <span className="truncate max-w-[55px] sm:max-w-none">{section.name}</span>
                <span
                  className={cn(
                    "px-1 py-0.5 rounded text-[9px] font-bold",
                    isActive ? "bg-background/20" : "bg-muted"
                  )}
                >
                  {stats.answered}/{stats.total}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default SectionNavigation;
