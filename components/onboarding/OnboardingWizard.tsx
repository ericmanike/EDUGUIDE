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
} from "lucide-react";
import { AIRecommendationResult } from "@/app/api/onboarding/recommend-skills/route";

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

const TRACKS: TrackOption[] = [
  {
    id: "web-dev",
    title: "Full-Stack Web Development",
    category: "Software Engineering",
    description: "Master modern React, Next.js, Node.js, databases, and enterprise architecture.",
    icon: Code2,
    popular: true,
    color: "text-blue-600",
    bgLight: "bg-blue-50/80",
    borderAccent: "border-blue-500",
    skills: ["React & Next.js", "TypeScript", "Node.js & APIs", "SQL & Postgres"],
  },
  {
    id: "ai-data",
    title: "AI & Data Science",
    category: "Artificial Intelligence",
    description: "Build Machine Learning models, Neural Networks, Python analytics & LLM pipelines.",
    icon: BrainCircuit,
    popular: true,
    color: "text-[#1e3a8a]",
    bgLight: "bg-blue-50/80",
    borderAccent: "border-[#1e3a8a]",
    skills: ["Python & PyTorch", "Data Wrangling", "Machine Learning", "LLM Fine-Tuning"],
  },
  {
    id: "cloud-devops",
    title: "Cloud Architecture & DevOps",
    category: "Infrastructure",
    description: "Deploy scalable microservices with Docker, Kubernetes, AWS, and CI/CD pipelines.",
    icon: Cloud,
    color: "text-sky-600",
    bgLight: "bg-sky-50/80",
    borderAccent: "border-sky-500",
    skills: ["Docker & Kubernetes", "AWS & Terraform", "CI/CD Pipelines", "System Design"],
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    category: "Cross-Platform",
    description: "Craft performant iOS & Android mobile applications using React Native & Flutter.",
    icon: Smartphone,
    color: "text-emerald-600",
    bgLight: "bg-emerald-50/80",
    borderAccent: "border-emerald-500",
    skills: ["React Native", "iOS & Android", "State Management", "Mobile APIs"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Ethic Hacking",
    category: "Security",
    description: "Learn penetration testing, network defense, cryptography, and cloud auditing.",
    icon: ShieldCheck,
    color: "text-amber-600",
    bgLight: "bg-amber-50/80",
    borderAccent: "border-amber-500",
    skills: ["Network Defense", "Penetration Testing", "Cryptography", "Security Compliance"],
  },
  {
    id: "uiux-design",
    title: "UI/UX & Product Design",
    category: "Design & Product",
    description: "Design intuitive user interfaces, user research, wireframing, and Figma design systems.",
    icon: Palette,
    color: "text-pink-600",
    bgLight: "bg-pink-50/80",
    borderAccent: "border-pink-500",
    skills: ["Figma Systems", "User Research", "Wireframing", "Interactive Prototypes"],
  },
];

// Short 1 to 2 line questions with Gatekeeper Adaptive Branching
const DEFAULT_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "q1",
    question: "Have you written code, scripts, or built applications before?",
    category: "gatekeeper",
    targetSkill: "Gatekeeper Baseline",
    options: [
      { label: "No prior coding experience", score: 1, nextBranch: "foundational" },
      { label: "Written basic scripts or completed tutorials", score: 2, nextBranch: "foundational" },
      { label: "Built functional projects independently", score: 4, nextBranch: "advanced" },
      { label: "Work professionally as a software engineer", score: 5, nextBranch: "advanced" },
    ],
  },
  {
    id: "q2_foundational",
    question: "How do you store and loop through lists of data in code?",
    category: "foundational",
    targetSkill: "Programming Basics",
    options: [
      { label: "Unfamiliar with loops or data arrays", score: 1 },
      { label: "Use basic for-loops & list iteration", score: 2 },
      { label: "Use array transformation methods (map/filter)", score: 4 },
      { label: "Optimize data structure complexity & memory", score: 5 },
    ],
  },
  {
    id: "q2_advanced",
    question: "How do you handle REST APIs, HTTP requests, and state in apps?",
    category: "advanced",
    targetSkill: "APIs & State Management",
    options: [
      { label: "Haven't built or connected APIs yet", score: 1 },
      { label: "Fetch REST endpoints in UI components", score: 2 },
      { label: "Manage global state (Redux/Zustand) & caching", score: 4 },
      { label: "Architect microservices, GraphQL, or RPC pipelines", score: 5 },
    ],
  },
  {
    id: "q3",
    question: "What is your experience working with databases (SQL or NoSQL)?",
    category: "foundational",
    targetSkill: "Databases & Persistence",
    options: [
      { label: "Never created or queried databases", score: 1 },
      { label: "Write basic SELECT and INSERT queries", score: 2 },
      { label: "Design tables, JOINs, ORMs, and migrations", score: 4 },
      { label: "Optimize query indexing, sharding, & performance", score: 5 },
    ],
  },
  {
    id: "q4",
    question: "How do you test code and deploy applications to production?",
    category: "advanced",
    targetSkill: "Testing & Deployment",
    options: [
      { label: "Manual click-testing in browser or console", score: 1 },
      { label: "Write basic unit tests occasionally", score: 2 },
      { label: "Implement automated test suites (Jest/Vitest)", score: 4 },
      { label: "Maintain CI/CD automated deployment pipelines", score: 5 },
    ],
  },
];

const LEARNING_STYLE_OPTIONS = [
  { id: "projects", label: "Hands-on Interactive Projects", icon: Code2, desc: "Learn by building real software" },
  { id: "challenges", label: "Algorithmic Challenges & Quizzes", icon: Target, desc: "Test knowledge with active recall" },
  { id: "guided", label: "Structured Video & Guided Paths", icon: BookOpen, desc: "Follow step-by-step masterclasses" },
  { id: "ai-tutor", label: "AI Tutor & Real-Time Mentorship", icon: BrainCircuit, desc: "Get instant code feedback" },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [selectedTrack, setSelectedTrack] = useState<string>("web-dev");
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQuestion[]>(DEFAULT_DIAGNOSTIC_QUESTIONS);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

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

  const activeTrackDetails = TRACKS.find((t) => t.id === selectedTrack) || TRACKS[0];

  // Fetch AI generated adaptive diagnostic questions based on selected Learning Path track
  const fetchAIGeneratedAssessment = async (track: TrackOption) => {
    setIsGeneratingQuestions(true);
    try {
      const res = await fetch("/api/onboarding/generate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackTitle: track.title,
          trackDescription: track.description,
          skills: track.skills,
          level: getRecommendedLevel(),
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setDiagnosticQuestions(data.questions);
        setActiveQuestionIndex(0);
        setAnsweredCount(0);
        setPlacementConfidence(50);
        setDiagnosticAnswers({});
        setCurrentBranch("gatekeeper");
      }
    } catch (err) {
      console.warn("Failed to generate AI assessment questions:", err);
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
    const nextConfidence = Math.min(98, 50 + newAnsweredCount * 15 + (opt.score >= 4 ? 8 : 4));
    setPlacementConfidence(nextConfidence);

    // 3. Branching logic
    if (q.category === "gatekeeper" && opt.nextBranch) {
      setCurrentBranch(opt.nextBranch);
    }

    // 4. Advance to next question or trigger early stopping once placement confidence > 85% or reached end
    if (newAnsweredCount >= 4 || nextConfidence >= 88 || activeQuestionIndex >= diagnosticQuestions.length - 1) {
      toast.success("Placement placement confidence high! Calibration complete.");
      // Auto move to step 3 after brief delay or let user proceed
      setTimeout(() => {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 400);
    } else {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  // Generate AI Skill Recommendations using OpenRouter API
  const generateAISkillRecommendations = async () => {
    setIsGeneratingRecommendation(true);
    setLoadingStepText("Sending assessment responses to OpenRouter AI model...");

    setTimeout(() => {
      setLoadingStepText("Evaluating skill gap matrix & mastery baseline...");
    }, 900);

    setTimeout(() => {
      setLoadingStepText("Synthesizing recommended skills & weekly roadmap...");
    }, 1800);

    try {
      const payload = {
        trackId: selectedTrack,
        trackName: activeTrackDetails.title,
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
      if (data.success && data.recommendation) {
        setAiRecommendation(data.recommendation);
        if (typeof window !== "undefined") {
          localStorage.setItem("edtech_ai_recommendations", JSON.stringify(data.recommendation));
        }
      }
    } catch (error) {
      console.error("Failed to generate AI skill recommendations:", error);
    } finally {
      setIsGeneratingRecommendation(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Trigger AI adaptive question generation for selected track
      await fetchAIGeneratedAssessment(activeTrackDetails);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 3) {
      // Submit responses to AI model for skill recommendations
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      await generateAISkillRecommendations();
    } else if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleLearningStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]
    );
  };

  const handleFinishOnboarding = () => {
    setIsSubmitting(true);

    const onboardingSummary: OnboardingData = {
      trackId: selectedTrack,
      trackName: activeTrackDetails.title,
      skillLevel: getRecommendedLevel(),
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

    toast.success("Onboarding & Diagnostic Assessment complete! Redirecting...");

    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1200);
  };

  const currentQuestion = diagnosticQuestions[activeQuestionIndex] || diagnosticQuestions[0];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header & Stepper */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Customize Your Learning Experience
        </h1>

        {/* Step Progress Bar */}
        <div className="pt-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between relative mb-2">
            {[
              { step: 1, title: "Target Path" },
              { step: 2, title: "Adaptive Assessment" },
              { step: 3, title: "Commitment" },
              { step: 4, title: "Skill Recommendations" },
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
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: TRACK SELECTION */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/40 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Step 1: Choose Your Primary Focus Learning Path
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select the learning path you want to master. We will launch an adaptive 3-to-4 question placement check.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRACKS.map((track) => {
              const Icon = track.icon;
              const isSelected = selectedTrack === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-[#1e3a8a] bg-blue-50/60 text-[#1e3a8a] shadow-md ring-2 ring-[#1e3a8a]/20 font-bold"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                        isSelected ? "bg-[#1e3a8a] text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {track.title}
                    </span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 fill-[#1e3a8a] text-white shrink-0 ml-1" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-md shadow-[#1e3a8a]/25 transition-all cursor-pointer active:scale-[0.98]"
            >
              Start Adaptive Assessment for {activeTrackDetails.title}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ADAPTIVE BRANCHING ASSESSMENT (1 QUESTION AT A TIME) */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/40 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-50 text-[#fb923c]">
                  <Split className="w-5 h-5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Step 2: Adaptive Placement Assessment
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Short 1-to-2 line gatekeeper questions to quickly determine your baseline tier for{" "}
                <span className="font-bold text-[#1e3a8a]">{activeTrackDetails.title}</span>.
              </p>
            </div>

          </div>

          {/* 1 QUESTION AT A TIME CARD */}
          {isGeneratingQuestions ? (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#1e3a8a] animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                Calibrating adaptive gatekeeper questions for {activeTrackDetails.title}...
              </p>
            </div>
          ) : currentQuestion ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Question Header */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#1e3a8a] text-white text-[11px] font-extrabold uppercase tracking-wide">
                    {currentQuestion.category === "gatekeeper" ? "⚡ Gatekeeper Split Question" : `🎯 ${currentQuestion.category?.toUpperCase()} Branch`}
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
                {placementConfidence >= 85 && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Placement Confidence Calibrated
                  </span>
                )}
              </div>
            </div>
          ) : null}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tracks
            </button>

            <button
              onClick={() => {
                setCurrentStep(3);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Skip to Commitment & Format
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: COMMITMENT */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/40 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Step 3: Define Your Learning Pace
            </h2>
          </div>

          {/* Weekly Hours Presets */}
          <div className="space-y-4 bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#fb923c]" />
                Weekly Study Time Commitment
              </label>
              <span className="px-3 py-1 bg-[#1e3a8a] text-white rounded-lg text-xs font-bold shadow-xs">
                {weeklyHours} Hours / Week
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { hours: 3, label: "Casual (2-4 hrs/wk)" },
                { hours: 7, label: "Regular (5-8 hrs/wk)" },
                { hours: 12, label: "Intensive (10-15 hrs/wk)" },
                { hours: 25, label: "Full-Time (20+ hrs/wk)" },
              ].map((item) => (
                <button
                  key={item.hours}
                  type="button"
                  onClick={() => setWeeklyHours(item.hours)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    weeklyHours === item.hours
                      ? "border-[#1e3a8a] bg-white text-[#1e3a8a] font-bold shadow-sm ring-2 ring-[#1e3a8a]/20"
                      : "border-slate-200 bg-white/60 text-slate-600 hover:bg-white hover:border-slate-300 text-xs font-semibold"
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">{item.hours} hrs/wk</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-md shadow-[#1e3a8a]/25 transition-all cursor-pointer active:scale-[0.98]"
            >
              Get My AI  Skill Recommendations
              <Sparkles className="w-4 h-4 text-[#fb923c]" />
            </button>
          </div> 
        </div>
      )}

      {/* STEP 4: AI REVEAL & SKILL RECOMMENDATION SUMMARY */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/40 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {isGeneratingRecommendation ? (
            <div className="py-20 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-[#1e3a8a] animate-spin" />
                <BrainCircuit className="w-8 h-8 text-[#fb923c]" />
              </div>
        
            </div>
          ) : (
            <>
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <GraduationCap className="w-64 h-64 text-white" />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex flex-wrap items-center justify-end gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-300">Placement Confidence:</span>
                      <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-sm rounded-lg">
                        {aiRecommendation?.matchScorePercent || 96}% Confidence
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Recommended Skills & Learning   Roadmap
                    </h2>
                    <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                      {aiRecommendation?.overallEvaluation ||
                        `Based on your adaptive assessment placement score of ${diagnosticPercentage}%, OpenRouter AI has recommended the optimal technical skills to learn next for ${activeTrackDetails.title}.`}
                    </p>
                  </div>

                  {/* Summary Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <p className="text-[11px] font-semibold text-slate-300 uppercase">Selected Track</p>
                      <p className="text-base font-bold text-white mt-1">{activeTrackDetails.title}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <p className="text-[11px] font-semibold text-slate-300 uppercase">Starting Placement</p>
                      <p className="text-base font-bold text-amber-300 mt-1">
                        {aiRecommendation?.recommendedLevelTier || getRecommendedLevel()} Tier
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <p className="text-[11px] font-semibold text-slate-300 uppercase">Velocity Commitment</p>
                      <p className="text-base font-bold text-white mt-1">{weeklyHours} hours / week</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI RECOMMENDED SKILLS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#fb923c]" />
                    AI Recommended Skills to Learn (Priority Ranked)
                  </h3>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(aiRecommendation?.recommendedSkills || [
                    {
                      name: `${activeTrackDetails.title} Architecture`,
                      category: "Core Engineering",
                      priority: "CRITICAL",
                      whyRecommended: "Essential foundation tailored to adaptive placement.",
                      estimatedHours: 12,
                    },
                    {
                      name: "REST API & Async Data Flows",
                      category: "Backend Integration",
                      priority: "HIGH",
                      whyRecommended: "Bridges network & state handling gaps.",
                      estimatedHours: 10,
                    },
                  ]).map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                            {skill.category}
                          </span>
                          <h4 className="text-base font-bold text-slate-900">{skill.name}</h4>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
                            skill.priority === "CRITICAL"
                              ? "bg-red-100 text-red-700"
                              : skill.priority === "HIGH"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {skill.priority} PRIORITY
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {skill.whyRecommended}
                      </p>

                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-200/60">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Est. ~{skill.estimatedHours} hours
                        </span>
                        {skill.prerequisite && (
                          <span className="text-slate-400">Prereq: {skill.prerequisite}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Knowledge Gaps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Demonstrated Baseline Strengths
                  </h3>
                  <ul className="space-y-2">
                    {(aiRecommendation?.strengths || [
                      "Strong logical problem solving mindset",
                      "Good comprehension of modern software workflows",
                    ]).map((str, idx) => (
                      <li key={idx} className="text-xs font-semibold text-emerald-950 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl border border-amber-100 bg-amber-50/40 space-y-3">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    Target Knowledge Growth Areas
                  </h3>
                  <ul className="space-y-2">
                    {(aiRecommendation?.knowledgeGaps || [
                      "Advanced state management & error boundaries",
                      "Database query tuning & production security",
                    ]).map((gap, idx) => (
                      <li key={idx} className="text-xs font-semibold text-amber-950 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Weekly Action Roadmap */}
              {aiRecommendation?.weeklyPlan && aiRecommendation.weeklyPlan.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-[#1e3a8a]" />
                  Customized Weekly Learning Roadmap
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {aiRecommendation.weeklyPlan.map((wp) => (
                      <div
                        key={wp.week}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#1e3a8a] text-white text-[10px] font-bold">
                            WEEK {wp.week}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{wp.focus}</h4>
                        <p className="text-[11px] text-slate-600 font-medium leading-normal">
                          <span className="font-bold text-slate-800">Outcome:</span> {wp.deliverable}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final CTA Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <button
                  onClick={handlePrevStep}
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
                    <span>Please wait...</span>
                  ) : (
                    <>
                     Enroll Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
