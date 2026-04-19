// RoutinePilot chat edge function — streaming SSE with tool calling
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ---------- Tool schemas ----------

const lessonPlanContentSchema = {
  type: "object",
  properties: {
    duration_minutes: { type: "number" },
    objectives: { type: "array", items: { type: "string" } },
    materials: { type: "array", items: { type: "string" } },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          minutes: { type: "number" },
          description: { type: "string" },
        },
        required: ["name", "minutes", "description"],
        additionalProperties: false,
      },
    },
    homework: { type: "string" },
  },
  required: ["duration_minutes", "objectives", "materials", "sections", "homework"],
  additionalProperties: false,
};

const pptContentSchema = {
  type: "object",
  properties: {
    topic: { type: "string" },
    total_slides: { type: "number" },
    duration_minutes: { type: "number" },
    slides: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
          speaker_notes: { type: "string" },
        },
        required: ["title", "bullets", "speaker_notes"],
        additionalProperties: false,
      },
    },
  },
  required: ["topic", "total_slides", "duration_minutes", "slides"],
  additionalProperties: false,
};

const testContentSchema = {
  type: "object",
  properties: {
    curriculum: { type: "string" },
    chapters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          topics: { type: "array", items: { type: "string" } },
        },
        required: ["name"],
      },
    },
    pattern: {
      type: "string",
      enum: ["custom", "jee_main", "jee_advanced", "neet"],
    },
    duration_minutes: { type: "number" },
    total_marks: { type: "number" },
    instructions: { type: "string" },
    negative_marking: { type: "boolean" },
    negative_marks: { type: "number" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["mcq", "short", "long"] },
          prompt: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: { type: "string" },
          marks: { type: "number" },
          chapter: { type: "string" },
          topic: { type: "string" },
          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
          cognitive_type: {
            type: "string",
            enum: ["memory", "conceptual", "logical", "analytical", "application"],
          },
        },
        required: ["type", "prompt", "marks"],
      },
    },
  },
  required: [
    "curriculum",
    "pattern",
    "duration_minutes",
    "total_marks",
    "instructions",
    "questions",
  ],
  additionalProperties: false,
};

const bandedHomeworkContentSchema = {
  type: "object",
  properties: {
    topic: { type: "string" },
    due_date: { type: "string" },
    estimated_minutes_per_band: { type: "number" },
    bands: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            enum: ["mastery_ready", "stable_progress", "reinforcement", "foundational_risk"],
          },
          label: { type: "string" },
          student_count: { type: "number" },
          instructions: { type: "string" },
          estimated_minutes: { type: "number" },
          problems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                prompt: { type: "string" },
                hint: { type: "string" },
              },
              required: ["prompt"],
            },
          },
        },
        required: ["key", "label", "student_count", "instructions", "estimated_minutes", "problems"],
      },
    },
  },
  required: ["topic", "due_date", "estimated_minutes_per_band", "bands"],
  additionalProperties: false,
};

const tools = [
  {
    type: "function",
    function: {
      name: "create_lesson_plan",
      description: "Create a structured lesson plan",
      parameters: {
        type: "object",
        properties: { title: { type: "string" }, content: lessonPlanContentSchema },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_ppt",
      description: "Create a slide deck (8-10 slides)",
      parameters: {
        type: "object",
        properties: { title: { type: "string" }, content: pptContentSchema },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_test",
      description:
        "Create a mixed-format test with rich curriculum, chapter, and per-question metadata so it can be published to the Tests page.",
      parameters: {
        type: "object",
        properties: { title: { type: "string" }, content: testContentSchema },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_homework",
      description: "Legacy flat homework. Prefer create_banded_homework.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: {
            type: "object",
            properties: {
              due_in_days: { type: "number" },
              instructions: { type: "string" },
              problems: {
                type: "array",
                items: {
                  type: "object",
                  properties: { prompt: { type: "string" }, hint: { type: "string" } },
                  required: ["prompt"],
                },
              },
            },
            required: ["due_in_days", "instructions", "problems"],
            additionalProperties: false,
          },
        },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_banded_homework",
      description:
        "Create 4-band differentiated homework: mastery_ready, stable_progress, reinforcement, foundational_risk",
      parameters: {
        type: "object",
        properties: { title: { type: "string" }, content: bandedHomeworkContentSchema },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "schedule_homework",
      description: "Schedule sending homework at a specific time/channel",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: {
            type: "object",
            properties: {
              title: { type: "string" },
              send_at: { type: "string" },
              channel: { type: "string" },
              bands: { type: "array", items: { type: "string" } },
            },
            required: ["title", "send_at", "channel"],
            additionalProperties: false,
          },
        },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
  // ---------- update_* tools (refinement loop) ----------
  {
    type: "function",
    function: {
      name: "update_test",
      description:
        "Apply the teacher's requested change to the existing test artifact and return the FULL updated test (all questions, not just the changed ones).",
      parameters: {
        type: "object",
        properties: { title: { type: "string" }, content: testContentSchema },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_lesson_plan",
      description: "Apply the requested change and return the FULL updated lesson plan.",
      parameters: {
        type: "object",
        properties: { title: { type: "string" }, content: lessonPlanContentSchema },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_ppt",
      description: "Apply the requested change and return the FULL updated slide deck.",
      parameters: {
        type: "object",
        properties: { title: { type: "string" }, content: pptContentSchema },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_banded_homework",
      description: "Apply the requested change and return the FULL updated banded homework.",
      parameters: {
        type: "object",
        properties: { title: { type: "string" }, content: bandedHomeworkContentSchema },
        required: ["title", "content"],
        additionalProperties: false,
      },
    },
  },
];

const TOOL_TO_TYPE: Record<string, string> = {
  create_lesson_plan: "lesson_plan",
  create_ppt: "ppt",
  create_test: "test",
  create_homework: "homework",
  create_banded_homework: "banded_homework",
  schedule_homework: "schedule",
};

const UPDATE_TOOL_TO_TYPE: Record<string, string> = {
  update_lesson_plan: "lesson_plan",
  update_ppt: "ppt",
  update_test: "test",
  update_banded_homework: "banded_homework",
};

// ---------- Reports routine: read-only analytics tools ----------
// These tools resolve their data from the inline `reports_context` payload
// the client sends in the request body (computed from the same generators
// the Teacher Reports pages use). The edge function does NOT invent any
// numbers — it only routes pre-computed structured data back to the chat
// as `report_data` SSE events.

const reportsTools = [
  {
    type: "function",
    function: {
      name: "get_batch_overview",
      description:
        "Returns the active batch's health summary: overall trend, recent average, at-risk count, weak topic count, and a suggested focus area. Use for 'how is the batch doing', 'overall health', 'pulse'.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "get_batch_health_summary",
      description:
        "Returns the full 'Today's Focus' card: priority topics, students to check in, suggested focus sentence. Use for 'what should I focus on today', 'today's focus', 'priority list'.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "get_recent_exams",
      description:
        "Returns the last few completed exams with class averages. Use for 'recent tests', 'last few exams', or to set up a follow-up exam analysis.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Default 5, max 8." },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_exam_analysis",
      description:
        "Deep-dive on ONE exam: verdict, performance bands, topic flags, score distribution, difficulty/cognitive mix. If exam_id is omitted, the most recent exam is used. Match exam_id from get_recent_exams.",
      parameters: {
        type: "object",
        properties: {
          exam_id: { type: "string", description: "Exam id from get_recent_exams." },
          exam_name_hint: {
            type: "string",
            description:
              "If you don't have an id but the user named the exam (e.g. 'optics test'), pass the name and we will fuzzy-match.",
          },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_question_analysis",
      description:
        "Per-question stats for an exam (correct/incorrect/unattempted, avg time, success rate, difficulty, cognitive type). Use for 'which questions tripped them up', 'question-wise breakdown'.",
      parameters: {
        type: "object",
        properties: {
          exam_id: { type: "string" },
          exam_name_hint: { type: "string" },
          weakest_only: { type: "boolean", description: "Return only weak/hard questions." },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_difficulty_analysis",
      description:
        "Easy/medium/hard accuracy + cognitive-type distribution for one exam. Use for 'easy vs hard performance', 'cognitive mix', 'difficulty breakdown'.",
      parameters: {
        type: "object",
        properties: {
          exam_id: { type: "string" },
          exam_name_hint: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_actionable_insights",
      description:
        "Reteach/practice/celebrate/attention insight cards for an exam — each carries a one-click action payload (topic, difficulty, studentIds) so the teacher can hand off to the Homework routine. Use whenever the teacher asks 'what should I do', 'what should I reteach', 'next steps'.",
      parameters: {
        type: "object",
        properties: {
          exam_id: { type: "string" },
          exam_name_hint: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_compare_exams",
      description:
        "Side-by-side delta of TWO exams: avg %, pass %, weak topics joined/dropped. Pass two exam ids OR one id and we'll compare the most recent two.",
      parameters: {
        type: "object",
        properties: {
          exam_id_a: { type: "string" },
          exam_id_b: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_chapter_health",
      description:
        "Chapter-wise success rates and weak-topic counts (sorted weakest first). Use for 'weak chapters', 'chapter health'.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "get_chapter_deep_dive",
      description:
        "ONE chapter deep-dive: topic heatmap, per-exam breakdown, 4-bucket student counts, weak-topic list. Either chapter_id OR chapter_name_hint required.",
      parameters: {
        type: "object",
        properties: {
          chapter_id: { type: "string" },
          chapter_name_hint: { type: "string", description: "e.g. 'optics', 'thermo'." },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_topic_analysis",
      description:
        "ONE topic across the batch: success rate, status, affected students. Use when the teacher names a topic ('how is Wave Optics doing', 'Doppler Effect performance').",
      parameters: {
        type: "object",
        properties: {
          topic_name_hint: { type: "string", description: "e.g. 'Wave Optics', 'Doppler'." },
          chapter_name_hint: { type: "string", description: "Optional chapter filter." },
        },
        required: ["topic_name_hint"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_at_risk_students",
      description:
        "Students in risk or reinforcement bands with PI scores. Use for 'who is at risk', 'struggling students'.",
      parameters: {
        type: "object",
        properties: { limit: { type: "number", description: "Default 8." } },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_top_performers",
      description: "Top performers by Performance Index. Default 5.",
      parameters: {
        type: "object",
        properties: { limit: { type: "number" } },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_student_search",
      description:
        "Resolve a free-text student name (e.g. 'Aarav', 'Kavya M.') to a student record. Returns up to 5 candidates ranked by name match. Call this BEFORE get_student_profile/get_compare_students whenever you only have a name.",
      parameters: {
        type: "object",
        properties: { name_hint: { type: "string" } },
        required: ["name_hint"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_student_profile",
      description:
        "Full per-student profile for the active batch: PI breakdown, chapter mastery, weak topics, difficulty/cognitive mix, exam history, suggested difficulty, AI summary. Use for 'how is X doing', 'profile of X'.",
      parameters: {
        type: "object",
        properties: {
          student_id: { type: "string" },
          name_hint: { type: "string", description: "If id is unknown." },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_compare_students",
      description:
        "Side-by-side two-student delta (PI, accuracy, weak chapters, trend, suggested difficulty). Use for 'compare X and Y'.",
      parameters: {
        type: "object",
        properties: {
          student_id_a: { type: "string" },
          student_id_b: { type: "string" },
          name_hint_a: { type: "string" },
          name_hint_b: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_chapter_search",
      description:
        "Resolve a free-text chapter name (e.g. 'optics', 'thermo') to a chapter record. Use BEFORE get_chapter_deep_dive when you only have a name.",
      parameters: {
        type: "object",
        properties: { name_hint: { type: "string" } },
        required: ["name_hint"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_multi_subject_risk",
      description:
        "Students at risk across MULTIPLE chapters/areas (proxy for 'multi-subject risk' in this single-subject batch). Use for 'students struggling in many areas', 'multi-subject risk'.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
];

const REPORTS_TOOL_NAMES = new Set(reportsTools.map((t) => t.function.name));

// ─── Fuzzy helpers ───
function norm(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function fuzzyScore(query: string, target: string): number {
  const q = norm(query);
  const t = norm(target);
  if (!q || !t) return 0;
  if (t === q) return 100;
  if (t.includes(q)) return 80 + Math.max(0, 10 - Math.abs(t.length - q.length));
  if (q.includes(t)) return 70;
  // Token overlap
  const qt = new Set(q.split(" "));
  const tt = t.split(" ");
  const hits = tt.filter((x) => qt.has(x)).length;
  if (hits === 0) return 0;
  return 30 + hits * 15;
}
function findExam(ctx: any, args: any): any | null {
  const exams = ctx?.recent_exams ?? [];
  const analyses = ctx?.exam_analyses ?? [];
  if (args.exam_id) {
    return analyses.find((a: any) => a.exam_id === args.exam_id) ?? null;
  }
  if (args.exam_name_hint) {
    const ranked = analyses
      .map((a: any) => ({ a, s: fuzzyScore(args.exam_name_hint, a.exam_name) }))
      .filter((x: any) => x.s > 0)
      .sort((x: any, y: any) => y.s - x.s);
    if (ranked[0]) return ranked[0].a;
  }
  // Default to most recent
  return analyses[0] ?? (exams[0] ? null : null);
}
function findStudent(ctx: any, idOrHint: { id?: string; hint?: string }): any | null {
  const profiles = ctx?.student_profiles ?? [];
  if (idOrHint.id) return profiles.find((p: any) => p.id === idOrHint.id) ?? null;
  if (idOrHint.hint) {
    const ranked = profiles
      .map((p: any) => ({ p, s: fuzzyScore(idOrHint.hint!, p.name) }))
      .filter((x: any) => x.s > 0)
      .sort((x: any, y: any) => y.s - x.s);
    return ranked[0]?.p ?? null;
  }
  return null;
}
function findChapter(ctx: any, idOrHint: { id?: string; hint?: string }): any | null {
  const details = ctx?.chapter_details ?? [];
  if (idOrHint.id) return details.find((d: any) => d.chapter_id === idOrHint.id) ?? null;
  if (idOrHint.hint) {
    const ranked = details
      .map((d: any) => ({ d, s: fuzzyScore(idOrHint.hint!, d.chapter) }))
      .filter((x: any) => x.s > 0)
      .sort((x: any, y: any) => y.s - x.s);
    return ranked[0]?.d ?? null;
  }
  return null;
}

/**
 * Resolve a get_* tool call against the inline reports_context payload.
 * Returns either a structured event payload (kind + data) for the SSE stream
 * AND a human-readable JSON string the AI sees as the tool result.
 */
function resolveReportsTool(
  name: string,
  rawArgs: string,
  ctx: any
): { event: any; toolResultText: string } | null {
  if (!ctx) {
    return {
      event: null,
      toolResultText: JSON.stringify({ error: "No reports context available." }),
    };
  }
  let args: any = {};
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    args = {};
  }

  switch (name) {
    case "get_batch_overview": {
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        reports_batch_name: ctx.reports_batch_name,
        overall_trend: ctx.overall_trend,
        recent_exam_avg: ctx.recent_exam_avg,
        at_risk_count: ctx.at_risk_count,
        weak_topic_count: ctx.weak_topic_count,
        exam_count: (ctx.recent_exams ?? []).length,
        total_students: ctx.student_roster_summary?.total ?? 0,
        suggested_focus: ctx.suggested_focus,
      };
      return {
        event: { kind: "batch_overview", payload },
        toolResultText: JSON.stringify(payload),
      };
    }
    case "get_recent_exams": {
      const limit = Math.min(Math.max(args.limit ?? 5, 1), 8);
      const exams = (ctx.recent_exams ?? []).slice(0, limit);
      const payload = { reports_batch_id: ctx.reports_batch_id, exams };
      return {
        event: { kind: "recent_exams", payload },
        toolResultText: JSON.stringify({ count: exams.length, exams }),
      };
    }
    case "get_batch_health_summary": {
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        reports_batch_name: ctx.reports_batch_name,
        overall_trend: ctx.overall_trend,
        recent_exam_avg: ctx.recent_exam_avg,
        suggested_focus: ctx.suggested_focus,
        priority_topics: ctx.priority_topics ?? [],
        students_to_check_in: ctx.students_to_check_in ?? [],
        at_risk_count: ctx.at_risk_count,
        weak_topic_count: ctx.weak_topic_count,
      };
      return {
        event: { kind: "todays_focus", payload },
        toolResultText: JSON.stringify({
          overall_trend: ctx.overall_trend,
          recent_exam_avg: ctx.recent_exam_avg,
          suggested_focus: ctx.suggested_focus,
          priority_topics: payload.priority_topics.map((t: any) => `${t.topic} (${t.successRate}%)`),
          students_to_check_in: payload.students_to_check_in.map((s: any) => s.studentName),
        }),
      };
    }
    case "get_exam_analysis": {
      const exam = findExam(ctx, args);
      if (!exam) {
        return { event: null, toolResultText: JSON.stringify({ error: "No exam found." }) };
      }
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        exam_id: exam.exam_id,
        exam_name: exam.exam_name,
        date: exam.date,
        total_marks: exam.total_marks,
        class_average: exam.class_average,
        highest_score: exam.highest_score,
        pass_percentage: exam.pass_percentage,
        total_students: exam.total_students,
        attempted_count: exam.attempted_count,
        verdict_text: exam.verdict_text,
        bands: exam.bands,
        topic_flags: exam.topic_flags,
        score_distribution: exam.score_distribution,
      };
      return {
        event: { kind: "exam_analysis", payload },
        toolResultText: JSON.stringify({
          exam_name: exam.exam_name,
          avg_pct: exam.avg_pct,
          pass_pct: exam.pass_percentage,
          highest: exam.highest_score,
          verdict: exam.verdict_text,
          bands: exam.bands,
          weak_topics: (exam.topic_flags ?? [])
            .filter((t: any) => t.status === "weak")
            .map((t: any) => `${t.topic} (${t.success_rate}%)`),
        }),
      };
    }
    case "get_question_analysis": {
      const exam = findExam(ctx, args);
      if (!exam) return { event: null, toolResultText: JSON.stringify({ error: "No exam found." }) };
      let qs = exam.question_analysis ?? [];
      if (args.weakest_only) {
        qs = qs.filter((q: any) => q.success_rate < 50 || q.difficulty === "hard");
      }
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        exam_id: exam.exam_id,
        exam_name: exam.exam_name,
        questions: qs,
      };
      return {
        event: { kind: "question_analysis", payload },
        toolResultText: JSON.stringify({
          exam_name: exam.exam_name,
          count: qs.length,
          weakest: [...qs].sort((a: any, b: any) => a.success_rate - b.success_rate).slice(0, 3),
        }),
      };
    }
    case "get_difficulty_analysis": {
      const exam = findExam(ctx, args);
      if (!exam) return { event: null, toolResultText: JSON.stringify({ error: "No exam found." }) };
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        exam_id: exam.exam_id,
        exam_name: exam.exam_name,
        difficulty_mix: exam.difficulty_mix ?? [],
        cognitive_mix: exam.cognitive_mix ?? [],
      };
      return {
        event: { kind: "difficulty_mix", payload },
        toolResultText: JSON.stringify({
          exam_name: exam.exam_name,
          difficulty_mix: payload.difficulty_mix,
          cognitive_mix: payload.cognitive_mix,
        }),
      };
    }
    case "get_actionable_insights": {
      const exam = findExam(ctx, args);
      if (!exam) return { event: null, toolResultText: JSON.stringify({ error: "No exam found." }) };
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        exam_id: exam.exam_id,
        exam_name: exam.exam_name,
        insights: exam.actionable_insights ?? [],
      };
      return {
        event: { kind: "actionable_insights", payload },
        toolResultText: JSON.stringify({
          exam_name: exam.exam_name,
          count: payload.insights.length,
          insights: payload.insights.map((i: any) => ({
            type: i.type,
            severity: i.severity,
            finding: i.finding,
            suggested_action: i.suggested_action,
            affected_count: (i.affected_students ?? []).length,
          })),
        }),
      };
    }
    case "get_compare_exams": {
      const analyses = ctx.exam_analyses ?? [];
      const a =
        (args.exam_id_a && analyses.find((x: any) => x.exam_id === args.exam_id_a)) ||
        analyses[0];
      const b =
        (args.exam_id_b && analyses.find((x: any) => x.exam_id === args.exam_id_b)) ||
        analyses[1];
      if (!a || !b) {
        return { event: null, toolResultText: JSON.stringify({ error: "Need at least two exams to compare." }) };
      }
      const weakA = new Set((a.topic_flags ?? []).filter((t: any) => t.status === "weak").map((t: any) => t.topic));
      const weakB = new Set((b.topic_flags ?? []).filter((t: any) => t.status === "weak").map((t: any) => t.topic));
      const joined = [...weakB].filter((t) => !weakA.has(t));
      const dropped = [...weakA].filter((t) => !weakB.has(t));
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        exam_a: {
          exam_id: a.exam_id,
          exam_name: a.exam_name,
          date: a.date,
          avg_pct: a.avg_pct,
          pass_percentage: a.pass_percentage,
          weak_topics: [...weakA],
        },
        exam_b: {
          exam_id: b.exam_id,
          exam_name: b.exam_name,
          date: b.date,
          avg_pct: b.avg_pct,
          pass_percentage: b.pass_percentage,
          weak_topics: [...weakB],
        },
        delta_avg_pct: a.avg_pct - b.avg_pct,
        delta_pass_pct: a.pass_percentage - b.pass_percentage,
        new_weak_topics: joined,
        improved_topics: dropped,
      };
      return {
        event: { kind: "exam_compare", payload },
        toolResultText: JSON.stringify(payload),
      };
    }
    case "get_chapter_health": {
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        chapters: ctx.chapters ?? [],
      };
      const weakest = (ctx.chapters ?? [])
        .slice()
        .sort((a: any, b: any) => a.avg_success_rate - b.avg_success_rate)
        .slice(0, 3)
        .map((c: any) => `${c.name} (${c.avg_success_rate}%)`);
      return {
        event: { kind: "chapter_health", payload },
        toolResultText: JSON.stringify({ total: payload.chapters.length, weakest }),
      };
    }
    case "get_chapter_deep_dive": {
      const ch = findChapter(ctx, { id: args.chapter_id, hint: args.chapter_name_hint });
      if (!ch) {
        return { event: null, toolResultText: JSON.stringify({ error: "Chapter not found." }) };
      }
      const payload = { reports_batch_id: ctx.reports_batch_id, chapter: ch };
      return {
        event: { kind: "chapter_deep_dive", payload },
        toolResultText: JSON.stringify({
          chapter: ch.chapter,
          overall_success_rate: ch.overall_success_rate,
          weak_topics: ch.topics.filter((t: any) => t.status === "weak").map((t: any) => `${t.topic} (${t.success_rate}%)`),
          buckets: ch.student_buckets.map((b: any) => `${b.label}: ${b.count}`),
        }),
      };
    }
    case "get_topic_analysis": {
      const topics = ctx.topics ?? [];
      const ranked = topics
        .map((t: any) => ({
          t,
          s:
            fuzzyScore(args.topic_name_hint, t.topic) +
            (args.chapter_name_hint ? fuzzyScore(args.chapter_name_hint, t.chapter) * 0.4 : 0),
        }))
        .filter((x: any) => x.s > 0)
        .sort((x: any, y: any) => y.s - x.s);
      const top = ranked[0]?.t;
      if (!top) {
        return { event: null, toolResultText: JSON.stringify({ error: "Topic not found.", searched: args.topic_name_hint }) };
      }
      const payload = { reports_batch_id: ctx.reports_batch_id, topic: top };
      return {
        event: { kind: "topic_analysis", payload },
        toolResultText: JSON.stringify({
          topic: top.topic,
          chapter: top.chapter,
          success_rate: top.success_rate,
          status: top.status,
          affected_count: top.affected_students.length,
          affected_names: top.affected_students.slice(0, 5).map((s: any) => s.name),
        }),
      };
    }
    case "get_at_risk_students": {
      const limit = Math.min(Math.max(args.limit ?? 8, 1), 20);
      const students = (ctx.at_risk_students ?? []).slice(0, limit);
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        title: `${students.length} student${students.length !== 1 ? "s" : ""} need attention`,
        variant: "at_risk",
        students,
      };
      return {
        event: { kind: "at_risk_students", payload },
        toolResultText: JSON.stringify({ count: students.length, names: students.map((s: any) => s.name) }),
      };
    }
    case "get_top_performers": {
      const limit = Math.min(Math.max(args.limit ?? 5, 1), 12);
      const students = (ctx.top_performers ?? []).slice(0, limit);
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        title: `Top ${students.length} performers`,
        variant: "top_performers",
        students,
      };
      return {
        event: { kind: "top_performers", payload },
        toolResultText: JSON.stringify({ count: students.length, names: students.map((s: any) => s.name) }),
      };
    }
    case "get_student_search": {
      const profiles = ctx.student_profiles ?? [];
      const ranked = profiles
        .map((p: any) => ({ p, s: fuzzyScore(args.name_hint ?? "", p.name) }))
        .filter((x: any) => x.s > 0)
        .sort((x: any, y: any) => y.s - x.s)
        .slice(0, 5)
        .map((x: any) => ({ id: x.p.id, name: x.p.name, roll: x.p.roll, score: x.s }));
      return {
        event: null,
        toolResultText: JSON.stringify({ candidates: ranked }),
      };
    }
    case "get_student_profile": {
      const sp = findStudent(ctx, { id: args.student_id, hint: args.name_hint });
      if (!sp) {
        return { event: null, toolResultText: JSON.stringify({ error: "Student not found." }) };
      }
      const payload = { reports_batch_id: ctx.reports_batch_id, student: sp };
      return {
        event: { kind: "student_profile", payload },
        toolResultText: JSON.stringify({
          name: sp.name,
          roll: sp.roll,
          pi: sp.pi,
          accuracy: sp.accuracy,
          consistency: sp.consistency,
          trend: sp.trend,
          tags: sp.secondary_tags,
          weak_topics: sp.weak_topic_names,
          suggested_difficulty: sp.suggested_difficulty,
          ai_summary: sp.ai_summary,
          strengths: sp.ai_strengths,
          priorities: sp.ai_priorities,
          engagement_note: sp.ai_engagement_note,
        }),
      };
    }
    case "get_compare_students": {
      const a = findStudent(ctx, { id: args.student_id_a, hint: args.name_hint_a });
      const b = findStudent(ctx, { id: args.student_id_b, hint: args.name_hint_b });
      if (!a || !b) {
        return { event: null, toolResultText: JSON.stringify({ error: "Need two students to compare." }) };
      }
      const payload = {
        reports_batch_id: ctx.reports_batch_id,
        student_a: a,
        student_b: b,
        delta_pi: a.pi - b.pi,
        delta_accuracy: a.accuracy - b.accuracy,
      };
      return {
        event: { kind: "student_compare", payload },
        toolResultText: JSON.stringify({
          a: { name: a.name, pi: a.pi, accuracy: a.accuracy, trend: a.trend, weak: a.weak_topic_names.slice(0, 3) },
          b: { name: b.name, pi: b.pi, accuracy: b.accuracy, trend: b.trend, weak: b.weak_topic_names.slice(0, 3) },
        }),
      };
    }
    case "get_chapter_search": {
      const details = ctx.chapter_details ?? [];
      const ranked = details
        .map((d: any) => ({ d, s: fuzzyScore(args.name_hint ?? "", d.chapter) }))
        .filter((x: any) => x.s > 0)
        .sort((x: any, y: any) => y.s - x.s)
        .slice(0, 5)
        .map((x: any) => ({ chapter_id: x.d.chapter_id, chapter: x.d.chapter, score: x.s }));
      return {
        event: null,
        toolResultText: JSON.stringify({ candidates: ranked }),
      };
    }
    case "get_multi_subject_risk": {
      const students = ctx.multi_area_risk ?? [];
      const payload = { reports_batch_id: ctx.reports_batch_id, students };
      return {
        event: { kind: "multi_subject_risk", payload },
        toolResultText: JSON.stringify({
          count: students.length,
          students: students.slice(0, 10).map((s: any) => ({
            name: s.name,
            weak_chapter_count: s.weak_chapter_count,
            weak_chapters: s.weak_chapters,
            pi: s.pi,
          })),
        }),
      };
    }
    default:
      return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { thread_id, batch_id, routine_key, messages, target_artifact_id, reports_context } = body;
    if (!thread_id || !batch_id || !routine_key || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const isReportsRoutine = routine_key === "reports";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Load routine + batch
    const [{ data: routine }, { data: batch }] = await Promise.all([
      supabase.from("rp_routines").select("*").eq("key", routine_key).maybeSingle(),
      supabase.from("rp_batches").select("*").eq("id", batch_id).maybeSingle(),
    ]);

    if (!routine || !batch) {
      return new Response(JSON.stringify({ error: "Routine or batch not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---------- Refinement mode: load target artifact ----------
    let targetArtifact: any = null;
    if (target_artifact_id) {
      const { data } = await supabase
        .from("rp_artifacts")
        .select("*")
        .eq("id", target_artifact_id)
        .maybeSingle();
      targetArtifact = data;
    }

    let systemPrompt = `${routine.default_system_prompt ?? ""}

CONTEXT:
- Batch: ${batch.name} (Grade ${batch.grade}${batch.section ? "-" + batch.section : ""}, Subject: ${batch.subject})
- Routine: ${routine.label}

When you produce structured output (lesson plan, slide deck, test, homework, schedule), CALL THE APPROPRIATE TOOL. Then add a short text confirmation. Do not paste JSON inline.

For tests specifically: ALWAYS infer a sensible curriculum from the batch (e.g. "CBSE Grade ${batch.grade}" if not specified), set pattern to "custom" unless a competitive exam (JEE Main/Advanced, NEET) is explicitly requested, and tag every question with chapter, topic, difficulty (easy/medium/hard) and cognitive_type (memory/conceptual/logical/analytical/application). The teacher will publish this test to their real Tests page, so the metadata MUST be complete.`;

    if (targetArtifact) {
      const updateToolName =
        targetArtifact.type === "test"
          ? "update_test"
          : targetArtifact.type === "lesson_plan"
          ? "update_lesson_plan"
          : targetArtifact.type === "ppt"
          ? "update_ppt"
          : targetArtifact.type === "banded_homework"
          ? "update_banded_homework"
          : null;

      systemPrompt += `

REFINEMENT MODE — IMPORTANT:
You are refining an EXISTING ${targetArtifact.type} artifact titled "${targetArtifact.title}".
Apply ONLY the change the teacher requested. Preserve all other content exactly as it is.
You MUST call the \`${updateToolName}\` tool with the FULL updated artifact (not a diff).
Do NOT call any create_* tool in this turn.

Current artifact JSON:
\`\`\`json
${JSON.stringify({ title: targetArtifact.title, content: targetArtifact.content }, null, 2)}
\`\`\``;
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        tools: isReportsRoutine ? reportsTools : tools,
        stream: true,
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = aiResp.body!.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();

        const toolCalls: Record<number, { name: string; args: string }> = {};
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let nl: number;
            while ((nl = buffer.indexOf("\n")) !== -1) {
              let line = buffer.slice(0, nl);
              buffer = buffer.slice(nl + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) {
                controller.enqueue(encoder.encode(line + "\n"));
                continue;
              }

              const payload = line.slice(6).trim();
              if (payload === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const parsed = JSON.parse(payload);
                const delta = parsed.choices?.[0]?.delta;
                if (delta?.tool_calls) {
                  for (const tc of delta.tool_calls) {
                    const idx = tc.index ?? 0;
                    if (!toolCalls[idx]) toolCalls[idx] = { name: "", args: "" };
                    if (tc.function?.name) toolCalls[idx].name = tc.function.name;
                    if (tc.function?.arguments) toolCalls[idx].args += tc.function.arguments;
                  }
                }
                controller.enqueue(encoder.encode(line + "\n"));
              } catch {
                controller.enqueue(encoder.encode(line + "\n"));
              }
            }
          }

          // Persist tool-call results
          const createdArtifactIds: string[] = [];
          const updatedArtifactIds: string[] = [];
          // Collect Reports tool outputs so we can run a follow-up turn that
          // produces a plain-language insight on top of each card.
          const reportsToolOutputs: Array<{
            name: string;
            args: string;
            toolCallId: string;
            toolResultText: string;
          }> = [];
          const assistantToolCalls: any[] = [];

          for (const idx of Object.keys(toolCalls)) {
            const call = toolCalls[+idx];

            // Reports routine: emit a structured report_data event
            if (isReportsRoutine && REPORTS_TOOL_NAMES.has(call.name)) {
              const result = resolveReportsTool(call.name, call.args, reports_context);
              if (result?.event) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ rp_report_data: result.event })}\n\n`)
                );
              }
              const toolCallId = `rp_tool_${idx}_${Date.now()}`;
              assistantToolCalls.push({
                id: toolCallId,
                type: "function",
                function: { name: call.name, arguments: call.args || "{}" },
              });
              reportsToolOutputs.push({
                name: call.name,
                args: call.args,
                toolCallId,
                toolResultText: result?.toolResultText ?? JSON.stringify({ ok: false }),
              });
              continue;
            }

            let parsed: any;
            try {
              parsed = JSON.parse(call.args);
            } catch (e) {
              console.error("Failed to parse tool args:", call.name, e);
              continue;
            }

            // Update path
            if (UPDATE_TOOL_TO_TYPE[call.name] && targetArtifact?.id) {
              const newType = UPDATE_TOOL_TO_TYPE[call.name];
              if (newType !== targetArtifact.type) {
                console.warn("Update tool type mismatch:", call.name, targetArtifact.type);
                continue;
              }
              const { data: upd } = await supabase
                .from("rp_artifacts")
                .update({
                  title: parsed.title ?? targetArtifact.title,
                  content: parsed.content ?? {},
                })
                .eq("id", targetArtifact.id)
                .select("id")
                .single();
              if (upd?.id) updatedArtifactIds.push(upd.id);
              continue;
            }

            // Create path
            const type = TOOL_TO_TYPE[call.name];
            if (!type) continue;
            const { data: art } = await supabase
              .from("rp_artifacts")
              .insert({
                batch_id,
                thread_id,
                type,
                title: parsed.title ?? "Untitled",
                content: parsed.content ?? {},
              })
              .select("id")
              .single();
            if (art?.id) createdArtifactIds.push(art.id);
          }

          if (createdArtifactIds.length) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ rp_artifacts_created: createdArtifactIds })}\n\n`)
            );
          }
          if (updatedArtifactIds.length) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ rp_artifacts_updated: updatedArtifactIds })}\n\n`)
            );
          }

          // ---------- Reports multi-round tool loop ----------
          // The model may need to chain tools (e.g. get_student_search ->
          // get_student_profile). Run up to 3 follow-up rounds where the model
          // can keep calling tools, then a final no-tools turn that produces
          // the plain-language insight on top of the cards.
          if (isReportsRoutine && reportsToolOutputs.length > 0) {
            try {
              const convo: any[] = [
                { role: "system", content: systemPrompt },
                ...messages,
                {
                  role: "assistant",
                  content: null,
                  tool_calls: assistantToolCalls,
                },
                ...reportsToolOutputs.map((o) => ({
                  role: "tool",
                  tool_call_id: o.toolCallId,
                  name: o.name,
                  content: o.toolResultText,
                })),
              ];

              const MAX_ROUNDS = 3;
              let producedFinalText = false;
              for (let round = 0; round < MAX_ROUNDS && !producedFinalText; round++) {
                const roundResp = await fetch(
                  "https://ai.gateway.lovable.dev/v1/chat/completions",
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${LOVABLE_API_KEY}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      model: "google/gemini-2.5-flash",
                      messages: convo,
                      tools: reportsTools,
                      stream: false,
                    }),
                  }
                );
                if (!roundResp.ok) {
                  console.error("Reports tool-loop round failed:", roundResp.status);
                  break;
                }
                const roundJson = await roundResp.json();
                const choice = roundJson.choices?.[0];
                const msg = choice?.message;
                const newToolCalls = msg?.tool_calls ?? [];

                if (newToolCalls.length === 0) {
                  const finalText: string = msg?.content ?? "";
                  if (finalText) {
                    producedFinalText = true;
                    const chunk = {
                      choices: [{ index: 0, delta: { content: finalText, role: "assistant" } }],
                    };
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
                    );
                  }
                  break;
                }

                const newAssistantToolCalls: any[] = [];
                const newToolResults: Array<{ id: string; name: string; text: string }> = [];
                for (let i = 0; i < newToolCalls.length; i++) {
                  const tc = newToolCalls[i];
                  const name = tc.function?.name;
                  const args = tc.function?.arguments ?? "{}";
                  if (!name || !REPORTS_TOOL_NAMES.has(name)) continue;
                  const result = resolveReportsTool(name, args, reports_context);
                  if (result?.event) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ rp_report_data: result.event })}\n\n`)
                    );
                  }
                  const callId = tc.id ?? `rp_tool_r${round}_${i}_${Date.now()}`;
                  newAssistantToolCalls.push({
                    id: callId,
                    type: "function",
                    function: { name, arguments: args },
                  });
                  newToolResults.push({
                    id: callId,
                    name,
                    text: result?.toolResultText ?? JSON.stringify({ ok: false }),
                  });
                }

                if (newAssistantToolCalls.length === 0) break;

                convo.push({
                  role: "assistant",
                  content: null,
                  tool_calls: newAssistantToolCalls,
                });
                for (const r of newToolResults) {
                  convo.push({
                    role: "tool",
                    tool_call_id: r.id,
                    name: r.name,
                    content: r.text,
                  });
                }
              }

              // Final summary pass — no tools; must produce the insight text.
              if (!producedFinalText) {
                const summaryConvo = [
                  ...convo,
                  {
                    role: "system",
                    content:
                      "Now write 2-4 sentences in plain language summarising the data the tools returned. Be concrete: cite numbers, names, or topics. Do NOT call any more tools. Do NOT repeat the raw JSON. The structured cards are already shown to the teacher above your message.",
                  },
                ];
                const summaryResp = await fetch(
                  "https://ai.gateway.lovable.dev/v1/chat/completions",
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${LOVABLE_API_KEY}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      model: "google/gemini-2.5-flash",
                      messages: summaryConvo,
                      stream: true,
                    }),
                  }
                );
                if (summaryResp.ok && summaryResp.body) {
                  const fReader = summaryResp.body.getReader();
                  let fBuf = "";
                  while (true) {
                    const { done: fd, value: fv } = await fReader.read();
                    if (fd) break;
                    fBuf += decoder.decode(fv, { stream: true });
                    let fnl: number;
                    while ((fnl = fBuf.indexOf("\n")) !== -1) {
                      let fLine = fBuf.slice(0, fnl);
                      fBuf = fBuf.slice(fnl + 1);
                      if (fLine.endsWith("\r")) fLine = fLine.slice(0, -1);
                      if (!fLine.startsWith("data: ")) continue;
                      const fPayload = fLine.slice(6).trim();
                      if (fPayload === "[DONE]") continue;
                      controller.enqueue(encoder.encode(fLine + "\n\n"));
                    }
                  }
                } else {
                  console.error("Reports summary turn failed:", summaryResp.status);
                }
              }
            } catch (e) {
              console.error("Reports tool-loop error:", e);
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (e) {
          console.error("stream error", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (e) {
    console.error("routine-pilot-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
