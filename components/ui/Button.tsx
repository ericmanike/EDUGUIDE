import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "navy" | "orange" | "gold" | "slate" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary:
      "bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white shadow-md shadow-[#1e3a8a]/20 focus:ring-[#1e3a8a] hover:shadow-lg hover:shadow-blue-900/30",
    navy:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20 focus:ring-slate-900",
    orange:
      "bg-[#fb923c] hover:bg-[#f97316] text-white shadow-md shadow-orange-500/20 focus:ring-orange-500 hover:shadow-lg hover:shadow-orange-500/30",
    gold:
      "bg-[#fbcb08] hover:bg-[#eab308] text-slate-900 shadow-md shadow-amber-500/20 focus:ring-amber-500",
    slate:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/15 focus:ring-slate-900",
    outline:
      "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400 shadow-sm",
    ghost:
      "text-slate-600 hover:text-[#1e3a8a] hover:bg-blue-50/80 focus:ring-[#1e3a8a]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs md:text-sm gap-2",
    lg: "px-6 py-3 text-sm md:text-base gap-2.5",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
