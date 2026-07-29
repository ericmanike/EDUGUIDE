import React from "react";
import { PlayCircle, CheckCircle2, Circle, FileText, Download, ChevronLeft, LayoutList } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Mock Data
const mockLessons = [
  { id: 1, title: "Introduction & Environment Setup", duration: "12:45", completed: true },
  { id: 2, title: "Core Concepts and Architecture", duration: "18:20", completed: true },
  { id: 3, title: "Building the First Module", duration: "25:10", completed: false, active: true },
  { id: 4, title: "Database Integration", duration: "22:15", completed: false },
  { id: 5, title: "Advanced Patterns", duration: "30:05", completed: false },
  { id: 6, title: "Security & Authentication", duration: "45:00", completed: false },
  { id: 7, title: "Deployment and CI/CD", duration: "28:30", completed: false },
];

export default function CoursePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Back button & Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/courses"
          className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="indigo">Course Track</Badge>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Module 3</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Interactive Learning Node
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content (Video & Tabs) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Mock */}
          <div className="w-full aspect-video rounded-2xl bg-slate-900 overflow-hidden relative shadow-xl shadow-slate-900/15 group cursor-pointer border-2 border-slate-800">
            {/* Video overlay / play button */}
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/40 group-hover:bg-slate-900/20 transition-all">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-indigo-600/90 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-indigo-600/40 group-hover:scale-110 transition-transform duration-300">
                <PlayCircle className="w-8 h-8 md:w-10 md:h-10 text-white fill-white/20" />
              </div>
            </div>
            
            {/* Fake video timeline */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800/80 z-20">
              <div className="h-full bg-indigo-500 w-[42%] relative rounded-r-full">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
              </div>
            </div>
            
            {/* Decorative gradient for the mock bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-violet-900/40 mix-blend-overlay" />
          </div>

          {/* Details / Tabs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-8 border-b border-slate-100 pb-0">
              <button className="text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-4 -mb-[1px]">
                Overview
              </button>
              <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors pb-4 -mb-[1px] border-b-2 border-transparent">
                Resources
              </button>
              <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors pb-4 -mb-[1px] border-b-2 border-transparent">
                Q&A
              </button>
            </div>
            
            <div className="space-y-4 pt-6">
              <h3 className="text-lg font-black text-slate-900">About this lesson</h3>
              <p className="text-sm leading-relaxed text-slate-600 font-medium">
                In this module, we will dive deep into creating the core architecture of your application.
                You will learn how to structure your files, set up the database connection using modern
                tools, and ensure your application is scalable and maintainable from day one.
              </p>
              
              <div className="flex items-center gap-4 pt-6 mt-4 border-t border-slate-50">
                <Button variant="outline" size="sm" icon={<FileText className="w-4 h-4" />}>
                  Lesson Notes
                </Button>
                <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
                  Source Code
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Syllabus) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[calc(100vh-140px)] sticky top-24">
          <div className="p-5 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">
            <div className="flex items-center gap-2 mb-2">
              <LayoutList className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Course Syllabus</h3>
            </div>
            <div className="flex items-center justify-between text-xs font-bold mt-3 mb-2">
              <span className="text-slate-700">2 / 7 Completed</span>
              <span className="text-indigo-600">28%</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[28%] rounded-full shadow-sm" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {mockLessons.map((lesson) => (
              <button
                key={lesson.id}
                className={`w-full flex items-start gap-3 p-3 text-left rounded-xl transition-all duration-200 ${
                  lesson.active 
                    ? "bg-indigo-50 border border-indigo-100 shadow-sm relative overflow-hidden" 
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                {lesson.active && (
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-xl" />
                )}
                
                <div className="mt-0.5 shrink-0">
                  {lesson.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : lesson.active ? (
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
                      <PlayCircle className="w-5 h-5 text-indigo-600 fill-indigo-100 relative z-10" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 pr-2">
                  <h4 className={`text-sm font-bold leading-tight mb-1 ${
                    lesson.active ? 'text-indigo-950' : 'text-slate-700'
                  }`}>
                    {lesson.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-400">
                    {lesson.duration}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
