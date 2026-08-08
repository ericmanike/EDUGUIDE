"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Star, Users, ArrowRight, PlayCircle, Clock } from "lucide-react";
import { fetchModules, CourseModule } from "@/lib/api";

interface CourseItem {
  id: string;
  title: string;
  provider: string;
  rating: number;
  students: string;
  level: string;
  tag: string;
  hours: string;
  imageBg: string;
}

const defaultCourses: CourseItem[] = [
  {
    id: "c1",
    title: "Spring Boot 3 & PostgreSQL Backend Architecture",
    provider: "SkillsBank Core",
    rating: 4.9,
    students: "1,420",
    level: "Intermediate",
    tag: "Backend Track",
    hours: "18 hrs",
    imageBg: "from-blue-900 to-indigo-950",
  },
  {
    id: "c2",
    title: "Next.js 16 App Router & Fullstack Integration",
    provider: "SkillsBank Core",
    rating: 4.8,
    students: "2,150",
    level: "Advanced",
    tag: "Frontend Track",
    hours: "16 hrs",
    imageBg: "from-slate-900 to-slate-800",
  },
  {
    id: "c3",
    title: "Algorithm & Data Structures for Recommendation Systems",
    provider: "SkillsBank Specialization",
    rating: 4.9,
    students: "980",
    level: "Intermediate",
    tag: "Recommender Logic",
    hours: "12 hrs",
    imageBg: "from-indigo-900 to-slate-900",
  },
];

export const RecommendedCourses: React.FC = () => {
  const router = useRouter();
  const [coursesList, setCoursesList] = useState<CourseItem[]>(defaultCourses);

  useEffect(() => {
    const loadModules = async () => {
      const apiModules = await fetchModules();
      if (apiModules && apiModules.length > 0) {
        const formatted: CourseItem[] = apiModules.map((m: CourseModule, i: number) => ({
          id: m.id,
          title: m.title,
          provider: "SkillsBank Core",
          rating: 4.9,
          students: `${(i + 1) * 350}`,
          level: "Intermediate",
          tag: m.topic || "Core Module",
          hours: `${Math.round(m.durationMinutes / 60)} hrs`,
          imageBg: i % 2 === 0 ? "from-blue-900 to-indigo-950" : "from-slate-900 to-slate-800",
        }));
        setCoursesList(formatted);
      }
    };

    loadModules();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Recommended Course Modules</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Hand-picked modules based on your goals
          </p>
        </div>
        <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
          View All Modules
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {coursesList.map((course) => (
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

                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <Badge variant="slate" size="sm" className="bg-slate-900/80 text-white backdrop-blur-md border-0 font-bold">
                    {course.level}
                  </Badge>
                </div>

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

              {/* Rating & Enrolled */}
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="text-slate-900 font-bold">{course.rating}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.hours}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.students}</span>
                  </div>
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
    </div>
  );
};
