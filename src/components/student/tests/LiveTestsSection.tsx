// Live Tests Section - Horizontal scrollable highlight for urgent tests

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, FileText, ChevronRight,
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Code,
  Languages, ScrollText, Globe, Landmark, Mountain, Scale,
  TrendingUp, Microscope, Bug, Sprout, TreePine, Palette,
  Dumbbell, Receipt, Briefcase, BrainCircuit, Database, Home,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { StudentTest } from "@/data/student/tests";
import { formatDuration } from "@/data/student/tests";

const iconMap: Record<string, LucideIcon> = {
  mathematics: Calculator, math: Calculator, physics: Atom,
  chemistry: FlaskConical, biology: Leaf, english: BookOpen, cs: Code,
  hindi: Languages, sanskrit: ScrollText, "social-science": Globe,
  history: Landmark, geography: Mountain, civics: Scale,
  economics: TrendingUp, science: Microscope, zoology: Bug,
  botany: Sprout, evs: TreePine, art: Palette, pe: Dumbbell,
  accountancy: Receipt, business: Briefcase, ai: BrainCircuit,
  informatics: Database, "home-science": Home,
};

const colorConfig: Record<string, { gradient: string; text: string; bg: string }> = {
  blue: { gradient: "from-blue-400 to-blue-600", text: "text-blue-600", bg: "bg-blue-50" },
  purple: { gradient: "from-violet-400 to-purple-600", text: "text-violet-600", bg: "bg-violet-50" },
  green: { gradient: "from-emerald-400 to-green-600", text: "text-emerald-600", bg: "bg-emerald-50" },
  red: { gradient: "from-rose-400 to-red-500", text: "text-rose-600", bg: "bg-rose-50" },
  amber: { gradient: "from-amber-400 to-orange-500", text: "text-amber-600", bg: "bg-amber-50" },
  cyan: { gradient: "from-cyan-400 to-teal-500", text: "text-cyan-600", bg: "bg-cyan-50" },
  orange: { gradient: "from-orange-400 to-orange-600", text: "text-orange-600", bg: "bg-orange-50" },
  indigo: { gradient: "from-indigo-400 to-indigo-600", text: "text-indigo-600", bg: "bg-indigo-50" },
  slate: { gradient: "from-slate-400 to-slate-600", text: "text-slate-600", bg: "bg-slate-50" },
  brown: { gradient: "from-yellow-600 to-amber-700", text: "text-yellow-700", bg: "bg-yellow-50" },
  sky: { gradient: "from-sky-400 to-sky-600", text: "text-sky-600", bg: "bg-sky-50" },
  lime: { gradient: "from-lime-400 to-lime-600", text: "text-lime-600", bg: "bg-lime-50" },
  pink: { gradient: "from-pink-400 to-pink-600", text: "text-pink-600", bg: "bg-pink-50" },
  fuchsia: { gradient: "from-fuchsia-400 to-fuchsia-600", text: "text-fuchsia-600", bg: "bg-fuchsia-50" },
  stone: { gradient: "from-stone-400 to-stone-600", text: "text-stone-600", bg: "bg-stone-50" },
  zinc: { gradient: "from-zinc-400 to-zinc-600", text: "text-zinc-600", bg: "bg-zinc-50" },
  emerald: { gradient: "from-emerald-400 to-emerald-600", text: "text-emerald-600", bg: "bg-emerald-50" },
  rose: { gradient: "from-rose-400 to-rose-600", text: "text-rose-600", bg: "bg-rose-50" },
  violet: { gradient: "from-violet-400 to-violet-600", text: "text-violet-600", bg: "bg-violet-50" },
  teal: { gradient: "from-teal-400 to-teal-600", text: "text-teal-600", bg: "bg-teal-50" },
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

interface LiveTestsSectionProps {
  tests: StudentTest[];
  className?: string;
}

const LiveTestsSection = memo(function LiveTestsSection({ tests, className }: LiveTestsSectionProps) {
  const navigate = useNavigate();
  const liveTests = tests.filter((t) => t.status === "live");
  if (liveTests.length === 0) return null;

  const handleStart = (testId: string) => navigate(`/student/tests/${testId}`);

  return (
    <div className={cn("mb-5", className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
        </span>
        <h2 className="font-semibold text-foreground text-sm">Live Now</h2>
        <span className="text-xs text-muted-foreground">
          {liveTests.length} {liveTests.length === 1 ? "test" : "tests"} active
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {liveTests.map((test) => {
          const colorKey = test.subject ? subjectColorMap[test.subject.toLowerCase()] || "blue" : "blue";
          const colors = colorConfig[colorKey] || colorConfig.blue;
          const Icon = test.subject ? iconMap[test.subject.toLowerCase()] || BookOpen : BookOpen;

          return (
            <div key={test.id} className="shrink-0 w-[280px] bg-white/80 backdrop-blur-xl rounded-2xl border border-rose-100 shadow-lg p-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl bg-rose-100 opacity-50" />
              <div className="flex items-start gap-3 relative">
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0", colors.gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm line-clamp-1 mb-0.5">{test.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" />{test.totalQuestions}Q</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{formatDuration(test.duration)}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 h-8 text-xs font-semibold bg-gradient-to-r from-donut-orange to-donut-coral text-white shadow-md hover:opacity-90" onClick={() => handleStart(test.id)}>
                Start Test<ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default LiveTestsSection;
