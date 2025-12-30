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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <h3 className="text-sm font-bold mb-4 inline-flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
          <MessagesSquareIcon className="w-3 h-3 text-white" />
        </div>
        My Communities ({communities?.length || '0'})
      </h3>
      
      {communities?.length > 0 ? (
        <ul className="space-y-2">
          {communities?.map((c: Partial<ICommunity>) => (
            <li key={c?._id?.toString()}>
              <Link
                href={`/community/${c?.slug}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                {c?.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
          No communities joined yet
        </p>
      )}
    </div>
  );
};

export default MyCommunities;
