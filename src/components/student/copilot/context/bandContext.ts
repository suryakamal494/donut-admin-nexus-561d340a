// Band context builder — injects student mastery band info into system prompt
// Uses existing progressData for subject summaries and mastery info
import { getSubjectSummaries, getStudentOverview, type SubjectSummary } from "@/data/student/progressData";
import type { TopicMastery, MasteryBand } from "../types";

const BAND_DESCRIPTIONS: Record<MasteryBand, string> = {
  mastery_ready: "strong — understands well, ready for challenging problems",
  stable: "stable — good grasp, needs occasional reinforcement",
  reinforcement: "needs reinforcement — gaps exist, focus on building understanding",
  foundational_risk: "foundational risk — significant gaps, needs careful scaffolding",
  unknown: "not yet assessed",
};

export function buildBandContext(mastery: TopicMastery[]): string {
  if (mastery.length === 0) {
    // Fall back to progressData subject summaries
    return buildBandContextFromProgress();
  }

  // Group by subject
  const bySubject = new Map<string, TopicMastery[]>();
  for (const m of mastery) {
    const list = bySubject.get(m.subject) ?? [];
    list.push(m);
    bySubject.set(m.subject, list);
  }

  let ctx = "STUDENT MASTERY PROFILE (do NOT reveal band labels to the student):";

  for (const [subject, topics] of bySubject) {
    ctx += `\n\n${subject}:`;
    for (const t of topics) {
      const desc = BAND_DESCRIPTIONS[t.band] ?? BAND_DESCRIPTIONS.unknown;
      ctx += `\n  - ${t.topic}: ${t.accuracy}% accuracy (${t.attempts} attempts) — ${desc}`;
    }
  }

  // Weakest 3 topics
  const sorted = [...mastery].sort((a, b) => a.accuracy - b.accuracy);
  const weakest = sorted.slice(0, 3);
  if (weakest.length > 0) {
    ctx += "\n\nWEAKEST TOPICS (prioritize 60-70% of practice here):";
    for (const w of weakest) {
      ctx += `\n  - ${w.subject}/${w.topic}: ${w.accuracy}%`;
    }
  }

  return ctx;
}

function buildBandContextFromProgress(): string {
  try {
    const summaries = getSubjectSummaries();
    const overview = getStudentOverview();

    let ctx = `STUDENT PERFORMANCE OVERVIEW:
- Overall Accuracy: ${overview.overallAccuracy}%
- Consistency: ${overview.consistency}%
- Trend: ${overview.trend}
- Class Rank: #${overview.rank} of ${overview.totalStudents} (${overview.percentile}th percentile)`;

    ctx += "\n\nSUBJECT-WISE PERFORMANCE:";
    for (const s of summaries) {
      const band =
        s.accuracy >= 80 ? "strong" :
        s.accuracy >= 60 ? "stable" :
        s.accuracy >= 40 ? "needs reinforcement" : "foundational risk";
      ctx += `\n  - ${s.subjectName}: ${s.accuracy}% (${band}, trend: ${s.trend}, ${s.chaptersWeak} weak chapters, ${s.weakTopicCount} weak topics)`;
    }

    return ctx;
  } catch {
    return "";
  }
}

export function getWeakestTopics(mastery: TopicMastery[], count = 3): TopicMastery[] {
  return [...mastery]
    .filter((m) => m.band !== "mastery_ready" && m.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, count);
}