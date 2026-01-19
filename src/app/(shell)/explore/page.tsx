"use client";
import { useEffect, useState, useRef } from "react";
import { useCommunityStore } from "@/store/useCommunityStore";
import ListLoading from "@/components/ui/ListLoading";
import Pagination from "@/components/ui/Pagination";
import CommunityFilters from "@/components/community/CommunityFilters";
import CommunityCardMini from "@/components/community/CommunityCardMini";
import PageLoader from "@/components/ui/PageLoader";

export default function CommunityListPage() {
  const [sort, setSort] = useState<"popular" | "new">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const hasFetchedRef = useRef<{ sort?: string; page?: number }>({});

  const { isLoading, communities, totalPages, fetchCommunities } =
    useCommunityStore();

  const onSortChange = (newSort: "popular" | "new") => {
    setSort(newSort);
    setPage(1);
  };

  useEffect(() => {
    // Only fetch if sort or page has changed since last fetch
    if (
      hasFetchedRef.current.sort !== sort ||
      hasFetchedRef.current.page !== page
    ) {
      hasFetchedRef.current = { sort, page };
      const params = new URLSearchParams({
        sort,
        page: String(page),
        pageSize: String(pageSize),
      });
      fetchCommunities(params.toString());
    }
  }, [sort, page]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <CommunityFilters sort={sort} onSortChange={onSortChange} />

      <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
        <ListLoading isLoading={isLoading} items={communities} gap="py-1">
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
    </>
  );
}
