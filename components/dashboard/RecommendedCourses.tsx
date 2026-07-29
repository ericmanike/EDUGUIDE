import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Star, Users, ArrowRight, PlayCircle, Clock, Sparkles } from "lucide-react";

interface Course {
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

const courses: Course[] = [
  {
    id: "c1",
    title: "Spring Boot 3 & PostgreSQL Backend Architecture",
    provider: "EduGuide Core",
    rating: 4.9,
    students: "1,420",
    level: "Intermediate",
    tag: "Backend Track",
    hours: "18 hrs",
    imageBg: "from-indigo-600 to-indigo-800",
  },
  {
    id: "c2",
    title: "Next.js 16 App Router & Fullstack Integration",
    provider: "EduGuide Core",
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
    provider: "EduGuide Specialization",
    rating: 4.9,
    students: "980",
    level: "Intermediate",
    tag: "Recommender Logic",
    hours: "12 hrs",
    imageBg: "from-indigo-700 to-violet-900",
  },
];

export const RecommendedCourses: React.FC = () => {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Recommended Course Modules</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Hand-picked modules based on your target learning path
          </p>
        </div>
        <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
          View All Modules
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {courses.map((course) => (
          <Card key={course.id} variant="white" className="flex flex-col justify-between group">
            <div>
              {/* Header Gradient Banner */}
              <div
                className={`h-28 -mx-6 -mt-6 mb-4 rounded-t-2xl bg-gradient-to-r ${course.imageBg} p-4 flex items-end justify-between relative overflow-hidden`}
              >
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <Badge variant="slate" size="sm">
                    {course.level}
                  </Badge>
                </div>
                <PlayCircle className="w-9 h-9 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg">
                  {course.tag}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
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
