// Subject Test Card - Matches SubjectCard design aesthetic
// Clicking navigates to dedicated subject tests page
// Shows curriculum badges for multi-curriculum subjects

import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjectDisplayName } from "@/data/student/tests";
import { getCurriculumColors } from "@/components/student/shared/curriculumColors";
import { studentSubjects } from "@/data/student/subjects";
import {
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Code,
  Languages, ScrollText, Globe, Landmark, Mountain, Scale,
  TrendingUp, Microscope, Bug, Sprout, TreePine, Palette,
  Dumbbell, Receipt, Briefcase, BrainCircuit, Database, Home,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentTest } from "@/data/student/tests";
import { getLiveTestsCount } from "@/data/student/tests";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Code,
  Languages, ScrollText, Globe, Landmark, Mountain, Scale,
  TrendingUp, Microscope, Bug, Sprout, TreePine, Palette,
  Dumbbell, Receipt, Briefcase, BrainCircuit, Database, Home,
  mathematics: Calculator, math: Calculator, physics: Atom,
  chemistry: FlaskConical, biology: Leaf, english: BookOpen, cs: Code,
  hindi: Languages, sanskrit: ScrollText, "social-science": Globe,
  history: Landmark, geography: Mountain, civics: Scale,
  economics: TrendingUp, science: Microscope, zoology: Bug,
  botany: Sprout, evs: TreePine, art: Palette, pe: Dumbbell,
  accountancy: Receipt, business: Briefcase, ai: BrainCircuit,
  informatics: Database, "home-science": Home,
};

// Color configurations matching SubjectCard
const colorConfig: Record<string, { gradient: string; shadow: string; bg: string; text: string }> = {
  blue: { gradient: "from-blue-400 to-blue-600", shadow: "shadow-blue-400/30", bg: "bg-blue-50", text: "text-blue-600" },
  purple: { gradient: "from-violet-400 to-purple-600", shadow: "shadow-violet-400/30", bg: "bg-violet-50", text: "text-violet-600" },
  green: { gradient: "from-emerald-400 to-green-600", shadow: "shadow-emerald-400/30", bg: "bg-emerald-50", text: "text-emerald-600" },
  red: { gradient: "from-rose-400 to-red-500", shadow: "shadow-rose-400/30", bg: "bg-rose-50", text: "text-rose-600" },
  amber: { gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-400/30", bg: "bg-amber-50", text: "text-amber-600" },
  cyan: { gradient: "from-cyan-400 to-teal-500", shadow: "shadow-cyan-400/30", bg: "bg-cyan-50", text: "text-cyan-600" },
  orange: { gradient: "from-orange-400 to-orange-600", shadow: "shadow-orange-400/30", bg: "bg-orange-50", text: "text-orange-600" },
  indigo: { gradient: "from-indigo-400 to-indigo-600", shadow: "shadow-indigo-400/30", bg: "bg-indigo-50", text: "text-indigo-600" },
  slate: { gradient: "from-slate-400 to-slate-600", shadow: "shadow-slate-400/30", bg: "bg-slate-50", text: "text-slate-600" },
  brown: { gradient: "from-yellow-600 to-amber-700", shadow: "shadow-yellow-600/30", bg: "bg-yellow-50", text: "text-yellow-700" },
  sky: { gradient: "from-sky-400 to-sky-600", shadow: "shadow-sky-400/30", bg: "bg-sky-50", text: "text-sky-600" },
  lime: { gradient: "from-lime-400 to-lime-600", shadow: "shadow-lime-400/30", bg: "bg-lime-50", text: "text-lime-600" },
  pink: { gradient: "from-pink-400 to-pink-600", shadow: "shadow-pink-400/30", bg: "bg-pink-50", text: "text-pink-600" },
  fuchsia: { gradient: "from-fuchsia-400 to-fuchsia-600", shadow: "shadow-fuchsia-400/30", bg: "bg-fuchsia-50", text: "text-fuchsia-600" },
  stone: { gradient: "from-stone-400 to-stone-600", shadow: "shadow-stone-400/30", bg: "bg-stone-50", text: "text-stone-600" },
  zinc: { gradient: "from-zinc-400 to-zinc-600", shadow: "shadow-zinc-400/30", bg: "bg-zinc-50", text: "text-zinc-600" },
  emerald: { gradient: "from-emerald-400 to-emerald-600", shadow: "shadow-emerald-400/30", bg: "bg-emerald-50", text: "text-emerald-600" },
  rose: { gradient: "from-rose-400 to-rose-600", shadow: "shadow-rose-400/30", bg: "bg-rose-50", text: "text-rose-600" },
  violet: { gradient: "from-violet-400 to-violet-600", shadow: "shadow-violet-400/30", bg: "bg-violet-50", text: "text-violet-600" },
  teal: { gradient: "from-teal-400 to-teal-600", shadow: "shadow-teal-400/30", bg: "bg-teal-50", text: "text-teal-600" },
};

const subjectColorMap: Record<string, string> = {
  physics: "purple", chemistry: "green", mathematics: "blue",
  math: "blue", biology: "red", english: "amber", cs: "cyan",
  hindi: "orange", sanskrit: "indigo", "social-science": "slate",
  history: "brown", geography: "teal", civics: "sky",
  economics: "emerald", science: "lime", zoology: "pink",
  botany: "emerald", evs: "teal", art: "fuchsia", pe: "orange",
  accountancy: "stone", business: "zinc", ai: "violet",
  informatics: "sky", "home-science": "rose",
};

interface SubjectTestCardProps {
  subject: string;
  tests: StudentTest[];
}

const SubjectTestCard = memo(function SubjectTestCard({ subject, tests }: SubjectTestCardProps) {
  const navigate = useNavigate();
  const colorKey = subjectColorMap[subject.toLowerCase()] || "blue";
  const colors = colorConfig[colorKey] || colorConfig.blue;
  const Icon = iconMap[subject.toLowerCase()] || BookOpen;

  const liveCount = getLiveTestsCount(tests);
  const upcomingCount = tests.filter(t => t.status === "upcoming").length;
  const attemptedCount = tests.filter(t => t.status === "attempted").length;
  const totalCount = tests.length;

  // Derive unique curricula from tests
  const curricula = useMemo(() => {
    const unique = new Set<string>();
    tests.forEach(t => { if (t.curriculumId) unique.add(t.curriculumId); });
    return Array.from(unique);
  }, [tests]);

  const displayName = getSubjectDisplayName(subject);

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

          {/* Curriculum badges */}
          {curricula.length >= 1 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {curricula.map((curriculum) => {
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
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0 mt-3" />
      </div>
    </button>
  );
});

export default SubjectTestCard;
