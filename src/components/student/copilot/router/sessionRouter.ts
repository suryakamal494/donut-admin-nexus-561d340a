// Student Copilot — Session Router
// Canonical reference: docs/04-student/copilot-session-continuity.md
//
// Single entry point that decides whether an incoming chat message belongs to
// an existing thread (Tool + Scope match) or needs a new thread. Students never
// pick a thread — this module makes that choice silently.

import { supabase } from "@/integrations/supabase/client";
import { classifySubject } from "../chatHelpers";
import { createThread } from "../api";
import {
  ROUTER_TOOLS,
  TOOL_TO_ROUTINE,
  type RouterTool,
  type RouteDecision,
  type StudentThread,
} from "../types";

// ---------- Intent classification ----------

const INTENT_KEYWORDS: Record<RouterTool, string[]> = {
  practice: [
    "practice", "quiz", "questions", "mcq", "drill", "test me", "exercises",
    "problems", "solve more", "give me questions", "let me practice",
  ],
  plan: [
    "study plan", "roadmap", "schedule", "weekly plan", "this week", "next week",
    "plan my", "help me plan", "study schedule", "timetable",
  ],
  exam: [
    "exam prep", "prepare for", "jee", "neet", "boards", "board exam", "target",
    "exam target", "main 2026", "advanced 2026", "competitive",
  ],
  debrief: [
    "debrief", "test result", "where did i go wrong", "review my test", "review my paper",
    "analyze my test", "mistakes in test",
  ],
  progress: [
    "my progress", "how am i doing", "weak topics", "mastery", "report card",
    "my performance", "weekly progress", "insights",
  ],
  doubt: [
    "explain", "what is", "how does", "why does", "doubt", "concept", "formula",
    "derive", "prove", "meaning of",
  ],
};

/**
 * Classify the student's intent → which Tool the message invokes.
 * Keyword scoring; falls back to `doubt` (the default chat behaviour).
 */
export function classifyIntent(text: string): { tool: RouterTool; confidence: number } {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const tool of ROUTER_TOOLS) {
    scores[tool] = 0;
    for (const kw of INTENT_KEYWORDS[tool]) {
      if (lower.includes(kw)) scores[tool] += 1;
    }
  }
  const sorted = ROUTER_TOOLS.slice().sort((a, b) => scores[b] - scores[a]);
  const best = sorted[0];
  const second = sorted[1];
  const top = scores[best];
  if (top === 0) return { tool: "doubt", confidence: 0.4 };
  // Confidence: how dominant the top intent is over the runner-up.
  const margin = top - scores[second];
  const confidence = Math.min(1, 0.5 + 0.15 * top + 0.1 * margin);
  return { tool: best, confidence };
}

// ---------- Scope extraction ----------

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function detectChapter(text: string): string | null {
  // Lightweight chapter detection. Looks for "chapter X", "ch X", or known
  // chapter names embedded in the prompt (e.g. "Newton's Laws").
  const lower = text.toLowerCase();
  const chMatch = lower.match(/(?:chapter|ch\.?)\s*(\d+|[a-z][a-z0-9' \-]{2,40})/);
  if (chMatch) return chMatch[1].trim();
  // Heuristic: pull the noun-phrase after "on " or "about ".
  const onMatch = lower.match(/\b(?:on|about|of|for)\s+([a-z][a-z'\- ]{2,40})/);
  if (onMatch) return onMatch[1].trim().split(/\s+/).slice(0, 4).join(" ");
  return null;
}

function detectExamId(text: string): string | null {
  const lower = text.toLowerCase();
  const candidates: Array<[RegExp, string]> = [
    [/jee\s*main\s*(\d{4})?/, "jee-main"],
    [/jee\s*advanced\s*(\d{4})?/, "jee-advanced"],
    [/\bneet\s*(\d{4})?/, "neet"],
    [/\bboards?\s*(\d{4})?/, "boards"],
  ];
  for (const [re, base] of candidates) {
    const m = lower.match(re);
    if (m) return m[1] ? `${base}-${m[1]}` : base;
  }
  return null;
}

function currentWeekKey(): string {
  // ISO week starting Monday, format: YYYY-Www
  const d = new Date();
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export interface ExtractScopeContext {
  /** Current subject filter, used as a fallback when text has no subject hint. */
  fallbackSubject?: string | null;
  /** Optional explicit hints from a deep-link (e.g. exam_id, attempt_id). */
  hints?: { examId?: string; attemptId?: string; planWindow?: string };
}

/**
 * Compute a deterministic scope_key + structured scope_meta for the message.
 * The scope_key is the unit of session identity (see Rule 2 in the doc).
 */
export function extractScope(
  text: string,
  tool: RouterTool,
  ctx: ExtractScopeContext = {}
): { scopeKey: string; scopeMeta: Record<string, any> } {
  const subject = classifySubject(text) ?? ctx.fallbackSubject ?? null;
  const subjectSlug = subject ? slugify(subject) : "general";

  switch (tool) {
    case "practice": {
      const chapter = detectChapter(text);
      const chapterSlug = chapter ? slugify(chapter) : "general";
      return {
        scopeKey: `practice:${subjectSlug}:${chapterSlug}`,
        scopeMeta: { subject, chapter },
      };
    }
    case "doubt": {
      const chapter = detectChapter(text);
      const chapterSlug = chapter ? slugify(chapter) : "general";
      // Doubts cluster by subject+chapter for the same week so a "follow-up
      // doubt later today" lands on the same thread.
      const week = currentWeekKey();
      return {
        scopeKey: `doubt:${subjectSlug}:${chapterSlug}:${week}`,
        scopeMeta: { subject, chapter, week },
      };
    }
    case "plan": {
      const week = ctx.hints?.planWindow ?? currentWeekKey();
      return {
        scopeKey: `plan:${week}`,
        scopeMeta: { plan_window: week },
      };
    }
    case "exam": {
      const examId = ctx.hints?.examId ?? detectExamId(text) ?? "general";
      return {
        scopeKey: `exam:${slugify(examId)}`,
        scopeMeta: { exam_id: examId },
      };
    }
    case "debrief": {
      const attemptId = ctx.hints?.attemptId ?? "latest";
      return {
        scopeKey: `debrief:${slugify(attemptId)}`,
        scopeMeta: { attempt_id: attemptId },
      };
    }
    case "progress": {
      const week = currentWeekKey();
      return {
        scopeKey: `progress:${week}`,
        scopeMeta: { week },
      };
    }
  }
}

// ---------- DB lookup ----------

export async function findActiveSession(
  studentId: string,
  tool: RouterTool,
  scopeKey: string
): Promise<StudentThread | null> {
  const { data } = await supabase
    .from("student_copilot_threads" as any)
    .select("*")
    .eq("student_id", studentId)
    .eq("tool", tool)
    .eq("scope_key", scopeKey)
    .eq("status", "active")
    .order("last_activity_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as unknown as StudentThread) ?? null;
}

async function logDecision(args: {
  studentId: string;
  messagePreview: string;
  tool: RouterTool;
  scopeKey: string;
  decision: "matched" | "new";
  threadId: string;
  confidence: number;
}): Promise<void> {
  await supabase.from("router_decisions" as any).insert({
    student_id: args.studentId,
    message_preview: args.messagePreview.slice(0, 120),
    tool: args.tool,
    scope_key: args.scopeKey,
    decision: args.decision,
    thread_id: args.threadId,
    confidence: args.confidence,
  } as any);
}

// ---------- The orchestrator ----------

export interface RouteContext extends ExtractScopeContext {
  studentId: string;
  /** Force-create a new thread instead of matching (escape hatch). */
  forceNew?: boolean;
}

/**
 * The single entry point used by the chat. Given a message + context, returns
 * the thread to use (existing or freshly created) and a route decision payload
 * the UI can render as a continuation banner.
 */
export async function route(
  text: string,
  ctx: RouteContext
): Promise<RouteDecision> {
  const { tool, confidence } = classifyIntent(text);
  const { scopeKey, scopeMeta } = extractScope(text, tool, ctx);

  // Force-new bypass: skip the lookup and go straight to creation.
  if (!ctx.forceNew) {
    const existing = await findActiveSession(ctx.studentId, tool, scopeKey);
    if (existing) {
      // Touch last_activity_at so it stays "active".
      await supabase
        .from("student_copilot_threads" as any)
        .update({ last_activity_at: new Date().toISOString() } as any)
        .eq("id", existing.id);
      await logDecision({
        studentId: ctx.studentId,
        messagePreview: text,
        tool,
        scopeKey,
        decision: "matched",
        threadId: existing.id,
        confidence,
      });
      return {
        threadId: existing.id,
        isNew: false,
        tool,
        scopeKey,
        scopeMeta,
        matchedThreadTitle: existing.title,
        confidence,
      };
    }
  }

  // Create fresh thread tagged with tool + scope.
  const routineKey = TOOL_TO_ROUTINE[tool];
  const title = text.slice(0, 60).trim() || "New chat";
  const thread = await createThread(
    ctx.studentId,
    routineKey,
    title,
    scopeMeta.subject ?? ctx.fallbackSubject ?? null
  );
  if (!thread) {
    throw new Error("Router: failed to create thread");
  }

  // Tag the new thread with router metadata.
  await supabase
    .from("student_copilot_threads" as any)
    .update({
      tool,
      scope_key: scopeKey,
      scope_meta: scopeMeta,
      status: "active",
      last_activity_at: new Date().toISOString(),
    } as any)
    .eq("id", thread.id);

  await logDecision({
    studentId: ctx.studentId,
    messagePreview: text,
    tool,
    scopeKey,
    decision: "new",
    threadId: thread.id,
    confidence,
  });

  return {
    threadId: thread.id,
    isNew: true,
    tool,
    scopeKey,
    scopeMeta,
    confidence,
  };
}

// ---------- Lifecycle sweep ----------

/**
 * Auto-archive threads per Rule 8 thresholds. Safe to run on every page load —
 * it's a single update statement.
 */
export async function archiveStaleThreads(studentId: string): Promise<void> {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const cutoffs: Record<RouterTool, number> = {
    practice: now - 14 * day,
    doubt: now - 7 * day,
    plan: now - 30 * day, // also handled per-window where possible
    exam: now - 1 * day, // archived only after exam_date — see TODO
    debrief: now - 365 * day, // effectively never
    progress: now - 7 * day,
  };
  for (const tool of ROUTER_TOOLS) {
    await supabase
      .from("student_copilot_threads" as any)
      .update({
        status: "archived",
        archived_at: new Date().toISOString(),
      } as any)
      .eq("student_id", studentId)
      .eq("tool", tool)
      .eq("status", "active")
      .lt("last_activity_at", new Date(cutoffs[tool]).toISOString());
  }
}