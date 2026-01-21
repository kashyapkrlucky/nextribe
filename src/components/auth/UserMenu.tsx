"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, LogOut, UserIcon } from "lucide-react";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate initials from user's name or email
  const getInitials = () => {
    if (user?.username) {
      return user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleLogout = async () => {
    try {
      // Call API to clear server-side auth cookie
      await axios.post("/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear client-side data and redirect
      logout();
      window.location.href = "/";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          getInitials()
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ring-opacity-5 z-50 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || ""}
            </p>
          </div>
          <Link
            href={`/profile/${user?.username}`}
            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
            Profile
          </Link>
          <div className="border-t border-gray-100 dark:border-gray-700"></div>
          <Link
            href="/settings"
            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
            Account Settings
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-3 border-t border-gray-100 dark:border-gray-700  text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            role="menuitem"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500 dark:text-red-400" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
