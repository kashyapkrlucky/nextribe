"use client";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  SearchIcon,
  TrendingUpIcon,
  ArrowBigUp,
  ArrowBigDown,
  SendHorizonal,
} from "lucide-react";
import { IDiscussion, IReply } from "@/types/index.types";
import { formatDate } from "@/utils/helpers";

export default function DiscussionDetailPage() {
  const params = useParams();
  const [discussion, setDiscussion] = useState<IDiscussion | null>(null);
  const [replies, setReplies] = useState<IReply[]>([]);

  // Add answer box
  const [answer, setAnswer] = useState("");
  const [answerTag, setAnswerTag] = useState<"answer" | "tip" | "question">(
    "answer"
  );
  const [submitting, setSubmitting] = useState(false);

  // Controls
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<"all" | "answer" | "tip" | "question">("all");
  const [sort, setSort] = useState<"top" | "new">("top");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 1;

  const filtered = useMemo(() => {
    let list = replies ? [...replies] : [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.body.toLowerCase().includes(q));
    }
    if (tag !== "all") {
      list = list.filter((r) => r.tag === tag);
    }
    // if (sort === "top") list.sort((a, b) => b.score - a.score);
    // else list.sort((a, b) => b.createdAt?.localeCompare(a.createdAt));
    return list;
  }, [replies, query, tag, sort]);

  // const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const id = (params?.id as string) || "1";

  async function getReplies(
    discussionId: string,
    page = 1,
    limit = 10
  ): Promise<void> {
    try {
      const response = await fetch(
        `/api/discussions/${discussionId}/replies?limit=${limit}&page=${page}`
      );
      const { data, totalPages } = await response.json();
      setReplies((prev) => {
        const newReplies = [...prev];
        console.log(newReplies);

        newReplies.push(...data);
        console.log(newReplies);

        return newReplies;
      });
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function getDiscussion(slug: string): Promise<void> {
    try {
      const response = await fetch(`/api/discussions/slug/${slug}`);
      const data = await response.json();
      setDiscussion(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function onViewMore() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  useEffect(() => {
    getDiscussion(id);
  }, [id]);

  useEffect(() => {
    if (discussion?._id) getReplies(discussion?._id.toString(), page, pageSize);
  }, [page, discussion]);

  // Voting state (client-only)
  const [votes, setVotes] = useState<Record<string, number>>({});
  const applyVote = (replyId: string, delta: 1 | -1) => {
    setVotes((prev) => ({
      ...prev,
      [replyId]: Math.max(-1, Math.min(1, (prev[replyId] ?? 0) + delta)),
    }));
  };
  // const getDisplayScore = (r: Reply) =>
  //   (r.score + (votes[r.id] ?? 0)).toLocaleString("en-US");

  // Right sidebar data
  const topReplies: IReply[] = [];

  const externalLinks = [
    { href: "https://nextjs.org", label: "Next.js Docs" },
    { href: "https://tailwindcss.com", label: "Tailwind CSS" },
    { href: "https://lucide.dev", label: "Lucide Icons" },
  ];

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    try {
      setSubmitting(true);
      await fetch(`/api/discussions/${discussion?._id}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: answer,
          tag: answerTag,
        }),
      });
      if (discussion?._id)
        getReplies(discussion?._id.toString(), page, pageSize);
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
          <h1 className="text-xl font-semibold mb-1">{discussion?.title}</h1>
          <p className="text-sm text-slate-700">{discussion?.body}</p>
        </div>

        <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search replies"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <select
              value={tag}
              onChange={(e) => {
                setTag(e.target.value as "all" | "answer" | "tip" | "question");
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {(["all", "answer", "tip", "question"] as const).map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All tags" : t}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as "top" | "new");
                setPage(1);
              }}
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
                onChange={(e) =>
                  setAnswerTag(e.target.value as "answer" | "tip" | "question")
                }
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
              <SendHorizonal className="w-4 h-4" />{" "}
              {submitting ? "Posting..." : "Post answer"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl">
          {replies?.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              No replies found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {replies?.map((r) => (
                <li
                  key={r._id.toString()}
                  className="p-4 flex items-start gap-3"
                >
                  <div className="flex flex-col items-center gap-1">
                    <button
                      className="p-1 rounded hover:bg-gray-50 border border-gray-200"
                      aria-label="Upvote"
                      type="button"
                    >
                      <ArrowBigUp className="w-5 h-5" />
                    </button>
                    <div className="text-xs font-medium text-slate-700 min-w-6 text-center">
                      {/* {getDisplayScore(r)} */}
                    </div>
                    <button
                      className="p-1 rounded hover:bg-gray-50 border border-gray-200"
                      aria-label="Downvote"
                      type="button"
                    >
                      <ArrowBigDown className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                      <span className="font-medium">{r?.author?.name}</span>
                      <span>•</span>
                      <span>{formatDate(r.createdAt.toString())}</span>
                      <span className="ml-2 inline-flex items-center rounded uppercase font-medium bg-slate-100 px-2 py-0.5">
                        {r.tag}
                      </span>
                    </div>
                    <div className="text-sm text-slate-800 whitespace-pre-wrap">
                      {r.body}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {page < totalPages && (
            <div className="flex justify-center items-center p-2">
              <button
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-60"
                disabled={page >= totalPages}
                onClick={onViewMore}
              >
                View More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Right sidebar */}
      <aside className="flex flex-col lg:w-1/5 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4" /> Top Replies
          </h3>
          <ul className="space-y-2">
            {topReplies.map((r) => (
              <li key={r._id.toString()} className="text-sm">
                <div className="line-clamp-1">{r.body}</div>
                <div className="text-xs text-slate-600">{r.tag}</div>
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
    </Fragment>
  );
}
