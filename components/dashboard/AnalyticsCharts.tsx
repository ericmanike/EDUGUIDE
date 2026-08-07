"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Award, PieChart as PieIcon } from "lucide-react";

// Mock Data for Weekly Study Activity
const weeklyActivityData = [
  { day: "Mon", hours: 2.5, completedNodes: 2 },
  { day: "Tue", hours: 4.0, completedNodes: 3 },
  { day: "Wed", hours: 3.2, completedNodes: 2 },
  { day: "Thu", hours: 5.5, completedNodes: 4 },
  { day: "Fri", hours: 4.8, completedNodes: 3 },
  { day: "Sat", hours: 6.5, completedNodes: 5 },
  { day: "Sun", hours: 4.0, completedNodes: 3 },
];

// Mock Data for Skill Competency Breakdown Pie Chart
const skillCompetencyPieData = [
  { name: "Next.js 16 (88% Level)", value: 88, color: "#1e3a8a" },
  { name: "Java 21 (85% Level)", value: 85, color: "#2563eb" },
  { name: "Spring Boot 3 (75% Level)", value: 75, color: "#fb923c" },
  { name: "PostgreSQL (70% Level)", value: 70, color: "#f97316" },
  { name: "Algorithms (68% Level)", value: 68, color: "#10b981" },
  { name: "System Design (60% Level)", value: 60, color: "#64748b" },
];

// Mock Data for Track Progress Bar Chart
const pathProgressData = [
  { name: "Spring Boot Track", completed: 9, remaining: 5 },
  { name: "AI Recommender", completed: 3, remaining: 7 },
  { name: "Database & Cloud", completed: 1, remaining: 7 },
];

// Mock Data for Time Breakdown Donut Chart
const timeDistributionData = [
  { name: "Backend (Spring/Java)", value: 45, color: "#1e3a8a" },
  { name: "Frontend (Next.js/React)", value: 30, color: "#fb923c" },
  { name: "Database (PostgreSQL)", value: 15, color: "#0f172a" },
  { name: "System Design & DevOps", value: 10, color: "#10b981" },
];

export const WeeklyActivityChart: React.FC = () => {
  return (
    <Card variant="white" className="w-full">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" icon={<TrendingUp className="w-3 h-3 text-[#1e3a8a]" />}>
              Weekly Performance
            </Badge>
            <span className="text-xs font-semibold text-slate-400">
              Hours Spent vs Milestones
            </span>
          </div>
          <CardTitle>Learning Activity Trend</CardTitle>
          <CardDescription>
            Daily study hours and completed learning nodes this week
          </CardDescription>
        </div>
      </CardHeader>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={weeklyActivityData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "12px",
                color: "#0f172a",
                fontSize: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
              itemStyle={{ color: "#1e3a8a", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#1e3a8a"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#blueGradient)"
              name="Hours Learned"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const SkillRadarChart: React.FC = () => {
  return (
    <Card variant="white" className="w-full">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" icon={<Award className="w-3 h-3 text-[#1e3a8a]" />}>
              Skill Matrix
            </Badge>
          </div>
          <CardTitle className="text-slate-900">Student Competency Breakdown</CardTitle>
          <CardDescription className="text-slate-500">
            Current skill levels vs. EduGuide target goals (Pie Chart)
          </CardDescription>
        </div>
      </CardHeader>

      <div className="h-72 w-full mt-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={skillCompetencyPieData}
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={35}
              paddingAngle={3}
              dataKey="value"
              label={({ name }: { name?: string }) => (name ? name.split(" ")[0] : "")}
            >
              {skillCompetencyPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "12px",
                color: "#0f172a",
                fontSize: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`${value}%`, "Competency Score"]}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              formatter={(value) => <span className="text-slate-700 font-semibold">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const PathProgressBarChart: React.FC = () => {
  return (
    <Card variant="white" className="w-full">
      <CardHeader>
        <div>
          <CardTitle>Module Completion Comparison</CardTitle>
          <CardDescription>
            Completed modules vs remaining modules per path
          </CardDescription>
        </div>
      </CardHeader>

      <div className="h-64 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pathProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "12px",
                color: "#0f172a",
                fontSize: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="completed" name="Completed Modules" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
            <Bar dataKey="remaining" name="Remaining Modules" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const TimeDistributionDonut: React.FC = () => {
  return (
    <Card variant="white" className="w-full">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="slate" icon={<PieIcon className="w-3 h-3 text-[#fb923c]" />}>
              Time Split
            </Badge>
          </div>
          <CardTitle>Domain Time Distribution</CardTitle>
          <CardDescription>
            Percentage of total study time spent across core domains
          </CardDescription>
        </div>
      </CardHeader>

      <div className="h-64 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={timeDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {timeDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "12px",
                color: "#0f172a",
                fontSize: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`${value}%`, "Time Spent"]}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ fontSize: "11px", color: "#334155" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
