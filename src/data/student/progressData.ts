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