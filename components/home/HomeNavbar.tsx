"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  User,
  BookOpen,
  Award,
  TrendingUp,
  Settings,
  LogOut,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import { getCurrentUser, logoutUser, User as UserType } from "@/lib/api";

export const HomeNavbar: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
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
    setCurrentUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="bg-[#1e3a8a] text-white p-2 rounded-xl shadow-md shadow-[#1e3a8a]/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl md:text-2xl font-extrabold tracking-tight flex items-baseline leading-none">
                    <span className="text-[#1e3a8a]">Skills</span>
                    <span className="text-[#fb923c]">Bank</span>
                  </span>
                 
                </div>
                <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline-block">
                  Personalized AI Learning 
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
              <div className="relative group cursor-pointer py-2">
                <button className="flex items-center gap-1 hover:text-[#1e3a8a] transition-colors">
                  <span>Explore</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#1e3a8a] transition-transform group-hover:rotate-180" />
                </button>
                {/* Mega Dropdown Menu */}
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-3 space-y-1">
                    <Link
                      href="#features"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 transition-colors text-slate-800 hover:text-[#1e3a8a]"
                    >
                      <div className="p-2 rounded-lg bg-blue-100 text-[#1e3a8a]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Features & Benefits</div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          Explore SkillsBank Plus benefits
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="#features"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 transition-colors text-slate-800 hover:text-[#1e3a8a]"
                    >
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Certificates & Credentials</div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          Job-ready skills & badges
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

        
              <Link
                href="#pricing"
                className="flex items-center gap-1.5 text-[#1e3a8a] font-bold hover:opacity-80 transition-opacity"
              >
            
                <span>SkillsBank Plus</span>
              </Link>
            </nav>
          </div>

      

          {/* Right: Auth Controls / Logged In User Avatar & Dropdown */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Help & Support Button */}
            <button
              title="Help & Support"
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer border border-slate-200/60"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {currentUser ? (
              /* Profile Avatar Pill & Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1 px-3 rounded-full transition-all "
                >
                    <div className="w-8 h-8 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform shrink-0">
                      {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
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
                        <div className="space-y-0.5">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#1e3a8a] hover:bg-blue-50/60 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#1e3a8a]" />
                            <span>My Dashboard</span>
                          </Link>

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
                            <span>My Learnings</span>
                          </Link>
                        </div>

                        <div className="my-1.5 border-t border-slate-100" />

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
            ) : (
              <>
                <Link
                  href="/auth/signIn"
                  className="text-xs md:text-sm font-bold text-[#1e3a8a] hover:text-[#1d4ed8] hover:bg-blue-50/80 px-4 py-2.5 rounded-xl transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signUp"
                  className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-[#1e3a8a]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
                >
                  <span>Join for Free</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200/80"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="What do you want to learn?"
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056D2]"
            />
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-700">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#0056D2]"
            >
              Why SkillsBank Plus
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-blue-50 text-[#0056D2] font-extrabold flex items-center justify-between"
            >
              <span>SkillsBank Plus</span>
              <span className="bg-[#0056D2] text-white text-[10px] px-2 py-0.5 rounded-full">
                7-Day Free Trial
              </span>
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#1e3a8a] text-white font-bold py-3 rounded-xl shadow-md"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center text-xs font-bold text-red-600 py-2 rounded-xl border border-red-100 bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signIn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center font-bold text-[#0056D2] bg-blue-50 py-2.5 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signUp"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#0056D2] text-white font-bold py-3 rounded-xl shadow-md"
                >
                  Join for Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
