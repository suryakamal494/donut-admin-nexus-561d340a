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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { thread_id, batch_id, routine_key, messages, target_artifact_id } = body;
    if (!thread_id || !batch_id || !routine_key || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
        tools,
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

          for (const idx of Object.keys(toolCalls)) {
            const call = toolCalls[+idx];
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
