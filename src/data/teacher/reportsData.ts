// Reports Module — Mock Data
// Provides batch-level summaries, chapter analytics, and exam history

import { batchInfoMap } from "./examResults";
import { teacherExams } from "./exams";

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
  const examBreakdown: ChapterExamBreakdown[] = batchExams.slice(0, 3).map((exam) => ({
    examId: exam.id,
    examName: exam.name,
    date: exam.updatedAt,
    questionsFromChapter: 2 + Math.floor(Math.random() * 5),
    avgSuccessRate: 30 + Math.floor(Math.random() * 50),
  }));

  const overallSuccess = Math.round(topics.reduce((s, t) => s + t.avgSuccessRate, 0) / topics.length);

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
  };
};

// ── Exports ──

export const batchReports = generateBatchReports();

export const getBatchChapters = (batchId: string): ChapterReportCard[] => {
  return generateChapterReports(batchId);
};

export const getBatchExamHistory = (batchId: string): BatchExamEntry[] => {
  return generateBatchExams(batchId);
};

export const getChapterDetail = (chapterId: string, batchId: string): ChapterDetailReport => {
  return generateChapterDetail(chapterId, batchId);
};
