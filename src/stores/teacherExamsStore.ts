// Lightweight session store for teacher exams.
// Wraps the existing mock `teacherExams` so that when Copilot publishes a
// generated test, it appears on the Tests page for the rest of the session.
//
// No external deps — a tiny pub/sub. Promote to Supabase when the real
// `teacher_exams` table is introduced.

import { useEffect, useSyncExternalStore } from "react";
import { teacherExams as seedExams } from "@/data/teacher/exams";
import type { TeacherExam } from "@/data/teacher/types";

let exams: TeacherExam[] = [...seedExams];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot() {
  return exams;
}

export function useTeacherExams(): TeacherExam[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getTeacherExams(): TeacherExam[] {
  return exams;
}

export function addTeacherExam(exam: TeacherExam) {
  // Prevent duplicate publish for the same source
  if (exams.some((e) => e.id === exam.id)) return;
  exams = [exam, ...exams];
  emit();
}

export function updateTeacherExam(id: string, patch: Partial<TeacherExam>) {
  exams = exams.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e));
  emit();
}

export function removeTeacherExam(id: string) {
  exams = exams.filter((e) => e.id !== id);
  emit();
}

export function getExamByCopilotArtifactId(artifactId: string): TeacherExam | undefined {
  return exams.find((e) => e.id === `copilot-${artifactId}`);
}

// --- Tracking which Copilot artifacts have been published (for badge/dedupe) ---

const publishedArtifactIds = new Set<string>();
const publishedListeners = new Set<() => void>();

function emitPublished() {
  for (const l of publishedListeners) l();
}

export function markArtifactPublished(artifactId: string) {
  publishedArtifactIds.add(artifactId);
  emitPublished();
}

export function isArtifactPublished(artifactId: string): boolean {
  return publishedArtifactIds.has(artifactId);
}

export function useIsArtifactPublished(artifactId: string | null): boolean {
  return useSyncExternalStore(
    (l) => {
      publishedListeners.add(l);
      return () => {
        publishedListeners.delete(l);
      };
    },
    () => (artifactId ? publishedArtifactIds.has(artifactId) : false),
    () => false
  );
}

// Convert a Copilot test artifact into a TeacherExam record for the Tests page.
export interface CopilotTestArtifact {
  id: string; // rp_artifacts.id
  title: string;
  batchId: string; // rp_batches.id (source)
  content: any; // The enriched test JSON
  subject?: string; // From rp_batches.subject
}

export function publishCopilotTestArtifact(art: CopilotTestArtifact): TeacherExam {
  const c = art.content ?? {};
  const questions: any[] = Array.isArray(c.questions) ? c.questions : [];

  // Map current rp_batches.id → existing teacherExams batch ids when possible.
  // Fall back to a generic placeholder so the exam is still listed.
  const fallbackBatchId = "batch-10a";

  const exam: TeacherExam = {
    id: `copilot-${art.id}`,
    name: art.title || "Untitled (from Copilot)",
    subjects: art.subject ? [art.subject] : ["General"],
    pattern: (c.pattern as TeacherExam["pattern"]) ?? "custom",
    uiType: "platform",
    totalQuestions: questions.length || c.total_questions || 0,
    totalMarks: c.total_marks ?? questions.reduce((s, q) => s + (Number(q.marks) || 0), 0),
    duration: c.duration_minutes ?? 60,
    negativeMarking: !!c.negative_marking,
    negativeMarks: c.negative_marks ?? 0,
    creationMethod: "ai",
    batchIds: [fallbackBatchId],
    status: "draft",
    questionIds: questions.map((_, i) => `copilot-${art.id}-q${i + 1}`),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  addTeacherExam(exam);
  markArtifactPublished(art.id);
  return exam;
}

// Re-emit on mount so the Tests page picks up our cached set even after a
// hard remount (the module is the source of truth).
export function useRefreshOnMount() {
  useEffect(() => {
    emit();
  }, []);
}
