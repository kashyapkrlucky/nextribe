import React from "react";
import { cn } from "@/core/utils/helpers";
import { ClockIcon, UserIcon, BoxesIcon } from "lucide-react";

interface MetaTextProps {
  variant?: "timestamp" | "username" | "count" | "topic" | "custom";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  href?: string;
}

const variantClasses = {
  timestamp: "text-xs text-gray-500 dark:text-gray-400",
  username: "text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200",
  count: "text-xs font-medium text-gray-600 dark:text-gray-400",
  topic: "text-xs font-medium text-indigo-600 dark:text-indigo-400",
  custom: "text-xs text-gray-500 dark:text-gray-400",
};

const defaultIcons = {
  timestamp: <ClockIcon className="w-3 h-3" />,
  username: <UserIcon className="w-3 h-3" />,
  count: null,
  topic: <BoxesIcon className="w-3 h-3" />,
  custom: null,
};

export default function MetaText({
  variant = "custom",
  icon,
  children,
  className,
  href,
}: MetaTextProps) {
  const classes = cn(
    "inline-flex items-center gap-1",
    variantClasses[variant],
    className
  );

  const iconToRender = icon || defaultIcons[variant];

  const content = (
    <>
      {iconToRender && <span className="flex-shrink-0">{iconToRender}</span>}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return <span className={classes}>{content}</span>;
}
