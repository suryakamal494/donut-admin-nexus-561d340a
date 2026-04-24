// Copilot Archive Sweep — implements Rule 8 (auto-archive) server-side.
// Mirrors the client-side sweep in `sessionRouter.archiveStaleThreads` so it
// can be invoked manually or scheduled later.
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// TTLs per tool (matches Rule 8 in copilot-session-continuity.md)
const TOOL_TTL_DAYS: Record<string, number> = {
  practice: 14,
  doubt: 7,
  plan: 0,    // archive past plan_window.end_date — handled below
  exam: 0,    // archive past exam_date — handled below
  debrief: -1, // never auto-archive
  progress: 7,
};

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get("student_id");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const archived: Record<string, number> = {};

    // 1. Time-based sweep (practice / doubt / progress)
    for (const [tool, ttl] of Object.entries(TOOL_TTL_DAYS)) {
      if (ttl <= 0) continue;
      const cutoff = daysAgoIso(ttl);
      let q = supabase
        .from("student_copilot_threads")
        .update({ status: "archived", archived_at: new Date().toISOString() })
        .eq("tool", tool)
        .eq("status", "active")
        .lt("last_activity_at", cutoff)
        .select("id");
      if (studentId) q = q.eq("student_id", studentId);
      const { data, error } = await q;
      if (error) {
        console.error(`Sweep ${tool} failed:`, error.message);
        continue;
      }
      archived[tool] = (data ?? []).length;
    }

    // 2. Plan-window sweep — archive plan threads whose end_date is past.
    const today = new Date().toISOString().slice(0, 10);
    let planQ = supabase
      .from("student_copilot_threads")
      .select("id, scope_meta")
      .eq("tool", "plan")
      .eq("status", "active");
    if (studentId) planQ = planQ.eq("student_id", studentId);
    const { data: plans } = await planQ;
    const stalePlanIds = (plans ?? [])
      .filter((p: any) => {
        const end = p?.scope_meta?.plan_window?.end_date;
        return typeof end === "string" && end < today;
      })
      .map((p: any) => p.id);
    if (stalePlanIds.length > 0) {
      await supabase
        .from("student_copilot_threads")
        .update({ status: "archived", archived_at: new Date().toISOString() })
        .in("id", stalePlanIds);
      archived.plan = (archived.plan ?? 0) + stalePlanIds.length;
    }

    // 3. Exam sweep — past exam_date.
    let examQ = supabase
      .from("student_copilot_threads")
      .select("id, scope_meta")
      .eq("tool", "exam")
      .eq("status", "active");
    if (studentId) examQ = examQ.eq("student_id", studentId);
    const { data: exams } = await examQ;
    const staleExamIds = (exams ?? [])
      .filter((e: any) => {
        const d = e?.scope_meta?.exam_date;
        return typeof d === "string" && d < today;
      })
      .map((e: any) => e.id);
    if (staleExamIds.length > 0) {
      await supabase
        .from("student_copilot_threads")
        .update({ status: "archived", archived_at: new Date().toISOString() })
        .in("id", staleExamIds);
      archived.exam = (archived.exam ?? 0) + staleExamIds.length;
    }

    return new Response(
      JSON.stringify({ ok: true, archived }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Archive sweep error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});