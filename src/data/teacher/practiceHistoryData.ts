// Practice History — Mock Data
// Deterministic per chapter using Map-based caching

export interface PracticeSessionBand {
  key: string;
  label: string;
  questionCount: number;
  studentsAssigned: number;
  completedCount: number;
  avgAccuracy: number;
}

export interface PracticeSession {
  id: string;
  createdAt: string;
  chapterId: string;
  batchId: string;
  totalQuestions: number;
  bands: PracticeSessionBand[];
}

const bandLabels: Record<string, string> = {
  mastery: "Mastery Ready",
  stable: "Stable Progress",
  reinforcement: "Reinforcement Needed",
  risk: "Foundational Risk",
};

const generateSessions = (chapterId: string, batchId: string): PracticeSession[] => {
  // Seed from chapterId to keep deterministic
  const seed = chapterId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = 3 + (seed % 4); // 3 to 6 sessions

  return Array.from({ length: count }, (_, i) => {
    const daysAgo = 7 * (count - i) + (seed % 5);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const bands: PracticeSessionBand[] = [
      { key: "mastery", studentsAssigned: 3 + ((seed + i) % 4), questionCount: i === 0 ? 5 : 10 },
      { key: "stable", studentsAssigned: 5 + ((seed + i) % 3), questionCount: i === 0 ? 5 : 10 },
      { key: "reinforcement", studentsAssigned: 4 + ((seed + i) % 3), questionCount: 5 },
      { key: "risk", studentsAssigned: 2 + ((seed + i) % 3), questionCount: 5 },
    ].map(b => ({
      ...b,
      label: bandLabels[b.key],
      completedCount: Math.max(0, b.studentsAssigned - ((seed + i) % 3)),
      avgAccuracy: 30 + ((seed * (i + 1) * b.key.charCodeAt(0)) % 55),
    }));

    return {
      id: `practice-${chapterId}-${batchId}-${i}`,
      createdAt: date.toISOString().split("T")[0],
      chapterId,
      batchId,
      totalQuestions: bands.reduce((s, b) => s + b.questionCount, 0),
      bands,
    };
  });
};

const cache = new Map<string, PracticeSession[]>();

export const getPracticeHistory = (chapterId: string, batchId: string): PracticeSession[] => {
  const key = `${chapterId}__${batchId}`;
  if (!cache.has(key)) {
    cache.set(key, generateSessions(chapterId, batchId));
  }
  return cache.get(key)!;
};
