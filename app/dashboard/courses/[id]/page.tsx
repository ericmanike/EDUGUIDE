"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  ChevronLeft,
  LayoutList,
  Loader2,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  fetchModules,
  fetchLessonsByModuleId,
  fetchUserLessonProgressByModule,
  fetchUserLessonProgress,
  upsertUserLessonProgress,
  getCurrentUser,
  CourseModule,
  Lesson,
  UserLessonProgress
} from "@/lib/api";

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.id;

  const [moduleData, setModuleData] = useState<CourseModule | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED">>({});
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCourseContent() {
      setIsLoading(true);

      // Restore cached lesson progress from localStorage immediately
      const storageKey = `edtech_lesson_progress_${moduleId}`;
      let cachedProgress: Record<string, "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"> = {};
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(storageKey) || localStorage.getItem("edtech_global_lesson_progress");
          if (raw) {
            cachedProgress = JSON.parse(raw);
            setProgressMap(cachedProgress);
          }
        } catch (e) {}
      }

      try {
        const [allModules, moduleLessons] = await Promise.all([
          fetchModules(),
          fetchLessonsByModuleId(moduleId),
        ]);

        const foundModule = allModules.find((m) => m.id === moduleId) || {
          id: moduleId,
          title: "Module Content",
          topic: "Core Course Module",
          description: "Hands-on video module and curriculum resources.",
          durationMinutes: 120,
        };
        setModuleData(foundModule);

        if (moduleLessons && moduleLessons.length > 0) {
          setLessons(moduleLessons);
          setActiveLessonId(moduleLessons[0].id);
        } else {
          setLessons([]);
        }

        const currentUser = getCurrentUser();
        const userId = currentUser?.id || "u-guest";

        const userProgressList = await fetchUserLessonProgressByModule(userId, moduleId);
        const pMap: Record<string, "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"> = { ...cachedProgress };

        if (userProgressList && userProgressList.length > 0) {
          userProgressList.forEach((up: UserLessonProgress) => {
            pMap[up.lessonId] = up.status;
          });
        }

        // Fetch individual lesson progress using GET /api/user-lesson-progress/user/{userId}/lesson/{lessonId}
        if (moduleLessons && moduleLessons.length > 0) {
          const individualProgresses = await Promise.all(
            moduleLessons.map((lesson) => fetchUserLessonProgress(userId, lesson.id))
          );
          individualProgresses.forEach((prog) => {
            if (prog && prog.lessonId) {
              pMap[prog.lessonId] = prog.status;
            }
          });
        }

        setProgressMap(pMap);

        // Update local storage cache
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify(pMap));
          localStorage.setItem("edtech_global_lesson_progress", JSON.stringify(pMap));
        }
      } catch (err) {
        console.error("Failed to load course page data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCourseContent();
  }, [moduleId]);

  const handleSelectLesson = async (lessonId: string) => {
    setActiveLessonId(lessonId);
    const currentUser = getCurrentUser();
    const userId = currentUser?.id || "u-guest";
    const prog = await fetchUserLessonProgress(userId, lessonId);
    if (prog) {
      setProgressMap((prev) => {
        const updated = { ...prev, [lessonId]: prog.status };
        if (typeof window !== "undefined") {
          localStorage.setItem(`edtech_lesson_progress_${moduleId}`, JSON.stringify(updated));
          localStorage.setItem("edtech_global_lesson_progress", JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  const handleToggleLessonProgress = async (lessonId: string) => {
    const currentStatus = progressMap[lessonId] || "NOT_STARTED";
    const nextStatus = currentStatus === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED";

    // 1. Immediately update local React state and persist to localStorage
    const updatedMap = { ...progressMap, [lessonId]: nextStatus };
    setProgressMap(updatedMap);
    if (typeof window !== "undefined") {
      localStorage.setItem(`edtech_lesson_progress_${moduleId}`, JSON.stringify(updatedMap));
      localStorage.setItem("edtech_global_lesson_progress", JSON.stringify(updatedMap));
    }

    // 2. Persist to backend database via REST API
    const currentUser = getCurrentUser();
    const userId = currentUser?.id || "u-guest";

    await upsertUserLessonProgress({
      userId,
      lessonId,
      status: nextStatus,
    });

    // 3. Refetch specific lesson progress via GET /api/user-lesson-progress/user/{userId}/lesson/{lessonId}
    const updatedProg = await fetchUserLessonProgress(userId, lessonId);
    if (updatedProg) {
      setProgressMap((prev) => {
        const synced = { ...prev, [lessonId]: updatedProg.status };
        if (typeof window !== "undefined") {
          localStorage.setItem(`edtech_lesson_progress_${moduleId}`, JSON.stringify(synced));
          localStorage.setItem("edtech_global_lesson_progress", JSON.stringify(synced));
        }
        return synced;
      });
    }
  };

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  const completedCount = lessons.filter(
    (l) => progressMap[l.id] === "COMPLETED"
  ).length;
  const completionPercentage = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#1e3a8a] animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading module lessons from backend...</p>
      </div>
    );
  }

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
            <Badge variant="indigo">{moduleData?.topic || "Course Module"}</Badge>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lessons.length} Video Lessons
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {moduleData?.title || "Interactive Learning Node"}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content (Video & Details) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="w-full aspect-video rounded-2xl bg-slate-900 overflow-hidden relative shadow-xl shadow-slate-900/15 group cursor-pointer border-2 border-slate-800">
            {activeLesson?.videoUrl && (activeLesson.videoUrl.startsWith("http") || activeLesson.videoUrl.startsWith("/")) ? (
              activeLesson.videoUrl.includes("youtube.com") || activeLesson.videoUrl.includes("youtu.be") ? (
                <iframe
                  src={activeLesson.videoUrl.replace("watch?v=", "embed/")}
                  title={activeLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeLesson.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-indigo-600/90 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-indigo-600/40 group-hover:scale-110 transition-transform duration-300 mb-3">
                  <PlayCircle className="w-8 h-8 md:w-10 md:h-10 text-white fill-white/20" />
                </div>
                <h4 className="text-white font-black text-base md:text-lg mb-1">
                  {activeLesson?.title || moduleData?.title}
                </h4>
                <p className="text-xs text-slate-400 max-w-md">
                  {activeLesson?.summary || moduleData?.description || "Select a lesson from the syllabus menu to play."}
                </p>
              </div>
            )}
          </div>

          {/* Details / Overview */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {activeLesson?.title || "Lesson Overview"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Lesson {activeLesson?.sequenceOrder || 1} • {activeLesson?.durationMinutes || 15} minutes
                </p>
              </div>

              {activeLesson && (
                <Button
                  variant={progressMap[activeLesson.id] === "COMPLETED" ? "outline" : "primary"}
                  size="sm"
                  onClick={() => handleToggleLessonProgress(activeLesson.id)}
                >
                  {progressMap[activeLesson.id] === "COMPLETED" ? "Completed" : "Mark Complete"}
                </Button>
              )}
            </div>

            <p className="text-sm leading-relaxed text-slate-600 font-medium">
              {activeLesson?.summary || moduleData?.description || "No specific lesson notes attached."}
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
              {activeLesson?.resourcesUrl ? (
                <a
                  href={activeLesson.resourcesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  <Download className="w-4 h-4" /> Download Resources
                </a>
              ) : (
                <Button variant="outline" size="sm" icon={<FileText className="w-4 h-4" />}>
                  Lesson Materials
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (Syllabus) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[calc(100vh-140px)] sticky top-24">
          <div className="p-5 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">
            <div className="flex items-center gap-2 mb-2">
              <LayoutList className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Module Syllabus</h3>
            </div>
            <div className="flex items-center justify-between text-xs font-bold mt-3 mb-2">
              <span className="text-slate-700">{completedCount} / {lessons.length} Completed</span>
              <span className="text-indigo-600">{completionPercentage}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full shadow-sm transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {lessons.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-50" />
                No video lessons uploaded for this module yet.
              </div>
            ) : (
              lessons.map((lesson) => {
                const isActive = lesson.id === activeLessonId;
                const isCompleted = progressMap[lesson.id] === "COMPLETED";

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson.id)}
                    className={`w-full flex items-start gap-3 p-3 text-left rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-50 border border-indigo-100 shadow-sm relative overflow-hidden"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-xl" />
                    )}

                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : isActive ? (
                        <div className="relative w-5 h-5 flex items-center justify-center">
                          <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20" />
                          <PlayCircle className="w-5 h-5 text-indigo-600 fill-indigo-100 relative z-10" />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 pr-2 min-w-0">
                      <h4 className={`text-sm font-bold leading-tight mb-1 truncate ${
                        isActive ? "text-indigo-950" : "text-slate-700"
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400">
                        {lesson.durationMinutes ? `${lesson.durationMinutes} mins` : "10:00"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
