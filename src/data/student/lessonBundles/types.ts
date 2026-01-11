// Lesson Bundles - Type Definitions

export type ContentType = 'video' | 'pdf' | 'quiz' | 'simulation' | 'document' | 'screenshot';

export interface LessonBundle {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  teacherName: string;
  date: string; // ISO date
  duration: string; // e.g., "45 min"
  isViewed: boolean;
  contentSummary: {
    type: ContentType;
    count: number;
  }[];
  hasScreenshots: boolean;
}

export interface BundleContentItem {
  id: string;
  bundleId: string;
  type: ContentType;
  title: string;
  description?: string;
  duration?: string; // for videos
  pageCount?: number; // for PDFs
  questionCount?: number; // for quizzes
  url?: string;
  isCompleted: boolean;
  order: number;
}

export interface TeacherScreenshot {
  id: string;
  bundleId: string;
  title: string;
  description?: string;
  imageUrl: string;
  timestamp: string;
  annotations?: string[];
}

export type HomeworkType = 'practice' | 'test' | 'project';
export type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'late';

export interface HomeworkItem {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  dueDate: string;
  questionsCount: number;
  isCompleted: boolean;
  isStarted: boolean;
  linkedSessionId?: string;
  linkedSessionTitle?: string;
  // Homework type determines submission UI
  homeworkType: HomeworkType;
  instructions?: string;
  attachments?: { name: string; url: string }[]; // Teacher-provided files
  // Submission tracking
  submissionStatus?: SubmissionStatus;
  submittedAt?: string;
  submissionFiles?: { name: string; url: string; type: string }[];
  submissionText?: string;
  submissionLink?: string;
  grade?: number;
  maxGrade?: number;
  feedback?: string;
  // For test type
  testId?: string;
  testDuration?: string;
}

export interface AIPathItem {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  contentType: 'practice' | 'review' | 'concept';
  isCompleted: boolean;
  linkedTopics: string[];
}

export interface ChallengeItem {
  id: string;
  chapterId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  topPercentileScore: number;
  isCompleted: boolean;
  userScore?: number;
}
