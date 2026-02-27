import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { chapter, subject, bands, topics } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const topicSummary = (topics || [])
      .map((t: { name: string; status: string; avgSuccessRate: number }) =>
        `${t.name} (${t.status}, ${t.avgSuccessRate}% success)`
      )
      .join("; ");

    const results: Record<string, unknown> = {};

    for (const band of bands) {
      if (band.studentCount === 0) continue;

      const systemPrompt = `You are an expert teacher creating practice questions for ${subject} — Chapter: ${chapter}.
Topic performance: ${topicSummary || "No specific topic data."}

Target band: "${band.label}" (${band.context}).
${band.instructions ? `Teacher instructions: ${band.instructions}` : ""}

Generate exactly ${band.questionCount} multiple-choice questions. Each question must have 4 options (A-D) and one correct answer.
Vary difficulty appropriately for the "${band.label}" band.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate ${band.questionCount} MCQ practice questions for the "${band.label}" band.` },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_questions",
                description: "Return the generated practice questions",
                parameters: {
                  type: "object",
                  properties: {
                    questions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "Unique question ID like q1, q2..." },
                          text: { type: "string", description: "The question text" },
                          options: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                label: { type: "string", enum: ["A", "B", "C", "D"] },
                                text: { type: "string" },
                              },
                              required: ["label", "text"],
                              additionalProperties: false,
                            },
                          },
                          correctAnswer: { type: "string", enum: ["A", "B", "C", "D"] },
                          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                          topic: { type: "string", description: "Which topic this question covers" },
                        },
                        required: ["id", "text", "options", "correctAnswer", "difficulty", "topic"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["questions"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_questions" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errText = await response.text();
        console.error(`AI error for band ${band.key}:`, response.status, errText);
        results[band.key] = { error: "Failed to generate questions", questions: [] };
        continue;
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        try {
          const parsed = JSON.parse(toolCall.function.arguments);
          results[band.key] = { questions: parsed.questions || [] };
        } catch {
          results[band.key] = { error: "Failed to parse AI response", questions: [] };
        }
      } else {
        results[band.key] = { error: "No structured output", questions: [] };
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-chapter-practice error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
