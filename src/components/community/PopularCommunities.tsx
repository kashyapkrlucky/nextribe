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
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
        <TrendingUpIcon className="w-4 h-4" /> Popular Communities
      </h3>
      {list.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-2">No communities found</p>
      ) : (
        <ul className="space-y-2">
          {list?.map((c) => (
            <li
              key={c._id.toString()}
              className="flex items-center justify-between"
            >
              <Link
                href={`/community/${c.slug}`}
                className="text-sm hover:underline"
              >
                {c.name}
              </Link>
              <span className="text-xs text-slate-600">
                {c?.memberCount ? c.memberCount.toLocaleString("en-US") : "0"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
