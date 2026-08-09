"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  Route,
  BookOpen,
  TrendingUp,
  GraduationCap,
  X,
  User,
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
    { id: "account", label: "My Account", href: "/dashboard/account", icon: User },
  ];

  const renderNavContent = () => (
    <div className="space-y-6">
      <div>
        {onCloseMobile && (
          <div className="flex items-center justify-between px-3 pb-3 mb-2 border-b border-slate-100 md:hidden">
            <Link href="/dashboard" onClick={onCloseMobile} className="flex items-center gap-2.5">
              <div className="bg-[#1e3a8a] text-white p-2 rounded-xl shadow-md shadow-[#1e3a8a]/20 flex items-center justify-center">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <span className="text-lg font-black tracking-tight flex items-baseline leading-none">
                <span className="text-[#1e3a8a]">Skills</span>
                <span className="text-[#fb923c]">Bank</span>
              </span>
            </Link>
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <nav className="space-y-1.5 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <div key={item.id}>
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  className="relative block"
                >
                  <motion.div
                    whileHover={{ x: isActive ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer select-none ${
                      isActive
                        ? "text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarPill"
                        className="absolute inset-0 rounded-xl bg-[#1e3a8a] shadow-md shadow-[#1e3a8a]/20"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-3.5">
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive ? "text-[#fb923c]" : "text-slate-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </motion.div>
                </Link>
              </div>
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
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={onCloseMobile}
            />

            {/* Drawer Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative w-72 max-w-[80vw] bg-white h-full p-4 shadow-2xl flex flex-col justify-between z-10"
            >
              {renderNavContent()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
