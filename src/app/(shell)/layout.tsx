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
      <NavBar />
      <div className="flex-1 flex flex-col lg:flex-row gap-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto p-6">
        <aside className="hidden lg:flex flex-col lg:w-1/5 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
            <nav className="flex flex-col gap-1">
              {importantLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {user && <MyCommunities />}
        </aside>
        <main className="flex-1 flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto lg:px-4 lg:border-l lg:border-r lg:border-gray-200 dark:border-gray-700">
          {children}
        </main>
        <aside className="lg:w-1/5 gap-4 hidden lg:flex flex-col dark:border-gray-700">
          <PopularCommunities />
          <TopDiscussions />
          <Footer />
        </aside>
      </div>
    </Suspense>
  );
}
