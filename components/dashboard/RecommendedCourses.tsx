import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Star, Users, ArrowRight, PlayCircle, BookCheck } from "lucide-react";

interface Course {
  id: string;
  title: string;
  provider: string;
  rating: number;
  students: string;
  level: string;
  tag: string;
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
    tag: "Recommended for Backend",
    imageBg: "from-orange-500 to-amber-500",
  },
  {
    id: "c2",
    title: "Next.js 16 App Router & Fullstack Integration",
    provider: "EduGuide Core",
    rating: 4.8,
    students: "2,150",
    level: "Advanced",
    tag: "Top Choice Frontend",
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
    imageBg: "from-orange-600 to-orange-400",
  },
];

export const RecommendedCourses: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Recommended Course Modules
          </h3>
          <p className="text-xs text-slate-500">
            Hand-picked modules based on your target learning path
          </p>
        </div>
        <Button variant="ghost" size="sm">
          View All Modules
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} variant="white" className="flex flex-col justify-between group">
            <div>
              {/* Header Gradient Banner */}
              <div
                className={`h-24 -mx-6 -mt-6 mb-4 rounded-t-2xl bg-gradient-to-r ${course.imageBg} p-4 flex items-end justify-between relative overflow-hidden`}
              >
                <div className="absolute top-2 right-2">
                  <Badge variant="slate" size="sm">
                    {course.level}
                  </Badge>
                </div>
                <PlayCircle className="w-8 h-8 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded">
                  {course.tag}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                {course.title}
              </h4>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {course.provider}
              </p>

              {/* Rating & Enrolled */}
              <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold mt-3">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="text-slate-900 font-bold">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>{course.students} Students</span>
                </div>
              </div>
            </div>

            <CardFooter className="pt-3 border-t border-slate-100">
              <Button
                variant="orange"
                size="sm"
                fullWidth
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Start Learning
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
