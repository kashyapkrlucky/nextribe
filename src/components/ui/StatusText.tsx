import React from "react";
import { cn } from "@/core/utils/helpers";
import { CheckCircleIcon, AlertCircleIcon, AlertTriangleIcon, InfoIcon } from "lucide-react";

interface StatusTextProps {
  type: "success" | "error" | "warning" | "info";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
}

const typeClasses = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  info: "text-blue-600 dark:text-blue-400",
};

const sizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const defaultIcons = {
  success: <CheckCircleIcon className="w-4 h-4" />,
  error: <AlertCircleIcon className="w-4 h-4" />,
  warning: <AlertTriangleIcon className="w-4 h-4" />,
  info: <InfoIcon className="w-4 h-4" />,
};

export default function StatusText({
  type,
  size = "sm",
  children,
  className,
  icon = true,
}: StatusTextProps) {
  const classes = cn(
    "inline-flex items-center gap-2 font-medium",
    typeClasses[type],
    sizeClasses[size],
    className
  );

  return (
    <div className={classes}>
      {icon && <span className="flex-shrink-0">{defaultIcons[type]}</span>}
      <span>{children}</span>
    </div>
  );
}
