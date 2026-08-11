"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { LearningPathCard, LearningPathData } from "@/components/dashboard/LearningPathCard";
import { PathProgressBarChart } from "@/components/dashboard/AnalyticsCharts";
import { SlidersHorizontal } from "lucide-react";
import { fetchLearningPaths, fetchUserLearningPaths, getCurrentUser, enrollInLearningPath } from "@/lib/api";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export const PathsView: React.FC = () => {
  const [paths, setPaths] = useState<LearningPathData[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPaths = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        const apiData = await fetchLearningPaths();
        let userPaths: any[] = [];
        if (currentUser?.id) {
          userPaths = await fetchUserLearningPaths(currentUser.id);
        }

        if (apiData && apiData.length > 0) {
          const activeUserPath = userPaths.find((up) => up.isActive);
          const activePathId = activeUserPath?.path?.id || activeUserPath?.pathId;

          const formatted: LearningPathData[] = apiData.map((ap, idx) => {
            const isCurrentlyActive = activePathId ? ap.id === activePathId : idx === 0;
            return {
              id: ap.id,
              title: ap.title,
              description: ap.description || "Custom learning path.",
              matchScore: ap.matchScore || 95,
              level: (ap.level as any) || "",
              estimatedHours: ap.estimatedHours || 40,
              totalModules: ap.totalModules || 10,
              completedModules: ap.completedModules || 0,
              skillsCovered: ap.skillsCovered || [],
              isActive: isCurrentlyActive,
            };
          });
          setPaths(formatted);
        }
      } catch (error) {
        console.error("Error loading learning paths:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPaths();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const filteredPaths = paths.filter((p) => {
    if (filter === "Active") return p.isActive;
    if (filter === "Intermediate") return p.level === "Intermediate";
    if (filter === "Advanced") return p.level === "Advanced";
    return true;
  });

  const handleSelect = async (id: string) => {
    setPaths((prev) =>
      prev.map((p) => ({ ...p, isActive: p.id === id }))
    );
    await enrollInLearningPath(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo">
              AI Recommender
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Recommended Learning Paths
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Personalized career roadmaps generated dynamically for your skill profile
          </p>
        </div>
      </div>

      {/* Module Progress Comparison Chart */}
      <PathProgressBarChart />

      {/* Filters Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          {["All", "Active", "Intermediate", "Advanced"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === cat
                  ? "bg-[#1e3a8a] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <SlidersHorizontal className="w-4 h-4 text-[#1e3a8a]" />
          <span className="font-semibold">{filteredPaths.length} Paths Found</span>
        </div>
      </div>

      {/* Grid of Learning Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPaths.map((path) => (
          <LearningPathCard
            key={path.id}
            path={path}
            onSelectPath={handleSelect}
            onViewNodes={() => alert(`Opening roadmap details for ${path.title}`)}
          />
        ))}
      </div>
    </div>
  );
};
