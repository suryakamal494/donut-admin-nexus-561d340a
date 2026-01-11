// Hook for aggregating teacher's syllabus progress data
import { useMemo } from "react";
import { currentTeacher, teacherBatches } from "@/data/teacher/profile";
import { 
  subjectProgressData, 
  pendingConfirmations, 
  teachingConfirmations,
  academicScheduleSetups,
  academicWeeks,
  currentWeekIndex 
} from "@/data/academicScheduleData";

export interface ChapterInfo {
  chapterId: string;
  chapterName: string;
  plannedHours: number;
  actualHours: number;
  status: "completed" | "in_progress" | "not_started";
  order: number;
}

export interface SectionProgress {
  batchId: string;
  batchName: string;
  className: string;
  totalChapters: number;
  completedChapters: number;
  currentChapterIndex: number;
  currentChapter: string;
  currentChapterName: string;
  hoursAllotted: number;
  hoursTaken: number;
  hoursRemaining: number;
  pendingConfirmations: number;
  status: "ahead" | "on_track" | "lagging" | "critical";
  percentComplete: number;
  chapters: ChapterInfo[];
}

export interface TeacherSubjectSummary {
  subjectId: string;
  subjectName: string;
  sections: SectionProgress[];
  totalSections: number;
  averageProgress: number;
  totalPending: number;
}

export interface WeekContext {
  weekNumber: number;
  totalWeeks: number;
  startDate: string;
  endDate: string;
  label: string;
  hoursThisWeek: number;
  totalPendingConfirmations: number;
}

export interface TeacherSyllabusProgressData {
  weekContext: WeekContext;
  subjects: TeacherSubjectSummary[];
  totalBatches: number;
  overallProgress: number;
  onTrackCount: number;
  laggingCount: number;
}

export function useTeacherSyllabusProgress(): TeacherSyllabusProgressData {
  return useMemo(() => {
    const teacherId = currentTeacher.id;
    const teacherSubjects = currentTeacher.subjects;
    const teacherBatchIds = teacherBatches.map(b => b.id);
    
    // Current week info
    const currentWeek = academicWeeks[currentWeekIndex];
    
    // Teaching hours this week
    const thisWeekConfirmations = teachingConfirmations.filter(
      c => c.teacherId === teacherId && c.didTeach
    );
    const hoursThisWeek = thisWeekConfirmations.reduce(
      (sum, c) => sum + c.periodsCount, 0
    );
    
    // Pending confirmations for this teacher
    const myPendingConfirmations = pendingConfirmations.filter(
      p => p.teacherId === teacherId
    );
    
    // Group progress by subject
    const subjectMap = new Map<string, TeacherSubjectSummary>();
    
    // Get relevant progress data - filter by teacher's batches and subjects
    const relevantProgress = subjectProgressData.filter(p => {
      // Check if batch belongs to teacher
      const isBatchAssigned = teacherBatchIds.some(id => 
        p.batchId.includes(id.replace('batch-', '')) || 
        id.includes(p.batchId.replace('batch-', ''))
      );
      
      // Check if subject is taught by teacher
      const isSubjectAssigned = teacherSubjects.some(s => 
        p.subjectName.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(p.subjectName.toLowerCase())
      );
      
      return isSubjectAssigned; // For demo, show subject-matched data
    });
    
    // Process each progress entry
    relevantProgress.forEach(progress => {
      // Get setup data for chapter details
      const setup = academicScheduleSetups.find(s => 
        s.subjectName === progress.subjectName
      );
      
      const chapters: ChapterInfo[] = setup?.chapters.map((ch, idx) => ({
        chapterId: ch.chapterId,
        chapterName: ch.chapterName,
        plannedHours: ch.plannedHours,
        actualHours: idx < progress.chaptersCompleted 
          ? ch.plannedHours 
          : idx === progress.chaptersCompleted 
            ? Math.round(ch.plannedHours * 0.4) 
            : 0,
        status: idx < progress.chaptersCompleted 
          ? "completed" 
          : idx === progress.chaptersCompleted 
            ? "in_progress" 
            : "not_started",
        order: ch.order,
      })) || [];
      
      const sectionPending = myPendingConfirmations.filter(
        p => p.batchId === progress.batchId && p.subjectId === progress.subjectId
      ).length;
      
      // Extract class name from batch name
      const classMatch = progress.batchName.match(/Class (\d+)/);
      const className = classMatch ? `Class ${classMatch[1]}` : progress.batchName;
      
      const section: SectionProgress = {
        batchId: progress.batchId,
        batchName: progress.batchName,
        className,
        totalChapters: progress.totalChapters,
        completedChapters: progress.chaptersCompleted,
        currentChapterIndex: progress.chaptersCompleted,
        currentChapter: progress.currentChapter || "",
        currentChapterName: progress.currentChapterName || "Not started",
        hoursAllotted: progress.totalPlannedHours,
        hoursTaken: progress.totalActualHours,
        hoursRemaining: progress.totalPlannedHours - progress.totalActualHours,
        pendingConfirmations: sectionPending,
        status: progress.overallStatus === "ahead" ? "ahead" 
          : progress.overallStatus === "in_progress" ? "on_track"
          : progress.overallStatus === "lagging" ? "lagging"
          : "critical",
        percentComplete: progress.percentComplete,
        chapters,
      };
      
      // Add to subject map
      if (!subjectMap.has(progress.subjectId)) {
        subjectMap.set(progress.subjectId, {
          subjectId: progress.subjectId,
          subjectName: progress.subjectName,
          sections: [],
          totalSections: 0,
          averageProgress: 0,
          totalPending: 0,
        });
      }
      
      const subject = subjectMap.get(progress.subjectId)!;
      subject.sections.push(section);
    });
    
    // Calculate averages for each subject
    const subjects: TeacherSubjectSummary[] = Array.from(subjectMap.values()).map(subject => {
      const totalProgress = subject.sections.reduce((sum, s) => sum + s.percentComplete, 0);
      const totalPending = subject.sections.reduce((sum, s) => sum + s.pendingConfirmations, 0);
      
      return {
        ...subject,
        totalSections: subject.sections.length,
        averageProgress: subject.sections.length > 0 
          ? Math.round(totalProgress / subject.sections.length) 
          : 0,
        totalPending,
      };
    });
    
    // Overall stats
    const allSections = subjects.flatMap(s => s.sections);
    const totalBatches = allSections.length;
    const overallProgress = allSections.length > 0
      ? Math.round(allSections.reduce((sum, s) => sum + s.percentComplete, 0) / allSections.length)
      : 0;
    const onTrackCount = allSections.filter(s => s.status === "on_track" || s.status === "ahead").length;
    const laggingCount = allSections.filter(s => s.status === "lagging" || s.status === "critical").length;
    
    return {
      weekContext: {
        weekNumber: currentWeekIndex + 1,
        totalWeeks: academicWeeks.length,
        startDate: currentWeek?.startDate || "",
        endDate: currentWeek?.endDate || "",
        label: currentWeek?.label || "",
        hoursThisWeek,
        totalPendingConfirmations: myPendingConfirmations.length,
      },
      subjects,
      totalBatches,
      overallProgress,
      onTrackCount,
      laggingCount,
    };
  }, []);
}
