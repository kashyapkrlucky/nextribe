"use client";

import { useState } from "react";
import { MessageSquare, Heart, Share2 } from "lucide-react";
import { IDiscussion } from "@/core/types/index.types";

interface ProfileTabsProps {
  discussions: IDiscussion[];
}

export default function ProfileTabs({ discussions }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");

  const mockActivity = [
    {
      id: 1,
      type: "discussion",
      action: "created",
      target: "Welcome to our community!",
      timestamp: "2 hours ago",
      icon: MessageSquare,
    },
    {
      id: 2,
      type: "reply",
      action: "replied to",
      target: "Best practices for React development",
      timestamp: "5 hours ago",
      icon: Share2,
    },
    {
      id: 3,
      type: "like",
      action: "liked",
      target: "Understanding TypeScript generics",
      timestamp: "1 day ago",
      icon: Heart,
    },
    {
      id: 4,
      type: "discussion",
      action: "created",
      target: "My journey as a developer",
      timestamp: "2 days ago",
      icon: MessageSquare,
    },
    {
      id: 5,
      type: "reply",
      action: "replied to",
      target: "CSS Grid vs Flexbox",
      timestamp: "3 days ago",
      icon: Share2,
    },
  ];

  return (
    <div className="border-t border-gray-200 dark:border-gray-600 p-4">
      {/* Tab Navigation */}
      <div className="flex space-x-8 mb-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "posts"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2 px-2">
            <MessageSquare className="h-4 w-4" />
            Discussions ({discussions.length})
          </div>
        </button>
        {/* <button
          onClick={() => setActiveTab("activity")}
          className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "activity"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Activity
          </div>
        </button> */}
      </div>

      {/* Tab Content */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {discussions?.length > 0 ? (
            discussions?.map((discussion) => (
              <div
                key={discussion._id.toString()}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                    {discussion?.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(discussion?.createdAt || "")?.toDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {discussion?.body}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="h-3 w-3" />
                    {0}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                    {discussion.community?.name || "general"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No discussions yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Start a discussion to see it here
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="space-y-4">
          {mockActivity.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-full">
                  <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-200">
                    <span className="font-medium">{activity.action}</span>{" "}
                    <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
