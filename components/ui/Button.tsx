
interface ButtonProps {
  children: React.ReactNode;  
  className?: string;
  onClick?: () => void;
}

const Button = ({ children, onClick, className = "bg-blue-600 hover:bg-blue-700 text-white" }: ButtonProps) => {
  return (
    <button className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button