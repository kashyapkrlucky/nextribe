export default function InlineLoader({ theme }: { theme?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full h-3 w-3 border-b-2 ${theme === "light" ? "border-white" : "border-gray-500"}`}></div>
    </div>
  );
}
