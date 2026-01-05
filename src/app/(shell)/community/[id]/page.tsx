"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "next/navigation";
import ListLoading from "@/components/ui/ListLoading";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import Pagination from "@/components/ui/Pagination";
import DiscussionFilters from "@/components/discussions/DiscussionFilters";
import DiscussionCardMini from "@/components/discussions/DiscussionCardMini";
import CommunityInfoCard from "@/components/community/CommunityInfoCard";

export default function CommunityPage() {
  const params = useParams();
  const slug = (params?.id as string) || "";
  const { fetchCommunity } = useCommunityStore();
  const {
    isLoading: discussionsLoading,
    discussionList,
    fetchDiscussionsByCommunity,
  } = useDiscussionStore();

  // UI state
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"popular" | "new">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Track if we've already fetched for this slug
  const hasFetchedRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Only fetch if slug has changed and we haven't fetched this slug yet
    if (slug && hasFetchedRef.current !== slug) {
      fetchCommunity(slug);
      fetchDiscussionsByCommunity(slug);
      hasFetchedRef.current = slug;
    }
  }, [slug, fetchCommunity, fetchDiscussionsByCommunity]);

  const filtered = useMemo(() => {
    let list = [...discussionList];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q)
      );
    }
    if (sort === "popular") {
      list.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    } else {
      list.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
    }
    return list;
  }, [discussionList, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const onQuery = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  const onSortChange = (newSort: "popular" | "new") => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <section className="max-w-7xl mx-auto flex flex-row flex-1 gap-4 py-4">
      <div className="w-3/4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <DiscussionFilters
          query={query}
          onQuery={onQuery}
          sort={sort}
          onSortChange={onSortChange}
        />
        <ListLoading isLoading={discussionsLoading} items={discussionList}>
          {(item) => <DiscussionCardMini item={item} />}
        </ListLoading>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <div className="w-1/4">
        <CommunityInfoCard slug={slug} />
      </div>
    </section>
  );
}
