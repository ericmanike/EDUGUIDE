import React from "react";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  variant?: "white" | "slate" | "orange-accent";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = "positive",
  icon,
  variant = "white",
}) => {
  const isSlate = variant === "slate";

  const changeColors = {
    positive: isSlate ? "text-emerald-400" : "text-emerald-600",
    negative: isSlate ? "text-rose-400" : "text-rose-600",
    neutral: isSlate ? "text-slate-400" : "text-slate-500",
  };

  return (
    <Card variant={variant} hoverEffect className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${isSlate ? "text-slate-400" : "text-slate-500"}`}>
            {title}
          </p>
          <h4 className={`text-2xl font-black mt-2 tracking-tight ${isSlate ? "text-white" : "text-slate-900"}`}>
            {value}
          </h4>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${changeColors[changeType]}`}>
              <span>{change}</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-xl ${
            isSlate
              ? "bg-slate-800 text-orange-400"
              : "bg-orange-50 text-orange-600 border border-orange-100"
          }`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
