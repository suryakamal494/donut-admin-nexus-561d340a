// Context module — aggregates all context builders for the student copilot
export { buildTimetableContext, getTodaySubjects, getCurrentChapter } from "./timetableContext";
export { buildBandContext, getWeakestTopics } from "./bandContext";
export { buildHomeworkContext, getUrgentHomework, getUpcomingTestsForSubject } from "./homeworkContext";

import { studentProfile } from "@/data/student/profile";
import { buildTimetableContext } from "./timetableContext";
import { buildBandContext } from "./bandContext";
import { buildHomeworkContext } from "./homeworkContext";
import type { TopicMastery } from "../types";

/**
 * Build the complete student context string for the system prompt.
 * This is sent with every chat request so the AI knows the student's full situation.
 */
export function buildFullStudentContext(mastery: TopicMastery[]): string {
  const p = studentProfile;
  const sections: string[] = [];

  // Basic profile
  sections.push(`STUDENT CONTEXT:
- Name: ${p.name}
- Grade: ${p.grade}
- Current streak: ${p.streak} days`);

  // Timetable
  const timetable = buildTimetableContext();
  if (timetable) sections.push(timetable);

  // Mastery / band data
  const band = buildBandContext(mastery);
  if (band) sections.push(band);

  // Homework & upcoming tests
  const homework = buildHomeworkContext();
  if (homework) sections.push(homework);

  return sections.join("\n\n");
}