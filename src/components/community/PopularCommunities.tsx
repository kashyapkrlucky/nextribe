'use client'
import { ICommunity } from "@/core/types/index.types";
import { TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function PopularCommunities() {
  const [list, setList] = useState<ICommunity[]>([]);

  useEffect(() => {
   const fetchCommunities = async () => {
      try {
        const response = await fetch("/api/communities/top");
        const { data } = await response.json();
        setList(data || []);
      } catch (error) {
        console.error("Error fetching top communities:", error);
        setList([]);
      }
   };
   fetchCommunities();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <h3 className="text-sm font-bold mb-4 inline-flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
          <TrendingUpIcon className="w-3 h-3 text-white" />
        </div>
        Popular Communities
      </h3>
      {list.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">No communities found</p>
      ) : (
        <ul className="space-y-3">
          {list?.map((c, index) => (
            <li
              key={c._id.toString()}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 flex-1">
                
                <Link
                  href={`/community/${c.slug}`}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate"
                >
                  {c.name}
                </Link>
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                  {c?.memberCount ? c.memberCount.toLocaleString("en-US") : "0"}
                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
