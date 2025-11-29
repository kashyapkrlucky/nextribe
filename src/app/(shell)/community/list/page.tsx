"use client";
import { useEffect, useState } from "react";
import { FilterIcon, SearchIcon } from "lucide-react";

import Link from "next/link";
import { PopularCommunities } from "@/components/community/PopularCommunities";
import { TopDiscussions } from "@/components/discussions/TopDiscussions";
import { Spinner } from "@/components/ui/Spinner";
import { ICommunity } from "@/core/types/index.types";

export default function CommunityListPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | "all">("all");
  const [sort, setSort] = useState<"popular" | "new">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [data, setData] = useState<ICommunity[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          q: query,
          sort,
          page: String(page),
          pageSize: String(pageSize),
        });
        const res = await fetch(`/api/communities?${params.toString()}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok)
          throw new Error(json?.error || "Failed to load communities");
        if (cancelled) return;
        setData(json.communities || []);
        setTotalPages(Math.max(1, json.totalPages || 1));
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Failed to load communities";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [query, sort, page]);

  const pageData = data; // API provides pagination already

  const topics = ["all", "tech", "design", "startup", "health"] as const;

  async function onJoin(communityId: string) {
    try {
      const res = await fetch(`/api/communities/${communityId}/join`, {
        method: "POST",
      });
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to join");
      // success - optionally refresh list
      setPage(1); // trigger refetch due to dep
    } catch (e) {
      console.error(e);
      alert("Failed to join community");
    }
  }
  return (
    <>
      <section className="flex flex-col lg:w-3/5 gap-4">
        <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Discover Communities</h2>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center justify-center bg-white rounded-lg border border-gray-200 px-2 py-2"
                title="Filters"
              >
                <FilterIcon className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search communities"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <select
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value as string);
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All topics" : t}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as "popular" | "new");
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="popular">Most popular</option>
              <option value="new">Newest</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl">
          {loading ? (
            <div className="p-8 text-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 text-sm">{error}</div>
          ) : pageData.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              No communities found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pageData.map((c) => (
                <li
                  key={c._id.toString()}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <Link
                      href={`/community/${c?.slug}`}
                      className="font-medium hover:underline"
                    >
                      {c?.name}
                    </Link>
                    <div className="text-xs text-slate-600">
                      {(c.memberCount || 0).toLocaleString("en-US")} members
                      {Array.isArray(c.topics)
                        ? ` • ${c.topics.length} topics`
                        : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => onJoin(c._id.toString())}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1"
                  >
                    Join
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between p-3 border-t border-gray-200 text-sm">
            <div>
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="flex flex-col lg:w-1/5 gap-4">
        <PopularCommunities />
        <TopDiscussions />
      </aside>
    </>
  );
}
