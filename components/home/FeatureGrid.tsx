"use client";

import React from "react";
import {
  Sparkles,
  Infinity as InfinityIcon,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
} from "lucide-react";

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <InfinityIcon className="w-6 h-6 text-[#1e3a8a]" />,
      bg: "bg-blue-50",
      title: "Unlimited Learning",
      description:
        "Access 7,000+ courses, guided projects, specialization tracks, and professional certificates without paying per course.",
      highlights: ["7,000+ Courses included", "Guided Hands-on Labs", "Downloadable Mobile Lessons"],
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      bg: "bg-amber-50",
      title: "AI-Powered Adaptive Paths",
      description:
        "Our intelligent recommendation engine evaluates your current skill level and builds custom learning roadmaps tailored to your career target.",
      highlights: ["Personalized Diagnostics", "Instant Skill Gap Analysis", "24/7 AI Tutor Assistance"],
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50",
      title: "Maximum Savings & Flexibility",
      description:
        "Save over 70% compared to buying individual courses. Learn at your own pace with 100% online flexibility and cancel anytime.",
      highlights: ["$24/month plan", "14-Day Money-Back Guarantee", "Cancel Anytime with 1-Click"],
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-[#1e3a8a] font-bold text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Why SkillsBank Plus
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Invest in your career with total flexibility
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal mt-3">
            Everything you need to master new skills, transition into high-paying roles, and earn credentials from global leaders.
          </p>
        </div>

        {/* 3 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                {item.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1e3a8a] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
