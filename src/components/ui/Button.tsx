import React from "react";
import InlineLoader from "./InlineLoader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Button = ({
  children,
  className = "bg-indigo-600 hover:bg-indigo-700 text-white",
  isLoading = false,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`inline-block items-center gap-2 px-4 py-2 h-12 rounded-md cursor-pointer transition-colors ${className} ${
        isLoading ? "opacity-60" : ""
      } ${fullWidth ? "w-full" : ""}`}
      {...props}
    >
      {isLoading ? <InlineLoader /> : children}
    </button>
  );
};

export default Button;
