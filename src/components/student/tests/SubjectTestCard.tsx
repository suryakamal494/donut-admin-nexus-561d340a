// Subject Test Card - Matches SubjectCard design aesthetic
// Clicking navigates to dedicated subject tests page

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Code,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentTest } from "@/data/student/tests";
import { getLiveTestsCount } from "@/data/student/tests";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Code,
  mathematics: Calculator, math: Calculator, physics: Atom,
  chemistry: FlaskConical, biology: Leaf, english: BookOpen, cs: Code,
};

// Color configurations matching SubjectCard
const colorConfig: Record<string, { gradient: string; shadow: string; bg: string; text: string }> = {
  blue: { gradient: "from-blue-400 to-blue-600", shadow: "shadow-blue-400/30", bg: "bg-blue-50", text: "text-blue-600" },
  purple: { gradient: "from-violet-400 to-purple-600", shadow: "shadow-violet-400/30", bg: "bg-violet-50", text: "text-violet-600" },
  green: { gradient: "from-emerald-400 to-green-600", shadow: "shadow-emerald-400/30", bg: "bg-emerald-50", text: "text-emerald-600" },
  red: { gradient: "from-rose-400 to-red-500", shadow: "shadow-rose-400/30", bg: "bg-rose-50", text: "text-rose-600" },
  amber: { gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-400/30", bg: "bg-amber-50", text: "text-amber-600" },
  cyan: { gradient: "from-cyan-400 to-teal-500", shadow: "shadow-cyan-400/30", bg: "bg-cyan-50", text: "text-cyan-600" },
};

const subjectColorMap: Record<string, string> = {
  physics: "purple", chemistry: "green", mathematics: "blue",
  math: "blue", biology: "red", english: "amber", cs: "cyan",
};

interface SubjectTestCardProps {
  subject: string;
  tests: StudentTest[];
}

const SubjectTestCard = memo(function SubjectTestCard({ subject, tests }: SubjectTestCardProps) {
  const navigate = useNavigate();
  const colorKey = subjectColorMap[subject.toLowerCase()] || "blue";
  const colors = colorConfig[colorKey];
  const Icon = iconMap[subject.toLowerCase()] || BookOpen;

  const liveCount = getLiveTestsCount(tests);
  const upcomingCount = tests.filter(t => t.status === "upcoming").length;
  const attemptedCount = tests.filter(t => t.status === "attempted").length;
  const totalCount = tests.length;

  const displayName = subject.charAt(0).toUpperCase() + subject.slice(1);

  return (
    <button
      onClick={() => navigate(`/student/tests/subject/${subject}`)}
      className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-4 text-left group w-full"
    >
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity", colors.bg)} />

      <div className="flex items-start gap-3">
        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0", colors.gradient, colors.shadow)}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground mb-0.5">{displayName}</h3>
          <p className="text-xs text-muted-foreground mb-2">
            {totalCount} {totalCount === 1 ? "test" : "tests"} available
          </p>

          <div className="flex flex-wrap gap-1.5">
            {liveCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-medium">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                {liveCount} live
              </span>
            )}
            {upcomingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-medium">
                {upcomingCount} upcoming
              </span>
            )}
            {attemptedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-medium">
                {attemptedCount} done
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0 mt-3" />
      </div>
    </button>
  );
});

export default SubjectTestCard;
