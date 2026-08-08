"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GraduationCap,
  Layers,
  BookOpen,
  Link as LinkIcon,
  LayoutDashboard,
} from "lucide-react";

export default function CurriculumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const subNavItems = [
    {
      label: "Overview",
      href: "/dashboard/curriculum",
      exact: true,
      icon: LayoutDashboard,
    },
    {
      label: "Learning Paths",
      href: "/dashboard/curriculum/paths",
      exact: false,
      icon: Layers,
    },
    {
      label: "Course Modules",
      href: "/dashboard/curriculum/modules",
      exact: false,
      icon: BookOpen,
    },
    {
      label: "Path Mappings",
      href: "/dashboard/curriculum/mappings",
      exact: false,
      icon: LinkIcon,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 border border-slate-800 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              Curriculum Administration
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Curriculum Management
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1">
              Structure, customize, and sequence learning paths, course modules, and node dependencies.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Route Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#1e3a8a] text-white shadow-md shadow-[#1e3a8a]/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#fb923c]" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sub-Route Content */}
      <main>{children}</main>
    </div>
  );
}
