"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";
import NavBar from "@/components/layout/NavBar";

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

  if (loading || !isAuthenticated) {
    return <Spinner />;
  }

  return (
    <Suspense fallback={<Spinner />}>
      <NavBar />
      <main className="flex-1 flex flex-col lg:flex-row gap-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        {children}
      </main>
    </Suspense>
  );
}
