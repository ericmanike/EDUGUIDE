"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      {/* Sticky Navbar with Mobile Menu Toggle */}
      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      <div className="flex flex-1 items-start bg-white">
        {/* Responsive Sidebar & Mobile Drawer */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Responsive Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full min-w-0 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

