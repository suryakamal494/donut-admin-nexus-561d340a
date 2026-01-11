// Live Tests Section - Horizontal scrollable highlight for urgent tests
// Shows live tests from all subjects at the top of the Tests page

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  FileText,
  ChevronRight,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Code,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { StudentTest } from "@/data/student/tests";
import { formatDuration } from "@/data/student/tests";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  mathematics: Calculator,
  math: Calculator,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Leaf,
  english: BookOpen,
  cs: Code,
};

// Color configurations
const colorConfig: Record<string, { gradient: string; text: string; bg: string }> = {
  blue: { gradient: "from-blue-400 to-blue-600", text: "text-blue-600", bg: "bg-blue-50" },
  purple: { gradient: "from-violet-400 to-purple-600", text: "text-violet-600", bg: "bg-violet-50" },
  green: { gradient: "from-emerald-400 to-green-600", text: "text-emerald-600", bg: "bg-emerald-50" },
  red: { gradient: "from-rose-400 to-red-500", text: "text-rose-600", bg: "bg-rose-50" },
  amber: { gradient: "from-amber-400 to-orange-500", text: "text-amber-600", bg: "bg-amber-50" },
  cyan: { gradient: "from-cyan-400 to-teal-500", text: "text-cyan-600", bg: "bg-cyan-50" },
};

const subjectColorMap: Record<string, string> = {
  physics: "purple",
  chemistry: "green",
  mathematics: "blue",
  math: "blue",
  biology: "red",
  english: "amber",
  cs: "cyan",
};

interface LiveTestsSectionProps {
  tests: StudentTest[];
  className?: string;
}

const LiveTestsSection = memo(function LiveTestsSection({
  tests,
  className,
}: LiveTestsSectionProps) {
  const navigate = useNavigate();

  const liveTests = tests.filter((t) => t.status === "live");

  if (liveTests.length === 0) return null;

  const handleStart = (testId: string) => {
    navigate(`/student/tests/${testId}`);
  };

  return (
    <div className={cn("mb-5", className)}>
      {/* Header */}
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

      {/* Horizontal scroll container */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {liveTests.map((test) => {
          const colorKey = test.subject
            ? subjectColorMap[test.subject.toLowerCase()] || "blue"
            : "blue";
          const colors = colorConfig[colorKey];
          const Icon = test.subject
            ? iconMap[test.subject.toLowerCase()] || BookOpen
            : BookOpen;

          return (
            <div
              key={test.id}
              className="shrink-0 w-[280px] bg-white/80 backdrop-blur-xl rounded-2xl border border-rose-100 shadow-lg p-3 relative overflow-hidden"
            >
              {/* Urgency glow */}
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl bg-rose-100 opacity-50" />

              <div className="flex items-start gap-3 relative">
                {/* Subject Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0",
                    colors.gradient
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Test name */}
                  <p className="font-semibold text-foreground text-sm line-clamp-1 mb-0.5">
                    {test.name}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <FileText className="w-2.5 h-2.5" />
                      {test.totalQuestions}Q
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDuration(test.duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <Button
                size="sm"
                className="w-full mt-3 h-8 text-xs font-semibold bg-gradient-to-r from-donut-orange to-donut-coral text-white shadow-md hover:opacity-90"
                onClick={() => handleStart(test.id)}
              >
                Start Test
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default LiveTestsSection;
