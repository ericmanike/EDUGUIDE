import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";
import { fetchLearningPaths } from "@/lib/api";

export interface AIRecommendationResult {
  recommendedTrackId?: string;
  recommendedTrackTitle?: string;
  matchScorePercent: number;
  recommendedLevelTier: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  strengths: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      availableTracks,
      skillLevel,
      diagnosticAnswers,
      weeklyHours,
      diagnosticScore,
      questions = [],
    } = body;

    // Fetch dynamic learning paths if availableTracks not provided in body
    const tracksToConsider = availableTracks && Array.isArray(availableTracks) && availableTracks.length > 0
      ? availableTracks
      : await fetchLearningPaths();

    const formattedTracksList = tracksToConsider
      .map((t: any) => `- ID: "${t.id}" -> Title: "${t.title}" (Category: "${t.category || t.level || 'Software Engineering'}", Description: "${t.description || ''}")`)
      .join("\n");

    // Format diagnostic answers into a readable diagnostic summary
    let answersSummary = "";
    if (questions && Array.isArray(questions) && questions.length > 0) {
      answersSummary = questions
        .map((q: any) => {
          const score = diagnosticAnswers?.[q.id] || 3;
          const chosenOpt = q.options?.find((o: any) => o.score === score)?.label || `Score ${score}/5`;
          return `- Question: "${q.question}" -> User Response: "${chosenOpt}" (Score: ${score}/5)`;
        })
        .join("\n");
    } else if (diagnosticAnswers) {
      answersSummary = Object.entries(diagnosticAnswers)
        .map(([qId, score]) => `- Question ${qId}: Score ${score}/5`)
        .join("\n");
    }

    const systemPrompt = `You are an elite EdTech AI Learning Architect.
Analyze the student's diagnostic assessment responses and determine the BEST Learning Path Track and Level for them from the provided available learning paths list.

Available Learning Paths (Dynamic Catalog):
${formattedTracksList}

Instructions:
1. Select the single best recommended learning path from the list above based on user score and answers.
2. Ensure "recommendedTrackId" EXACTLY matches the ID of the chosen learning path from the list.
3. Ensure "recommendedTrackTitle" EXACTLY matches the Title of the chosen learning path.

Return ONLY valid JSON matching this exact schema:
{
  "recommendedTrackId": "${tracksToConsider[0]?.id || 'web-dev'}",
  "recommendedTrackTitle": "${tracksToConsider[0]?.title || 'Full-Stack Web Development Track'}",
  "matchScorePercent": 94,
  "recommendedLevelTier": "INTERMEDIATE",
  "strengths": ["Demonstrated Strength 1", "Demonstrated Strength 2"]
}`;

    const userPrompt = `Student Onboarding Diagnostic Submission:
- Diagnostic Baseline Score: ${diagnosticScore || 50}%
- Target Level Tier: ${skillLevel || "INTERMEDIATE"}
- Weekly Commitment: ${weeklyHours || 5} hours per week

User Diagnostic Responses:
${answersSummary || "Answers provided: Intermediate performance across core technical modules."}

Task: Analyze the user's responses, select the single best learning path track for them from the available tracks list, and list 2-3 demonstrated baseline strengths. Output ONLY valid JSON.`;

    const rawContent = await callOpenRouter({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const cleaned = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed: AIRecommendationResult = JSON.parse(cleaned);

    if (!parsed || !parsed.recommendedTrackId || !Array.isArray(parsed.strengths)) {
      throw new Error("OpenRouter AI returned an invalid skill recommendation payload.");
    }

    return NextResponse.json({
      success: true,
      recommendation: parsed,
    });
  } catch (error: any) {
    console.error("Error in recommend-skills route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate skill recommendations from OpenRouter AI" },
      { status: 500 }
    );
  }
}
