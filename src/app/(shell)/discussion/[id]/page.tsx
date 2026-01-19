"use client";
import React, { useEffect, useRef, useState } from "react";
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
import PageLoader from "@/components/ui/PageLoader";
import InlineLoader from "@/components/ui/InlineLoader";
import Image from "next/image";

export default function DiscussionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const hasFetchedRef = useRef<string>("");
  const { isLoading, discussion, fetchDiscussionBySlug, resetDiscussion } = useDiscussionStore();
  const {
    loading,
    replies,
    totalPages,
    fetchReplies,
    submitReply,
    updateVoteOnReply,
    resetReplies,
  } = useReplyStore();

  // Controls
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<"all" | "answer" | "tip" | "question">("all");
  const [sort, setSort] = useState<"top" | "new">("top");
  const [page, setPage] = useState(1);
  const userId = getUserIdFromToken();
  // Add answer box
  const [answer, setAnswer] = useState("");
  const [answerTag, setAnswerTag] = useState<"answer" | "tip" | "question">(
    "answer",
  );
  const [submitting, setSubmitting] = useState(false);
  const pageSize = 20;

  // Fetch discussion on mount
  useEffect(() => {
    if (id && hasFetchedRef.current !== id) {
      hasFetchedRef.current = id;
      fetchDiscussionBySlug(id);
    } 
    return () => {
      resetDiscussion();
    };
  }, [id, fetchDiscussionBySlug, resetDiscussion]);


  // Reset replies when discussion ID changes
  useEffect(() => {
    resetReplies();
    setPage(1);
  }, [id, resetReplies]);

  // Fetch replies when discussion or page changes
  useEffect(() => {
    if (!discussion?.slug) return;
    fetchReplies(discussion?.slug, page, pageSize);
  }, [discussion?.slug, page, fetchReplies, fetchDiscussionBySlug]);

  async function onViewMore() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    try {
      setSubmitting(true);
      if (discussion?.slug) {
        submitReply(discussion.slug, answer, answerTag);
        fetchReplies(discussion.slug, page, pageSize);
      }
      setAnswer("");
      setAnswerTag("answer");
    } finally {
      setSubmitting(false);
    }
  };

  const onVote = async (vote: "up" | "down", replyId: string) => {
    try {
      updateVoteOnReply(replyId, vote);
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-4">
        <h1 className="text-xl font-semibold">{discussion?.title}</h1>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          {discussion?.body}
        </p>
        <form
          onSubmit={submitAnswer}
          className="space-y-2 border border-gray-300 p-2 rounded-md"
        >
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Share your knowledge..."
            className="w-full border-none rounded-lg p-3 text-sm min-h-16 resize-none outline-none"
          />
          <div className="flex justify-end items-center gap-2">
            <select
              value={answerTag}
              onChange={(e) =>
                setAnswerTag(e.target.value as "answer" | "tip" | "question")
              }
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs capitalize dark:border-gray-700"
            >
              <option value="answer">answer</option>
              <option value="tip">tip</option>
              <option value="question">question</option>
            </select>
            <button
              type="submit"
              disabled={submitting || !answer.trim()}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-xs disabled:opacity-60"
            >
              <SendHorizonal className="w-4 h-4" />{" "}
              {submitting ? "Posting..." : "Post answer"}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 absolute left-3 top-5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search replies"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <select
            value={tag}
            onChange={(e) => {
              setTag(e.target.value as "all" | "answer" | "tip" | "question");
              setPage(1);
            }}
            className="inline-flex border border-gray-200 rounded-lg px-3 py-2 text-sm dark:border-gray-700"
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
            className="inline-flex border border-gray-200 rounded-lg px-3 py-2 text-sm dark:border-gray-700"
          >
            <option value="top">Top</option>
            <option value="new">Newest</option>
          </select>
        </div>
        {loading ? (
          <div className="py-2">
            <InlineLoader />
          </div>
        ) : (
          <>
            {replies?.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-600">
                No replies yet.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {replies?.map((r) => (
                  <li
                    key={r._id.toString()}
                    className="p-4 flex flex-col items-start gap-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-200 mb-1">
                        {r?.author?.avatar && (
                          <Image
                            src={r?.author?.avatar}
                            alt={r?.author?.username}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="font-medium">
                          {r?.author?.username}
                        </span>
                        <span>•</span>
                        <span>{formatDate(r.createdAt.toString())}</span>
                        <span className="ml-2 inline-flex items-center rounded uppercase font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5">
                          {r.tag}
                        </span>
                      </div>
                      <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                        {r.body}
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-1">
                      <button
                        className={`p-1.5 rounded-md hover:bg-gray-50 border transition-colors flex flex-row items-center gap-1 ${
                          r.upVotes?.includes(new Types.ObjectId(userId!))
                            ? "text-indigo-500 border-indigo-200 bg-indigo-50"
                            : "border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-500"
                        }`}
                        aria-label="Upvote"
                        type="button"
                        onClick={() => onVote("up", r._id.toString())}
                      >
                        <ArrowBigUp className="w-5 h-5" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                          {r.upVoteCount}
                        </span>
                      </button>
                      <button
                        className={`p-1.5 rounded-md hover:bg-gray-50 border transition-colors flex flex-row items-center gap-1 ${
                          r.downVotes?.includes(new Types.ObjectId(userId!))
                            ? "text-red-500 border-red-200 bg-red-50"
                            : "border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500"
                        }`}
                        aria-label="Downvote"
                        type="button"
                        onClick={() => onVote("down", r._id.toString())}
                      >
                        <ArrowBigDown className="w-5 h-5" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
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
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 disabled:opacity-60"
                  disabled={page >= totalPages}
                  onClick={onViewMore}
                >
                  View More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
