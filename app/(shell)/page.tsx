"use client";
import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusIcon,
  FilterIcon,
  SearchIcon,
  TrendingUpIcon,
} from "lucide-react";
import { ApiCommunity } from "../../types/api.types";


export default function Home() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | "all">("all");
  const [sort, setSort] = useState<"popular" | "new">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [data, setData] = useState<ApiCommunity[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", isPrivate: false });

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
        if (!res.ok) throw new Error(json?.error || "Failed to load communities");
        if (cancelled) return;
        setData(json.communities || []);
        setTotalPages(Math.max(1, json.totalPages || 1));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load communities";
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


  // Right sidebar data
  const popularItems = data.slice(0, 5);
  const topDiscussions = [
    { id: 101, title: "What tools are you using in 2025?", replies: 128 },
    { id: 102, title: "Show your latest side project", replies: 67 },
    { id: 103, title: "Best practices for onboarding", replies: 54 },
  ];

  async function onJoin(communityId: string) {
    try {
      const res = await fetch(`/api/communities/${communityId}/join`, { method: "POST" });
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
    <Fragment>

        {/* Mid section */}
        <section className="flex flex-col lg:w-3/5 gap-4">
          <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold">Discover Communities</h2>
              <div className="flex items-center gap-2">
                <Link
                  href="#"
                  onClick={(e) => { e.preventDefault(); setShowCreate(true); }}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-blue-600 text-white text-sm"
                >
                  <PlusIcon className="w-4 h-4" /> Create Community
                </Link>
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
              <div className="p-8 text-center text-slate-600">Loading...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-600 text-sm">{error}</div>
            ) : pageData.length === 0 ? (
              <div className="p-8 text-center text-slate-600">No communities found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pageData.map((c) => (
                  <li key={c._id} className="p-4 flex items-center justify-between">
                    <div>
                      <Link
                        href={`/community/${c?._id}`}
                        className="font-medium hover:underline"
                      >
                        {c?.name}
                      </Link>
                      <div className="text-xs text-slate-600">
                        {(c.membersCount || 0).toLocaleString('en-US')} members
                        {Array.isArray(c.topics) ? ` • ${c.topics.length} topics` : ""}
                      </div>
                    </div>
                    <button onClick={() => onJoin(c._id)} className="text-xs border border-gray-200 rounded-md px-2 py-1">Join</button>
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

        {/* Right sidebar */}
        <aside className="flex flex-col lg:w-1/5 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4" /> Popular Communities
            </h3>
            <ul className="space-y-2">
              {popularItems.map((c) => (
                <li key={c._id} className="flex items-center justify-between">
                  <Link href={`/community/${c._id}`} className="text-sm hover:underline">
                    {c.name}
                  </Link>
                  <span className="text-xs text-slate-600">{(c?.membersCount || 0).toLocaleString('en-US')}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="bg-white border border-gray-200 rounded-xl p-3">
            <h3 className="text-sm font-semibold mb-2">Useful Links</h3>
            <ul className="space-y-1">
              {externalLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <h3 className="text-sm font-semibold mb-2">Top Discussions</h3>
            <ul className="space-y-2">
              {topDiscussions.map((d) => (
                <li key={d.id} className="text-sm">
                  <Link href={`/discussion/${d.id}`} className="hover:underline">
                    {d.title}
                  </Link>
                  <div className="text-xs text-slate-600">{d.replies} replies</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      
    {/* Create Community Modal */}
    {showCreate ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreate(false)} />
        <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-5">
          <h3 className="text-lg font-semibold mb-3">Create Community</h3>
          {createError ? (
            <div className="mb-3 text-sm text-red-600">{createError}</div>
          ) : null}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCreateError(null);
              if (!form.name.trim()) { setCreateError("Name is required"); return; }
              try {
                setCreateLoading(true);
                const res = await fetch("/api/communities", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: form.name,
                    slug: form.slug.trim() || undefined,
                    description: form.description.trim() || undefined,
                    isPrivate: !!form.isPrivate,
                  }),
                });
                if (res.status === 401) { window.location.href = "/sign-in"; return; }
                const json = await res.json();
                if (!res.ok) throw new Error(json?.error || "Failed to create");
                // success
                setShowCreate(false);
                setForm({ name: "", slug: "", description: "", isPrivate: false });
                setPage(1); // trigger refetch
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "Failed to create";
                setCreateError(msg);
              } finally {
                setCreateLoading(false);
              }
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="e.g., Next.js Builders"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (optional)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="e.g., nextjs-builders"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                rows={3}
                placeholder="Describe the community"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={(e) => setForm((f) => ({ ...f, isPrivate: e.target.checked }))}
                className="h-4 w-4 rounded border border-gray-300"
              />
              Private community
            </label>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                disabled={createLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-60"
              >
                {createLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null}

    </Fragment>
  );
}
