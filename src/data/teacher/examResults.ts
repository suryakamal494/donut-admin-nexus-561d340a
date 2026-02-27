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
  batchId?: string;
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

// ── Batch info map ──
export const batchInfoMap: Record<string, { name: string; className: string }> = {
  "batch-10a": { name: "10A", className: "Class 10" },
  "batch-10b": { name: "10B", className: "Class 10" },
  "batch-11a": { name: "11A", className: "Class 11" },
};

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

// Generate mock student results for a specific batch
const generateStudentResults = (count: number, maxScore: number, batchId?: string, namePool?: string[]): StudentResult[] => {
  const results: StudentResult[] = [];
  const defaultNames = [
    "Aarav Sharma", "Priya Patel", "Rohan Kumar", "Sneha Singh", "Arjun Reddy",
    "Ananya Gupta", "Vikram Joshi", "Ishita Verma", "Karan Malhotra", "Meera Nair",
    "Aditya Rao", "Kavya Iyer", "Nikhil Tiwari", "Pooja Mehta", "Siddharth Kapoor",
    "Tanvi Desai", "Rahul Chauhan", "Shreya Agarwal", "Dev Saxena", "Riya Mishra",
    "Aryan Bhatt", "Diya Chandra", "Varun Sinha", "Nisha Prakash", "Yash Goel",
  ];
  const names = namePool || defaultNames;

  for (let i = 0; i < count; i++) {
    const score = Math.floor(Math.random() * (maxScore * 0.6)) + Math.floor(maxScore * 0.3);
    const timeTaken = Math.floor(Math.random() * 30) + 30;
    
    results.push({
      id: `result-${batchId || 'default'}-${i + 1}`,
      studentId: `student-${batchId || 'default'}-${i + 1}`,
      studentName: names[i % names.length],
      rollNumber: `2024${String(i + 1).padStart(3, '0')}`,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      rank: 0,
      timeTaken,
      submittedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      batchId,
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

// Separate name pools per batch for realistic data
const batchBNames = [
  "Manish Yadav", "Sakshi Pandey", "Rajesh Nair", "Komal Thakur", "Deepak Jain",
  "Sonal Mehra", "Gaurav Bhat", "Neha Kulkarni", "Tushar Soni", "Pallavi Saxena",
  "Mayank Dubey", "Richa Tiwari", "Ajay Pillai", "Swati Bansal", "Hemant Rawat",
  "Divya Chouhan", "Suresh Goyal", "Jyoti Arora", "Pankaj Rana", "Kritika Shah",
  "Mohit Khandelwal", "Anusha Reddy", "Tarun Agarwal", "Geeta Bhardwaj", "Vishal Parmar",
];

const batch11ANames = [
  "Aakash Tripathi", "Bhavna Chawla", "Chirag Oberoi", "Deepika Sethi", "Eshan Malhotra",
  "Falguni Deshmukh", "Girish Bose", "Harini Menon", "Iqbal Siddiqui", "Jhanvi Kapoor",
  "Kunal Grover", "Lavanya Rajan", "Mihir Dalal", "Namita Hegde", "Omkar Pawar",
  "Parinita Luthra", "Qasim Khan", "Ritika Choudhary", "Samar Walia", "Tanya Kaushal",
  "Uday Mathur", "Vani Krishnan", "Wasim Ahmed", "Xena Fernandes", "Yogesh Shetty",
];

// Generate question analysis
const generateQuestionAnalysis = (totalStudents: number, topics?: { topic: string; subject: string }[]): QuestionAnalysis[] => {
  const defaultTopics = [
    { topic: "Kinematics", subject: "Physics" },
    { topic: "Newton's Laws", subject: "Physics" },
    { topic: "Work & Energy", subject: "Physics" },
    { topic: "Rotational Motion", subject: "Physics" },
    { topic: "Gravitation", subject: "Physics" },
    { topic: "Fluid Mechanics", subject: "Physics" },
    { topic: "Thermodynamics", subject: "Physics" },
    { topic: "Waves", subject: "Physics" },
  ];

  const topicList = topics || defaultTopics;
  return topicList.slice(0, Math.min(10, topicList.length)).map((t, i) => {
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

// Build analytics for a specific batch subset of students
function buildAnalyticsFromStudents(
  examId: string,
  examName: string,
  students: StudentResult[],
  questionAnalysis: QuestionAnalysis[],
  maxScore: number,
  batchComparison: BatchStats[] = []
): ExamAnalytics {
  const scores = students.map(r => r.score);
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  const passingScore = maxScore * 0.4;
  const passCount = students.filter(r => r.score >= passingScore).length;
  const attemptedCount = students.length;

  const ranges = [
    { min: 0, max: maxScore * 0.25 },
    { min: maxScore * 0.25, max: maxScore * 0.5 },
    { min: maxScore * 0.5, max: maxScore * 0.75 },
    { min: maxScore * 0.75, max: maxScore },
  ];

  const scoreDistribution = ranges.map((range) => {
    const count = students.filter(r => r.score >= range.min && r.score < range.max).length;
    return {
      range: `${Math.round(range.min)}-${Math.round(range.max)}`,
      count,
      percentage: attemptedCount > 0 ? Math.round((count / attemptedCount) * 100) : 0,
    };
  });

  return {
    examId,
    examName,
    totalStudents: students.length,
    attemptedCount,
    averageScore,
    highestScore,
    lowestScore,
    averageTime: Math.floor(Math.random() * 30) + 30,
    passPercentage: attemptedCount > 0 ? Math.round((passCount / attemptedCount) * 100) : 0,
    scoreDistribution,
    questionAnalysis,
    batchComparison,
    topPerformers: [...students].sort((a, b) => b.score - a.score).slice(0, 5),
    allStudents: students,
  };
}

// ── Pre-generated batch-wise data ──

const opticsTopics = [
  { topic: "Reflection", subject: "Physics" },
  { topic: "Refraction", subject: "Physics" },
  { topic: "Lenses", subject: "Physics" },
  { topic: "Mirrors", subject: "Physics" },
  { topic: "Optical Instruments", subject: "Physics" },
  { topic: "Wave Optics", subject: "Physics" },
  { topic: "Interference", subject: "Physics" },
  { topic: "Diffraction", subject: "Physics" },
  { topic: "Polarization", subject: "Physics" },
  { topic: "TIR", subject: "Physics" },
];

// exam-3 multi-batch data
const exam3_batch10a_students = generateStudentResults(25, 40, "batch-10a");
const exam3_batch10b_students = generateStudentResults(22, 40, "batch-10b", batchBNames);
const exam3_batch10a_questions = generateQuestionAnalysis(25, opticsTopics);
const exam3_batch10b_questions = generateQuestionAnalysis(22, opticsTopics);

// exam-7 tri-batch data
const wavesTopics = [
  { topic: "Wave Motion", subject: "Physics" },
  { topic: "Sound Waves", subject: "Physics" },
  { topic: "Doppler Effect", subject: "Physics" },
  { topic: "Superposition", subject: "Physics" },
  { topic: "Standing Waves", subject: "Physics" },
  { topic: "Resonance", subject: "Physics" },
  { topic: "Beats", subject: "Physics" },
  { topic: "Intensity", subject: "Physics" },
];
const exam7_batch10a_students = generateStudentResults(25, 80, "batch-10a");
const exam7_batch10b_students = generateStudentResults(22, 80, "batch-10b", batchBNames);
const exam7_batch11a_students = generateStudentResults(28, 80, "batch-11a", batch11ANames);

// Store batch-level analytics keyed by "examId-batchId"
export const batchExamAnalyticsData: Record<string, ExamAnalytics> = {
  "exam-3-batch-10a": buildAnalyticsFromStudents("exam-3", "Optics Chapter Quiz", exam3_batch10a_students, exam3_batch10a_questions, 40),
  "exam-3-batch-10b": buildAnalyticsFromStudents("exam-3", "Optics Chapter Quiz", exam3_batch10b_students, exam3_batch10b_questions, 40),
  "exam-7-batch-10a": buildAnalyticsFromStudents("exam-7", "Waves & Sound Test", exam7_batch10a_students, generateQuestionAnalysis(25, wavesTopics), 80),
  "exam-7-batch-10b": buildAnalyticsFromStudents("exam-7", "Waves & Sound Test", exam7_batch10b_students, generateQuestionAnalysis(22, wavesTopics), 80),
  "exam-7-batch-11a": buildAnalyticsFromStudents("exam-7", "Waves & Sound Test", exam7_batch11a_students, generateQuestionAnalysis(28, wavesTopics), 80),
};

// Legacy combined analytics (kept for backwards compat)
export const examAnalyticsData: Record<string, ExamAnalytics> = {
  "exam-3": batchExamAnalyticsData["exam-3-batch-10a"], // default to first batch
};

// Helper function to get exam analytics for a specific batch
export const getExamAnalyticsForBatch = (examId: string, batchId: string): ExamAnalytics | null => {
  const key = `${examId}-${batchId}`;
  return batchExamAnalyticsData[key] || null;
};

// Helper function to get exam analytics (legacy — returns first batch or generated)
export const getExamAnalytics = (examId: string): ExamAnalytics | null => {
  return examAnalyticsData[examId] || null;
};

// Generate analytics for any exam (for demo purposes)
export const generateExamAnalytics = (examId: string, examName: string, totalMarks: number): ExamAnalytics => {
  const totalStudents = Math.floor(Math.random() * 20) + 20;
  const allStudents = generateStudentResults(totalStudents, totalMarks);
  return buildAnalyticsFromStudents(examId, examName, allStudents, generateQuestionAnalysis(totalStudents), totalMarks);
};

// Generate analytics for a specific batch (for demo — on-demand)
export const generateExamAnalyticsForBatch = (examId: string, examName: string, totalMarks: number, batchId: string): ExamAnalytics => {
  const totalStudents = Math.floor(Math.random() * 15) + 18;
  const namePool = batchId === "batch-10b" ? batchBNames : batchId === "batch-11a" ? batch11ANames : undefined;
  const allStudents = generateStudentResults(totalStudents, totalMarks, batchId, namePool);
  return buildAnalyticsFromStudents(examId, examName, allStudents, generateQuestionAnalysis(totalStudents), totalMarks);
};
