"use client";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  MessageCircleIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Discussion } from "@/types/app.types";
import { PopularCommunities } from "@/components/community/PopularCommunities";
import { TopDiscussions } from "@/components/discussions/TopDiscussions";

export default function Home() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    const getDiscussions = async () => {
      // TODO: Implement discussion fetching
      console.log("Fetching discussions...");
      // Example API call:
      const response = await fetch("/api/discussions");
      const { data } = await response.json();
      setDiscussions(data);
      // For now, just log that we would fetch discussions
    };
    getDiscussions();
  }, []);

  return (
    <Fragment>
      <section className="flex-1">
        {/* multiple dropdown filters */}

        <div className="flex flex-row gap-4 mb-2">
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

        <div className="bg-white rounded-lg shadow-xs p-2 divide-y divide-gray-100">
          {discussions.length > 0 ? (
            <>
              {discussions.map((discussion: Discussion) => (
                // Design a discussion card component
                <div key={discussion._id} className="p-4">
                  <header className="flex flex-row justify-between mb-2">
                    <Link
                      href={`/community/${discussion.community.slug}`}
                      className="text-xs text-blue-700 font-medium flex items-center gap-1"
                    >
                      <MessageCircleIcon className="w-3 h-3" />
                      <span className="ml-1">{discussion.community.name}</span>
                    </Link>
                    <Link
                      href={`/users/${discussion.author._id}`}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <UserIcon className="w-3 h-3 mr-1" />
                      {discussion.author.name}
                    </Link>
                  </header>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <ArrowBigUpIcon className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-medium">0</span>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <ArrowBigDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{discussion.title}</h3>
                      <p className="text-sm text-gray-500">
                        {discussion.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Reply
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Share
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400"></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="text-gray-500 text-center text-xs">
              No discussions available at the moment.
            </p>
          )}
        </div>
      </section>

      <aside className="flex flex-col lg:w-1/5 gap-4">
        <PopularCommunities />
        <TopDiscussions />
      </aside>
    </Fragment>
  );
}
