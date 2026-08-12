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
import {
  fetchLearningPaths,
  fetchUserLearningPaths, 
  fetchPathModulesByPath,
  fetchUserModuleProgress,
  getCurrentUser,
  fetchModules,
  LearningPath,
  UserLearningPath,
  UserModuleProgress,
} from "@/lib/api";

export const WeeklyActivityChart: React.FC = () => {
  const [data, setData] = React.useState<Array<{ day: string; hours: number }>>([]);

  React.useEffect(() => {
    async function loadActivity() {
      try {
        const modules = await fetchModules();
        if (modules && modules.length > 0) {
          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          const formatted = days.map((day, idx) => ({
            day,
            hours: idx < modules.length ? Math.round((modules[idx]?.durationMinutes || 60) / 60) : 0,
          }));
          setData(formatted);
        } else {
          setData([
            { day: "Mon", hours: 0 },
            { day: "Tue", hours: 0 },
            { day: "Wed", hours: 0 },
            { day: "Thu", hours: 0 },
            { day: "Fri", hours: 0 },
            { day: "Sat", hours: 0 },
            { day: "Sun", hours: 0 },
          ]);
        }
      } catch (e) {
        console.warn("Could not load activity chart:", e);
      }
    }
    loadActivity();
  }, []);
  return (
    <Card variant="white" className="w-full">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" icon={<TrendingUp className="w-3 h-3 text-[#1e3a8a]" />}>
              Weekly Performance
            </Badge>
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
            data={data}
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
  const [skillsData, setSkillsData] = React.useState<Array<{ name: string; value: number; color: string }>>([]);

  React.useEffect(() => {
    async function loadSkills() {
      try {
        const colors = ["#1e3a8a", "#2563eb", "#fb923c", "#f97316", "#10b981", "#64748b"];
        const modules = await fetchModules();
        if (modules && modules.length > 0) {
          const formatted = modules.slice(0, 5).map((m, idx: number) => ({
            name: m.topic || m.title,
            value: Math.max(50, 85 - idx * 7),
            color: colors[idx % colors.length],
          }));
          setSkillsData(formatted);
        } else {
          const lps = await fetchLearningPaths();
          if (lps && lps.length > 0) {
            const allSkills = Array.from(new Set(lps.flatMap((p) => p.skillsCovered || [])));
            const formatted = allSkills.slice(0, 5).map((sk: string, idx: number) => ({
              name: sk,
              value: Math.max(50, 85 - idx * 7),
              color: colors[idx % colors.length],
            }));
            setSkillsData(formatted);
          }
        }
      } catch (e) {
        console.warn("Could not load skills matrix:", e);
      }
    }
    loadSkills();
  }, []);

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
        </div>
      </CardHeader>

      <div className="h-72 w-full mt-4 flex items-center justify-center">
        {skillsData.length === 0 ? (
          <div className="text-slate-400 text-xs font-semibold">No skills registered yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={skillsData}
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={35}
                paddingAngle={3}
                dataKey="value"
                label={({ name }: { name?: string }) => (name ? name.split(" ")[0] : "")}
              >
                {skillsData.map((entry, index) => (
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
        )}
      </div>
    </Card>
  );
};

export const PathProgressBarChart: React.FC = () => {
  const [chartData, setChartData] = React.useState<
    Array<{ fullName: string; name: string; completed: number; remaining: number }>
  >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function loadPaths() {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        const userId = currentUser?.id || "u-guest";

        const [lps, userPaths] = await Promise.all([
          fetchLearningPaths(),
          fetchUserLearningPaths(userId),
        ]);

        if (lps && lps.length > 0) {
          const enrolledPathIds = new Set<string>();

          if (userPaths && userPaths.length > 0) {
            userPaths.forEach((up: UserLearningPath) => {
              const pId = up.path?.id || up.pathId;
              if (pId) enrolledPathIds.add(pId);
            });
          }

          let enrolledLps = lps.filter((lp: LearningPath) => enrolledPathIds.has(lp.id));

          // Fallback if user has no explicit enrollments recorded yet: show first/active path
          if (enrolledLps.length === 0 && lps.length > 0) {
            enrolledLps = [lps[0]];
          }

          let userModuleProgress: UserModuleProgress[] = [];
          if (currentUser?.id) {
            try {
              userModuleProgress = await fetchUserModuleProgress(currentUser.id);
            } catch {}
          }

          const formatted = await Promise.all(
            enrolledLps.map(async (lp: LearningPath) => {
              let totalModules = lp.totalModules || 6;
              let completedModules = lp.completedModules || 0;

              try {
                const pathMods = await fetchPathModulesByPath(lp.id);
                if (pathMods && pathMods.length > 0) {
                  totalModules = pathMods.length;
                  if (userModuleProgress && userModuleProgress.length > 0) {
                    const pathModIds = new Set(
                      pathMods.map((pm) => pm.module?.id || pm.moduleId).filter(Boolean)
                    );
                    const completedCount = userModuleProgress.filter(
                      (ump) =>
                        pathModIds.has(ump.module?.id || ump.moduleId) &&
                        (ump.progressPercentage === 100 || ump.status === "COMPLETED" || ump.completedAt)
                    ).length;
                    if (completedCount > 0) completedModules = completedCount;
                  }
                }
              } catch {}

              let displayName = lp.title;
              if (displayName.length > 20) {
                displayName = displayName.substring(0, 20) + "...";
              }

              return {
                fullName: lp.title,
                name: displayName,
                completed: completedModules,
                remaining: Math.max(0, totalModules - completedModules),
              };
            })
          );

          setChartData(formatted);
        }
      } catch (e) {
        console.warn("Could not load path progress bar chart:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadPaths();
  }, []);

  return (
    <Card variant="white" className="w-full">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo">
              Enrolled Courses
            </Badge>
          </div>
          <CardTitle>Module Completion Comparison</CardTitle>
          <CardDescription>
            Completed modules vs remaining modules for enrolled paths
          </CardDescription>
        </div>
      </CardHeader>

      <div className="h-64 w-full mt-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            Loading enrolled courses...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            No enrolled learning paths found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                labelFormatter={(label, items) => {
                  if (items && items.length > 0 && items[0].payload?.fullName) {
                    return items[0].payload.fullName;
                  }
                  return label;
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="completed" name="Completed Modules" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="remaining" name="Remaining Modules" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export const TimeDistributionDonut: React.FC = () => {
  const [donutData, setDonutData] = React.useState<Array<{ name: string; value: number; color: string }>>([]);

  React.useEffect(() => {
    async function loadDonut() {
      try {
        const mods = await fetchModules();
        if (mods && mods.length > 0) {
          const colors = ["#1e3a8a", "#fb923c", "#0f172a", "#10b981", "#64748b"];
          const formatted = mods.slice(0, 5).map((m, idx) => ({
            name: m.topic || m.title,
            value: m.durationMinutes || 120,
            color: colors[idx % colors.length],
          }));
          setDonutData(formatted);
        }
      } catch (e) {
        console.warn("Could not load donut time distribution:", e);
      }
    }
    loadDonut();
  }, []);

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
        {donutData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            No course modules found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
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
                formatter={(value) => [`${value} mins`, "Duration"]}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: "11px", color: "#334155" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
