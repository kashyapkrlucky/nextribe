"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";
import NavBar from "@/components/layout/NavBar";
import { PopularCommunities } from "@/components/home/PopularCommunities";
import TopDiscussions from "@/components/home/TopDiscussions";
import Footer from "@/components/layout/Footer";
import { CompassIcon, HomeIcon } from "lucide-react";
import MyCommunities from "@/components/home/MyCommunities";
import Link from "next/link";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading, user } = useAuth();

  // Left sidebar data
  const importantLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/explore", label: "Explore", icon: CompassIcon },
  ];

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
      <div className="h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </Suspense>
  );
}
