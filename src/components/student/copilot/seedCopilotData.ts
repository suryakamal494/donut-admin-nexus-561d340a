// One-time idempotent seeder for Student Copilot mock data
import { supabase } from "@/integrations/supabase/client";
import { MOCK_ROUTINES, MOCK_THREADS, MOCK_MESSAGES, MOCK_ARTIFACTS, MOCK_NOTIFICATIONS } from "@/data/student/copilotMockData";

const SEED_KEY = "copilot_mock_seeded_v1";

export async function seedCopilotDataIfNeeded(): Promise<void> {
  if (localStorage.getItem(SEED_KEY) === "true") return;

  try {
    // 1. Check if student routines already exist
    const { data: existingRoutines } = await supabase
      .from("rp_routines")
      .select("key")
      .eq("audience", "student")
      .limit(1);

    if (!existingRoutines || existingRoutines.length === 0) {
      // Insert routines
      const { error: rErr } = await supabase
        .from("rp_routines")
        .insert(MOCK_ROUTINES as any[]);
      if (rErr) console.warn("Seed routines error:", rErr.message);
    }

    // 2. Check if mock threads exist
    const { data: existingThreads } = await supabase
      .from("student_copilot_threads")
      .select("id")
      .eq("student_id", "student-001")
      .limit(1);

    if (!existingThreads || existingThreads.length === 0) {
      // Insert threads
      const { error: tErr } = await supabase
        .from("student_copilot_threads")
        .insert(MOCK_THREADS as any[]);
      if (tErr) console.warn("Seed threads error:", tErr.message);

      // Insert messages
      const { error: mErr } = await supabase
        .from("student_copilot_messages")
        .insert(MOCK_MESSAGES as any[]);
      if (mErr) console.warn("Seed messages error:", mErr.message);

      // Insert artifacts
      const { error: aErr } = await supabase
        .from("student_copilot_artifacts")
        .insert(MOCK_ARTIFACTS as any[]);
      if (aErr) console.warn("Seed artifacts error:", aErr.message);

      // Insert notifications
      const { error: nErr } = await supabase
        .from("student_notifications")
        .insert(MOCK_NOTIFICATIONS as any[]);
      if (nErr) console.warn("Seed notifications error:", nErr.message);
    }

    localStorage.setItem(SEED_KEY, "true");
  } catch (err) {
    console.error("Copilot seeder error:", err);
  }
}