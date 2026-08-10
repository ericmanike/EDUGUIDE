"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Layers,
  BookOpen,
  Link as LinkIcon,
  ArrowRight,
  RefreshCw,
  PlayCircle,
} from "lucide-react";
import {
  fetchLearningPaths,
  fetchModules,
  fetchPathModules,
  fetchAllLessons,
  LearningPath,
  CourseModule,
  PathModule,
  Lesson,
} from "@/lib/api";

export default function CurriculumOverviewPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [mappings, setMappings] = useState<PathModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pathsData, modulesData, mappingsData, lessonsData] = await Promise.all([
        fetchLearningPaths(),
        fetchModules(),
        fetchPathModules(),
        fetchAllLessons(),
      ]);
      setPaths(pathsData || []);
      setModules(modulesData || []);
      setMappings(mappingsData || []);
      setLessons(lessonsData || []);
    } catch (error) {
      console.error("Failed to load curriculum stats:", error);
      toast.error("Failed to load curriculum data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Curriculum Overview & Analytics
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage your educational structure across all sub-routes.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-blue-50 text-[#1e3a8a]">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900">{paths.length}</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Learning Paths</h4>
              <p className="text-xs text-slate-400 font-medium">Structured learning tracks</p>
            </div>
          </div>
          <Link
            href="/dashboard/curriculum/paths"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-[#1e3a8a]/20 cursor-pointer active:scale-[0.98]"
          >
            Manage Paths <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900">{modules.length}</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Course Modules</h4>
              <p className="text-xs text-slate-400 font-medium">Core course subjects & topics</p>
            </div>
          </div>
          <Link
            href="/dashboard/curriculum/modules"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-[#1e3a8a]/20 cursor-pointer active:scale-[0.98]"
          >
            Manage Modules <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <PlayCircle className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900">{lessons.length}</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Video Lessons</h4>
              <p className="text-xs text-slate-400 font-medium">Granular lesson sequence nodes</p>
            </div>
          </div>
          <Link
            href="/dashboard/curriculum/lessons"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-[#1e3a8a]/20 cursor-pointer active:scale-[0.98]"
          >
            Manage Lessons <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                <LinkIcon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900">{mappings.length}</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Path-Module Mappings</h4>
              <p className="text-xs text-slate-400 font-medium">Sequence node ordering</p>
            </div>
          </div>
          <Link
            href="/dashboard/curriculum/mappings"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-[#1e3a8a]/20 cursor-pointer active:scale-[0.98]"
          >
            Manage Mappings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
