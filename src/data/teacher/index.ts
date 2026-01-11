// Teacher Module Data - Barrel Export

// Types
export * from './types';

// Profile
export { currentTeacher } from './profile';

// Schedule
export { teacherWeeklySchedule, teacherTodayTimetable } from './schedule';

// Lesson Plans
export { teacherLessonPlans } from './lessonPlans';

// Assessments, Homework & Exams
export { teacherAssessments } from './assessments';
export { teacherHomework } from './homework';
export { teacherExams } from './exams';
export * from './examResults';

// Notifications
export { teacherNotifications, getUnreadNotifications, getUrgentAlerts } from './notifications';


// Stats & Actions
export { 
  teacherPendingActions, 
  teacherWeeklyStats, 
  teacherProfileStats, 
  teacherContentFilters 
} from './stats';

// Helpers (for internal use)
export { formatDate, today, weekDates, getWeekDates } from './helpers';
