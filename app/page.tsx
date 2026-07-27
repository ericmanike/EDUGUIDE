"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatCard } from "@/components/ui/StatCard";
import { PathVisualizer } from "@/components/dashboard/PathVisualizer";
import {
  LearningPathCard,
  LearningPathData,
} from "@/components/dashboard/LearningPathCard";
import { RecommendedCourses } from "@/components/dashboard/RecommendedCourses";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Route,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Target,
  Plus,
} from "lucide-react";

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [paths, setPaths] = useState<LearningPathData[]>(initialPaths);
  const [activePathId, setActivePathId] = useState<string>("p1");

  const handleSelectPath = (id: string) => {
    setActivePathId(id);
    setPaths((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Banner Card */}
          <Card
            variant="slate"
            hoverEffect={false}
            className="relative overflow-hidden p-8 border-none shadow-2xl shadow-slate-900/20"
          >
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="orange" icon={<Sparkles className="w-3 h-3" />}>
                    EduGuide AI Engine
                  </Badge>
                  <span className="text-xs text-slate-400 font-semibold">
                    Welcome back, Alex!
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Student Learning Path Dashboard
                </h1>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Your personalized AI recommendation engine has updated your learning roadmap.
                  You are <span className="text-orange-400 font-bold">68% completed</span> with your Full-Stack Spring Boot + Next.js target.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="orange"
                  size="md"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => alert("EduGuide Recommender: Analyzing skills & creating new path...")}
                >
                  New Recommended Path
                </Button>
              </div>
            </div>
          </Card>

          {/* Key Metrics / Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Path"
              value="Full-Stack"
              change="98% Profile Match"
              changeType="positive"
              icon={<Route className="w-5 h-5 text-orange-500" />}
              variant="white"
            />
            <StatCard
              title="Path Progress"
              value="68%"
              change="+12% this week"
              changeType="positive"
              icon={<Award className="w-5 h-5 text-orange-500" />}
              variant="white"
            />
            <StatCard
              title="Hours Completed"
              value="42.5 hrs"
              change="Target: 65 hrs"
              changeType="neutral"
              icon={<Clock className="w-5 h-5 text-orange-500" />}
              variant="white"
            />
            <StatCard
              title="Skill Mastery"
              value="8 / 12"
              change="PostgreSQL + Spring"
              changeType="positive"
              icon={<Sparkles className="w-5 h-5 text-orange-400" />}
              variant="slate"
            />
          </div>

          {/* Interactive Learning Path Visualizer */}
          <section className="space-y-3">
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
              <Badge variant="orange" icon={<TrendingUp className="w-3 h-3" />}>
                3 Recommended Tracks
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {paths.map((path) => (
                <LearningPathCard
                  key={path.id}
                  path={path}
                  onSelectPath={handleSelectPath}
                  onViewNodes={(p) =>
                    alert(`Viewing node details for: ${p.title}`)
                  }
                />
              ))}
            </div>
          </section>

          {/* Course Modules Section */}
          <section>
            <RecommendedCourses />
          </section>
        </main>
      </div>
    </div>
  );
}
