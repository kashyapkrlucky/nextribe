export const Spinner = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
  return (
    <div className="flex justify-center items-center h-20"> 
        <div className={`animate-spin rounded-full h-3 w-3 border-b-2 ${theme === "light" ? "border-white" : "border-gray-900"}`}></div> 
    </div>
  );
};
