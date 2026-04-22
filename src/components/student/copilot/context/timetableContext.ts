// Timetable context builder — injects today's schedule into system prompt
import { todaySchedule, type ScheduleItem } from "@/data/student/dashboard";

export function buildTimetableContext(): string {
  const classes = todaySchedule.filter((s) => s.type === "class" && s.subject);
  if (classes.length === 0) return "";

  const current = classes.find((c) => c.status === "current");
  const upcoming = classes.filter((c) => c.status === "upcoming");

  let ctx = "TODAY'S TIMETABLE:";
  for (const c of classes) {
    const marker =
      c.status === "current" ? " ← NOW" : c.status === "completed" ? " ✓" : "";
    ctx += `\n- ${c.time}: ${c.subject} — ${c.topic ?? ""}${c.teacher ? ` (${c.teacher})` : ""}${marker}`;
  }

  if (current) {
    ctx += `\n\nCURRENT CLASS: ${current.subject} — ${current.topic ?? ""}`;
    ctx += `\nWhen the student asks a doubt without specifying a subject, assume it's about ${current.subject} (${current.topic}).`;
  }

  if (upcoming.length > 0) {
    const next = upcoming[0];
    ctx += `\nNEXT UP: ${next.subject} — ${next.topic ?? ""} at ${next.time}`;
  }

  return ctx;
}

export function getTodaySubjects(): string[] {
  return todaySchedule
    .filter((s) => s.type === "class" && s.subject)
    .map((s) => s.subject!);
}

export function getCurrentChapter(): { subject: string; topic: string } | null {
  const current = todaySchedule.find((s) => s.status === "current" && s.type === "class");
  if (!current?.subject || !current?.topic) return null;
  return { subject: current.subject, topic: current.topic };
}