"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Globe,
  Heart,
  ArrowUpRight,
  Shield,
  FileText,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-12 mb-12 border-b border-slate-800 gap-6">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-[#1e3a8a] text-white p-2.5 rounded-xl shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white tracking-tight">
                  Skills<span className="text-[#fb923c]">Bank</span>
                </span>
                <span className="bg-[#1e3a8a] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                  PLUS
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Democratizing world-class education and AI-powered skill building for ambitious learners everywhere.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/signUp"
              className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Multi-Column Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800 text-xs font-medium">
          {/* Column 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wide">
              SkillsBank 
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  Overview & Pricing
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  Monthly Subscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wide">
              Top Specializations
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="#courses" className="hover:text-white transition-colors">
                  Data Science & Analytics
                </Link>
              </li>
              <li>
                <Link href="#courses" className="hover:text-white transition-colors">
                  Full Stack Web Development
                </Link>
              </li>
              <li>
                <Link href="#courses" className="hover:text-white transition-colors">
                  Artificial Intelligence & ML
                </Link>
              </li>
              <li>
                <Link href="#courses" className="hover:text-white transition-colors">
                  Cybersecurity & Networks
                </Link>
              </li>
              <li>
                <Link href="#courses" className="hover:text-white transition-colors">
                  Cloud Architecture (AWS/Azure)
                </Link>
              </li>
              <li>
                <Link href="#courses" className="hover:text-white transition-colors">
                  Product & Business Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wide">
              Community & Support
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wide">
              Company
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About SkillsBank
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Leadership & Team
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Social Links Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
            <span>© 2026 SkillsBank Inc. All rights reserved.</span>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Preferences
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter / X"
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
