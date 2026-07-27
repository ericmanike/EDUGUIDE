"use client";

import React from "react";
import {
  LayoutDashboard,
  Compass,
  Route,
  BookOpen,
  TrendingUp,
  Settings,
  Sparkles,
  ChevronRight,
  Zap,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "paths", label: "Recommended Paths", icon: Route, badge: "AI" },
    { id: "explore", label: "Skill Explorer", icon: Compass },
    { id: "courses", label: "Course Modules", icon: BookOpen },
    { id: "analytics", label: "Progress Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-orange-400" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-black rounded-md ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* AI Recommendation Widget Box */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-lg shadow-slate-900/15">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 text-orange-400 text-xs font-bold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>EduGuide Recommender</span>
        </div>
        <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
          Get an updated student learning path based on your latest quiz score!
        </p>
        <button
          onClick={() => setActiveTab("paths")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
        >
          <span>Generate Path</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
