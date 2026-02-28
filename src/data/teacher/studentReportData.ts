// Student Report Data — Aggregated student performance across all exams in a batch
// Provides chapter mastery, difficulty breakdown, topic-level weak spots, exam history

import { batchInfoMap } from "./examResults";
import { teacherExams } from "./exams";
import { computeStudentPI, type ExamHistoryEntry, type SecondaryTag, type Trend } from "@/lib/performanceIndex";

// ── Types ──

export interface StudentRosterEntry {
  studentId: string;
  studentName: string;
  rollNumber: string;
  avgPercentage: number;
  examsAttempted: number;
  performanceIndex: number;
  trend: Trend;
  secondaryTags: SecondaryTag[];
  piBucket: "mastery" | "stable" | "reinforcement" | "risk";
}

export interface ChapterMastery {
  chapterId: string;
  chapterName: string;
  avgSuccessRate: number;
  questionsAttempted: number;
  examsAppeared: number;
  status: "strong" | "moderate" | "weak";
  trend: Trend;
  topics: TopicDetail[];
}

export interface TopicDetail {
  topicName: string;
  chapterName: string;
  questionsAsked: number;
  accuracy: number;
  status: "strong" | "moderate" | "weak";
}

export interface ExamHistoryItem {
  examId: string;
  examName: string;
  date: string;
  score: number;
  maxScore: number;
  percentage: number;
  rank: number;
  totalStudents: number;
}

export interface DifficultyBreakdown {
  level: "easy" | "medium" | "hard";
  questionsAttempted: number;
  accuracy: number;
  avgTimePerQuestion: number; // seconds
}

export interface StudentBatchProfile {
  studentId: string;
  studentName: string;
  rollNumber: string;
  batchId: string;
  batchName: string;
  // Overall metrics
  overallAccuracy: number;
  totalExams: number;
  totalQuestions: number;
  trend: Trend;
  secondaryTags: SecondaryTag[];
  performanceIndex: number;
  consistency: number;
  // Sections
  chapterMastery: ChapterMastery[];
  examHistory: ExamHistoryItem[];
  difficultyBreakdown: DifficultyBreakdown[];
  weakTopics: TopicDetail[]; // sorted by accuracy ascending
  // For Generate Homework prefill
  weakTopicNames: string[];
  suggestedDifficulty: string;
}

// ── Physics chapters (same as reportsData) ──

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

// ── Stable student names per batch ──

const batchStudentNames: Record<string, string[]> = {
  "batch-10a": [
    "Aarav Sharma", "Priya Patel", "Rohan Gupta", "Ananya Singh", "Vikram Reddy",
    "Sneha Iyer", "Arjun Nair", "Kavya Menon", "Rahul Das", "Meera Joshi",
    "Siddharth Kumar", "Divya Rao", "Aditya Verma", "Ishita Banerjee", "Karthik Subramaniam",
    "Neha Agarwal", "Varun Mishra", "Riya Chauhan", "Harsh Pandey", "Pooja Deshmukh",
    "Amit Tiwari", "Simran Kaur", "Nikhil Saxena", "Tanvi Kulkarni", "Deepak Yadav",
  ],
  "batch-10b": [
    "Manish Yadav", "Sakshi Pandey", "Rajesh Nair", "Komal Thakur", "Deepak Jain",
    "Sonal Mehra", "Gaurav Bhat", "Neha Kulkarni", "Tushar Soni", "Pallavi Saxena",
    "Mayank Dubey", "Richa Tiwari", "Ajay Pillai", "Swati Bansal", "Hemant Rawat",
    "Divya Chouhan", "Suresh Goyal", "Jyoti Arora", "Pankaj Rana", "Kritika Shah",
    "Mohit Khandelwal", "Anusha Reddy", "Tarun Agarwal", "Geeta Bhardwaj", "Vishal Parmar",
  ],
  "batch-11a": [
    "Aakash Tripathi", "Bhavna Chawla", "Chirag Oberoi", "Deepika Sethi", "Eshan Malhotra",
    "Falguni Deshmukh", "Girish Bose", "Harini Menon", "Iqbal Siddiqui", "Jhanvi Kapoor",
    "Kunal Grover", "Lavanya Rajan", "Mihir Dalal", "Namita Hegde", "Omkar Pawar",
    "Parinita Luthra", "Qasim Khan", "Ritika Choudhary", "Samar Walia", "Tanya Kaushal",
    "Uday Mathur", "Vani Krishnan", "Wasim Ahmed", "Xena Fernandes", "Yogesh Shetty",
  ],
};

// ── Seeded random for stable data ──

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ── Generators ──

function getPIBucket(pi: number): "mastery" | "stable" | "reinforcement" | "risk" {
  if (pi >= 75) return "mastery";
  if (pi >= 50) return "stable";
  if (pi >= 35) return "reinforcement";
  return "risk";
}

function generateStudentRoster(batchId: string): StudentRosterEntry[] {
  const names = batchStudentNames[batchId] || batchStudentNames["batch-10a"];
  const count = 20 + hashString(batchId) % 6; // 20-25 students
  const rand = seededRandom(hashString(`roster-${batchId}`));

  return names.slice(0, count).map((name, i) => {
    const numExams = 2 + Math.floor(rand() * 5);
    const examHistory: ExamHistoryEntry[] = Array.from({ length: numExams }, (_, j) => ({
      examId: `exam-${j}`,
      percentage: Math.round(15 + rand() * 75),
      date: `2025-0${Math.min(9, j + 1)}-${10 + Math.floor(rand() * 15)}`,
      timeEfficiency: Math.round(25 + rand() * 70),
      attemptRate: Math.round(40 + rand() * 60),
    }));

    const pi = computeStudentPI(examHistory);

    return {
      studentId: `student-${batchId}-${i}`,
      studentName: name,
      rollNumber: `R${String(101 + i)}`,
      avgPercentage: pi.accuracy,
      examsAttempted: numExams,
      performanceIndex: pi.performanceIndex,
      trend: pi.trend,
      secondaryTags: pi.secondaryTags,
      piBucket: getPIBucket(pi.performanceIndex),
    };
  });
}

function generateStudentProfile(studentId: string, batchId: string): StudentBatchProfile {
  const batchInfo = batchInfoMap[batchId];
  const roster = getBatchStudentRoster(batchId);
  const student = roster.find(s => s.studentId === studentId);

  if (!student) {
    // Fallback
    return {
      studentId, studentName: "Unknown", rollNumber: "N/A",
      batchId, batchName: batchInfo?.name || batchId,
      overallAccuracy: 0, totalExams: 0, totalQuestions: 0,
      trend: "flat", secondaryTags: [], performanceIndex: 0, consistency: 0,
      chapterMastery: [], examHistory: [], difficultyBreakdown: [],
      weakTopics: [], weakTopicNames: [], suggestedDifficulty: "medium",
    };
  }

  const rand = seededRandom(hashString(`profile-${studentId}-${batchId}`));

  // Generate exam history
  const batchExams = teacherExams.filter(e => e.batchIds.includes(batchId) && e.status === "completed");
  const examHistory: ExamHistoryItem[] = batchExams.map((exam, i) => {
    const maxScore = exam.totalMarks;
    const pct = Math.round(20 + rand() * 70);
    const score = Math.round(maxScore * pct / 100);
    return {
      examId: exam.id,
      examName: exam.name,
      date: exam.updatedAt,
      score,
      maxScore,
      percentage: pct,
      rank: 1 + Math.floor(rand() * 20),
      totalStudents: 20 + Math.floor(rand() * 10),
    };
  });

  // Chapter mastery
  const chapterMastery: ChapterMastery[] = physicsChapters.map(ch => {
    const topics: TopicDetail[] = ch.topics.map(t => {
      const acc = Math.round(10 + rand() * 80);
      return {
        topicName: t,
        chapterName: ch.name,
        questionsAsked: 1 + Math.floor(rand() * 6),
        accuracy: acc,
        status: acc >= 65 ? "strong" as const : acc >= 40 ? "moderate" as const : "weak" as const,
      };
    });

    const avgRate = Math.round(topics.reduce((s, t) => s + t.accuracy, 0) / topics.length);
    const examsAppeared = 1 + Math.floor(rand() * 3);

    // Compute chapter trend from simulated data
    const vals = [avgRate - 5 + Math.floor(rand() * 10), avgRate, avgRate + Math.floor(rand() * 8)];
    const chTrend: Trend = vals[2] > vals[0] + 3 ? "up" : vals[2] < vals[0] - 3 ? "down" : "flat";

    return {
      chapterId: ch.id,
      chapterName: ch.name,
      avgSuccessRate: avgRate,
      questionsAttempted: topics.reduce((s, t) => s + t.questionsAsked, 0),
      examsAppeared,
      status: avgRate >= 65 ? "strong" as const : avgRate >= 40 ? "moderate" as const : "weak" as const,
      trend: chTrend,
      topics,
    };
  });

  // Difficulty breakdown
  const difficultyBreakdown: DifficultyBreakdown[] = (["easy", "medium", "hard"] as const).map(level => {
    const base = level === "easy" ? 70 : level === "medium" ? 50 : 30;
    return {
      level,
      questionsAttempted: 5 + Math.floor(rand() * 15),
      accuracy: Math.round(base + rand() * 25),
      avgTimePerQuestion: Math.round(30 + rand() * 60),
    };
  });

  // Weak topics: gather all topics, sort by accuracy ascending, take weakest
  const allTopics = chapterMastery.flatMap(ch => ch.topics);
  const weakTopics = [...allTopics].sort((a, b) => a.accuracy - b.accuracy).filter(t => t.accuracy < 50);

  // PI from exam history entries
  const piHistory: ExamHistoryEntry[] = examHistory.map(e => ({
    examId: e.examId,
    percentage: e.percentage,
    date: e.date,
    timeEfficiency: Math.round(25 + rand() * 70),
    attemptRate: Math.round(40 + rand() * 60),
  }));
  const piResult = computeStudentPI(piHistory);

  // Suggested difficulty for homework
  const avgDiffAcc = difficultyBreakdown.reduce((s, d) => s + d.accuracy, 0) / 3;
  const suggestedDifficulty = avgDiffAcc > 60 ? "hard" : avgDiffAcc > 40 ? "medium" : "easy";

  return {
    studentId,
    studentName: student.studentName,
    rollNumber: student.rollNumber,
    batchId,
    batchName: batchInfo?.name || batchId,
    overallAccuracy: piResult.accuracy,
    totalExams: examHistory.length,
    totalQuestions: allTopics.reduce((s, t) => s + t.questionsAsked, 0),
    trend: piResult.trend,
    secondaryTags: piResult.secondaryTags,
    performanceIndex: piResult.performanceIndex,
    consistency: piResult.consistency,
    chapterMastery,
    examHistory,
    difficultyBreakdown,
    weakTopics,
    weakTopicNames: weakTopics.slice(0, 5).map(t => t.topicName),
    suggestedDifficulty,
  };
}

// ── Caches ──

const rosterCache = new Map<string, StudentRosterEntry[]>();
const profileCache = new Map<string, StudentBatchProfile>();

// ── Exports ──

export function getBatchStudentRoster(batchId: string): StudentRosterEntry[] {
  if (!rosterCache.has(batchId)) {
    rosterCache.set(batchId, generateStudentRoster(batchId));
  }
  return rosterCache.get(batchId)!;
}

export function getStudentBatchProfile(studentId: string, batchId: string): StudentBatchProfile {
  const key = `${studentId}__${batchId}`;
  if (!profileCache.has(key)) {
    profileCache.set(key, generateStudentProfile(studentId, batchId));
  }
  return profileCache.get(key)!;
}

// ── Student AI Insight (mock) ──

export interface StudentAIInsight {
  summary: string;
  strengths: string[];
  priorities: string[];
  engagementNote: string;
  suggestedDifficulty: string;
  suggestedTopics: string[];
}

export function generateMockStudentInsight(profile: StudentBatchProfile): StudentAIInsight {
  const firstName = profile.studentName.split(" ")[0];

  // Strengths: top chapters with strong status
  const strongChapters = profile.chapterMastery
    .filter(ch => ch.status === "strong")
    .sort((a, b) => b.avgSuccessRate - a.avgSuccessRate)
    .slice(0, 3);
  const strengths = strongChapters.map(ch => `${ch.chapterName} (${ch.avgSuccessRate}%)`);

  // Priorities: weakest chapters
  const weakChapters = profile.chapterMastery
    .filter(ch => ch.status === "weak")
    .sort((a, b) => a.avgSuccessRate - b.avgSuccessRate)
    .slice(0, 2);
  const priorities = weakChapters.map(ch => `${ch.chapterName} (${ch.avgSuccessRate}%) — foundational gaps`);

  // If no weak chapters, use moderate ones
  if (priorities.length === 0) {
    const modChapters = profile.chapterMastery
      .filter(ch => ch.status === "moderate")
      .sort((a, b) => a.avgSuccessRate - b.avgSuccessRate)
      .slice(0, 2);
    priorities.push(...modChapters.map(ch => `${ch.chapterName} (${ch.avgSuccessRate}%) — needs reinforcement`));
  }

  // Engagement note based on tags
  let engagementNote = "";
  if (profile.secondaryTags.includes("declining")) {
    engagementNote = `${firstName}'s performance has been declining over recent exams. Consider a check-in.`;
  } else if (profile.secondaryTags.includes("low-attempt")) {
    engagementNote = `${firstName} has a low attempt rate — recent exams show incomplete submissions.`;
  } else if (profile.secondaryTags.includes("inconsistent")) {
    engagementNote = `${firstName}'s scores fluctuate significantly between exams — consistency is a concern.`;
  } else if (profile.secondaryTags.includes("plateaued")) {
    engagementNote = `${firstName}'s scores have plateaued — consider varying question types to break the pattern.`;
  } else if (profile.consistency < 50) {
    engagementNote = `Consistency score is ${profile.consistency}% — performance varies widely across exams.`;
  } else {
    engagementNote = `${firstName} shows steady engagement across exams.`;
  }

  // Summary
  const weakTopicStr = profile.weakTopicNames.slice(0, 2).join(" and ");
  let summary: string;
  if (profile.trend === "down") {
    summary = `${firstName} needs immediate attention. Accuracy has dropped to ${profile.overallAccuracy}% with a declining trend.${weakTopicStr ? ` Focus areas: ${weakTopicStr}.` : ""}`;
  } else if (profile.overallAccuracy < 40) {
    summary = `${firstName} is in the foundational risk zone at ${profile.overallAccuracy}% overall accuracy.${weakTopicStr ? ` Targeted practice on ${weakTopicStr} is recommended at ${profile.suggestedDifficulty} difficulty.` : ""}`;
  } else if (weakChapters.length > 0) {
    summary = `${firstName} shows mixed performance at ${profile.overallAccuracy}%.${strengths.length > 0 ? ` Strong in ${strongChapters[0]?.chapterName}` : ""}, but needs focused work on ${weakTopicStr || "weak areas"}.`;
  } else {
    summary = `${firstName} is performing well at ${profile.overallAccuracy}% overall.${strengths.length > 0 ? ` Particularly strong in ${strengths[0]}.` : ""} Consider challenging with harder questions.`;
  }

  return {
    summary,
    strengths,
    priorities,
    engagementNote,
    suggestedDifficulty: profile.suggestedDifficulty,
    suggestedTopics: profile.weakTopicNames.slice(0, 3),
  };
}
