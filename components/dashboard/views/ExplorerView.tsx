"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { LearningPathCard, LearningPathData } from "@/components/dashboard/LearningPathCard";
import { Compass, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import {
  fetchLearningPaths,
  fetchUserLearningPaths,
  getCurrentUser,
  enrollInLearningPath,
  LearningPath,
} from "@/lib/api";

export const ExplorerView: React.FC = () => {
  const router = useRouter();
  const [paths, setPaths] = useState<LearningPathData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCoursePaths() {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        const apiPaths = await fetchLearningPaths();
        let userPaths: any[] = [];
        if (currentUser?.id) {
          userPaths = await fetchUserLearningPaths(currentUser.id);
        }

        if (apiPaths && apiPaths.length > 0) {
          const activeUserPath = userPaths.find((up) => up.isActive);
          const activePathId = activeUserPath?.path?.id || activeUserPath?.pathId;

          const formatLevel = (lvl?: string): "Beginner" | "Intermediate" | "Advanced" => {
            if (!lvl) return "Beginner";
            const normalized = lvl.trim().toUpperCase();
            if (normalized === "BEGINNER") return "Beginner";
            if (normalized === "INTERMEDIATE") return "Intermediate";
            if (normalized === "ADVANCED") return "Advanced";
            return (lvl.charAt(0).toUpperCase() + lvl.slice(1).toLowerCase()) as any;
          };

          const formatted: LearningPathData[] = apiPaths.map((ap: LearningPath, idx: number) => {
            const isEnrolled = userPaths.some((up) => (up.path?.id || up.pathId) === ap.id);
            const isCurrentlyActive = activePathId ? ap.id === activePathId : isEnrolled || idx === 0;

            return {
              id: ap.id,
              title: ap.title,
              description: ap.description || "Comprehensive career course path.",
              matchScore: ap.matchScore || 96 - idx * 2,
              level: formatLevel(ap.level),
              estimatedHours: ap.estimatedHours || 40,
              totalModules: ap.totalModules || 10,
              completedModules: ap.completedModules || 0,
              skillsCovered: ap.skillsCovered || [],
              isActive: isCurrentlyActive,
            };
          });

          setPaths(formatted);
        } else {
          setPaths([]);
        }
      } catch (err) {
        console.warn("Failed to load skill explorer course paths:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCoursePaths();
  }, []);

  const handleEnroll = async (id: string) => {
    setPaths((prev) =>
      prev.map((p) => ({ ...p, isActive: p.id === id }))
    );
    await enrollInLearningPath(id);
  };

  const filteredPaths = paths.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skillsCovered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel =
      selectedLevel === "All" || p.level.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesLevel;
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" icon={<Compass className="w-3.5 h-3.5 text-[#1e3a8a]" />}>
              Course Catalog & Explorer
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Skill Explorer & Course Catalog
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Explore career courses, evaluate skill tracks, and enroll in learning paths directly
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title, skill, or keyword..."
            className="w-full bg-[#f4f5f7] border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all"
          />
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedLevel === lvl
                  ? "bg-[#1e3a8a] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid for Enrollment */}
      {filteredPaths.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No courses match your query</h4>
          <p className="text-xs text-slate-400">Try adjusting your search query or level filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <LearningPathCard
              key={path.id}
              path={path}
              onSelectPath={handleEnroll}
              onViewNodes={() => router.push("/dashboard")}
            />
          ))}
        </div>
      )}
    </div>
  );
};
