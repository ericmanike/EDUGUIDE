"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";

import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import {
  Route,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  fetchActiveUserLearningPaths,
  fetchPathModulesByPath,
  fetchUserModuleProgress,
  fetchUserPathProgressStats,
  getCurrentUser,
  UserModuleProgress,
  PathProgressStats,
} from "@/lib/api";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

function isModuleCompleted(ump: UserModuleProgress): boolean {
  return ump.status === "COMPLETED" || ump.progressPercentage >= 100 || !!ump.completedAt;
}

export const OverviewView: React.FC = () => {
  const [activeTitle, setActiveTitle] = useState("");
  const [userName, setUserName] = useState("Student");
  const [courseProgress, setCourseProgress] = useState(0);
  const [moduleStats, setModuleStats] = useState({ completed: 0, total: 0 });
  const [pathStats, setPathStats] = useState<PathProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        if (currentUser?.name) {
          setUserName(currentUser.name);
        }

        if (currentUser?.id) {
          // 1. Always fetch active paths AND user module progress in parallel
          const [activeUserPaths, moduleProgressList] = await Promise.all([
            fetchActiveUserLearningPaths(currentUser.id),
            fetchUserModuleProgress(currentUser.id),
          ]);

          const activeUserPath = activeUserPaths[0];
          const activePathId = activeUserPath?.path?.id || activeUserPath?.pathId;

          if (activeUserPath?.path?.title) {
            setActiveTitle(activeUserPath.path.title);
          }

          // 2. Fetch path progress stats & path modules if active path exists
          if (activePathId) {
            const [pathModules, stats] = await Promise.all([
              fetchPathModulesByPath(activePathId),
              fetchUserPathProgressStats(currentUser.id, activePathId),
            ]);

            console.log("Fetched user path progress stats:", stats);
            setPathStats(stats);

            if (stats) {
              if (stats.pathTitle) {
                setActiveTitle(stats.pathTitle);
              }
              if (typeof stats.completionPercentage === "number") {
                setCourseProgress(stats.completionPercentage);
              }
              if (typeof stats.completedModules === "number" && typeof stats.totalModules === "number") {
                setModuleStats({
                  completed: stats.completedModules,
                  total: stats.totalModules,
                });
              } else {
                const activeModuleIds = new Set(
                  pathModules
                    .map((pm) => pm.module?.id || pm.moduleId)
                    .filter((id): id is string => !!id)
                );

                const completedCount = moduleProgressList.filter((ump) => {
                  const mId = ump.module?.id || ump.moduleId;
                  return !!mId && activeModuleIds.has(mId) && isModuleCompleted(ump);
                }).length;

                setModuleStats({ completed: completedCount, total: activeModuleIds.size });
              }
            } else {
              setCourseProgress(activeUserPath?.progressPercentage || 0);
              const activeModuleIds = new Set(
                pathModules
                  .map((pm) => pm.module?.id || pm.moduleId)
                  .filter((id): id is string => !!id)
              );

              const completedCount = moduleProgressList.filter((ump) => {
                const mId = ump.module?.id || ump.moduleId;
                return !!mId && activeModuleIds.has(mId) && isModuleCompleted(ump);
              }).length;

              setModuleStats({ completed: completedCount, total: activeModuleIds.size });
            }
          } else {
            setCourseProgress(activeUserPath?.progressPercentage || 0);
            const totalCompleted = moduleProgressList.filter(isModuleCompleted).length;
            setModuleStats({ completed: totalCompleted, total: moduleProgressList.length });
          }
        }
      } catch (error) {
        console.error("Failed to load user data/paths:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const calculatedProgress = `${Math.round(courseProgress)}%`;
  const calculatedMastery = `${moduleStats.total}`;

  return isLoading ? (
    <DashboardSkeleton />
  ) : (
    <div className="space-y-8">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden p-8 min-h-[220px] rounded-2xl bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 border border-slate-800 shadow-xl shadow-slate-900/10 flex items-center">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="indigo">
                Welcome back, {userName}!
              </Badge>
            </div>
            <h1 suppressHydrationWarning className="text-1xl md:text-2xl font-black text-white tracking-tight">
              It&apos;s {new Date().toLocaleDateString("en-US", { weekday: "long",year: "numeric",  month: "short", day: "numeric" })}
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
          title="Active Course"
          value={activeTitle || "No Active Course"}
          icon={<Route className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
          className="min-h-[105px]"
        />
        <StatCard
          title="Course Progress"
          value={calculatedProgress}
          icon={<Award className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
          className="min-h-[105px]"
        />
        <StatCard
          title="Course Modules"
          value={calculatedMastery}
          icon={<Sparkles className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
          className="min-h-[105px]"
        />
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end ">
    <Link
          href="/dashboard/courses"
          className="flex items-center justify-center gap-2.5 bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white px-4 py-3 rounded-[10px] font-bold text-sm shadow-md shadow-[#1e3a8a]/20 transition-all cursor-pointer group"
        >
          <span>Start Learning</span>
          <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/explore"
          className="flex items-center justify-center gap-2.5 bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white px-4 py-3 rounded-[10px] font-bold text-sm shadow-md shadow-[#1e3a8a]/20 transition-all cursor-pointer group"
        >
          <span>Explore All Courses</span>
          <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    

  
    </div>
  );
};
