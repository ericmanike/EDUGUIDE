import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "white" | "slate" | "orange-accent";
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
  const baseStyles = "rounded-2xl transition-all duration-300 p-6";

  const variants = {
    white:
      "bg-white border border-slate-100 shadow-sm hover:shadow-md shadow-slate-200/50 text-slate-900",
    slate:
      "bg-slate-900 text-white border border-slate-800 shadow-xl shadow-slate-900/20",
    "orange-accent":
      "bg-white border border-slate-100 border-l-4 border-l-orange-500 shadow-sm hover:shadow-md shadow-slate-200/50 text-slate-900",
  };

  const hoverStyle = hoverEffect
    ? "hover:-translate-y-0.5 cursor-pointer"
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
  <h3 className={`text-lg font-bold tracking-tight ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <p className={`text-xs text-slate-500 ${className}`}>{children}</p>;

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={className}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`mt-6 pt-4 border-t border-slate-100 flex items-center justify-between ${className}`}>{children}</div>;
