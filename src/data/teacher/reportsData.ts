// Reports Module — Mock Data
// Provides batch-level summaries, chapter analytics, and exam history

import { batchInfoMap } from "./examResults";
import { teacherExams } from "./exams";
import { mockGrandTests } from "@/data/examsData";
import { computeStudentPI, type ExamHistoryEntry, type SecondaryTag, type Trend } from "@/lib/performanceIndex";

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

// ── Types ──

export interface BatchReportCard {
  batchId: string;
  batchName: string;
  className: string;
  totalExamsConducted: number;
  classAverage: number;
  previousAverage: number; // for trend
  trend: "up" | "down" | "stable";
  totalStudents: number;
  atRiskCount: number;
}

export interface ChapterReportCard {
  chapterId: string;
  chapterName: string;
  subject: string;
  examsCovering: number; // how many exams tested this chapter
  avgSuccessRate: number;
  topicCount: number;
  weakTopicCount: number;
  status: "strong" | "moderate" | "weak";
}

export interface BatchExamEntry {
  examId: string;
  examName: string;
  date: string;
  totalMarks: number;
  classAverage: number;
  highestScore: number;
  totalStudents: number;
  passPercentage: number;
}

export interface ChapterTopicAnalysis {
  topicId: string;
  topicName: string;
  questionsAsked: number;
  avgSuccessRate: number;
  status: "strong" | "moderate" | "weak";
  examsAppeared: number;
}

export interface ChapterStudentEntry {
  id: string;
  studentName: string;
  rollNumber: string;
  avgPercentage: number;
  examsAttempted: number;
  performanceIndex: number;
  consistency: number;
  timeEfficiency: number;
  attemptRate: number;
  trend: Trend;
  secondaryTags: SecondaryTag[];
  examHistory: ExamHistoryEntry[];
}

export interface ChapterStudentBucket {
  key: "mastery" | "stable" | "reinforcement" | "risk";
  label: string;
  count: number;
  students: ChapterStudentEntry[];
}

export interface ChapterDetailReport {
  chapterId: string;
  chapterName: string;
  subject: string;
  batchId: string;
  batchName: string;
  overallSuccessRate: number;
  totalQuestionsAsked: number;
  examsCovering: number;
  topics: ChapterTopicAnalysis[];
  examBreakdown: ChapterExamBreakdown[];
  studentBuckets: ChapterStudentBucket[];
}

export interface ChapterExamBreakdown {
  examId: string;
  examName: string;
  date: string;
  questionsFromChapter: number;
  avgSuccessRate: number;
}

// ── Data Generation ──

const generateBatchReports = (): BatchReportCard[] => {
  const batches = Object.entries(batchInfoMap);
  return batches.map(([batchId, info]) => {
    const rand = seededRandom(hashString(batchId + "-batch-report"));
    const batchExams = teacherExams.filter(
      (e) => e.batchIds.includes(batchId) && e.status === "completed"
    );
    const classAvg = 45 + Math.floor(rand() * 30);
    const prevAvg = classAvg + (rand() > 0.5 ? -5 : 5) * Math.round(rand() * 3);
    return {
      batchId,
      batchName: info.name,
      className: info.className,
      totalExamsConducted: batchExams.length,
      classAverage: classAvg,
      previousAverage: prevAvg,
      trend: classAvg > prevAvg ? "up" : classAvg < prevAvg ? "down" : "stable",
      totalStudents: 20 + Math.floor(rand() * 15),
      atRiskCount: Math.floor(rand() * 6),
    };
  });
};

const physicsChapters = [
  { id: "ch-kinematics", name: "Kinematics", topics: ["Displacement", "Velocity", "Acceleration", "Projectile Motion", "Relative Motion"] },
  { id: "ch-laws-of-motion", name: "Laws of Motion", topics: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Friction", "Circular Motion"] },
  { id: "ch-work-energy", name: "Work, Energy & Power", topics: ["Work", "Kinetic Energy", "Potential Energy", "Conservation of Energy", "Power"] },
  { id: "ch-gravitation", name: "Gravitation", topics: ["Universal Law", "Gravitational Field", "Orbital Velocity", "Escape Velocity", "Satellites"] },
  { id: "ch-optics", name: "Optics", topics: ["Reflection", "Refraction", "Lenses", "Mirrors", "Wave Optics", "Interference", "Diffraction"] },
  { id: "ch-thermodynamics", name: "Thermodynamics", topics: ["Zeroth Law", "First Law", "Second Law", "Entropy", "Heat Engines"] },
  { id: "ch-waves", name: "Waves & Sound", topics: ["Wave Motion", "Sound Waves", "Doppler Effect", "Superposition", "Standing Waves", "Beats"] },
  { id: "ch-electrostatics", name: "Electrostatics", topics: ["Coulomb's Law", "Electric Field", "Electric Potential", "Capacitance", "Gauss's Law"] },
  { id: "ch-current-electricity", name: "Current Electricity", topics: ["Ohm's Law", "Kirchhoff's Laws", "Wheatstone Bridge", "Potentiometer", "EMF"] },
  { id: "ch-magnetism", name: "Magnetism", topics: ["Magnetic Field", "Biot-Savart Law", "Ampere's Law", "Solenoid", "Magnetic Materials"] },
];

const generateChapterReports = (batchId: string): ChapterReportCard[] => {
  const rand = seededRandom(hashString(batchId + "-chapter-reports"));
  return physicsChapters.map((ch) => {
    const avgSuccess = 25 + Math.floor(rand() * 55);
    const weakCount = ch.topics.filter(() => rand() < 0.3).length;
    return {
      chapterId: ch.id,
      chapterName: ch.name,
      subject: "Physics",
      examsCovering: 1 + Math.floor(rand() * 4),
      avgSuccessRate: avgSuccess,
      topicCount: ch.topics.length,
      weakTopicCount: weakCount,
      status: avgSuccess >= 75 ? "strong" : avgSuccess >= 50 ? "moderate" : "weak",
    };
  });
};

const generateBatchExams = (batchId: string): BatchExamEntry[] => {
  const rand = seededRandom(hashString(batchId + "-batch-exams"));
  const batchExams = teacherExams.filter(
    (e) => e.batchIds.includes(batchId) && e.status === "completed"
  );
  return batchExams.map((exam) => ({
    examId: exam.id,
    examName: exam.name,
    date: exam.updatedAt,
    totalMarks: exam.totalMarks,
    classAverage: Math.round(exam.totalMarks * (0.4 + rand() * 0.35)),
    highestScore: Math.round(exam.totalMarks * (0.75 + rand() * 0.2)),
    totalStudents: 20 + Math.floor(rand() * 10),
    passPercentage: 30 + Math.floor(rand() * 60),
  }));
};

const generateChapterDetail = (chapterId: string, batchId: string): ChapterDetailReport => {
  const chapter = physicsChapters.find((c) => c.id === chapterId)!;
  const batchInfo = batchInfoMap[batchId];
  const rand = seededRandom(hashString(chapterId + "-" + batchId + "-detail"));

  const topics: ChapterTopicAnalysis[] = chapter.topics.map((t, i) => {
    const sr = 20 + Math.floor(rand() * 65);
    return {
      topicId: `${chapterId}-t${i}`,
      topicName: t,
      questionsAsked: 2 + Math.floor(rand() * 8),
      avgSuccessRate: sr,
      status: sr >= 65 ? "strong" : sr >= 40 ? "moderate" : "weak",
      examsAppeared: 1 + Math.floor(rand() * 3),
    };
  });

  const batchExams = teacherExams.filter(
    (e) => e.batchIds.includes(batchId) && e.status === "completed"
  );
  const examBreakdown: ChapterExamBreakdown[] = batchExams.map((exam) => ({
    examId: exam.id,
    examName: exam.name,
    date: exam.updatedAt,
    questionsFromChapter: 2 + Math.floor(rand() * 5),
    avgSuccessRate: 30 + Math.floor(rand() * 50),
  }));

  const overallSuccess = Math.round(topics.reduce((s, t) => s + t.avgSuccessRate, 0) / topics.length);

  // Generate student buckets (mock aggregated data)
  const studentNames = [
    "Aarav Sharma", "Priya Patel", "Rohan Gupta", "Ananya Singh", "Vikram Reddy",
    "Sneha Iyer", "Arjun Nair", "Kavya Menon", "Rahul Das", "Meera Joshi",
    "Siddharth Kumar", "Divya Rao", "Aditya Verma", "Ishita Banerjee", "Karthik Subramaniam",
    "Neha Agarwal", "Varun Mishra", "Riya Chauhan", "Harsh Pandey", "Pooja Deshmukh",
    "Amit Tiwari", "Simran Kaur", "Nikhil Saxena", "Tanvi Kulkarni", "Deepak Yadav",
  ];

  const allStudents: ChapterStudentEntry[] = studentNames.slice(0, 20 + Math.floor(rand() * 5)).map((name, i) => {
    const numExams = 1 + Math.floor(rand() * examBreakdown.length + 1);
    
    // Generate mock exam history
    const examHistory: ExamHistoryEntry[] = Array.from({ length: numExams }, (_, j) => ({
      examId: examBreakdown[j % examBreakdown.length]?.examId || `mock-exam-${j}`,
      percentage: Math.round(10 + rand() * 85),
      date: examBreakdown[j % examBreakdown.length]?.date || `2025-0${j + 1}-15`,
      timeEfficiency: Math.round(25 + rand() * 70),
      attemptRate: Math.round(40 + rand() * 60),
    }));

    const piResult = computeStudentPI(examHistory);
    const avgPercentage = piResult.accuracy;

    return {
      id: `${chapterId}-s${i}`,
      studentName: name,
      rollNumber: `R${String(101 + i)}`,
      avgPercentage,
      examsAttempted: numExams,
      performanceIndex: piResult.performanceIndex,
      consistency: piResult.consistency,
      timeEfficiency: piResult.timeEfficiency,
      attemptRate: piResult.attemptRate,
      trend: piResult.trend,
      secondaryTags: piResult.secondaryTags,
      examHistory: piResult.examHistory,
    };
  });

  // Bucket by Performance Index instead of raw percentage
  const mastery = allStudents.filter(s => s.performanceIndex >= 75);
  const stable = allStudents.filter(s => s.performanceIndex >= 50 && s.performanceIndex < 75);
  const reinforcement = allStudents.filter(s => s.performanceIndex >= 35 && s.performanceIndex < 50);
  const risk = allStudents.filter(s => s.performanceIndex < 35);

  const studentBuckets: ChapterStudentBucket[] = [
    { key: "mastery", label: "Mastery Ready", count: mastery.length, students: mastery },
    { key: "stable", label: "Stable Progress", count: stable.length, students: stable },
    { key: "reinforcement", label: "Reinforcement Needed", count: reinforcement.length, students: reinforcement },
    { key: "risk", label: "Foundational Risk", count: risk.length, students: risk },
  ];

  return {
    chapterId,
    chapterName: chapter.name,
    subject: "Physics",
    batchId,
    batchName: batchInfo?.name || batchId,
    overallSuccessRate: overallSuccess,
    totalQuestionsAsked: topics.reduce((s, t) => s + t.questionsAsked, 0),
    examsCovering: examBreakdown.length,
    topics,
    examBreakdown,
    studentBuckets,
  };
};

// ── Institute Test Types ──

export interface InstituteTestEntry {
  examId: string;
  examName: string;
  date: string;
  pattern: "jee_main" | "jee_advanced" | "neet";
  source: "grand_test";
  totalMarks: number;
  subjectMaxMarks: number;
  subjectAvgScore: number;
  subjectHighest: number;
  passPercentage: number;
  participantCount: number;
}

// ── Institute Test Generator ──

const generateInstituteTests = (_batchId: string, teacherSubject: string): InstituteTestEntry[] => {
  const rand = seededRandom(hashString(_batchId + "-" + teacherSubject + "-inst-tests"));
  const completed = mockGrandTests.filter(
    (gt) => gt.status === "completed" && gt.subjects.includes(teacherSubject)
  );

  return completed.map((gt) => {
    const subjectCount = gt.subjects.length;
    const subjectMax = Math.round(gt.totalMarks / subjectCount);
    const subjectAvg = Math.round(subjectMax * (0.35 + rand() * 0.35));
    const subjectHighest = Math.round(subjectMax * (0.75 + rand() * 0.2));
    return {
      examId: gt.id,
      examName: gt.name,
      date: gt.completedDate || gt.scheduledDate || gt.createdAt,
      pattern: gt.pattern,
      source: "grand_test" as const,
      totalMarks: gt.totalMarks,
      subjectMaxMarks: subjectMax,
      subjectAvgScore: subjectAvg,
      subjectHighest: Math.min(subjectHighest, subjectMax),
      passPercentage: 30 + Math.floor(rand() * 60),
      participantCount: gt.participantCount || 0,
    };
  });
};




// ── Batch Health Summary Types ──

export interface BatchHealthSummary {
  generatedAt: string;
  overallTrend: 'improving' | 'declining' | 'stable';
  recentExamAvg: number;
  priorityTopics: {
    topic: string;
    chapter: string;
    chapterId: string;
    successRate: number;
    trend: 'up' | 'down' | 'flat';
    examCount: number;
  }[];
  studentsToCheckIn: {
    studentId: string;
    studentName: string;
    reason: string;
    avgPercentage: number;
    trend: 'up' | 'down' | 'flat';
  }[];
  suggestedFocus: string;
  atRiskCount: number;
  weakTopicCount: number;
}

/**
 * Generate mock batch health summary from existing batch data.
 * In production, replaced by AI edge function `batch-health-summary`.
 * See docs/03-teacher/reports-overview.md for prompt specification.
 */
export function generateMockBatchHealth(
  chapters: ChapterReportCard[],
  examHistory: BatchExamEntry[],
  studentRoster: { studentName: string; studentId: string; avgPercentage: number; trend: string; piBucket: string; secondaryTags: string[] }[]
): BatchHealthSummary {
  // Priority topics: weak chapters with topics needing attention
  const weakChapters = chapters
    .filter(ch => ch.status === 'weak' || ch.avgSuccessRate < 50)
    .sort((a, b) => a.avgSuccessRate - b.avgSuccessRate)
    .slice(0, 3);

  const priorityTopics = weakChapters.map(ch => ({
    topic: ch.chapterName === "Thermodynamics" ? "Second Law" :
           ch.chapterName === "Waves & Sound" ? "Doppler Effect" :
           ch.chapterName === "Optics" ? "Wave Optics" :
           ch.chapterName === "Gravitation" ? "Escape Velocity" :
           ch.chapterName,
    chapter: ch.chapterName,
    chapterId: ch.chapterId,
    successRate: ch.avgSuccessRate,
    trend: (ch.avgSuccessRate < 35 ? 'down' : 'flat') as 'up' | 'down' | 'flat',
    examCount: ch.examsCovering,
  }));

  // Students to check in: at-risk or declining
  const atRiskStudents = studentRoster
    .filter(s => s.piBucket === 'risk' || s.piBucket === 'reinforcement')
    .sort((a, b) => a.avgPercentage - b.avgPercentage)
    .slice(0, 3);

  const studentsToCheckIn = atRiskStudents.map(s => ({
    studentId: s.studentId,
    studentName: s.studentName,
    reason: s.piBucket === 'risk'
      ? `At risk — ${s.avgPercentage}% average`
      : s.secondaryTags.includes('declining')
      ? 'Declining performance over recent exams'
      : s.secondaryTags.includes('plateaued')
      ? 'Plateaued — no improvement in 3+ exams'
      : 'Needs reinforcement',
    avgPercentage: s.avgPercentage,
    trend: (s.trend === 'up' ? 'up' : s.trend === 'down' ? 'down' : 'flat') as 'up' | 'down' | 'flat',
  }));

  // Recent exam average
  const recentExams = examHistory.slice(0, 5);
  const recentExamAvg = recentExams.length > 0
    ? Math.round(recentExams.reduce((s, e) => s + Math.round((e.classAverage / e.totalMarks) * 100), 0) / recentExams.length)
    : 0;

  // Overall trend
  const atRiskCount = studentRoster.filter(s => s.piBucket === 'risk').length;
  const weakTopicCount = chapters.filter(ch => ch.status === 'weak').length;

  const overallTrend: 'improving' | 'declining' | 'stable' =
    atRiskCount > 5 ? 'declining' : atRiskCount <= 2 && weakTopicCount <= 1 ? 'improving' : 'stable';

  // Suggested focus
  const focusTopic = priorityTopics[0];
  const suggestedFocus = focusTopic
    ? `Review ${focusTopic.topic} in ${focusTopic.chapter} — ${atRiskStudents.length} students consistently below 35% on this area.`
    : recentExamAvg < 50
    ? `Class average is ${recentExamAvg}%. Consider a revision session on the weakest areas before the next assessment.`
    : `Class is performing well overall (${recentExamAvg}% avg). Focus on pushing reinforcement-band students into stable progress.`;

  return {
    generatedAt: new Date().toISOString(),
    overallTrend,
    recentExamAvg,
    priorityTopics,
    studentsToCheckIn,
    suggestedFocus,
    atRiskCount,
    weakTopicCount,
  };
}

// ── Caches ──

const chapterReportsCache = new Map<string, ChapterReportCard[]>();
const batchExamsCache = new Map<string, BatchExamEntry[]>();
const chapterDetailCache = new Map<string, ChapterDetailReport>();
const instituteTestsCache = new Map<string, InstituteTestEntry[]>();
const batchHealthCache = new Map<string, BatchHealthSummary>();

// ── Exports ──

export const batchReports = generateBatchReports();

export const getBatchChapters = (batchId: string): ChapterReportCard[] => {
  if (!chapterReportsCache.has(batchId)) {
    chapterReportsCache.set(batchId, generateChapterReports(batchId));
  }
  return chapterReportsCache.get(batchId)!;
};

export const getBatchExamHistory = (batchId: string): BatchExamEntry[] => {
  if (!batchExamsCache.has(batchId)) {
    batchExamsCache.set(batchId, generateBatchExams(batchId));
  }
  return batchExamsCache.get(batchId)!;
};

export const getChapterDetail = (chapterId: string, batchId: string): ChapterDetailReport => {
  const key = `${chapterId}__${batchId}`;
  if (!chapterDetailCache.has(key)) {
    chapterDetailCache.set(key, generateChapterDetail(chapterId, batchId));
  }
  return chapterDetailCache.get(key)!;
};

export const getBatchInstituteTests = (batchId: string, teacherSubject: string): InstituteTestEntry[] => {
  const key = `${batchId}__${teacherSubject}`;
  if (!instituteTestsCache.has(key)) {
    instituteTestsCache.set(key, generateInstituteTests(batchId, teacherSubject));
  }
  return instituteTestsCache.get(key)!;
};

export const getBatchHealth = (
  batchId: string,
  chapters: ChapterReportCard[],
  examHistory: BatchExamEntry[],
  studentRoster: { studentName: string; studentId: string; avgPercentage: number; trend: string; piBucket: string; secondaryTags: string[] }[]
): BatchHealthSummary => {
  if (!batchHealthCache.has(batchId)) {
    batchHealthCache.set(batchId, generateMockBatchHealth(chapters, examHistory, studentRoster));
  }
  return batchHealthCache.get(batchId)!;
};
