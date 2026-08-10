"use client";

import React, { useEffect, useState } from "react";
import { GraduationCap, CheckCircle2, QrCode, Sparkles, ShieldCheck } from "lucide-react";
import { User, getCurrentUser } from "@/lib/api";

interface StudentCardProps {
  user?: User | null;
}

export const StudentCard: React.FC<StudentCardProps> = ({ user: propUser }) => {
  const [activeUser, setActiveUser] = useState<User | null>(propUser || null);

  useEffect(() => {
    if (!propUser) {
      const u = getCurrentUser();
      if (u) setActiveUser(u);
    } else {
      setActiveUser(propUser);
    }
  }, [propUser]);

  const studentName = activeUser?.name || "Student User";
  const studentEmail = activeUser?.email || "student@skillsbank.com";
  const studentRole = activeUser?.role || "STUDENT";
  const studentIdStr = activeUser?.id
    ? `STU-${activeUser.id.slice(-6).toUpperCase()}`
    : `STU-${studentName.slice(0, 3).toUpperCase()}-10492`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3a8a] via-indigo-900 to-slate-950 p-6 text-white shadow-2xl shadow-[#1e3a8a]/30 border border-white/20 group">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-[#fb923c]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Holographic Header Bar */}
      <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[#fb923c]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              SkillsBank Academy
            </h4>
            <p className="text-[10px] text-slate-300 font-semibold">Official Student Pass</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase tracking-wide backdrop-blur-md">
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </span>
      </div>

      {/* Main Student Info */}
      <div className="flex items-center gap-4 relative z-10 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fb923c] to-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-lg ring-4 ring-white/10 shrink-0">
          {studentName.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-1 min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#fb923c] bg-white/10 px-2 py-0.5 rounded-md">
            {studentRole} PASS
          </span>
          <h3 className="text-lg font-black tracking-tight text-white truncate">
            {studentName}
          </h3>
          <p className="text-xs text-slate-300 font-medium truncate">
            {studentEmail}
          </p>
        </div>
      </div>

      {/* Footer / QR & Pass Details */}
      <div className="pt-4 border-t border-white/15 flex items-end justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Student ID
          </p>
          <p className="font-mono text-xs font-bold text-slate-200">
            {studentIdStr}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-slate-300 font-semibold pt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Active Student Membership</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white text-slate-900 shadow-md flex items-center justify-center">
          <QrCode className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};
