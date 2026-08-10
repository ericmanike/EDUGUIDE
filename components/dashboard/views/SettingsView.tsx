"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Settings, Save } from "lucide-react";

export const SettingsView: React.FC = () => {
  const [weeklyGoal, setWeeklyGoal] = useState<number>(30);
  const [targetRole, setTargetRole] = useState<string>("Full-Stack Developer");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("edtech_user_settings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          if (parsed.weeklyGoal) setWeeklyGoal(parsed.weeklyGoal);
          if (parsed.targetRole) setTargetRole(parsed.targetRole);
        } catch (e) {}
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "edtech_user_settings",
        JSON.stringify({ weeklyGoal, targetRole, updatedAt: new Date().toISOString() })
      );
    }
    toast.success("Settings saved! SkillsBank recommendation parameters updated.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="indigo" icon={<Settings className="w-3 h-3 text-[#1e3a8a]" />}>
            Algorithm & Profile Configuration
          </Badge>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          SkillsBank Recommender Settings
        </h1>
        <p className="text-xs text-slate-500">
          Tune your learning targets, weekly time commitment, and recommendation parameters
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Target Role & Career Path */}
        <Card variant="white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div>
                <CardTitle className="text-base">Target Career Goal</CardTitle>
                <CardDescription>
                  This directly shapes the AI path generation logic
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Role Goal
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#f4f5f7] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none"
              >
                <option value="Full-Stack Developer">Full-Stack Developer (Spring + Next.js)</option>
                <option value="Backend Specialist">Backend Engineer (Spring Boot + PostgreSQL)</option>
                <option value="Frontend Specialist">Frontend Engineer (Next.js + React)</option>
                <option value="AI / ML Recommender Engineer">AI / ML Recommender Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Weekly Study Time Target (Hours)
              </label>
              <input
                type="number"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                className="w-full bg-[#f4f5f7] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
