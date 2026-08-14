"use client";

import React, { useEffect, useState } from "react";
import {
  PathProgressBarChart,
  LessonProgressBarChart,
} from "@/components/dashboard/AnalyticsCharts";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
  Layers,
} from "lucide-react";
import {
  fetchActiveUserLearningPaths,
  fetchUserPathProgressStats,
  getCurrentUser,
  PathProgressStats,
} from "@/lib/api";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export const AnalyticsView: React.FC = () => {
  const [stats, setStats] = useState<PathProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAnalytics() {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        if (!currentUser?.id) return;

        const activeUserPaths = await fetchActiveUserLearningPaths(currentUser.id);
        const activeUserPath = activeUserPaths[0];
        const activePathId = activeUserPath?.path?.id || activeUserPath?.pathId;

        if (activePathId) {
          const pathStats = await fetchUserPathProgressStats(currentUser.id, activePathId);
          console.log("Analytics path progress stats:", pathStats);
          setStats(pathStats);
        }
      } catch (err) {
        console.warn("Could not load analytics metrics:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  return isLoading ? (
    <DashboardSkeleton />
  ) : (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
     
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Progress &amp; Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Detailed module and lesson completion breakdown for your active course
        </p>
      </div>

      {/* Top Banner Card for Active Learning Path */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/10 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" className="bg-blue-500/20 text-blue-200 border-blue-400/30 font-bold">
                {stats?.isCompleted ? "Track Completed" : "Active Learning Path"}
              </Badge>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              {stats?.pathTitle || "No Active Course"}
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/15 flex items-center gap-4">
            <div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Overall Completion</div>
              <div className="text-2xl font-black text-white">{Math.round(stats?.completionPercentage || 0)}%</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-300">
            <span>Course Progress</span>
            <span>{Math.round(stats?.completionPercentage || 0)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.round(stats?.completionPercentage || 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module Level Statistics Cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#1e3a8a]" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Module Progress Metrics</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Modules"
            value={stats?.totalModules ?? 0}
            icon={<Layers className="w-5 h-5 text-[#1e3a8a]" />}
            variant="white"
          />
          <StatCard
            title="Completed Modules"
            value={stats?.completedModules ?? 0}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            variant="white"
          />
          <StatCard
            title="In-Progress Modules"
            value={stats?.inProgressModules ?? 0}
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            variant="white"
          />
          <StatCard
            title="Not Started Modules"
            value={stats?.notStartedModules ?? 0}
            icon={<BookOpen className="w-5 h-5 text-slate-400" />}
            variant="white"
          />
        </div>
      </div>

      {/* Lesson Level Statistics Cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-[#1e3a8a]" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Lesson Progress Breakdown</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Lessons"
            value={stats?.totalLessons ?? 0}
            icon={<PlayCircle className="w-5 h-5 text-[#1e3a8a]" />}
            variant="white"
          />
          <StatCard
            title="Completed Lessons"
            value={stats?.completedLessons ?? 0}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            variant="white"
          />
          <StatCard
            title="In-Progress Lessons"
            value={stats?.inProgressLessons ?? 0}
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            variant="white"
          />
          <StatCard
            title="Not Started Lessons"
            value={stats?.notStartedLessons ?? 0}
            icon={<BookOpen className="w-5 h-5 text-slate-400" />}
            variant="white"
          />
        </div>
      </div>

      {/* Chart Visualizations in 2 Separate Rows */}
      <div className="flex flex-col gap-6">
        <PathProgressBarChart />
        <LessonProgressBarChart />
      </div>
    </div>
  );
};
