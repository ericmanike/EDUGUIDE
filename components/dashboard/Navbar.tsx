"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, GraduationCap, User, LogOut, Menu } from "lucide-react";
import { getCurrentUser, logoutUser, User as UserType } from "@/lib/api";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/auth/signIn");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/60"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="bg-[#1e3a8a] text-white p-2.5 rounded-xl shadow-md shadow-[#1e3a8a]/20 flex items-center justify-center">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight flex items-baseline leading-none">
            <span className="text-[#1e3a8a]">Edu</span>
            <span className="text-[#fb923c]">Guide</span>
          </span>
          <p className="text-[11px] font-semibold text-slate-400 hidden sm:block mt-0.5">
            Personalized Student Learning Recommender
          </p>
        </div>
      </div>


      {/* Center Search */}
      <div className="hidden md:flex items-center relative w-80">
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search learning paths, skills, modules..."
          className="w-full bg-[#f4f5f7] border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer border border-slate-200/60">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#fb923c] ring-2 ring-white" />
        </button>

        {/* Student Profile Pill */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-slate-900">
              {currentUser?.name || "Student User"}
            </h4>
            <p className="text-[10px] font-semibold text-[#fb923c]">
              {currentUser?.role || "STUDENT"} Track
            </p>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Log out"
            className="ml-2 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

