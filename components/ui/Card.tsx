import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "white" | "indigo-accent" | "orange-accent";
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "white",
  className = "",
  onClick,
  hoverEffect = true,
}) => {
  const baseStyles = "rounded-2xl transition-all duration-300 p-6 bg-white border border-slate-100/90";

  const variants = {
    white:
      "shadow-md shadow-slate-200/80 hover:shadow-xl hover:shadow-slate-300/60 text-slate-900",
    "indigo-accent":
      "border-l-4 border-l-[#1e3a8a] shadow-md shadow-slate-200/80 hover:shadow-xl hover:shadow-slate-300/60 text-slate-900",
    "orange-accent":
      "border-l-4 border-l-[#fb923c] shadow-md shadow-slate-200/80 hover:shadow-xl hover:shadow-slate-300/60 text-slate-900",
  };

  const hoverStyle = hoverEffect
    ? "hover:-translate-y-1 cursor-pointer"
    : "";

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>;

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <h3 className={`text-lg font-bold tracking-tight text-slate-900 ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <p className={`text-xs font-medium text-slate-500 ${className}`}>{children}</p>;

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={className}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`mt-6 pt-4 border-t border-slate-100 flex items-center justify-between ${className}`}>{children}</div>;
