// Grand Test Data — Types, seeded PRNG generator, and cache
// Extracted from GrandTestResults.tsx for modularity

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

export interface SubjectScore {
  subject: string;
  totalMarks: number;
  classAverage: number;
  highest: number;
  lowest: number;
  passPercentage: number;
  color: string; // HSL
}

export interface GrandTestStudent {
  rank: number;
  name: string;
  rollNumber: string;
  totalScore: number;
  totalMax: number;
  percentage: number;
  subjectScores: { subject: string; score: number; max: number }[];
}

export interface GrandTestData {
  examName: string;
  batchName: string;
  date: string;
  totalMarks: number;
  totalStudents: number;
  classAverage: number;
  highest: number;
  lowest: number;
  passPercentage: number;
  subjects: SubjectScore[];
  leaderboard: GrandTestStudent[];
}

export const SUBJECT_COLORS: Record<string, string> = {
  Physics: "210 90% 56%",
  Chemistry: "145 65% 42%",
  Mathematics: "35 95% 55%",
  Biology: "280 65% 55%",
};

// ── Cache ──

const grandTestCache = new Map<string, GrandTestData>();

// ── Generator ──

const STUDENT_NAMES = [
  "Aarav Sharma", "Priya Patel", "Rohan Kumar", "Sneha Singh", "Arjun Reddy",
  "Ananya Gupta", "Vikram Joshi", "Ishita Verma", "Karan Malhotra", "Meera Nair",
  "Aditya Rao", "Kavya Iyer", "Nikhil Tiwari", "Pooja Mehta", "Siddharth Kapoor",
  "Tanvi Desai", "Rahul Chauhan", "Shreya Agarwal", "Dev Saxena", "Riya Mishra",
  "Aryan Bhatt", "Diya Chandra", "Varun Sinha", "Nisha Prakash", "Yash Goel",
  "Harini Menon", "Tanya Kaushal", "Uday Mathur", "Namita Hegde", "Omkar Pawar",
  "Kunal Grover", "Lavanya Rajan", "Mihir Dalal", "Parinita Luthra", "Samar Walia",
  "Tushar Bose", "Deepika Sethi", "Girish Kapoor", "Falguni Deshmukh", "Chirag Oberoi",
  "Bhavna Chawla", "Aakash Tripathi", "Ritika Choudhary", "Wasim Ahmed", "Xena Fernandes",
];

export function generateGrandTestData(
  examId: string,
  examName: string,
  batchName: string,
  date: string,
  subjectNames: string[],
  totalMarks: number,
  totalStudents: number,
  classAverage: number,
  passPercentage: number
): GrandTestData {
  if (grandTestCache.has(examId)) return grandTestCache.get(examId)!;

  const rand = seededRandom(hashString(examId + "-grandtest"));
  const marksPerSubject = Math.round(totalMarks / subjectNames.length);

  const subjects: SubjectScore[] = subjectNames.map((name) => {
    const avg = Math.round(marksPerSubject * (0.45 + rand() * 0.3));
    return {
      subject: name,
      totalMarks: marksPerSubject,
      classAverage: avg,
      highest: Math.min(marksPerSubject, Math.round(avg + marksPerSubject * 0.2 + rand() * 10)),
      lowest: Math.max(0, Math.round(avg - marksPerSubject * 0.3 - rand() * 10)),
      passPercentage: Math.round(55 + rand() * 30),
      color: SUBJECT_COLORS[name] || "210 50% 50%",
    };
  });

  const leaderboard: GrandTestStudent[] = [];
  const count = Math.min(totalStudents, STUDENT_NAMES.length);

  for (let i = 0; i < count; i++) {
    const subjectScores = subjects.map((sub) => {
      const score = Math.max(
        0,
        Math.min(sub.totalMarks, Math.round(sub.classAverage + (rand() - 0.5) * sub.totalMarks * 0.6))
      );
      return { subject: sub.subject, score, max: sub.totalMarks };
    });
    const totalScore = subjectScores.reduce((s, ss) => s + ss.score, 0);
    leaderboard.push({
      rank: 0,
      name: STUDENT_NAMES[i],
      rollNumber: `${batchName}${String(i + 1).padStart(3, "0")}`,
      totalScore,
      totalMax: totalMarks,
      percentage: Math.round((totalScore / totalMarks) * 100),
      subjectScores,
    });
  }

  leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  leaderboard.forEach((s, i) => (s.rank = i + 1));

  const highest = leaderboard[0]?.totalScore || 0;
  const lowest = leaderboard[leaderboard.length - 1]?.totalScore || 0;

  const data: GrandTestData = {
    examName,
    batchName,
    date,
    totalMarks,
    totalStudents: count,
    classAverage,
    highest,
    lowest,
    passPercentage,
    subjects,
    leaderboard,
  };

  grandTestCache.set(examId, data);
  return data;
}
