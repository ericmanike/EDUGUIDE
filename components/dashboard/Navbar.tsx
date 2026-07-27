"use client";

import React from "react";
import { Search, Bell, GraduationCap, Sparkles, User } from "lucide-react";
import { BackendStatusBadge } from "./BackendStatusBadge";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="bg-slate-900 text-orange-500 p-2.5 rounded-xl shadow-md shadow-slate-900/10 flex items-center justify-center">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-slate-900">EduGuide</span>
            <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
              AI Path
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
            Personalized Learning Recommender
          </p>
        </div>
      </div>

      {/* Center Search */}
      <div className="hidden md:flex items-center relative w-80">
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search learning paths, skills, courses..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Backend Status */}
        <div className="hidden lg:block">
          <BackendStatusBadge />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>

        {/* Student Profile Pill */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-orange-400 flex items-center justify-center font-bold text-sm shadow-sm">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-slate-900">Alex Morgan</h4>
            <p className="text-[10px] font-semibold text-orange-600">Full-Stack Track</p>
          </div>
        </div>
      </div>
    </header>
  );
};
