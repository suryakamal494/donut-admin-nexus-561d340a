// Teacher Notification Type Definitions

export type TeacherNotificationType = 
  | "timetable_published"      // Weekly timetable published
  | "timetable_updated"        // Schedule changes
  | "substitution_assigned"    // Assigned to cover a class
  | "substitution_cancelled"   // Substitution no longer needed
  | "exam_scheduled"           // Exam date announced
  | "exam_assigned"            // Exam assigned to teacher's batch
  | "subject_assigned"         // New batch/subject assignment
  | "syllabus_updated"         // Chapter hours allocated
  | "weekly_plan_published"    // Weekly chapter plans released
  | "content_shared"           // Institute shared content
  | "holiday_declared"         // Holiday announcement
  | "general_announcement";    // System announcements

export type NotificationPriority = "urgent" | "high" | "medium" | "low";

export type NotificationCategory = 
  | "all"
  | "timetable"
  | "exams"
  | "substitution"
  | "syllabus"
  | "general";

export interface TeacherNotification {
  id: string;
  type: TeacherNotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
  actionUrl?: string;
  metadata?: {
    batchId?: string;
    batchName?: string;
    subjectId?: string;
    subjectName?: string;
    examId?: string;
    date?: string;
    periodNumber?: number;
    teacherName?: string;
  };
}

// Helper to get category from notification type
export const getNotificationCategory = (type: TeacherNotificationType): NotificationCategory => {
  switch (type) {
    case "timetable_published":
    case "timetable_updated":
      return "timetable";
    case "substitution_assigned":
    case "substitution_cancelled":
      return "substitution";
    case "exam_scheduled":
    case "exam_assigned":
      return "exams";
    case "subject_assigned":
    case "syllabus_updated":
    case "weekly_plan_published":
      return "syllabus";
    case "content_shared":
    case "holiday_declared":
    case "general_announcement":
    default:
      return "general";
  }
};
