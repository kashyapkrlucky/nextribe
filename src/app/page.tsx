"use client";
import { useEffect, useState } from "react";
import ListLoading from "@/components/ui/ListLoading";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { PopularCommunities } from "@/components/community/PopularCommunities";
import { TopDiscussions } from "@/components/discussions/TopDiscussions";
import NavBar from "@/components/layout/NavBar";

export default function Home() {
  const feedTypes = ["top", "recent"];
  const [feedType, setFeedType] = useState("top");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { discussionList, isLoading, fetchDiscussionList } =
    useDiscussionStore();

  useEffect(() => {
    fetchDiscussionList(page, pageSize);
  }, [fetchDiscussionList, page, pageSize]);

  return (
    <>
      <NavBar />
      <main className="flex-1 flex flex-col lg:flex-row gap-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-row gap-4">
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-2 px-4 flex items-center gap-4">
              <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                <span className="text-indigo-600 dark:text-indigo-400 capitalize">{feedType}</span> Feeds
              </h2>
              <div className="flex items-center gap-2 ml-auto">
                {feedTypes.map((f) => (
                  <button
                    key={f}
                    className={`px-2 py-1 text-xs font-medium rounded-lg capitalize ${
                      feedType === f ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 cursor-pointer" : "cursor-pointer"
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
          </div>

          <aside className="lg:w-1/4 gap-6 hidden lg:flex flex-col">
            <PopularCommunities />
            <TopDiscussions />
          </aside>
        </div>
      </main>
    </>
  );
}
