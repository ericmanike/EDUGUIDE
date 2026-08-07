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
    <Card variant="white" hoverEffect={false} className="relative overflow-hidden border border-slate-100/90 shadow-lg shadow-slate-200/80">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" icon={<Zap className="w-3 h-3 text-[#1e3a8a]" />}>
              Interactive Learning Roadmap
            </Badge>
            <span className="text-xs font-semibold text-slate-400">
              Updated by EduGuide Engine
            </span>
          </div>
          <CardTitle className="text-slate-900 text-xl font-black">
            Full-Stack Spring Boot + Next.js Track
          </CardTitle>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Play className="w-3.5 h-3.5 fill-white" />}
          onClick={() => toggleComplete(selectedNode.id)}
        >
          {selectedNode.status === "completed" ? "Completed!" : "Mark Current Complete"}
        </Button>
      </CardHeader>

      {/* Nodes Timeline / Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 my-6 relative">
        {nodes.map((node, index) => {
          const isSelected = selectedNode.id === node.id;
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
    </Card>
  );
};
