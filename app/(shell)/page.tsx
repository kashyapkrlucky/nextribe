"use client";
import React, { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import {
  HomeIcon,
  CompassIcon,
  MessageSquareIcon,
  SettingsIcon,
  PlusIcon,
  FilterIcon,
  SearchIcon,
  TrendingUpIcon,
  LinkIcon,
} from "lucide-react";

// Mock data
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
};

const ALL_COMMUNITIES: Community[] = Array.from({ length: 47 }).map((_, i) => ({
  id: i + 1,
  name: `Community ${i + 1}`,
  members: 50 + ((i * 137) % 5000),
  topics: ["tech", "design", "startup", "health"][i % 4] ? [
    ["tech", "ai"],
    ["design", "ux"],
    ["startup", "funding"],
    ["health", "fitness"],
  ][i % 4] : ["general"],
}));


export default function Home() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | "all">("all");
  const [sort, setSort] = useState<"popular" | "new">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let list = [...ALL_COMMUNITIES];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (topic !== "all") {
      list = list.filter((c) => c.topics.includes(topic));
    }
    if (sort === "popular") {
      list.sort((a, b) => b.members - a.members);
    } else {
      list.sort((a, b) => a.id - b.id);
    }
    return list;
  }, [query, topic, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const topics = ["all", "tech", "design", "startup", "health"] as const;


  // Right sidebar data
  const popularItems = filtered.slice(0, 5);
  const topDiscussions = [
    { id: 101, title: "What tools are you using in 2025?", replies: 128 },
    { id: 102, title: "Show your latest side project", replies: 67 },
    { id: 103, title: "Best practices for onboarding", replies: 54 },
  ];
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
              <h2 className="text-xl font-semibold">Discover Communities</h2>
              <div className="flex items-center gap-2">
                <Link
                  href="/community"
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
            {pageData.length === 0 ? (
              <div className="p-8 text-center text-slate-600">No communities found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pageData.map((c) => (
                  <li key={c.id} className="p-4 flex items-center justify-between">
                    <div>
                      <Link
                        href={`/community/${c?.id}`}
                        className="font-medium hover:underline"
                      >
                        {c?.name}
                      </Link>
                      <div className="text-xs text-slate-600">
                        {c.members.toLocaleString('en-US')} members • {c.topics.join(", ")}
                      </div>
                    </div>
                    <button className="text-xs border border-gray-200 rounded-md px-2 py-1">Join</button>
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
                <li key={c.id} className="flex items-center justify-between">
                  <Link href={`/community/${c.id}`} className="text-sm hover:underline">
                    {c.name}
                  </Link>
                  <span className="text-xs text-slate-600">{c.members.toLocaleString('en-US')}</span>
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
                  <div className="text-xs text-slate-600">{d.replies} replies</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      
    </Fragment>
  );
}
