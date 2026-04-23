// Student Dashboard Data
// Mock data for homework, schedule, tests, and AI recommendations

export interface Homework {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'overdue';
}

export interface ScheduleItem {
  id: number;
  time: string;
  endTime: string;
  subject?: string;
  topic?: string;
  room?: string;
  teacher?: string;
  status: 'completed' | 'current' | 'upcoming';
  type?: 'class' | 'break' | 'exam';
  label?: string;
  lessonPlanId?: string;
  examTitle?: string;
  examType?: 'quiz' | 'test' | 'exam';
}

export interface UpcomingTest {
  id: number;
  subject: string;
  title: string;
  date: string;
  type: 'quiz' | 'test' | 'exam';
}

export interface AIRecommendation {
  id: number;
  type: 'continue' | 'focus' | 'quick-win';
  title: string;
  description: string;
  action: string;
  subject?: string;
  copilotRoutine?: string;
  copilotPrompt?: string;
}

// Subject color mapping for consistency
export const subjectColors: Record<string, { bg: string; text: string; icon: string }> = {
  math: { bg: 'bg-blue-500', text: 'text-blue-500', icon: 'from-blue-400 to-indigo-500' },
  physics: { bg: 'bg-teal-500', text: 'text-teal-500', icon: 'from-teal-400 to-cyan-500' },
  chemistry: { bg: 'bg-purple-500', text: 'text-purple-500', icon: 'from-purple-400 to-violet-500' },
  biology: { bg: 'bg-emerald-500', text: 'text-emerald-500', icon: 'from-emerald-400 to-green-500' },
  english: { bg: 'bg-amber-500', text: 'text-amber-500', icon: 'from-amber-400 to-orange-500' },
  cs: { bg: 'bg-rose-500', text: 'text-rose-500', icon: 'from-rose-400 to-pink-500' },
};

// Homework assignments
export const studentHomework: Homework[] = [
  { 
    id: 1, 
    subject: 'math', 
    title: 'Quadratic Equations Practice', 
    dueDate: '2026-01-11T17:00:00', 
    status: 'pending' 
  },
  { 
    id: 2, 
    subject: 'physics', 
    title: 'Motion Worksheet', 
    dueDate: '2026-01-14T17:00:00', 
    status: 'pending' 
  },
  { 
    id: 3, 
    subject: 'chemistry', 
    title: 'Lab Report: Titration', 
    dueDate: '2026-01-16T17:00:00', 
    status: 'pending' 
  },
  { 
    id: 4, 
    subject: 'biology', 
    title: 'Cell Structure Diagram', 
    dueDate: '2026-01-13T17:00:00', 
    status: 'pending' 
  },
];

// Today's schedule (timetable)
export const todaySchedule: ScheduleItem[] = [
  { 
    id: 1, 
    time: '9:00 AM', 
    endTime: '10:00 AM', 
    subject: 'math', 
    topic: 'Quadratic Equations', 
    room: '105', 
    teacher: 'Mrs. Gupta', 
    status: 'completed',
    type: 'class'
  },
  { 
    id: 2, 
    time: '10:15 AM', 
    endTime: '11:15 AM', 
    subject: 'chemistry', 
    topic: 'Organic Compounds', 
    room: '302', 
    teacher: 'Mrs. Sharma', 
    status: 'completed',
    type: 'class'
  },
  { 
    id: 3, 
    time: '11:30 AM', 
    endTime: '12:30 PM', 
    subject: 'physics', 
    topic: 'Laws of Motion', 
    room: '201', 
    teacher: 'Mr. Verma', 
    status: 'current',
    type: 'class'
  },
  { 
    id: 4, 
    time: '12:30 PM', 
    endTime: '1:30 PM', 
    type: 'break', 
    label: 'Lunch Break',
    status: 'upcoming'
  },
  { 
    id: 5, 
    time: '1:30 PM', 
    endTime: '2:30 PM', 
    subject: 'english', 
    topic: 'Essay Writing', 
    room: '110', 
    teacher: 'Ms. Reddy', 
    status: 'upcoming',
    type: 'class'
  },
  { 
    id: 6, 
    time: '2:45 PM', 
    endTime: '3:45 PM', 
    subject: 'biology', 
    topic: 'Cell Biology', 
    room: '205', 
    teacher: 'Dr. Kumar', 
    status: 'upcoming',
    type: 'class'
  },
];

// Upcoming tests
export const upcomingTests: UpcomingTest[] = [
  { 
    id: 1, 
    subject: 'physics', 
    title: 'Kinematics Quiz', 
    date: '2026-01-11T14:30:00', 
    type: 'quiz' 
  },
  { 
    id: 2, 
    subject: 'math', 
    title: 'Algebra Unit Test', 
    date: '2026-01-12T10:00:00', 
    type: 'test' 
  },
  { 
    id: 3, 
    subject: 'chemistry', 
    title: 'Periodic Table Test', 
    date: '2026-01-14T11:00:00', 
    type: 'test' 
  },
  { 
    id: 4, 
    subject: 'biology', 
    title: 'Cell Biology Exam', 
    date: '2026-01-18T10:00:00', 
    type: 'exam' 
  },
];

// AI Recommendations
export const aiRecommendations: AIRecommendation[] = [
  { 
    id: 1, 
    type: 'continue', 
    title: 'Continue where you left off', 
    description: 'Physics - Chapter 4: Force and Motion', 
    action: 'Continue',
    subject: 'physics',
    copilotRoutine: 's_doubt',
    copilotPrompt: 'Help me continue with Force and Motion in Physics Chapter 4'
  },
  { 
    id: 2, 
    type: 'focus', 
    title: 'Needs your attention', 
    description: 'Biology is 2 chapters behind schedule', 
    action: 'Review',
    subject: 'biology',
    copilotRoutine: 's_practice',
    copilotPrompt: 'Practice weak topics in Biology to catch up on the 2 chapters I am behind'
  },
  { 
    id: 3, 
    type: 'quick-win', 
    title: 'Almost there!', 
    description: 'Complete Chemistry Ch.5 to finish the unit', 
    action: 'Finish',
    subject: 'chemistry',
    copilotRoutine: 's_practice',
    copilotPrompt: 'Quick practice on Chemistry Chapter 5 to finish the unit'
  },
];

// Helper function to get urgency level based on due date
export const getHomeworkUrgency = (dueDate: string): 'urgent' | 'soon' | 'normal' => {
  const now = new Date();
  const due = new Date(dueDate);
  const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilDue < 24) return 'urgent';
  if (hoursUntilDue < 72) return 'soon';
  return 'normal';
};

// Helper function to format relative date
export const formatRelativeDate = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper function to format time
export const formatTestTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};
