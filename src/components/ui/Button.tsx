
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;  
  className?: string;
}

const Button = ({ children, className = "bg-indigo-600 hover:bg-indigo-700 text-white", ...props }: ButtonProps) => {
  return (
    <button className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button