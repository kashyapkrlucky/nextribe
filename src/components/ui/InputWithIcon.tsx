interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
}
export default function InputWithIcon({
  icon,
  label,
  error,
  className = "",
  ...props
}: Props) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          {...props}
          className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${className} ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
