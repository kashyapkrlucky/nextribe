// src/app/(shell)/search/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSearchStore } from "@/store/useSearchStore";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { loading, error, results, getSearchResults } = useSearchStore();

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    getSearchResults(query);
  }, [query, getSearchResults]);

  if (loading) {
    return  <div className="max-w-7xl mx-auto w-full bg-white dark:bg-gray-800 space-y-6 p-6">
      <Skeleton className="w-full h-4" />
    </div>;
  }

  if (error) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-md border border-gray-200 p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <Suspense fallback={"Loading..."}>
       <div className="max-w-7xl mx-auto w-full bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6">
      <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 mb-6">
        <Search className="h-5 w-5" />
        <h1 className="text-2xl font-semibold">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
      </div>

      {!query ? (
        <div className="text-center text-gray-500">
          Enter a search term to find communities, users, and discussions
        </div>
      ) : (
        <div className="space-y-8">
          {/* Users Section */}
          {results?.users && results.users.length > 0 && (
            <section>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                Users
              </h2>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-200">
                {results.users.map((user) => (
                  <Link
                    key={user._id}
                    href={`/users/${user._id}`}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Communities Section */}
          {results?.communities && results.communities.length > 0 && (
            <section>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                Communities
              </h2>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-200">
                {results.communities.map((community) => (
                  <Link
                    key={community._id}
                    href={`/community/${community.slug}`}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{community.name}</div>
                        {community.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {community.description}
                          </p>
                        )}
                      </div>
                      {community.memberCount && (
                        <div className="text-sm text-gray-500">
                          {community.memberCount} members
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Discussions Section */}
          {results?.discussions && results.discussions.length > 0 && (
            <section>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                Discussions
              </h2>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-200">
                {results.discussions.map((discussion) => (
                  <Link
                    key={discussion._id}
                    href={`/discussion/${discussion.slug}`}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium">{discussion.title}</div>
                    <div className="text-sm text-gray-500">
                      in {discussion.community.name}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {results &&
            !results.users?.length &&
            !results.communities?.length &&
            !results.discussions?.length && (
              <div className="text-center py-12 text-gray-500">
                No results found for &quot;{query}&quot;
              </div>
            )}
        </div>
      )}
    </div>
    </Suspense>
  );
}