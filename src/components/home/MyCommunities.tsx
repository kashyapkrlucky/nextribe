"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { MessagesSquareIcon } from "lucide-react";
import { useCommunityStore } from "@/store/useCommunityStore";
import ListLoading from "../ui/ListLoading";

const MyCommunities: React.FC = () => {
  const { userCommunities, getUserCommunities } = useCommunityStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    getUserCommunities();
    hasFetched.current = true;
  }, [getUserCommunities]);
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <h3 className="text-sm font-bold mb-4 inline-flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
          <MessagesSquareIcon className="w-3 h-3 text-white" />
        </div>
        My Communities ({userCommunities?.length || "0"})
      </h3>
      <ListLoading isLoading={false} items={userCommunities}>
        {(item) => (
          <div key={item?._id?.toString()}>
            <Link
              href={`/community/${item?.slug}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              {item?.name}
            </Link>
          </div>
        )}
      </ListLoading>
    </div>
  );
};

export default MyCommunities;
