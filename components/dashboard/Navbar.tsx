"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  HelpCircle,
  GraduationCap,
  User,
  LogOut,
  Menu,
  ChevronDown,
  Settings,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { getCurrentUser, logoutUser, User as UserType } from "@/lib/api";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
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

        <Link href="/dashboard" className=" md:flex items-center gap-3 group">
          <div className="bg-[#1e3a8a] text-white p-2.5 rounded-xl shadow-md shadow-[#1e3a8a]/20  hidden md:flex items-center justify-center group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight flex items-baseline leading-none">
              <span className="text-[#1e3a8a]">Skills</span>
              <span className="text-[#fb923c]">Bank</span>
            </span>
            <p className="text-[11px] font-semibold text-slate-400 hidden sm:block mt-0.5">
              Personalized Student Learning 
            </p>
          </div>
        </Link>
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
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Help & Support */}
        <button
          title="Help & Support"
          className="p-1.5 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer border border-slate-200/60"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Interactive Profile Dropdown Pill */}
        <div className="relative pl-1.5 sm:pl-2 border-l border-slate-100" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 sm:gap-2.5 p-0.5 sm:px-2.5 sm:py-1.5 rounded-2xl hover:bg-slate-100/80 transition-all cursor-pointer border border-transparent hover:border-slate-200/60 group select-none"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden sm:block text-left">
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors leading-tight">
                {currentUser?.name || "Student User"}
              </h4>
              <p className="text-[10px] font-bold text-[#fb923c] leading-tight">
                {currentUser?.role || "STUDENT"}
              </p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180 text-[#1e3a8a]" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-100 shadow-2xl p-2 z-50 overflow-hidden"
              >
                {/* Dropdown Links */}
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard/account"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#1e3a8a] hover:bg-blue-50/60 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#1e3a8a]" />
                    <span>My Account</span>
                  </Link>

                  <Link
                    href="/dashboard/analytics"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#1e3a8a] hover:bg-blue-50/60 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Progress Analytics</span>
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#1e3a8a] hover:bg-blue-50/60 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>My learnings</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="my-1.5 border-t border-slate-100" />

                {/* Logout Action */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
