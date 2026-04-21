// Student Progress Data Adapter
// Wraps teacher-side generators to provide student-facing analytics

import { 
  getBatchStudentRoster, 
  getStudentBatchProfile, 
  generateMockStudentInsight,
  type StudentBatchProfile,
  type StudentRosterEntry,
  type StudentAIInsight,
  type ChapterMastery,
  type TopicDetail,
  type ExamHistoryItem,
  type DifficultyBreakdown,
} from "@/data/teacher/studentReportData";
import { 
  getBatchExamHistory, 
  getBatchChapters,
  type BatchExamEntry,
} from "@/data/teacher/reportsData";
import type { Trend, SecondaryTag } from "@/lib/performanceIndex";

// ── Student Progress Types ──

export interface StudentOverview {
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  performanceIndex: number;
  overallAccuracy: number;
  consistency: number;
  trend: Trend;
  secondaryTags: SecondaryTag[];
  totalExams: number;
  totalQuestions: number;
  // Batch standing
  rank: number;
  totalStudents: number;
  percentile: number;
  batchAverage: number;
  topperAccuracy: number;
  deltaFromAverage: number; // positive = above avg
  deltaFromTop: number;    // negative = below top
}

export interface SubjectSummary {
  subjectId: string;
  subjectName: string;
  icon: string;
  color: string;
  performanceIndex: number;
  accuracy: number;
  trend: Trend;
  chaptersTotal: number;
  chaptersStrong: number;
  chaptersWeak: number;
  weakTopicCount: number;
}

export interface SubjectDetail {
  profile: StudentBatchProfile;
  insight: StudentAIInsight;
  batchAverage: number;
  rank: number;
  totalStudents: number;
  percentile: number;
}

export interface ExamWithContext extends ExamHistoryItem {
  classAverage: number;
  highestScore: number;
  percentile: number;
  deltaFromAverage: number;
  deltaFromTop: number;
}

export type { ChapterMastery, TopicDetail, DifficultyBreakdown, StudentAIInsight, BatchExamEntry };

// ── Streak / Activity / Achievement Derivers ──

export interface DerivedStreak {
  currentStreak: number;
  longestStreak: number;
  activeDays: Date[];
}

export interface DerivedAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  color: string;
}

export interface DerivedWeeklyActivity {
  day: string;
  minutes: number;
  chapters: number;
}

// ── Constants ──

const CURRENT_STUDENT_ID = "student-batch-10a-0"; // Aarav Sharma
const CURRENT_BATCH_ID = "batch-10a";

// Subject configs that have teacher-side data (Physics for now)
const SUBJECT_CONFIGS = [
  { id: "physics", name: "Physics", icon: "Atom", color: "#8B5CF6", batchId: "batch-10a" },
  { id: "math", name: "Mathematics", icon: "Calculator", color: "#3B82F6", batchId: "batch-10a" },
  { id: "chemistry", name: "Chemistry", icon: "FlaskConical", color: "#10B981", batchId: "batch-10a" },
  { id: "biology", name: "Biology", icon: "Leaf", color: "#F59E0B", batchId: "batch-10a" },
];

// ── Helpers ──

function computeBatchStanding(
  studentAccuracy: number,
  roster: StudentRosterEntry[]
): { rank: number; totalStudents: number; percentile: number; batchAverage: number; topperAccuracy: number } {
  const sorted = [...roster].sort((a, b) => b.avgPercentage - a.avgPercentage);
  const rank = sorted.findIndex(s => s.avgPercentage <= studentAccuracy) + 1;
  const totalStudents = roster.length;
  const percentile = Math.round(((totalStudents - rank) / totalStudents) * 100);
  const batchAverage = Math.round(roster.reduce((s, r) => s + r.avgPercentage, 0) / totalStudents);
  const topperAccuracy = sorted[0]?.avgPercentage || 0;
  return { rank: Math.max(1, rank), totalStudents, percentile, batchAverage, topperAccuracy };
}

// ── Cache ──

const cache = new Map<string, unknown>();

function cached<T>(key: string, fn: () => T): T {
  if (!cache.has(key)) cache.set(key, fn());
  return cache.get(key) as T;
}

// ── Exports ──

export function getStudentOverview(): StudentOverview {
  return cached("overview", () => {
    const profile = getStudentBatchProfile(CURRENT_STUDENT_ID, CURRENT_BATCH_ID);
    const roster = getBatchStudentRoster(CURRENT_BATCH_ID);
    const standing = computeBatchStanding(profile.overallAccuracy, roster);

    return {
      studentId: profile.studentId,
      studentName: profile.studentName,
      batchId: profile.batchId,
      batchName: profile.batchName,
      performanceIndex: profile.performanceIndex,
      overallAccuracy: profile.overallAccuracy,
      consistency: profile.consistency,
      trend: profile.trend,
      secondaryTags: profile.secondaryTags,
      totalExams: profile.totalExams,
      totalQuestions: profile.totalQuestions,
      rank: standing.rank,
      totalStudents: standing.totalStudents,
      percentile: standing.percentile,
      batchAverage: standing.batchAverage,
      topperAccuracy: standing.topperAccuracy,
      deltaFromAverage: profile.overallAccuracy - standing.batchAverage,
      deltaFromTop: profile.overallAccuracy - standing.topperAccuracy,
    };
  });
}

export function getSubjectSummaries(): SubjectSummary[] {
  return cached("subjects", () => {
    return SUBJECT_CONFIGS.map(cfg => {
      const studentId = `student-${cfg.batchId}-${SUBJECT_CONFIGS.indexOf(cfg)}`;
      const profile = getStudentBatchProfile(studentId, cfg.batchId);
      const chaptersStrong = profile.chapterMastery.filter(c => c.status === "strong").length;
      const chaptersWeak = profile.chapterMastery.filter(c => c.status === "weak").length;

      return {
        subjectId: cfg.id,
        subjectName: cfg.name,
        icon: cfg.icon,
        color: cfg.color,
        performanceIndex: profile.performanceIndex,
        accuracy: profile.overallAccuracy,
        trend: profile.trend,
        chaptersTotal: profile.chapterMastery.length,
        chaptersStrong,
        chaptersWeak,
        weakTopicCount: profile.weakTopics.length,
      };
    });
  });
}

export function getSubjectDetail(subjectId: string): SubjectDetail {
  return cached(`subject-${subjectId}`, () => {
    const cfgIdx = SUBJECT_CONFIGS.findIndex(c => c.id === subjectId);
    const cfg = SUBJECT_CONFIGS[cfgIdx] || SUBJECT_CONFIGS[0];
    const studentId = `student-${cfg.batchId}-${cfgIdx >= 0 ? cfgIdx : 0}`;
    const profile = getStudentBatchProfile(studentId, cfg.batchId);
    const roster = getBatchStudentRoster(cfg.batchId);
    const standing = computeBatchStanding(profile.overallAccuracy, roster);
    const insight = generateMockStudentInsight(profile);

    return {
      profile,
      insight,
      batchAverage: standing.batchAverage,
      rank: standing.rank,
      totalStudents: standing.totalStudents,
      percentile: standing.percentile,
    };
  });
}

export function getExamsWithContext(): ExamWithContext[] {
  return cached("exams-context", () => {
    const profile = getStudentBatchProfile(CURRENT_STUDENT_ID, CURRENT_BATCH_ID);
    const batchExams = getBatchExamHistory(CURRENT_BATCH_ID);

    return profile.examHistory.map(exam => {
      const batchExam = batchExams.find(be => be.examId === exam.examId);
      const classAvg = batchExam?.classAverage 
        ? Math.round((batchExam.classAverage / batchExam.totalMarks) * 100) 
        : 55;
      const highest = batchExam?.highestScore
        ? Math.round((batchExam.highestScore / batchExam.totalMarks) * 100)
        : 90;
      const totalStudents = batchExam?.totalStudents || exam.totalStudents;
      const percentile = Math.round(((totalStudents - exam.rank) / totalStudents) * 100);

      return {
        ...exam,
        classAverage: classAvg,
        highestScore: highest,
        percentile,
        deltaFromAverage: exam.percentage - classAvg,
        deltaFromTop: exam.percentage - highest,
      };
    });
  });
}

export function getStudentInsight(): StudentAIInsight {
  return cached("insight", () => {
    const profile = getStudentBatchProfile(CURRENT_STUDENT_ID, CURRENT_BATCH_ID);
    return generateMockStudentInsight(profile);
  });
}

export function getDerivedStreakData(): DerivedStreak {
  return cached("streak", () => {
    const profile = getStudentBatchProfile(CURRENT_STUDENT_ID, CURRENT_BATCH_ID);
    // Derive active days from exam dates
    const examDates = profile.examHistory
      .map(e => new Date(e.date))
      .sort((a, b) => a.getTime() - b.getTime());

    // Compute current streak from today backwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    let prevDay: number | null = null;

    const uniqueDays = [...new Set(examDates.map(d => {
      const nd = new Date(d);
      nd.setHours(0, 0, 0, 0);
      return nd.getTime();
    }))].sort((a, b) => a - b);

    for (let i = 0; i < uniqueDays.length; i++) {
      if (prevDay !== null && uniqueDays[i] - prevDay <= 86400000 * 2) {
        streak++;
      } else {
        streak = 1;
      }
      longestStreak = Math.max(longestStreak, streak);
      prevDay = uniqueDays[i];
    }

    // Current streak: count consecutive days ending at or near today
    const todayTime = today.getTime();
    let cs = 0;
    for (let i = uniqueDays.length - 1; i >= 0; i--) {
      const diff = todayTime - uniqueDays[i];
      if (diff <= 86400000 * (cs + 1)) {
        cs++;
      } else {
        break;
      }
    }
    currentStreak = Math.max(cs, Math.min(profile.totalExams, 8));
    longestStreak = Math.max(longestStreak, currentStreak, Math.min(profile.totalExams, 14));

    // Use exam dates plus some adjacent days as active days this month
    const activeDays: Date[] = [];
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    for (let i = 0; i < currentStreak; i++) {
      const d = new Date(thisYear, thisMonth, today.getDate() - i);
      if (d.getMonth() === thisMonth) activeDays.push(d);
    }
    examDates.forEach(d => {
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) activeDays.push(d);
    });

    return { currentStreak, longestStreak, activeDays };
  });
}

export function getDerivedAchievements(): DerivedAchievement[] {
  return cached("achievements", () => {
    const overview = getStudentOverview();
    const profile = getStudentBatchProfile(CURRENT_STUDENT_ID, CURRENT_BATCH_ID);

    return [
      { id: "1", name: "First Steps", description: "Complete your first exam", icon: "star", unlocked: profile.totalExams >= 1, color: "#F59E0B" },
      { id: "2", name: "Week Warrior", description: "7+ day study streak", icon: "flame", unlocked: profile.totalExams >= 5, color: "#EF4444" },
      { id: "3", name: "Quick Learner", description: "Score 70%+ in any exam", icon: "zap", unlocked: profile.examHistory.some(e => e.percentage >= 70), color: "#8B5CF6" },
      { id: "4", name: "Consistent", description: "Consistency score above 80", icon: "trophy", unlocked: overview.consistency >= 80, color: "#3B82F6" },
      { id: "5", name: "Above Average", description: "Beat the class average", icon: "award", unlocked: overview.deltaFromAverage > 0, color: "#10B981" },
      { id: "6", name: "Perfect Score", description: "Get 100% in any exam", icon: "target", unlocked: profile.examHistory.some(e => e.percentage >= 100), color: "#EC4899" },
      { id: "7", name: "Exam Pro", description: "Complete 10+ exams", icon: "book", unlocked: profile.totalExams >= 10, color: "#6366F1" },
      { id: "8", name: "Champion", description: "Rank #1 in your batch", icon: "crown", unlocked: overview.rank === 1, color: "#F59E0B" },
    ];
  });
}

export function getDerivedWeeklyActivity(): { data: DerivedWeeklyActivity[]; totalMinutes: number; averageMinutes: number } {
  return cached("weekly-activity", () => {
    const profile = getStudentBatchProfile(CURRENT_STUDENT_ID, CURRENT_BATCH_ID);
    // Derive from exam count and accuracy — synthetic but deterministic
    const seed = profile.totalExams + Math.round(profile.overallAccuracy);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = days.map((day, i) => {
      const base = 20 + ((seed * (i + 1) * 7) % 60);
      const chapters = 1 + ((seed * (i + 2)) % 4);
      return { day, minutes: base, chapters };
    });
    const totalMinutes = data.reduce((s, d) => s + d.minutes, 0);
    const averageMinutes = Math.round(totalMinutes / 7);
    return { data, totalMinutes, averageMinutes };
  });
}