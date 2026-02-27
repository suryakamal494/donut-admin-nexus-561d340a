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
    const {
      examName,
      totalStudents,
      averageScore,
      highestScore,
      lowestScore,
      passPercentage,
      scoreDistribution,
      questionAnalysis,
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are an expert education analyst helping a teacher understand exam results. Analyze the following exam data and provide exactly 5 concise, actionable bullet points.

Exam: "${examName}"
Total Students: ${totalStudents}
Average Score: ${averageScore}, Highest: ${highestScore}, Lowest: ${lowestScore}
Pass Percentage: ${passPercentage}%
Score Distribution: ${JSON.stringify(scoreDistribution)}

Question Analysis:
${JSON.stringify(questionAnalysis, null, 1)}

Structure your response as:
1. **What went well** — topics/question types where students performed strongly
2. **Needs reteaching** — specific topics with low accuracy that require classroom review  
3. **Difficulty gap** — how students performed on easy vs hard questions
4. **Students at risk** — estimate how many need intervention based on score distribution
5. **Recommended next step** — one concrete action the teacher should take next

Keep each point to 1-2 sentences. Be specific with topic names and percentages. Do NOT use generic advice.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a concise education analytics assistant for teachers." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("AI gateway error:", status, text);

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const result = await response.json();
    const analysis = result.choices?.[0]?.message?.content || "Unable to generate analysis.";

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-exam-results error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
