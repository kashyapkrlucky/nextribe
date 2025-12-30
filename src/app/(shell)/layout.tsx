"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading } = useAuth();
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Home page - Not authenticated, redirecting to sign-in");
      window.location.replace("/sign-in");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="w-full flex-1 flex flex-col lg:flex-row gap-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto h-screen py-4">
        {children}    
    </main>
  );
}
