// Academic Planner Types
// Types for the Batch-First Auto-Sequence Monthly Grid Planner

import { AcademicWeek } from "./academicSchedule";

// ============================================
// Generated Plan Types
// ============================================

export interface ChapterWeekAssignment {
  chapterId: string;
  chapterName: string;
  plannedHours: number;
  startWeekIndex: number;
  endWeekIndex: number;
  hoursPerWeek: { weekIndex: number; hours: number }[];
  isLocked: boolean; // Prevent regeneration changes
  isPartialStart: boolean; // Continues from previous week
  isPartialEnd: boolean; // Continues to next week
  isModified?: boolean; // Track if manually adjusted
  modificationTypes?: ('reorder' | 'extend' | 'compress' | 'swap' | 'addHours' | 'removeHours' | 'manualAdd' | 'removeFromWeek')[]; // Types of modifications applied
}

export interface SubjectPlanData {
  subjectId: string;
  subjectName: string;
  weeklyHours: number;
  totalPlannedHours: number;
  chapterAssignments: ChapterWeekAssignment[];
}

export interface BatchAcademicPlan {
  id: string;
  batchId: string;
  batchName: string;
  classId: string;
  className: string;
  academicYear: string;
  subjects: SubjectPlanData[];
  startWeekIndex: number;
  endWeekIndex: number;
  status: 'draft' | 'published' | 'archived';
  generatedAt: string;
  publishedAt?: string;
  publishedBy?: string;
}

// ============================================
// Adjustment Types
// ============================================

export type AdjustmentType = 
  | 'extend' 
  | 'compress' 
  | 'swap' 
  | 'lock' 
  | 'unlock' 
  | 'addHours' 
  | 'removeHours' 
  | 'setHours'
  | 'removeFromWeek';

export interface ChapterAdjustment {
  type: AdjustmentType;
  subjectId: string;
  chapterId: string;
  weekIndex: number;
  newValue?: number | string;
  hours?: number; // For hour-based adjustments
  timestamp: string;
}

// ============================================
// Pending Chapter (for manual addition)
// ============================================

export interface PendingChapter {
  chapterId: string;
  chapterName: string;
  plannedHours: number;
  order: number;
}

// ============================================
// Week Cell Display Types
// ============================================

export type ChapterCellType = 
  | 'full'          // Full week on this chapter
  | 'start'         // Chapter starts this week
  | 'end'           // Chapter ends this week
  | 'middle'        // Chapter continues through this week
  | 'single'        // Chapter starts and ends this week
  | 'empty';        // No chapter planned

export interface WeekCellData {
  weekIndex: number;
  week: AcademicWeek;
  chapterId: string | null;
  chapterName: string | null;
  hours: number;
  cellType: ChapterCellType;
  isHoliday: boolean;
  holidayName?: string;
  isExamBlock: boolean;
  examName?: string;
  isPublished: boolean;
  isLocked: boolean;
}

export interface SubjectRowData {
  subjectId: string;
  subjectName: string;
  weeklyHours: number;
  cells: WeekCellData[];
  totalPlannedHours: number;
  totalAssignedHours: number;
}

// ============================================
// Planner State Types
// ============================================

export interface PlannerValidation {
  isValid: boolean;
  errors: PlannerError[];
  warnings: PlannerWarning[];
}

export interface PlannerError {
  type: 'missing_timetable' | 'missing_setup' | 'chapter_overflow' | 'invalid_sequence';
  subjectId?: string;
  message: string;
}

export interface PlannerWarning {
  type: 'holiday_conflict' | 'exam_conflict' | 'hours_mismatch';
  subjectId?: string;
  weekIndex?: number;
  message: string;
}

// ============================================
// Subject Colors (for visual consistency)
// ============================================

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  mat: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  sci: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  phy: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  che: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  bio: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  eng: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  hin: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  sst: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  jee_phy: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  jee_che: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200' },
  jee_mat: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
};

export const SUBJECT_ICONS: Record<string, string> = {
  mat: '📐',
  sci: '🔬',
  phy: '⚛️',
  che: '🧪',
  bio: '🧬',
  eng: '📖',
  hin: '📚',
  sst: '🌍',
  jee_phy: '⚡',
  jee_che: '🔥',
  jee_mat: '📊',
};

// ============================================
// Default/Helper Values
// ============================================

export const DEFAULT_WEEKLY_HOURS_PER_SUBJECT = 5;