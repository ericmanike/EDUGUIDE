"use client";

import React, { useEffect, useState } from "react";
import {
  PathProgressBarChart,
  TimeDistributionDonut,
} from "@/components/dashboard/AnalyticsCharts";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Route, Award, Sparkles, Target } from "lucide-react";
import {
  fetchActiveUserLearningPaths,
  fetchPathModulesByPath,
  fetchUserModuleProgress,
  getCurrentUser,
  UserModuleProgress,
} from "@/lib/api";

function isModuleCompleted(ump: UserModuleProgress): boolean {
  return ump.status === "COMPLETED" || ump.progressPercentage >= 100 || !!ump.completedAt;
}

export const AnalyticsView: React.FC = () => {
  const [activeTitle, setActiveTitle] = useState("No Active Course");
  const [courseProgress, setCourseProgress] = useState(0);
  const [matchScore, setMatchScore] = useState(0);
  const [moduleStats, setModuleStats] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser?.id) return;

        // 1. Find the enrolled/active course
        const activeUserPaths = await fetchActiveUserLearningPaths(currentUser.id);
        const activeUserPath = activeUserPaths[0];
        const activePathId = activeUserPath?.path?.id || activeUserPath?.pathId;

        if (activeUserPath?.path?.title) {
          setActiveTitle(activeUserPath.path.title);
        }
        setCourseProgress(activeUserPath?.progressPercentage || 0);
        setMatchScore(activeUserPath?.matchScore || 0);

        // 2. Get the full progress stats for that course's modules
        if (activePathId) {
          const [pathModules, moduleProgressList] = await Promise.all([
            fetchPathModulesByPath(activePathId),
            fetchUserModuleProgress(currentUser.id),
          ]);

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
      } catch (err) {
        console.warn("Could not load analytics metrics:", err);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="indigo" icon={<TrendingUp className="w-3 h-3 text-[#1e3a8a]" />}>
            Learning Analytics
          </Badge>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Progress & Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          In-depth metrics and skill growth visualizations for your active course
        </p>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Course"
          value={activeTitle}
          icon={<Route className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Course Progress"
          value={`${Math.round(courseProgress)}%`}
          icon={<Award className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Active Modules"
          value={`${moduleStats.completed} / ${moduleStats.total} Modules`}
          icon={<Sparkles className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Match Score"
          value={`${Math.round(matchScore)}%`}
          icon={<Target className="w-5 h-5 text-emerald-600" />}
          variant="white"
        />
      </div>

      {/* Module Progress Bar */}
      <div>
        <PathProgressBarChart />
      </div>

      {/* Time Distribution Donut */}
      <div>
        <TimeDistributionDonut />
      </div>
    </div>
  );
};
