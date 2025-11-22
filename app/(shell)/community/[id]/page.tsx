"use client";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SearchIcon, TrendingUpIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import CreateDiscussionForm from "@/components/discussions/CreateDiscussionForm";

type ApiDiscussion = {
  _id: string;
  title: string;
  slug: string;
  body: string;
  author: string;
  community: string;
  commentCount?: number;
  lastActivityAt?: string;
  createdAt?: string;
};

type ApiCommunity = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export default function CommunityPage() {
  const params = useParams();
  const communityId = (params?.id as string) || "";

  const [community, setCommunity] = useState<ApiCommunity | null>(null);
  const [allDiscussions, setAllDiscussions] = useState<ApiDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"popular" | "new">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  function isObjectIdLike(s: string) {
    return /^[a-fA-F0-9]{24}$/.test(s);
  }

  const getDiscussions = async () => {
    try {
      const res = await fetch(`/api/communities/${communityId}/discussions`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) {
        setAllDiscussions(data.discussions || []);
      }
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        // community (by id or slug)
        let cRes: Response;
        if (isObjectIdLike(communityId)) {
          cRes = await fetch(`/api/communities/${communityId}`, {
            cache: "no-store",
          });
        } else {
          cRes = await fetch(
            `/api/communities/slug/${encodeURIComponent(communityId)}`,
            { cache: "no-store" }
          );
        }
        const cJson = await cRes.json();
        if (!cRes.ok)
          throw new Error(cJson?.error || "Failed to load community");

        if (cancelled) return;
        setCommunity(cJson.community as ApiCommunity);
        getDiscussions();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (communityId) load();
    return () => {
      cancelled = true;
    };
  }, [communityId]);

  const filtered = useMemo(() => {
    let list = [...allDiscussions];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q)
      );
    }
    if (sort === "popular") {
      list.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    } else {
      list.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
    }
    return list;
  }, [allDiscussions, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Right sidebar data
  const popularItems = filtered.slice(0, 5);
  // const topDiscussions = filtered.slice(0, 5);
  const externalLinks = [
    { href: "https://nextjs.org", label: "Next.js Docs" },
    { href: "https://tailwindcss.com", label: "Tailwind CSS" },
    { href: "https://lucide.dev", label: "Lucide Icons" },
  ];

  async function onJoin() {
    try {
      const id = community?._id || communityId;
      const res = await fetch(`/api/communities/${id}/join`, {
        method: "POST",
      });
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error || "Failed to join");
      }
      // Optionally refetch members-related data here in future
      alert("Joined community");
    } catch (e) {
      console.error(e);
      alert("Failed to join");
    }
  }

  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);

  return (
    <Fragment>
      {/* Mid section */}
      <section className="flex flex-col lg:w-3/5 gap-4">
        <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">
              {community?.name || "Community"}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCreateDiscussion(true)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-blue-600 text-blue-600 text-sm"
              >
                Start a Discussion
              </Button>
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
                placeholder="Search discussions"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
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
            <div className="p-8 text-center text-slate-600">
              No discussions found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pageData.map((d) => (
                <li
                  key={d._id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <Link
                      href={`/discussion/${d._id}`}
                      className="font-medium hover:underline"
                    >
                      {d.title}
                    </Link>
                    <div className="text-xs text-slate-600">
                      {(d.commentCount || 0).toLocaleString("en-US")} replies
                    </div>
                  </div>
                  <button className="text-xs border border-gray-200 rounded-md px-2 py-1">
                    Reply
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

      {/* Right sidebar */}
      <aside className="flex flex-col lg:w-1/5 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <h3 className="text-sm font-semibold mb-2">About Community</h3>
          <div className="text-sm text-slate-700 mb-6">
            {community?.description || ""}
          </div>

          <button
            onClick={onJoin}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 border border-blue-600 text-blue-600 text-sm"
          >
            Join Community
          </button>
          <div className="mt-3 text-xs text-slate-600">
            {/* <div>Topics: {Array.isArray(community?.topics) ? community!.topics!.length : 0}</div> */}
            {/* <div>ID: {community?._id}</div> */}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4" /> Popular Discussions
          </h3>
          <ul className="space-y-2">
            {popularItems.map((d) => (
              <li key={d._id} className="flex items-center justify-between">
                <Link
                  href={`/discussion/${d._id}`}
                  className="text-sm hover:underline"
                >
                  {d.title}
                </Link>
                <span className="text-xs text-slate-600">
                  {(d.commentCount || 0).toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <h3 className="text-sm font-semibold mb-2">Useful Links</h3>
          <ul className="space-y-1">
            {externalLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {showCreateDiscussion && (
        <CreateDiscussionForm
          setShowCreateDiscussion={setShowCreateDiscussion}
          onClose={() => {
            setShowCreateDiscussion(false);
            getDiscussions();
          }}
          communityId={communityId}
        />
      )}
    </Fragment>
  );
}
