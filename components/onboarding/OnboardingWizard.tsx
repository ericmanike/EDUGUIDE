"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Code2,
  Database,
  Smartphone,
  Cloud,
  ShieldCheck,
  Palette,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BrainCircuit,
  Clock,
  BookOpen,
  Target,
  Award,
  Zap,
  BarChart3,
  GraduationCap,
  Check,
  Star,
  RefreshCw,
  Cpu,
  Layers,
  Loader2,
  TrendingUp,
  ListChecks,
  Split,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { AIRecommendationResult } from "@/app/api/onboarding/recommend-skills/route";
import { fetchLearningPaths, LearningPath, enrollInLearningPath } from "@/lib/api";
import { LogoSpinner } from "@/components/ui/LogoSpinner";

// Types
export interface OnboardingData {
  trackId: string;
  trackName: string;
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  diagnosticAnswers: Record<string, number>; // questionId -> score (1-5)
  weeklyHours: number;
  learningStyles: string[];
  diagnosticScore: number; // calculated 0 - 100
  aiRecommendation?: AIRecommendationResult | null;
}

interface TrackOption {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  popular?: boolean;
  color: string;
  bgLight: string;
  borderAccent: string;
  skills: string[];
}

export interface DiagnosticQuestion {
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

function mapLearningPathToTrack(lp: LearningPath): TrackOption {
  const lowerTitle = lp.title.toLowerCase();
  let Icon = Code2;
  let category = "Software Engineering";
  let color = "text-blue-600";
  let bgLight = "bg-blue-50/80";
  let borderAccent = "border-blue-500";

  if (lowerTitle.includes("ai") || lowerTitle.includes("machine learning") || lowerTitle.includes("data")) {
    Icon = BrainCircuit;
    category = "Artificial Intelligence";
    color = "text-[#1e3a8a]";
  } else if (lowerTitle.includes("cloud") || lowerTitle.includes("devops") || lowerTitle.includes("docker")) {
    Icon = Cloud;
    category = "Infrastructure";
    color = "text-sky-600";
  } else if (lowerTitle.includes("mobile") || lowerTitle.includes("ios") || lowerTitle.includes("android")) {
    Icon = Smartphone;
    category = "Cross-Platform";
    color = "text-emerald-600";
  } else if (lowerTitle.includes("security") || lowerTitle.includes("cyber")) {
    Icon = ShieldCheck;
    category = "Security";
    color = "text-amber-600";
  } else if (lowerTitle.includes("ui") || lowerTitle.includes("ux") || lowerTitle.includes("design")) {
    Icon = Palette;
    category = "Design & Product";
    color = "text-pink-600";
  }

  return {
    id: lp.id,
    title: lp.title,
    category,
    description: lp.description || `Master ${lp.title} competencies and enterprise architecture.`,
    icon: Icon,
    color,
    bgLight,
    borderAccent,
    skills: lp.skillsCovered && lp.skillsCovered.length > 0 ? lp.skillsCovered : [lp.title, "Core Fundamentals"],
  };
}

const LEARNING_STYLE_OPTIONS = [
  { id: "projects", label: "Hands-on Interactive Projects", icon: Code2, desc: "Learn by building real software" },
  { id: "challenges", label: "Algorithmic Challenges & Quizzes", icon: Target, desc: "Test knowledge with active recall" },
  { id: "guided", label: "Structured Video & Guided Paths", icon: BookOpen, desc: "Follow step-by-step masterclasses" },
  { id: "ai-tutor", label: "AI Tutor & Real-Time Mentorship", icon: BrainCircuit, desc: "Get instant code feedback" },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Dynamic Learning Paths State (always sourced live from the backend catalog)
  const [tracks, setTracks] = useState<TrackOption[]>([]);
  const [isLoadingPaths, setIsLoadingPaths] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form states
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQuestion[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // Fetch the full live learning-path catalog, then generate the 10-question
  // AI diagnostic assessment spanning all of those tracks. No mock/fallback data.
  const loadLearningPathsAndAssessment = async () => {
    setIsLoadingPaths(true);
    setLoadError(null);
    try {
      const backendPaths = await fetchLearningPaths();
      if (!backendPaths || backendPaths.length === 0) {
        setTracks([]);
        setLoadError("No learning paths are currently available from the server. Please try again later.");
        return;
      }
      const mappedTracks = backendPaths.map(mapLearningPathToTrack);
      setTracks(mappedTracks);
      setSelectedTrack(mappedTracks[0].id);
      setIsLoadingPaths(false);
      await fetchAIGeneratedAssessment(mappedTracks);
      return;
    } catch (err) {
      console.error("Failed to load learning paths from backend:", err);
      setTracks([]);
      setLoadError("Failed to load learning paths from the server. Please try again.");
    } finally {
      setIsLoadingPaths(false);
    }
  };

  useEffect(() => {
    loadLearningPathsAndAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Adaptive Question State (1 question at a time)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [placementConfidence, setPlacementConfidence] = useState<number>(50); // Starts at 50%
  const [currentBranch, setCurrentBranch] = useState<"gatekeeper" | "foundational" | "advanced">("gatekeeper");

  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, number>>({});
  const [weeklyHours, setWeeklyHours] = useState<number>(5);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["projects", "ai-tutor"]);

  // AI Recommendation State
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendationResult | null>(null);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState("Sending responses to OpenRouter AI...");
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute Diagnostic Score & Recommended Level
  const answerEntries = Object.entries(diagnosticAnswers);
  const totalDiagnosticScore = answerEntries.reduce((acc, [, score]) => acc + score, 0);
  const maxPossibleScore = Math.max(1, Math.max(1, answerEntries.length) * 5);
  const diagnosticPercentage = answerEntries.length === 0 ? 50 : Math.round((totalDiagnosticScore / maxPossibleScore) * 100);

  const getRecommendedLevel = (): "BEGINNER" | "INTERMEDIATE" | "ADVANCED" => {
    if (diagnosticPercentage < 40) return "BEGINNER";
    if (diagnosticPercentage < 75) return "INTERMEDIATE";
    return "ADVANCED";
  };

  const activeTrackDetails = tracks.find((t) => t.id === selectedTrack) || tracks[0];

  // Fetch AI generated adaptive diagnostic questions (10 questions) spanning the full live track catalog
  const fetchAIGeneratedAssessment = async (availableTracks: TrackOption[]) => {
    setIsGeneratingQuestions(true);
    setAssessmentError(null);
    try {
      const res = await fetch("/api/onboarding/generate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availableTracks: availableTracks.map((t) => ({
            id: t.id,
            title: t.title,
            category: t.category,
            description: t.description,
            skills: t.skills,
          })),
        }),
      });

      const data = await res.json();
      console.log("AI Assessment Data:", data);
      
      if (!res.ok || !data.success || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(data.error || "The AI did not return any diagnostic questions.");
      }

      setDiagnosticQuestions(data.questions);
      setActiveQuestionIndex(0);
      setAnsweredCount(0);
      setPlacementConfidence(50);
      setDiagnosticAnswers({});
      setCurrentBranch("gatekeeper");
    } catch (err: any) {
      console.error("Failed to generate AI assessment questions:", err);
      setAssessmentError(err.message || "Failed to generate the diagnostic assessment. Please try again.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Handle option selection for 1-question-at-a-time adaptive branching
  const handleSelectOption = (q: DiagnosticQuestion, opt: { label: string; score: number; nextBranch?: "foundational" | "advanced" }) => {
    // 1. Record score for question
    setDiagnosticAnswers((prev) => ({ ...prev, [q.id]: opt.score }));
    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);

    // 2. Increase placement confidence
    const nextConfidence = Math.min(98, 50 + newAnsweredCount * 5);
    setPlacementConfidence(nextConfidence);

    // 3. Branching logic
    if (q.category === "gatekeeper" && opt.nextBranch) {
      setCurrentBranch(opt.nextBranch);
    }

    // 4. Advance to next question, or move to recommendations once all questions are answered
    const isLastQuestion = activeQuestionIndex >= diagnosticQuestions.length - 1;
    if (isLastQuestion) {
      toast.success("Assessment complete! Analyzing your responses...");
      // Auto move to step 2 recommendations after brief delay
      setTimeout(async () => {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
        await generateAISkillRecommendations();
      }, 400);
    } else {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  // Generate AI Skill Recommendations & Track Matching using OpenRouter API
  const generateAISkillRecommendations = async () => {
    setIsGeneratingRecommendation(true);
    setRecommendationError(null);
    setLoadingStepText("Matching optimal learning path...");

    setTimeout(() => {
      setLoadingStepText("Evaluating skill gap matrix & mastery baseline...");
    }, 900);

    setTimeout(() => {
      setLoadingStepText("Synthesizing recommended track, skills & weekly roadmap...");
    }, 1800);

    try {
      const payload = {
        availableTracks: tracks.map((t) => ({
          id: t.id,
          title: t.title,
          category: t.category,
          description: t.description,
          skills: t.skills,
        })),
        selectedTrackId: selectedTrack,
        selectedTrackTitle: activeTrackDetails?.title,
        skillLevel: getRecommendedLevel(),
        diagnosticAnswers,
        weeklyHours,
        learningStyles: selectedStyles,
        diagnosticScore: diagnosticPercentage,
        questions: diagnosticQuestions,
      };

      const res = await fetch("/api/onboarding/recommend-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.recommendation) {
        throw new Error(data.error || "The AI did not return a course recommendation.");
      }

      setAiRecommendation(data.recommendation);
      if (data.recommendation.recommendedTrackId) {
        setSelectedTrack(data.recommendation.recommendedTrackId);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("edtech_ai_recommendations", JSON.stringify(data.recommendation));
      }
    } catch (error: any) {
      console.error("Failed to generate AI skill recommendations:", error);
      setAiRecommendation(null);
      setRecommendationError(error.message || "Failed to generate your course recommendation. Please try again.");
    } finally {
      setIsGeneratingRecommendation(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleLearningStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]
    );
  };

  const handleFinishOnboarding = async () => {
    if (!aiRecommendation) return;
    setIsSubmitting(true);

    const finalTrackId = aiRecommendation.recommendedTrackId || selectedTrack;
    const matchedTrack = tracks.find((t) => t.id === finalTrackId) || activeTrackDetails;
    const finalTrackTitle = aiRecommendation.recommendedTrackTitle || matchedTrack?.title || "";
    const finalLevel = aiRecommendation.recommendedLevelTier;

    const trackNameWithLevel = finalTrackTitle.includes("(")
      ? finalTrackTitle
      : `${finalTrackTitle} (${finalLevel})`;

    const onboardingSummary: OnboardingData = {
      trackId: finalTrackId,
      trackName: trackNameWithLevel,
      skillLevel: finalLevel,
      diagnosticAnswers,
      weeklyHours,
      learningStyles: selectedStyles,
      diagnosticScore: diagnosticPercentage,
      aiRecommendation,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("edtech_onboarding", JSON.stringify(onboardingSummary));
      document.cookie = `edtech_onboarded=true; path=/; max-age=31536000; SameSite=Lax`;
    }

    // Persist enrollment in database for AI recommended learning path
    await enrollInLearningPath(finalTrackId);

    toast.success(`Enrolled in ${trackNameWithLevel}! Redirecting...`);

    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1200);
  };

  const currentQuestion = diagnosticQuestions[activeQuestionIndex] || diagnosticQuestions[0];

  // No learning paths loaded yet, or the live catalog fetch failed — never fall back to mock tracks.
  if (isLoadingPaths) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-4">
        <ToastContainer position="top-right" autoClose={3000} />
        <Loader2 className="w-10 h-10 text-[#1e3a8a] animate-spin" />
        <p className="text-sm font-bold text-slate-700">Welcome to skillsBank. please wait </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-4 text-center">
        <ToastContainer position="top-right" autoClose={3000} />
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <p className="text-sm font-bold text-slate-700">{loadError}</p>
        <button
          onClick={loadLearningPathsAndAssessment}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header & Stepper */}
      <div className="text-center space-y-3 mb-10">
      
<h2 className="text-2xl font-bold text-slate-800">Kindly Answer These Questions To Get Started</h2>
        {/* Step Progress Bar */}
        <div className="pt-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between relative mb-2">
            {[
              { step: 1, title: "Onboarding Assessment" },
              { step: 2, title: "Recommended Course" },
            ].map((s) => {
              const isPassed = currentStep > s.step;
              const isCurrent = currentStep === s.step;

              return (
                <div key={s.step} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isPassed
                        ? "bg-[#1e3a8a] text-white shadow-md shadow-[#1e3a8a]/20"
                        : isCurrent
                        ? "bg-[#fb923c] text-white ring-4 ring-[#fb923c]/20 shadow-md"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {isPassed ? <Check className="w-5 h-5 stroke-[2.5]" /> : s.step}
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 hidden sm:block ${
                      isCurrent ? "text-[#1e3a8a]" : isPassed ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}

            {/* Connecting line */}
            <div className="absolute top-5 left-5 right-5 h-[3px] bg-slate-200 -z-0 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1e3a8a] to-[#fb923c] transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 1) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: ADAPTIVE PLACEMENT ASSESSMENT (1 QUESTION AT A TIME) */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/40 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-50 text-[#fb923c]">
                  <Split className="w-5 h-5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Step 1: Onboarding  Assessment
                </h2>
              </div>
            </div>
          </div>

          {/* 1 QUESTION AT A TIME CARD */}
          {isGeneratingQuestions ? (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#1e3a8a] animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">
               Please wait while we Generate your  diagnostic assessment...
              </p>
            </div>
          ) : assessmentError ? (
            <div className="py-16 text-center space-y-4">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-sm font-bold text-slate-700">{assessmentError}</p>
              <button
                onClick={() => fetchAIGeneratedAssessment(tracks)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-md transition-all cursor-pointer mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : currentQuestion ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Question Header */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#1e3a8a] text-white text-[11px] font-extrabold uppercase tracking-wide">
                    Question {activeQuestionIndex + 1} of {diagnosticQuestions.length}
                  </span>
                  {currentQuestion.targetSkill && (
                    <span className="text-xs font-bold text-slate-400">
                      Topic: {currentQuestion.targetSkill}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options as 1-tap Cards */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt, oIdx) => {
                  const isSelected = diagnosticAnswers[currentQuestion.id] === opt.score;
                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQuestion, opt)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99] ${
                        isSelected
                          ? "border-[#1e3a8a] bg-blue-50/70 text-[#1e3a8a] shadow-md ring-2 ring-[#1e3a8a]/20"
                          : "border-slate-200 bg-white text-slate-700 hover:border-[#1e3a8a] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-[#1e3a8a] text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-[#1e3a8a] group-hover:text-white"
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="text-sm font-bold text-slate-800 group-hover:text-[#1e3a8a]">
                          {opt.label}
                        </span>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1e3a8a] group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })}
              </div>

              {/* Progress Footer */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-4">
                <span>Tap any option to advance automatically</span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* STEP 2: AI REVEAL & TRACK RECOMMENDATION SUMMARY */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/40 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {isGeneratingRecommendation ? (
            <div className="py-20 flex justify-center">
              <LogoSpinner size="lg" text={loadingStepText || "Generating AI Skill Recommendations..."} />
            </div>
          ) : recommendationError ? (
            <div className="py-20 text-center space-y-4">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-sm font-bold text-slate-700">{recommendationError}</p>
              <button
                onClick={generateAISkillRecommendations}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-md transition-all cursor-pointer mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : aiRecommendation ? (
            <>
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <GraduationCap className="w-64 h-64 text-white" />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex flex-wrap items-center justify-end gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-300">Recommendation Confidence:</span>
                      <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-sm rounded-lg">
                        {aiRecommendation.matchScorePercent}% Confidence
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Your Personalized Learning Pathway
                    </h2>
                  </div>

                  {/* Summary Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <p className="text-[11px] font-semibold text-slate-300 uppercase mb-1">Best Course Base On Your Experience</p>
                      <p className="text-white font-bold text-sm sm:text-base leading-snug">
                        {activeTrackDetails?.title}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <p className="text-[11px] font-semibold text-slate-300 uppercase">Level</p>
                      <p className="text-base font-bold text-amber-300 mt-1">
                        {aiRecommendation.recommendedLevelTier}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths Grid */}
              <div className="grid grid-cols-1 gap-6">
                <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Demonstrated Baseline Strengths
                  </h3>
                  <ul className="space-y-2">
                    {aiRecommendation.strengths.map((str, idx) => (
                      <li key={idx} className="text-xs font-semibold text-emerald-950 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* TRACK SWITCHER SELECTION GRID */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1e3a8a]" />
                    Available Learning Tracks (Tap to Switch)
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    Switch your target course anytime
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tracks.map((t) => {
                    const isSelected = selectedTrack === t.id;
                    const IconComponent = t.icon;

                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTrack(t.id);
                          if (aiRecommendation) {
                            setAiRecommendation({
                              ...aiRecommendation,
                              recommendedTrackId: t.id,
                              recommendedTrackTitle: t.title,
                            });
                          }
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "border-[#1e3a8a] bg-blue-50/70 shadow-md ring-2 ring-[#1e3a8a]/20"
                            : "border-slate-200 bg-white hover:border-[#1e3a8a]/50 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2.5 rounded-xl bg-slate-100 ${t.color} shrink-0`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {t.title}
                          </h4>
                        </div>

                        {isSelected && (
                          <span className="px-2.5 py-1 rounded-full bg-[#1e3a8a] text-white text-[10px] font-bold shrink-0">
                            Selected
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>


              {/* Final CTA Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <button
                  onClick={
                    (e) => {
                       window.location.reload()
                      handlePrevStep();
                     ;
                    }
                    
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Adjust Answers
                </button>

                <button
                  onClick={handleFinishOnboarding}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white font-bold text-base shadow-lg shadow-[#1e3a8a]/30 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Please wait..</span>
                  ) : (
                    <>
                      Enroll in Course
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
