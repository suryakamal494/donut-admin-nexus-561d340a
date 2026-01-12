import { useMemo } from "react";
import { 
  ChapterDriftStatus, 
  DriftSeverity,
  DriftCause,
  DriftAnalysis,
  TeacherHoursBreakdown,
  DRIFT_THRESHOLDS 
} from "@/types/academicSchedule";
import { 
  academicScheduleSetups, 
  teachingConfirmations,
  scheduleAdjustments,
  batchProgressSummaries,
} from "@/data/academicScheduleData";

export interface DriftItem {
  batchId: string;
  batchName: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  plannedHours: number;
  actualHours: number;
  driftHours: number;
  driftDirection: "over" | "behind";
  severity: DriftSeverity;
  isResolved: boolean;
  // Teacher attribution
  teacherId?: string;
  teacherName?: string;
  teacherHoursBreakdown?: TeacherHoursBreakdown[];
  driftAnalysis?: DriftAnalysis;
}

export interface InstituteDriftSummary {
  totalIssues: number;
  criticalCount: number;
  significantCount: number;
  minorCount: number;
  batchesWithDrift: number;
  driftItems: DriftItem[];
  hasAnyDrift: boolean;
}

/**
 * Calculate drift severity based on hours
 */
function getDriftSeverity(driftHours: number): DriftSeverity {
  const absDrift = Math.abs(driftHours);
  if (absDrift >= DRIFT_THRESHOLDS.critical) return "critical";
  if (absDrift >= DRIFT_THRESHOLDS.significant) return "significant";
  return "minor";
}

/**
 * Analyze the cause of drift based on teaching confirmations
 */
function analyzeDriftCause(
  batchId: string,
  subjectId: string,
  chapterId: string,
  driftHours: number,
  teacherBreakdown: TeacherHoursBreakdown[]
): DriftAnalysis {
  // Get all confirmations for this batch/subject (not just for the chapter)
  const allConfs = teachingConfirmations.filter(
    c => c.batchId === batchId && c.subjectId === subjectId
  );
  
  // Check for absences
  const absences = allConfs.filter(c => !c.didTeach);
  const teacherAbsences = absences.filter(c => c.noTeachReason === "teacher_absent");
  const otherAbsences = absences.filter(c => c.noTeachReason !== "teacher_absent");
  
  // Get primary teacher
  const primaryTeacher = teacherBreakdown.length > 0 
    ? teacherBreakdown.sort((a, b) => b.hours - a.hours)[0]
    : null;

  // Drift is POSITIVE (over plan) - teacher took extra time
  if (driftHours > 0) {
    return {
      cause: "extended_teaching",
      description: `Chapter required ${driftHours}h more than planned`,
      teacherResponsible: primaryTeacher?.teacherName,
    };
  }
  
  // Drift is NEGATIVE (behind) - check why
  if (teacherAbsences.length > 0) {
    // Find which teacher was absent
    const absentTeacher = teacherAbsences[0]?.teacherName || "Unknown";
    return {
      cause: "teacher_absence",
      description: `${teacherAbsences.length} class(es) missed due to teacher absence`,
      teacherResponsible: absentTeacher,
      daysLost: teacherAbsences.length,
    };
  }
  
  if (otherAbsences.length > 0) {
    return {
      cause: "other_absence",
      description: `${otherAbsences.length} class(es) missed due to holidays/exams`,
      daysLost: otherAbsences.length,
    };
  }
  
  // Behind schedule but no recorded absences
  return {
    cause: "behind_schedule",
    description: `${Math.abs(driftHours)}h behind planned schedule`,
    teacherResponsible: primaryTeacher?.teacherName,
  };
}

/**
 * Hook to aggregate drift data across all batches in the institute
 * Returns sorted list (critical first) of all unresolved drift items with teacher attribution
 */
export function useInstituteDriftSummary(): InstituteDriftSummary {
  return useMemo(() => {
    const driftItems: DriftItem[] = [];
    const batchesWithDriftSet = new Set<string>();

    // Iterate through all batches
    batchProgressSummaries.forEach(batch => {
      // For each subject in the batch
      batch.subjects.forEach(subject => {
        // Find the setup for this subject
        const setup = academicScheduleSetups.find(s => 
          s.subjectId === subject.subjectId
        );
        
        if (!setup) return;

        // Get teaching confirmations for this batch/subject
        const confirmations = teachingConfirmations.filter(
          c => c.batchId === batch.batchId && c.subjectId === subject.subjectId && c.didTeach
        );

        // Calculate actual hours per chapter AND track teacher breakdown
        const actualHoursMap = new Map<string, number>();
        const teacherBreakdownMap = new Map<string, Map<string, { teacherId: string; teacherName: string; hours: number }>>();
        
        confirmations.forEach(conf => {
          if (conf.chapterId) {
            // Aggregate hours
            const current = actualHoursMap.get(conf.chapterId) || 0;
            actualHoursMap.set(conf.chapterId, current + conf.periodsCount);
            
            // Track teacher breakdown per chapter
            if (!teacherBreakdownMap.has(conf.chapterId)) {
              teacherBreakdownMap.set(conf.chapterId, new Map());
            }
            const chapterTeachers = teacherBreakdownMap.get(conf.chapterId)!;
            
            if (chapterTeachers.has(conf.teacherId)) {
              const existing = chapterTeachers.get(conf.teacherId)!;
              existing.hours += conf.periodsCount;
            } else {
              chapterTeachers.set(conf.teacherId, {
                teacherId: conf.teacherId,
                teacherName: conf.teacherName,
                hours: conf.periodsCount,
              });
            }
          }
        });

        // Get existing adjustments
        const batchAdjustments = scheduleAdjustments.filter(
          a => a.batchId === batch.batchId && a.subjectId === subject.subjectId
        );

        // Check each chapter for drift
        setup.chapters.forEach(chapter => {
          const plannedHours = chapter.plannedHours;
          const actualHours = actualHoursMap.get(chapter.chapterId) || 0;
          const driftHours = actualHours - plannedHours;
          const absDrift = Math.abs(driftHours);

          // Only consider significant drift (>= 2 hours) with actual teaching
          if (actualHours > 0 && absDrift >= DRIFT_THRESHOLDS.minor) {
            const hasAdjustment = batchAdjustments.some(
              a => a.chapterId === chapter.chapterId
            );

            // Only include unresolved drift
            if (!hasAdjustment) {
              batchesWithDriftSet.add(batch.batchId);
              
              // Get teacher breakdown for this chapter
              const chapterTeachersMap = teacherBreakdownMap.get(chapter.chapterId);
              const teacherBreakdown: TeacherHoursBreakdown[] = chapterTeachersMap 
                ? Array.from(chapterTeachersMap.values()).sort((a, b) => b.hours - a.hours)
                : [];
              
              // Primary teacher (most hours)
              const primaryTeacher = teacherBreakdown[0];
              
              // Analyze drift cause
              const driftAnalysis = analyzeDriftCause(
                batch.batchId,
                subject.subjectId,
                chapter.chapterId,
                driftHours,
                teacherBreakdown
              );
              
              driftItems.push({
                batchId: batch.batchId,
                batchName: batch.batchName,
                className: batch.className,
                subjectId: subject.subjectId,
                subjectName: subject.subjectName,
                chapterId: chapter.chapterId,
                chapterName: chapter.chapterName,
                plannedHours,
                actualHours,
                driftHours,
                driftDirection: driftHours > 0 ? "over" : "behind",
                severity: getDriftSeverity(driftHours),
                isResolved: false,
                // Teacher attribution
                teacherId: primaryTeacher?.teacherId,
                teacherName: primaryTeacher?.teacherName,
                teacherHoursBreakdown: teacherBreakdown,
                driftAnalysis,
              });
            }
          }
        });
      });
    });

    // Sort by severity (critical first, then significant, then minor)
    const severityOrder: Record<DriftSeverity, number> = {
      critical: 0,
      significant: 1,
      minor: 2,
    };
    
    driftItems.sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      // Secondary sort by absolute drift hours (higher first)
      return Math.abs(b.driftHours) - Math.abs(a.driftHours);
    });

    // Calculate counts
    const criticalCount = driftItems.filter(d => d.severity === "critical").length;
    const significantCount = driftItems.filter(d => d.severity === "significant").length;
    const minorCount = driftItems.filter(d => d.severity === "minor").length;

    return {
      totalIssues: driftItems.length,
      criticalCount,
      significantCount,
      minorCount,
      batchesWithDrift: batchesWithDriftSet.size,
      driftItems,
      hasAnyDrift: driftItems.length > 0,
    };
  }, []);
}
