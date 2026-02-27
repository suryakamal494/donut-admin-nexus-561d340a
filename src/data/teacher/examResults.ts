// Exam Results Mock Data for Analytics

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  score: number;
  maxScore: number;
  percentage: number;
  rank: number;
  timeTaken: number; // in minutes
  submittedAt: string;
  questionWiseResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  questionNumber: number;
  isCorrect: boolean | null; // null = unattempted
  marksObtained: number;
  maxMarks: number;
  timeTaken: number; // in seconds
}

export interface ExamAnalytics {
  examId: string;
  examName: string;
  totalStudents: number;
  attemptedCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageTime: number;
  passPercentage: number;
  scoreDistribution: ScoreRange[];
  questionAnalysis: QuestionAnalysis[];
  batchComparison: BatchStats[];
  topPerformers: StudentResult[];
  allStudents: StudentResult[];
}

export interface ScoreRange {
  range: string;
  count: number;
  percentage: number;
}

export interface QuestionAnalysis {
  questionId: string;
  questionNumber: number;
  subject: string;
  topic: string;
  correctAttempts: number;
  incorrectAttempts: number;
  unattempted: number;
  averageTime: number;
  successRate: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BatchStats {
  batchId: string;
  batchName: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
  attemptedCount: number;
  totalStudents: number;
}

// ── Performance Bands ──
export type BandKey = 'mastery' | 'stable' | 'reinforcement' | 'risk';

export interface PerformanceBand {
  key: BandKey;
  label: string;
  students: StudentResult[];
  count: number;
}

export interface TopicFlag {
  topic: string;
  successRate: number;
  status: 'strong' | 'moderate' | 'weak';
}

export interface VerdictSummary {
  averagePercentage: number;
  passedCount: number;
  totalAttempted: number;
  atRiskCount: number;
  weakTopicCount: number;
  topStudent: { name: string; percentage: number } | null;
  verdictText: string;
}

// ── Helpers ──

export function computePerformanceBands(students: StudentResult[]): PerformanceBand[] {
  const mastery = students.filter(s => s.percentage >= 75);
  const stable = students.filter(s => s.percentage >= 50 && s.percentage < 75);
  const reinforcement = students.filter(s => s.percentage >= 35 && s.percentage < 50);
  const risk = students.filter(s => s.percentage < 35);

  return [
    { key: 'mastery', label: 'Mastery Ready', students: mastery, count: mastery.length },
    { key: 'stable', label: 'Stable Progress', students: stable, count: stable.length },
    { key: 'reinforcement', label: 'Reinforcement Needed', students: reinforcement, count: reinforcement.length },
    { key: 'risk', label: 'Foundational Risk', students: risk, count: risk.length },
  ];
}

export function computeTopicFlags(questions: QuestionAnalysis[]): TopicFlag[] {
  return questions.map(q => ({
    topic: q.topic,
    successRate: q.successRate,
    status: q.successRate >= 70 ? 'strong' : q.successRate >= 40 ? 'moderate' : 'weak',
  }));
}

export function generateVerdictSummary(
  analytics: ExamAnalytics,
  bands: PerformanceBand[],
  topicFlags: TopicFlag[]
): VerdictSummary {
  const atRiskCount = (bands.find(b => b.key === 'risk')?.count ?? 0) +
    (bands.find(b => b.key === 'reinforcement')?.count ?? 0);
  const weakTopics = topicFlags.filter(t => t.status === 'weak');
  const topStudent = analytics.allStudents.length > 0
    ? { name: analytics.allStudents[0].studentName, percentage: analytics.allStudents[0].percentage }
    : null;

  const avgPct = analytics.allStudents.length > 0
    ? Math.round(analytics.allStudents.reduce((s, st) => s + st.percentage, 0) / analytics.allStudents.length)
    : 0;

  const parts: string[] = [`Class average ${avgPct}%`];
  parts.push(`${analytics.attemptedCount - Math.round(analytics.attemptedCount * analytics.passPercentage / 100)} below passing`);
  if (weakTopics.length > 0) {
    parts.push(`${weakTopics.map(t => t.topic).slice(0, 2).join(' & ')} need attention`);
  }

  return {
    averagePercentage: avgPct,
    passedCount: Math.round(analytics.attemptedCount * analytics.passPercentage / 100),
    totalAttempted: analytics.attemptedCount,
    atRiskCount,
    weakTopicCount: weakTopics.length,
    topStudent,
    verdictText: parts.join('. ') + '.',
  };
}

// Generate mock student results
const generateStudentResults = (count: number, maxScore: number): StudentResult[] => {
  const results: StudentResult[] = [];
  const names = [
    "Aarav Sharma", "Priya Patel", "Rohan Kumar", "Sneha Singh", "Arjun Reddy",
    "Ananya Gupta", "Vikram Joshi", "Ishita Verma", "Karan Malhotra", "Meera Nair",
    "Aditya Rao", "Kavya Iyer", "Nikhil Tiwari", "Pooja Mehta", "Siddharth Kapoor",
    "Tanvi Desai", "Rahul Chauhan", "Shreya Agarwal", "Dev Saxena", "Riya Mishra",
    "Aryan Bhatt", "Diya Chandra", "Varun Sinha", "Nisha Prakash", "Yash Goel",
  ];

  for (let i = 0; i < count; i++) {
    const score = Math.floor(Math.random() * (maxScore * 0.6)) + Math.floor(maxScore * 0.3);
    const timeTaken = Math.floor(Math.random() * 30) + 30;
    
    results.push({
      id: `result-${i + 1}`,
      studentId: `student-${i + 1}`,
      studentName: names[i % names.length],
      rollNumber: `2024${String(i + 1).padStart(3, '0')}`,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      rank: 0,
      timeTaken,
      submittedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      questionWiseResults: [],
    });
  }

  // Sort by score and assign ranks
  results.sort((a, b) => b.score - a.score);
  results.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return results;
};

// Generate question analysis for dynamic exams
const generateQuestionAnalysis = (totalStudents: number): QuestionAnalysis[] => {
  const topics = [
    { topic: "Kinematics", subject: "Physics" },
    { topic: "Newton's Laws", subject: "Physics" },
    { topic: "Work & Energy", subject: "Physics" },
    { topic: "Rotational Motion", subject: "Physics" },
    { topic: "Gravitation", subject: "Physics" },
    { topic: "Fluid Mechanics", subject: "Physics" },
    { topic: "Thermodynamics", subject: "Physics" },
    { topic: "Waves", subject: "Physics" },
  ];

  return topics.slice(0, Math.min(10, topics.length)).map((t, i) => {
    const successRate = Math.floor(Math.random() * 70) + 15;
    const correct = Math.round(totalStudents * successRate / 100);
    const unattempted = Math.floor(Math.random() * 4);
    const incorrect = totalStudents - correct - unattempted;
    return {
      questionId: `q${i + 1}`,
      questionNumber: i + 1,
      subject: t.subject,
      topic: t.topic,
      correctAttempts: correct,
      incorrectAttempts: Math.max(0, incorrect),
      unattempted,
      averageTime: Math.floor(Math.random() * 80) + 30,
      successRate,
      difficulty: successRate > 65 ? 'easy' as const : successRate > 40 ? 'medium' as const : 'hard' as const,
    };
  });
};

// Mock exam analytics data
export const examAnalyticsData: Record<string, ExamAnalytics> = {
  "exam-3": {
    examId: "exam-3",
    examName: "Optics Chapter Quiz",
    totalStudents: 25,
    attemptedCount: 24,
    averageScore: 28,
    highestScore: 38,
    lowestScore: 16,
    averageTime: 12,
    passPercentage: 72,
    scoreDistribution: [
      { range: "0-10", count: 1, percentage: 4 },
      { range: "11-20", count: 3, percentage: 12 },
      { range: "21-30", count: 10, percentage: 40 },
      { range: "31-40", count: 10, percentage: 40 },
    ],
    questionAnalysis: [
      { questionId: "q1", questionNumber: 1, subject: "Physics", topic: "Reflection", correctAttempts: 20, incorrectAttempts: 4, unattempted: 1, averageTime: 45, successRate: 80, difficulty: 'easy' },
      { questionId: "q2", questionNumber: 2, subject: "Physics", topic: "Refraction", correctAttempts: 18, incorrectAttempts: 5, unattempted: 2, averageTime: 60, successRate: 72, difficulty: 'easy' },
      { questionId: "q3", questionNumber: 3, subject: "Physics", topic: "Lenses", correctAttempts: 15, incorrectAttempts: 8, unattempted: 2, averageTime: 75, successRate: 60, difficulty: 'medium' },
      { questionId: "q4", questionNumber: 4, subject: "Physics", topic: "Mirrors", correctAttempts: 12, incorrectAttempts: 10, unattempted: 3, averageTime: 90, successRate: 48, difficulty: 'medium' },
      { questionId: "q5", questionNumber: 5, subject: "Physics", topic: "Optical Instruments", correctAttempts: 8, incorrectAttempts: 12, unattempted: 5, averageTime: 100, successRate: 32, difficulty: 'hard' },
      { questionId: "q6", questionNumber: 6, subject: "Physics", topic: "Wave Optics", correctAttempts: 14, incorrectAttempts: 8, unattempted: 3, averageTime: 80, successRate: 56, difficulty: 'medium' },
      { questionId: "q7", questionNumber: 7, subject: "Physics", topic: "Interference", correctAttempts: 6, incorrectAttempts: 14, unattempted: 5, averageTime: 110, successRate: 24, difficulty: 'hard' },
      { questionId: "q8", questionNumber: 8, subject: "Physics", topic: "Diffraction", correctAttempts: 10, incorrectAttempts: 11, unattempted: 4, averageTime: 95, successRate: 40, difficulty: 'hard' },
      { questionId: "q9", questionNumber: 9, subject: "Physics", topic: "Polarization", correctAttempts: 16, incorrectAttempts: 6, unattempted: 3, averageTime: 65, successRate: 64, difficulty: 'medium' },
      { questionId: "q10", questionNumber: 10, subject: "Physics", topic: "TIR", correctAttempts: 19, incorrectAttempts: 4, unattempted: 2, averageTime: 50, successRate: 76, difficulty: 'easy' },
    ],
    batchComparison: [
      { batchId: "batch-10a", batchName: "Class 10-A", averageScore: 28, highestScore: 38, lowestScore: 16, passPercentage: 72, attemptedCount: 24, totalStudents: 25 },
    ],
    topPerformers: generateStudentResults(10, 40).slice(0, 5),
    allStudents: generateStudentResults(25, 40),
  },
};

// Helper function to get exam analytics
export const getExamAnalytics = (examId: string): ExamAnalytics | null => {
  return examAnalyticsData[examId] || null;
};

// Generate analytics for any exam (for demo purposes)
export const generateExamAnalytics = (examId: string, examName: string, totalMarks: number): ExamAnalytics => {
  const totalStudents = Math.floor(Math.random() * 20) + 20;
  const attemptedCount = totalStudents - Math.floor(Math.random() * 3);
  const allStudents = generateStudentResults(attemptedCount, totalMarks);
  
  const scores = allStudents.map(r => r.score);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  const passingScore = totalMarks * 0.4;
  const passCount = allStudents.filter(r => r.score >= passingScore).length;

  // Generate score distribution
  const ranges = [
    { min: 0, max: totalMarks * 0.25 },
    { min: totalMarks * 0.25, max: totalMarks * 0.5 },
    { min: totalMarks * 0.5, max: totalMarks * 0.75 },
    { min: totalMarks * 0.75, max: totalMarks },
  ];

  const scoreDistribution = ranges.map((range) => {
    const count = allStudents.filter(r => r.score >= range.min && r.score < range.max).length;
    return {
      range: `${Math.round(range.min)}-${Math.round(range.max)}`,
      count,
      percentage: Math.round((count / attemptedCount) * 100),
    };
  });

  return {
    examId,
    examName,
    totalStudents,
    attemptedCount,
    averageScore,
    highestScore,
    lowestScore,
    averageTime: Math.floor(Math.random() * 30) + 30,
    passPercentage: Math.round((passCount / attemptedCount) * 100),
    scoreDistribution,
    questionAnalysis: generateQuestionAnalysis(attemptedCount),
    batchComparison: [],
    topPerformers: allStudents.slice(0, 5),
    allStudents,
  };
};
