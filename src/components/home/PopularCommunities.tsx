"use client";
import { useCommunityStore } from "@/store/useCommunityStore";
import { Users2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import ListLoading from "../ui/ListLoading";

export function PopularCommunities() {
  const { topCommunities, getTopCommunities } = useCommunityStore();

  useEffect(() => {
    if (!topCommunities || topCommunities.length === 0) {
      getTopCommunities();
    }
  }, [getTopCommunities, topCommunities]);

  const isLoading = !topCommunities || topCommunities.length === 0;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <h3 className="text-sm font-bold mb-4 inline-flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
          <Users2Icon className="w-3 h-3 text-white" />
        </div>
        Popular Communities
      </h3>
      <ListLoading items={topCommunities} isLoading={isLoading} gap="py-1">
        {(item) => (
          <div
            key={item._id.toString()}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 flex-1">
              <Link
                href={`/community/${item.slug}`}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate"
              >
                {item.name}
              </Link>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Users2Icon className="w-3 h-3" />
              <span>
                {item?.memberCount
                  ? item.memberCount.toLocaleString("en-US")
                  : "0"}{" "}
              </span>
            </div>
          </div>
        )}
      </ListLoading>
    </div>
  );
}
