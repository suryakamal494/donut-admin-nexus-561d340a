// Homework context builder — injects pending homework & teacher assignments into system prompt
import { studentHomework, type Homework, getHomeworkUrgency } from "@/data/student/dashboard";
import { upcomingTests, type UpcomingTest } from "@/data/student/dashboard";

export function buildHomeworkContext(): string {
  const pending = studentHomework.filter((h) => h.status === "pending" || h.status === "overdue");
  if (pending.length === 0 && upcomingTests.length === 0) return "";

  let ctx = "";

  if (pending.length > 0) {
    ctx += "PENDING HOMEWORK:";
    for (const h of pending) {
      const urgency = getHomeworkUrgency(h.dueDate);
      const urgencyLabel = urgency === "urgent" ? " ⚠️ DUE TODAY" : urgency === "soon" ? " (due soon)" : "";
      ctx += `\n  - ${h.subject}: ${h.title}${urgencyLabel}`;
    }
  }

  if (upcomingTests.length > 0) {
    ctx += "\n\nUPCOMING TESTS:";
    for (const t of upcomingTests) {
      const date = new Date(t.date);
      const daysAway = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const urgency = daysAway <= 2 ? " ⚠️ VERY SOON" : daysAway <= 5 ? " (coming up)" : "";
      ctx += `\n  - ${t.subject}: ${t.title} (${t.type}) — ${daysAway > 0 ? `in ${daysAway} days` : "today"}${urgency}`;
    }
    ctx += "\n\nWhen generating study plans or practice, prioritize topics covered in upcoming tests.";
  }

  return ctx;
}

export function getUrgentHomework(): Homework[] {
  return studentHomework.filter(
    (h) => (h.status === "pending" || h.status === "overdue") && getHomeworkUrgency(h.dueDate) === "urgent"
  );
}

export function getUpcomingTestsForSubject(subject: string): UpcomingTest[] {
  return upcomingTests.filter((t) => t.subject.toLowerCase() === subject.toLowerCase());
}