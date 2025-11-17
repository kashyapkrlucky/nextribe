"use client";
import React, { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PlusIcon, FilterIcon, SearchIcon, TrendingUpIcon, LinkIcon, HomeIcon, CompassIcon, MessageSquareIcon, SettingsIcon } from "lucide-react";

// Mock user
const MOCK_USER = {
  name: "John Doe",
  title: "Community Builder",
  linkedin: "https://www.linkedin.com/in/johndoe",
};

type Community = {
  id: number;
  name: string;
  members: number;
  topics: string[];
  description: string;
};

type Discussion = {
  id: number;
  title: string;
  replies: number;
  tags: string[];
};

// Deterministic helpers
function getCommunityById(idNum: number): Community {
  const name = `Community ${idNum}`;
  const topicsPool = [
    ["tech", "ai"],
    ["design", "ux"],
    ["startup", "funding"],
    ["health", "fitness"],
  ];
  const topics = topicsPool[(idNum - 1) % topicsPool.length];
  const members = 50 + ((idNum * 911) % 5000);
  return {
    id: idNum,
    name,
    members,
    topics,
    description:
      "This is a sample community description. Replace with real community details like purpose, rules, and highlights.",
  };
}

function getDiscussions(seed: number, count = 37): Discussion[] {
  return Array.from({ length: count }).map((_, i) => {
    const id = i + 1;
    const replies = (seed * (i + 7) * 97) % 300;
    const tags = ["general", "help", "show-and-tell", "resources"];
    return {
      id,
      title: `Discussion #${id}: Topic ${(seed + id) % 100}`,
      replies,
      tags: [tags[(seed + i) % tags.length]],
    };
  });
}

const MY_COMMUNITY_IDS = new Set([1, 3, 7, 11, 20]);

export default function CommunityPage() {
  const params = useParams();
  const idStr = (params?.id as string) || "1";
  const id = Math.max(1, parseInt(idStr, 10) || 1);

  // Base mock data
  const community = useMemo(() => getCommunityById(id), [id]);
  const allDiscussions = useMemo(() => getDiscussions(id, 53), [id]);

  // UI state
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | "all">("all");
  const [sort, setSort] = useState<"popular" | "new">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const tags = ["all", "general", "help", "show-and-tell", "resources"] as const;

  const filtered = useMemo(() => {
    let list = [...allDiscussions];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((d) => d.title.toLowerCase().includes(q));
    }
    if (tag !== "all") {
      list = list.filter((d) => d.tags.includes(tag));
    }
    if (sort === "popular") {
      list.sort((a, b) => b.replies - a.replies);
    } else {
      list.sort((a, b) => a.id - b.id);
    }
    return list;
  }, [allDiscussions, query, tag, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Left sidebar data
  const importantLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/community", label: "Explore", icon: CompassIcon },
    { href: "/discussion", label: "Discussions", icon: MessageSquareIcon },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  // Right sidebar data
  const popularItems = filtered.slice(0, 5);
  const topDiscussions = filtered.slice(0, 5);
  const externalLinks = [
    { href: "https://nextjs.org", label: "Next.js Docs" },
    { href: "https://tailwindcss.com", label: "Tailwind CSS" },
    { href: "https://lucide.dev", label: "Lucide Icons" },
  ];

  return ( 
      <Fragment>
        {/* Mid section */}
        <section className="flex flex-col lg:w-3/5 gap-4">
          <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold">{community.name} Discussions</h2>
              <div className="flex items-center gap-2">
                <Link
                  href={`/discussion/new?community=${community.id}`}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-blue-600 text-white text-sm"
                >
                  <PlusIcon className="w-4 h-4" /> Create Discussion
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
                  placeholder="Search discussions"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <select
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value as string);
                  setPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t === "all" ? "All tags" : t}
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
            {pageData.length === 0 ? (
              <div className="p-8 text-center text-slate-600">No discussions found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pageData.map((d) => (
                  <li key={d.id} className="p-4 flex items-center justify-between">
                    <div>
                      <Link href={`/discussion/${d.id}`} className="font-medium hover:underline">
                        {d.title}
                      </Link>
                      <div className="text-xs text-slate-600">
                        {d.replies.toLocaleString('en-US')} replies • {d.tags.join(", ")}
                      </div>
                    </div>
                    <button className="text-xs border border-gray-200 rounded-md px-2 py-1">Reply</button>
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
            <div className="text-sm text-slate-700">{community.description}</div>
            <div className="mt-3 text-xs text-slate-600">
              <div>Members: {community.members.toLocaleString('en-US')}</div>
              <div>Topics: {community.topics.join(", ")}</div>
              <div>ID: {community.id}</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4" /> Popular Discussions
            </h3>
            <ul className="space-y-2">
              {popularItems.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <Link href={`/discussion/${d.id}`} className="text-sm hover:underline">
                    {d.title}
                  </Link>
                  <span className="text-xs text-slate-600">{d.replies.toLocaleString('en-US')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3">
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
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <h3 className="text-sm font-semibold mb-2">Top Discussions</h3>
            <ul className="space-y-2">
              {topDiscussions.map((d) => (
                <li key={d.id} className="text-sm">
                  <Link href={`/discussion/${d.id}`} className="hover:underline">
                    {d.title}
                  </Link>
                  <div className="text-xs text-slate-600">{d.replies.toLocaleString('en-US')} replies</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Fragment> 
  );
}
