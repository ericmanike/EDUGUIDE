"use client";

import React, { useState } from "react";
import { RecommendedCourses } from "@/components/dashboard/RecommendedCourses";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, Sparkles, Layers, Zap, Database, Cpu, Filter } from "lucide-react";

const topics = [
  { id: "All", label: "All Modules", icon: Filter },
  { id: "Spring Boot", label: "Spring Boot", icon: Layers },
  { id: "Next.js", label: "Next.js 16", icon: Zap },
  { id: "PostgreSQL", label: "PostgreSQL", icon: Database },
  { id: "Recommender Logic", label: "AI Recommender", icon: Cpu },
];

export const CoursesView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" icon={<BookOpen className="w-3 h-3" />}>
              Course Catalog
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Course Modules & Learning Nodes
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Curated hands-on modules recommended by the EduGuide engine
          </p>
        </div>

        {/* Filter Pills with Lucide Icons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {topics.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Course Modules Grid */}
      <RecommendedCourses />
    </div>
  );
};
