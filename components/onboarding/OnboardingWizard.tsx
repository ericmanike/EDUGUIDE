"use client";

import React, { useState } from "react";
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
} from "lucide-react";

// Types
export interface OnboardingData {
  trackId: string;
  trackName: string;
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  diagnosticAnswers: Record<string, number>; // questionId -> score (1-5)
  weeklyHours: number;
  learningStyles: string[];
  diagnosticScore: number; // calculated 0 - 100
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
    color: "text-purple-600",
    bgLight: "bg-purple-50/80",
    borderAccent: "border-purple-500",
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

// Diagnostic questions
const DIAGNOSTIC_QUESTIONS = [
  {
    id: "q1",
    question: "How comfortable are you with programming fundamentals (variables, loops, functions)?",
    options: [
      { label: "Complete beginner (No prior coding)", score: 1 },
      { label: "Basic understanding (Written small scripts)", score: 2 },
      { label: "Proficient (Built small applications)", score: 4 },
      { label: "Advanced (Work professionally as a developer)", score: 5 },
    ],
  },
  {
    id: "q2",
    question: "What is your level of experience with version control (Git & GitHub)?",
    options: [
      { label: "Never used Git", score: 1 },
      { label: "Know basic commits & push/pull", score: 2 },
      { label: "Comfortable with branching & PRs", score: 4 },
      { label: "Expert in Git rebasing & CI/CD workflows", score: 5 },
    ],
  },
  {
    id: "q3",
    question: "How do you approach solving a complex software logic problem?",
    options: [
      { label: "I need step-by-step guidance", score: 1 },
      { label: "I search for code snippets and adapt them", score: 3 },
      { label: "I break down the problem into sub-modules independently", score: 4 },
      { label: "I design data structures and architecture first", score: 5 },
    ],
  },
  {
    id: "q4",
    question: "How experienced are you with databases and data structures (SQL, Postgres, ORMs)?",
    options: [
      { label: "Never worked with databases", score: 1 },
      { label: "Basic SQL queries (SELECT, INSERT, simple WHERE)", score: 2 },
      { label: "Intermediate (JOINs, indexing, schema design, ORMs)", score: 4 },
      { label: "Advanced (Query tuning, migration strategies, replication)", score: 5 },
    ],
  },
  {
    id: "q5",
    question: "What is your familiarity with API protocols and web architecture (REST, GraphQL, microservices)?",
    options: [
      { label: "No experience with APIs", score: 1 },
      { label: "Consumed REST APIs in frontend apps or scripts", score: 2 },
      { label: "Built custom backend REST endpoints & auth middleware", score: 4 },
      { label: "Architected microservices, GraphQL, or distributed systems", score: 5 },
    ],
  },
  {
    id: "q6",
    question: "How do you test and maintain software quality in your projects?",
    options: [
      { label: "Manual testing in browser / console logs", score: 1 },
      { label: "Write basic unit tests occasionally", score: 2 },
      { label: "Comfortable with TDD, Jest/Vitest, and integration testing", score: 4 },
      { label: "Implement complete CI/CD automated test pipelines & monitoring", score: 5 },
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
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, number>>({
    q1: 2,
    q2: 2,
    q3: 3,
    q4: 2,
    q5: 2,
    q6: 3,
  });
  const [weeklyHours, setWeeklyHours] = useState<number>(5);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["projects", "ai-tutor"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute Diagnostic Score & Recommended Level
  const totalDiagnosticScore = Object.values(diagnosticAnswers).reduce((a, b) => a + b, 0);
  const maxPossibleScore = DIAGNOSTIC_QUESTIONS.length * 5;
  const diagnosticPercentage = Math.round((totalDiagnosticScore / maxPossibleScore) * 100);

  const getRecommendedLevel = (): "BEGINNER" | "INTERMEDIATE" | "ADVANCED" => {
    if (diagnosticPercentage < 40) return "BEGINNER";
    if (diagnosticPercentage < 75) return "INTERMEDIATE";
    return "ADVANCED";
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
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

  const handleDiagnosticAnswer = (qId: string, score: number) => {
    setDiagnosticAnswers((prev) => ({ ...prev, [qId]: score }));
  };

  const toggleLearningStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]
    );
  };

  const handleFinishOnboarding = () => {
    setIsSubmitting(true);

    const activeTrackObj = TRACKS.find((t) => t.id === selectedTrack) || TRACKS[0];

    const onboardingSummary: OnboardingData = {
      trackId: selectedTrack,
      trackName: activeTrackObj.title,
      skillLevel: getRecommendedLevel(),
      diagnosticAnswers,
      weeklyHours,
      learningStyles: selectedStyles,
      diagnosticScore: diagnosticPercentage,
    };

    // Store preferences locally
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

  const activeTrackDetails = TRACKS.find((t) => t.id === selectedTrack) || TRACKS[0];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header & Stepper */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-bold tracking-wide uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
          Diagnostic Assessment & Onboarding
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Customize Your Learning Experience
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
          Complete our quick diagnostic evaluation to generate your personalized learning path, match score, and adaptive study schedule.
        </p>

        {/* Step Progress Bar */}
        <div className="pt-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between relative mb-2">
            {[
              { step: 1, title: "Target Track" },
              { step: 2, title: "Diagnostic Assessment" },
              { step: 3, title: "Commitment & Style" },
              { step: 4, title: "Custom Curriculum" },
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
              Step 1: Choose Your Primary Focus Track
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select the field you want to master. We will calibrate your diagnostic assessment based on this selection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {TRACKS.map((track) => {
              const Icon = track.icon;
              const isSelected = selectedTrack === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? "border-[#1e3a8a] bg-blue-50/40 shadow-lg shadow-[#1e3a8a]/10 ring-2 ring-[#1e3a8a]/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/80"
                  }`}
                >
                  {track.popular && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#fb923c] text-white shadow-xs">
                      Popular
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${track.bgLight} ${track.color} group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {track.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors">
                          {track.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      {track.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {track.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {isSelected && (
                    <div className="absolute bottom-3 right-3 text-[#1e3a8a]">
                      <CheckCircle2 className="w-5 h-5 fill-[#1e3a8a] text-white" />
                    </div>
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
              Continue to Diagnostic Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DIAGNOSTIC ASSESSMENT */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/40 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-50 text-[#fb923c]">
                  <BarChart3 className="w-5 h-5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Step 2: Diagnostic Skill Assessment
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Answer these 6 diagnostic evaluation questions so our engine can calibrate your baseline for{" "}
                <span className="font-bold text-[#1e3a8a]">{activeTrackDetails.title}</span>.
              </p>
            </div>

            {/* Diagnostic Score Badge Live Indicator */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
              <div className="text-center">
                <span className="text-2xl font-black text-[#fb923c]">{diagnosticPercentage}%</span>
                <p className="text-[10px] font-bold uppercase text-slate-400">Baseline Score</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-xs font-bold text-emerald-400">
                  {getRecommendedLevel()} LEVEL
                </span>
                <p className="text-[10px] text-slate-400">Auto-detected Tier</p>
              </div>
            </div>
          </div>

          {/* Diagnostic Questions List */}
          <div className="space-y-8">
            {DIAGNOSTIC_QUESTIONS.map((q, idx) => (
              <div key={q.id} className="space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a] flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = diagnosticAnswers[q.id] === opt.score;
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleDiagnosticAnswer(q.id, opt.score)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-semibold ${
                          isSelected
                            ? "border-[#1e3a8a] bg-blue-50/60 text-[#1e3a8a] shadow-sm font-bold"
                            : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                            isSelected
                              ? "border-[#1e3a8a] bg-[#1e3a8a] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
              Continue to Commitment & Format
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: COMMITMENT & LEARNING STYLE */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/40 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Step 3: Study Commitment & Learning Preference
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Configure how much time you can invest weekly and how you prefer to digest learning materials.
            </p>
          </div>

          {/* Weekly Hours Slider / Presets */}
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

          {/* Learning Style Multi-Select */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900 block">
              Preferred Learning Styles (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LEARNING_STYLE_OPTIONS.map((style) => {
                const Icon = style.icon;
                const isSelected = selectedStyles.includes(style.id);

                return (
                  <div
                    key={style.id}
                    onClick={() => toggleLearningStyle(style.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-[#1e3a8a] bg-blue-50/50 text-slate-900 shadow-sm ring-1 ring-[#1e3a8a]/20"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isSelected ? "bg-[#1e3a8a] text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {style.label}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500">{style.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected ? "border-[#1e3a8a] bg-[#1e3a8a] text-white" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
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
              Generate AI Curriculum Plan
              <Sparkles className="w-4 h-4 text-[#fb923c]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI REVEAL & PLAN SUMMARY */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/40 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <GraduationCap className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wide uppercase backdrop-blur-md border border-white/10 text-[#fb923c]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Diagnostic Recommendation Generated
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">Match Confidence:</span>
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-sm rounded-lg">
                    98.4% Match
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Your Customized Learning Path is Ready!
                </h2>
                <p className="text-sm text-slate-300 mt-2 max-w-xl">
                  Based on your baseline score of <span className="text-amber-400 font-bold">{diagnosticPercentage}%</span>, our algorithm has tailored a specialized track for your journey.
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
                    {getRecommendedLevel()} Tier
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-[11px] font-semibold text-slate-300 uppercase">Estimated Velocity</p>
                  <p className="text-base font-bold text-white mt-1">{weeklyHours} hours / week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#fb923c]" />
                Target Core Skills Covered
              </h3>
              <ul className="space-y-2">
                {activeTrackDetails.skills.map((skill, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#1e3a8a]" />
                Learning Format & Milestones
              </h3>
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  Personalized project dashboard & milestones unlocked
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  Continuous skill mastery tracking & analytics enabled
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  AI Tutor feedback active for instant code evaluation
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
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
                <span>Launching Dashboard...</span>
              ) : (
                <>
                  Complete Setup & Launch Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
