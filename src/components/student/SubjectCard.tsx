// Student Subject Card - Glassmorphic design with progress
// Uses shared subject color/icon system for all 24 subjects
// Shows curriculum badges for multi-curriculum subjects

import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSubjectColors, getSubjectIcon } from "@/components/student/shared/subjectColors";
import { getCurriculumColors } from "@/components/student/shared/curriculumColors";
import type { StudentSubject } from "@/data/student/subjects";

// Status labels
const statusLabels: Record<string, { label: string; emoji: string }> = {
  "in-progress": { label: "In Progress", emoji: "📚" },
  "just-started": { label: "Just Started", emoji: "🌱" },
  "doing-well": { label: "Doing Well", emoji: "🔥" },
  "needs-attention": { label: "Needs Focus", emoji: "⚡" },
  "almost-done": { label: "Almost Done", emoji: "🎯" },
  "on-track": { label: "On Track", emoji: "✨" },
};

interface SubjectCardProps {
  subject: StudentSubject;
  compact?: boolean;
}

const StudentSubjectCard = memo(function StudentSubjectCard({ subject, compact = false }: SubjectCardProps) {
  const navigate = useNavigate();
  const Icon = getSubjectIcon(subject.icon);
  const colors = getSubjectColors(subject.color);
  const status = statusLabels[subject.status] || statusLabels["in-progress"];

  const handleClick = useCallback(() => {
    navigate(`/student/subjects/${subject.id}`);
  }, [navigate, subject.id]);

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] w-full text-left"
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
          colors.iconBg
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{subject.name}</p>
          <p className="text-xs text-muted-foreground">{subject.progress}% complete</p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-4 text-left group",
        colors.border
      )}
      style={{ borderWidth: '1px' }}
    >
      {/* Background glow */}
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity",
        colors.progressBg
      )} />

      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg mb-3",
        colors.iconBg
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Subject name */}
      <h3 className="font-bold text-foreground mb-1">{subject.name}</h3>

      {/* Status */}
      <p className="text-xs text-muted-foreground mb-3">
        {status.emoji} {status.label}
      </p>

      {/* Chapter count */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm font-medium text-muted-foreground">
          {subject.chaptersCompleted}/{subject.chaptersTotal} chapters
        </span>
      </div>

      {/* Curriculum badges — only for multi-curriculum subjects */}
      {subject.curricula && subject.curricula.length >= 1 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {subject.curricula.map((curriculum) => {
            const cColors = getCurriculumColors(curriculum);
            return (
              <span
                key={curriculum}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-medium",
                  cColors.badgeBg,
                  cColors.badgeText
                )}
              >
                {curriculum}
              </span>
            );
          })}
        </div>
      )}
    </button>
  );
});

export default StudentSubjectCard;
