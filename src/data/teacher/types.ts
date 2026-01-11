// Teacher Module Type Definitions

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
  subjects: string[];
  assignedBatches: string[];
  assignedClasses: string[];
}

export interface TeacherTimetableSlot {
  id: string;
  day: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  subjectId: string;
  batchId: string;
  batchName: string;
  className: string;
  room?: string;
  hasLessonPlan: boolean;
  lessonPlanId?: string;
  lessonPlanStatus?: 'ready' | 'draft' | 'none';
  topic?: string;
  periodType?: 'regular' | 'lab' | 'sports' | 'library';
}

// Enhanced LessonPlanBlock with workspace types alignment
export interface LessonPlanBlock {
  id: string;
  type: 'explain' | 'demonstrate' | 'quiz' | 'homework';
  title: string;
  content?: string;
  duration?: number; // in minutes
  source: 'library' | 'ai' | 'custom';
  sourceId?: string; // Reference to content/question ID
  sourceType?: 'video' | 'pdf' | 'ppt' | 'animation' | 'iframe';
  questions?: string[]; // Question IDs for quiz blocks
  questionCount?: number; // For display
  embedUrl?: string; // For custom embeds
  linkType?: 'youtube' | 'vimeo' | 'google-docs' | 'iframe';
  aiGenerated?: boolean;
  attachmentUrl?: string; // For file attachments
}

// Enhanced LessonPlan interface
export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  subjectId: string;
  chapter: string;
  chapterId?: string;
  topics: string[]; // Array of topic names
  batchId: string;
  batchName: string;
  className: string;
  scheduledDate: string;
  periodNumber: number;
  status: 'draft' | 'ready' | 'used'; // Added 'used' status
  usedDate?: string; // When was it used in class
  totalDuration: number; // Pre-calculated total duration
  blocks: LessonPlanBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAssessment {
  id: string;
  title: string;
  type: 'quiz' | 'test' | 'poll';
  subject: string;
  batchId: string;
  batchName: string;
  className: string;
  questionCount: number;
  duration?: number;
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'live' | 'completed';
  createdAt: string;
}

// Teacher Exam (Full exam with all features from Institute panel)
export interface TeacherExam {
  id: string;
  name: string;
  subjects: string[];
  pattern: 'custom' | 'jee_main' | 'jee_advanced' | 'neet';
  uiType: 'platform' | 'real_exam';
  totalQuestions: number;
  totalMarks: number;
  duration: number;
  negativeMarking: boolean;
  negativeMarks: number;
  creationMethod: 'ai' | 'pdf' | 'questionBank';
  batchIds: string[];
  scheduledDate?: string;
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'live' | 'completed';
  questionIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type HomeworkType = 'practice' | 'test' | 'project';

export interface TeacherHomework {
  id: string;
  title: string;
  subject: string;
  batchId: string;
  batchName: string;
  className: string;
  dueDate: string;
  assignedDate: string;
  status: 'assigned' | 'overdue' | 'completed';
  submissionCount: number;
  totalStudents: number;
  linkedLessonPlanId?: string;
  homeworkType?: HomeworkType;
  instructions?: string;
  attachments?: string[];
}

export interface PendingAction {
  id: string;
  type: 'homework' | 'quiz' | 'lesson_plan' | 'review';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  linkedId?: string;
}
