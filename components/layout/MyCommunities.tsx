'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessagesSquareIcon } from "lucide-react";
import { MyCommunity } from "@/types/api.types";

const MyCommunities: React.FC = () => {
  const [communities, setCommunities] = useState<MyCommunity[]>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      const response = await fetch("/api/user/communities");
      const data = await response.json();
      setCommunities(data ?? []);
    };
    fetchCommunities();
  }, []);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <h3 className="text-sm font-semibold  inline-flex items-center gap-2">
        <MessagesSquareIcon className="w-4 h-4" /> My Communities (
        {communities?.length})
      </h3>
      <ul className="mt-2 space-y-1">
        {communities?.map((c: MyCommunity) => (
          <li key={c?._id}>
            <Link
              href={`/community/${c?._id}`}
              className="text-sm text-slate-700 hover:underline"
            >
              {c?.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyCommunities;
