"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { UserMenu } from "../auth/UserMenu";
import { PlusIcon, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CreateCommunityForm from "../community/CreateCommunityForm";
import Image from "next/image";
import Button from "../ui/Button";

const NavBar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchRef.current?.value.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky z-50 backdrop-blur-lg bg-white/10 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 h-16 w-full flex flex-row justify-between items-center px-4 lg:px-6">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between w-full">
        <div className="flex items-center gap-8">
          <Link
            className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            href={"/"}
          >
            <Image src="/logo.png" alt="NexTribe" width={110} height={20} />
          </Link>
        </div>

        {/* Search Bar */}
        {user && <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              type="search"
              name="q"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Search communities, users, discussions..."
            />
          </div>
        </form>}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setShowCreate(true);
                }}
                className="inline-flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group"
              >
                <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                Create Community
              </Button>
              <UserMenu />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg border-2 border-indigo-600 dark:border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-gray-300 hover:border-indigo-700 dark:hover:border-indigo-700 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg border-2 border-indigo-600 dark:border-indigo-600 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      {showCreate ? (
        <CreateCommunityForm setShowCreate={setShowCreate} />
      ) : null}
    </header>
  );
};

export default NavBar;
