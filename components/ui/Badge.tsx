import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "orange" | "slate" | "green" | "blue" | "outline";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "orange",
  size = "md",
  className = "",
  icon,
}) => {
  const base = "inline-flex items-center font-medium rounded-full tracking-wide";

  const variants = {
    orange: "bg-orange-100 text-orange-700 border border-orange-200/60",
    slate: "bg-slate-900 text-white border border-slate-800",
    green: "bg-emerald-100 text-emerald-700 border border-emerald-200/60",
    blue: "bg-sky-100 text-sky-700 border border-sky-200/60",
    outline: "border border-slate-300 text-slate-700 bg-white",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[11px] gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
