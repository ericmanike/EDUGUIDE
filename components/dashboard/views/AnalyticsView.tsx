"use client";

import React from "react";
import {
  WeeklyActivityChart,
  SkillRadarChart,
  PathProgressBarChart,
  TimeDistributionDonut,
} from "@/components/dashboard/AnalyticsCharts";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Clock, Award, Target, Flame } from "lucide-react";

export const AnalyticsView: React.FC = () => {
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
          value="12 Days"
          change="Personal Record!"
          changeType="positive"
          icon={<Flame className="w-5 h-5 text-[#fb923c]" />}
          variant="white"
        />
        <StatCard
          title="Weekly Target"
          value="24 / 30 hrs"
          change="80% Completed"
          changeType="positive"
          icon={<Clock className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Avg Velocity"
          value="2.5 nodes/wk"
          change="+0.5 vs last month"
          changeType="positive"
          icon={<Target className="w-5 h-5 text-[#1e3a8a]" />}
          variant="white"
        />
        <StatCard
          title="Global Ranking"
          value="Top 5%"
          change="Fullstack Students"
          changeType="positive"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
          variant="white"
        />
      </div>

      {/* Grid Row 1: Activity Trend & Competency Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityChart />
        <SkillRadarChart />
      </div>

      {/* Grid Row 2: Module Progress Bar & Time Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PathProgressBarChart />
        <TimeDistributionDonut />
      </div>
    </div>
  );
};
