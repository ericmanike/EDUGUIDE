"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Route,
  BookOpen,
  TrendingUp,
  Settings,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { id: "paths", label: "Recommended Paths", href: "/dashboard/paths", icon: Route },
    { id: "explore", label: "Skill Explorer", href: "/dashboard/explore", icon: Compass },
    { id: "courses", label: "Course Modules", href: "/dashboard/courses", icon: BookOpen },
    { id: "analytics", label: "Progress Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="sticky top-[61px] h-[calc(100vh-61px)] w-64 bg-white border-r border-slate-100 p-4 flex flex-col justify-between shrink-0 overflow-y-auto z-20">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard" || pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-indigo-400" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Recommender Widget Box */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-lg shadow-slate-900/15 my-2">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>EduGuide Recommender</span>
        </div>
        <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
          Get an updated student learning path based on your latest quiz score!
        </p>
        <Link
          href="/dashboard/paths"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <span>Generate Path</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
};
