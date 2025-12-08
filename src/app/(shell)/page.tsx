"use client";
import { Fragment, useEffect } from "react";
import { PopularCommunities } from "@/components/community/PopularCommunities";
import ListLoading from "@/components/ui/ListLoading";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import { useDiscussionStore } from "@/store/useDiscussionStore";

export default function Home() {
  const { discussionList, isLoading, fetchDiscussionList } = useDiscussionStore();

  useEffect(() => {
    fetchDiscussionList();
  }, [fetchDiscussionList]);

  return (
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-row gap-6 mb-2 bg-white p-2 rounded-lg">
          <select className="p-1 text-xs outline-none">
            <option>Top</option>
            <option>Recent</option>
          </select>
        </div>
        <ListLoading 
          isLoading={isLoading} 
          items={discussionList}
        >
          {(item) => <DiscussionCard item={item} />}
        </ListLoading>
      </div>
  );
}
