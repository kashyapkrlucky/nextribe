"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowBigUp,
  ArrowBigDown,
  SendHorizonal,
  SearchIcon,
} from "lucide-react";  
import { formatDate } from "@/core/utils/helpers";
import { getUserIdFromToken } from "@/lib/auth-client";
import { Types } from "mongoose";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { useReplyStore } from "@/store/useReplyStore";

export default function DiscussionDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "1";
  const { discussion, fetchDiscussionBySlug } = useDiscussionStore();
  const { replies, totalPages, fetchReplies, submitReply } = useReplyStore();

  // Controls
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<"all" | "answer" | "tip" | "question">("all");
  const [sort, setSort] = useState<"top" | "new">("top");
  const [page, setPage] = useState(1);
  const userId = getUserIdFromToken();
  // Add answer box
  const [answer, setAnswer] = useState("");
  const [answerTag, setAnswerTag] = useState<"answer" | "tip" | "question">(
    "answer"
  );
  const [submitting, setSubmitting] = useState(false);
  const pageSize = 2;


  // Fetch discussion on mount
  useEffect(() => {
    fetchDiscussionBySlug(id);
  }, [id, fetchDiscussionBySlug]);

  // Fetch replies when discussion or page changes
  useEffect(() => {
    if (!discussion?._id) return;
    fetchReplies(discussion?._id.toString(), page, pageSize);
  }, [discussion?._id, page, fetchReplies]);

  async function onViewMore() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    try {
      setSubmitting(true);
      submitReply(discussion?._id?.toString() || "", answer, answerTag);

      if (discussion?._id)
        fetchReplies(discussion?._id.toString(), page, pageSize);
      setAnswer("");
      setAnswerTag("answer");
    } finally {
      setSubmitting(false);
    }
  };

  const onVote = async (type: "up" | "down", replyId: string) => {
    try {
      const response = await fetch(`/api/replies/${replyId}/vote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update vote");
      }

      // const updatedReply = await response.json();

      // Update the UI with the updated reply
      // setReplies(prev =>
      //   prev.map(reply =>
      //     reply._id.toString() === replyId ? updatedReply : reply
      //   )
      // );
    } catch (error) {
      console.error("Vote error:", error);
      // Optionally show an error toast to the user
      // toast.error(error.message || 'Failed to update vote');
    }
  };

  return (
    <Fragment>
      {/* Mid section */}
      <section className="flex flex-col flex-1 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
          <h1 className="text-xl font-semibold mb-1">{discussion?.title}</h1>
          <p className="text-sm text-slate-700">{discussion?.body}</p>
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
          <form onSubmit={submitAnswer} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Add your answer</h3>
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share your knowledge..."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-24 outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="flex justify-end items-center gap-2">
              <select
                value={answerTag}
                onChange={(e) =>
                  setAnswerTag(e.target.value as "answer" | "tip" | "question")
                }
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs capitalize"
              >
                <option value="answer">answer</option>
                <option value="tip">tip</option>
                <option value="question">question</option>
              </select>
              <button
                type="submit"
                disabled={submitting || !answer.trim()}
                className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-xs disabled:opacity-60"
              >
                <SendHorizonal className="w-4 h-4" />{" "}
                {submitting ? "Posting..." : "Post answer"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl">
          {replies?.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              No replies found.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {replies?.map((r) => (
                <li
                  key={r._id.toString()}
                  className="p-4 flex flex-col items-start gap-3 border-b border-gray-200"
                >
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

                  <div className="flex flex-row items-center gap-1">
                    <button
                      className={`p-1.5 rounded-md hover:bg-gray-50 border transition-colors flex flex-row items-center gap-1 ${
                        r.upVotes?.includes(new Types.ObjectId(userId!))
                          ? "text-blue-500 border-blue-200 bg-blue-50"
                          : "border-gray-200 text-gray-500 hover:text-blue-500"
                      }`}
                      aria-label="Upvote"
                      type="button"
                      onClick={() => onVote("up", r._id.toString())}
                    >
                      <ArrowBigUp className="w-5 h-5" />
                      <span className="text-xs font-medium text-slate-700">
                        {r.upVoteCount}
                      </span>
                    </button>
                    <button
                      className={`p-1.5 rounded-md hover:bg-gray-50 border transition-colors flex flex-row items-center gap-1 ${
                        r.downVotes?.includes(new Types.ObjectId(userId!))
                          ? "text-red-500 border-red-200 bg-red-50"
                          : "border-gray-200 text-gray-500 hover:text-red-500"
                      }`}
                      aria-label="Downvote"
                      type="button"
                      onClick={() => onVote("down", r._id.toString())}
                    >
                      <ArrowBigDown className="w-5 h-5" />
                      <span className="text-xs font-medium text-slate-700">
                        {r.downVoteCount}
                      </span>
                    </button>
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
    </Fragment>
  );
}
