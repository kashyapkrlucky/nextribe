"use client";
import { useEffect, useState } from "react";
import ListLoading from "@/components/ui/ListLoading";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import { useDiscussionStore } from "@/store/useDiscussionStore";

export default function Home() {
  const feedTypes = ["recent", "top"];
  const [feedType, setFeedType] = useState("recent");
  const [page] = useState(1);
  const [pageSize] = useState(20);
  const { discussionList, isLoading, fetchDiscussionList } =
    useDiscussionStore();

  useEffect(() => {
    fetchDiscussionList(page, pageSize, feedType);
  }, [page, pageSize, feedType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-2 px-4 flex items-center gap-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
          <span className="text-indigo-600 dark:text-indigo-400 capitalize">
            {feedType}
          </span>{" "}
          Feeds
        </h2>
        <div className="flex items-center gap-2 ml-auto">
          {feedTypes.map((f) => (
            <button
              key={f}
              className={`px-2 py-1 text-xs font-medium rounded-lg capitalize ${
                feedType === f
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 cursor-pointer"
                  : "cursor-pointer"
              }`}
              onClick={() => setFeedType(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <ListLoading isLoading={isLoading} items={discussionList}>
        {(item) => <DiscussionCard item={item} />}
      </ListLoading>
    </>
  );
}
