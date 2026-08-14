import React from "react";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  variant?: "white" | "indigo-accent" | "orange-accent";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = "positive",
  icon,
  className = "",
}) => {
  const changeColors = {
    positive: "text-emerald-600 font-bold",
    negative: "text-rose-600 font-bold",
    neutral: "text-slate-500 font-medium",
  };

  return (
    <Card variant="white" hoverEffect className={`relative overflow-hidden border border-slate-100/90 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 rounded-2xl flex items-center ${className}`}>
      <div className="flex items-center justify-between w-full gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h4 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-snug break-words">
            {value}
          </h4>
          {change && (
            <div className={`flex items-center gap-1 text-[11px] ${changeColors[changeType]}`}>
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50/80 text-[#1e3a8a] border border-blue-100/60 shrink-0">
          {icon}
        </div>
      </div>
    </Card>
  );
};
