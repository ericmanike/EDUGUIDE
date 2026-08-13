"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

export const CtaBanner: React.FC = () => {
  return (
    <section id="pricing" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0041a3] via-[#0056D2] to-[#1d4ed8] p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" /> Start Your Free Trial Today
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Begin your learning journey with SkillsBank Plus
            </h2>

            <p className="text-base sm:text-lg text-blue-100 font-normal leading-relaxed">
              Enjoy 7 days of unlimited access to over 7,000 top courses, hands-on projects, and job certificates. No commitment — cancel anytime before your trial ends.
            </p>

            {/* Price Callout */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold">$24</span>
              <span className="text-base text-blue-200 font-medium">/ month after 7-day trial</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-white hover:bg-slate-100 text-[#0056D2] font-black text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 group"
              >
                <span>Start 7-day Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform text-[#0056D2]" />
              </Link>

              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-6 py-4 rounded-xl border border-white/30 backdrop-blur-sm transition-all"
              >
                Save 44% with Annual Plan ($160/year)
              </Link>
            </div>

            {/* Risk-free guarantees */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-blue-100 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cancel anytime
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 14-day money-back guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant access to all courses
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
