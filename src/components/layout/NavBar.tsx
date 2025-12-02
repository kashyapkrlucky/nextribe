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
    <header className="bg-blue-600 h-16 w-full flex flex-row justify-between p-2 lg:px-4">
      <div className="lg:w-1/4 flex flex-col lg:flex-row gap-8 items-center py-4">
        <Link className="font-bold text-xl text-gray-100 mr-4" href={"/"}>
          NextTribe
        </Link>
      </div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
        <div className="flex flex-row items-center bg-blue-500 text-white py-1 px-4 rounded-md focus-within:ring-2 focus-within:ring-blue-600">
          <Search className="h-5 w-5 text-gray-200" aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            name="q"
            className="block w-full px-4 py-2 border-none bg-transparent leading-5 placeholder-blue-200 focus:outline-none sm:text-sm"
            placeholder="Search communities, users, discussions..."
          />
        </div>
      </form>
        <div className="lg:w-1/4 flex flex-row p-4 lg:p-0 gap-8 items-center justify-center lg:justify-end">
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
                  className="text-sm/6 font-medium text-gray-100"
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
