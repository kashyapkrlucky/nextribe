'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessagesSquareIcon } from "lucide-react";
import { ICommunity } from "@/core/types/index.types";

const MyCommunities: React.FC = () => {
  const [communities, setCommunities] = useState<Partial<ICommunity>[]>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      const response = await fetch("/api/user/communities");
      const data = await response.json();
      setCommunities(data ?? []);
    };
    fetchCommunities();
  }, []);
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3">
      <h3 className="text-sm font-semibold  inline-flex items-center gap-2">
        <MessagesSquareIcon className="w-4 h-4" /> My Communities (
        {communities?.length || '0'})
      </h3>
      
      {communities?.length > 0 && <ul className="mt-2 space-y-1">
        {communities?.map((c: Partial<ICommunity>) => (
          <li key={c?._id?.toString()}>
            <Link
              href={`/community/${c?.slug}`}
              className="text-sm text-slate-700 hover:underline dark:text-slate-400"
            >
              {c?.name}
            </Link>
          </li>
        ))}
      </ul>}
    </div>
  );
};

export default MyCommunities;
