"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { LearningPathCard, LearningPathData } from "@/components/dashboard/LearningPathCard";
import { SlidersHorizontal } from "lucide-react";
import { fetchLearningPaths, fetchActiveUserLearningPaths, getCurrentUser, enrollInLearningPath, UserLearningPath } from "@/lib/api";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const PathsView: React.FC = () => {
  const [paths, setPaths] = useState<LearningPathData[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    const loadPaths = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        const apiData = await fetchLearningPaths();
        let activeUserPaths: UserLearningPath[] = [];
        if (currentUser?.id) {
          activeUserPaths = await fetchActiveUserLearningPaths(currentUser.id);
        }

        if (apiData && apiData.length > 0) {
          const activeUserPath = activeUserPaths[0];
          const activePathId = activeUserPath?.path?.id || activeUserPath?.pathId;

          const formatted: LearningPathData[] = apiData.map((ap, idx) => {
            const isCurrentlyActive = activePathId ? ap.id === activePathId : idx === 0;
            const formatLevel = (lvl?: string): "Beginner" | "Intermediate" | "Advanced" => {
              const up = (lvl || "").trim().toUpperCase();
              if (up === "INTERMEDIATE") return "Intermediate";
              if (up === "ADVANCED") return "Advanced";
              return "Beginner";
            };

            return {
              id: ap.id,
              title: ap.title,
              description: ap.description || "Custom learning path.",
              matchScore: ap.matchScore || 95,
              level: formatLevel(ap.level),
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


  const filteredPaths = paths.filter((p) => {
    if (filter === "Active") return p.isActive;
    if (filter === "Intermediate") return p.level === "Intermediate";
    if (filter === "Advanced") return p.level === "Advanced";
    return true;
  });

  const handleSelect = async (id: string) => {
    const path = paths.find((p) => p.id === id);
    setEnrollingId(id);
    try {
      const success = await enrollInLearningPath(id);
      if (success) {
        setPaths((prev) =>
          prev.map((p) => ({ ...p, isActive: p.id === id }))
        );
        toast.success(`Enrolled in ${path?.title || "learning path"}!`);
      } else {
        toast.error(`Failed to enroll in ${path?.title || "learning path"}. Please try again.`);
      }
    } finally {
      setEnrollingId(null);
    }
  };

  return isLoading ? (
    <DashboardSkeleton />
  ) : (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo">
              Enrolled Courses
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Enrolled Courses
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Explore and continue your enrolled courses and learning tracks
          </p>
        </div>
      </div>

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
            isEnrolling={enrollingId === path.id}
            onViewNodes={() => alert(`Opening roadmap details for ${path.title}`)}
          />
        ))}
      </div>
    </div>
  );
};
