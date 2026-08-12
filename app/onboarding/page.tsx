import React from "react";
import { GraduationCap, HelpCircle } from "lucide-react";
import Link from "next/link";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const metadata = {
  title: "Diagnostic Assessment & Onboarding | SkillsBank",
  description: "Set your learning goals and complete the diagnostic skill assessment.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
      {/* Top Header Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="bg-[#1e3a8a] text-white p-2.5 rounded-xl shadow-md shadow-[#1e3a8a]/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight flex items-baseline leading-none">
              <span className="text-[#1e3a8a]">Skills</span>
              <span className="text-[#fb923c]">Bank</span>
            </span>
            <p className="text-[10px] font-semibold text-slate-400">Student Onboarding & Diagnostic</p>
          </div>
        </Link>

        <a
          href="mailto:support@skillsbank.edtech"
          className="hidden sm:flex items-center justify-center text-[#1e3a8a] hover:opacity-80 transition-opacity"
          title="Contact Support"
        >
          <HelpCircle className="w-5 h-5" />
        </a>
      </header>

      {/* Main Wizard */}
      <main className="flex-1 flex items-center justify-center">
        <OnboardingWizard />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-100 bg-white/60">
        &copy; {new Date().getFullYear()} SkillsBank . All rights reserved.
      </footer>
    </div>
  );
}
