// Academic Plan Generator Hook
// Handles the auto-sequence algorithm and plan state management

import { useState, useCallback, useMemo } from "react";
import { Batch, batches } from "@/data/instituteData";
import { academicScheduleSetups, academicWeeks, currentWeekIndex } from "@/data/academicScheduleData";
import { timetableEntries } from "@/data/timetableData";
import {
  BatchAcademicPlan,
  ChapterAdjustment,
  PlannerValidation,
  PlannerError,
  PlannerWarning,
} from "@/types/academicPlanner";
import {
  generateBatchPlan,
  getWeeklyHoursForBatch,
  getBatchSubjects,
} from "@/lib/academicPlannerUtils";
import { toast } from "sonner";

interface UseAcademicPlanGeneratorProps {
  batchId: string | null;
}

interface UseAcademicPlanGeneratorReturn {
  // State
  plan: BatchAcademicPlan | null;
  isGenerating: boolean;
  validation: PlannerValidation;
  adjustments: ChapterAdjustment[];
  publishedMonths: Set<number>;
  
  // Actions
  generatePlan: () => void;
  clearPlan: () => void;
  applyAdjustment: (adjustment: ChapterAdjustment) => void;
  publishMonth: (monthIndex: number) => void;
  
  // Computed
  batch: Batch | null;
  weeklyHours: Record<string, number>;
  hasValidSetup: boolean;
  hasValidTimetable: boolean;
}

export function useAcademicPlanGenerator({
  batchId,
}: UseAcademicPlanGeneratorProps): UseAcademicPlanGeneratorReturn {
  const [plan, setPlan] = useState<BatchAcademicPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adjustments, setAdjustments] = useState<ChapterAdjustment[]>([]);
  const [publishedMonths, setPublishedMonths] = useState<Set<number>>(new Set());
  
  // Get batch data
  const batch = useMemo(() => {
    return batches.find(b => b.id === batchId) || null;
  }, [batchId]);
  
  // Get weekly hours from timetable
  const weeklyHours = useMemo(() => {
    if (!batchId) return {};
    return getWeeklyHoursForBatch(batchId, timetableEntries);
  }, [batchId]);
  
  // Check if batch has valid timetable data
  const hasValidTimetable = useMemo(() => {
    if (!batchId) return false;
    const hours = Object.values(weeklyHours);
    return hours.length > 0 && hours.some(h => h > 0);
  }, [batchId, weeklyHours]);
  
  // Check if batch has valid academic setup
  const hasValidSetup = useMemo(() => {
    if (!batch) return false;
    const batchSubjects = getBatchSubjects(batch);
    
    // Check if at least some subjects have setups
    const subjectsWithSetup = batchSubjects.filter(s => 
      academicScheduleSetups.some(setup => 
        setup.subjectId === s.subjectId && setup.chapters.length > 0
      )
    );
    
    return subjectsWithSetup.length > 0;
  }, [batch]);
  
  // Validation
  const validation = useMemo((): PlannerValidation => {
    const errors: PlannerError[] = [];
    const warnings: PlannerWarning[] = [];
    
    if (!batchId) {
      return { isValid: false, errors: [], warnings: [] };
    }
    
    if (!hasValidTimetable) {
      errors.push({
        type: 'missing_timetable',
        message: 'No timetable configured for this batch. Please set up the timetable first.',
      });
    }
    
    if (!hasValidSetup) {
      errors.push({
        type: 'missing_setup',
        message: 'No academic schedule setup found. Please configure chapter hours first.',
      });
    }
    
    // Check for subjects without setup
    if (batch) {
      const batchSubjects = getBatchSubjects(batch);
      batchSubjects.forEach(s => {
        const hasSetup = academicScheduleSetups.some(
          setup => setup.subjectId === s.subjectId && setup.chapters.length > 0
        );
        if (!hasSetup) {
          warnings.push({
            type: 'hours_mismatch',
            subjectId: s.subjectId,
            message: `${s.subjectName} has no chapter setup configured.`,
          });
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, [batchId, batch, hasValidTimetable, hasValidSetup]);
  
  // Generate plan
  const generatePlan = useCallback(() => {
    if (!batch) {
      toast.error("Please select a batch first");
      return;
    }
    
    if (!validation.isValid) {
      toast.error("Cannot generate plan. Please fix the errors first.");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate async generation (in real app, this might call an API)
    setTimeout(() => {
      const generatedPlan = generateBatchPlan(
        batch,
        academicScheduleSetups,
        timetableEntries,
        academicWeeks,
        0 // Start from first week
      );
      
      if (generatedPlan) {
        setPlan(generatedPlan);
        setAdjustments([]);
        
        const totalChapters = generatedPlan.subjects.reduce(
          (sum, s) => sum + s.chapterAssignments.length, 
          0
        );
        const totalWeeks = generatedPlan.endWeekIndex - generatedPlan.startWeekIndex + 1;
        
        toast.success(
          `Plan generated: ${generatedPlan.subjects.length} subjects, ${totalChapters} chapters across ${totalWeeks} weeks`
        );
      } else {
        toast.error("Failed to generate plan");
      }
      
      setIsGenerating(false);
    }, 500);
  }, [batch, validation.isValid]);
  
  // Clear plan
  const clearPlan = useCallback(() => {
    setPlan(null);
    setAdjustments([]);
    setPublishedMonths(new Set());
    toast.info("Plan cleared");
  }, []);
  
  // Apply adjustment
  const applyAdjustment = useCallback((adjustment: ChapterAdjustment) => {
    setAdjustments(prev => [...prev, adjustment]);
    
    // TODO: Apply adjustment to plan
    // This would modify the chapter assignments based on the adjustment type
    
    toast.success(`Adjustment applied: ${adjustment.type}`);
  }, []);
  
  // Publish month
  const publishMonth = useCallback((monthIndex: number) => {
    setPublishedMonths(prev => new Set([...prev, monthIndex]));
    
    if (plan) {
      setPlan({
        ...plan,
        status: 'published',
        publishedAt: new Date().toISOString(),
      });
    }
    
    toast.success("Month published successfully");
  }, [plan]);
  
  return {
    plan,
    isGenerating,
    validation,
    adjustments,
    publishedMonths,
    generatePlan,
    clearPlan,
    applyAdjustment,
    publishMonth,
    batch,
    weeklyHours,
    hasValidSetup,
    hasValidTimetable,
  };
}
