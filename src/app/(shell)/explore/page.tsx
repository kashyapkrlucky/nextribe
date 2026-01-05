"use client";
import { useEffect, useState } from "react";
import { useCommunityStore } from "@/store/useCommunityStore";
import ListLoading from "@/components/ui/ListLoading";
import Pagination from "@/components/ui/Pagination";
import CommunityFilters from "@/components/community/CommunityFilters";
import CommunityCardMini from "@/components/community/CommunityCardMini";
import { PopularCommunities } from "@/components/community/PopularCommunities";
import { TopDiscussions } from "@/components/discussions/TopDiscussions";

export default function CommunityListPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | "all">("all");
  const [sort, setSort] = useState<"popular" | "new">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { isLoading, communities, totalPages, fetchCommunities } =
    useCommunityStore();

  const onQuery = (query: string) => {
    setQuery(query);
    setPage(1);
  };
  const onTopicChange = (newTopic: string) => {
    setTopic(newTopic);
    setPage(1);
  };

  const onSortChange = (newSort: "popular" | "new") => {
    setSort(newSort);
    setPage(1);
  };

  useEffect(() => {
    const params = new URLSearchParams({
      q: query,
      sort,
      page: String(page),
      pageSize: String(pageSize),
    });
    fetchCommunities(params.toString());
  }, [query, sort, page, fetchCommunities]);

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-row gap-4 py-6">
      <section className="flex flex-col flex-1 gap-6">
        <CommunityFilters
          sort={sort}
          query={query}
          topic={topic}
          onQuery={onQuery}
          onTopicChange={onTopicChange}
          onSortChange={onSortChange}
        />

        <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <ListLoading isLoading={isLoading} items={communities}>
            {(community) => (
              <CommunityCardMini
                key={community?._id.toString()}
                community={community}
              />
            )}
          </ListLoading>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </section>
      
      <aside className="lg:w-1/4 gap-6 hidden lg:flex flex-col">
        <PopularCommunities />
        <TopDiscussions />
      </aside>
    </div>
  );
}
