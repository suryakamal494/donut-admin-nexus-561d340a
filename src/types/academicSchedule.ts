// Academic Schedule Tracking Types
// Core types for managing academic schedule setup, planning, and progress tracking

// ============================================
// STAGE 1: Academic Schedule Setup (Foundation)
// ============================================

export interface ChapterHourAllocation {
  chapterId: string;
  chapterName: string;
  plannedHours: number;
  order: number;
}

export interface AcademicScheduleSetup {
  id: string;
  courseId: string;           // "cbse" | "jee-mains" | etc.
  classId?: string;           // For curriculum-based (CBSE) - optional for courses
  subjectId: string;
  subjectName: string;
  academicYear: string;
  chapters: ChapterHourAllocation[];
  totalPlannedHours: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// STAGE 2: Weekly/Daily Academic Plan (Intent)
// ============================================

export interface DailyChapterPlan {
  date: string;               // ISO date string
  chapterIds: string[];
}

export interface WeeklyChapterPlan {
  id: string;
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  courseId: string;
  weekStartDate: string;      // ISO date (Monday of the week)
  weekEndDate: string;        // ISO date (Saturday/Sunday)
  plannedChapters: string[];  // Chapter IDs
  granularity: "weekly" | "daily";
  dailyPlans?: DailyChapterPlan[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// STAGE 3: Teaching Confirmation (Reality)
// ============================================

export type NoTeachReason = 
  | "teacher_absent" 
  | "student_event" 
  | "exam" 
  | "holiday" 
  | "cancelled" 
  | "other";

export interface TeachingConfirmation {
  id: string;
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string;               // ISO date
  didTeach: boolean;
  chapterId?: string;
  chapterName?: string;
  topicIds?: string[];
  topicNames?: string[];
  noTeachReason?: NoTeachReason;
  noTeachNote?: string;
  periodsCount: number;       // From timetable
  confirmedAt: string;
  confirmedBy: "teacher" | "academic_incharge";
}

// ============================================
// Progress Tracking & Analytics
// ============================================

// Chapter plan status for visual indicators in Weekly Plans
export type ChapterPlanStatus = 'pending' | 'in_progress' | 'completed';

export type ChapterStatus = 
  | "not_started" 
  | "in_progress" 
  | "completed" 
  | "lagging"
  | "ahead";

export interface ChapterProgress {
  batchId: string;
  subjectId: string;
  chapterId: string;
  chapterName: string;
  plannedHours: number;
  actualHours: number;
  plannedWeeks: string[];     // Week start dates when planned
  status: ChapterStatus;
  percentComplete: number;
  completedAt?: string;
}

export interface SubjectProgress {
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  totalPlannedHours: number;
  totalActualHours: number;
  chaptersCompleted: number;
  totalChapters: number;
  currentChapter?: string;
  currentChapterName?: string;
  overallStatus: ChapterStatus;
  percentComplete: number;
  lostDays: number;
  lostDaysReasons: { reason: NoTeachReason; count: number }[];
}

export interface BatchProgressSummary {
  batchId: string;
  batchName: string;
  className: string;
  subjects: SubjectProgress[];
  overallProgress: number;
  status: "on_track" | "lagging" | "ahead" | "critical";
}

// ============================================
// Pending Confirmations (for Admin Override)
// ============================================

export interface PendingConfirmation {
  id: string;
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  expectedPeriods: number;
  daysOverdue: number;
}

// ============================================
// Helper Types
// ============================================

export interface AcademicWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  label: string;              // e.g., "Week 1 (Apr 1 - Apr 6)"
}

export const NO_TEACH_REASON_LABELS: Record<NoTeachReason, string> = {
  teacher_absent: "Teacher Absent",
  student_event: "Student Event / Function",
  exam: "Examination",
  holiday: "Holiday",
  cancelled: "Class Cancelled",
  other: "Other",
};

// ============================================
// Drift Management Types
// ============================================

export type DriftSeverity = "minor" | "significant" | "critical";

export type AdjustmentAction = 
  | "extend_chapter"      // Push completion date
  | "compress_future"     // Cover more per period
  | "add_compensatory"    // Extra class
  | "accept_variance";    // Acknowledge, no action

// Drift cause analysis
export type DriftCause = 
  | "extended_teaching"   // Teacher took more time than planned
  | "teacher_absence"     // Lost days due to teacher absence
  | "other_absence"       // Holiday, exam, event
  | "behind_schedule"     // Not enough teaching happened
  | "unknown";

export interface TeacherHoursBreakdown {
  teacherId: string;
  teacherName: string;
  hours: number;
  absences?: number;
}

export interface DriftAnalysis {
  cause: DriftCause;
  description: string;
  teacherResponsible?: string;
  daysLost?: number;
}

export interface ChapterDriftStatus {
  batchId: string;
  subjectId: string;
  chapterId: string;
  chapterName: string;
  plannedHours: number;
  actualHours: number;
  driftHours: number;           // Positive = over plan, Negative = behind
  driftPercentage: number;
  severity: DriftSeverity;
  isResolved: boolean;
  lastAdjustmentId?: string;
  // New: Teacher attribution
  teacherId?: string;
  teacherName?: string;
  teacherHoursBreakdown?: TeacherHoursBreakdown[];
  driftAnalysis?: DriftAnalysis;
}

export interface ScheduleAdjustment {
  id: string;
  batchId: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  action: AdjustmentAction;
  driftHoursBefore: number;     // Drift at time of adjustment
  impactDescription: string;    // What happens as a result
  notes?: string;               // Admin notes
  adjustedBy: string;           // User who made adjustment
  adjustedAt: string;           // ISO date
}

export const ADJUSTMENT_ACTION_LABELS: Record<AdjustmentAction, string> = {
  extend_chapter: "Extend Chapter Timeline",
  compress_future: "Compress Future Teaching",
  add_compensatory: "Add Compensatory Class",
  accept_variance: "Accept Current Variance",
};

export const DRIFT_CAUSE_LABELS: Record<DriftCause, string> = {
  extended_teaching: "Extended Teaching",
  teacher_absence: "Teacher Absence",
  other_absence: "Holiday/Exam/Event",
  behind_schedule: "Behind Schedule",
  unknown: "Unknown",
};

export const DRIFT_THRESHOLDS = {
  minor: 2,      // 1-2 hours drift
  significant: 4, // 3-4 hours drift
  critical: 5,    // 5+ hours drift
} as const;
