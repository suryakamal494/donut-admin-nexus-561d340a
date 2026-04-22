// One-time idempotent seeder for Student Copilot mock data
import { supabase } from "@/integrations/supabase/client";
import {
  MOCK_ROUTINES,
  MOCK_THREADS,
  MOCK_MESSAGES,
  MOCK_ARTIFACTS,
  MOCK_NOTIFICATIONS,
  MOCK_ATTEMPTS,
  MOCK_EXAMS,
} from "@/data/student/copilotMockData";

const SEED_KEY = "copilot_mock_seeded_v3";

/** Throws on DB error so the caller can abort seeding */
async function insertOrSkip(
  table: string,
  data: any[],
  label: string
): Promise<void> {
  const { error } = await supabase.from(table as any).insert(data);
  if (error) {
    // 23505 = unique_violation → data already exists, not a real error
    if (error.code === "23505") return;
    throw new Error(`Seed ${label}: ${error.message}`);
  }
}

export async function seedCopilotDataIfNeeded(): Promise<void> {
  // Clear stale v1/v2 keys so we re-seed with fixed UUIDs
  localStorage.removeItem("copilot_mock_seeded_v1");
  localStorage.removeItem("copilot_mock_seeded_v2");

  if (localStorage.getItem(SEED_KEY) === "true") return;

  try {
    // 1. Routines — check first
    const { data: existingRoutines } = await supabase
      .from("rp_routines")
      .select("key")
      .eq("audience", "student")
      .limit(1);

    if (!existingRoutines || existingRoutines.length === 0) {
      await insertOrSkip("rp_routines", MOCK_ROUTINES as any[], "routines");
    }

    // 2. Threads — check first
    const { data: existingThreads } = await supabase
      .from("student_copilot_threads")
      .select("id")
      .eq("student_id", "student-001")
      .limit(1);

    if (!existingThreads || existingThreads.length === 0) {
      await insertOrSkip("student_copilot_threads", MOCK_THREADS as any[], "threads");
      await insertOrSkip("student_copilot_messages", MOCK_MESSAGES as any[], "messages");
      await insertOrSkip("student_copilot_artifacts", MOCK_ARTIFACTS as any[], "artifacts");
      await insertOrSkip("student_notifications", MOCK_NOTIFICATIONS as any[], "notifications");
    }

    // 3. Attempts — for mastery view
    const { data: existingAttempts } = await supabase
      .from("student_attempts")
      .select("id")
      .eq("student_id", "student-001")
      .limit(1);

    if (!existingAttempts || existingAttempts.length === 0) {
      await insertOrSkip("student_attempts", MOCK_ATTEMPTS as any[], "attempts");
    }

    // 4. Exams
    const { data: existingExams } = await supabase
      .from("student_exams")
      .select("id")
      .eq("student_id", "student-001")
      .limit(1);

    if (!existingExams || existingExams.length === 0) {
      await insertOrSkip("student_exams", MOCK_EXAMS as any[], "exams");
    }

    // Only mark as seeded if we got here without throwing
    localStorage.setItem(SEED_KEY, "true");
    console.log("✅ Copilot mock data seeded successfully");
  } catch (err) {
    console.error("❌ Copilot seeder error (will retry next load):", err);
    // Do NOT set localStorage — allows retry on next page load
  }
}