"use client";

import React, { useEffect, useState } from "react";
import {
  WeeklyActivityChart,
  PathProgressBarChart,
  TimeDistributionDonut,
} from "@/components/dashboard/AnalyticsCharts";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Clock, Award, Target, Flame } from "lucide-react";
import { fetchActivityLogs, fetchLearningPaths, fetchModules, ActivityLog, LearningPath, CourseModule } from "@/lib/api";

export const AnalyticsView: React.FC = () => {
  const [streakDays, setStreakDays] = useState<number>(0);
  const [weeklyHours, setWeeklyHours] = useState<number>(0);
  const [velocity, setVelocity] = useState<string>("0 nodes/wk");
  const [masteryRank, setMasteryRank] = useState<string>("Active Student");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [logs, paths, modules] = await Promise.all([
          fetchActivityLogs(),
          fetchLearningPaths(),
          fetchModules(),
        ]);

        if (logs && logs.length > 0) {
          const activeDays = logs.filter((l: ActivityLog) => Number(l.hoursSpent) > 0).length;
          setStreakDays(activeDays || logs.length);
          const totalHours = logs.reduce((sum: number, l: ActivityLog) => sum + (Number(l.hoursSpent) || 0), 0);
          setWeeklyHours(Math.round(totalHours));
        }

        if (paths && paths.length > 0) {
          const completedCount = paths.reduce((sum: number, p: LearningPath) => sum + (p.completedModules || 0), 0);
          const totalCount = paths.reduce((sum: number, p: LearningPath) => sum + (p.totalModules || 1), 0);
          setVelocity(`${completedCount} completed`);
          const completionPct = Math.round((completedCount / totalCount) * 100);
          if (completionPct > 50) setMasteryRank("Top 10%");
          else if (completionPct > 20) setMasteryRank("Top 25%");
          else setMasteryRank("Active Scholar");
        } else if (modules && modules.length > 0) {
          setVelocity(`${modules.length} Modules`);
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
          In-depth metrics, study activity trends, and skill growth visualizations
        </p>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Streak"
          value={`${streakDays} Days`}
          change="Live Activity Track"
          changeType="positive"
          icon={<Flame className="w-5 h-5 text-[#fb923c]" />}
          variant="white"
        />
        <StatCard
          title="Weekly Hours"
          value={`${weeklyHours} / 30 hrs`}
          change={`${Math.min(100, Math.round((weeklyHours / 30) * 100))}% Goal`}
          changeType="positive"
          icon={<Clock className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Progress Velocity"
          value={velocity}
          change="Curriculum Pace"
          changeType="positive"
          icon={<Target className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Student Rank"
          value={masteryRank}
          change="Based on live progress"
          changeType="positive"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
          variant="white"
        />
      </div>

      {/* Grid Row 1: Activity Trend */}
      <div>
        <WeeklyActivityChart />
      </div>

      {/* Grid Row 2: Module Progress Bar & Time Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PathProgressBarChart />
        <TimeDistributionDonut />
      </div>
    </div>
  );
};
