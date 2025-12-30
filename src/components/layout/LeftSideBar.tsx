"use client";
import Link from "next/link";
import { HomeIcon, CompassIcon } from "lucide-react";
import MyCommunities from "@/components/layout/MyCommunities";
import { useAuth } from "@/hooks/useAuth";

// Left sidebar data
const importantLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/community/list", label: "Explore", icon: CompassIcon },
];

export default function LeftSideBar() {
  const { user } = useAuth();

  return (
    <aside className="flex flex-col lg:w-1/5 gap-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
        <nav className="flex flex-col gap-1">
          {importantLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-all duration-200 group"
            >
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {user && <MyCommunities />}
    </aside>
  );
}
