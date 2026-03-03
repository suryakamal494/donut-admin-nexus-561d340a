import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { batchName, className, totalStudents, overallAverage, subjects, atRiskMultiSubjectCount } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert education analyst advising an institute principal. You analyze cross-subject batch-level data and produce structured, actionable insights. Every insight must be specific — reference subject names, teacher names, percentages, and trends. Never give generic advice.`;

    const userPrompt = `Analyze this batch report and return exactly 5 structured insights using the provided tool.

Batch: "${className} — ${batchName}"
Total Students: ${totalStudents}
Overall Average: ${overallAverage}%
Students at risk in 2+ subjects: ${atRiskMultiSubjectCount}

Subject Performance:
${subjects.map((s: any) => `- ${s.subjectName} (Teacher: ${s.teacherName}): ${s.classAverage}% avg (prev: ${s.previousAverage}%), trend: ${s.trend}, at-risk: ${s.atRiskCount}/${s.totalStudents} students, ${s.totalExams} exams conducted`).join("\n")}

Generate 5 insights:
1. PRIORITY_ALERT — The single most urgent issue requiring immediate attention
2. CROSS_SUBJECT_PATTERN — A correlation or pattern across multiple subjects  
3. TEACHER_COACHING — A specific suggestion for supporting a teacher based on their subject's performance
4. STUDENT_INTERVENTION — Recommendation for student-level action (especially multi-subject at-risk students)
5. POSITIVE_SIGNAL — Something going well that should be recognized or reinforced`;

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
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "deliver_batch_insights",
              description: "Return 5 structured insights for the principal about this batch.",
              parameters: {
                type: "object",
                properties: {
                  insights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["priority_alert", "cross_subject_pattern", "teacher_coaching", "student_intervention", "positive_signal"],
                        },
                        title: { type: "string", description: "Short headline (5-10 words)" },
                        description: { type: "string", description: "1-2 sentence explanation with specific data points" },
                        severity: { type: "string", enum: ["critical", "warning", "info", "positive"] },
                        relatedSubjects: {
                          type: "array",
                          items: { type: "string" },
                          description: "Subject names this insight relates to",
                        },
                      },
                      required: ["type", "title", "description", "severity", "relatedSubjects"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["insights"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "deliver_batch_insights" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("AI gateway error:", status, text);

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No structured response from AI");
    }

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ insights: parsed.insights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-batch-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
