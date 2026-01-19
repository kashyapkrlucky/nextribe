"use client";
import { MessageCircleIcon, MessageSquareTextIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import ListLoading from "../ui/ListLoading";
import React from "react";

function TopDiscussions() {
  const { topDiscussions, getTopDiscussions } = useDiscussionStore();

  useEffect(() => {
    if (!topDiscussions || topDiscussions.length === 0) {
      getTopDiscussions();
    }
  }, [getTopDiscussions, topDiscussions]);

  const isLoading = !topDiscussions || topDiscussions.length === 0;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <h3 className="text-sm font-bold mb-4 inline-flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
          <MessageSquareTextIcon className="w-3 h-3 text-white" />
        </div>
        Top Discussions
      </h3>

      <ListLoading items={topDiscussions} isLoading={isLoading}>
        {(item) => (
          <div
            key={item._id.toString()}
            className="group flex items-center justify-between gap-2"
          >
            <Link
              href={`/discussion/${item.slug}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2"
            >
              {item.title}
            </Link>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
               <MessageCircleIcon className="w-3 h-3" /> {item.replyCount ?? 0}
            </div>
          </div>
        )}
      </ListLoading>
    </div>
  );
}

export default React.memo(TopDiscussions);
