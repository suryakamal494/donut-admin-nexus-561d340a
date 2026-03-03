// Institute Test Detail — Mock question-wise analysis for teacher's subject
import { mockGrandTests } from "@/data/examsData";

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

export interface InstituteQuestionAnalysis {
  questionId: string;
  questionNumber: number;
  chapter: string;
  topic: string;
  type: "mcq_single" | "mcq_multiple" | "integer" | "assertion_reasoning";
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  negativeMarks: number;
  correctPercentage: number;
  attemptPercentage: number;
  avgTimeSpent: number;
  status: "strong" | "moderate" | "weak";
}

export interface InstituteChapterSummary {
  chapter: string;
  totalQuestions: number;
  avgCorrectRate: number;
  strongCount: number;
  weakCount: number;
}

export interface InstituteDifficultySummary {
  difficulty: "easy" | "medium" | "hard";
  totalQuestions: number;
  avgCorrectRate: number;
}

export interface InstituteTestDetailData {
  examId: string;
  examName: string;
  pattern: "jee_main" | "jee_advanced" | "neet";
  date: string;
  subject: string;
  subjectMaxMarks: number;
  subjectAvgScore: number;
  subjectHighest: number;
  totalQuestions: number;
  participantCount: number;
  passPercentage: number;
  questions: InstituteQuestionAnalysis[];
  chapterSummary: InstituteChapterSummary[];
  difficultySummary: InstituteDifficultySummary[];
}

// ── Physics chapters/topics for mock generation ──

const physicsTopicPool = [
  { chapter: "Kinematics", topics: ["Displacement", "Velocity", "Acceleration", "Projectile Motion", "Relative Motion"] },
  { chapter: "Laws of Motion", topics: ["Newton's Laws", "Friction", "Circular Motion", "Free Body Diagrams"] },
  { chapter: "Work, Energy & Power", topics: ["Work-Energy Theorem", "Conservation of Energy", "Power", "Collisions"] },
  { chapter: "Gravitation", topics: ["Gravitational Field", "Orbital Velocity", "Escape Velocity", "Kepler's Laws"] },
  { chapter: "Optics", topics: ["Reflection", "Refraction", "Lenses", "Wave Optics", "Interference"] },
  { chapter: "Thermodynamics", topics: ["First Law", "Second Law", "Entropy", "Heat Engines", "Carnot Cycle"] },
  { chapter: "Waves & Sound", topics: ["Wave Motion", "Doppler Effect", "Standing Waves", "Beats"] },
  { chapter: "Electrostatics", topics: ["Coulomb's Law", "Electric Field", "Capacitance", "Gauss's Law"] },
  { chapter: "Current Electricity", topics: ["Ohm's Law", "Kirchhoff's Laws", "Wheatstone Bridge", "Potentiometer"] },
  { chapter: "Magnetism", topics: ["Magnetic Field", "Biot-Savart Law", "Ampere's Law", "Electromagnetic Induction"] },
];

const questionTypes: InstituteQuestionAnalysis["type"][] = ["mcq_single", "mcq_multiple", "integer", "assertion_reasoning"];
const difficulties: InstituteQuestionAnalysis["difficulty"][] = ["easy", "medium", "hard"];

// ── Generator ──

const instituteTestDetailCache = new Map<string, InstituteTestDetailData | null>();

export const getInstituteTestDetail = (examId: string, subject: string): InstituteTestDetailData | null => {
  const key = `${examId}__${subject}`;
  if (instituteTestDetailCache.has(key)) return instituteTestDetailCache.get(key)!;

  const gt = mockGrandTests.find(g => g.id === examId && g.status === "completed" && g.subjects.includes(subject));
  if (!gt) return null;

  const rand = seededRandom(hashString(examId + "-" + subject + "-test-detail"));

  const subjectCount = gt.subjects.length;
  const totalQ = Math.round(gt.totalQuestions / subjectCount);
  const subjectMax = Math.round(gt.totalMarks / subjectCount);
  const marksPerQ = Math.round(subjectMax / totalQ);

  // Generate questions spread across chapters
  const questions: InstituteQuestionAnalysis[] = [];
  for (let i = 0; i < totalQ; i++) {
    const chPool = physicsTopicPool[i % physicsTopicPool.length];
    const topic = chPool.topics[Math.floor(rand() * chPool.topics.length)];
    const correctPct = 15 + Math.floor(rand() * 70);
    questions.push({
      questionId: `${examId}-q${i + 1}`,
      questionNumber: i + 1,
      chapter: chPool.chapter,
      topic,
      type: questionTypes[Math.floor(rand() * questionTypes.length)],
      difficulty: difficulties[Math.floor(rand() * 3)],
      marks: marksPerQ,
      negativeMarks: gt.pattern === "neet" ? Math.round(marksPerQ / 4) : Math.round(marksPerQ / 3),
      correctPercentage: correctPct,
      attemptPercentage: 55 + Math.floor(rand() * 40),
      avgTimeSpent: 30 + Math.floor(rand() * 150),
      status: correctPct >= 60 ? "strong" : correctPct >= 35 ? "moderate" : "weak",
    });
  }

  // Chapter summary
  const chapterMap = new Map<string, InstituteQuestionAnalysis[]>();
  questions.forEach(q => {
    const arr = chapterMap.get(q.chapter) || [];
    arr.push(q);
    chapterMap.set(q.chapter, arr);
  });
  const chapterSummary: InstituteChapterSummary[] = Array.from(chapterMap.entries()).map(([chapter, qs]) => ({
    chapter,
    totalQuestions: qs.length,
    avgCorrectRate: Math.round(qs.reduce((s, q) => s + q.correctPercentage, 0) / qs.length),
    strongCount: qs.filter(q => q.status === "strong").length,
    weakCount: qs.filter(q => q.status === "weak").length,
  }));

  // Difficulty summary
  const difficultySummary: InstituteDifficultySummary[] = difficulties.map(d => {
    const qs = questions.filter(q => q.difficulty === d);
    return {
      difficulty: d,
      totalQuestions: qs.length,
      avgCorrectRate: qs.length ? Math.round(qs.reduce((s, q) => s + q.correctPercentage, 0) / qs.length) : 0,
    };
  });

  const subjectAvg = Math.round(subjectMax * (0.35 + rand() * 0.35));
  const subjectHighest = Math.round(subjectMax * (0.78 + rand() * 0.18));

  const result: InstituteTestDetailData = {
    examId,
    examName: gt.name,
    pattern: gt.pattern,
    date: gt.completedDate || gt.scheduledDate || gt.createdAt,
    subject,
    subjectMaxMarks: subjectMax,
    subjectAvgScore: subjectAvg,
    subjectHighest: Math.min(subjectHighest, subjectMax),
    totalQuestions: totalQ,
    participantCount: gt.participantCount || 0,
    passPercentage: 45 + Math.floor(rand() * 40),
    questions,
    chapterSummary,
    difficultySummary,
  };
  instituteTestDetailCache.set(key, result);
  return result;
};
