import { useState, useMemo, lazy, Suspense, useCallback } from "react";
import { TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStudentOverview,
  getSubjectSummaries,
  getSubjectDetail,
  getExamsWithContext,
  getStudentInsight,
  getDerivedStreakData,
  getDerivedAchievements,
  getDerivedWeeklyActivity,
} from "@/data/student/progressData";
import ProgressHeroCard from "@/components/student/progress/ProgressHeroCard";
import BatchStandingCard from "@/components/student/progress/BatchStandingCard";
import SubjectOverviewGrid from "@/components/student/progress/SubjectOverviewGrid";
import InsightBanner from "@/components/student/progress/InsightBanner";
import SecondaryTagsPills from "@/components/student/progress/SecondaryTagsPills";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded heavy components
const SubjectDeepDive = lazy(() => import("@/components/student/progress/SubjectDeepDive"));
const ExamHistoryTimeline = lazy(() => import("@/components/student/progress/ExamHistoryTimeline"));
const ExamTrendChart = lazy(() => import("@/components/student/progress/ExamTrendChart"));
const PerExamStandingCard = lazy(() => import("@/components/student/progress/PerExamStandingCard"));
const StreakCalendar = lazy(() => import("@/components/student/progress/StreakCalendar"));
const AchievementBadges = lazy(() => import("@/components/student/progress/AchievementBadges"));
const WeeklyActivityChart = lazy(() => import("@/components/student/progress/WeeklyActivityChart"));

type TabKey = "overview" | "subjects" | "exams" | "insights";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "subjects", label: "Subjects" },
  { key: "exams", label: "Exams" },
  { key: "insights", label: "Insights" },
];

const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg space-y-3 ${className}`}>
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-4 w-48" />
  </div>
);

const StudentProgress = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Data
  const overview = useMemo(() => getStudentOverview(), []);
  const subjects = useMemo(() => getSubjectSummaries(), []);
  // Lazy: only compute when relevant tab is active
  const exams = useMemo(() => (activeTab === "overview" || activeTab === "exams") ? getExamsWithContext() : [], [activeTab]);
  const insight = useMemo(() => activeTab === "insights" ? getStudentInsight() : null, [activeTab]);
  const streakData = useMemo(() => activeTab === "insights" ? getDerivedStreakData() : null, [activeTab]);
  const achievements = useMemo(() => activeTab === "insights" ? getDerivedAchievements() : [], [activeTab]);
  const weeklyActivity = useMemo(() => (activeTab === "overview" || activeTab === "insights") ? getDerivedWeeklyActivity() : null, [activeTab]);

  const selectedSubjectDetail = useMemo(
    () => selectedSubjectId ? getSubjectDetail(selectedSubjectId) : null,
    [selectedSubjectId]
  );

  const selectedExam = useMemo(
    () => selectedExamId ? exams.find(e => e.examId === selectedExamId) || null : null,
    [selectedExamId, exams]
  );

  const handleSubjectSelect = useCallback((id: string) => {
    setSelectedSubjectId(id);
    setActiveTab("subjects");
  }, []);

  return (
    <div className="w-full pb-24 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] flex items-center justify-center shadow-lg shadow-[hsl(var(--donut-coral))]/25">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">My Progress</h1>
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
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key !== "subjects") setSelectedSubjectId(null);
            }}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[44px]
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
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <ProgressHeroCard data={overview} />
              <BatchStandingCard data={overview} />
              <SubjectOverviewGrid
                subjects={subjects}
                onSelect={handleSubjectSelect}
              />
            </div>
            <div className="space-y-4">
              <Suspense fallback={<CardSkeleton />}>
                <ExamTrendChart exams={exams} />
              </Suspense>
              <Suspense fallback={<CardSkeleton />}>
                {weeklyActivity && <WeeklyActivityChart
                  data={weeklyActivity.data}
                  totalMinutes={weeklyActivity.totalMinutes}
                  averageMinutes={weeklyActivity.averageMinutes}
                />}
              </Suspense>
            </div>
          </motion.div>
        )}

        {activeTab === "subjects" && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {selectedSubjectId && selectedSubjectDetail ? (
              <Suspense fallback={<CardSkeleton />}>
                <SubjectDeepDive
                  subjectName={subjects.find(s => s.subjectId === selectedSubjectId)?.subjectName || "Subject"}
                  detail={selectedSubjectDetail}
                  onBack={() => setSelectedSubjectId(null)}
                />
              </Suspense>
            ) : (
              <div className="space-y-4">
                <SubjectOverviewGrid
                  subjects={subjects}
                  onSelect={setSelectedSubjectId}
                  selectedId={selectedSubjectId || undefined}
                />
                <p className="text-sm text-muted-foreground text-center py-8">
                  Tap a subject to see detailed analytics
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "exams" && (
          <motion.div
            key="exams"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <Suspense fallback={<CardSkeleton />}>
                <ExamHistoryTimeline exams={exams} onSelectExam={setSelectedExamId} selectedExamId={selectedExamId} />
              </Suspense>
            </div>
            <div className="space-y-4">
              <Suspense fallback={<CardSkeleton />}>
                <PerExamStandingCard exam={selectedExam} onClose={() => setSelectedExamId(null)} />
              </Suspense>
              <Suspense fallback={<CardSkeleton />}>
                <ExamTrendChart exams={exams} />
              </Suspense>
            </div>
          </motion.div>
        )}

        {activeTab === "insights" && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <Suspense fallback={<CardSkeleton />}>
                {insight && <InsightBanner insight={insight} />}
              </Suspense>
              <Suspense fallback={<CardSkeleton />}>
                {streakData && <StreakCalendar
                  currentStreak={streakData.currentStreak}
                  longestStreak={streakData.longestStreak}
                  activeDays={streakData.activeDays}
                />}
              </Suspense>
            </div>
            <div className="space-y-4">
              <Suspense fallback={<CardSkeleton />}>
                <AchievementBadges achievements={achievements} />
              </Suspense>
              <Suspense fallback={<CardSkeleton />}>
                {weeklyActivity && <WeeklyActivityChart
                  data={weeklyActivity.data}
                  totalMinutes={weeklyActivity.totalMinutes}
                  averageMinutes={weeklyActivity.averageMinutes}
                />}
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProgress;
