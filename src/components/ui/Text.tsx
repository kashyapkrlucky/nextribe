import React from "react";
import { cn } from "@/core/utils/helpers";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "body-lg" | "body-md" | "body-sm" | "body-xs" | "caption" | "overline";
  color?: "primary" | "secondary" | "muted" | "accent" | "success" | "error" | "warning";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  children: React.ReactNode;
}

const variantClasses = {
  h1: "text-3xl font-semibold leading-tight",
  h2: "text-2xl font-semibold leading-tight",
  h3: "text-xl font-semibold leading-tight",
  h4: "text-lg font-semibold leading-tight",
  "body-lg": "text-base font-normal leading-relaxed",
  "body-md": "text-sm font-normal leading-relaxed",
  "body-sm": "text-sm font-normal leading-relaxed",
  "body-xs": "text-xs font-normal leading-relaxed",
  caption: "text-xs font-normal leading-relaxed",
  overline: "text-xs font-medium uppercase tracking-wide",
};

const colorClasses = {
  primary: "text-gray-900 dark:text-gray-100",
  secondary: "text-gray-700 dark:text-gray-300",
  muted: "text-gray-500 dark:text-gray-400",
  accent: "text-indigo-600 dark:text-indigo-400",
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
};

const weightClasses = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export default function Text({
  variant = "body-md",
  color = "primary",
  weight = "normal",
  as: Component = "span",
  className,
  children,
  ...props
}: TextProps) {
  const classes = cn(
    variantClasses[variant as keyof typeof variantClasses],
    colorClasses[color as keyof typeof colorClasses],
    weightClasses[weight as keyof typeof weightClasses],
    className
  );

  if (Component === "h1") {
    return <h1 className={classes} {...props}>{children}</h1>;
  }
  if (Component === "h2") {
    return <h2 className={classes} {...props}>{children}</h2>;
  }
  if (Component === "h3") {
    return <h3 className={classes} {...props}>{children}</h3>;
  }
  if (Component === "h4") {
    return <h4 className={classes} {...props}>{children}</h4>;
  }
  if (Component === "p") {
    return <p className={classes} {...props}>{children}</p>;
  }
  if (Component === "div") {
    return <div className={classes} {...props}>{children}</div>;
  }

  return <span className={classes} {...props}>{children}</span>;
}
