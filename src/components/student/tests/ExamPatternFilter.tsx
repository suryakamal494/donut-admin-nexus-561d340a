// Exam Pattern Filter Component
// Horizontal scrollable filter pills for exam patterns
// Mobile-first with touch-friendly interaction

import { memo } from "react";
import { Target, Zap, Heart, Settings, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExamPattern } from "@/data/student/tests";

interface ExamPatternFilterProps {
  selectedPattern: ExamPattern | "all";
  onPatternChange: (pattern: ExamPattern | "all") => void;
  className?: string;
}

const patterns: { id: ExamPattern | "all"; label: string; shortLabel: string; icon: typeof Target }[] = [
  { id: "all", label: "All Tests", shortLabel: "All", icon: Settings },
  { id: "jee_main", label: "JEE Main", shortLabel: "Main", icon: Target },
  { id: "jee_advanced", label: "JEE Advanced", shortLabel: "Adv", icon: Zap },
  { id: "neet", label: "NEET", shortLabel: "NEET", icon: Heart },
  { id: "cbse", label: "CBSE Board", shortLabel: "CBSE", icon: GraduationCap },
];

const patternColors: Record<ExamPattern | "all", { active: string; inactive: string }> = {
  all: {
    active: "bg-foreground text-background",
    inactive: "bg-muted text-muted-foreground hover:bg-muted/80",
  },
  jee_main: {
    active: "bg-blue-500 text-white",
    inactive: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  jee_advanced: {
    active: "bg-purple-500 text-white",
    inactive: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  },
  neet: {
    active: "bg-emerald-500 text-white",
    inactive: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
  },
  cbse: {
    active: "bg-orange-500 text-white",
    inactive: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
  custom: {
    active: "bg-amber-500 text-white",
    inactive: "bg-amber-50 text-amber-600 hover:bg-amber-100",
  },
};

const ExamPatternFilter = memo(function ExamPatternFilter({
  selectedPattern,
  onPatternChange,
  className,
}: ExamPatternFilterProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide",
        className
      )}
    >
      {patterns.map((pattern) => {
        const isActive = selectedPattern === pattern.id;
        const colors = patternColors[pattern.id];
        const Icon = pattern.icon;

        return (
          <button
            key={pattern.id}
            onClick={() => onPatternChange(pattern.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "text-xs sm:text-sm font-medium whitespace-nowrap",
              "transition-all duration-200 shrink-0",
              isActive ? colors.active : colors.inactive
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{pattern.label}</span>
            <span className="sm:hidden">{pattern.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
});

export default ExamPatternFilter;
