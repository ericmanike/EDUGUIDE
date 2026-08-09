import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";

export interface SkillRecommendation {
  name: string;
  category: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  whyRecommended: string;
  estimatedHours: number;
  prerequisite?: string;
}

export interface RecommendedModule {
  title: string;
  topic: string;
  durationMinutes: number;
  reason: string;
}

export interface AIRecommendationResult {
  overallEvaluation: string;
  matchScorePercent: number;
  recommendedLevelTier: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  strengths: string[];
  knowledgeGaps: string[];
  recommendedSkills: SkillRecommendation[];
  recommendedModules: RecommendedModule[];
  weeklyPlan: Array<{
    week: number;
    focus: string;
    deliverable: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      trackId,
      trackName,
      skillLevel,
      diagnosticAnswers,
      weeklyHours,
      learningStyles,
      diagnosticScore,
      questions = [],
    } = body;

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
Analyze the student's diagnostic assessment responses and output a personalized Skill Recommendation report.
Return ONLY valid JSON matching this exact schema:
{
  "overallEvaluation": "Comprehensive 2-3 sentence assessment of user's current baseline and growth vector.",
  "matchScorePercent": 92,
  "recommendedLevelTier": "INTERMEDIATE",
  "strengths": ["Demonstrated Strength 1", "Demonstrated Strength 2"],
  "knowledgeGaps": ["Area for Growth 1", "Area for Growth 2"],
  "recommendedSkills": [
    {
      "name": "Specific Skill Name",
      "category": "Category / Domain",
      "priority": "HIGH",
      "whyRecommended": "Direct explanation linked to their diagnostic response",
      "estimatedHours": 10,
      "prerequisite": "Prerequisite skill"
    }
  ],
  "recommendedModules": [
    {
      "title": "Module Title",
      "topic": "Topic",
      "durationMinutes": 120,
      "reason": "Why this module addresses their gap"
    }
  ],
  "weeklyPlan": [
    {
      "week": 1,
      "focus": "Focus topic",
      "deliverable": "Concrete outcome or milestone"
    }
  ]
}`;

    const userPrompt = `Student Onboarding Diagnostic Submission:
- Target Track / Learning Path: "${trackName || "Full-Stack Software Development"}"
- Diagnostic Baseline Score: ${diagnosticScore || 50}%
- Target Level Tier: ${skillLevel || "INTERMEDIATE"}
- Weekly Commitment: ${weeklyHours || 5} hours per week

User Diagnostic Responses:
${answersSummary || "Answers provided: Intermediate performance across core technical modules."}

Task: Recommend the exact high-impact skills to learn next to bridge gaps and achieve mastery in ${trackName}. Output ONLY valid JSON.`;

    const rawContent = await callOpenRouter({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2200,
      response_format: { type: "json_object" },
    });

    const cleaned = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed: AIRecommendationResult = JSON.parse(cleaned);

    if (!parsed || !parsed.recommendedSkills || parsed.recommendedSkills.length === 0) {
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
