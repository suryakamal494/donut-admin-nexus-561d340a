import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  action: "generate_quiz" | "generate_homework";
  topic: string;
  subject: string;
  chapter?: string;
  questionCount?: number;
  difficulty?: string;
  questionTypes?: string[];
  homeworkType?: string;
  // NEW: Context support for AI homework generation
  contextType?: "document" | "content" | "lesson_plan";
  contextContent?: string;
  customInstructions?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      action, 
      topic, 
      subject, 
      chapter, 
      questionCount, 
      difficulty, 
      questionTypes, 
      homeworkType,
      contextType,
      contextContent,
      customInstructions
    } = await req.json() as RequestBody;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "generate_quiz":
        systemPrompt = `You are an expert education assessment creator. Generate clear, well-structured quiz questions suitable for classroom use. Each question should test understanding, not just memorization.`;
        userPrompt = `Create ${questionCount || 5} quiz questions about "${topic}" in ${subject}${chapter ? `, chapter: ${chapter}` : ""}.

Difficulty level: ${difficulty || "medium"}
Question types to include: ${questionTypes?.join(", ") || "MCQ"}

Return a JSON object with:
{
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation",
      "difficulty": "easy|medium|hard",
      "marks": 1
    }
  ],
  "totalMarks": number,
  "estimatedTime": number (in minutes)
}`;
        break;

      case "generate_homework":
        systemPrompt = `You are an expert education content creator. Generate meaningful homework assignments that reinforce classroom learning and encourage independent thinking. Create age-appropriate, engaging tasks that help students practice and apply concepts.`;
        
        // Build context section if provided
        let contextSection = "";
        if (contextType && contextContent) {
          contextSection = `\n\nCONTEXT PROVIDED:
Type: ${contextType}
Details: ${contextContent}

Use this context to make the homework more relevant and aligned with the teaching materials.`;
        }

        // Build custom instructions section
        let instructionsSection = "";
        if (customInstructions) {
          instructionsSection = `\n\nTEACHER'S SPECIFIC INSTRUCTIONS:
${customInstructions}

Follow these instructions carefully when generating the homework.`;
        }

        const hwTypeDescription = {
          practice: "Practice homework - students solve problems, write answers, or complete exercises. Include numerical problems, short answer questions, and application-based tasks.",
          test: "Test/Quiz homework - auto-graded MCQ questions with clear options. Include a mix of easy, medium, and hard questions.",
          project: "Project homework - creative work like reports, presentations, research, or experiments. Give clear guidelines and rubric points."
        }[homeworkType || "practice"];

        userPrompt = `Create a ${homeworkType || "practice"} homework assignment about "${topic}" in ${subject}${chapter ? `, chapter: ${chapter}` : ""}.

HOMEWORK TYPE: ${hwTypeDescription}${contextSection}${instructionsSection}

Return a JSON object with:
{
  "title": "Clear, descriptive title for the homework",
  "description": "Brief 1-2 sentence description of what students will learn/practice",
  "instructions": ["Step 1: ...", "Step 2: ...", ...],
  "tasks": [
    {
      "id": "t1",
      "type": "problem|question|activity|reading|mcq",
      "content": "Detailed task description or question",
      "marks": number (optional, for graded tasks)
    }
  ],
  "totalMarks": number (optional, sum of all task marks),
  "estimatedTime": number (in minutes),
  "resources": ["Optional helpful resource or reference"]
}

${homeworkType === 'test' ? `For test type, include MCQ tasks with this format:
{
  "id": "t1",
  "type": "mcq",
  "content": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0,
  "marks": 1
}` : ''}

Generate 4-6 meaningful tasks that progressively build understanding.`;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log("Generating homework with context:", { contextType, hasCustomInstructions: !!customInstructions });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      parsedContent = { raw: content };
    }

    console.log("Successfully generated homework:", { title: parsedContent.title });

    return new Response(
      JSON.stringify({ success: true, data: parsedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("assessment-ai error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
