"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { LearningPathCard, LearningPathData } from "@/components/dashboard/LearningPathCard";
import { Compass, Search, Sparkles } from "lucide-react";
import {
  fetchLearningPaths,
  fetchUserLearningPaths,
  getCurrentUser,
  enrollInLearningPath,
  LearningPath,
} from "@/lib/api";

function formatLevel(lvl?: string): "Beginner" | "Intermediate" | "Advanced" {
  if (!lvl) return "Beginner";
  const up = lvl.trim().toUpperCase();
  if (up === "INTERMEDIATE") return "Intermediate";
  if (up === "ADVANCED") return "Advanced";
  return "Beginner";
}

export const ExplorerView: React.FC = () => {
  const router = useRouter();
  const [paths, setPaths] = useState<LearningPathData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();

        // Fetch all learning paths from DB + current user's enrollments in parallel
        const [allPaths, userEnrollments] = await Promise.all([
          fetchLearningPaths(),
          currentUser?.id ? fetchUserLearningPaths(currentUser.id) : Promise.resolve([]),
        ]);

        if (!allPaths || allPaths.length === 0) {
          setPaths([]);
          return;
        }

        // Build a set of enrolled path ids for the current user
        const enrolledPathIds = new Set(
          userEnrollments.map((ue) => ue.path?.id || ue.pathId).filter(Boolean)
        );
        const activePathId = userEnrollments.find(
          (ue) => ue.active || ue.isActive
        )?.path?.id ?? userEnrollments.find(
          (ue) => ue.active || ue.isActive
        )?.pathId;

        const formatted: LearningPathData[] = allPaths.map((lp: LearningPath) => ({
          id: lp.id,
          title: lp.title,
          description: lp.description || "",
          matchScore: 0,
          level: formatLevel(lp.level),
          estimatedHours: lp.estimatedHours,
          totalModules: lp.totalModules ?? 0,
          completedModules: lp.completedModules ?? 0,
          skillsCovered: lp.skillsCovered ?? [],
          isActive: activePathId ? lp.id === activePathId : enrolledPathIds.has(lp.id),
        }));

        setPaths(formatted);
      } catch (err) {
        console.error("Failed to load explorer paths:", err);
        setPaths([]);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const handleEnroll = async (id: string) => {
    setPaths((prev) => prev.map((p) => ({ ...p, isActive: p.id === id })));
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


  return isLoading ? (
    <DashboardSkeleton />
  ) : (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" icon={<Compass className="w-3.5 h-3.5 text-[#1e3a8a]" />}>
              Course Catalog &amp; Explorer
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Skill Explorer &amp; Course Catalog
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Explore all available courses and enroll in a learning path
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, skill, or keyword..."
            className="w-full bg-[#f4f5f7] border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all"
          />
        </div>

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

      {/* Results count */}
      {paths.length > 0 && (
        <p className="text-xs text-slate-500 font-medium">
          Showing {filteredPaths.length} of {paths.length} courses
        </p>
      )}

      {/* Course Grid */}
      {filteredPaths.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">
            {paths.length === 0 ? "No courses found in the database" : "No courses match your query"}
          </h4>
          <p className="text-xs text-slate-400">
            {paths.length === 0
              ? "Add learning paths in the Curriculum Manager to see them here."
              : "Try adjusting your search or level filter."}
          </p>
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
