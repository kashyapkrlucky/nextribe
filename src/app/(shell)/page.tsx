"use client";
import { useEffect } from "react";
import ListLoading from "@/components/ui/ListLoading";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { PopularCommunities } from "@/components/community/PopularCommunities";
import { TopDiscussions } from "@/components/discussions/TopDiscussions";

export default function Home() {
  const { discussionList, isLoading, fetchDiscussionList } =
    useDiscussionStore();

  useEffect(() => {
    fetchDiscussionList();
  }, [fetchDiscussionList]);

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-row gap-4">
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-2 px-4 flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Feed
          </h2>
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
              Top
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              Recent
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              Hot
            </button>
          </div>
        </div>
        <ListLoading isLoading={isLoading} items={discussionList}>
          {(item) => <DiscussionCard item={item} />}
        </ListLoading>
      </div>

      <aside className="lg:w-1/4 gap-6 hidden lg:flex flex-col">
        <PopularCommunities />
        <TopDiscussions />
      </aside>
    </div>
  );
}
