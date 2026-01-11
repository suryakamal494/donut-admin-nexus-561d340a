// Academic Plan Generator Hook
// Handles the auto-sequence algorithm and plan state management
// Now decoupled from timetable data - uses academic setup and standalone mock data

import { useState, useCallback, useMemo, useEffect } from "react";
import { Batch, batches } from "@/data/instituteData";
import { academicScheduleSetups, academicWeeks, currentWeekIndex } from "@/data/academicScheduleData";
import {
  BatchAcademicPlan,
  ChapterAdjustment,
  PlannerValidation,
  PlannerError,
  PlannerWarning,
  SubjectPlanData,
  DEFAULT_WEEKLY_HOURS_PER_SUBJECT,
} from "@/types/academicPlanner";
import {
  generateSubjectPlan,
  getBatchSubjects,
} from "@/lib/academicPlannerUtils";
import {
  loadPlanForBatch,
  SavedAcademicPlan,
  publishMonthForPlan,
  getWeekEditabilityStatus,
  WeekEditabilityStatus,
} from "@/data/academicPlannerData";
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
  hasExistingPlan: boolean;
  
  // Actions
  generatePlan: () => void;
  clearPlan: () => void;
  applyAdjustment: (adjustment: ChapterAdjustment) => void;
  publishMonth: (monthIndex: number) => void;
  loadExistingPlan: () => void;
  reorderChapters: (subjectId: string, fromIndex: number, toIndex: number) => void;
  
  // Computed
  batch: Batch | null;
  weeklyHours: Record<string, number>;
  hasValidSetup: boolean;
  canEditWeek: (weekIndex: number, weekStartDate: Date) => boolean;
  getWeekStatus: (weekIndex: number, weekStartDate: Date) => WeekEditabilityStatus;
}

export function useAcademicPlanGenerator({
  batchId,
}: UseAcademicPlanGeneratorProps): UseAcademicPlanGeneratorReturn {
  const [plan, setPlan] = useState<BatchAcademicPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adjustments, setAdjustments] = useState<ChapterAdjustment[]>([]);
  const [publishedMonths, setPublishedMonths] = useState<Set<number>>(new Set());
  const [hasExistingPlan, setHasExistingPlan] = useState(false);
  
  // Get batch data
  const batch = useMemo(() => {
    return batches.find(b => b.id === batchId) || null;
  }, [batchId]);
  
  // Get weekly hours from academic setup (not timetable!)
  // Calculate based on total planned hours / estimated weeks
  const weeklyHours = useMemo(() => {
    if (!batch) return {};
    
    const batchSubjects = getBatchSubjects(batch);
    const hoursBySubject: Record<string, number> = {};
    
    batchSubjects.forEach(({ subjectId }) => {
      // Find setup for this subject
      const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
      
      if (setup && setup.chapters.length > 0) {
        // Calculate total hours from setup
        const totalHours = setup.chapters.reduce((sum, ch) => sum + ch.plannedHours, 0);
        // Estimate weekly hours (assuming ~20 weeks per term)
        const estimatedWeeks = 20;
        hoursBySubject[subjectId] = Math.ceil(totalHours / estimatedWeeks);
      } else {
        hoursBySubject[subjectId] = DEFAULT_WEEKLY_HOURS_PER_SUBJECT;
      }
    });
    
    return hoursBySubject;
  }, [batch]);
  
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
  
  // Load existing plan on batch change
  useEffect(() => {
    if (batchId) {
      const existingPlan = loadPlanForBatch(batchId);
      if (existingPlan) {
        setHasExistingPlan(true);
        // Convert saved plan to BatchAcademicPlan format
        setPlan({
          id: existingPlan.id,
          batchId: existingPlan.batchId,
          batchName: existingPlan.batchName,
          classId: `class-${existingPlan.className.match(/\d+/)?.[0] || '0'}`,
          className: existingPlan.className,
          academicYear: existingPlan.academicYear,
          subjects: existingPlan.subjects,
          startWeekIndex: existingPlan.startWeekIndex,
          endWeekIndex: existingPlan.endWeekIndex,
          status: existingPlan.status,
          generatedAt: existingPlan.createdAt,
          publishedAt: existingPlan.status === 'published' ? existingPlan.lastModifiedAt : undefined,
        });
        setPublishedMonths(new Set(existingPlan.publishedMonths));
        setAdjustments([]);
      } else {
        setHasExistingPlan(false);
        setPlan(null);
        setPublishedMonths(new Set());
        setAdjustments([]);
      }
    } else {
      setHasExistingPlan(false);
      setPlan(null);
      setPublishedMonths(new Set());
      setAdjustments([]);
    }
  }, [batchId]);
  
  // Validation - simplified without timetable requirement
  const validation = useMemo((): PlannerValidation => {
    const errors: PlannerError[] = [];
    const warnings: PlannerWarning[] = [];
    
    if (!batchId) {
      return { isValid: false, errors: [], warnings: [] };
    }
    
    // We no longer require timetable data!
    // Just check for academic setup
    
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
  }, [batchId, batch, hasValidSetup]);
  
  // Load existing plan
  const loadExistingPlan = useCallback(() => {
    if (!batchId) return;
    
    const existingPlan = loadPlanForBatch(batchId);
    if (existingPlan) {
      setPlan({
        id: existingPlan.id,
        batchId: existingPlan.batchId,
        batchName: existingPlan.batchName,
        classId: `class-${existingPlan.className.match(/\d+/)?.[0] || '0'}`,
        className: existingPlan.className,
        academicYear: existingPlan.academicYear,
        subjects: existingPlan.subjects,
        startWeekIndex: existingPlan.startWeekIndex,
        endWeekIndex: existingPlan.endWeekIndex,
        status: existingPlan.status,
        generatedAt: existingPlan.createdAt,
      });
      setPublishedMonths(new Set(existingPlan.publishedMonths));
      toast.success("Loaded existing plan");
    }
  }, [batchId]);
  
  // Generate plan - now uses academic setup hours instead of timetable
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
    
    // Simulate async generation
    setTimeout(() => {
      const batchSubjects = getBatchSubjects(batch);
      const subjects: SubjectPlanData[] = [];
      
      batchSubjects.forEach(({ subjectId, subjectName }) => {
        const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
        
        if (!setup || !setup.chapters.length) {
          subjects.push({
            subjectId,
            subjectName,
            weeklyHours: weeklyHours[subjectId] || DEFAULT_WEEKLY_HOURS_PER_SUBJECT,
            totalPlannedHours: 0,
            chapterAssignments: [],
          });
          return;
        }
        
        const subjectWeeklyHours = weeklyHours[subjectId] || DEFAULT_WEEKLY_HOURS_PER_SUBJECT;
        const subjectPlan = generateSubjectPlan(
          subjectId,
          subjectName,
          setup.chapters,
          subjectWeeklyHours,
          0, // Start from first week
          academicWeeks.length
        );
        
        subjects.push(subjectPlan);
      });
      
      // Calculate end week index
      const maxEndWeek = Math.max(
        ...subjects.flatMap(s => 
          s.chapterAssignments.map(c => c.endWeekIndex)
        ).filter(w => w !== undefined),
        0
      );
      
      const generatedPlan: BatchAcademicPlan = {
        id: `plan-${batch.id}-${Date.now()}`,
        batchId: batch.id,
        batchName: batch.name,
        classId: batch.classId,
        className: batch.className,
        academicYear: batch.academicYear,
        subjects,
        startWeekIndex: 0,
        endWeekIndex: maxEndWeek,
        status: 'draft',
        generatedAt: new Date().toISOString(),
      };
      
      setPlan(generatedPlan);
      setAdjustments([]);
      setPublishedMonths(new Set());
      
      const totalChapters = subjects.reduce(
        (sum, s) => sum + s.chapterAssignments.length, 
        0
      );
      const totalWeeks = maxEndWeek + 1;
      
      toast.success(
        `Plan generated: ${subjects.length} subjects, ${totalChapters} chapters across ${totalWeeks} weeks`
      );
      
      setIsGenerating(false);
    }, 500);
  }, [batch, validation.isValid, weeklyHours]);
  
  // Clear plan
  const clearPlan = useCallback(() => {
    setPlan(null);
    setAdjustments([]);
    setPublishedMonths(new Set());
    toast.info("Plan cleared");
  }, []);
  
  // Apply adjustment - modifies the plan in place
  const applyAdjustment = useCallback((adjustment: ChapterAdjustment) => {
    if (!plan) return;
    
    setAdjustments(prev => [...prev, adjustment]);
    
    // Create a deep copy of the plan to modify
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as BatchAcademicPlan;
    
    // Find the subject
    const subjectIndex = updatedPlan.subjects.findIndex(s => s.subjectId === adjustment.subjectId);
    if (subjectIndex === -1) return;
    
    const subject = updatedPlan.subjects[subjectIndex];
    
    // Find the chapter
    const chapterIndex = subject.chapterAssignments.findIndex(c => c.chapterId === adjustment.chapterId);
    if (chapterIndex === -1) return;
    
    const chapter = subject.chapterAssignments[chapterIndex];
    
    switch (adjustment.type) {
      case 'extend': {
        // Extend chapter by 1 week - push subsequent chapters
        chapter.endWeekIndex += 1;
        chapter.hoursPerWeek.push({
          weekIndex: chapter.endWeekIndex,
          hours: subject.weeklyHours,
        });
        chapter.plannedHours += subject.weeklyHours;
        chapter.isPartialEnd = false;
        
        // Push all subsequent chapters by 1 week
        for (let i = chapterIndex + 1; i < subject.chapterAssignments.length; i++) {
          const nextChapter = subject.chapterAssignments[i];
          nextChapter.startWeekIndex += 1;
          nextChapter.endWeekIndex += 1;
          nextChapter.hoursPerWeek = nextChapter.hoursPerWeek.map(h => ({
            ...h,
            weekIndex: h.weekIndex + 1,
          }));
        }
        
        toast.success(`Extended "${chapter.chapterName}" by 1 week`);
        break;
      }
      
      case 'compress': {
        // Compress chapter by 1 week if possible
        if (chapter.endWeekIndex > chapter.startWeekIndex) {
          const removedHours = chapter.hoursPerWeek.find(h => h.weekIndex === chapter.endWeekIndex)?.hours || 0;
          chapter.hoursPerWeek = chapter.hoursPerWeek.filter(h => h.weekIndex !== chapter.endWeekIndex);
          chapter.endWeekIndex -= 1;
          chapter.plannedHours -= removedHours;
          
          // Pull all subsequent chapters by 1 week
          for (let i = chapterIndex + 1; i < subject.chapterAssignments.length; i++) {
            const nextChapter = subject.chapterAssignments[i];
            nextChapter.startWeekIndex -= 1;
            nextChapter.endWeekIndex -= 1;
            nextChapter.hoursPerWeek = nextChapter.hoursPerWeek.map(h => ({
              ...h,
              weekIndex: h.weekIndex - 1,
            }));
          }
          
          toast.success(`Compressed "${chapter.chapterName}" by 1 week`);
        } else {
          toast.error("Cannot compress further - chapter spans only 1 week");
          return;
        }
        break;
      }
      
      case 'lock': {
        chapter.isLocked = true;
        toast.success(`Locked "${chapter.chapterName}"`);
        break;
      }
      
      case 'unlock': {
        chapter.isLocked = false;
        toast.success(`Unlocked "${chapter.chapterName}"`);
        break;
      }
      
      case 'swap': {
        // Swap with next chapter if exists
        if (chapterIndex < subject.chapterAssignments.length - 1) {
          const nextChapter = subject.chapterAssignments[chapterIndex + 1];
          
          // Store original positions
          const origStart = chapter.startWeekIndex;
          const origEnd = chapter.endWeekIndex;
          const nextStart = nextChapter.startWeekIndex;
          const nextEnd = nextChapter.endWeekIndex;
          
          // Calculate durations
          const chapterDuration = origEnd - origStart;
          const nextDuration = nextEnd - nextStart;
          
          // Swap positions
          chapter.startWeekIndex = origStart;
          chapter.endWeekIndex = origStart + nextDuration;
          nextChapter.startWeekIndex = chapter.endWeekIndex + 1;
          nextChapter.endWeekIndex = nextChapter.startWeekIndex + chapterDuration;
          
          // Recalculate hours per week
          chapter.hoursPerWeek = [];
          for (let w = chapter.startWeekIndex; w <= chapter.endWeekIndex; w++) {
            chapter.hoursPerWeek.push({ weekIndex: w, hours: subject.weeklyHours });
          }
          
          nextChapter.hoursPerWeek = [];
          for (let w = nextChapter.startWeekIndex; w <= nextChapter.endWeekIndex; w++) {
            nextChapter.hoursPerWeek.push({ weekIndex: w, hours: subject.weeklyHours });
          }
          
          // Swap array positions
          subject.chapterAssignments[chapterIndex] = nextChapter;
          subject.chapterAssignments[chapterIndex + 1] = chapter;
          
          toast.success(`Swapped "${chapter.chapterName}" with "${nextChapter.chapterName}"`);
        } else {
          toast.error("No next chapter to swap with");
          return;
        }
        break;
      }
    }
    
    // Update the end week index of the plan
    const maxEndWeek = Math.max(
      ...updatedPlan.subjects.flatMap(s => 
        s.chapterAssignments.map(c => c.endWeekIndex)
      )
    );
    updatedPlan.endWeekIndex = maxEndWeek;
    
    setPlan(updatedPlan);
  }, [plan]);
  
  // Publish month
  const publishMonth = useCallback((monthIndex: number) => {
    if (!batchId) return;
    
    // Get the actual month number from the month index
    const monthWeeks = academicWeeks.filter((week, idx) => {
      const date = new Date(week.startDate);
      // Group by month and check index
      return true; // We need to map monthIndex to actual month
    });
    
    // For now, use monthIndex directly as month number (0 = Jan, etc.)
    // In production, this should map to actual calendar months
    const actualMonth = monthIndex;
    
    setPublishedMonths(prev => new Set([...prev, actualMonth]));
    publishMonthForPlan(batchId, actualMonth);
    
    if (plan) {
      setPlan({
        ...plan,
        status: 'published',
        publishedAt: new Date().toISOString(),
      });
    }
    
    toast.success("Month published successfully");
  }, [plan, batchId]);
  
  // Check if a week can be edited
  const canEditWeek = useCallback((weekIndex: number, weekStartDate: Date): boolean => {
    // Past weeks cannot be edited
    if (weekIndex < currentWeekIndex) return false;
    
    // Published months cannot be edited
    const weekMonth = weekStartDate.getMonth();
    if (publishedMonths.has(weekMonth)) return false;
    
    return true;
  }, [publishedMonths]);
  
  // Get week editability status
  const getWeekStatus = useCallback((weekIndex: number, weekStartDate: Date): WeekEditabilityStatus => {
    return getWeekEditabilityStatus(
      weekIndex,
      currentWeekIndex,
      Array.from(publishedMonths),
      weekStartDate
    );
  }, [publishedMonths]);
  
  // Reorder chapters within a subject
  const reorderChapters = useCallback((
    subjectId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    if (!plan) return;
    if (fromIndex === toIndex) return;
    
    // Create a deep copy of the plan
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as BatchAcademicPlan;
    
    // Find the subject
    const subjectIndex = updatedPlan.subjects.findIndex(s => s.subjectId === subjectId);
    if (subjectIndex === -1) return;
    
    const subject = updatedPlan.subjects[subjectIndex];
    
    if (fromIndex < 0 || fromIndex >= subject.chapterAssignments.length) return;
    if (toIndex < 0 || toIndex >= subject.chapterAssignments.length) return;
    
    // Swap the two chapters
    const temp = subject.chapterAssignments[fromIndex];
    subject.chapterAssignments[fromIndex] = subject.chapterAssignments[toIndex];
    subject.chapterAssignments[toIndex] = temp;
    
    // Recalculate all week positions for the subject
    let currentWeekStart = 0;
    
    // Find the minimum startWeekIndex from the original plan
    const originalMinStart = Math.min(
      ...plan.subjects[subjectIndex].chapterAssignments.map(c => c.startWeekIndex)
    );
    currentWeekStart = originalMinStart;
    
    subject.chapterAssignments.forEach((chapter) => {
      const duration = chapter.endWeekIndex - chapter.startWeekIndex;
      chapter.startWeekIndex = currentWeekStart;
      chapter.endWeekIndex = currentWeekStart + duration;
      
      // Recalculate hoursPerWeek
      chapter.hoursPerWeek = [];
      for (let w = chapter.startWeekIndex; w <= chapter.endWeekIndex; w++) {
        chapter.hoursPerWeek.push({ weekIndex: w, hours: subject.weeklyHours });
      }
      
      currentWeekStart = chapter.endWeekIndex + 1;
    });
    
    // Update the end week index of the plan
    const maxEndWeek = Math.max(
      ...updatedPlan.subjects.flatMap(s => 
        s.chapterAssignments.map(c => c.endWeekIndex)
      )
    );
    updatedPlan.endWeekIndex = maxEndWeek;
    
    setPlan(updatedPlan);
    
    const movedChapter = subject.chapterAssignments[toIndex];
    toast.success(`Moved "${movedChapter.chapterName}" to position ${toIndex + 1}`);
  }, [plan]);
  
  return {
    plan,
    isGenerating,
    validation,
    adjustments,
    publishedMonths,
    hasExistingPlan,
    generatePlan,
    clearPlan,
    applyAdjustment,
    publishMonth,
    loadExistingPlan,
    reorderChapters,
    batch,
    weeklyHours,
    hasValidSetup,
    canEditWeek,
    getWeekStatus,
  };
}
