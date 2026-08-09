import React from "react";
import Link from "next/link";
import { GraduationCap, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SkillsBank",
  description: "Sign in or create a free account with SkillsBank. Accelerate your personalized learning path.",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f4f6f8] px-4 py-10 font-sans antialiased text-slate-800">
      
      {/* 1. Header (Logo & Subtitle) */}
      <div className="mb-6 flex flex-col items-center text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-1.5">
          <div className="h-9 w-9 rounded-xl bg-[#1e3a8a] flex items-center justify-center shadow-md shadow-[#1e3a8a]/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-5.5 w-5.5 text-white" />
          </div>
          <span className="text-[27px] font-extrabold flex items-baseline leading-none">
            <span className="text-[#1e3a8a]">Skills</span>
            <span className="text-[#fb923c]">Bank</span> 
          </span>
        </Link>
      </div>

      {/* 2. Dynamic Card Content */}
      <div className="w-full max-w-[430px]">
        {children}
      </div>

      {/* 3. Footer */}
      <div className="mt-6 flex flex-col items-center gap-3.5 text-center text-xs">
        <Link
          href="/help"
          className="inline-flex items-center gap-1.5 font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <HelpCircle className="h-4 w-4 text-slate-400" strokeWidth={2} />
          Need help? Watch how to log in
        </Link>
        <span className="text-[11px] text-slate-400 font-medium">
          © {new Date().getFullYear()} SkillsBank Africa
        </span>
      </div>
    </div>
  );
}
