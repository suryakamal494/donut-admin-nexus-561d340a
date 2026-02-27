// Reports Module — Mock Data
// Provides batch-level summaries, chapter analytics, and exam history

import { batchInfoMap } from "./examResults";
import { teacherExams } from "./exams";
import { mockGrandTests } from "@/data/examsData";
import { computeStudentPI, type ExamHistoryEntry, type SecondaryTag, type Trend } from "@/lib/performanceIndex";

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
    const batchExams = teacherExams.filter(
      (e) => e.batchIds.includes(batchId) && e.status === "completed"
    );
    const classAvg = 45 + Math.floor(Math.random() * 30);
    const prevAvg = classAvg + (Math.random() > 0.5 ? -5 : 5) * Math.round(Math.random() * 3);
    return {
      batchId,
      batchName: info.name,
      className: info.className,
      totalExamsConducted: batchExams.length,
      classAverage: classAvg,
      previousAverage: prevAvg,
      trend: classAvg > prevAvg ? "up" : classAvg < prevAvg ? "down" : "stable",
      totalStudents: 20 + Math.floor(Math.random() * 15),
      atRiskCount: Math.floor(Math.random() * 6),
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
  return physicsChapters.map((ch) => {
    const avgSuccess = 25 + Math.floor(Math.random() * 55);
    const weakCount = ch.topics.filter(() => Math.random() < 0.3).length;
    return {
      chapterId: ch.id,
      chapterName: ch.name,
      subject: "Physics",
      examsCovering: 1 + Math.floor(Math.random() * 4),
      avgSuccessRate: avgSuccess,
      topicCount: ch.topics.length,
      weakTopicCount: weakCount,
      status: avgSuccess >= 65 ? "strong" : avgSuccess >= 40 ? "moderate" : "weak",
    };
  });
};

const generateBatchExams = (batchId: string): BatchExamEntry[] => {
  const batchExams = teacherExams.filter(
    (e) => e.batchIds.includes(batchId) && e.status === "completed"
  );
  return batchExams.map((exam) => ({
    examId: exam.id,
    examName: exam.name,
    date: exam.updatedAt,
    totalMarks: exam.totalMarks,
    classAverage: Math.round(exam.totalMarks * (0.4 + Math.random() * 0.35)),
    highestScore: Math.round(exam.totalMarks * (0.75 + Math.random() * 0.2)),
    totalStudents: 20 + Math.floor(Math.random() * 10),
    passPercentage: 50 + Math.floor(Math.random() * 40),
  }));
};

const generateChapterDetail = (chapterId: string, batchId: string): ChapterDetailReport => {
  const chapter = physicsChapters.find((c) => c.id === chapterId)!;
  const batchInfo = batchInfoMap[batchId];

  const topics: ChapterTopicAnalysis[] = chapter.topics.map((t, i) => {
    const sr = 20 + Math.floor(Math.random() * 65);
    return {
      topicId: `${chapterId}-t${i}`,
      topicName: t,
      questionsAsked: 2 + Math.floor(Math.random() * 8),
      avgSuccessRate: sr,
      status: sr >= 65 ? "strong" : sr >= 40 ? "moderate" : "weak",
      examsAppeared: 1 + Math.floor(Math.random() * 3),
    };
  });

  const batchExams = teacherExams.filter(
    (e) => e.batchIds.includes(batchId) && e.status === "completed"
  );
  const examBreakdown: ChapterExamBreakdown[] = batchExams.map((exam) => ({
    examId: exam.id,
    examName: exam.name,
    date: exam.updatedAt,
    questionsFromChapter: 2 + Math.floor(Math.random() * 5),
    avgSuccessRate: 30 + Math.floor(Math.random() * 50),
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

  const allStudents: ChapterStudentEntry[] = studentNames.slice(0, 20 + Math.floor(Math.random() * 5)).map((name, i) => {
    const numExams = 1 + Math.floor(Math.random() * examBreakdown.length + 1);
    
    // Generate mock exam history
    const examHistory: ExamHistoryEntry[] = Array.from({ length: numExams }, (_, j) => ({
      examId: examBreakdown[j % examBreakdown.length]?.examId || `mock-exam-${j}`,
      percentage: Math.round(10 + Math.random() * 85),
      date: examBreakdown[j % examBreakdown.length]?.date || `2025-0${j + 1}-15`,
      timeEfficiency: Math.round(25 + Math.random() * 70),
      attemptRate: Math.round(40 + Math.random() * 60),
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
  const completed = mockGrandTests.filter(
    (gt) => gt.status === "completed" && gt.subjects.includes(teacherSubject)
  );

  return completed.map((gt) => {
    const subjectCount = gt.subjects.length;
    const subjectMax = Math.round(gt.totalMarks / subjectCount);
    const subjectAvg = Math.round(subjectMax * (0.35 + Math.random() * 0.35));
    const subjectHighest = Math.round(subjectMax * (0.75 + Math.random() * 0.2));
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
      passPercentage: 45 + Math.floor(Math.random() * 40),
      participantCount: gt.participantCount || 0,
    };
  });
};

// ── Caches ──

const chapterReportsCache = new Map<string, ChapterReportCard[]>();
const batchExamsCache = new Map<string, BatchExamEntry[]>();
const chapterDetailCache = new Map<string, ChapterDetailReport>();
const instituteTestsCache = new Map<string, InstituteTestEntry[]>();

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
