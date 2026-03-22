// Curriculum Switcher — Segmented pill selector for multi-curriculum subjects
// Only rendered when curricula.length > 1

import { cn } from "@/lib/utils";
import { getCurriculumColors } from "@/components/student/shared/curriculumColors";

interface CurriculumSwitcherProps {
  curricula: string[];
  activeCurriculum: string;
  onSwitch: (curriculum: string) => void;
  /** Shown as a chip when curriculum was auto-selected due to pending work */
  autoSelectedReason?: string | null;
  className?: string;
}

const CurriculumSwitcher = ({
  curricula,
  activeCurriculum,
  onSwitch,
  autoSelectedReason,
  className,
}: CurriculumSwitcherProps) => {
  if (curricula.length <= 1) return null;

  const activeColors = getCurriculumColors(activeCurriculum);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Label */}
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
        Curriculum
      </span>

      {/* Pill container */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-[20px] bg-muted/50 border border-border/50">
        {curricula.map((curriculum) => {
          const isActive = curriculum === activeCurriculum;
          const colors = getCurriculumColors(curriculum);

          return (
            <button
              key={curriculum}
              onClick={() => onSwitch(curriculum)}
              className={cn(
                "px-3.5 py-1.5 rounded-2xl text-xs font-medium transition-all duration-200",
                isActive
                  ? cn(colors.pillBg, colors.pillText, "shadow-sm")
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {curriculum}
            </button>
          );
        })}
      </div>

      {/* Pending work chip — only on auto-selection */}
      {autoSelectedReason && (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-[10px] font-medium",
            activeColors.badgeBg,
            activeColors.badgeText
          )}
        >
          {autoSelectedReason}
        </span>
      )}
    </div>
  );
};

export default CurriculumSwitcher;
