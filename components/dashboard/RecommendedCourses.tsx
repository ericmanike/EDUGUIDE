"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ArrowRight, PlayCircle, Clock } from "lucide-react";
import {
  fetchModules,
  fetchLearningPaths,
  fetchUserLearningPaths,
  fetchPathModulesByPath,
  fetchUserModuleProgress,
  getCurrentUser,
  CourseModule,
  UserModuleProgress,
} from "@/lib/api";

function formatPathLevel(lvl?: string): string {
  if (!lvl) return "";
  const upper = lvl.toUpperCase();
  if (upper === "BEGINNER") return "Beginner";
  if (upper === "INTERMEDIATE") return "Intermediate";
  if (upper === "ADVANCED") return "Advanced";
  return lvl.charAt(0).toUpperCase() + lvl.slice(1).toLowerCase();
}

interface CourseItem {
  id: string;
  title: string;
  provider: string;
  rating: number;
  students: string;
  level?: string;
  tag: string;
  hours: string;
  progressPercentage?: number;
  imageBg: string;
}

interface RecommendedCoursesProps {
  selectedTopic?: string;
  onlyActivePathModules?: boolean;
}

export const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({
  selectedTopic = "All",
  onlyActivePathModules = true,
}) => {
  const router = useRouter();
  const [coursesList, setCoursesList] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadModules = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        const allModules = await fetchModules();
        const allLearningPaths = await fetchLearningPaths();
        let activeModules: CourseModule[] = [];
        const moduleProgressMap: Record<string, number> = {};

        // Map pathId -> path level
        const pathLevelMap: Record<string, string> = {};
        allLearningPaths.forEach((p) => {
          if (p.id && p.level) {
            pathLevelMap[p.id] = formatPathLevel(p.level);
          }
        });

        // Map moduleId -> path level
        const moduleLevelMap: Record<string, string> = {};

        if (currentUser?.id) {
          // Step 1: Fetch user enrolled learning paths
          const userPaths = await fetchUserLearningPaths(currentUser.id);

          // Step 3: Fetch user's module progress across all modules
          try {
            const userProgressList = await fetchUserModuleProgress(currentUser.id);
            if (userProgressList && userProgressList.length > 0) {
              userProgressList.forEach((ump: UserModuleProgress) => {
                const mId = ump.module?.id || ump.moduleId;
                if (mId) {
                  moduleProgressMap[mId] = ump.progressPercentage || 0;
                }
              });
            }
          } catch (pe) {
            console.warn("Could not load user module progress:", pe);
          }

          if (userPaths && userPaths.length > 0) {
            // Step 2: For each enrolled path, fetch its modules
            const enrolledPathIds = userPaths
              .map((up) => up.path?.id || up.pathId)
              .filter(Boolean) as string[];

            // Populate pathLevelMap from userPaths if nested path object is present
            userPaths.forEach((up) => {
              const pId = up.path?.id || up.pathId;
              const pLvl = up.path?.level;
              if (pId && pLvl) {
                pathLevelMap[pId] = formatPathLevel(pLvl);
              }
            });

            const pathModulesArrays = await Promise.all(
              enrolledPathIds.map((pId) => fetchPathModulesByPath(pId))
            );

            const enrolledModuleMap = new Map<string, CourseModule>();
            pathModulesArrays.forEach((pMods, idx) => {
              const parentPathId = enrolledPathIds[idx];
              const parentLevel = pathLevelMap[parentPathId] || "";

              pMods?.forEach((pm) => {
                const mId = pm.module?.id || pm.moduleId;
                const pmLevel = pm.path?.level ? formatPathLevel(pm.path.level) : parentLevel;

                if (mId) {
                  if (pmLevel) moduleLevelMap[mId] = pmLevel;

                  if (pm.module?.id) {
                    enrolledModuleMap.set(pm.module.id, {
                      id: pm.module.id,
                      title: pm.module.title,
                      topic: pm.module.topic || "Core",
                      description: pm.module.description || "",
                      durationMinutes: pm.module.durationMinutes || 120,
                    });
                  } else if (pm.moduleId) {
                    const matched = allModules.find((m) => m.id === pm.moduleId);
                    if (matched) enrolledModuleMap.set(matched.id, matched);
                  }
                }
              });
            });

            if (enrolledModuleMap.size > 0) {
              activeModules = Array.from(enrolledModuleMap.values());
            } else {
              activeModules = allModules;
            }
          } else {
            activeModules = allModules;
          }
        } else {
          activeModules = allModules;
        }

        if (activeModules && activeModules.length > 0) {
          const filteredModules =
            selectedTopic === "All"
              ? activeModules
              : activeModules.filter(
                  (m: CourseModule) =>
                    m.topic?.toLowerCase().includes(selectedTopic.toLowerCase()) ||
                    m.title?.toLowerCase().includes(selectedTopic.toLowerCase())
                );

          const formatted: CourseItem[] = filteredModules.map((m: CourseModule, i: number) => ({
            id: m.id,
            title: m.title,
            provider: "SkillsBank Core",
            rating: 4.9,
            students: `${(i + 1) * 120}`,
            level: moduleLevelMap[m.id] || "",
            tag: m.topic || "Enrolled Module",
            hours: `${Math.round((m.durationMinutes || 120) / 60)} hrs`,
            progressPercentage: moduleProgressMap[m.id] !== undefined ? moduleProgressMap[m.id] : 0,
            imageBg: i % 2 === 0 ? "from-blue-900 to-indigo-950" : "from-slate-900 to-slate-800",
          }));
          setCoursesList(formatted);
        } else {
          setCoursesList([]);
        }
      } catch (err) {
        console.warn("Could not load backend course modules:", err);
        setCoursesList([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadModules();
  }, [selectedTopic, onlyActivePathModules]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Enrolled Course Modules</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Modules belonging to your enrolled courses & learning tracks
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={() => router.push("/dashboard/explore")}
        >
          Explore Catalog
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-36 bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-5/6 bg-slate-200 rounded-md" />
                  <div className="h-3 w-1/3 bg-slate-100 rounded-md" />
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <div className="h-3 w-3 bg-slate-200 rounded-full" />
                    <div className="h-3 w-32 bg-slate-100 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="h-8 bg-slate-200 rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coursesList?.map((course) => (
            <Card key={course.id} variant="white" className="flex flex-col justify-between group">
              <div>
                {/* Header Cover Image Banner */}
                <div className="h-36 -mx-6 -mt-6 mb-4 rounded-t-2xl relative overflow-hidden group">
                  <img
                    src="/cover_image.jpg"
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {course.level ? (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      <Badge variant="slate" size="sm" className="bg-slate-900/80 text-white backdrop-blur-md border-0 font-bold">
                        {course.level}
                      </Badge>
                    </div>
                  ) : null}

                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                    <PlayCircle className="w-9 h-9 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/20">
                      {course.tag}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors line-clamp-2 leading-snug">
                  {course.title}
                </h4>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  {course.provider}
                </p>

                {/* Duration Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#fb923c]" />
                    <span>{course.hours} Estimated Duration</span>
                  </div>
                </div>
              </div>

              <CardFooter className="pt-4 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                >
                  Start Module
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
