"use client";

import React, { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { PathVisualizer } from "@/components/dashboard/PathVisualizer";
import {
  LearningPathCard,
  LearningPathData,
} from "@/components/dashboard/LearningPathCard";
import { RecommendedCourses } from "@/components/dashboard/RecommendedCourses";
import {
  WeeklyActivityChart,
  SkillRadarChart,
} from "@/components/dashboard/AnalyticsCharts";
import { Badge } from "@/components/ui/Badge";
import {
  Route,
  Award,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { fetchLearningPaths, fetchUsers, User, getCurrentUser } from "@/lib/api";

const initialPaths: LearningPathData[] = [
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
];

export const OverviewView: React.FC = () => {
  const [paths, setPaths] = useState<LearningPathData[]>(initialPaths);
  const [activeTitle, setActiveTitle] = useState("Full-Stack Spring Boot + Next.js Specialist");
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    // Check logged in user via decoded JWT or session
    const currentUser = getCurrentUser();
    if (currentUser?.name) {
      setUserName(currentUser.name);
    }


    // Load paths from backend API
    const loadData = async () => {
      const apiPaths = await fetchLearningPaths();
      if (apiPaths && apiPaths.length > 0) {
        const formatted: LearningPathData[] = apiPaths.map((ap, idx) => ({
          id: ap.id,
          title: ap.title,
          description: ap.description || "Custom backend learning path.",
          matchScore: ap.matchScore || 95,
          level: (ap.level as any) || "Intermediate",
          estimatedHours: ap.estimatedHours || 40,
          totalModules: ap.totalModules || 10,
          completedModules: ap.completedModules || 2,
          skillsCovered: ap.skillsCovered || ["Spring Boot", "REST API"],
          isActive: idx === 0,
        }));
        setPaths(formatted);
        if (formatted[0]) setActiveTitle(formatted[0].title);
      }
    };

    loadData();
  }, []);

  const handleSelectPath = (id: string) => {
    setPaths((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          setActiveTitle(p.title);
          return { ...p, isActive: true };
        }
        return { ...p, isActive: false };
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 border border-slate-800 shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="indigo">
                Welcome back, {userName}!
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Student Learning Path Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Active Path: <span className="text-blue-300 font-bold">{activeTitle}</span>.
              SkillsBank has structured your nodes for optimal skill acceleration.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics / Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Path"
          value="Active Now"
          change="99% Profile Match"
          changeType="positive"
          icon={<Route className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Path Progress"
          value="68%"
          change="+12% this week"
          changeType="positive"
          icon={<Award className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Hours Completed"
          value="42.5 hrs"
          change="Target: 65 hrs"
          changeType="neutral"
          icon={<Clock className="w-5 h-5 text-[#fb923c]" />}
          variant="white"
        />
        <StatCard
          title="Skill Mastery"
          value="8 / 12"
          change="PostgreSQL + Spring"
          changeType="positive"
          variant="white"
          icon={<Sparkles className="w-5 h-5 text-[#1e3a8a]" />}
        />
      </div>

      {/* Analytics Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityChart />
        <SkillRadarChart />
      </section>

      {/* Learning Path Visualizer */}
      <section id="interactive-roadmap" className="space-y-3 scroll-mt-20">
        <PathVisualizer />
      </section>

      {/* Recommended Learning Paths Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Recommended Learning Paths
            </h3>
            <p className="text-xs text-slate-500">
              Custom-tailored learning routes generated for your career goal
            </p>
          </div>
          <Badge variant="indigo" icon={<TrendingUp className="w-3 h-3" />}>
            {paths.length} Recommended Tracks
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {paths.map((path) => (
            <LearningPathCard
              key={path.id}
              path={path}
              onSelectPath={handleSelectPath}
              onViewNodes={() => {
                const el = document.getElementById("interactive-roadmap");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            />
          ))}
        </div>
      </section>

      {/* Course Modules Section */}
      <section>
        <RecommendedCourses />
      </section>
    </div>
  );
};
