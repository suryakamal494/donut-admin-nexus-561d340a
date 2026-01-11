// Academic Schedule Components - Index Exports
// This file exports all academic schedule related components

// Re-export types for convenience
export type {
  AcademicScheduleSetup,
  WeeklyChapterPlan,
  TeachingConfirmation,
  ChapterProgress,
  SubjectProgress,
  BatchProgressSummary,
  PendingConfirmation,
  AcademicWeek,
  ChapterHourAllocation,
  NoTeachReason,
  ChapterStatus,
  // Drift Management Types
  ChapterDriftStatus,
  ScheduleAdjustment,
  DriftSeverity,
  AdjustmentAction,
} from "@/types/academicSchedule";

// Export constants
export { 
  NO_TEACH_REASON_LABELS,
  ADJUSTMENT_ACTION_LABELS,
  DRIFT_THRESHOLDS,
} from "@/types/academicSchedule";

// Export components
export { BatchPlanAccordion } from "./BatchPlanAccordion";
export { SetupProgressMatrix } from "./SetupProgressMatrix";
export { WeekNavigator } from "./WeekNavigator";
export { UrgencySection } from "./UrgencySection";
export { ProgressBatchCard } from "./ProgressBatchCard";
export { DriftAlertBanner } from "./DriftAlertBanner";
export { ScheduleAdjustmentDialog } from "./ScheduleAdjustmentDialog";
export { AdjustmentHistoryPanel } from "./AdjustmentHistoryPanel";
export { DriftSummarySheet } from "./DriftSummarySheet";
export { BatchPlanSelector } from "./BatchPlanSelector";
export { MonthPlanGrid } from "./MonthPlanGrid";
export { ChapterAdjustmentPopover } from "./ChapterAdjustmentPopover";
