"use client";

import React from "react";
import { GraduationCap } from "lucide-react";

export interface LogoSpinnerProps {
  /** Size variant for logo and spinner ring */
  size?: "sm" | "md" | "lg";
  /** Optional loading text displayed below logo */
  text?: string;
  /** Whether to render as full-page overlay backdrop */
  fullScreen?: boolean;
  /** Additional container styling */
  className?: string;
}

export const LogoSpinner: React.FC<LogoSpinnerProps> = ({
  size = "md",
  text,
  fullScreen = false,
  className = "",
}) => {
  const sizeMap = {
    sm: {
      ring: "w-12 h-12 border-2",
      box: "w-9 h-9 rounded-xl",
      icon: "w-4 h-4",
      title: "text-sm",
      sub: "text-[10px]",
    },
    md: {
      ring: "w-20 h-20 border-[3px]",
      box: "w-14 h-14 rounded-2xl",
      icon: "w-7 h-7",
      title: "text-lg",
      sub: "text-xs",
    },
    lg: {
      ring: "w-28 h-28 border-4",
      box: "w-20 h-20 rounded-3xl",
      icon: "w-10 h-10",
      title: "text-2xl",
      sub: "text-sm",
    },
  };

  const s = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 font-sans ${className}`}>
      {/* Animated Logo Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Gradient Spinner Ring */}
        <div
          className={`absolute rounded-full border-t-[#1e3a8a] border-r-[#fb923c] border-b-transparent border-l-transparent animate-spin ${s.ring}`}
        />

        {/* Pulse Glow Effect */}
        <div
          className={`absolute rounded-full bg-[#1e3a8a]/15 animate-ping ${s.ring}`}
          style={{ animationDuration: "2.5s" }}
        />

        {/* Central Logo Box */}
        <div
          className={`bg-[#1e3a8a] text-white shadow-lg shadow-[#1e3a8a]/30 flex items-center justify-center relative z-10 ${s.box}`}
        >
          <GraduationCap className={`${s.icon} text-white animate-pulse`} />
        </div>
      </div>

      {/* Brand Name & Loading Message */}
      <div className="text-center space-y-0.5">
        <div className={`font-black tracking-tight flex items-center justify-center leading-none ${s.title}`}>
          <span className="text-[#1e3a8a]">Skills</span>
          <span className="text-[#fb923c]">Bank</span>
        </div>
        {text && (
          <p className={`font-semibold text-slate-500 animate-pulse mt-1 ${s.sub}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

// Re-export alias for convenience
export const LoadingSpinner = LogoSpinner;
