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
    const { availableTracks } = body;

    if (!Array.isArray(availableTracks) || availableTracks.length === 0) {
      return NextResponse.json(
        { success: false, error: "No learning paths were provided to build the assessment from." },
        { status: 400 }
      );
    }

    const formattedTracksList = availableTracks
      .map(
        (t: any) =>
          `- ID: "${t.id}" -> Title: "${t.title}" (Category: "${t.category || ""}", Skills: ${
            Array.isArray(t.skills) ? t.skills.join(", ") : ""
          })`
      )
      .join("\n");

    const systemPrompt = `You are a diagnostic assessment designer for EdTech onboarding.

The platform currently offers these learning path tracks (this is the FULL live catalog, fetched fresh from the backend):
${formattedTracksList}

Design a single diagnostic assessment whose questions span the topics/skills across these tracks, so that a student's answers can later be used to determine which ONE track (and skill level) fits them best.

RULES:
1. Generate EXACTLY 10 questions.
2. Every question MUST be extremely short, basic, and strictly 1 to 2 lines long maximum (under 20 words).
3. Options must be short, clear 1-line answers (3 to 4 choices), each with a numeric "score" from 1 (no experience) to 5 (expert).
4. Question 1 MUST be a "gatekeeper" question that asks broadly whether the student has any relevant prior experience at all, whose options each include "nextBranch": "foundational" or "advanced".
5. Questions 2-10 must mix "foundational" and "advanced" categories, with "targetSkill" values drawn DIRECTLY from the specific skills/titles/descriptions of the tracks listed above (not generic placeholders), so responses reveal which exact track fits best.
6. Write ORIGINAL wording for every question and option. The schema below is a STRUCTURE example only — never reuse its literal question text, option text, or targetSkill value; invent new phrasing based on the tracks listed above every time.
7. Vary sentence structure and phrasing across questions so no two questions read alike.
Return ONLY valid JSON matching this schema shape (structure only — do not copy any of this example's wording):
{
  "questions": [
    {
      "id": "q1",
      "question": "<original short question text, 1-2 lines>",
      "category": "gatekeeper" | "foundational" | "advanced",
      "targetSkill": "<a specific skill/topic name from the tracks above>",
      "options": [
        { "label": "<original option text>", "score": 1, "nextBranch": "foundational" },
        { "label": "<original option text>", "score": 2, "nextBranch": "foundational" },
        { "label": "<original option text>", "score": 4, "nextBranch": "advanced" },
        { "label": "<original option text>", "score": 5, "nextBranch": "advanced" }
      ]
    }
  ]
}`;

    const userPrompt = `Generate exactly 10 short 1-to-2 line adaptive diagnostic questions spanning the available learning path tracks listed above, so a student's answers can reveal which track and skill level fits them best. Write fresh, original wording every time — do not reuse stock phrasing like "Have you written code before?". Session nonce: ${Date.now()}-${Math.random().toString(36).slice(2, 10)} (use this only to vary your output, ignore its value otherwise). Output ONLY valid JSON.`;

    const rawResponse = await callOpenRouter({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.95,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const cleaned = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const questions: GeneratedQuestion[] = parsed?.questions || [];

    if (questions.length === 0) {
      throw new Error("OpenRouter AI returned an empty questions array.");
    }

    console.log("Generated Questions:", JSON.stringify(questions, null, 2));

    return NextResponse.json({
      success: true,
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
