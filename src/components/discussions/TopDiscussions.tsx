"use client";
import { IDiscussion } from "@/core/types/index.types";
import { TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function TopDiscussions() {
  const [list, setList] = useState<IDiscussion[]>([]);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch("/api/discussions/top");
        const { data } = await response.json();
        setList(data || []);
      } catch (error) {
        console.error("Error fetching top discussions:", error);
        setList([]);
      }
    };
    fetchDiscussions();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-bold mb-4 inline-flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
          <TrendingUpIcon className="w-3 h-3 text-white" />
        </div>
        Top Discussions
      </h3>
      {list.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">
          No discussions found
        </p>
      ) : (
        <ul className="space-y-3">
          {list?.map((d: IDiscussion) => (
            <li key={d._id.toString()} className="group">
              <Link 
                href={`/discussion/${d._id}`} 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2"
              >
                {d.title}
              </Link>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {d.replyCount ?? 0} replies
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
