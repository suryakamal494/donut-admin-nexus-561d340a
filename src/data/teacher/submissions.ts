// Teacher Homework Submissions - Types and Mock Data
import { formatDate, today } from './helpers';

// Submission status for all types
export type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'late';

// Base submission interface
export interface BaseSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  rollNumber: string;
  homeworkId: string;
  status: SubmissionStatus;
  submittedAt?: string;
  gradedAt?: string;
  grade?: number;
  maxGrade?: number;
  feedback?: string;
}

// Practice submission - file uploads, text answers
export interface PracticeSubmission extends BaseSubmission {
  submissionType: 'file' | 'text' | 'link' | 'image';
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  textAnswer?: string;
  linkUrl?: string;
  imageUrls?: string[];
}

// Test submission - exam results
export interface TestSubmission extends BaseSubmission {
  score: number;
  maxScore: number;
  percentage: number;
  timeTaken: number; // in minutes
  attemptedQuestions: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  completionStatus: 'completed' | 'partial' | 'not_started';
}

// Project submission - project files
export interface ProjectSubmission extends BaseSubmission {
  projectTitle?: string;
  projectFiles: Array<{
    name: string;
    type: 'ppt' | 'pdf' | 'doc' | 'zip' | 'image' | 'video';
    url: string;
    size: string;
  }>;
  description?: string;
}

// Union type for all submissions
export type HomeworkSubmission = PracticeSubmission | TestSubmission | ProjectSubmission;

// Helper to check submission type
export function isPracticeSubmission(sub: HomeworkSubmission): sub is PracticeSubmission {
  return 'submissionType' in sub && !('projectFiles' in sub) && !('score' in sub);
}

export function isTestSubmission(sub: HomeworkSubmission): sub is TestSubmission {
  return 'score' in sub && 'completionStatus' in sub;
}

export function isProjectSubmission(sub: HomeworkSubmission): sub is ProjectSubmission {
  return 'projectFiles' in sub;
}

// ==================== MOCK DATA ====================

// Practice Homework Submissions (hw-1: Practice Problems - Newton's Laws)
export const practiceSubmissions: PracticeSubmission[] = [
  {
    id: "ps-1",
    studentId: "std-1",
    studentName: "Aanya Sharma",
    rollNumber: "10A-01",
    homeworkId: "hw-1",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    submissionType: "file",
    fileName: "newton_laws_solutions.pdf",
    fileUrl: "/uploads/newton_laws_solutions.pdf",
    fileSize: "1.2 MB",
  },
  {
    id: "ps-2",
    studentId: "std-2",
    studentName: "Rahul Verma",
    rollNumber: "10A-02",
    homeworkId: "hw-1",
    status: "graded",
    submittedAt: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
    gradedAt: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    grade: 18,
    maxGrade: 20,
    feedback: "Excellent work! Minor error in Q5 calculation.",
    submissionType: "file",
    fileName: "physics_hw_rahul.pdf",
    fileUrl: "/uploads/physics_hw_rahul.pdf",
    fileSize: "985 KB",
  },
  {
    id: "ps-3",
    studentId: "std-3",
    studentName: "Priya Patel",
    rollNumber: "10A-03",
    homeworkId: "hw-1",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 3 * 60 * 60 * 1000)), // 3 hours ago
    submissionType: "image",
    imageUrls: ["/uploads/priya_page1.jpg", "/uploads/priya_page2.jpg"],
    fileName: "2 images",
    fileSize: "3.5 MB",
  },
  {
    id: "ps-4",
    studentId: "std-4",
    studentName: "Arjun Reddy",
    rollNumber: "10A-04",
    homeworkId: "hw-1",
    status: "late",
    submittedAt: formatDate(today),
    submissionType: "file",
    fileName: "arjun_newton_laws.pdf",
    fileUrl: "/uploads/arjun_newton_laws.pdf",
    fileSize: "1.8 MB",
  },
  {
    id: "ps-5",
    studentId: "std-5",
    studentName: "Kavya Nair",
    rollNumber: "10A-05",
    homeworkId: "hw-1",
    status: "pending",
    submissionType: "file",
  },
  {
    id: "ps-6",
    studentId: "std-6",
    studentName: "Rohan Gupta",
    rollNumber: "10A-06",
    homeworkId: "hw-1",
    status: "graded",
    submittedAt: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
    gradedAt: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    grade: 15,
    maxGrade: 20,
    feedback: "Good attempt. Need to show more steps in Q3 and Q7.",
    submissionType: "text",
    textAnswer: "Question 1: F = ma = 5 × 2 = 10N\nQuestion 2: Using Newton's third law, the reaction force is equal and opposite...\n[Full answer continues for 500+ words]",
  },
  {
    id: "ps-7",
    studentId: "std-7",
    studentName: "Sneha Iyer",
    rollNumber: "10A-07",
    homeworkId: "hw-1",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 12 * 60 * 60 * 1000)),
    submissionType: "link",
    linkUrl: "https://docs.google.com/document/d/1abc123/edit",
    fileName: "Google Docs Link",
  },
  {
    id: "ps-8",
    studentId: "std-8",
    studentName: "Vikram Singh",
    rollNumber: "10A-08",
    homeworkId: "hw-1",
    status: "pending",
    submissionType: "file",
  },
  {
    id: "ps-9",
    studentId: "std-9",
    studentName: "Ananya Das",
    rollNumber: "10A-09",
    homeworkId: "hw-1",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 6 * 60 * 60 * 1000)),
    submissionType: "file",
    fileName: "newton_homework_ananya.pdf",
    fileUrl: "/uploads/newton_homework_ananya.pdf",
    fileSize: "2.1 MB",
  },
  {
    id: "ps-10",
    studentId: "std-10",
    studentName: "Karthik Menon",
    rollNumber: "10A-10",
    homeworkId: "hw-1",
    status: "graded",
    submittedAt: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
    gradedAt: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
    grade: 20,
    maxGrade: 20,
    feedback: "Perfect! Outstanding understanding of Newton's Laws.",
    submissionType: "file",
    fileName: "karthik_physics_perfect.pdf",
    fileUrl: "/uploads/karthik_physics_perfect.pdf",
    fileSize: "1.5 MB",
  },
  {
    id: "ps-11",
    studentId: "std-11",
    studentName: "Meera Krishnan",
    rollNumber: "10A-11",
    homeworkId: "hw-1",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 18 * 60 * 60 * 1000)),
    submissionType: "file",
    fileName: "meera_newton_solutions.pdf",
    fileUrl: "/uploads/meera_newton_solutions.pdf",
    fileSize: "1.1 MB",
  },
  {
    id: "ps-12",
    studentId: "std-12",
    studentName: "Aditya Kulkarni",
    rollNumber: "10A-12",
    homeworkId: "hw-1",
    status: "pending",
    submissionType: "file",
  },
];

// Test Homework Submissions (hw-3: Chapter Test: Mechanics)
export const testSubmissions: TestSubmission[] = [
  {
    id: "ts-1",
    studentId: "std-1",
    studentName: "Aanya Sharma",
    rollNumber: "10A-01",
    homeworkId: "hw-3",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 2 * 60 * 60 * 1000)),
    score: 42,
    maxScore: 50,
    percentage: 84,
    timeTaken: 38,
    attemptedQuestions: 25,
    totalQuestions: 25,
    correctAnswers: 21,
    wrongAnswers: 4,
    completionStatus: "completed",
  },
  {
    id: "ts-2",
    studentId: "std-2",
    studentName: "Rahul Verma",
    rollNumber: "10A-02",
    homeworkId: "hw-3",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 3 * 60 * 60 * 1000)),
    score: 48,
    maxScore: 50,
    percentage: 96,
    timeTaken: 32,
    attemptedQuestions: 25,
    totalQuestions: 25,
    correctAnswers: 24,
    wrongAnswers: 1,
    completionStatus: "completed",
  },
  {
    id: "ts-3",
    studentId: "std-3",
    studentName: "Priya Patel",
    rollNumber: "10A-03",
    homeworkId: "hw-3",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 1 * 60 * 60 * 1000)),
    score: 35,
    maxScore: 50,
    percentage: 70,
    timeTaken: 44,
    attemptedQuestions: 23,
    totalQuestions: 25,
    correctAnswers: 17,
    wrongAnswers: 6,
    completionStatus: "completed",
  },
  {
    id: "ts-4",
    studentId: "std-4",
    studentName: "Arjun Reddy",
    rollNumber: "10A-04",
    homeworkId: "hw-3",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 4 * 60 * 60 * 1000)),
    score: 22,
    maxScore: 50,
    percentage: 44,
    timeTaken: 45,
    attemptedQuestions: 20,
    totalQuestions: 25,
    correctAnswers: 11,
    wrongAnswers: 9,
    completionStatus: "partial",
  },
  {
    id: "ts-5",
    studentId: "std-5",
    studentName: "Kavya Nair",
    rollNumber: "10A-05",
    homeworkId: "hw-3",
    status: "pending",
    score: 0,
    maxScore: 50,
    percentage: 0,
    timeTaken: 0,
    attemptedQuestions: 0,
    totalQuestions: 25,
    correctAnswers: 0,
    wrongAnswers: 0,
    completionStatus: "not_started",
  },
  {
    id: "ts-6",
    studentId: "std-6",
    studentName: "Rohan Gupta",
    rollNumber: "10A-06",
    homeworkId: "hw-3",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 5 * 60 * 60 * 1000)),
    score: 39,
    maxScore: 50,
    percentage: 78,
    timeTaken: 40,
    attemptedQuestions: 25,
    totalQuestions: 25,
    correctAnswers: 19,
    wrongAnswers: 6,
    completionStatus: "completed",
  },
  {
    id: "ts-7",
    studentId: "std-7",
    studentName: "Sneha Iyer",
    rollNumber: "10A-07",
    homeworkId: "hw-3",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 30 * 60 * 1000)), // 30 min ago
    score: 45,
    maxScore: 50,
    percentage: 90,
    timeTaken: 35,
    attemptedQuestions: 25,
    totalQuestions: 25,
    correctAnswers: 22,
    wrongAnswers: 3,
    completionStatus: "completed",
  },
  {
    id: "ts-8",
    studentId: "std-8",
    studentName: "Vikram Singh",
    rollNumber: "10A-08",
    homeworkId: "hw-3",
    status: "pending",
    score: 0,
    maxScore: 50,
    percentage: 0,
    timeTaken: 0,
    attemptedQuestions: 0,
    totalQuestions: 25,
    correctAnswers: 0,
    wrongAnswers: 0,
    completionStatus: "not_started",
  },
];

// Project Homework Submissions (hw-4: Project: Renewable Energy Sources)
export const projectSubmissions: ProjectSubmission[] = [
  {
    id: "pjs-1",
    studentId: "std-11-1",
    studentName: "Ishaan Kapoor",
    rollNumber: "11A-01",
    homeworkId: "hw-4",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    projectTitle: "Solar Energy: The Future of Power",
    projectFiles: [
      { name: "solar_energy_presentation.pptx", type: "ppt", url: "/uploads/solar_energy.pptx", size: "8.5 MB" },
      { name: "research_references.pdf", type: "pdf", url: "/uploads/solar_refs.pdf", size: "420 KB" },
    ],
    description: "A comprehensive study of solar energy technology, covering photovoltaic cells, solar thermal systems, and future innovations.",
  },
  {
    id: "pjs-2",
    studentId: "std-11-2",
    studentName: "Diya Sharma",
    rollNumber: "11A-02",
    homeworkId: "hw-4",
    status: "graded",
    submittedAt: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
    gradedAt: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    grade: 95,
    maxGrade: 100,
    feedback: "Exceptional research and presentation. Great use of data visualization. Minor improvement needed in conclusion.",
    projectTitle: "Wind Power: Harnessing Nature's Force",
    projectFiles: [
      { name: "wind_power_project.pptx", type: "ppt", url: "/uploads/wind_power.pptx", size: "12.3 MB" },
      { name: "wind_turbine_diagrams.pdf", type: "pdf", url: "/uploads/turbine_diagrams.pdf", size: "2.1 MB" },
      { name: "data_analysis.xlsx", type: "doc", url: "/uploads/wind_data.xlsx", size: "156 KB" },
    ],
    description: "Exploration of wind energy including offshore and onshore wind farms, turbine technology, and global adoption trends.",
  },
  {
    id: "pjs-3",
    studentId: "std-11-3",
    studentName: "Aryan Mehta",
    rollNumber: "11A-03",
    homeworkId: "hw-4",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 12 * 60 * 60 * 1000)),
    projectTitle: "Hydroelectric Power: Rivers of Energy",
    projectFiles: [
      { name: "hydro_power_ppt.pptx", type: "ppt", url: "/uploads/hydro_power.pptx", size: "6.8 MB" },
    ],
    description: "Study of hydroelectric dams, micro-hydro systems, and their environmental impact.",
  },
  {
    id: "pjs-4",
    studentId: "std-11-4",
    studentName: "Nisha Reddy",
    rollNumber: "11A-04",
    homeworkId: "hw-4",
    status: "late",
    submittedAt: formatDate(today),
    projectTitle: "Geothermal Energy: Earth's Hidden Power",
    projectFiles: [
      { name: "geothermal_project.pdf", type: "pdf", url: "/uploads/geothermal.pdf", size: "4.2 MB" },
      { name: "geothermal_slides.pptx", type: "ppt", url: "/uploads/geothermal_slides.pptx", size: "5.6 MB" },
    ],
    description: "Analysis of geothermal energy extraction methods and applications in heating and electricity generation.",
  },
  {
    id: "pjs-5",
    studentId: "std-11-5",
    studentName: "Vivaan Joshi",
    rollNumber: "11A-05",
    homeworkId: "hw-4",
    status: "pending",
    projectFiles: [],
  },
  {
    id: "pjs-6",
    studentId: "std-11-6",
    studentName: "Anvi Patel",
    rollNumber: "11A-06",
    homeworkId: "hw-4",
    status: "submitted",
    submittedAt: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
    projectTitle: "Biomass Energy: Turning Waste into Power",
    projectFiles: [
      { name: "biomass_energy.pptx", type: "ppt", url: "/uploads/biomass.pptx", size: "7.2 MB" },
      { name: "case_study_india.pdf", type: "pdf", url: "/uploads/biomass_india.pdf", size: "1.8 MB" },
      { name: "video_demonstration.mp4", type: "video", url: "/uploads/biomass_demo.mp4", size: "45 MB" },
    ],
    description: "Comprehensive overview of biomass energy with focus on agricultural waste conversion in India.",
  },
  {
    id: "pjs-7",
    studentId: "std-11-7",
    studentName: "Rehan Khan",
    rollNumber: "11A-07",
    homeworkId: "hw-4",
    status: "pending",
    projectFiles: [],
  },
];

// Get submissions by homework ID and type
export function getSubmissionsForHomework(
  homeworkId: string, 
  homeworkType?: 'practice' | 'test' | 'project'
): HomeworkSubmission[] {
  switch (homeworkType) {
    case 'practice':
      return practiceSubmissions.filter(s => s.homeworkId === homeworkId);
    case 'test':
      return testSubmissions.filter(s => s.homeworkId === homeworkId);
    case 'project':
      return projectSubmissions.filter(s => s.homeworkId === homeworkId);
    default:
      // Try to find in any collection
      const practice = practiceSubmissions.filter(s => s.homeworkId === homeworkId);
      if (practice.length > 0) return practice;
      
      const test = testSubmissions.filter(s => s.homeworkId === homeworkId);
      if (test.length > 0) return test;
      
      return projectSubmissions.filter(s => s.homeworkId === homeworkId);
  }
}

// Get all submissions (combined)
export const allSubmissions: HomeworkSubmission[] = [
  ...practiceSubmissions,
  ...testSubmissions,
  ...projectSubmissions,
];
