import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";

export interface GeneratedQuestion {
  id: string;
  question: string;
  category?: "gatekeeper" | "foundational" | "advanced";
  targetSkill?: string;
  options: Array<{
    label: string;
    score: number;
    nextBranch?: "foundational" | "advanced";
  }>;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trackTitle, trackDescription, skills = [] } = body;

    const systemPrompt = `You are a diagnostic assessment designer for EdTech onboarding.
RULES:
1. Every question MUST be extremely short, basic, and strictly 1 to 2 lines long maximum (under 20 words).
2. Options must be short, clear 1-line answers (3 to 4 choices).
3. Include a "gatekeeper" question first (e.g. "Have you written code before?"), followed by foundational and advanced follow-ups.
Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "id": "q1",
      "question": "1 to 2 line short question here?",
      "category": "gatekeeper",
      "targetSkill": "Programming Basics",
      "options": [
        { "label": "No prior experience", "score": 1, "nextBranch": "foundational" },
        { "label": "Basic scripts & functions", "score": 2, "nextBranch": "foundational" },
        { "label": "Built small apps", "score": 4, "nextBranch": "advanced" },
        { "label": "Professional developer", "score": 5, "nextBranch": "advanced" }
      ]
    }
  ]
}`;

    const userPrompt = `Generate 5 short 1-to-2 line adaptive diagnostic questions for track: "${trackTitle || 'Software Development'}".
Description: ${trackDescription || 'Software Engineering track'}
Key Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}.
Keep questions extremely short, basic, and simple. Output ONLY valid JSON.`;

    const rawResponse = await callOpenRouter({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 1800,
      response_format: { type: "json_object" },
    });

    const cleaned = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const questions: GeneratedQuestion[] = parsed?.questions || [];

    console.log("Generated questions:", questions);

    if (questions.length === 0) {
      throw new Error("OpenRouter AI returned an empty questions array.");
    }

    return NextResponse.json({
      success: true,
      trackTitle,
      questions,
    });
  } catch (error: any) {
    console.error("Error in generate-assessment route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate assessment from OpenRouter AI" },
      { status: 500 }
    );
  }
}
