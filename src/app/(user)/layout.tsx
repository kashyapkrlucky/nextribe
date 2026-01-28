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
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.replace("/sign-in");
    }
  }, [isAuthenticated, loading]);

  if (loading || !isAuthenticated) {
    return <Spinner />;
  }

  return (
    <Suspense fallback={<Spinner />}>
      <div className="h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </Suspense>
  );
}
