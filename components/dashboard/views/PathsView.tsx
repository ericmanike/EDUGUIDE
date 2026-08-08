"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { LearningPathCard, LearningPathData } from "@/components/dashboard/LearningPathCard";
import { PathProgressBarChart } from "@/components/dashboard/AnalyticsCharts";
import { SlidersHorizontal } from "lucide-react";
import { fetchLearningPaths } from "@/lib/api";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

const allPaths: LearningPathData[] = [
  {
    id: "p1",
    title: "Full-Stack Spring Boot + Next.js Specialist",
    description:
      "Master modern Java 21, Spring Boot REST APIs, PostgreSQL, and Next.js frontend with Tailwind CSS.",
    matchScore: 98,
    level: "Intermediate",
    estimatedHours: 65,
    totalModules: 14,
    completedModules: 9,
    skillsCovered: ["Java 21", "Spring Boot 3", "PostgreSQL", "Next.js 16", "Tailwind CSS"],
    isActive: true,
  },
  {
    id: "p2",
    title: "AI-Driven Learning Path Recommender Engineer",
    description:
      "Learn Python, recommendation algorithms, student graph modeling, and machine learning pipelines.",
    matchScore: 92,
    level: "Advanced",
    estimatedHours: 50,
    totalModules: 10,
    completedModules: 3,
    skillsCovered: ["Python", "Recommender Systems", "Graph Algorithms", "REST API"],
    isActive: false,
  },
  {
    id: "p3",
    title: "Database Optimization & Cloud Deployment",
    description:
      "Deep dive into PostgreSQL indexing, Docker containerization, CI/CD pipelines, and AWS deployment.",
    matchScore: 88,
    level: "Intermediate",
    estimatedHours: 35,
    totalModules: 8,
    completedModules: 1,
    skillsCovered: ["PostgreSQL", "Docker", "AWS", "Spring Boot"],
    isActive: false,
  },
  {
    id: "p4",
    title: "Cybersecurity & OAuth2 Security Specialist",
    description:
      "Configure Spring Security, JWT authentication, OAuth2, and web vulnerability protection.",
    matchScore: 84,
    level: "Advanced",
    estimatedHours: 40,
    totalModules: 9,
    completedModules: 0,
    skillsCovered: ["Spring Security", "JWT", "OAuth2", "OWASP"],
    isActive: false,
  },
];

export const PathsView: React.FC = () => {
  const [paths, setPaths] = useState<LearningPathData[]>(allPaths);
  const [filter, setFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPaths = async () => {
      setIsLoading(true);
      try {
        const apiData = await fetchLearningPaths();
        if (apiData && apiData.length > 0) {
          const formatted: LearningPathData[] = apiData.map((ap, idx) => ({
            id: ap.id,
            title: ap.title,
            description: ap.description || "Custom learning path.",
            matchScore: ap.matchScore || 95,
            level: (ap.level as any) || "Intermediate",
            estimatedHours: ap.estimatedHours || 40,
            totalModules: ap.totalModules || 10,
            completedModules: ap.completedModules || 2,
            skillsCovered: ap.skillsCovered || ["Spring Boot", "REST API"],
            isActive: idx === 0,
          }));
          setPaths(formatted);
        }
      } catch (error) {
        console.error("Error loading learning paths:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPaths();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const filteredPaths = paths.filter((p) => {
    if (filter === "Active") return p.isActive;
    if (filter === "Intermediate") return p.level === "Intermediate";
    if (filter === "Advanced") return p.level === "Advanced";
    return true;
  });

  const handleSelect = (id: string) => {
    setPaths((prev) =>
      prev.map((p) => ({ ...p, isActive: p.id === id }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo">
              AI Recommender
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Recommended Learning Paths
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Personalized career roadmaps generated dynamically for your skill profile
          </p>
        </div>
      </div>

      {/* Module Progress Comparison Chart */}
      <PathProgressBarChart />

      {/* Filters Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          {["All", "Active", "Intermediate", "Advanced"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === cat
                  ? "bg-[#1e3a8a] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <SlidersHorizontal className="w-4 h-4 text-[#1e3a8a]" />
          <span className="font-semibold">{filteredPaths.length} Paths Found</span>
        </div>
      </div>

      {/* Grid of Learning Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPaths.map((path) => (
          <LearningPathCard
            key={path.id}
            path={path}
            onSelectPath={handleSelect}
            onViewNodes={() => alert(`Opening roadmap details for ${path.title}`)}
          />
        ))}
      </div>
    </div>
  );
};
