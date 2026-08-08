"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LearningPathData } from "@/components/dashboard/LearningPathCard";
import {
  X,
  Zap,
  CheckCircle2,
  Brain,
  Rocket,
  Layers,
  Database,
  ShieldCheck,
  Cpu,
} from "lucide-react";

import { createLearningPath } from "@/lib/api";

interface GeneratePathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPathGenerated: (newPath: LearningPathData) => void;
}

const trackPresets = [
  {
    id: "t1",
    title: "Full-Stack Spring Boot 3 + Next.js 16",
    category: "Full-Stack",
    description: "Java 21, Spring Data JPA, PostgreSQL, Next.js App Router, Tailwind CSS.",
    icon: Layers,
    skills: ["Java 21", "Spring Boot", "PostgreSQL", "Next.js", "Tailwind CSS"],
    hours: 60,
    modules: 12,
  },
  {
    id: "t2",
    title: "AI Recommender & Machine Learning Pipeline",
    category: "AI / Data",
    description: "Python, Recommendation Algorithms, Graph Modeling, PyTorch, FastAPI.",
    icon: Cpu,
    skills: ["Python", "Recommender Systems", "PyTorch", "Graph ML", "FastAPI"],
    hours: 50,
    modules: 10,
  },
  {
    id: "t3",
    title: "Cloud-Native Microservices & Kafka Architecture",
    category: "Backend & Cloud",
    description: "Distributed Systems, Event-Driven Architecture, Apache Kafka, Docker, Kubernetes.",
    icon: Database,
    skills: ["Spring Cloud", "Kafka", "Docker", "Kubernetes", "PostgreSQL"],
    hours: 55,
    modules: 11,
  },
  {
    id: "t4",
    title: "Cybersecurity & Spring OAuth2 Security",
    category: "Security",
    description: "JWT Authentication, OAuth2 Server, Pen-Testing, OWASP Security Standards.",
    icon: ShieldCheck,
    skills: ["Spring Security", "OAuth2", "JWT", "OWASP", "Encryption"],
    hours: 40,
    modules: 8,
  },
];

export const GeneratePathModal: React.FC<GeneratePathModalProps> = ({
  isOpen,
  onClose,
  onPathGenerated,
}) => {
  const [selectedTrack, setSelectedTrack] = useState(trackPresets[0]);
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [customGoal, setCustomGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepText, setStepText] = useState("Analyzing student profile...");

  if (!isOpen) return null;

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setStepText("Evaluating skill gap matrix...");

    setTimeout(() => {
      setStepText("Generating optimal node dependency graph...");
    }, 800);

    setTimeout(() => {
      setStepText("Finalizing personalized SkillsBank roadmap...");
    }, 1500);

    setTimeout(async () => {
      const pathTitle = customGoal.trim() ? customGoal : selectedTrack.title;
      const pathDesc = selectedTrack.description;

      // Post to Spring Boot Backend API
      const createdBackendPath = await createLearningPath({
        title: pathTitle,
        description: pathDesc,
        level: level,
        estimatedHours: selectedTrack.hours,
      });

      const generatedPath: LearningPathData = {
        id: createdBackendPath?.id || `gen-${Date.now()}`,
        title: pathTitle,
        description: pathDesc,
        matchScore: 99,
        level: level,
        estimatedHours: selectedTrack.hours,
        totalModules: selectedTrack.modules,
        completedModules: 0,
        skillsCovered: selectedTrack.skills,
        isActive: true,
      };

      setIsGenerating(false);
      onPathGenerated(generatedPath);
      onClose();
    }, 2200);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-900/20 overflow-hidden p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Generate New Learning Path
                </h3>
                <Badge variant="indigo" icon={<Zap className="w-3 h-3 text-[#1e3a8a]" />}>
                  Instant AI
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                SkillsBank will structure an optimized node graph and activate it now
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-[#1e3a8a] animate-spin" />
              <Brain className="w-8 h-8 text-[#1e3a8a] absolute" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 animate-pulse">
                {stepText}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Creating node dependencies for {selectedTrack.title}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Custom Goal Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Custom Skill Target (Optional)
              </label>
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="e.g. Building High-Throughput REST APIs with Spring Boot"
                className="w-full bg-[#f4f5f7] border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none"
              />
            </div>

            {/* Presets Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Recommended Career Track
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trackPresets.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedTrack.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTrack(t)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50/50 border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20 shadow-sm"
                          : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isSelected ? "text-[#1e3a8a]" : "text-slate-500"}`} />
                          <span className="text-xs font-bold text-slate-900 line-clamp-1">
                            {t.title}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1e3a8a] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level Selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-700">Target Skill Level:</span>
              <div className="flex items-center gap-2">
                {(["Beginner", "Intermediate", "Advanced"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      level === l
                        ? "bg-[#1e3a8a] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<Rocket className="w-4 h-4" />}
                onClick={handleStartGeneration}
              >
                Generate & Start Path Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
