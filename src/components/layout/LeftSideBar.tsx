"use client";
import Link from "next/link";
import { HomeIcon, CompassIcon, PlusIcon } from "lucide-react";
import MyCommunities from "@/components/layout/MyCommunities";
import { useState } from "react";
import CreateCommunityForm from "../community/CreateCommunityForm";

// Left sidebar data
const importantLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/community/list", label: "Explore", icon: CompassIcon },
];
interface SideBarProps {
  user?: { name: string; email: string; id: string };
}

export default function LeftSideBar({ user }: SideBarProps) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <aside className="flex flex-col lg:w-1/5 gap-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
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

          {user?.id && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowCreate(true);
              }}
              className="inline-flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" /> 
              Create Community
            </button>
          )}
        </nav>
      </div>
      
      {user?.id && <MyCommunities />}
      {/* Create Community Modal */}
      {showCreate ? (
        <CreateCommunityForm setShowCreate={setShowCreate} />
      ) : null}
    </aside>
  );
}
