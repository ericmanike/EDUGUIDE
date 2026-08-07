"use client";

import React, { useState } from "react";
import { RecommendedCourses } from "@/components/dashboard/RecommendedCourses";
import { Layers, Zap, Database, Cpu, Filter } from "lucide-react";

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
      {/* Filter Pills with Lucide Icons */}
      <div className="flex justify-center w-full">
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
                    ? "bg-[#1e3a8a] text-white shadow-md shadow-[#1e3a8a]/20"
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
