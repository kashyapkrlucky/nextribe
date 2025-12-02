'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  users: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  communities: Array<{
    _id: string;
    name: string;
    slug: string;
    description?: string;
    memberCount: number;
  }>;
  discussions: Array<{
    _id: string;
    title: string;
    slug: string;
    community: {
      _id: string;
      name: string;
      slug: string;
    };
  }>;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setResults(data.data);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-md border border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
         
          <div className="flex items-center space-x-2 text-gray-500">
            <Search className="h-5 w-5" />
            <h1 className="text-2xl font-semibold">Searching for &quot;{query}&quot;</h1>
          </div>
          <div className="mt-8 animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm h-20"></div>
            ))}
          </div>
          
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-md border border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
          
          <div className="text-red-500">{error}</div>
         
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-md border border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
       
        <div className="flex items-center space-x-2 text-gray-700">
          <Search className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
        </div>

        {!query ? (
          <div className="mt-8 text-center text-gray-500">
            Enter a search term to find communities, users, and discussions
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Users Section */}
            {results?.users && results.users.length > 0 && (
              <section>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Users</h2>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {results.users.map((user) => (
                    <Link
                      key={user._id}
                      href={`/users/${user._id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
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
                <h2 className="text-lg font-medium text-gray-900 mb-4">Communities</h2>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {results.communities.map((community) => (
                    <Link
                      key={community._id}
                      href={`/community/${community.slug}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
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
                        <div className="text-sm text-gray-500">
                          {community.memberCount} members
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Discussions Section */}
            {results?.discussions && results.discussions.length > 0 && (
              <section>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Discussions</h2>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {results.discussions.map((discussion) => (
                    <Link
                      key={discussion._id}
                      href={`/discussion/${discussion.slug}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
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
              (!results.users?.length && 
               !results.communities?.length && 
               !results.discussions?.length) && (
                <div className="text-center py-12 text-gray-500">
                  No results found for &quot;{query}&quot;
                </div>
              )}
          </div>
        )}
       
    </div>
  );
}