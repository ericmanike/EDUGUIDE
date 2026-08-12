"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  Check,
  Code2,
  Database,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";

export interface PathNode {
  id: number;
  title: string;
  category: "Foundations" | "Backend" | "Database" | "Frontend" | "Deployment";
  icon: React.ReactNode;
  duration: string;
  status: "completed" | "current" | "locked";
  description: string;
  topics: string[];
}

import { fetchModules, fetchPathModulesByPath, CourseModule } from "@/lib/api";
import { LearningPathData } from "@/components/dashboard/LearningPathCard";

interface PathVisualizerProps {
  activePath?: LearningPathData | null;
}

export const PathVisualizer: React.FC<PathVisualizerProps> = ({ activePath }) => {
  const [nodes, setNodes] = useState<PathNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);

  React.useEffect(() => {
    async function loadLiveModules() {
      try {
        let apiModules: CourseModule[] = [];
        if (activePath?.id) {
          const pathModules = await fetchPathModulesByPath(activePath.id);
          const allMods = await fetchModules();
          if (pathModules && pathModules.length > 0) {
            apiModules = allMods.filter((m) =>
              pathModules.some((pm) => pm.moduleId === m.id)
            );
          } else {
            apiModules = allMods;
          }
        } else {
          apiModules = await fetchModules();
        }

        if (apiModules && apiModules.length > 0) {
          const mapped: PathNode[] = apiModules.map((m, idx) => ({
            id: idx + 1,
            title: m.title,
            category: (m.topic as any) || "Backend",
            icon: <Code2 className="w-5 h-5" />,
            duration: `${Math.round((m.durationMinutes || 120) / 60) || 2} Hours`,
            status: idx === 0 ? "completed" : idx === 1 ? "current" : "locked",
            description: m.description || "Core database curriculum module.",
            topics: [m.topic || "Core"],
          }));
          setNodes(mapped);
          setSelectedNode(mapped[0]);
        } else {
          setNodes([]);
          setSelectedNode(null);
        }
      } catch (err) {
        console.warn("Error fetching visualizer modules:", err);
      }
    }
    loadLiveModules();
  }, [activePath]);

  const toggleComplete = (id?: number) => {
    if (!id) return;
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === id) {
          const nextStatus =
            node.status === "completed" ? "current" : "completed";
          return { ...node, status: nextStatus };
        }
        return node;
      })
    );
    if (selectedNode?.id === id) {
      setSelectedNode((prev) => (prev ? {
        ...prev,
        status: prev.status === "completed" ? "current" : "completed",
      } : null));
    }
  };

  return (
    <Card variant="white" hoverEffect={false} className="relative overflow-hidden border border-slate-100/90 shadow-lg shadow-slate-200/80">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="indigo" icon={<Zap className="w-3 h-3 text-[#1e3a8a]" />}>
              Interactive Learning Roadmap
            </Badge>
            {activePath?.level && (
              <Badge variant="slate" className="bg-slate-900 text-white font-bold">
                Level: {activePath.level}
              </Badge>
            )}
          </div>
          <CardTitle className="text-slate-900 text-xl font-black">
            {activePath?.title || "Full-Stack Spring Boot + Next.js Track"}
          </CardTitle>
        </div>
        {selectedNode && (
          <Button
            variant="primary"
            size="sm"
            icon={<Play className="w-3.5 h-3.5 fill-white" />}
            onClick={() => toggleComplete(selectedNode.id)}
          >
            {selectedNode.status === "completed" ? "Completed!" : "Mark Current Complete"}
          </Button>
        )}
      </CardHeader>

      {/* Nodes Timeline / Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 my-6 relative">
        {nodes.map((node, index) => {
          const isSelected = selectedNode?.id === node.id;
          const isCompleted = node.status === "completed";
          const isCurrent = node.status === "current";

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`relative p-4 rounded-2xl transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? "bg-white border-[#1e3a8a] shadow-xl shadow-[#1e3a8a]/15 ring-2 ring-[#1e3a8a]/20 scale-[1.02]"
                  : isCompleted
                  ? "bg-emerald-50/50 border-emerald-200 shadow-sm hover:shadow-md"
                  : isCurrent
                  ? "bg-white border-[#1e3a8a]/70 shadow-md shadow-blue-500/10"
                  : "bg-slate-50/60 border-slate-200/70 shadow-2xs hover:shadow-md hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`p-2 rounded-xl ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-700"
                      : isCurrent
                      ? "bg-[#1e3a8a] text-white shadow-md shadow-[#1e3a8a]/30"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {node.icon}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fb923c] animate-ping" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300" />
                )}
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Node {index + 1}
              </p>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                {node.title}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold">{node.duration}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      {selectedNode && (
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-md shadow-slate-200/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
                {selectedNode.category} Module
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-semibold">
                {selectedNode.duration} Estimated
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              {selectedNode.title}
            </h4>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {selectedNode.description}
            </p>

            {/* Topics Badges */}
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              {selectedNode.topics.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Button
              variant={selectedNode.status === "completed" ? "outline" : "primary"}
              size="sm"
              onClick={() => toggleComplete(selectedNode.id)}
              icon={
                selectedNode.status === "completed" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )
              }
            >
              {selectedNode.status === "completed"
                ? "Completed"
                : "Start Module"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
