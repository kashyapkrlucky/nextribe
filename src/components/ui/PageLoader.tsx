export default function PageLoader({ theme }: { theme?: string }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${theme === "light" ? "border-white" : "border-purple-600"}`}></div>    
        </div>
    );
}