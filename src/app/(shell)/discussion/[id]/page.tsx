"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { SendHorizonal, SearchIcon } from "lucide-react";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { useReplyStore } from "@/store/useReplyStore";
import PageLoader from "@/components/ui/PageLoader";
import InlineLoader from "@/components/ui/InlineLoader";
import ReplyCard from "@/components/reply/ReplyCard";
import ListLoading from "@/components/ui/ListLoading";

export default function DiscussionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const hasFetchedRef = useRef<string>("");
  const { isLoading, discussion, fetchDiscussionBySlug, resetDiscussion } =
    useDiscussionStore();
  const {
    loading,
    replies,
    totalPages,
    fetchReplies,
    submitReply,
    resetReplies,
  } = useReplyStore();

  // Controls
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<"all" | "answer" | "tip" | "question">("all");
  const [sort, setSort] = useState<"top" | "new">("top");
  const [page, setPage] = useState(1);
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
          className="space-y-2 border border-gray-300 dark:border-gray-700 p-2 rounded-md"
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
            <ListLoading items={replies} isLoading={loading} gap="py-2">
              {(item) => <ReplyCard key={item._id.toString()} reply={item} />}
            </ListLoading>
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
