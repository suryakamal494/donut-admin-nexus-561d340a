// Curriculum Color Configuration
// Maps curriculum names to design tokens for pills, badges, and chips

export interface CurriculumColorScheme {
  /** Active pill background */
  pillBg: string;
  /** Active pill text */
  pillText: string;
  /** Badge / chip background (light) */
  badgeBg: string;
  /** Badge / chip text */
  badgeText: string;
  /** Tailwind ring/border class */
  border: string;
}

const curriculumSchemes: Record<string, CurriculumColorScheme> = {
  cbse: {
    pillBg: "bg-blue-700",
    pillText: "text-white",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    border: "border-blue-200",
  },
  "jee mains": {
    pillBg: "bg-violet-600",
    pillText: "text-white",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    border: "border-violet-200",
  },
  "jee main": {
    pillBg: "bg-violet-600",
    pillText: "text-white",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    border: "border-violet-200",
  },
  foundation: {
    pillBg: "bg-emerald-700",
    pillText: "text-white",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    border: "border-emerald-200",
  },
  olympiad: {
    pillBg: "bg-amber-600",
    pillText: "text-white",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    border: "border-amber-200",
  },
  neet: {
    pillBg: "bg-teal-600",
    pillText: "text-white",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
    border: "border-teal-200",
  },
};

// Fallback for unknown curricula
const defaultScheme: CurriculumColorScheme = {
  pillBg: "bg-slate-600",
  pillText: "text-white",
  badgeBg: "bg-slate-100",
  badgeText: "text-slate-700",
  border: "border-slate-200",
};

export function getCurriculumColors(curriculum: string): CurriculumColorScheme {
  return curriculumSchemes[curriculum.toLowerCase()] || defaultScheme;
}
