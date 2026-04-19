import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Routine } from "./types";

interface RecentArtifact {
  id: string;
  type: string;
  title: string;
  created_at: string;
}

/**
 * Build context-aware suggestion chips based on the most recent
 * artifacts for the current batch+routine. Falls back to the
 * routine's static quick_start_chips when there's nothing recent.
 */
export function useDynamicChips(
  batchId: string | null,
  routine: Routine | null
): string[] {
  const [recent, setRecent] = useState<RecentArtifact[]>([]);

  useEffect(() => {
    if (!batchId) {
      setRecent([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("rp_artifacts")
        .select("id,type,title,created_at")
        .eq("batch_id", batchId)
        .order("created_at", { ascending: false })
        .limit(3);
      if (!cancelled) setRecent((data ?? []) as RecentArtifact[]);
    };
    load();
    const channel = supabase
      .channel(`rp_chips_${batchId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rp_artifacts", filter: `batch_id=eq.${batchId}` },
        () => load()
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [batchId]);

  if (!routine) return [];

  const fallback = routine.quick_start_chips ?? [];
  if (!recent.length) return fallback;

  const chips: string[] = [];
  const last = recent[0];
  const truncate = (s: string, n = 28) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

  // Routine-specific dynamic chips based on the most recent artifact
  switch (routine.key) {
    case "test_creation": {
      const lastTest = recent.find((r) => r.type === "test");
      if (lastTest) {
        chips.push(`Refine "${truncate(lastTest.title)}"`);
        chips.push(`Add 5 more MCQs to "${truncate(lastTest.title, 20)}"`);
        chips.push(`Make "${truncate(lastTest.title, 20)}" harder`);
      }
      break;
    }
    case "lesson_prep": {
      const lastLesson = recent.find((r) => r.type === "lesson_plan");
      if (lastLesson) {
        chips.push(`Refine "${truncate(lastLesson.title)}"`);
        chips.push(`Create slides for "${truncate(lastLesson.title, 20)}"`);
      }
      break;
    }
    case "homework": {
      const lastHw = recent.find((r) => r.type === "homework" || r.type === "banded_homework");
      if (lastHw) {
        chips.push(`Refine "${truncate(lastHw.title)}"`);
        chips.push(`Schedule "${truncate(lastHw.title, 20)}" for tomorrow`);
      }
      break;
    }
    case "ppt_creation":
    case "ppt": {
      const lastPpt = recent.find((r) => r.type === "ppt");
      if (lastPpt) {
        chips.push(`Add 3 slides to "${truncate(lastPpt.title, 20)}"`);
      }
      break;
    }
    default: {
      chips.push(`Continue from "${truncate(last.title)}"`);
    }
  }

  // Always include 1-2 fallback prompts so the row isn't only "refine X"
  for (const f of fallback) {
    if (chips.length >= 4) break;
    if (!chips.includes(f)) chips.push(f);
  }

  return chips.slice(0, 4);
}
