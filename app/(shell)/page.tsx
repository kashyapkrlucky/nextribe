"use client";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  MessageCircleIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { IDiscussion } from "@/types/index.types";
import { PopularCommunities } from "@/components/community/PopularCommunities";
import { TopDiscussions } from "@/components/discussions/TopDiscussions";
import { Spinner } from "@/components/ui/Spinner";

export default function Home() {
  const [discussions, setDiscussions] = useState<IDiscussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getDiscussions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/discussions");
        if (!response.ok) throw new Error('Failed to fetch discussions');
        const { data } = await response.json();
        setDiscussions(data || []);
      } catch (error) {
        console.error('Error fetching discussions:', error);
        setDiscussions([]);
      } finally {
        setIsLoading(false);
      }
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

        {isLoading ? (
          <Spinner />
        ) : (
          <div className="bg-white rounded-lg shadow-xs p-2 divide-y divide-gray-100">
            {discussions.length > 0 ? (
              <>
                {discussions.map((discussion: IDiscussion) => (
                // Design a discussion card component
                <div key={discussion._id.toString()} className="p-4">
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
                    <Link href={`/discussion/${discussion.slug}`} className="flex-1">
                      <h3 className="font-medium">{discussion.title}</h3>
                      <p className="text-sm text-gray-500">
                        {discussion.body}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Reply
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Share
                        </button>
                      </div>
                    </Link>
                    <div className="text-xs text-gray-400"></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <MessageCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new discussion.
              </p>
            </div>
          )}
        </div>
        )}
      </section>

      <aside className="flex flex-col lg:w-1/5 gap-4">
        <PopularCommunities />
        <TopDiscussions />
      </aside>
    </Fragment>
  );
}
