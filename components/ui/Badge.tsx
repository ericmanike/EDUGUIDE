import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "indigo" | "orange" | "slate" | "green" | "sky" | "outline";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "indigo",
  size = "md",
  className = "",
  icon,
}) => {
  const base = "inline-flex items-center font-bold rounded-full tracking-wide";

  const variants = {
    indigo: "bg-blue-50 text-[#1e3a8a] border border-blue-100/80",
    orange: "bg-amber-50 text-[#f97316] border border-amber-100/80",
    slate: "bg-slate-900 text-white border border-slate-800",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    sky: "bg-sky-50 text-sky-700 border border-sky-100",
    outline: "border border-slate-200 text-slate-700 bg-white shadow-2xs",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[10px] gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="shrink-0 inline-flex items-center justify-center">{icon}</span>}
      {children}
    </span>
  );
};
