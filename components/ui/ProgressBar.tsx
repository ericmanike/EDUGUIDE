import React from "react";

interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: "primary" | "indigo" | "orange" | "slate" | "green";
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = "primary",
  height = "md",
  showLabel = true,
  className = "",
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const barColors = {
    primary: "bg-gradient-to-r from-[#1e3a8a] to-blue-600 shadow-sm shadow-[#1e3a8a]/30",
    indigo: "bg-gradient-to-r from-[#1e3a8a] to-blue-600 shadow-sm shadow-[#1e3a8a]/30",
    orange: "bg-gradient-to-r from-orange-400 to-[#fb923c] shadow-sm shadow-orange-500/30",
    slate: "bg-slate-900",
    green: "bg-emerald-500",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-slate-700">
          <span>Progress</span>
          <span className="text-slate-900 font-bold">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heights[height]}`}>
        <div
          className={`${heights[height]} ${barColors[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
