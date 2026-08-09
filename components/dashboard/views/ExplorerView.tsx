"use client";

import React from "react";
import { SkillRadarChart } from "@/components/dashboard/AnalyticsCharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight, Database, Layers, ShieldCheck, Zap } from "lucide-react";

const skillCategories = [
  {
    name: "Backend Architecture",
    icon: <Layers className="w-5 h-5 text-[#1e3a8a]" />,
    level: "Advanced (78%)",
    skills: ["Java 21", "Spring Boot 3", "REST APIs", "Microservices"],
  },
  {
    name: "Database Systems",
    icon: <Database className="w-5 h-5 text-sky-600" />,
    level: "Intermediate (70%)",
    skills: ["PostgreSQL", "Spring Data JPA", "SQL Tuning", "Transactions"],
  },
  {
    name: "Frontend Frameworks",
    icon: <Zap className="w-5 h-5 text-[#1e3a8a]" />,
    level: "Advanced (88%)",
    skills: ["Next.js 16", "React 19", "Tailwind CSS", "TypeScript"],
  },
  {
    name: "DevOps & Security",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    level: "Intermediate (60%)",
    skills: ["Docker", "OAuth2 / JWT", "CI/CD Pipelines", "AWS"],
  },
];

export const ExplorerView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Skill Explorer & Competency Map
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Analyze your proficiency breakdown and discover skill gaps targeted by SkillsBank
        </p>
      </div>

      {/* Radar Chart Section */}
      <SkillRadarChart />

      {/* Skill Breakdown Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((cat, idx) => (
          <Card key={idx} variant="white" className="space-y-4">
            <CardHeader className="mb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100/60">
                  {cat.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{cat.name}</CardTitle>
                  <CardDescription>{cat.level}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <div className="grid grid-cols-2 gap-2">
              {cat.skills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  <span>{skill}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => alert(`Exploring deep modules for ${cat.name}`)}
            >
              Explore Path Modules
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
