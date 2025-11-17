"use client";
import React, { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  HomeIcon,
  CompassIcon,
  MessageSquareIcon,
  SettingsIcon,
  SearchIcon,
  LinkIcon,
  TrendingUpIcon,
  ArrowBigUp,
  ArrowBigDown,
  SendHorizonal,
} from "lucide-react";

// Mock user
const MOCK_USER = {
  name: "John Doe",
  title: "Community Builder",
  linkedin: "https://www.linkedin.com/in/johndoe",
};

const MY_COMMUNITY_IDS = new Set([1, 3, 7, 11, 20]);

type Reply = {
  id: number;
  author: string;
  content: string;
  score: number;
  tag: "answer" | "tip" | "question";
  createdAt: string; // ISO
};

type Discussion = {
  id: number;
  title: string;
  body: string;
  communityId: number;
};

function getDiscussion(idNum: number): Discussion {
  const communityId = ((idNum * 13) % 10) + 1;
  return {
    id: idNum,
    title: `How to approach topic #${idNum}?`,
    body:
      "This is a placeholder discussion body. Replace with the actual discussion content fetched from your API.",
    communityId,
  };
}

function getReplies(seed: number, count = 42): Reply[] {
  const tags: Reply["tag"][] = ["answer", "tip", "question"];
  return Array.from({ length: count }).map((_, i) => {
    const id = i + 1;
    const score = (seed * (i + 5) * 29) % 250; // deterministic
    const day = (i % 28) + 1;
    return {
      id,
      author: `User${(seed + i) % 97}`,
      content: `Reply #${id} focusing on subtopic ${(seed + i) % 100}. This is mock content for demonstration.`,
      score,
      tag: tags[(seed + i) % tags.length],
      createdAt: `2025-01-${String(day).padStart(2, "0")}T12:00:00Z`,
    };
  });
}

export default function DiscussionDetailPage() {
  const params = useParams();
  const idStr = (params?.id as string) || "1";
  const id = Math.max(1, parseInt(idStr, 10) || 1);

  const discussion = useMemo(() => getDiscussion(id), [id]);
  const baseReplies = useMemo(() => getReplies(id, 57), [id]);

  // Controls
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<"all" | "answer" | "tip" | "question">("all");
  const [sort, setSort] = useState<"top" | "new">("top");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let list = [...baseReplies];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.content.toLowerCase().includes(q));
    }
    if (tag !== "all") {
      list = list.filter((r) => r.tag === tag);
    }
    if (sort === "top") list.sort((a, b) => b.score - a.score);
    else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [baseReplies, query, tag, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Voting state (client-only)
  const [votes, setVotes] = useState<Record<number, number>>({});
  const applyVote = (replyId: number, delta: 1 | -1) => {
    setVotes((prev) => ({ ...prev, [replyId]: Math.max(-1, Math.min(1, (prev[replyId] ?? 0) + delta)) }));
  };
  const getDisplayScore = (r: Reply) => (r.score + (votes[r.id] ?? 0)).toLocaleString("en-US");

  // Left sidebar links
  const importantLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/community", label: "Explore", icon: CompassIcon },
    { href: "/discussion", label: "Discussions", icon: MessageSquareIcon },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  // Right sidebar data
  const popularItems = filtered.slice(0, 5);
  const topReplies = [...filtered].sort((a, b) => b.score - a.score).slice(0, 5);
  const externalLinks = [
    { href: "https://nextjs.org", label: "Next.js Docs" },
    { href: "https://tailwindcss.com", label: "Tailwind CSS" },
    { href: "https://lucide.dev", label: "Lucide Icons" },
  ];

  // Add answer box
  const [answer, setAnswer] = useState("");
  const [answerTag, setAnswerTag] = useState<"answer" | "tip" | "question">("answer");
  const [submitting, setSubmitting] = useState(false);
  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    try {
      setSubmitting(true);
      // TODO: Replace with API call
      await new Promise((r) => setTimeout(r, 500));
      // Just reset for demo; real impl would refresh data
      setAnswer("");
      setAnswerTag("answer");
    } finally {
      setSubmitting(false);
    }
  };

  return ( 
      <Fragment>
         

        {/* Mid section */}
        <section className="flex flex-col lg:w-3/5 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h1 className="text-xl font-semibold mb-1">{discussion.title}</h1>
            <p className="text-sm text-slate-700">{discussion.body}</p>
          </div>

          <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search replies"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <select
                value={tag}
                onChange={(e) => { setTag(e.target.value as "all" | "answer" | "tip" | "question"); setPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {(["all", "answer", "tip", "question"] as const).map((t) => (
                  <option key={t} value={t}>{t === "all" ? "All tags" : t}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as "top" | "new"); setPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="top">Top</option>
                <option value="new">Newest</option>
              </select>
            </div>
          </div>

          {/* Add your answer */}
          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <form onSubmit={submitAnswer} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Add your answer</h3>
                <select
                  value={answerTag}
                  onChange={(e) => setAnswerTag(e.target.value as "answer" | "tip" | "question")}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                >
                  <option value="answer">answer</option>
                  <option value="tip">tip</option>
                  <option value="question">question</option>
                </select>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Share your knowledge..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-24 outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="submit"
                disabled={submitting || !answer.trim()}
                className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60"
              >
                <SendHorizonal className="w-4 h-4" /> {submitting ? "Posting..." : "Post answer"}
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl">
            {pageData.length === 0 ? (
              <div className="p-8 text-center text-slate-600">No replies found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pageData.map((r) => (
                  <li key={r.id} className="p-4 flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        className="p-1 rounded hover:bg-gray-50 border border-gray-200"
                        onClick={() => applyVote(r.id, 1)}
                        aria-label="Upvote"
                        type="button"
                      >
                        <ArrowBigUp className="w-5 h-5" />
                      </button>
                      <div className="text-xs font-medium text-slate-700 min-w-6 text-center">
                        {getDisplayScore(r)}
                      </div>
                      <button
                        className="p-1 rounded hover:bg-gray-50 border border-gray-200"
                        onClick={() => applyVote(r.id, -1)}
                        aria-label="Downvote"
                        type="button"
                      >
                        <ArrowBigDown className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                        <span className="font-medium">{r.author}</span>
                        <span>•</span>
                        <span>{new Date(r.createdAt).toLocaleDateString("en-US")}</span>
                        <span className="ml-2 inline-flex items-center rounded bg-slate-100 px-2 py-0.5">{r.tag}</span>
                      </div>
                      <div className="text-sm text-slate-800 whitespace-pre-wrap">{r.content}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between p-3 border-t border-gray-200 text-sm">
              <div>Page {page} of {totalPages}</div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                <button className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
              </div>
            </div>
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="flex flex-col lg:w-1/5 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4" /> Popular Items
            </h3>
            <ul className="space-y-2">
              {popularItems.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <span className="text-sm text-slate-800 line-clamp-1">{r.content}</span>
                  <span className="text-xs text-slate-600">{r.score.toLocaleString("en-US")}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <h3 className="text-sm font-semibold mb-2">Useful Links</h3>
            <ul className="space-y-1">
              {externalLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <h3 className="text-sm font-semibold mb-2">Top Replies</h3>
            <ul className="space-y-2">
              {topReplies.map((r) => (
                <li key={r.id} className="text-sm">
                  <div className="line-clamp-1">{r.content}</div>
                  <div className="text-xs text-slate-600">{r.score.toLocaleString("en-US")} points • {r.tag}</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Fragment> 
  );
}
