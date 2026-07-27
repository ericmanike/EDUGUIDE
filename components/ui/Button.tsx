import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "orange" | "slate" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "orange",
  size = "md",
  children,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    orange:
      "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 focus:ring-orange-500 hover:shadow-lg hover:shadow-orange-500/35",
    slate:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20 focus:ring-slate-900",
    outline:
      "border-2 border-slate-900 text-slate-900 bg-white hover:bg-slate-900 hover:text-white focus:ring-slate-900",
    ghost:
      "text-slate-700 hover:text-orange-600 hover:bg-orange-50 focus:ring-orange-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
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
