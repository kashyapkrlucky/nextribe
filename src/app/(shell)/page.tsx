"use client";
import { Fragment, useEffect, useState } from "react";
import { IDiscussion } from "@/core/types/index.types";
import { PopularCommunities } from "@/components/community/PopularCommunities";
import { TopDiscussions } from "@/components/discussions/TopDiscussions";
import ListLoading from "@/components/ui/ListLoading";
import DiscussionCard from "@/components/discussions/DiscussionCard";

export default function Home() {
  const [discussions, setDiscussions] = useState<IDiscussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDiscussions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/discussions");
        if (!response.ok) throw new Error("Failed to fetch discussions");
        const { data } = await response.json();
        setDiscussions(data || []);
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setDiscussions([]);
      } finally {
        setIsLoading(false);
      }
    };

    getDiscussions();
  }, []);

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
        <ListLoading isLoading={isLoading} items={discussions}>
          {(item) => <DiscussionCard item={item} />}
        </ListLoading>
      </div>
      <aside className="flex flex-col lg:w-1/5 gap-6">
        <PopularCommunities />
        <TopDiscussions />
      </aside>
    </Fragment>
  );
}
