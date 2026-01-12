// Shared types and utilities for ConsolidatedBatchView components

import { ChapterHourAllocation, ChapterDriftStatus } from "@/types/academicSchedule";
import { teachingConfirmations } from "@/data/academic-schedule/confirmations";

// Chapter detail type for the sheet
export interface ChapterDetail {
  chapter: ChapterHourAllocation & { weeksNeeded: number; startWeek: number; endWeek: number };
  isCompleted: boolean;
  isCurrent: boolean;
  subjectName: string;
}

// Teacher info for a chapter
export interface ChapterTeacherInfo {
  teacherId: string;
  teacherName: string;
  hours: number;
}

// Teacher lost days info
export interface TeacherLostDaysInfo {
  teacherId: string;
  teacherName: string;
  reason: string;
  count: number;
}

// Subject progress type from batch
export interface SubjectProgressInfo {
  subjectId: string;
  subjectName: string;
  totalPlannedHours: number;
  totalActualHours: number;
  chaptersCompleted: number;
  totalChapters: number;
  currentChapter: string | null;
  currentChapterName: string | null;
  percentComplete: number;
  lostDays: number;
  lostDaysReasons: { reason: string; count: number }[];
}

// Status helpers
export const getStatusConfig = (status: string) => {
  switch (status) {
    case "ahead":
    case "completed":
      return { label: "Ahead", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    case "on_track":
    case "in_progress":
      return { label: "On Track", color: "text-blue-600 bg-blue-50 border-blue-200" };
    case "lagging":
      return { label: "Lagging", color: "text-amber-600 bg-amber-50 border-amber-200" };
    case "critical":
    case "not_started":
      return { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" };
    default:
      return { label: status, color: "text-muted-foreground bg-muted" };
  }
};

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  phy: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  mat: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  che: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  bio: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  eng: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  hin: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  sst: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  sci: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" },
};

/**
 * Get lost days breakdown by teacher for a specific batch and subject
 */
export function getLostDaysByTeacher(
  batchId: string,
  subjectId: string
): TeacherLostDaysInfo[] {
  const absences = teachingConfirmations.filter(
    c => c.batchId === batchId && 
         c.subjectId === subjectId && 
         !c.didTeach &&
         c.noTeachReason
  );
  
  if (absences.length === 0) return [];
  
  // Group by teacher and reason
  const teacherReasonMap = new Map<string, TeacherLostDaysInfo>();
  
  absences.forEach(conf => {
    const key = `${conf.teacherId}-${conf.noTeachReason}`;
    if (teacherReasonMap.has(key)) {
      teacherReasonMap.get(key)!.count += 1;
    } else {
      teacherReasonMap.set(key, {
        teacherId: conf.teacherId,
        teacherName: conf.teacherName,
        reason: conf.noTeachReason || "other",
        count: 1,
      });
    }
  });
  
  // Sort by count (descending), then by teacher name
  return Array.from(teacherReasonMap.values())
    .sort((a, b) => b.count - a.count || a.teacherName.localeCompare(b.teacherName));
}

/**
 * Get the primary teacher for a chapter based on teaching confirmations
 */
export function getChapterTeacher(
  batchId: string, 
  subjectId: string, 
  chapterId: string
): ChapterTeacherInfo | null {
  const chapterConfs = teachingConfirmations.filter(
    c => c.batchId === batchId &&
         c.subjectId === subjectId && 
         c.chapterId === chapterId && 
         c.didTeach
  );
  
  if (chapterConfs.length === 0) return null;
  
  // Aggregate by teacher
  const teacherMap = new Map<string, { name: string; hours: number }>();
  chapterConfs.forEach(c => {
    const existing = teacherMap.get(c.teacherId);
    if (existing) {
      existing.hours += c.periodsCount;
    } else {
      teacherMap.set(c.teacherId, { name: c.teacherName, hours: c.periodsCount });
    }
  });
  
  // Return primary teacher (most hours)
  const sorted = Array.from(teacherMap.entries()).sort((a, b) => b[1].hours - a[1].hours);
  return sorted[0] 
    ? { teacherId: sorted[0][0], teacherName: sorted[0][1].name, hours: sorted[0][1].hours } 
    : null;
}
