// Subject Progress Data
// Split from academicScheduleData.ts for better tree-shaking

import { SubjectProgress } from "@/types/academicSchedule";

export const subjectProgressData: SubjectProgress[] = [
  { batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", totalPlannedHours: 38, totalActualHours: 16, chaptersCompleted: 2, totalChapters: 5, currentChapter: "phy-9-3", currentChapterName: "Gravitation", overallStatus: "in_progress", percentComplete: 42, lostDays: 1, lostDaysReasons: [{ reason: "holiday", count: 1 }] },
  { batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "che", subjectName: "Chemistry", totalPlannedHours: 28, totalActualHours: 14, chaptersCompleted: 2, totalChapters: 4, currentChapter: "che-9-3", currentChapterName: "Atoms and Molecules", overallStatus: "in_progress", percentComplete: 50, lostDays: 0, lostDaysReasons: [] },
  { batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", totalPlannedHours: 40, totalActualHours: 15, chaptersCompleted: 2, totalChapters: 6, currentChapter: "mat-9-3", currentChapterName: "Coordinate Geometry", overallStatus: "lagging", percentComplete: 38, lostDays: 2, lostDaysReasons: [{ reason: "teacher_absent", count: 2 }] },
  { batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", totalPlannedHours: 44, totalActualHours: 22, chaptersCompleted: 2, totalChapters: 5, currentChapter: "phy-10-3", currentChapterName: "Electricity", overallStatus: "in_progress", percentComplete: 50, lostDays: 0, lostDaysReasons: [] },
  { batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", totalPlannedHours: 52, totalActualHours: 18, chaptersCompleted: 2, totalChapters: 6, currentChapter: "mat-10-3", currentChapterName: "Pair of Linear Equations", overallStatus: "lagging", percentComplete: 35, lostDays: 1, lostDaysReasons: [{ reason: "exam", count: 1 }] },
];
