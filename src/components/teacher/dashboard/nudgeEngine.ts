import type { TeacherTimetableSlot } from "@/data/teacher/types";

export type NudgeRoutineKey = "lesson_prep" | "homework" | "test_creation" | "reports";

export interface SmartNudge {
  id: string;
  priority: number; // lower = shown first
  icon: "plan" | "remediate" | "homework" | "prep" | "continue";
  title: string;
  context: string;
  ctaLabel: string;
  routineKey: NudgeRoutineKey;
  batchId?: string | null;
  // Soft metadata for future deep-link prefill (logged when nudge fires).
  meta?: Record<string, string>;
}

export interface NudgeEngineInput {
  todayTimetable: TeacherTimetableSlot[];
  pastUnconfirmedCount: number;
  // Optional: low-scoring recent quiz (rules engine v1 expects callers to pass these).
  recentLowScoreQuiz?: {
    name: string;
    avgPercent: number;
    strugglingCount: number;
    examId?: string;
  } | null;
  // Optional: a chapter that is upcoming tomorrow but barely covered.
  underCoveredUpcomingChapter?: {
    chapterName: string;
    coveragePercent: number;
  } | null;
}

/**
 * Lightweight rules engine. No LLM calls — purely structural reads of the
 * teacher's day. The LLM only runs once the teacher *accepts* a nudge and
 * lands inside the Copilot.
 *
 * Priority order (lowest number first):
 *   1. Missing lesson plan for an upcoming class today
 *   2. Recent low-scoring quiz needs remediation
 *   3. Confirmed class still missing homework
 *   4. Tomorrow's chapter under-covered → prep brief
 *
 * Caller decides how many to display (we recommend 2 max).
 */
export function generateSmartNudges(input: NudgeEngineInput): SmartNudge[] {
  const nudges: SmartNudge[] = [];
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  // 1. Upcoming class today with NO lesson plan
  const upcomingNoPlan = input.todayTimetable.find(
    (slot) => currentTime < slot.startTime && !slot.hasLessonPlan,
  );
  if (upcomingNoPlan) {
    nudges.push({
      id: `nudge-plan-${upcomingNoPlan.id}`,
      priority: 1,
      icon: "plan",
      title: `Draft plan for ${upcomingNoPlan.subject} P${upcomingNoPlan.periodNumber}`,
      context: `${upcomingNoPlan.batchName} • ${upcomingNoPlan.startTime} • no plan yet`,
      ctaLabel: "Generate ✨",
      routineKey: "lesson_prep",
      batchId: upcomingNoPlan.batchId,
      meta: {
        topic: upcomingNoPlan.topic ?? "",
        slotId: upcomingNoPlan.id,
      },
    });
  }

  // 2. Remediation for a low-scoring recent quiz
  if (
    input.recentLowScoreQuiz &&
    input.recentLowScoreQuiz.avgPercent < 60 &&
    input.recentLowScoreQuiz.strugglingCount > 0
  ) {
    const q = input.recentLowScoreQuiz;
    nudges.push({
      id: `nudge-remediate-${q.examId ?? q.name}`,
      priority: 2,
      icon: "remediate",
      title: `Remediate ${q.name}`,
      context: `Avg ${q.avgPercent}% • ${q.strugglingCount} students struggled`,
      ctaLabel: "Draft worksheet ✨",
      routineKey: "homework",
      meta: {
        examId: q.examId ?? "",
        intent: "remediation",
      },
    });
  }

  // 3. Confirmed-but-no-homework signal (proxy: 2+ past confirmations sitting today)
  if (input.pastUnconfirmedCount >= 2) {
    const lastPast = [...input.todayTimetable]
      .reverse()
      .find((slot) => currentTime >= slot.endTime);
    if (lastPast) {
      nudges.push({
        id: `nudge-hw-${lastPast.id}`,
        priority: 3,
        icon: "homework",
        title: `Assign homework for ${lastPast.subject}`,
        context: `${lastPast.batchName} just finished • lock in practice`,
        ctaLabel: "Create homework ✨",
        routineKey: "homework",
        batchId: lastPast.batchId,
        meta: {
          topic: lastPast.topic ?? "",
        },
      });
    }
  }

  // 4. Tomorrow's chapter under-covered → prep brief
  if (
    input.underCoveredUpcomingChapter &&
    input.underCoveredUpcomingChapter.coveragePercent < 40
  ) {
    const c = input.underCoveredUpcomingChapter;
    nudges.push({
      id: `nudge-prep-${c.chapterName}`,
      priority: 4,
      icon: "prep",
      title: `Prep brief for ${c.chapterName}`,
      context: `Class tomorrow • only ${c.coveragePercent}% covered so far`,
      ctaLabel: "Open brief ✨",
      routineKey: "lesson_prep",
      meta: {
        chapter: c.chapterName,
        intent: "prep_brief",
      },
    });
  }

  // Fallback: nothing fired → "continue from where you left off"
  if (nudges.length === 0) {
    nudges.push({
      id: "nudge-continue",
      priority: 99,
      icon: "continue",
      title: "Continue with Copilot",
      context: "Pick up your last lesson prep thread",
      ctaLabel: "Resume",
      routineKey: "lesson_prep",
    });
  }

  return nudges.sort((a, b) => a.priority - b.priority);
}

/** Local-storage key per-day for dismissed nudges. */
export function nudgeDismissalKey() {
  const d = new Date();
  return `teacher.nudges.dismissed.${d.toISOString().slice(0, 10)}`;
}

export function getDismissedNudgeIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(nudgeDismissalKey());
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function dismissNudgeId(id: string) {
  if (typeof window === "undefined") return;
  const set = getDismissedNudgeIds();
  set.add(id);
  window.localStorage.setItem(
    nudgeDismissalKey(),
    JSON.stringify(Array.from(set)),
  );
}