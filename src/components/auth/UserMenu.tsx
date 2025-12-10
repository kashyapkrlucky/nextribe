'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut } from 'lucide-react';

interface UserMenuProps {
  user: { name: string; email: string; id: string };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate initials from user's name or email
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {getInitials()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
            </div>
            
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-200" />
              Your Profile
            </Link>
            
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-200" />
              Settings
            </Link>
            
            <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>
            
            <form action="/api/auth/logout" method="post" className="w-full">
              <button
                type="submit"
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
              >
                <LogOut className="mr-3 h-5 w-5 text-red-300 dark:text-red-200" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
