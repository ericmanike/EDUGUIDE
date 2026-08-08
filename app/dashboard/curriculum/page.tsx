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
  Plus,
  Sparkles,
} from "lucide-react";
import {
  fetchLearningPaths,
  fetchModules,
  fetchPathModules,
  LearningPath,
  CourseModule,
  PathModule,
} from "@/lib/api";

export default function CurriculumOverviewPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [mappings, setMappings] = useState<PathModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pathsData, modulesData, mappingsData] = await Promise.all([
        fetchLearningPaths(),
        fetchModules(),
        fetchPathModules(),
      ]);
      setPaths(pathsData || []);
      setModules(modulesData || []);
      setMappings(mappingsData || []);
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-blue-50 text-[#1e3a8a]">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900">{paths.length}</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Learning Paths</h4>
            <p className="text-xs text-slate-400 font-medium">Structured learning tracks</p>
          </div>
          <Link
            href="/dashboard/curriculum/paths"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] hover:text-blue-700 transition-colors pt-2"
          >
            Manage Paths <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900">{modules.length}</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Course Modules</h4>
            <p className="text-xs text-slate-400 font-medium">Core course subjects & topics</p>
          </div>
          <Link
            href="/dashboard/curriculum/modules"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] hover:text-blue-700 transition-colors pt-2"
          >
            Manage Modules <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <LinkIcon className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900">{mappings.length}</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Path-Module Mappings</h4>
            <p className="text-xs text-slate-400 font-medium">Sequence node ordering</p>
          </div>
          <Link
            href="/dashboard/curriculum/mappings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] hover:text-blue-700 transition-colors pt-2"
          >
            Manage Mappings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Sub-Route Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Learning Paths Route</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Create, edit, or remove learning path roadmaps (Title, Description, Difficulty Level, Estimated Hours).
            </p>
          </div>
          <Link
            href="/dashboard/curriculum/paths"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-[#1e3a8a]/20"
          >
            Open Paths Sub-Route <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Course Modules Route</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Add new course modules, update topic categories, edit titles, descriptions, and duration minutes.
            </p>
          </div>
          <Link
            href="/dashboard/curriculum/modules"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-[#1e3a8a]/20"
          >
            Open Modules Sub-Route <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Path Mappings Route</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Map course modules to learning paths, sequence node ordering, and manage course prerequisites.
            </p>
          </div>
          <Link
            href="/dashboard/curriculum/mappings"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-[#1e3a8a]/20"
          >
            Open Mappings Sub-Route <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
