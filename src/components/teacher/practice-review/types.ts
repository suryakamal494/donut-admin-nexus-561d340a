import type { ChapterTopicAnalysis } from "@/data/teacher/reportsData";

export interface GeneratedQuestion {
  id: string;
  text: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  difficulty: string;
  topic: string;
}

export interface BandResult {
  questions: GeneratedQuestion[];
  error?: string;
}

export interface BandItem {
  key: string;
  label: string;
  count: number;
}

export const allBandKeys = ["mastery", "stable", "reinforcement", "risk"] as const;

export const bandMeta: Record<string, { label: string; dot: string; bg: string; tabBg: string; border: string; context: (topics: ChapterTopicAnalysis[]) => string }> = {
  mastery: {
    label: "Mastery Ready", dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800",
    tabBg: "data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/40",
    context: (topics) => `Strong in all topics. Challenge with advanced/application-based questions. Strong topics: ${topics.filter(t => t.status === "strong").map(t => t.topicName).join(", ") || "all"}`,
  },
  stable: {
    label: "Stable Progress", dot: "bg-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800",
    tabBg: "data-[state=active]:bg-teal-100 dark:data-[state=active]:bg-teal-900/40",
    context: (topics) => `Good understanding, needs reinforcement. Focus: ${topics.filter(t => t.status === "moderate").map(t => t.topicName).join(", ") || "general review"}`,
  },
  reinforcement: {
    label: "Reinforcement", dot: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800",
    tabBg: "data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/40",
    context: (topics) => {
      const weak = topics.filter(t => t.status === "weak").map(t => t.topicName);
      const mod = topics.filter(t => t.status === "moderate").map(t => t.topicName);
      return `Needs practice on fundamentals. Weak in: ${[...weak, ...mod].join(", ") || "multiple topics"}. Use easy-to-medium difficulty.`;
    },
  },
  risk: {
    label: "Foundational Risk", dot: "bg-red-500", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800",
    tabBg: "data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/40",
    context: (topics) => {
      const weak = topics.filter(t => t.status === "weak").map(t => t.topicName);
      return `At risk — foundational gaps. Weak in: ${weak.join(", ") || "most topics"}. Generate easy conceptual questions.`;
    },
  },
};
