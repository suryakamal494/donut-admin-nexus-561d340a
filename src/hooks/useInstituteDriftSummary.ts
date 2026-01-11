import { useMemo } from "react";
import { 
  ChapterDriftStatus, 
  DriftSeverity,
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
 * Hook to aggregate drift data across all batches in the institute
 * Returns sorted list (critical first) of all unresolved drift items
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

        // Calculate actual hours per chapter
        const actualHoursMap = new Map<string, number>();
        confirmations.forEach(conf => {
          if (conf.chapterId) {
            const current = actualHoursMap.get(conf.chapterId) || 0;
            actualHoursMap.set(conf.chapterId, current + conf.periodsCount);
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
