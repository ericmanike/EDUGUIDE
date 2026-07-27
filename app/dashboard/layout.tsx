"use client";

import React from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      {/* Fixed Sticky Navbar */}
      <Navbar />

      <div className="flex flex-1 items-start bg-white">
        {/* Fixed Sticky Sidebar */}
        <Sidebar />

        {/* Crisp Pure White Main Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full min-w-0 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
