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
} from "@/components/dashboard/AnalyticsCharts";
import { Badge } from "@/components/ui/Badge";
import {
  Route,
  Award,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  fetchLearningPaths,
  fetchUserLearningPaths,
  getCurrentUser,
  enrollInLearningPath,
  UserLearningPath,
} from "@/lib/api";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export const OverviewView: React.FC = () => {
  const [paths, setPaths] = useState<LearningPathData[]>([]);
  const [activeTitle, setActiveTitle] = useState("");
  const [userName, setUserName] = useState("Student");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        if (currentUser?.name) {
          setUserName(currentUser.name);
        }

        const apiPaths = await fetchLearningPaths();
        let userPaths: UserLearningPath[] = [];
        if (currentUser?.id) {
          userPaths = await fetchUserLearningPaths(currentUser.id);
        }

        if (apiPaths && apiPaths.length > 0) {
          const activeUserPath = userPaths.find((up) => up.isActive);
          const activePathId = activeUserPath?.path?.id || activeUserPath?.pathId;

          const formatted: LearningPathData[] = apiPaths.map((ap, idx) => {
            const isCurrentlyActive = activePathId ? ap.id === activePathId : idx === 0;
            return {
              id: ap.id,
              title: ap.title,
              description: ap.description || "Custom backend learning path.",
              matchScore: ap.matchScore || 95,
              level: ((): "Beginner" | "Intermediate" | "Advanced" => {
                const up = (ap.level || "").trim().toUpperCase();
                if (up === "INTERMEDIATE") return "Intermediate";
                if (up === "ADVANCED") return "Advanced";
                return "Beginner";
              })(),
              estimatedHours: ap.estimatedHours || 40,
              totalModules: ap.totalModules || 10,
              completedModules: ap.completedModules || 0,
              skillsCovered: ap.skillsCovered || [],
              isActive: isCurrentlyActive,
            };
          });

          setPaths(formatted);
          const activeItem = formatted.find((p) => p.isActive) || formatted[0];
          if (activeItem) setActiveTitle(activeItem.title);
        }
      } catch (error) {
        console.error("Failed to load user data/paths:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectPath = async (id: string) => {
    setPaths((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          setActiveTitle(p.title);
          return { ...p, isActive: true };
        }
        return { ...p, isActive: false };
      })
    );
    await enrollInLearningPath(id);
  };


  const activePath = paths.find((p) => p.isActive) || paths[0];
  const calculatedProgress = activePath && activePath.totalModules > 0
    ? `${Math.round((activePath.completedModules / activePath.totalModules) * 100)}%`
    : "0%";
  const totalCompletedModules = paths.reduce((sum, p) => sum + (p.completedModules || 0), 0);
  const totalAllModules = paths.reduce((sum, p) => sum + (p.totalModules || 0), 0);
  const calculatedMastery = totalAllModules > 0
    ? `${totalCompletedModules} / ${totalAllModules} Modules`
    : `${paths.length} Active Tracks`;

  return isLoading ? (
    <DashboardSkeleton />
  ) : (
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
              Student Learning Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            <span className="text-blue-300 font-bold">{activeTitle}</span>.
              SkillsBank has structured your modules for optimal skill acceleration.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics / Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Path"
          value={activeTitle || (paths.length > 0 ? paths[0].title : "No Active Path")}
          icon={<Route className="w-4 h-4 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Path Progress"
          value={calculatedProgress}
          icon={<Award className="w-4 h-4 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Skill Mastery"
          value={calculatedMastery}
          icon={<Sparkles className="w-4 h-4 text-[#1e3a8a]" />}
          variant="white"
        />
      </div>

      {/* Analytics Grid */}
      <section>
        <WeeklyActivityChart />
      </section>

      {/* Learning Path Visualizer */}
      <section id="interactive-roadmap" className="space-y-3 scroll-mt-20">
        <PathVisualizer activePath={activePath} />
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
