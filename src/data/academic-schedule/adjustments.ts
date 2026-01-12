// Schedule Adjustments Data
// Split from academicScheduleData.ts for better tree-shaking

import { ScheduleAdjustment } from "@/types/academicSchedule";

export const scheduleAdjustments: ScheduleAdjustment[] = [
  // Batch 6a - Math - Extended chapter due to foundational gaps
  {
    id: "adj-6a-mat-1",
    batchId: "batch-6a",
    subjectId: "mat",
    subjectName: "Mathematics",
    chapterId: "mat-6-3",
    chapterName: "Playing with Numbers",
    action: "extend_chapter",
    driftHoursBefore: 3,
    impactDescription: "Chapter extended by 3 periods. Subsequent chapters shifted by 1 week.",
    notes: "Students needed extra practice with prime factorization concepts.",
    adjustedBy: "Academic Incharge",
    adjustedAt: "2026-01-05",
  },
  
  // Batch 10a - Physics - Accepted variance for Light Reflection
  {
    id: "adj-10a-phy-1",
    batchId: "batch-10a",
    subjectId: "phy",
    subjectName: "Physics",
    chapterId: "phy-10-1",
    chapterName: "Light - Reflection and Refraction",
    action: "accept_variance",
    driftHoursBefore: 2,
    impactDescription: "Minor variance accepted. Progress tracking continues without schedule change.",
    notes: "Lab practicals took extra time but were valuable for understanding.",
    adjustedBy: "Dr. Rajesh Kumar",
    adjustedAt: "2026-01-03",
  },
  
  // Batch 9a - Chemistry - Added compensatory class
  {
    id: "adj-9a-che-1",
    batchId: "batch-9a",
    subjectId: "che",
    subjectName: "Chemistry",
    chapterId: "che-9-2",
    chapterName: "Is Matter Around Us Pure?",
    action: "add_compensatory",
    driftHoursBefore: 4,
    impactDescription: "2 compensatory periods scheduled for Saturday.",
    notes: "Teacher absence due to conference. Saturday class approved by principal.",
    adjustedBy: "Academic Incharge",
    adjustedAt: "2025-12-20",
  },
  
  // Batch 11a - Physics - Compressed future teaching
  {
    id: "adj-11a-phy-1",
    batchId: "batch-11a",
    subjectId: "phy",
    subjectName: "Physics",
    chapterId: "phy-11-2",
    chapterName: "Units and Measurements",
    action: "compress_future",
    driftHoursBefore: 2,
    impactDescription: "Next 3 chapters will be taught at accelerated pace to recover 2 hours.",
    notes: "Curriculum revision allows combining some topics.",
    adjustedBy: "Dr. Rajesh Kumar",
    adjustedAt: "2026-01-08",
  },
];
