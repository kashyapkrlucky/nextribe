"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, Suspense, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import NavBar from "@/components/layout/NavBar";
import { PopularCommunities } from "@/components/home/PopularCommunities";
import TopDiscussions from "@/components/home/TopDiscussions";
import Footer from "@/components/layout/Footer";
import { CompassIcon, HomeIcon, PlusIcon } from "lucide-react";
import MyCommunities from "@/components/home/MyCommunities";
import Link from "next/link";
import CreateCommunityForm from "@/components/community/CreateCommunityForm";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading, user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);

  const importantLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/explore", label: "Explore", icon: CompassIcon },
  ];
  
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
      <NavBar />
      <div className="flex-1 flex flex-col lg:flex-row gap-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto p-4">
        <aside className="hidden lg:flex flex-col lg:w-1/5 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <nav className="flex flex-col gap-4">
              {importantLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              <button
              className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 transition-all duration-200 group"
                onClick={(e) => {
                  e.preventDefault();
                  setShowCreate(true);
                }}
              >
                <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                <span className="font-medium">Create Community</span>
              </button>
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
        {showCreate ? (
          <CreateCommunityForm setShowCreate={setShowCreate} />
        ) : null}
      </div>
    </Suspense>
  );
}
