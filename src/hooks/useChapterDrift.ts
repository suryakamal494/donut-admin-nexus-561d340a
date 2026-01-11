import { useMemo } from "react";
import { 
  ChapterDriftStatus, 
  DriftSeverity, 
  ScheduleAdjustment,
  DRIFT_THRESHOLDS 
} from "@/types/academicSchedule";
import { 
  academicScheduleSetups, 
  teachingConfirmations,
  scheduleAdjustments,
} from "@/data/academicScheduleData";

interface DriftSummary {
  totalDriftHours: number;
  affectedChapters: number;
  maxSeverity: DriftSeverity;
  chaptersWithDrift: ChapterDriftStatus[];
  adjustments: ScheduleAdjustment[];
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
 * Hook to calculate chapter drift for a batch/subject
 */
export function useChapterDrift(
  batchId: string,
  subjectId: string,
  classId?: string
): DriftSummary {
  return useMemo(() => {
    // Find the subject setup
    const setup = academicScheduleSetups.find(s => 
      s.subjectId === subjectId && 
      (classId ? s.classId === classId : true)
    );

    if (!setup) {
      return {
        totalDriftHours: 0,
        affectedChapters: 0,
        maxSeverity: "minor",
        chaptersWithDrift: [],
        adjustments: [],
      };
    }

    // Get teaching confirmations for this batch/subject
    const confirmations = teachingConfirmations.filter(
      c => c.batchId === batchId && c.subjectId === subjectId && c.didTeach
    );

    // Calculate actual hours per chapter
    const actualHoursMap = new Map<string, number>();
    confirmations.forEach(conf => {
      if (conf.chapterId) {
        const current = actualHoursMap.get(conf.chapterId) || 0;
        actualHoursMap.set(conf.chapterId, current + conf.periodsCount);
      }
    });

    // Get adjustments for this batch/subject
    const batchAdjustments = scheduleAdjustments.filter(
      a => a.batchId === batchId && a.subjectId === subjectId
    );

    // Calculate drift for each chapter
    const chaptersWithDrift: ChapterDriftStatus[] = [];
    let totalDriftHours = 0;
    let affectedChapters = 0;
    let maxSeverity: DriftSeverity = "minor";

    setup.chapters.forEach(chapter => {
      const plannedHours = chapter.plannedHours;
      const actualHours = actualHoursMap.get(chapter.chapterId) || 0;
      
      // Drift = actual - planned (positive = over plan)
      // For in-progress chapters, we check if they're taking longer than expected
      const driftHours = actualHours - plannedHours;
      const driftPercentage = plannedHours > 0 
        ? Math.round((driftHours / plannedHours) * 100) 
        : 0;

      // Only count drift if there's actual teaching happening
      if (actualHours > 0 && driftHours !== 0) {
        const severity = getDriftSeverity(driftHours);
        const hasAdjustment = batchAdjustments.some(
          a => a.chapterId === chapter.chapterId
        );

        chaptersWithDrift.push({
          batchId,
          subjectId,
          chapterId: chapter.chapterId,
          chapterName: chapter.chapterName,
          plannedHours,
          actualHours,
          driftHours,
          driftPercentage,
          severity,
          isResolved: hasAdjustment,
          lastAdjustmentId: hasAdjustment 
            ? batchAdjustments.find(a => a.chapterId === chapter.chapterId)?.id 
            : undefined,
        });

        if (!hasAdjustment) {
          totalDriftHours += Math.abs(driftHours);
          affectedChapters++;
          
          // Track max severity
          if (severity === "critical") maxSeverity = "critical";
          else if (severity === "significant" && maxSeverity !== "critical") {
            maxSeverity = "significant";
          }
        }
      }
    });

    return {
      totalDriftHours,
      affectedChapters,
      maxSeverity,
      chaptersWithDrift,
      adjustments: batchAdjustments,
    };
  }, [batchId, subjectId, classId]);
}

/**
 * Get all unresolved drift across all subjects for a batch
 */
export function useBatchDriftSummary(batchId: string, subjectIds: string[]) {
  return useMemo(() => {
    let totalDrift = 0;
    let totalAffected = 0;
    let maxSeverity: DriftSeverity = "minor";
    const subjectDrifts: Record<string, number> = {};

    subjectIds.forEach(subjectId => {
      const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
      if (!setup) return;

      const confirmations = teachingConfirmations.filter(
        c => c.batchId === batchId && c.subjectId === subjectId && c.didTeach
      );

      const actualHoursMap = new Map<string, number>();
      confirmations.forEach(conf => {
        if (conf.chapterId) {
          const current = actualHoursMap.get(conf.chapterId) || 0;
          actualHoursMap.set(conf.chapterId, current + conf.periodsCount);
        }
      });

      const adjustments = scheduleAdjustments.filter(
        a => a.batchId === batchId && a.subjectId === subjectId
      );

      let subjectDrift = 0;
      setup.chapters.forEach(chapter => {
        const actual = actualHoursMap.get(chapter.chapterId) || 0;
        const drift = actual - chapter.plannedHours;
        const hasAdjustment = adjustments.some(a => a.chapterId === chapter.chapterId);
        
        if (actual > 0 && drift !== 0 && !hasAdjustment) {
          subjectDrift += Math.abs(drift);
          totalAffected++;
          const severity = getDriftSeverity(drift);
          if (severity === "critical") maxSeverity = "critical";
          else if (severity === "significant" && maxSeverity !== "critical") {
            maxSeverity = "significant";
          }
        }
      });

      subjectDrifts[subjectId] = subjectDrift;
      totalDrift += subjectDrift;
    });

    return {
      totalDrift,
      totalAffected,
      maxSeverity,
      subjectDrifts,
      hasSignificantDrift: totalDrift >= DRIFT_THRESHOLDS.significant,
    };
  }, [batchId, subjectIds]);
}
