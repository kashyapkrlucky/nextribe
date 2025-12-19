import { User } from "lucide-react";

export function UserButton() {
  return (
    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center border border-indigo-200 dark:border-indigo-700">
      <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
    </div>
  );
}
