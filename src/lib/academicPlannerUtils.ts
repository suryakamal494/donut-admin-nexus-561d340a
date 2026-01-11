// Academic Planner Utility Functions
// Helper functions for the auto-sequence algorithm and display logic

import { TimetableEntry } from "@/data/timetableData";
import { AcademicScheduleSetup, AcademicWeek } from "@/types/academicSchedule";
import {
  BatchAcademicPlan,
  ChapterWeekAssignment,
  SubjectPlanData,
  ChapterCellType,
  WeekCellData,
  SubjectRowData,
  DEFAULT_WEEKLY_HOURS_PER_SUBJECT,
} from "@/types/academicPlanner";
import { Batch } from "@/data/instituteData";

// ============================================
// Weekly Hours Calculation from Timetable
// ============================================

/**
 * Calculate weekly hours per subject for a specific batch from timetable entries
 */
export function getWeeklyHoursForBatch(
  batchId: string,
  timetableEntries: TimetableEntry[]
): Record<string, number> {
  const batchEntries = timetableEntries.filter(e => e.batchId === batchId);
  const hoursBySubject: Record<string, number> = {};

  batchEntries.forEach(entry => {
    // Skip non-teaching periods (library, sports, etc.)
    if (!entry.teacherId || entry.periodType === 'library' || entry.periodType === 'sports') {
      return;
    }
    
    const subjectId = entry.subjectId;
    if (!hoursBySubject[subjectId]) {
      hoursBySubject[subjectId] = 0;
    }
    // Each period = 1 hour (simplified)
    hoursBySubject[subjectId] += 1;
  });

  return hoursBySubject;
}

/**
 * Get subjects for a batch based on class level
 */
export function getBatchSubjects(batch: Batch): { subjectId: string; subjectName: string }[] {
  const classNum = parseInt(batch.classId.replace("class-", ""));
  
  if (batch.assignedCourses?.includes("jee-mains") || batch.id.startsWith("jee-")) {
    return [
      { subjectId: "jee_phy", subjectName: "JEE Physics" },
      { subjectId: "jee_che", subjectName: "JEE Chemistry" },
      { subjectId: "jee_mat", subjectName: "JEE Mathematics" },
    ];
  }
  
  if (classNum >= 6 && classNum <= 8) {
    return [
      { subjectId: "mat", subjectName: "Mathematics" },
      { subjectId: "sci", subjectName: "Science" },
      { subjectId: "eng", subjectName: "English" },
      { subjectId: "hin", subjectName: "Hindi" },
      { subjectId: "sst", subjectName: "Social Studies" },
    ];
  }
  
  if (classNum >= 9 && classNum <= 10) {
    return [
      { subjectId: "phy", subjectName: "Physics" },
      { subjectId: "che", subjectName: "Chemistry" },
      { subjectId: "mat", subjectName: "Mathematics" },
      { subjectId: "bio", subjectName: "Biology" },
      { subjectId: "eng", subjectName: "English" },
      { subjectId: "hin", subjectName: "Hindi" },
      { subjectId: "sst", subjectName: "Social Studies" },
    ];
  }
  
  if (classNum >= 11 && classNum <= 12) {
    return [
      { subjectId: "phy", subjectName: "Physics" },
      { subjectId: "che", subjectName: "Chemistry" },
      { subjectId: "mat", subjectName: "Mathematics" },
      { subjectId: "bio", subjectName: "Biology" },
    ];
  }
  
  return [
    { subjectId: "mat", subjectName: "Mathematics" },
    { subjectId: "sci", subjectName: "Science" },
    { subjectId: "eng", subjectName: "English" },
  ];
}

// ============================================
// Auto-Sequence Algorithm
// ============================================

/**
 * Generate chapter-week assignments for a single subject
 * This is the core auto-sequence algorithm
 */
export function generateSubjectPlan(
  subjectId: string,
  subjectName: string,
  chapters: { chapterId: string; chapterName: string; plannedHours: number; order: number }[],
  weeklyHours: number,
  startWeekIndex: number,
  totalWeeks: number
): SubjectPlanData {
  const chapterAssignments: ChapterWeekAssignment[] = [];
  
  // Sort chapters by order
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
  
  let currentWeekIndex = startWeekIndex;
  let hoursUsedInCurrentWeek = 0;
  
  sortedChapters.forEach((chapter) => {
    let remainingHours = chapter.plannedHours;
    const hoursPerWeek: { weekIndex: number; hours: number }[] = [];
    const chapterStartWeek = currentWeekIndex;
    const isPartialStart = hoursUsedInCurrentWeek > 0;
    
    while (remainingHours > 0 && currentWeekIndex < startWeekIndex + totalWeeks) {
      const availableThisWeek = weeklyHours - hoursUsedInCurrentWeek;
      const hoursThisWeek = Math.min(availableThisWeek, remainingHours);
      
      if (hoursThisWeek > 0) {
        hoursPerWeek.push({
          weekIndex: currentWeekIndex,
          hours: hoursThisWeek,
        });
        
        remainingHours -= hoursThisWeek;
        hoursUsedInCurrentWeek += hoursThisWeek;
      }
      
      // Move to next week if current is full
      if (hoursUsedInCurrentWeek >= weeklyHours) {
        currentWeekIndex++;
        hoursUsedInCurrentWeek = 0;
      }
    }
    
    const chapterEndWeek = hoursPerWeek.length > 0 
      ? hoursPerWeek[hoursPerWeek.length - 1].weekIndex 
      : chapterStartWeek;
    
    const isPartialEnd = hoursUsedInCurrentWeek > 0 && hoursUsedInCurrentWeek < weeklyHours;
    
    chapterAssignments.push({
      chapterId: chapter.chapterId,
      chapterName: chapter.chapterName,
      plannedHours: chapter.plannedHours,
      startWeekIndex: chapterStartWeek,
      endWeekIndex: chapterEndWeek,
      hoursPerWeek,
      isLocked: false,
      isPartialStart,
      isPartialEnd,
    });
  });
  
  const totalPlannedHours = chapters.reduce((sum, ch) => sum + ch.plannedHours, 0);
  
  return {
    subjectId,
    subjectName,
    weeklyHours,
    totalPlannedHours,
    chapterAssignments,
  };
}

/**
 * Generate complete batch academic plan
 */
export function generateBatchPlan(
  batch: Batch,
  setups: AcademicScheduleSetup[],
  timetableEntries: TimetableEntry[],
  weeks: AcademicWeek[],
  startWeekIndex: number = 0
): BatchAcademicPlan | null {
  const batchSubjects = getBatchSubjects(batch);
  const weeklyHoursBySubject = getWeeklyHoursForBatch(batch.id, timetableEntries);
  
  const subjects: SubjectPlanData[] = [];
  
  batchSubjects.forEach(({ subjectId, subjectName }) => {
    // Find setup for this subject
    const setup = setups.find(s => s.subjectId === subjectId);
    
    if (!setup || !setup.chapters.length) {
      // No setup found, skip with default
      subjects.push({
        subjectId,
        subjectName,
        weeklyHours: weeklyHoursBySubject[subjectId] || DEFAULT_WEEKLY_HOURS_PER_SUBJECT,
        totalPlannedHours: 0,
        chapterAssignments: [],
      });
      return;
    }
    
    const weeklyHours = weeklyHoursBySubject[subjectId] || DEFAULT_WEEKLY_HOURS_PER_SUBJECT;
    const subjectPlan = generateSubjectPlan(
      subjectId,
      subjectName,
      setup.chapters,
      weeklyHours,
      startWeekIndex,
      weeks.length - startWeekIndex
    );
    
    subjects.push(subjectPlan);
  });
  
  // Calculate end week index
  const maxEndWeek = Math.max(
    ...subjects.flatMap(s => 
      s.chapterAssignments.map(c => c.endWeekIndex)
    ).filter(w => w !== undefined),
    startWeekIndex
  );
  
  return {
    id: `plan-${batch.id}-${Date.now()}`,
    batchId: batch.id,
    batchName: batch.name,
    classId: batch.classId,
    className: batch.className,
    academicYear: batch.academicYear,
    subjects,
    startWeekIndex,
    endWeekIndex: maxEndWeek,
    status: 'draft',
    generatedAt: new Date().toISOString(),
  };
}

// ============================================
// Display Helpers
// ============================================

/**
 * Get cell type for a specific week and chapter
 */
export function getChapterCellType(
  weekIndex: number,
  assignment: ChapterWeekAssignment
): ChapterCellType {
  if (weekIndex < assignment.startWeekIndex || weekIndex > assignment.endWeekIndex) {
    return 'empty';
  }
  
  if (assignment.startWeekIndex === assignment.endWeekIndex) {
    return 'single';
  }
  
  if (weekIndex === assignment.startWeekIndex) {
    return 'start';
  }
  
  if (weekIndex === assignment.endWeekIndex) {
    return 'end';
  }
  
  return 'middle';
}

/**
 * Get hours for a specific week from a chapter assignment
 */
export function getHoursForWeek(
  weekIndex: number,
  assignment: ChapterWeekAssignment
): number {
  const weekHours = assignment.hoursPerWeek.find(h => h.weekIndex === weekIndex);
  return weekHours?.hours || 0;
}

/**
 * Build subject row data for grid display
 */
export function buildSubjectRowData(
  subject: SubjectPlanData,
  weeks: AcademicWeek[],
  monthWeeks: { startWeekIndex: number; endWeekIndex: number },
  publishedMonths: Set<number>
): SubjectRowData {
  const cells: WeekCellData[] = [];
  
  for (let i = monthWeeks.startWeekIndex; i <= monthWeeks.endWeekIndex && i < weeks.length; i++) {
    const week = weeks[i];
    
    // Find which chapter is in this week
    let foundChapter: ChapterWeekAssignment | null = null;
    for (const assignment of subject.chapterAssignments) {
      if (i >= assignment.startWeekIndex && i <= assignment.endWeekIndex) {
        foundChapter = assignment;
        break;
      }
    }
    
    const cellType = foundChapter 
      ? getChapterCellType(i, foundChapter)
      : 'empty';
    
    const hours = foundChapter 
      ? getHoursForWeek(i, foundChapter)
      : 0;
    
    cells.push({
      weekIndex: i,
      week,
      chapterId: foundChapter?.chapterId || null,
      chapterName: foundChapter?.chapterName || null,
      hours,
      cellType,
      isHoliday: false, // TODO: Check holidays
      isExamBlock: false, // TODO: Check exam blocks
      isPublished: publishedMonths.has(new Date(week.startDate).getMonth()),
      isLocked: foundChapter?.isLocked || false,
    });
  }
  
  const totalAssignedHours = subject.chapterAssignments.reduce(
    (sum, ch) => sum + ch.plannedHours, 
    0
  );
  
  return {
    subjectId: subject.subjectId,
    subjectName: subject.subjectName,
    weeklyHours: subject.weeklyHours,
    cells,
    totalPlannedHours: subject.totalPlannedHours,
    totalAssignedHours,
  };
}

// ============================================
// Month Helpers
// ============================================

/**
 * Get weeks that belong to a specific month
 */
export function getWeeksForMonth(
  weeks: AcademicWeek[],
  monthIndex: number
): { startWeekIndex: number; endWeekIndex: number; weeksInMonth: AcademicWeek[] } {
  const weeksInMonth: AcademicWeek[] = [];
  let startWeekIndex = -1;
  let endWeekIndex = -1;
  
  // Group weeks by month to find the target month
  const monthMap = new Map<string, { weeks: AcademicWeek[]; indices: number[] }>();
  
  weeks.forEach((week, index) => {
    const date = new Date(week.startDate);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { weeks: [], indices: [] });
    }
    monthMap.get(monthKey)!.weeks.push(week);
    monthMap.get(monthKey)!.indices.push(index);
  });
  
  const monthKeys = Array.from(monthMap.keys());
  if (monthIndex >= 0 && monthIndex < monthKeys.length) {
    const targetMonth = monthMap.get(monthKeys[monthIndex])!;
    return {
      startWeekIndex: targetMonth.indices[0],
      endWeekIndex: targetMonth.indices[targetMonth.indices.length - 1],
      weeksInMonth: targetMonth.weeks,
    };
  }
  
  return { startWeekIndex: 0, endWeekIndex: 0, weeksInMonth: [] };
}

/**
 * Get month name from week
 */
export function getMonthFromWeek(week: AcademicWeek): string {
  const date = new Date(week.startDate);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Get week number within month
 */
export function getWeekNumberInMonth(week: AcademicWeek, allWeeks: AcademicWeek[]): number {
  const targetDate = new Date(week.startDate);
  const targetMonth = targetDate.getMonth();
  const targetYear = targetDate.getFullYear();
  
  let weekInMonth = 0;
  for (const w of allWeeks) {
    const wDate = new Date(w.startDate);
    if (wDate.getMonth() === targetMonth && wDate.getFullYear() === targetYear) {
      weekInMonth++;
      if (w.weekNumber === week.weekNumber) {
        return weekInMonth;
      }
    }
  }
  
  return 1;
}
