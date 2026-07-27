import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";
import { Clock, BookOpen, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

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
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  path,
  onSelectPath,
  onViewNodes,
}) => {
  const progressPercent = Math.round(
    (path.completedModules / path.totalModules) * 100
  );

  return (
    <Card
      variant={path.isActive ? "orange-accent" : "white"}
      className="relative flex flex-col justify-between h-full group"
    >
      <div>
        {/* Header Row */}
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="orange" icon={<Sparkles className="w-3 h-3" />}>
              {path.matchScore}% Match
            </Badge>
            <Badge variant="slate">{path.level}</Badge>
            {path.isActive && (
              <Badge variant="green" icon={<CheckCircle2 className="w-3 h-3" />}>
                Active Path
              </Badge>
            )}
          </div>
        </CardHeader>

        {/* Title & Description */}
        <div className="mb-4">
          <CardTitle className="group-hover:text-orange-600 transition-colors">
            {path.title}
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {path.description}
          </p>
        </div>

        {/* Path Metadata */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>{path.estimatedHours} Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-700" />
            <span>{path.totalModules} Modules</span>
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

      {/* Progress & Actions */}
      <div>
        <ProgressBar progress={progressPercent} color="orange" />

        <CardFooter className="gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewNodes && onViewNodes(path)}
          >
            View Roadmap
          </Button>

          <Button
            variant={path.isActive ? "orange" : "slate"}
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => onSelectPath && onSelectPath(path.id)}
          >
            {path.isActive ? "Continue Path" : "Enroll Path"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
