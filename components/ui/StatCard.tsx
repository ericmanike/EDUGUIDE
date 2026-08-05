import React from "react";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  variant?: "white" | "indigo-accent" | "orange-accent";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = "positive",
  icon,
}) => {
  const changeColors = {
    positive: "text-emerald-600 font-bold",
    negative: "text-rose-600 font-bold",
    neutral: "text-slate-500 font-medium",
  };

  return (
    <Card variant="white" hoverEffect className="relative overflow-hidden border border-slate-100/90 shadow-md shadow-slate-200/80 hover:shadow-xl hover:shadow-slate-300/60">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[16px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h4 className="text-2xl font-black mt-2 tracking-tight text-slate-900">
            {value}
          </h4>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-[16px] ${changeColors[changeType]}`}>
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-2xl bg-indigo-50/80 text-indigo-600 border border-indigo-100/60 shadow-xs">
          {icon}
        </div>
      </div>
    </Card>
  );
};
