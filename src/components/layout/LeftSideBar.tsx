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
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <nav className="flex flex-col gap-1">
          {importantLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-50 text-sm text-slate-700"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}

          {user?.id && (
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowCreate(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-2 bg-blue-600 text-white text-sm"
            >
              <PlusIcon className="w-4 h-4" /> Create Community
            </Link>
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
