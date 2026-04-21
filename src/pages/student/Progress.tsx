import { useState, useMemo, lazy, Suspense } from "react";
import { TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStudentOverview,
  getSubjectSummaries,
  getSubjectDetail,
  getExamsWithContext,
  getStudentInsight,
} from "@/data/student/progressData";
import ProgressHeroCard from "@/components/student/progress/ProgressHeroCard";
import BatchStandingCard from "@/components/student/progress/BatchStandingCard";
import SubjectOverviewGrid from "@/components/student/progress/SubjectOverviewGrid";
import InsightBanner from "@/components/student/progress/InsightBanner";
import SecondaryTagsPills from "@/components/student/progress/SecondaryTagsPills";
import SubjectDeepDive from "@/components/student/progress/SubjectDeepDive";
import ExamHistoryTimeline from "@/components/student/progress/ExamHistoryTimeline";
import ExamTrendChart from "@/components/student/progress/ExamTrendChart";
import StreakCalendar from "@/components/student/progress/StreakCalendar";
import AchievementBadges from "@/components/student/progress/AchievementBadges";
import WeeklyActivityChart from "@/components/student/progress/WeeklyActivityChart";

type TabKey = "overview" | "subjects" | "exams" | "insights";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "subjects", label: "Subjects" },
  { key: "exams", label: "Exams" },
  { key: "insights", label: "Insights" },
];

// Mock data for streak/achievements (keep until wired to real data)
const mockActiveDays = [
  new Date(2026, 3, 14), new Date(2026, 3, 15), new Date(2026, 3, 16),
  new Date(2026, 3, 17), new Date(2026, 3, 18), new Date(2026, 3, 19),
  new Date(2026, 3, 20), new Date(2026, 3, 21),
];

const mockAchievements = [
  { id: "1", name: "First Steps", description: "Complete your first chapter", icon: "star", unlocked: true, color: "#F59E0B" },
  { id: "2", name: "Week Warrior", description: "7 day study streak", icon: "flame", unlocked: true, color: "#EF4444" },
  { id: "3", name: "Quick Learner", description: "Complete 5 chapters in a day", icon: "zap", unlocked: true, color: "#8B5CF6" },
  { id: "4", name: "Math Master", description: "Score 90%+ in 3 math tests", icon: "trophy", unlocked: true, color: "#3B82F6" },
  { id: "5", name: "Science Star", description: "Complete all science subjects", icon: "award", unlocked: false, color: "#10B981" },
  { id: "6", name: "Perfect Score", description: "Get 100% in any test", icon: "target", unlocked: false, color: "#EC4899" },
  { id: "7", name: "Bookworm", description: "Study for 100 hours total", icon: "book", unlocked: false, color: "#6366F1" },
  { id: "8", name: "Champion", description: "Rank #1 in your class", icon: "crown", unlocked: false, color: "#F59E0B" },
];

const mockWeeklyData = [
  { day: "Mon", minutes: 45, chapters: 2 },
  { day: "Tue", minutes: 60, chapters: 3 },
  { day: "Wed", minutes: 30, chapters: 1 },
  { day: "Thu", minutes: 75, chapters: 4 },
  { day: "Fri", minutes: 50, chapters: 2 },
  { day: "Sat", minutes: 90, chapters: 5 },
  { day: "Sun", minutes: 40, chapters: 2 },
];

const StudentProgress = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Data
  const overview = useMemo(() => getStudentOverview(), []);
  const subjects = useMemo(() => getSubjectSummaries(), []);
  const exams = useMemo(() => getExamsWithContext(), []);
  const insight = useMemo(() => getStudentInsight(), []);

  const selectedSubjectDetail = useMemo(
    () => selectedSubjectId ? getSubjectDetail(selectedSubjectId) : null,
    [selectedSubjectId]
  );

  const totalMinutes = mockWeeklyData.reduce((acc, d) => acc + d.minutes, 0);
  const averageMinutes = Math.round(totalMinutes / mockWeeklyData.length);

  const handleSubjectSelect = (id: string) => {
    setSelectedSubjectId(id);
    setActiveTab("subjects");
  };

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
              <ExamTrendChart exams={exams} />
              <WeeklyActivityChart
                data={mockWeeklyData}
                totalMinutes={totalMinutes}
                averageMinutes={averageMinutes}
              />
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
              <SubjectDeepDive
                subjectName={subjects.find(s => s.subjectId === selectedSubjectId)?.subjectName || "Subject"}
                detail={selectedSubjectDetail}
                onBack={() => setSelectedSubjectId(null)}
              />
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
            <ExamHistoryTimeline exams={exams} />
            <ExamTrendChart exams={exams} />
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
              <InsightBanner insight={insight} />
              <StreakCalendar
                currentStreak={8}
                longestStreak={14}
                activeDays={mockActiveDays}
              />
            </div>
            <div className="space-y-4">
              <AchievementBadges achievements={mockAchievements} />
              <WeeklyActivityChart
                data={mockWeeklyData}
                totalMinutes={totalMinutes}
                averageMinutes={averageMinutes}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProgress;
