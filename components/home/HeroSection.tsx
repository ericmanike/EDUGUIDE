"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Star, GraduationCap } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f2f6ff] via-[#f8fafe] to-[#e8f0fe] py-6 sm:py-10 lg:py-12 border-b border-blue-100/60">
      {/* Decorative SVG Light Effect */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-indigo-300/10 rounded-full blur-2xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {/* Plus Brand Header Badge */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-sans">
                SkillsBank
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Achieve your career goals with{" "}
              <span className="text-[#1e3a8a]">SkillsBank Plus</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl">
              Subscribe to build job-ready skills from world-class institutions and personalized AI-powered learning paths.
            </p>

            {/* Pricing Callout */}
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                Learn From The Experts 
              </p>
            </div>

            {/* CTA Buttons & Offer */}
            <div className="space-y-3 pt-1">
              <div>
                <Link
                  href="/auth/signUp?plan=plus"
                  className="inline-flex items-center justify-center bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-sm md:text-base font-bold px-6 py-3 rounded-xl shadow-md shadow-[#1e3a8a]/30 hover:shadow-lg hover:shadow-[#1e3a8a]/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 group"
                >
                  <span>Start For 100% Free </span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1e3a8a] shrink-0" />
                <span>All kinds of Courses & Labs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1e3a8a] shrink-0" />
                <span>AI Recommendation & Guidance</span>
              </div>
            </div>
          </div>

          {/* Right Column - Graphic Arc Illustration & Student Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-end min-h-[300px] sm:min-h-[360px]">


            {/* Student Portrait Image */}
            <div className="relative z-10 w-full max-w-[320px] sm:max-w-[360px] flex justify-center ">
              <img
                src="/hero_student.png"
                alt="SkillsBank Student Learner"
                className="w-full max-h-[340px] sm:max-h-[380px] object-contain drop-shadow-xl mix-blend-multiply filter contrast-[1.03] rounded-full"
              />
            </div>

            {/* Floating Glassmorphism Cards */}
            <div className="absolute top-2 left-0 sm:-left-2 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-white/80 hidden sm:flex items-center gap-2.5 transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">African Lecturers</div>
                <div className="text-[10px] text-slate-500 font-medium">Expert Local & Global Instructors</div>
              </div>
            </div>

            <div className="absolute bottom-4 right-0 sm:-right-2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-white/80 hidden sm:flex items-center gap-2.5 transform rotate-2 hover:rotate-0 transition-transform">
              <div>
                <div className="text-xs font-black text-slate-900">AI Learning Paths</div>
                <div className="text-[10px] text-emerald-600 font-bold">Personalized for You</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
