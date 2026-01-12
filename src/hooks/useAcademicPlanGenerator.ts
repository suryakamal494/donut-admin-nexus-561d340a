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

// History entry for undo functionality
export interface PlanHistoryEntry {
  id: string;
  type: ChapterAdjustment['type'];
  subjectId: string;
  chapterId: string;
  chapterName: string;
  subjectName: string;
  timestamp: Date;
  description: string;
  // Snapshot for undo
  previousPlanSnapshot: string; // JSON stringified plan
}

interface UseAcademicPlanGeneratorReturn {
  // State
  plan: BatchAcademicPlan | null;
  isGenerating: boolean;
  validation: PlannerValidation;
  adjustments: ChapterAdjustment[];
  publishedMonths: Set<number>;
  hasExistingPlan: boolean;
  history: PlanHistoryEntry[];
  
  // Actions
  generatePlan: () => void;
  clearPlan: () => void;
  applyAdjustment: (adjustment: ChapterAdjustment) => void;
  publishMonth: (monthIndex: number) => void;
  loadExistingPlan: () => void;
  reorderChapters: (subjectId: string, fromIndex: number, toIndex: number) => void;
  addChapterManually: (subjectId: string, chapterId: string, weekIndex: number, hours: number) => void;
  undoToEntry: (entryId: string) => void;
  clearHistory: () => void;
  resetSubjectToOriginal: (subjectId: string) => void;
  
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
  const [history, setHistory] = useState<PlanHistoryEntry[]>([]);
  // Store original generated plan for reset
  const [originalPlan, setOriginalPlan] = useState<BatchAcademicPlan | null>(null);
  
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
      setOriginalPlan(JSON.parse(JSON.stringify(generatedPlan))); // Store original for reset
      setAdjustments([]);
      setPublishedMonths(new Set());
      setHistory([]);
      
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
    setOriginalPlan(null);
    setAdjustments([]);
    setPublishedMonths(new Set());
    setHistory([]);
    toast.info("Plan cleared");
  }, []);
  
  // Static descriptions for history entries (memoized outside callback)
  const adjustmentDescriptions = useMemo(() => ({
    extend: 'Extended by 1 week',
    compress: 'Compressed by 1 week',
    lock: 'Locked chapter',
    unlock: 'Unlocked chapter',
    swap: 'Swapped with next chapter',
    removeFromWeek: 'Removed from week',
  }), []);

  // Helper to get dynamic description
  const getAdjustmentDescription = useCallback((adjustment: ChapterAdjustment): string => {
    switch (adjustment.type) {
      case 'addHours':
        return `Added ${adjustment.hours || 1}h`;
      case 'removeHours':
        return `Removed ${adjustment.hours || 1}h`;
      case 'setHours':
        return `Set to ${adjustment.hours}h`;
      default:
        return adjustmentDescriptions[adjustment.type as keyof typeof adjustmentDescriptions] || adjustment.type;
    }
  }, [adjustmentDescriptions]);

  // Helper to add history entry
  const addHistoryEntry = useCallback((
    adjustment: ChapterAdjustment,
    chapterName: string,
    subjectName: string,
    planSnapshot: BatchAcademicPlan
  ) => {
    const entry: PlanHistoryEntry = {
      id: `history-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: adjustment.type,
      subjectId: adjustment.subjectId,
      chapterId: adjustment.chapterId,
      chapterName,
      subjectName,
      timestamp: new Date(),
      description: getAdjustmentDescription(adjustment),
      previousPlanSnapshot: JSON.stringify(planSnapshot),
    };

    setHistory(prev => [entry, ...prev].slice(0, 50)); // Keep last 50
  }, [getAdjustmentDescription]);

  // Apply adjustment - modifies the plan in place
  const applyAdjustment = useCallback((adjustment: ChapterAdjustment) => {
    setPlan(currentPlan => {
      if (!currentPlan) return null;
      
      // Find chapter and subject names for history
      const subject = currentPlan.subjects.find(s => s.subjectId === adjustment.subjectId);
      const chapter = subject?.chapterAssignments.find(c => c.chapterId === adjustment.chapterId);
      
      // Add to history BEFORE applying (store current state)
      if (chapter && subject) {
        addHistoryEntry(adjustment, chapter.chapterName, subject.subjectName, currentPlan);
      }
      
      setAdjustments(prev => [...prev, adjustment]);
      
      // Create a deep copy of the plan to modify
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan)) as BatchAcademicPlan;
    
      // Find the subject
      const subjectIndex = updatedPlan.subjects.findIndex(s => s.subjectId === adjustment.subjectId);
      if (subjectIndex === -1) return currentPlan;
    
      const targetSubject = updatedPlan.subjects[subjectIndex];
    
      // Find the chapter
      const chapterIndex = targetSubject.chapterAssignments.findIndex(c => c.chapterId === adjustment.chapterId);
      if (chapterIndex === -1) return currentPlan;
    
      const targetChapter = targetSubject.chapterAssignments[chapterIndex];
    
      switch (adjustment.type) {
        case 'addHours': {
          const hoursToAdd = adjustment.hours || 1;
          const weekHourEntry = targetChapter.hoursPerWeek.find(h => h.weekIndex === adjustment.weekIndex);
          if (weekHourEntry) {
            weekHourEntry.hours += hoursToAdd;
          } else {
            targetChapter.hoursPerWeek.push({ weekIndex: adjustment.weekIndex, hours: hoursToAdd });
          }
          targetChapter.plannedHours += hoursToAdd;
          targetChapter.isModified = true;
          targetChapter.modificationTypes = [...(targetChapter.modificationTypes || []), 'addHours'];
          toast.success(`Added ${hoursToAdd}h to "${targetChapter.chapterName}"`);
          break;
        }
        
        case 'removeHours': {
          const hoursToRemove = adjustment.hours || 1;
          const weekHourEntry = targetChapter.hoursPerWeek.find(h => h.weekIndex === adjustment.weekIndex);
          if (weekHourEntry && weekHourEntry.hours > hoursToRemove) {
            weekHourEntry.hours -= hoursToRemove;
            targetChapter.plannedHours -= hoursToRemove;
            targetChapter.isModified = true;
            targetChapter.modificationTypes = [...(targetChapter.modificationTypes || []), 'removeHours'];
            toast.success(`Removed ${hoursToRemove}h from "${targetChapter.chapterName}"`);
          } else {
            toast.error("Cannot remove more hours than assigned");
            return currentPlan;
          }
          break;
        }
        
        case 'setHours': {
          const newHours = adjustment.hours || 1;
          const weekHourEntry = targetChapter.hoursPerWeek.find(h => h.weekIndex === adjustment.weekIndex);
          const oldHours = weekHourEntry?.hours || 0;
          if (weekHourEntry) {
            weekHourEntry.hours = newHours;
          } else {
            targetChapter.hoursPerWeek.push({ weekIndex: adjustment.weekIndex, hours: newHours });
          }
          targetChapter.plannedHours += (newHours - oldHours);
          targetChapter.isModified = true;
          targetChapter.modificationTypes = [...(targetChapter.modificationTypes || []), 'addHours'];
          toast.success(`Set "${targetChapter.chapterName}" to ${newHours}h this week`);
          break;
        }
        
        case 'removeFromWeek': {
          // Remove hours from this specific week
          const hourEntry = targetChapter.hoursPerWeek.find(h => h.weekIndex === adjustment.weekIndex);
          if (hourEntry) {
            targetChapter.plannedHours -= hourEntry.hours;
            targetChapter.hoursPerWeek = targetChapter.hoursPerWeek.filter(h => h.weekIndex !== adjustment.weekIndex);
            
            // Recalculate start/end
            if (targetChapter.hoursPerWeek.length > 0) {
              targetChapter.startWeekIndex = Math.min(...targetChapter.hoursPerWeek.map(h => h.weekIndex));
              targetChapter.endWeekIndex = Math.max(...targetChapter.hoursPerWeek.map(h => h.weekIndex));
            }
            
            targetChapter.isModified = true;
            targetChapter.modificationTypes = [...(targetChapter.modificationTypes || []), 'removeFromWeek'];
            toast.success(`Removed "${targetChapter.chapterName}" from this week`);
          }
          break;
        }
        
        case 'extend': {
          // Extend chapter by 1 week - push subsequent chapters
          targetChapter.endWeekIndex += 1;
          targetChapter.hoursPerWeek.push({
            weekIndex: targetChapter.endWeekIndex,
            hours: targetSubject.weeklyHours,
          });
          targetChapter.plannedHours += targetSubject.weeklyHours;
          targetChapter.isPartialEnd = false;
          
          // Mark as modified
          targetChapter.isModified = true;
          targetChapter.modificationTypes = [...(targetChapter.modificationTypes || []), 'extend'];
          
          // Push all subsequent chapters by 1 week
          for (let i = chapterIndex + 1; i < targetSubject.chapterAssignments.length; i++) {
            const nextChapter = targetSubject.chapterAssignments[i];
            nextChapter.startWeekIndex += 1;
            nextChapter.endWeekIndex += 1;
            nextChapter.hoursPerWeek = nextChapter.hoursPerWeek.map(h => ({
              ...h,
              weekIndex: h.weekIndex + 1,
            }));
          }
          
          toast.success(`Extended "${targetChapter.chapterName}" by 1 week`);
          break;
        }
        
        case 'compress': {
          // Compress chapter by 1 week if possible
          if (targetChapter.endWeekIndex > targetChapter.startWeekIndex) {
            const removedHours = targetChapter.hoursPerWeek.find(h => h.weekIndex === targetChapter.endWeekIndex)?.hours || 0;
            targetChapter.hoursPerWeek = targetChapter.hoursPerWeek.filter(h => h.weekIndex !== targetChapter.endWeekIndex);
            targetChapter.endWeekIndex -= 1;
            targetChapter.plannedHours -= removedHours;
            
            // Mark as modified
            targetChapter.isModified = true;
            targetChapter.modificationTypes = [...(targetChapter.modificationTypes || []), 'compress'];
            
            // Pull all subsequent chapters by 1 week
            for (let i = chapterIndex + 1; i < targetSubject.chapterAssignments.length; i++) {
              const nextChapter = targetSubject.chapterAssignments[i];
              nextChapter.startWeekIndex -= 1;
              nextChapter.endWeekIndex -= 1;
              nextChapter.hoursPerWeek = nextChapter.hoursPerWeek.map(h => ({
                ...h,
                weekIndex: h.weekIndex - 1,
              }));
            }
            
            toast.success(`Compressed "${targetChapter.chapterName}" by 1 week`);
          } else {
            toast.error("Cannot compress further - chapter spans only 1 week");
            return currentPlan;
          }
          break;
        }
        
        case 'lock': {
          targetChapter.isLocked = true;
          toast.success(`Locked "${targetChapter.chapterName}"`);
          break;
        }
        
        case 'unlock': {
          targetChapter.isLocked = false;
          toast.success(`Unlocked "${targetChapter.chapterName}"`);
          break;
        }
        
        case 'swap': {
          // Swap with next chapter if exists
          if (chapterIndex < targetSubject.chapterAssignments.length - 1) {
            const nextChapter = targetSubject.chapterAssignments[chapterIndex + 1];
            
            // Store original positions
            const origStart = targetChapter.startWeekIndex;
            const origEnd = targetChapter.endWeekIndex;
            const nextStart = nextChapter.startWeekIndex;
            const nextEnd = nextChapter.endWeekIndex;
            
            // Calculate durations
            const chapterDuration = origEnd - origStart;
            const nextDuration = nextEnd - nextStart;
            
            // Swap positions
            targetChapter.startWeekIndex = origStart;
            targetChapter.endWeekIndex = origStart + nextDuration;
            nextChapter.startWeekIndex = targetChapter.endWeekIndex + 1;
            nextChapter.endWeekIndex = nextChapter.startWeekIndex + chapterDuration;
            
            // Recalculate hours per week
            targetChapter.hoursPerWeek = [];
            for (let w = targetChapter.startWeekIndex; w <= targetChapter.endWeekIndex; w++) {
              targetChapter.hoursPerWeek.push({ weekIndex: w, hours: targetSubject.weeklyHours });
            }
            
            nextChapter.hoursPerWeek = [];
            for (let w = nextChapter.startWeekIndex; w <= nextChapter.endWeekIndex; w++) {
              nextChapter.hoursPerWeek.push({ weekIndex: w, hours: targetSubject.weeklyHours });
            }
            
            // Mark both as modified
            targetChapter.isModified = true;
            targetChapter.modificationTypes = [...(targetChapter.modificationTypes || []), 'swap'];
            nextChapter.isModified = true;
            nextChapter.modificationTypes = [...(nextChapter.modificationTypes || []), 'swap'];
            
            // Swap array positions
            targetSubject.chapterAssignments[chapterIndex] = nextChapter;
            targetSubject.chapterAssignments[chapterIndex + 1] = targetChapter;
            
            toast.success(`Swapped "${targetChapter.chapterName}" with "${nextChapter.chapterName}"`);
          } else {
            toast.error("No next chapter to swap with");
            return currentPlan;
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
    
      return updatedPlan;
    });
  }, [addHistoryEntry]);
  
  // Publish month
  const publishMonth = useCallback((monthIndex: number) => {
    if (!batchId) return;
    
    // For now, use monthIndex directly as month number (0 = Jan, etc.)
    // In production, this should map to actual calendar months
    const actualMonth = monthIndex;
    
    setPublishedMonths(prev => new Set([...prev, actualMonth]));
    publishMonthForPlan(batchId, actualMonth);
    
    setPlan(currentPlan => {
      if (!currentPlan) return null;
      return {
        ...currentPlan,
        status: 'published',
        publishedAt: new Date().toISOString(),
      };
    });
    
    toast.success("Month published successfully");
  }, [batchId]);
  
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
    if (fromIndex === toIndex) return;
    
    setPlan(currentPlan => {
      if (!currentPlan) return null;
      
      // Create a deep copy of the plan
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan)) as BatchAcademicPlan;
      
      // Find the subject
      const subjectIndex = updatedPlan.subjects.findIndex(s => s.subjectId === subjectId);
      if (subjectIndex === -1) return currentPlan;
      
      const subject = updatedPlan.subjects[subjectIndex];
      
      if (fromIndex < 0 || fromIndex >= subject.chapterAssignments.length) return currentPlan;
      if (toIndex < 0 || toIndex >= subject.chapterAssignments.length) return currentPlan;
      
      // Swap the two chapters and mark them as modified
      const temp = subject.chapterAssignments[fromIndex];
      subject.chapterAssignments[fromIndex] = subject.chapterAssignments[toIndex];
      subject.chapterAssignments[toIndex] = temp;
      
      // Mark both swapped chapters as modified
      subject.chapterAssignments[fromIndex].isModified = true;
      subject.chapterAssignments[fromIndex].modificationTypes = [
        ...(subject.chapterAssignments[fromIndex].modificationTypes || []),
        'reorder'
      ];
      subject.chapterAssignments[toIndex].isModified = true;
      subject.chapterAssignments[toIndex].modificationTypes = [
        ...(subject.chapterAssignments[toIndex].modificationTypes || []),
        'reorder'
      ];
      
      // Recalculate all week positions for the subject
      const originalMinStart = Math.min(
        ...currentPlan.subjects[subjectIndex].chapterAssignments.map(c => c.startWeekIndex)
      );
      let currentWeekStart = originalMinStart;
      
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
      
      const movedChapter = subject.chapterAssignments[toIndex];
      toast.success(`Moved "${movedChapter.chapterName}" to position ${toIndex + 1}`);
      
      return updatedPlan;
    });
  }, []);
  
  // Add chapter manually to a specific week
  const addChapterManually = useCallback((
    subjectId: string,
    chapterId: string,
    weekIndex: number,
    hours: number
  ) => {
    // Find chapter info from setups (outside of setPlan to avoid stale closure)
    const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
    const chapterInfo = setup?.chapters.find(c => c.chapterId === chapterId);
    
    if (!chapterInfo) {
      toast.error("Chapter not found");
      return;
    }
    
    setPlan(currentPlan => {
      if (!currentPlan) return null;
      
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan)) as BatchAcademicPlan;
      const subjectIndex = updatedPlan.subjects.findIndex(s => s.subjectId === subjectId);
      if (subjectIndex === -1) return currentPlan;
      
      const subject = updatedPlan.subjects[subjectIndex];
      
      // Check if chapter already exists
      const existingIndex = subject.chapterAssignments.findIndex(c => c.chapterId === chapterId);
      if (existingIndex !== -1) {
        toast.error("Chapter already assigned");
        return currentPlan;
      }
      
      // Add new assignment
      const newAssignment: import("@/types/academicPlanner").ChapterWeekAssignment = {
        chapterId,
        chapterName: chapterInfo.chapterName,
        plannedHours: hours,
        startWeekIndex: weekIndex,
        endWeekIndex: weekIndex,
        hoursPerWeek: [{ weekIndex, hours }],
        isLocked: false,
        isPartialStart: false,
        isPartialEnd: hours < chapterInfo.plannedHours,
        isModified: true,
        modificationTypes: ['manualAdd'],
      };
      
      subject.chapterAssignments.push(newAssignment);
      subject.chapterAssignments.sort((a, b) => a.startWeekIndex - b.startWeekIndex);
      
      toast.success(`Added "${chapterInfo.chapterName}" to week ${weekIndex + 1}`);
      
      return updatedPlan;
    });
  }, []);
  
  // Undo to a specific history entry
  const undoToEntry = useCallback((entryId: string) => {
    setHistory(prevHistory => {
      const entryIndex = prevHistory.findIndex(h => h.id === entryId);
      if (entryIndex === -1) return prevHistory;
      
      const entry = prevHistory[entryIndex];
      const restoredPlan = JSON.parse(entry.previousPlanSnapshot) as BatchAcademicPlan;
      
      // Set plan outside of setHistory to avoid nested state updates
      setTimeout(() => {
        setPlan(restoredPlan);
        toast.success(`Undone: ${entry.description}`);
      }, 0);
      
      // Remove this entry and all entries before it (more recent ones are at start)
      return prevHistory.slice(entryIndex + 1);
    });
  }, []);
  
  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    toast.info("History cleared");
  }, []);
  
  // Reset a subject to its original auto-generated state
  const resetSubjectToOriginal = useCallback((subjectId: string) => {
    setPlan(currentPlan => {
      if (!currentPlan || !originalPlan) {
        toast.error("No original plan to reset to");
        return currentPlan;
      }
      
      const originalSubject = originalPlan.subjects.find(s => s.subjectId === subjectId);
      if (!originalSubject) {
        toast.error("Subject not found in original plan");
        return currentPlan;
      }
      
      // Store current state in history
      const currentSubject = currentPlan.subjects.find(s => s.subjectId === subjectId);
      if (currentSubject) {
        addHistoryEntry(
          { type: 'compress', subjectId, chapterId: '', weekIndex: 0, timestamp: new Date().toISOString() },
          'All chapters',
          currentSubject.subjectName,
          currentPlan
        );
      }
      
      // Create updated plan with reset subject
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan)) as BatchAcademicPlan;
      const subjectIndex = updatedPlan.subjects.findIndex(s => s.subjectId === subjectId);
      if (subjectIndex !== -1) {
        updatedPlan.subjects[subjectIndex] = JSON.parse(JSON.stringify(originalSubject));
      }
      
      toast.success(`Reset ${originalSubject.subjectName} to original plan`);
      
      return updatedPlan;
    });
  }, [originalPlan, addHistoryEntry]);
  
  return {
    plan,
    isGenerating,
    validation,
    adjustments,
    publishedMonths,
    hasExistingPlan,
    history,
    generatePlan,
    clearPlan,
    applyAdjustment,
    publishMonth,
    loadExistingPlan,
    reorderChapters,
    addChapterManually,
    undoToEntry,
    clearHistory,
    resetSubjectToOriginal,
    batch,
    weeklyHours,
    hasValidSetup,
    canEditWeek,
    getWeekStatus,
  };
}
