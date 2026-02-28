// Practice Session Detail — Mock Data
// Deterministic per session using seed-based generation

import { getPracticeHistory } from "./practiceHistoryData";
import type { PracticeSession } from "./practiceHistoryData";

export interface StudentResult {
  id: string;
  name: string;
  rollNumber: string;
  completed: boolean;
  accuracy: number;
  score: number;
  maxScore: number;
  timeTaken: number; // minutes
}

export interface QuestionResult {
  id: string;
  text: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  successRate: number;
  totalAttempts: number;
  correctAttempts: number;
  options: string[];
  correctOption: number; // 0-indexed
}

export interface BandDetail {
  key: string;
  label: string;
  questionCount: number;
  studentsAssigned: number;
  completedCount: number;
  avgAccuracy: number;
  students: StudentResult[];
  questions: QuestionResult[];
}

export interface PracticeSessionDetail {
  session: PracticeSession;
  bandDetails: BandDetail[];
  overallCompletion: number;
  overallAccuracy: number;
  totalStudents: number;
}

const studentNames = [
  "Aarav Sharma", "Priya Patel", "Rohan Gupta", "Ananya Singh", "Vikram Reddy",
  "Sneha Iyer", "Arjun Nair", "Kavya Das", "Rahul Joshi", "Meera Kulkarni",
  "Aditya Verma", "Ishita Mehta", "Karthik Rao", "Divya Menon", "Siddharth Pillai",
  "Pooja Hegde", "Nikhil Saxena", "Riya Bhat", "Varun Chopra", "Tanvi Deshmukh",
];

const questionTexts: Record<string, string[]> = {
  mastery: [
    "A particle moves along a straight line with velocity v = 3t² + 2t. Find the acceleration at t = 2s.",
    "Derive the equation of motion v² = u² + 2as from first principles.",
    "A projectile is launched at 60° with initial velocity 20 m/s. Calculate the maximum height.",
    "Two cars approach each other with speeds 60 km/h and 40 km/h. Find the relative velocity.",
    "A ball thrown vertically upward returns to the thrower after 6 seconds. Find the maximum height.",
    "Calculate the range of a projectile launched at 45° with velocity 30 m/s.",
    "A body starts from rest and accelerates at 2 m/s². Find the distance covered in 5th second.",
    "Derive the relation between angular velocity and linear velocity.",
    "A particle moves in a circle of radius 2m with constant speed 4 m/s. Find centripetal acceleration.",
    "Two objects are thrown vertically with the same speed. One goes up, one goes down. Compare times.",
  ],
  stable: [
    "A train accelerates from 36 km/h to 72 km/h in 10s. Find the distance covered.",
    "Define uniform acceleration and give two examples from daily life.",
    "A stone is dropped from a cliff 80m high. Find the time to reach the ground.",
    "Plot the velocity-time graph for a body moving with uniform retardation.",
    "A car travels first half distance at 40 km/h and second half at 60 km/h. Find average speed.",
    "Explain the difference between speed and velocity with examples.",
    "A body is projected vertically upward with velocity 49 m/s. Find the maximum height reached.",
    "Calculate the time of flight for a projectile launched at 30° with velocity 20 m/s.",
    "A cyclist goes around a circular track of radius 50m at 10 m/s. Find the centripetal acceleration.",
    "Describe the motion of a freely falling body using equations of motion.",
  ],
  reinforcement: [
    "Convert 72 km/h to m/s and explain the conversion process.",
    "A bus starts from rest and reaches 20 m/s in 10s. Find the acceleration.",
    "What is the difference between distance and displacement? Give an example.",
    "A ball is thrown upward with velocity 20 m/s. Find the time to reach maximum height. (g=10 m/s²)",
    "Draw the distance-time graph for uniform velocity motion.",
    "If a car covers 100m in 10s, what is its average speed?",
    "Define instantaneous velocity and average velocity.",
    "A body moves 30m East and then 40m North. Find the displacement.",
    "What happens to the velocity of a freely falling body after every second?",
    "Calculate the average speed if a person walks 2 km in 30 minutes.",
  ],
  risk: [
    "Define velocity and state its SI unit.",
    "What is acceleration? Is it a scalar or vector quantity?",
    "State the three equations of motion for uniform acceleration.",
    "What is meant by free fall? What is the value of g?",
    "If a body moves with constant velocity, what is its acceleration?",
    "Differentiate between uniform and non-uniform motion.",
    "What does the slope of a distance-time graph represent?",
    "Define displacement. How is it different from distance?",
    "What is the acceleration due to gravity at the surface of Earth?",
    "A body is at rest. What is its initial velocity?",
  ],
};

const optionSets: string[][] = [
  ["v = u + at", "v² = u² + 2as", "s = ut + ½at²", "v = u - at"],
  ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "9.2 m/s²"],
  ["15.3 m", "20.4 m", "10.2 m", "25.0 m"],
  ["40 km/h", "100 km/h", "60 km/h", "20 km/h"],
  ["2 m/s²", "4 m/s²", "8 m/s²", "1 m/s²"],
  ["30 m", "50 m", "40 m", "45 m"],
  ["5 s", "3 s", "10 s", "7 s"],
  ["20 m/s", "15 m/s", "10 m/s", "25 m/s"],
  ["ω = v/r", "ω = vr", "ω = r/v", "ω = v²/r"],
  ["45.9 m", "44.1 m", "50.0 m", "39.2 m"],
];

const topics = ["Kinematics Basics", "Equations of Motion", "Projectile Motion", "Circular Motion", "Free Fall"];
const difficulties: Array<"Easy" | "Medium" | "Hard"> = ["Easy", "Medium", "Hard"];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const generateDetail = (session: PracticeSession): PracticeSessionDetail => {
  const seed = session.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = seededRandom(seed);

  let globalStudentIdx = 0;

  const bandDetails: BandDetail[] = session.bands.map((band) => {
    const qTexts = questionTexts[band.key] || questionTexts.risk;

    const students: StudentResult[] = Array.from({ length: band.studentsAssigned }, (_, i) => {
      const nameIdx = (globalStudentIdx++) % studentNames.length;
      const completed = i < band.completedCount;
      const accuracy = completed ? Math.round(20 + rand() * 75) : 0;
      const maxScore = band.questionCount;
      const score = completed ? Math.round((accuracy / 100) * maxScore) : 0;
      return {
        id: `student-${band.key}-${i}`,
        name: studentNames[nameIdx],
        rollNumber: `R${String(nameIdx + 1).padStart(3, "0")}`,
        completed,
        accuracy,
        score,
        maxScore,
        timeTaken: completed ? Math.round(5 + rand() * 20) : 0,
      };
    });

    const questions: QuestionResult[] = Array.from({ length: band.questionCount }, (_, i) => {
      const successRate = Math.round(15 + rand() * 75);
      const totalAttempts = band.completedCount;
      const opts = optionSets[i % optionSets.length];
      const correctOption = Math.floor(rand() * 4);
      return {
        id: `q-${band.key}-${i}`,
        text: qTexts[i % qTexts.length],
        topic: topics[Math.floor(rand() * topics.length)],
        difficulty: difficulties[Math.floor(rand() * 3)],
        successRate,
        totalAttempts,
        correctAttempts: Math.round((successRate / 100) * totalAttempts),
        options: opts,
        correctOption,
      };
    });

    return {
      key: band.key,
      label: band.label,
      questionCount: band.questionCount,
      studentsAssigned: band.studentsAssigned,
      completedCount: band.completedCount,
      avgAccuracy: band.avgAccuracy,
      students,
      questions,
    };
  });

  const totalStudents = bandDetails.reduce((s, b) => s + b.studentsAssigned, 0);
  const totalCompleted = bandDetails.reduce((s, b) => s + b.completedCount, 0);
  const overallCompletion = totalStudents > 0 ? Math.round((totalCompleted / totalStudents) * 100) : 0;
  const overallAccuracy = bandDetails.length > 0
    ? Math.round(bandDetails.reduce((s, b) => s + b.avgAccuracy, 0) / bandDetails.length)
    : 0;

  return { session, bandDetails, overallCompletion, overallAccuracy, totalStudents };
};

const cache = new Map<string, PracticeSessionDetail>();

export const getPracticeSessionDetail = (
  sessionId: string,
  chapterId: string,
  batchId: string
): PracticeSessionDetail | null => {
  if (cache.has(sessionId)) return cache.get(sessionId)!;

  const sessions = getPracticeHistory(chapterId, batchId);
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return null;

  const detail = generateDetail(session);
  cache.set(sessionId, detail);
  return detail;
};
