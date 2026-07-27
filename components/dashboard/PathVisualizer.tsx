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
  BookOpen,
  Check,
  ChevronRight,
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

const mockNodes: PathNode[] = [
  {
    id: 1,
    title: "Java 21 & Modern OOP Foundations",
    category: "Foundations",
    icon: <Code2 className="w-5 h-5" />,
    duration: "12 Hours",
    status: "completed",
    description: "Master records, sealed classes, pattern matching, and memory optimization.",
    topics: ["Core Syntax", "Records & Enums", "Collections API", "Streams & Lambdas"],
  },
  {
    id: 2,
    title: "Spring Boot 3 REST Services",
    category: "Backend",
    icon: <Layers className="w-5 h-5" />,
    duration: "18 Hours",
    status: "current",
    description: "Build robust REST APIs, dependency injection, and spring-web validation.",
    topics: ["Spring Initializr", "@RestController", "DTO Pattern", "Spring Validation"],
  },
  {
    id: 3,
    title: "PostgreSQL & Hibernate JPA",
    category: "Database",
    icon: <Database className="w-5 h-5" />,
    duration: "15 Hours",
    status: "locked",
    description: "Design relational database schemas, repositories, joins, and migrations.",
    topics: ["Entity Mapping", "Spring Data JPA", "PostgreSQL Dialect", "Queries"],
  },
  {
    id: 4,
    title: "Next.js 16 & Tailwind Dashboard",
    category: "Frontend",
    icon: <Zap className="w-5 h-5" />,
    duration: "16 Hours",
    status: "locked",
    description: "Build responsive React components, server components, and Tailwind CSS layouts.",
    topics: ["App Router", "Reusability", "State Management", "Tailwind UI"],
  },
  {
    id: 5,
    title: "Security & Full-Stack Deployment",
    category: "Deployment",
    icon: <ShieldCheck className="w-5 h-5" />,
    duration: "10 Hours",
    status: "locked",
    description: "Configure CORS, Spring Security JWT tokens, Docker containers, and Cloud deployment.",
    topics: ["JWT Tokens", "CORS Configuration", "Docker", "CI/CD Pipeline"],
  },
];

export const PathVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<PathNode[]>(mockNodes);
  const [selectedNode, setSelectedNode] = useState<PathNode>(mockNodes[1]);

  const toggleComplete = (id: number) => {
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
    if (selectedNode.id === id) {
      setSelectedNode((prev) => ({
        ...prev,
        status: prev.status === "completed" ? "current" : "completed",
      }));
    }
  };

  return (
    <Card variant="slate" hoverEffect={false} className="relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="orange" icon={<Zap className="w-3 h-3" />}>
              Interactive Learning Roadmap
            </Badge>
            <span className="text-xs font-semibold text-slate-400">
              Updated by EduGuide Engine
            </span>
          </div>
          <CardTitle className="text-white text-xl">
            Full-Stack Spring Boot + Next.js Track
          </CardTitle>
        </div>
        <Button
          variant="orange"
          size="sm"
          icon={<Play className="w-3.5 h-3.5 fill-white" />}
          onClick={() => toggleComplete(selectedNode.id)}
        >
          {selectedNode.status === "completed" ? "Completed!" : "Mark Current Complete"}
        </Button>
      </CardHeader>

      {/* Nodes Timeline / Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 my-6 relative">
        {nodes.map((node, index) => {
          const isSelected = selectedNode.id === node.id;
          const isCompleted = node.status === "completed";
          const isCurrent = node.status === "current";

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`relative p-4 rounded-xl transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? "bg-slate-800 border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.02]"
                  : isCompleted
                  ? "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800"
                  : isCurrent
                  ? "bg-slate-800/80 border-orange-400/60 hover:bg-slate-800"
                  : "bg-slate-900/50 border-slate-800 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`p-2 rounded-lg ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isCurrent
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {node.icon}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Node {index + 1}
              </p>
              <h4 className="text-xs font-bold text-white line-clamp-1">
                {node.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">{node.duration}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-orange-400 uppercase">
              {selectedNode.category} Module
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300 font-semibold">
              {selectedNode.duration} Estimated
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            {selectedNode.title}
          </h4>
          <p className="text-xs text-slate-300 max-w-2xl">
            {selectedNode.description}
          </p>

          {/* Topics Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {selectedNode.topics.map((t, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant={selectedNode.status === "completed" ? "slate" : "orange"}
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
    </Card>
  );
};
