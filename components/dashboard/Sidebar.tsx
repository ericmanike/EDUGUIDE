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
  GraduationCap,
  X,
} from "lucide-react";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { id: "paths", label: "Recommended Paths", href: "/dashboard/paths", icon: Route },
    { id: "explore", label: "Skill Explorer", href: "/dashboard/explore", icon: Compass },
    { id: "courses", label: "Course Modules", href: "/dashboard/courses", icon: BookOpen },
    { id: "analytics", label: "Progress Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { id: "curriculum", label: "Curriculum Manager", href: "/dashboard/curriculum", icon: GraduationCap },
    { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const renderNavContent = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between px-3 mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main Navigation
          </p>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
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
                onClick={onCloseMobile}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1e3a8a] text-white shadow-md shadow-[#1e3a8a]/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#fb923c]" : "text-slate-400"
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
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex sticky top-[61px] h-[calc(100vh-61px)] w-64 bg-white border-r border-slate-100 p-4 flex-col justify-between shrink-0 overflow-y-auto z-20">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />

          {/* Drawer Menu */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full p-4 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
};

