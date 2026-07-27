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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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

// Mock Data for Skill Competency Radar
const skillRadarData = [
  { subject: "Java 21", current: 85, target: 95 },
  { subject: "Spring Boot", current: 75, target: 90 },
  { subject: "PostgreSQL", current: 70, target: 85 },
  { subject: "Next.js 16", current: 88, target: 92 },
  { subject: "System Design", current: 60, target: 80 },
  { subject: "Algorithms", current: 68, target: 85 },
];

// Mock Data for Track Progress Bar Chart
const pathProgressData = [
  { name: "Spring Boot Track", completed: 9, remaining: 5 },
  { name: "AI Recommender", completed: 3, remaining: 7 },
  { name: "Database & Cloud", completed: 1, remaining: 7 },
];

// Mock Data for Time Breakdown Donut Chart
const timeDistributionData = [
  { name: "Backend (Spring/Java)", value: 45, color: "#f97316" }, // Orange-500
  { name: "Frontend (Next.js/React)", value: 30, color: "#0f172a" }, // Slate-900
  { name: "Database (PostgreSQL)", value: 15, color: "#38bdf8" }, // Sky-400
  { name: "System Design & DevOps", value: 10, color: "#10b981" }, // Emerald-500
];

export const WeeklyActivityChart: React.FC = () => {
  return (
    <Card variant="white" className="w-full">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="orange" icon={<TrendingUp className="w-3 h-3" />}>
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
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
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
              itemStyle={{ color: "#f97316", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#f97316"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#orangeGradient)"
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
            <Badge variant="orange" icon={<Award className="w-3 h-3" />}>
              Skill Matrix
            </Badge>
          </div>
          <CardTitle className="text-slate-900">Student Competency Radar</CardTitle>
          <CardDescription className="text-slate-500">
            Current skill levels vs. EduGuide target goals
          </CardDescription>
        </div>
      </CardHeader>

      <div className="h-72 w-full mt-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillRadarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={11} fontWeight={600} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
            <Radar
              name="Current Level"
              dataKey="current"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.4}
            />
            <Radar
              name="Target Goal"
              dataKey="target"
              stroke="#0f172a"
              fill="#0f172a"
              fillOpacity={0.15}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              formatter={(value) => <span className="text-slate-700 font-semibold">{value}</span>}
            />
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
          </RadarChart>
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
            <Bar dataKey="completed" name="Completed Modules" fill="#f97316" radius={[6, 6, 0, 0]} />
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
            <Badge variant="slate" icon={<PieIcon className="w-3 h-3 text-orange-400" />}>
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
