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

export type CognitiveType = 'Logical' | 'Analytical' | 'Conceptual' | 'Numerical' | 'Application' | 'Memory';

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
  questionText: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  cognitiveType: CognitiveType;
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

// ── Seeded PRNG (Park-Miller LCG + djb2 hash) ──
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
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
    status: q.successRate >= 75 ? 'strong' : q.successRate >= 50 ? 'moderate' : 'weak',
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
const generateStudentResults = (count: number, maxScore: number, rand: () => number, batchId?: string, namePool?: string[]): StudentResult[] => {
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
    const score = Math.floor(rand() * (maxScore * 0.6)) + Math.floor(maxScore * 0.3);
    const timeTaken = Math.floor(rand() * 30) + 30;
    
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
      submittedAt: new Date(Date.now() - rand() * 86400000).toISOString(),
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

const cognitiveTypes: CognitiveType[] = ['Logical', 'Analytical', 'Conceptual', 'Numerical', 'Application', 'Memory'];

const fallbackQuestionTexts: string[] = [
  "A body of mass 5 kg is moving with a velocity of 20 m/s. A force of 100 N is applied on it for 2 seconds in the direction of motion. The final velocity of the body is:",
  "A particle moves from position r₁ = 3î + 2ĵ - 6k̂ to position r₂ = 14î + 13ĵ + 9k̂ under the action of a force F = 4î + ĵ + 3k̂ N. The work done by this force is:",
  "The moment of inertia of a uniform circular disc of radius R and mass M about an axis touching the disc at its diameter and normal to the disc is:",
  "The escape velocity of a body from the surface of earth is 11.2 km/s. If a body is projected with a velocity twice the escape velocity, its velocity at infinity will be:",
  "An ideal gas undergoes a cyclic process ABCDA as shown. The work done by the gas in the cycle is:",
  "A string of length L, fixed at both ends, vibrates in its fundamental mode. The wavelength of the wave in the string is:",
  "Two point charges +q and -q are placed at a distance d apart. The electric field at a point midway between them is:",
  "A wire of resistance R is cut into n equal parts. These parts are then connected in parallel. The equivalent resistance of the combination is:",
  "A charged particle moves in a uniform magnetic field. The particle will describe a circular path if:",
  "A coil of area A and N turns is placed perpendicular to a magnetic field B. If the field changes from B to 0 in time t, the average EMF induced is:",
  "A ray of light passes from a denser medium to a rarer medium. The critical angle for total internal reflection is 45°. The refractive index of the denser medium is:",
  "The threshold wavelength for photoelectric effect from a metal surface is 5000 Å. The work function of the metal is:",
  "A ball is thrown vertically upward with velocity 40 m/s. Taking g = 10 m/s², the time taken to reach maximum height is ______ seconds.",
  "In a p-n junction diode, the depletion region is formed due to:",
  "A parallel plate capacitor has capacitance C. If the distance between plates is doubled and a dielectric of constant K=4 is inserted, the new capacitance is:",
  "A projectile is thrown with speed u at angle θ to the horizontal. Its range on the horizontal plane is R. For the same speed and maximum height, the projectile should be thrown at angle:",
  "Water flows through a horizontal pipe of varying cross-section. The pressure is 30000 Pa where velocity is 2 m/s. What is the pressure where velocity is 4 m/s?",
  "A particle executes SHM with amplitude A. At what displacement from mean position is the kinetic energy equal to potential energy?",
  "In amplitude modulation, the modulation index is 0.5. The ratio of the sideband power to the carrier power is:",
  "In a series LCR circuit at resonance, the voltage across inductance is 100 V and across capacitance is 100 V. The voltage across resistance is 20 V. The applied voltage is:",
];

const fallbackOptions = [
  [{ id: "a", text: "40 m/s", isCorrect: false }, { id: "b", text: "60 m/s", isCorrect: true }, { id: "c", text: "80 m/s", isCorrect: false }, { id: "d", text: "100 m/s", isCorrect: false }],
  [{ id: "a", text: "100 J", isCorrect: true }, { id: "b", text: "50 J", isCorrect: false }, { id: "c", text: "200 J", isCorrect: false }, { id: "d", text: "75 J", isCorrect: false }],
  [{ id: "a", text: "MR²/2", isCorrect: false }, { id: "b", text: "MR²", isCorrect: false }, { id: "c", text: "3MR²/2", isCorrect: true }, { id: "d", text: "2MR²", isCorrect: false }],
  [{ id: "a", text: "11.2 km/s", isCorrect: false }, { id: "b", text: "11.2√3 km/s", isCorrect: true }, { id: "c", text: "22.4 km/s", isCorrect: false }, { id: "d", text: "0", isCorrect: false }],
];

// Generate question analysis
const generateQuestionAnalysis = (totalStudents: number, rand: () => number, topics?: { topic: string; subject: string }[]): QuestionAnalysis[] => {
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
    const successRate = Math.floor(rand() * 70) + 15;
    const correct = Math.round(totalStudents * successRate / 100);
    const unattempted = Math.floor(rand() * 4);
    const incorrect = totalStudents - correct - unattempted;
    return {
      questionId: `q${i + 1}`,
      questionNumber: i + 1,
      subject: t.subject,
      topic: t.topic,
      correctAttempts: correct,
      incorrectAttempts: Math.max(0, incorrect),
      unattempted,
      averageTime: Math.floor(rand() * 80) + 30,
      successRate,
      difficulty: successRate > 65 ? 'easy' as const : successRate > 40 ? 'medium' as const : 'hard' as const,
      questionText: fallbackQuestionTexts[i % fallbackQuestionTexts.length],
      options: fallbackOptions[i % fallbackOptions.length],
      cognitiveType: cognitiveTypes[i % cognitiveTypes.length],
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
    averageTime: 45, // deterministic default
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
const rand_e3_10a = seededRandom(hashString("exam-3-batch-10a"));
const exam3_batch10a_students = generateStudentResults(25, 40, rand_e3_10a, "batch-10a");
const exam3_batch10a_questions = generateQuestionAnalysis(25, rand_e3_10a, opticsTopics);

const rand_e3_10b = seededRandom(hashString("exam-3-batch-10b"));
const exam3_batch10b_students = generateStudentResults(22, 40, rand_e3_10b, "batch-10b", batchBNames);
const exam3_batch10b_questions = generateQuestionAnalysis(22, rand_e3_10b, opticsTopics);

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
const rand_e7_10a = seededRandom(hashString("exam-7-batch-10a"));
const exam7_batch10a_students = generateStudentResults(25, 80, rand_e7_10a, "batch-10a");

const rand_e7_10b = seededRandom(hashString("exam-7-batch-10b"));
const exam7_batch10b_students = generateStudentResults(22, 80, rand_e7_10b, "batch-10b", batchBNames);

const rand_e7_11a = seededRandom(hashString("exam-7-batch-11a"));
const exam7_batch11a_students = generateStudentResults(28, 80, rand_e7_11a, "batch-11a", batch11ANames);

// Store batch-level analytics keyed by "examId-batchId"
export const batchExamAnalyticsData: Record<string, ExamAnalytics> = {
  "exam-3-batch-10a": buildAnalyticsFromStudents("exam-3", "Optics Chapter Quiz", exam3_batch10a_students, exam3_batch10a_questions, 40),
  "exam-3-batch-10b": buildAnalyticsFromStudents("exam-3", "Optics Chapter Quiz", exam3_batch10b_students, exam3_batch10b_questions, 40),
  "exam-7-batch-10a": buildAnalyticsFromStudents("exam-7", "Waves & Sound Test", exam7_batch10a_students, generateQuestionAnalysis(25, rand_e7_10a, wavesTopics), 80),
  "exam-7-batch-10b": buildAnalyticsFromStudents("exam-7", "Waves & Sound Test", exam7_batch10b_students, generateQuestionAnalysis(22, rand_e7_10b, wavesTopics), 80),
  "exam-7-batch-11a": buildAnalyticsFromStudents("exam-7", "Waves & Sound Test", exam7_batch11a_students, generateQuestionAnalysis(28, rand_e7_11a, wavesTopics), 80),
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

// ── Actionable Insight Types ──

export interface ActionableInsight {
  id: string;
  type: 'reteach' | 'practice' | 'celebrate' | 'attention';
  severity: 'critical' | 'warning' | 'positive';
  finding: string;
  detail: string;
  affectedStudents: { id: string; name: string; score: number }[];
  suggestedAction: string;
  actionType: 'homework' | 'practice' | 'none';
  actionPayload: {
    topic?: string;
    difficulty?: string;
    studentIds?: string[];
  };
}

/**
 * Generate mock actionable insights from existing analytics data.
 * In production, this would be replaced by an AI edge function call.
 * See docs/03-teacher/reports-exams.md for prompt specification.
 */
export function generateMockActionableInsights(
  analytics: ExamAnalytics,
  bands: PerformanceBand[],
  topicFlags: TopicFlag[]
): ActionableInsight[] {
  const insights: ActionableInsight[] = [];

  // 1. Reteach insight — weakest topic
  const weakTopics = topicFlags.filter(t => t.status === 'weak').sort((a, b) => a.successRate - b.successRate);
  if (weakTopics.length > 0) {
    const weakest = weakTopics[0];
    const riskStudents = bands.find(b => b.key === 'risk')?.students ?? [];
    const reinforcementStudents = bands.find(b => b.key === 'reinforcement')?.students ?? [];
    const affectedStudents = [...riskStudents, ...reinforcementStudents].slice(0, 8);

    insights.push({
      id: 'insight-reteach-1',
      type: 'reteach',
      severity: 'critical',
      finding: `${affectedStudents.length} students scored below 35% on ${weakest.topic}`,
      detail: `Average accuracy was ${weakest.successRate}%. Most errors were conceptual — students struggled with application-level problems.`,
      affectedStudents: affectedStudents.map(s => ({ id: s.studentId, name: s.studentName, score: s.percentage })),
      suggestedAction: 'Generate targeted homework',
      actionType: 'homework',
      actionPayload: {
        topic: weakest.topic,
        difficulty: 'easy',
        studentIds: affectedStudents.map(s => s.studentId),
      },
    });
  }

  // 2. Practice insight — second weakest topic or reinforcement band
  if (weakTopics.length > 1) {
    const secondWeak = weakTopics[1];
    const reinforcementStudents = bands.find(b => b.key === 'reinforcement')?.students ?? [];

    insights.push({
      id: 'insight-practice-1',
      type: 'practice',
      severity: 'warning',
      finding: `${secondWeak.topic} needs reinforcement — ${secondWeak.successRate}% success`,
      detail: `${reinforcementStudents.length} students in the reinforcement band need additional practice on this topic.`,
      affectedStudents: reinforcementStudents.slice(0, 6).map(s => ({ id: s.studentId, name: s.studentName, score: s.percentage })),
      suggestedAction: 'Assign practice questions',
      actionType: 'practice',
      actionPayload: {
        topic: secondWeak.topic,
        difficulty: 'medium',
        studentIds: reinforcementStudents.map(s => s.studentId),
      },
    });
  }

  // 3. Celebrate insight — strongest topic
  const strongTopics = topicFlags.filter(t => t.status === 'strong').sort((a, b) => b.successRate - a.successRate);
  if (strongTopics.length > 0) {
    const strongest = strongTopics[0];
    const masteryStudents = bands.find(b => b.key === 'mastery')?.students ?? [];

    insights.push({
      id: 'insight-celebrate-1',
      type: 'celebrate',
      severity: 'positive',
      finding: `${strongest.topic} — ${strongest.successRate}% class success rate`,
      detail: `${masteryStudents.length} students achieved mastery. This topic was well understood across the class.`,
      affectedStudents: masteryStudents.slice(0, 5).map(s => ({ id: s.studentId, name: s.studentName, score: s.percentage })),
      suggestedAction: '',
      actionType: 'none',
      actionPayload: {},
    });
  }

  // 4. Attention insight — at-risk student count
  const riskBand = bands.find(b => b.key === 'risk');
  if (riskBand && riskBand.count > 0) {
    insights.push({
      id: 'insight-attention-1',
      type: 'attention',
      severity: riskBand.count >= 5 ? 'critical' : 'warning',
      finding: `${riskBand.count} students in foundational risk band`,
      detail: `These students scored below 35% overall. They may need individual attention and simplified revision material.`,
      affectedStudents: riskBand.students.slice(0, 8).map(s => ({ id: s.studentId, name: s.studentName, score: s.percentage })),
      suggestedAction: 'Generate remedial homework',
      actionType: 'homework',
      actionPayload: {
        difficulty: 'easy',
        studentIds: riskBand.students.map(s => s.studentId),
      },
    });
  }

  return insights;
}

// Module-level cache for on-demand generated analytics
const analyticsCache = new Map<string, ExamAnalytics>();

// Generate analytics for any exam (for demo purposes)
export const generateExamAnalytics = (examId: string, examName: string, totalMarks: number): ExamAnalytics => {
  const cacheKey = `gen-${examId}`;
  if (analyticsCache.has(cacheKey)) return analyticsCache.get(cacheKey)!;
  const rand = seededRandom(hashString(examId + "-analytics"));
  const totalStudents = Math.floor(rand() * 20) + 20;
  const allStudents = generateStudentResults(totalStudents, totalMarks, rand);
  const result = buildAnalyticsFromStudents(examId, examName, allStudents, generateQuestionAnalysis(totalStudents, rand), totalMarks);
  analyticsCache.set(cacheKey, result);
  return result;
};

// Generate analytics for a specific batch (for demo — on-demand)
export const generateExamAnalyticsForBatch = (examId: string, examName: string, totalMarks: number, batchId: string): ExamAnalytics => {
  const cacheKey = `gen-${examId}-${batchId}`;
  if (analyticsCache.has(cacheKey)) return analyticsCache.get(cacheKey)!;
  const rand = seededRandom(hashString(`${examId}-${batchId}-analytics`));
  const totalStudents = Math.floor(rand() * 15) + 18;
  const namePool = batchId === "batch-10b" ? batchBNames : batchId === "batch-11a" ? batch11ANames : undefined;
  const allStudents = generateStudentResults(totalStudents, totalMarks, rand, batchId, namePool);
  const result = buildAnalyticsFromStudents(examId, examName, allStudents, generateQuestionAnalysis(totalStudents, rand), totalMarks);
  analyticsCache.set(cacheKey, result);
  return result;
};
