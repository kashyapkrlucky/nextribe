"use client";
import { Fragment, useEffect } from "react";
import { PopularCommunities } from "@/components/community/PopularCommunities";
import { TopDiscussions } from "@/components/discussions/TopDiscussions";
import ListLoading from "@/components/ui/ListLoading";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import { useDiscussionStore } from "@/store/useDiscussionStore";

export default function Home() {
  const { discussions, isLoading, fetchDiscussions } = useDiscussionStore();

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  return (
    <Fragment>
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* multiple dropdown filters */}
        <div className="flex flex-row gap-6 mb-2 bg-white p-2 rounded-lg">
          <select className="p-1 text-xs outline-none">
            <option>Top</option>
            <option>Recent</option>
          </select>

          <select className="p-1 text-xs outline-none">
            <option>India</option>
            <option>Germany</option>
            <option>Canada</option>
            <option>Australia</option>
          </select>
        </div>
        <ListLoading 
          isLoading={isLoading} 
          items={discussions}
        >
          {(item) => <DiscussionCard item={item} />}
        </ListLoading>
      </div>
      <aside className="flex flex-col lg:w-1/4 gap-6">
        <PopularCommunities />
        <TopDiscussions />
      </aside>
    </Fragment>
  );
}
