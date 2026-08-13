import React from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Clock, BookOpen, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export interface LearningPathData {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  totalModules: number;
  completedModules: number;
  skillsCovered: string[];
  isActive?: boolean;
}

interface LearningPathCardProps {
  path: LearningPathData;
  onSelectPath?: (id: string) => void;
  onViewNodes?: (path: LearningPathData) => void;
  isEnrolling?: boolean;
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  path,
  onSelectPath,
  onViewNodes,
  isEnrolling = false,
}) => {
  const progressPercent = Math.round(
    (path.completedModules / path.totalModules) * 100
  );

  return (
    <Card
      variant={path.isActive ? "indigo-accent" : "white"}
      className="relative flex flex-col justify-between h-full group"
    >
      <div>
        {/* Header Cover Image Banner */}
        <div className="h-32 -mx-6 -mt-6 mb-4 rounded-t-2xl relative overflow-hidden group">
          <img
            src="/cover_image.jpg"
            alt={path.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between flex-wrap gap-1.5">
            <div className="flex items-center gap-1.5">
              <Badge variant="slate" className="bg-slate-900/80 text-white backdrop-blur-md border-0 font-bold">
                {path.level}
              </Badge>
            </div>
            {path.isActive && (
              <Badge variant="green" icon={<CheckCircle2 className="w-3 h-3" />} className="shadow-xs font-bold">
                Active Course
              </Badge>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <CardTitle className="group-hover:text-[#1e3a8a] transition-colors">
            {path.title}
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {path.description}
          </p>
        </div>

        {/* Path Metadata */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#fb923c]" />
            <span>{path.estimatedHours} Hours</span>
          </div>
         
        </div>

        {/* Skills Pills */}
        <div className="flex items-center gap-1.5 flex-wrap mb-5">
          {path.skillsCovered.map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div>
        <CardFooter>
          <Button
            variant={path.isActive ? "primary" : "slate"}
            size="sm"
            className="w-full"
            icon={isEnrolling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            disabled={isEnrolling}
            onClick={() => onSelectPath && onSelectPath(path.id)}
          >
            {isEnrolling ? "Enrolling..." : path.isActive ? "Continue Course" : "Enroll Now"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
