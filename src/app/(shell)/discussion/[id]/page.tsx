"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { useReplyStore } from "@/store/useReplyStore";
import PageLoader from "@/components/ui/PageLoader";
import ReplyCard from "@/components/reply/ReplyCard";
import ListLoading from "@/components/ui/ListLoading";
import ReplyFilters from "@/components/reply/ReplyFilters";
import Button from "@/components/ui/Button";
import CreateReply from "@/components/reply/CreateReply";

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
        <CreateReply
          submitAnswer={submitAnswer}
          answer={answer}
          setAnswer={setAnswer}
          answerTag={answerTag}
          setAnswerTag={setAnswerTag}
          submitting={submitting}
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 p-4">
        <ReplyFilters
          query={query}
          setQuery={setQuery}
          tag={tag}
          setTag={setTag}
          sort={sort}
          setSort={setSort}
          setPage={setPage}
        />

        <ListLoading items={replies} isLoading={loading} gap="py-2">
          {(item) => <ReplyCard key={item._id.toString()} reply={item} />}
        </ListLoading>
        {page < totalPages && (
          <div className="flex justify-center items-center p-2">
            <Button
              variant="ghost"
              disabled={page >= totalPages}
              onClick={onViewMore}
            >
              View More
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
