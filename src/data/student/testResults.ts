// Test Results Data
// Mock data for completed test results and analytics

import type { TestSection, TestQuestion, QuestionType } from "./testQuestions";
import { allSampleQuestions, sampleTestSections } from "./testQuestions";

export interface QuestionResult {
  id: string;
  questionNumber: number;
  sectionId: string;
  subject: string;
  type: QuestionType;
  text: string;
  correctAnswer: string | string[] | number | Record<string, string>;
  userAnswer?: string | string[] | number | Record<string, string>;
  isCorrect: boolean;
  isAttempted: boolean;
  marksObtained: number;
  maxMarks: number;
  negativeMarks: number;
  timeSpent: number; // seconds
  difficulty: "easy" | "medium" | "hard";
}

export interface SectionResult {
  id: string;
  name: string;
  subject: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  marksObtained: number;
  maxMarks: number;
  accuracy: number; // percentage
  averageTime: number; // seconds per question
  totalTime: number; // seconds
  classAverage?: number;
  topperScore?: number;
}

export interface TestResultData {
  testId: string;
  testName: string;
  pattern: string;
  submittedAt: string;
  startedAt: string;
  timeTaken: number; // seconds
  totalDuration: number; // minutes
  
  // Overall Score
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  rank?: number;
  totalParticipants?: number;
  percentile?: number;
  
  // Question Stats
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number; // percentage
  
  // Section-wise Results
  sections: SectionResult[];
  
  // Question-level Results
  questions: QuestionResult[];
}

// Generate mock question results
const generateQuestionResults = (
  questions: TestQuestion[],
  sections: TestSection[]
): QuestionResult[] => {
  let questionNumber = 1;
  const results: QuestionResult[] = [];

  sections.forEach((section) => {
    const sectionQuestions = questions.filter((q) => q.subject === section.subject);
    
    sectionQuestions.forEach((q) => {
      // Simulate random results
      const isAttempted = Math.random() > 0.15; // 85% attempt rate
      const isCorrect = isAttempted && Math.random() > 0.35; // 65% accuracy if attempted
      const timeSpent = Math.floor(Math.random() * 180) + 30; // 30-210 seconds
      
      const maxMarks = q.marks;
      const negMarks = q.negativeMarks || 0;
      const marksObtained = isCorrect ? maxMarks : (isAttempted ? -negMarks : 0);
      
      results.push({
        id: q.id,
        questionNumber: questionNumber++,
        sectionId: section.id,
        subject: q.subject,
        type: q.type,
        text: q.text,
        correctAnswer: getCorrectAnswer(q),
        userAnswer: isAttempted ? getMockUserAnswer(q, isCorrect) : undefined,
        isCorrect,
        isAttempted,
        marksObtained,
        maxMarks,
        negativeMarks: negMarks,
        timeSpent,
        difficulty: q.difficulty || "medium",
      });
    });
  });

  return results;
};

// Helper to extract correct answer from question
const getCorrectAnswer = (q: TestQuestion): string | string[] | number | Record<string, string> => {
  switch (q.type) {
    case "mcq_single":
    case "assertion_reasoning":
    case "paragraph":
      return q.options?.find(opt => opt.isCorrect)?.id || "a";
    case "mcq_multiple":
      return q.options?.filter(opt => opt.isCorrect).map(opt => opt.id) || ["a"];
    case "integer":
      return q.correctAnswer || 0;
    case "fill_blank":
      return q.blanks?.reduce((acc, b) => ({ ...acc, [b.id]: b.correctAnswer || "" }), {}) || {};
    case "matrix_match":
      return q.rows?.reduce((acc, r) => ({ ...acc, [r.id]: r.correctMatch || "" }), {}) || {};
    default:
      return "";
  }
};

// Generate mock user answer
const getMockUserAnswer = (q: TestQuestion, isCorrect: boolean): string | string[] | number | Record<string, string> => {
  if (isCorrect) return getCorrectAnswer(q);
  
  // Return wrong answer
  switch (q.type) {
    case "mcq_single":
    case "assertion_reasoning":
    case "paragraph":
      const wrongOpts = q.options?.filter(opt => !opt.isCorrect) || [];
      return wrongOpts[0]?.id || "b";
    case "mcq_multiple":
      return ["b", "c"];
    case "integer":
      return (q.correctAnswer || 0) + Math.floor(Math.random() * 10) - 5;
    default:
      return "";
  }
};

// Generate section results from question results
const generateSectionResults = (
  questionResults: QuestionResult[],
  sections: TestSection[]
): SectionResult[] => {
  return sections.map((section) => {
    const sectionQs = questionResults.filter((q) => q.sectionId === section.id);
    const attempted = sectionQs.filter((q) => q.isAttempted).length;
    const correct = sectionQs.filter((q) => q.isCorrect).length;
    const incorrect = attempted - correct;
    const skipped = sectionQs.length - attempted;
    const marksObtained = sectionQs.reduce((sum, q) => sum + q.marksObtained, 0);
    const maxMarks = sectionQs.reduce((sum, q) => sum + q.maxMarks, 0);
    const totalTime = sectionQs.reduce((sum, q) => sum + q.timeSpent, 0);
    
    return {
      id: section.id,
      name: section.name,
      subject: section.subject,
      totalQuestions: sectionQs.length,
      attempted,
      correct,
      incorrect,
      skipped,
      marksObtained,
      maxMarks,
      accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
      averageTime: sectionQs.length > 0 ? Math.round(totalTime / sectionQs.length) : 0,
      totalTime,
    };
  });
};

// Generate complete test result
const questionResults = generateQuestionResults(allSampleQuestions, sampleTestSections);
const sectionResults = generateSectionResults(questionResults, sampleTestSections);

const totalMarks = questionResults.reduce((sum, q) => sum + q.maxMarks, 0);
const marksObtained = questionResults.reduce((sum, q) => sum + q.marksObtained, 0);
const attempted = questionResults.filter((q) => q.isAttempted).length;
const correct = questionResults.filter((q) => q.isCorrect).length;

export const sampleTestResult: TestResultData = {
  testId: "gt-1",
  testName: "Grand Test #18",
  pattern: "jee_main",
  submittedAt: new Date().toISOString(),
  startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  timeTaken: 6840, // 1 hour 54 minutes
  totalDuration: 180,
  
  totalMarks,
  marksObtained: Math.max(0, marksObtained),
  percentage: Math.round((Math.max(0, marksObtained) / totalMarks) * 100),
  rank: 156,
  totalParticipants: 2847,
  percentile: 94.5,
  
  totalQuestions: questionResults.length,
  attempted,
  correct,
  incorrect: attempted - correct,
  skipped: questionResults.length - attempted,
  accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
  
  sections: sectionResults,
  questions: questionResults,
};

// Helper: Format time for display
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

// Helper: Get difficulty color
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy": return "text-emerald-600 bg-emerald-100";
    case "medium": return "text-amber-600 bg-amber-100";
    case "hard": return "text-red-600 bg-red-100";
    default: return "text-muted-foreground bg-muted";
  }
};

// Helper: Get accuracy color based on percentage
export const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 70) return "text-emerald-600";
  if (accuracy >= 40) return "text-amber-600";
  return "text-red-600";
};

// Helper: Compute question stats from a question array
export const getQuestionStats = (questions: QuestionResult[]) => {
  const total = questions.length;
  const attempted = questions.filter(q => q.isAttempted).length;
  const correct = questions.filter(q => q.isCorrect).length;
  const wrong = attempted - correct;
  const skipped = total - attempted;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  return { total, attempted, correct, wrong, skipped, accuracy };
};

// Helper: Get subject color
export const getSubjectColor = (subject: string) => {
  switch (subject.toLowerCase()) {
    case "physics": return { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-100" };
    case "chemistry": return { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-100" };
    case "mathematics": return { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-100" };
    case "biology": return { bg: "bg-rose-500", text: "text-rose-600", light: "bg-rose-100" };
    default: return { bg: "bg-slate-500", text: "text-slate-600", light: "bg-slate-100" };
  }
};
