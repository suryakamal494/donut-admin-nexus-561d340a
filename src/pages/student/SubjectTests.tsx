// Subject Tests Page - Dedicated full page replacing the old popup sheet
// Shows all tests for a subject with filters, date grouping, and action buttons

import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Code,
  Clock,
  FileText,
  Play,
  Eye,
  BarChart3,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  teacherTests,
  getSubjectDisplayName,
  formatDuration,
  getLiveTestsCount,
} from "@/data/student/tests";
import type { StudentTest, TestStatus } from "@/data/student/tests";
import {
  isToday,
  isThisWeek,
  isBefore,
  isAfter,
  parseISO,
  format,
  startOfToday,
} from "date-fns";

// ── Icon & Color mappings ──
const iconMap: Record<string, LucideIcon> = {
  physics: Atom,
  chemistry: FlaskConical,
  mathematics: Calculator,
  math: Calculator,
  biology: Leaf,
  english: BookOpen,
  cs: Code,
};

const colorConfig: Record<string, { gradient: string; shadow: string; bg: string; bgSoft: string; text: string; border: string }> = {
  purple: { gradient: "from-violet-400 to-purple-600", shadow: "shadow-violet-400/30", bg: "bg-violet-500", bgSoft: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
  green: { gradient: "from-emerald-400 to-green-600", shadow: "shadow-emerald-400/30", bg: "bg-emerald-500", bgSoft: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  blue: { gradient: "from-blue-400 to-blue-600", shadow: "shadow-blue-400/30", bg: "bg-blue-500", bgSoft: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  red: { gradient: "from-rose-400 to-red-500", shadow: "shadow-rose-400/30", bg: "bg-rose-500", bgSoft: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  amber: { gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-400/30", bg: "bg-amber-500", bgSoft: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  cyan: { gradient: "from-cyan-400 to-teal-500", shadow: "shadow-cyan-400/30", bg: "bg-cyan-500", bgSoft: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
};

const subjectColorKey: Record<string, string> = {
  physics: "purple",
  chemistry: "green",
  mathematics: "blue",
  math: "blue",
  biology: "red",
  english: "amber",
  cs: "cyan",
};

// ── Filter types ──
type FilterTab = "all" | "live" | "upcoming" | "attempted" | "missed";

const filterConfig: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "attempted", label: "Attempted" },
  { key: "missed", label: "Missed" },
];

// ── Date grouping ──
interface DateGroup {
  label: string;
  tests: StudentTest[];
}

function groupTestsByDate(tests: StudentTest[]): DateGroup[] {
  const today = startOfToday();
  const groups: Record<string, StudentTest[]> = {
    "🔴 Live Now": [],
    "📅 Today": [],
    "📆 This Week": [],
    "⏳ Upcoming": [],
    "✅ Completed": [],
    "⚠️ Missed": [],
  };

  tests.forEach((test) => {
    if (test.status === "live") {
      groups["🔴 Live Now"].push(test);
    } else if (test.status === "missed") {
      groups["⚠️ Missed"].push(test);
    } else if (test.status === "attempted") {
      groups["✅ Completed"].push(test);
    } else if (test.status === "upcoming") {
      const date = test.scheduledDate ? parseISO(test.scheduledDate) : null;
      if (date && isToday(date)) {
        groups["📅 Today"].push(test);
      } else if (date && isThisWeek(date, { weekStartsOn: 1 })) {
        groups["📆 This Week"].push(test);
      } else {
        groups["⏳ Upcoming"].push(test);
      }
    }
  });

  // Sort completed by most recent first
  groups["✅ Completed"].sort((a, b) => {
    const da = a.attemptedAt ? parseISO(a.attemptedAt).getTime() : 0;
    const db = b.attemptedAt ? parseISO(b.attemptedAt).getTime() : 0;
    return db - da;
  });

  // Sort upcoming by nearest date first
  ["📅 Today", "📆 This Week", "⏳ Upcoming"].forEach((key) => {
    groups[key].sort((a, b) => {
      const da = a.scheduledDate ? parseISO(a.scheduledDate).getTime() : Infinity;
      const db = b.scheduledDate ? parseISO(b.scheduledDate).getTime() : Infinity;
      return da - db;
    });
  });

  // Sort missed by most recent first
  groups["⚠️ Missed"].sort((a, b) => {
    const da = a.scheduledDate ? parseISO(a.scheduledDate).getTime() : 0;
    const db = b.scheduledDate ? parseISO(b.scheduledDate).getTime() : 0;
    return db - da;
  });

  return Object.entries(groups)
    .filter(([, tests]) => tests.length > 0)
    .map(([label, tests]) => ({ label, tests }));
}

// ── Test Card Component ──
function SubjectTestItem({
  test,
  colors,
  index,
}: {
  test: StudentTest;
  colors: (typeof colorConfig)[string];
  index: number;
}) {
  const navigate = useNavigate();

  const scorePercent = test.score != null && test.totalMarks
    ? Math.round((test.score / test.totalMarks) * 100)
    : null;

  const handleAction = useCallback(() => {
    if (test.status === "live") {
      navigate(`/student/tests/${test.id}`);
    } else if (test.status === "attempted") {
      navigate(`/student/tests/${test.id}/results`);
    }
  }, [navigate, test.id, test.status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        {/* Status indicator */}
        <div className="mt-1.5 shrink-0">
          {test.status === "live" && (
            <span className="block w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
          )}
          {test.status === "upcoming" && (
            <span className="block w-2.5 h-2.5 bg-amber-400 rounded-full" />
          )}
          {test.status === "attempted" && (
            <span className="block w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          )}
          {test.status === "missed" && (
            <span className="block w-2.5 h-2.5 bg-gray-300 rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-foreground leading-snug">
              {test.name}
            </h3>
            {test.status === "live" && (
              <span className="shrink-0 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-wide">
                Live
              </span>
            )}
            {scorePercent != null && (
              <span
                className={cn(
                  "shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold",
                  scorePercent >= 80
                    ? "bg-emerald-50 text-emerald-600"
                    : scorePercent >= 50
                    ? "bg-amber-50 text-amber-600"
                    : "bg-rose-50 text-rose-600"
                )}
              >
                {scorePercent}%
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
            {test.teacherName && <span>{test.teacherName}</span>}
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {test.totalQuestions}Q
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(test.duration)}
            </span>
            {test.scheduledDate && test.status === "upcoming" && (
              <span>
                {format(parseISO(test.scheduledDate), "MMM d")}
                {test.scheduledTime && ` · ${test.scheduledTime}`}
              </span>
            )}
            {test.attemptedAt && test.status === "attempted" && (
              <span>{format(parseISO(test.attemptedAt), "MMM d")}</span>
            )}
            {test.scheduledDate && test.status === "missed" && (
              <span>{format(parseISO(test.scheduledDate), "MMM d")}</span>
            )}
          </div>

          {/* Action button */}
          <div className="mt-3">
            {test.status === "live" && (
              <button
                onClick={handleAction}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
                  colors.gradient,
                  colors.shadow
                )}
              >
                <Play className="w-3.5 h-3.5" />
                Start Test
              </button>
            )}
            {test.status === "upcoming" && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground/60 bg-white/50 border border-white/40 cursor-not-allowed">
                <Clock className="w-3.5 h-3.5" />
                {test.scheduledDate
                  ? `Starts ${format(parseISO(test.scheduledDate), "MMM d")}${test.scheduledTime ? `, ${test.scheduledTime}` : ""}`
                  : "Scheduled"}
              </span>
            )}
            {test.status === "attempted" && (
              <button
                onClick={handleAction}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                View Results
              </button>
            )}
            {test.status === "missed" && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100">
                <AlertCircle className="w-3.5 h-3.5" />
                Expired
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ──
export default function SubjectTests() {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const subjectKey = subject?.toLowerCase() || "";
  const displayName = getSubjectDisplayName(subjectKey);
  const cKey = subjectColorKey[subjectKey] || "blue";
  const colors = colorConfig[cKey];
  const Icon = iconMap[subjectKey] || BookOpen;

  // Get tests for this subject
  const subjectTests = useMemo(
    () => teacherTests.filter((t) => t.subject?.toLowerCase() === subjectKey),
    [subjectKey]
  );

  // Counts
  const counts: Record<FilterTab, number> = useMemo(() => ({
    all: subjectTests.length,
    live: subjectTests.filter((t) => t.status === "live").length,
    upcoming: subjectTests.filter((t) => t.status === "upcoming").length,
    attempted: subjectTests.filter((t) => t.status === "attempted").length,
    missed: subjectTests.filter((t) => t.status === "missed").length,
  }), [subjectTests]);

  // Filtered tests
  const filteredTests = useMemo(() => {
    if (activeFilter === "all") return subjectTests;
    return subjectTests.filter((t) => t.status === activeFilter);
  }, [subjectTests, activeFilter]);

  // Date groups
  const dateGroups = useMemo(() => groupTestsByDate(filteredTests), [filteredTests]);

  const liveCount = counts.live;

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        {/* Back button */}
        <button
          onClick={() => navigate("/student/tests")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tests
        </button>

        {/* Subject header */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0",
              colors.gradient,
              colors.shadow
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{displayName} Tests</h1>
            <p className="text-xs text-muted-foreground">
              {counts.all} {counts.all === 1 ? "test" : "tests"}
              {liveCount > 0 && (
                <span className="text-rose-500 font-medium"> · {liveCount} live now</span>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="overflow-x-auto -mx-4 px-4 mb-5 scrollbar-hide">
        <div className="flex gap-2 w-max">
          {filterConfig.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all min-h-[44px]",
                activeFilter === key
                  ? cn("text-white bg-gradient-to-r shadow-lg", colors.gradient, colors.shadow)
                  : "text-muted-foreground bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80"
              )}
            >
              {label}
              {counts[key] > 0 && (
                <span
                  className={cn(
                    "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    activeFilter === key ? "bg-white/20" : colors.bgSoft + " " + colors.text
                  )}
                >
                  {counts[key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Date-grouped test list */}
      {dateGroups.length > 0 ? (
        <div className="space-y-5">
          {dateGroups.map((group) => (
            <div key={group.label}>
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">
                {group.label}
              </h2>
              <div className="space-y-2.5">
                {group.tests.map((test, i) => (
                  <SubjectTestItem key={test.id} test={test} colors={colors} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/50 text-center mt-4">
          <p className="text-muted-foreground">No tests found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Try selecting a different filter
          </p>
        </div>
      )}
    </div>
  );
}
