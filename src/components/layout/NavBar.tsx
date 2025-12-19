"use client"
import { useRouter } from 'next/navigation';
import { FormEvent, useRef } from 'react';
import Link from "next/link";
import { UserMenu } from "../auth/UserMenu";
import { Search } from "lucide-react";

interface NavBarProps {
  user?: { name: string; email: string; id: string };
}

const navigation = [
  { name: "Sign In", href: "/sign-in" },
  { name: "Sign Up", href: "/sign-up" },
];

const NavBar = ({ user }: NavBarProps) => {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchRef.current?.value.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 h-16 w-full flex flex-row justify-between items-center px-4 lg:px-6">
      <div className="flex items-center gap-8">
        <Link className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" href={"/"}>
          NextTribe
        </Link>
      </div>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            name="q"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            placeholder="Search communities, users, discussions..."
          />
        </div>
      </form>
      
      <div className="flex items-center gap-4">
        {user?.id ? (
          <div className="flex items-center">
            <UserMenu user={user} />
          </div>
        ) : (
          <>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
