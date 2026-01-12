// Pending Confirmations Data
// Split from academicScheduleData.ts for better tree-shaking

import { PendingConfirmation } from "@/types/academicSchedule";

export const pendingConfirmations: PendingConfirmation[] = [
  // Batch 7a - 1 pending (Hindi - 2 days overdue)
  { id: "pending-7a-1", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "hin", subjectName: "Hindi", teacherId: "teacher-7", teacherName: "Mrs. Sunita Devi", date: "2026-01-09", expectedPeriods: 2, daysOverdue: 2 },
  
  // Batch 9a - 1 pending (Math - today)
  { id: "pending-9a-1", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", teacherId: "teacher-2", teacherName: "Prof. Verma", date: "2026-01-11", expectedPeriods: 2, daysOverdue: 0 },
  
  // Batch 10a - 2 pending (Physics - 3 days CRITICAL, Chemistry - 1 day)
  { id: "pending-10a-1", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", teacherId: "teacher-1", teacherName: "Dr. Rajesh Kumar", date: "2026-01-08", expectedPeriods: 2, daysOverdue: 3 },
  { id: "pending-10a-2", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", teacherId: "teacher-3", teacherName: "Dr. Meena Gupta", date: "2026-01-10", expectedPeriods: 1, daysOverdue: 1 },
  
  // Batch 11a - 1 pending (Physics - 2 days)
  { id: "pending-11a-1", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "phy", subjectName: "Physics", teacherId: "teacher-1", teacherName: "Dr. Rajesh Kumar", date: "2026-01-09", expectedPeriods: 2, daysOverdue: 2 },
];
