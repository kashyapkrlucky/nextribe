"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("Login page - Redirecting to home");
      window.location.replace("/");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>
      <div className="relative z-10 w-full">
        <header className="fixed top-0 w-full py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-8">
              <Link
                className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                href={"/"}
              >
                <Image
                  src="/logo-inverted.png"
                  alt="NexTribe"
                  width={110}
                  height={20}
                />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="rounded-lg border-2 border-gray-300 hover:border-gray-100 px-4 py-2 text-sm font-semibold text-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-300 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg border-2 border-indigo-600 dark:border-indigo-600 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
