 import { useState, useMemo, useEffect, lazy, Suspense, useCallback, useRef } from "react";
import { TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStudentOverview,
  getSubjectSummaries,
  getSubjectDetail,
  getExamsWithContext,
  getStudentInsight,
  getDerivedStreakData,
  getDerivedWeeklyActivity,
  getAggregatedDifficultyBreakdown,
} from "@/data/student/progressData";
import ProgressHeroCard from "@/components/student/progress/ProgressHeroCard";
import BatchStandingCard from "@/components/student/progress/BatchStandingCard";
import SubjectOverviewGrid from "@/components/student/progress/SubjectOverviewGrid";
import InsightBanner from "@/components/student/progress/InsightBanner";
import SecondaryTagsPills from "@/components/student/progress/SecondaryTagsPills";
import {
  HeroSkeleton,
  StandingSkeleton,
  SubjectGridSkeleton,
  ChartSkeleton,
  TimelineSkeleton,
  InsightSkeleton,
  RadarSkeleton,
  StreakSkeleton,
  CardSkeleton,
} from "@/components/student/progress/ProgressSkeletons";
import { useSwipeTabs } from "@/hooks/use-swipe-tabs";

// Lazy-loaded heavy components
const SubjectDeepDive = lazy(() => import("@/components/student/progress/SubjectDeepDive"));
const ExamHistoryTimeline = lazy(() => import("@/components/student/progress/ExamHistoryTimeline"));
const ExamTrendChart = lazy(() => import("@/components/student/progress/ExamTrendChart"));
const PerExamStandingCard = lazy(() => import("@/components/student/progress/PerExamStandingCard"));
const StreakCalendar = lazy(() => import("@/components/student/progress/StreakCalendar"));
const SubjectRadarChart = lazy(() => import("@/components/student/progress/SubjectRadarChart"));
const WeeklyActivityChart = lazy(() => import("@/components/student/progress/WeeklyActivityChart"));
const DifficultyOverview = lazy(() => import("@/components/student/progress/DifficultyOverview"));

type TabKey = "overview" | "subjects" | "exams" | "insights";

const TAB_KEYS: TabKey[] = ["overview", "subjects", "exams", "insights"];
const TAB_LABELS: Record<TabKey, string> = {
  overview: "Overview",
  subjects: "Subjects",
  exams: "Exams",
  insights: "Insights",
};
const TABS: { key: TabKey; label: string }[] = TAB_KEYS.map((k) => ({
  key: k,
  label: TAB_LABELS[k],
}));

const StudentProgress = () => {
  const { activeTab, setActiveTab, swipeHandlers } = useSwipeTabs<TabKey>({
    tabs: TAB_KEYS,
    initialTab: "overview",
  });
  const [selectedSubjectId, setSelectedSubjectIdRaw] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamIdRaw] = useState<string | null>(null);

  // Stable memoized data — computed once (or on relevant tab)
  const overview = useMemo(() => getStudentOverview(), []);
  const subjects = useMemo(() => getSubjectSummaries(), []);
  const exams = useMemo(
    () => (activeTab === "overview" || activeTab === "exams") ? getExamsWithContext() : [],
    [activeTab]
  );
  const insight = useMemo(
    () => (activeTab === "insights" ? getStudentInsight() : null),
    [activeTab]
  );
  const streakData = useMemo(
    () => (activeTab === "insights" ? getDerivedStreakData() : null),
    [activeTab]
  );
  const weeklyActivity = useMemo(
    () => (activeTab === "overview" || activeTab === "insights") ? getDerivedWeeklyActivity() : null,
    [activeTab]
  );
  const difficultyData = useMemo(
    () => (activeTab === "insights" ? getAggregatedDifficultyBreakdown() : null),
    [activeTab]
  );

  const selectedSubjectDetail = useMemo(
    () => (selectedSubjectId ? getSubjectDetail(selectedSubjectId) : null),
    [selectedSubjectId]
  );

  // Auto-select latest exam when exams load
  useEffect(() => {
    if (exams.length > 0 && !selectedExamId) {
      const latest = [...exams].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setSelectedExamIdRaw(latest[0].examId);
    }
  }, [exams, selectedExamId]);

  const selectedExam = useMemo(
    () => (selectedExamId ? exams.find((e) => e.examId === selectedExamId) || null : null),
    [selectedExamId, exams]
  );

  const handleSubjectSelect = useCallback(
    (id: string) => {
      setSelectedSubjectIdRaw(id);
      setActiveTab("subjects");
    },
    [setActiveTab]
  );

  // Scroll active tab pill into view
  const tabBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!tabBarRef.current) return;
    const idx = TAB_KEYS.indexOf(activeTab);
    const btn = tabBarRef.current.children[idx] as HTMLElement | undefined;
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  return (
    <div className="w-full pb-24 lg:pb-6 overflow-x-hidden">
    <div className="w-full pb-24 lg:pb-8 overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-4 px-0.5"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] flex items-center justify-center shadow-lg shadow-[hsl(var(--donut-coral))]/25 shrink-0">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">My Progress</h1>
          <p className="text-xs text-muted-foreground">Track your learning journey</p>
        </div>
      </motion.div>

      {/* Secondary Tags */}
      {overview.secondaryTags.length > 0 && (
        <div className="mb-4">
          <SecondaryTagsPills tags={overview.secondaryTags} />
        </div>
      )}

      {/* Tab Navigation — horizontal scroll on mobile */}
      <div
        ref={tabBarRef}
        className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-1 px-1 snap-x snap-mandatory"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key !== "subjects") setSelectedSubjectIdRaw(null);
            }}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[44px] snap-start shrink-0
              ${activeTab === tab.key
                ? 'bg-gradient-to-r from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] text-white shadow-md'
                : 'bg-white/60 text-muted-foreground hover:bg-white/80'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          {...swipeHandlers}
        >
        {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <ProgressHeroCard data={overview} />
              <BatchStandingCard data={overview} />
              <SubjectOverviewGrid
                subjects={subjects}
                onSelect={handleSubjectSelect}
                compact
              />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <Suspense fallback={<ChartSkeleton />}>
                <ExamTrendChart exams={exams} />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                {weeklyActivity && <WeeklyActivityChart
                  data={weeklyActivity.data}
                  totalMinutes={weeklyActivity.totalMinutes}
                  averageMinutes={weeklyActivity.averageMinutes}
                />}
              </Suspense>
            </div>
            </div>
        )}

        {activeTab === "subjects" && (
          <div>
            {selectedSubjectId && selectedSubjectDetail ? (
              <Suspense fallback={<SubjectGridSkeleton />}>
                <SubjectDeepDive
                  subjectName={subjects.find((s) => s.subjectId === selectedSubjectId)?.subjectName || "Subject"}
                  detail={selectedSubjectDetail}
                  onBack={() => setSelectedSubjectIdRaw(null)}
                />
              </Suspense>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <SubjectOverviewGrid
                  subjects={subjects}
                  onSelect={setSelectedSubjectIdRaw}
                  selectedId={selectedSubjectId || undefined}
                />
                <p className="text-sm text-muted-foreground text-center py-8">
                  Tap a subject to see detailed analytics
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "exams" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <Suspense fallback={<TimelineSkeleton />}>
                <ExamHistoryTimeline exams={exams} onSelectExam={setSelectedExamIdRaw} selectedExamId={selectedExamId} />
              </Suspense>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <Suspense fallback={<CardSkeleton />}>
                <PerExamStandingCard exam={selectedExam} onClose={() => setSelectedExamIdRaw(null)} />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <ExamTrendChart exams={exams} />
              </Suspense>
            </div>
            </div>
        )}

        {activeTab === "insights" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <Suspense fallback={<InsightSkeleton />}>
                {insight && <InsightBanner insight={insight} />}
              </Suspense>
              <Suspense fallback={<StreakSkeleton />}>
                {streakData && <StreakCalendar
                  currentStreak={streakData.currentStreak}
                  longestStreak={streakData.longestStreak}
                  activeDays={streakData.activeDays}
                />}
              </Suspense>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <Suspense fallback={<RadarSkeleton />}>
                <SubjectRadarChart subjects={subjects} />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                {weeklyActivity && <WeeklyActivityChart
                  data={weeklyActivity.data}
                  totalMinutes={weeklyActivity.totalMinutes}
                  averageMinutes={weeklyActivity.averageMinutes}
                />}
              </Suspense>
            </div>
            </div>
        )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StudentProgress;
