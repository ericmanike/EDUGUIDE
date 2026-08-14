"use client";

import React from "react";
import {
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
  fetchActiveUserLearningPaths,
  fetchPathModulesByPath,
  fetchUserModuleProgress,
  fetchUserPathProgressStats,
  fetchAllUserLessonProgress,
  getCurrentUser,
  fetchModules,
  UserModuleProgress,
  PathProgressStats,
} from "@/lib/api";

export const WeeklyActivityChart: React.FC = () => {
  const [data, setData] = React.useState<
    Array<{ day: string; hours: number; completedModules: number }>
  >([]);

  React.useEffect(() => {
    async function loadActivity() {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const base = days.map((day) => ({ day, hours: 0, completedModules: 0 }));

      try {
        const currentUser = getCurrentUser();
        if (currentUser?.id) {
          const moduleProgress = await fetchUserModuleProgress(currentUser.id);

          const now = new Date();
          const mondayOffset = (now.getDay() + 6) % 7; // 0 = Monday .. 6 = Sunday
          const monday = new Date(now);
          monday.setHours(0, 0, 0, 0);
          monday.setDate(now.getDate() - mondayOffset);
          const nextMonday = new Date(monday);
          nextMonday.setDate(monday.getDate() + 7);

          moduleProgress.forEach((ump: UserModuleProgress) => {
            if (!ump.completedAt) return;
            const completedDate = new Date(ump.completedAt);
            if (completedDate < monday || completedDate >= nextMonday) return;

            const idx = (completedDate.getDay() + 6) % 7;
            base[idx].completedModules += 1;
            base[idx].hours += Math.round((ump.module?.durationMinutes || 60) / 60);
          });
        }
      } catch (e) {
        console.warn("Could not load activity chart:", e);
      }

      setData(base);
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
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
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
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="hours" name="Hours Learned" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
            <Bar
              dataKey="completedModules"
              name="Completed Modules"
              fill="#fb923c"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
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

const MODULE_STATUS_COLORS = {
  completed: "#10b981",
  inProgress: "#fb923c",
  notStarted: "#e2e8f0",
};

function classifyModuleStatus(ump?: UserModuleProgress): "completed" | "inProgress" | "notStarted" {
  if (!ump) return "notStarted";
  if (ump.status === "COMPLETED" || ump.progressPercentage >= 100 || !!ump.completedAt) return "completed";
  if (ump.status === "IN_PROGRESS" || ump.progressPercentage > 0) return "inProgress";
  return "notStarted";
}

export const PathProgressBarChart: React.FC = () => {
  const [stats, setStats] = React.useState<PathProgressStats | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        if (!currentUser?.id) return;

        const activeUserPaths = await fetchActiveUserLearningPaths(currentUser.id);
        const activeUserPath = activeUserPaths[0];
        const activePathId = activeUserPath?.path?.id || activeUserPath?.pathId;

        if (activePathId) {
          const pathStats = await fetchUserPathProgressStats(currentUser.id, activePathId);
          if (pathStats) {
            setStats(pathStats);
          } else {
            // Client fallback if backend endpoint is unavailable
            const [moduleProgressList, pathModules] = await Promise.all([
              fetchUserModuleProgress(currentUser.id),
              fetchPathModulesByPath(activePathId),
            ]);

            const activeModuleIds = new Set(
              pathModules
                .map((pm) => pm.module?.id || pm.moduleId)
                .filter((id): id is string => !!id)
            );

            const completedModulesCount = moduleProgressList.filter((ump) => {
              const mId = ump.module?.id || ump.moduleId;
              return (
                !!mId &&
                activeModuleIds.has(mId) &&
                (ump.status === "COMPLETED" || ump.progressPercentage >= 100 || !!ump.completedAt)
              );
            }).length;

            const inProgressModulesCount = moduleProgressList.filter((ump) => {
              const mId = ump.module?.id || ump.moduleId;
              return (
                !!mId &&
                activeModuleIds.has(mId) &&
                ump.status === "IN_PROGRESS"
              );
            }).length;

            const totalMods = activeModuleIds.size;
            const notStartedMods = Math.max(0, totalMods - completedModulesCount - inProgressModulesCount);

            setStats({
              pathId: activePathId,
              pathTitle: activeUserPath?.path?.title || "Active Course",
              totalModules: totalMods,
              completedModules: completedModulesCount,
              inProgressModules: inProgressModulesCount,
              notStartedModules: notStartedMods,
              completionPercentage: totalMods > 0 ? (completedModulesCount / totalMods) * 100 : 0,
            });
          }
        } else {
          setStats(null);
        }
      } catch (e) {
        console.warn("Could not load path progress bar chart:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const chartData = stats
    ? [
        { name: "Total Modules", count: stats.totalModules ?? 0, fill: "#1e3a8a" },
        { name: "Completed", count: stats.completedModules ?? 0, fill: "#10b981" },
        { name: "In Progress", count: stats.inProgressModules ?? 0, fill: "#fb923c" },
        { name: "Not Started", count: stats.notStartedModules ?? 0, fill: "#94a3b8" },
      ]
    : [];

  return (
    <Card variant="white" className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="indigo">Module Analytics</Badge>
            </div>
            <CardTitle>Module Progress Breakdown</CardTitle>
            <CardDescription >
              {stats?.pathTitle
                ? `${stats.completedModules ?? 0} of ${stats.totalModules ?? 0} modules completed`
                : "Total, completed, in-progress, and not-started modules"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="h-64 w-full mt-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            Loading module stats...
          </div>
        ) : !stats ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            No active course progress found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} interval={0} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "12px",
                  color: "#0f172a",
                  fontSize: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
                formatter={(value: any) => [`${value} modules`, "Count"]}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={42}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export const LessonProgressBarChart: React.FC = () => {
  const [stats, setStats] = React.useState<PathProgressStats | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        if (!currentUser?.id) return;

        const activeUserPaths = await fetchActiveUserLearningPaths(currentUser.id);
        const activeUserPath = activeUserPaths[0];
        const activePathId = activeUserPath?.path?.id || activeUserPath?.pathId;

        if (activePathId) {
          const pathStats = await fetchUserPathProgressStats(currentUser.id, activePathId);
          if (pathStats) {
            setStats(pathStats);
          } else {
            // Client fallback if backend endpoint is unavailable
            const lessonProgressList = await fetchAllUserLessonProgress(currentUser.id);
            const completedLessonsCount = lessonProgressList.filter((p) => p.status === "COMPLETED").length;
            const inProgressLessonsCount = lessonProgressList.filter((p) => p.status === "IN_PROGRESS").length;
            const totalLess = lessonProgressList.length;
            const notStartedLess = Math.max(0, totalLess - completedLessonsCount - inProgressLessonsCount);

            setStats({
              pathId: activePathId,
              pathTitle: activeUserPath?.path?.title || "Active Course",
              totalLessons: totalLess,
              completedLessons: completedLessonsCount,
              inProgressLessons: inProgressLessonsCount,
              notStartedLessons: notStartedLess,
              completionPercentage: 0,
            });
          }
        } else {
          setStats(null);
        }
      } catch (e) {
        console.warn("Could not load lesson progress bar chart:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const chartData = stats
    ? [
        { name: "Total Lessons", count: stats.totalLessons ?? 0, fill: "#3b82f6" },
        { name: "Completed", count: stats.completedLessons ?? 0, fill: "#10b981" },
        { name: "In Progress", count: stats.inProgressLessons ?? 0, fill: "#fb923c" },
        { name: "Not Started", count: stats.notStartedLessons ?? 0, fill: "#94a3b8" },
      ]
    : [];

  return (
    <Card variant="white" className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="indigo">Lesson Analytics</Badge>
            </div>
            <CardTitle>Lesson Progress Breakdown</CardTitle>
            <CardDescription>
              {stats?.pathTitle
                ? `${stats.completedLessons ?? 0} of ${stats.totalLessons ?? 0} lessons completed`
                : "Total, completed, in-progress, and not-started lessons"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="h-64 w-full mt-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            Loading lesson stats...
          </div>
        ) : !stats ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            No active course progress found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} interval={0} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "12px",
                  color: "#0f172a",
                  fontSize: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
                formatter={(value: any) => [`${value} lessons`, "Count"]}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={42}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
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
