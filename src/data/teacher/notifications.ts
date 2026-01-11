// Teacher Notifications Mock Data
import { TeacherNotification } from "@/types/teacherNotifications";

const now = new Date();
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

export const teacherNotifications: TeacherNotification[] = [
  // Urgent - Substitution (Today)
  {
    id: "notif-1",
    type: "substitution_assigned",
    priority: "urgent",
    title: "Substitution Required Tomorrow",
    message: "You're assigned to cover Class 10B - Mathematics, Period 3 (10:30 AM). Mr. Sharma is on leave.",
    timestamp: hoursAgo(2),
    read: false,
    dismissed: false,
    actionUrl: "/teacher/schedule",
    metadata: { 
      batchId: "batch-10b", 
      batchName: "10B - Evening",
      periodNumber: 3,
      teacherName: "Mr. Sharma"
    }
  },
  
  // High - Timetable Published
  {
    id: "notif-2",
    type: "timetable_published",
    priority: "high",
    title: "Week 24 Timetable Published",
    message: "The academic timetable for Jan 13-17 has been published. You have 18 periods scheduled across 5 days.",
    timestamp: hoursAgo(5),
    read: false,
    dismissed: false,
    actionUrl: "/teacher/schedule"
  },
  
  // High - Exam Scheduled
  {
    id: "notif-3",
    type: "exam_scheduled",
    priority: "high",
    title: "Monthly Test Scheduled",
    message: "Physics Monthly Test for Class 11A has been scheduled for Jan 20, 2025. Duration: 90 minutes.",
    timestamp: hoursAgo(8),
    read: false,
    dismissed: false,
    actionUrl: "/teacher/exams",
    metadata: {
      examId: "exam-001",
      batchName: "11A - JEE Physics",
      date: "2025-01-20"
    }
  },
  
  // Medium - Syllabus Updated
  {
    id: "notif-4",
    type: "syllabus_updated",
    priority: "medium",
    title: "Chapter Allocation Updated",
    message: "Physics syllabus for Class 11A updated. 'Thermodynamics' allocated 12 hours instead of 10.",
    timestamp: hoursAgo(12),
    read: true,
    dismissed: false,
    actionUrl: "/teacher/academic-progress",
    metadata: {
      subjectName: "Physics",
      batchName: "11A - JEE Physics"
    }
  },
  
  // Medium - Subject Assigned
  {
    id: "notif-5",
    type: "subject_assigned",
    priority: "medium",
    title: "New Batch Assigned",
    message: "You have been assigned to teach Physics for batch 12B - Advanced. 6 periods per week.",
    timestamp: daysAgo(1),
    read: true,
    dismissed: false,
    actionUrl: "/teacher/schedule",
    metadata: {
      batchName: "12B - Advanced",
      subjectName: "Physics"
    }
  },
  
  // High - Weekly Plan Published
  {
    id: "notif-6",
    type: "weekly_plan_published",
    priority: "high",
    title: "Weekly Teaching Plan Released",
    message: "Week 24 chapter-wise teaching plan has been released. Review your assigned topics for this week.",
    timestamp: daysAgo(1),
    read: false,
    dismissed: false,
    actionUrl: "/teacher/lesson-plans"
  },
  
  // Low - Content Shared
  {
    id: "notif-7",
    type: "content_shared",
    priority: "low",
    title: "New Reference Material Available",
    message: "Institute has shared 'Advanced Mechanics Video Series' in the content library.",
    timestamp: daysAgo(2),
    read: true,
    dismissed: false,
    actionUrl: "/teacher/content"
  },
  
  // Medium - Timetable Updated
  {
    id: "notif-8",
    type: "timetable_updated",
    priority: "medium",
    title: "Schedule Change: Room Reassignment",
    message: "Your Period 5 on Wednesday moved from Room 204 to Lab 3 due to practical requirements.",
    timestamp: daysAgo(2),
    read: true,
    dismissed: false,
    actionUrl: "/teacher/schedule",
    metadata: {
      periodNumber: 5,
      date: "Wednesday"
    }
  },
  
  // Low - Holiday Declared
  {
    id: "notif-9",
    type: "holiday_declared",
    priority: "low",
    title: "Republic Day Holiday",
    message: "Institute will remain closed on January 26, 2025 for Republic Day celebrations.",
    timestamp: daysAgo(3),
    read: true,
    dismissed: false,
    metadata: {
      date: "2025-01-26"
    }
  },
  
  // Urgent - Exam Assigned for Review
  {
    id: "notif-10",
    type: "exam_assigned",
    priority: "urgent",
    title: "Question Paper Review Required",
    message: "Please review and approve the Physics Unit Test paper for Class 10A by tomorrow 5 PM.",
    timestamp: hoursAgo(4),
    read: false,
    dismissed: false,
    actionUrl: "/teacher/exams",
    metadata: {
      examId: "exam-002",
      batchName: "10A - Morning"
    }
  },
  
  // Medium - Substitution Cancelled
  {
    id: "notif-11",
    type: "substitution_cancelled",
    priority: "medium",
    title: "Substitution Cancelled",
    message: "Your substitution for Class 9A Period 2 on Jan 10 has been cancelled. Original teacher has returned.",
    timestamp: daysAgo(1),
    read: true,
    dismissed: false,
    metadata: {
      batchName: "9A",
      periodNumber: 2
    }
  },
  
  // Low - General Announcement
  {
    id: "notif-12",
    type: "general_announcement",
    priority: "low",
    title: "Staff Meeting Reminder",
    message: "Monthly staff meeting scheduled for Jan 15, 2025 at 4:00 PM in Conference Hall.",
    timestamp: daysAgo(4),
    read: true,
    dismissed: false
  },
  
  // High - Syllabus Deadline
  {
    id: "notif-13",
    type: "syllabus_updated",
    priority: "high",
    title: "Syllabus Completion Deadline",
    message: "Chapter 'Waves and Oscillations' must be completed by Jan 25 as per academic calendar.",
    timestamp: daysAgo(2),
    read: false,
    dismissed: false,
    actionUrl: "/teacher/academic-progress",
    metadata: {
      subjectName: "Physics"
    }
  },
  
  // Medium - Content Update
  {
    id: "notif-14",
    type: "content_shared",
    priority: "medium",
    title: "Updated NCERT Solutions Available",
    message: "Latest NCERT solutions for Class 11 Physics Chapters 5-8 added to content library.",
    timestamp: daysAgo(5),
    read: true,
    dismissed: false,
    actionUrl: "/teacher/content"
  }
];

// Helper to get unread notifications
export const getUnreadNotifications = () => 
  teacherNotifications.filter(n => !n.read && !n.dismissed);

// Helper to get urgent alerts for dashboard
export const getUrgentAlerts = () => 
  teacherNotifications.filter(n => 
    !n.dismissed && 
    (n.priority === "urgent" || n.priority === "high") &&
    !n.read
  );
