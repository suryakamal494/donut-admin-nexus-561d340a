/**
 * Reports Context Resolver — runs in the browser to assemble the same data
 * the Teacher Reports pages render, so the AI can answer with identical numbers.
 *
 * Copilot batches use UUIDs (e.g. "11111111-…-111101" / "Class 9-A").
 * Teacher Reports mock data uses keys like "batch-10a", "batch-10b", "batch-11a".
 * We pick the closest reports batch by grade+section. If no perfect match,
 * fall back to "batch-10a" so the conversation is never empty.
 */
import {
  getBatchChapters,
  getBatchExamHistory,
  getChapterDetail,
  getBatchHealth,
  type BatchExamEntry,
  type ChapterReportCard,
  type BatchHealthSummary,
} from "@/data/teacher/reportsData";
import { getBatchStudentRoster } from "@/data/teacher/studentReportData";
import {
  getExamAnalyticsForBatch,
  getExamAnalytics,
  computePerformanceBands,
  computeTopicFlags,
  generateVerdictSummary,
  batchInfoMap,
  type ExamAnalytics,
} from "@/data/teacher/examResults";
import type { Batch } from "../types";

export interface ReportsBatchContext {
  /** The reports-side batch key we're using (e.g. "batch-10a") */
  reportsBatchId: string;
  /** Display name from the reports batch info */
  reportsBatchName: string;
  /** Recent exams (max 8) */
  recentExams: BatchExamEntry[];
  /** Chapter health snapshot */
  chapters: ChapterReportCard[];
  /** Per-student roster with PI buckets */
  studentRoster: ReturnType<typeof getBatchStudentRoster>;
  /** Batch health summary */
  health: BatchHealthSummary;
}

/**
 * Map a Copilot batch (UUID, grade, section) to the closest reports batch key.
 */
export function resolveReportsBatchId(batch: Batch): string {
  const want = `${batch.grade}${(batch.section ?? "").toLowerCase()}`;
  // Try direct match by grade+section, e.g. "10a" → "batch-10a"
  const direct = `batch-${want}`;
  if (batchInfoMap[direct]) return direct;
  // Try grade only (any section), pick the first batch matching the grade
  const gradeMatch = Object.keys(batchInfoMap).find((k) =>
    k.startsWith(`batch-${batch.grade}`)
  );
  if (gradeMatch) return gradeMatch;
  // Fallback: first available
  return Object.keys(batchInfoMap)[0] ?? "batch-10a";
}

/**
 * Assemble the full read-only context the AI needs to answer questions
 * about this batch. All data is computed deterministically from the
 * existing Teacher Reports generators.
 */
export function buildReportsContext(batch: Batch): ReportsBatchContext {
  const reportsBatchId = resolveReportsBatchId(batch);
  const info = batchInfoMap[reportsBatchId];
  const chapters = getBatchChapters(reportsBatchId);
  const examHistory = getBatchExamHistory(reportsBatchId);
  const studentRoster = getBatchStudentRoster(reportsBatchId);
  const health = getBatchHealth(
    reportsBatchId,
    chapters,
    examHistory,
    studentRoster.map((s) => ({
      studentName: s.studentName,
      studentId: s.studentId,
      avgPercentage: s.avgPercentage,
      trend: s.trend,
      piBucket: s.piBucket,
      secondaryTags: s.secondaryTags as unknown as string[],
    }))
  );

  return {
    reportsBatchId,
    reportsBatchName: info?.name ?? reportsBatchId,
    recentExams: [...examHistory]
      .sort((a, b) => (b.date < a.date ? -1 : 1))
      .slice(0, 8),
    chapters,
    studentRoster,
    health,
  };
}

/** Strip down to a compact JSON payload that the edge function can introspect. */
export function serializeReportsContext(ctx: ReportsBatchContext) {
  return {
    reports_batch_id: ctx.reportsBatchId,
    reports_batch_name: ctx.reportsBatchName,
    overall_trend: ctx.health.overallTrend,
    recent_exam_avg: ctx.health.recentExamAvg,
    at_risk_count: ctx.health.atRiskCount,
    weak_topic_count: ctx.health.weakTopicCount,
    suggested_focus: ctx.health.suggestedFocus,
    priority_topics: ctx.health.priorityTopics,
    students_to_check_in: ctx.health.studentsToCheckIn,
    chapters: ctx.chapters.map((c) => ({
      id: c.chapterId,
      name: c.chapterName,
      avg_success_rate: c.avgSuccessRate,
      status: c.status,
      weak_topic_count: c.weakTopicCount,
      exams_covering: c.examsCovering,
    })),
    recent_exams: ctx.recentExams.map((e) => ({
      id: e.examId,
      name: e.examName,
      date: e.date,
      total_marks: e.totalMarks,
      class_average: e.classAverage,
      highest_score: e.highestScore,
      pass_percentage: e.passPercentage,
      total_students: e.totalStudents,
    })),
    student_roster_summary: {
      total: ctx.studentRoster.length,
      mastery: ctx.studentRoster.filter((s) => s.piBucket === "mastery").length,
      stable: ctx.studentRoster.filter((s) => s.piBucket === "stable").length,
      reinforcement: ctx.studentRoster.filter((s) => s.piBucket === "reinforcement").length,
      risk: ctx.studentRoster.filter((s) => s.piBucket === "risk").length,
    },
    at_risk_students: ctx.studentRoster
      .filter((s) => s.piBucket === "risk" || s.piBucket === "reinforcement")
      .sort((a, b) => a.performanceIndex - b.performanceIndex)
      .slice(0, 12)
      .map((s) => ({
        id: s.studentId,
        name: s.studentName,
        roll: s.rollNumber,
        avg: s.avgPercentage,
        pi: s.performanceIndex,
        bucket: s.piBucket,
        trend: s.trend,
      })),
    top_performers: [...ctx.studentRoster]
      .sort((a, b) => b.performanceIndex - a.performanceIndex)
      .slice(0, 6)
      .map((s) => ({
        id: s.studentId,
        name: s.studentName,
        roll: s.rollNumber,
        avg: s.avgPercentage,
        pi: s.performanceIndex,
        trend: s.trend,
      })),
  };
}

/** Fetch deep exam analytics on demand (used by the get_exam_analysis tool). */
export function getExamAnalysisForReports(
  examId: string,
  reportsBatchId: string
): {
  analytics: ExamAnalytics | null;
  bands: ReturnType<typeof computePerformanceBands>;
  topicFlags: ReturnType<typeof computeTopicFlags>;
  verdict: ReturnType<typeof generateVerdictSummary> | null;
} {
  const analytics =
    getExamAnalyticsForBatch(examId, reportsBatchId) ?? getExamAnalytics(examId);
  if (!analytics) return { analytics: null, bands: [], topicFlags: [], verdict: null };
  const bands = computePerformanceBands(analytics.allStudents);
  const topicFlags = computeTopicFlags(analytics.questionAnalysis);
  const verdict = generateVerdictSummary(analytics, bands, topicFlags);
  return { analytics, bands, topicFlags, verdict };
}

/** Fetch chapter-level deep dive on demand. */
export function getChapterReportData(chapterId: string, reportsBatchId: string) {
  return getChapterDetail(chapterId, reportsBatchId);
}
